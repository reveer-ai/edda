# Design

## Context

See proposal.md for why. Things that shape how this is built, as of 2026-11-17:

- The repository (`reveer-ai/edda`) is public and has no workflows, tags, releases or branch protection. PRs are squash-merged into `main`.
- On npm, `edda-ai` has `0.0.0-stage` and `0.1.0` (`latest`). npm records that `0.1.0` was published from `f66cce5` (EDA-3).
- `package.json`'s `repository.url` is `git+https://github.com/reveer-ai/edda.git`. The package is unscoped and has no dependencies or lockfile. `prepublishOnly` runs `npm test`.
- npm trusted publishing ([docs](https://docs.npmjs.com/trusted-publishers), checked 2026-11-17) works like this:
  - It needs npm 11.5.1 or later, Node 22.14.0 or later, a GitHub-hosted runner, and `id-token: write`.
  - The trusted publisher is matched on owner, repository, workflow filename (`release.yml`, not a path) and optional environment. Every field is case-sensitive, and `repository.url` must match the repository.
  - A publisher created after 2026-09-03 allows only `npm stage publish` unless direct `npm publish` is ticked when it's created.
  - A publisher can't be edited, only deleted and recreated. A new one expires if it doesn't complete a publish within 2 days.
  - With reusable workflows, npm checks the *calling* workflow's filename.
  - Provenance is automatic for a public package published from a public repository.

## Goals / Non-Goals

**Goals:**
- Rerunning a failed run repairs it. Each step checks its own state (is the version on npm? does its GitHub release exist?) rather than assuming earlier steps did or didn't run.
- The workflow can't move `latest` backwards or publish by accident. Anything unexpected fails the run loudly.
- The tests are defined once and used by both PR checks and the release.

**Non-Goals:**
- Manual or dispatched releases. A failed run is rerun from the Actions UI.
- Automating npmjs.com or GitHub settings beyond what the workflows need. Josh owns those settings.

## Decisions

All of these were made by Josh Gillette on 2026-11-17.

### `main` is the release branch

Pushing to `main` (in practice, squash-merging a PR) runs the release workflow. A separate `release` branch would add a second merge step, and it would let `main` drift from what's on npm. A tag-triggered release (`git push --tag v0.2.0`) would make releasing a manual step again.

### Two workflows: `test.yml` and `release.yml`

- **`test.yml`** runs on `pull_request` and on `workflow_call`. It runs `npm test` on Node 18, 20, 22, 24 and 26. 18 is the floor that `engines` and the `cli` spec promise; the rest are every even line since. Node 18 and 20 are past end of life, but dropping them would change the `cli` spec, which is out of scope.
- **`release.yml`** runs on `push` to `main`. It calls `test.yml`, then runs two jobs:
  - **`publish`** (`id-token: write`, `contents: read`) runs in the `npm` environment on Node 24 (Active LTS, and the version npm's own example uses). It asks npm for `edda-ai`'s versions and dist-tags, decides what to do (see the next decision), and runs `npm publish` if it should. Before publishing it checks that `npm --version` is at least 11.5.1. Otherwise a missing feature would show up as a confusing `ENEEDAUTH`.
  - **`github-release`** (`contents: write`) needs `publish`. If the version is on npm and there's no GitHub release `v<version>`, it runs `gh release create v<version> --target <sha> --generate-notes`, which also creates the tag.

  The two jobs are split so that the npm identity token and the repository write token are never in the same job.
- `release.yml` uses `concurrency: release` without cancelling, so two quick merges run one after the other.
- Actions: `actions/checkout@v6` and `actions/setup-node@v6` (with `registry-url: https://registry.npmjs.org` and `package-manager-cache: false`), pinned to major tags because GitHub publishes them.

**Considered:** putting `npm publish` in a reusable workflow. npm checks the calling workflow's filename, so that would invite a mismatch. Keeping `publish` in `release.yml` itself avoids it.

### The release decision lives in a small tested script

`scripts/release-plan.js` takes the local version, npm's published versions and the current `latest`, and returns one of three outcomes:
- **skip:** the version is already on npm. This is the normal result of a merge that doesn't bump the version.
- **publish:** the version is new and greater than `latest`.
- **fail:** the version is new but not greater than `latest`, or it's a prerelease (prereleases are out of scope). `npm publish` would move `latest` to it.

It has no dependencies (only a comparison of `major.minor.patch`) and has unit tests in `test/`, so they run with everything else. `scripts/` isn't in `files`, so the package doesn't change. **Considered:** inline shell in the workflow. It's harder to test, and the guard against moving `latest` backwards is exactly the part worth testing.

### Publish directly, from the `npm` environment, through trusted publishing

- The trusted publisher on npmjs.com: owner `reveer-ai`, repository `edda`, workflow `release.yml`, environment `npm`, with direct `npm publish` allowed. Merging a version bump is meant to release it; staged publishing would make every release wait on a manual approval.
- The GitHub environment `npm` allows deployments only from `main`. Without it, anyone who can push a branch could edit `release.yml` on that branch and publish from it. The environment has to be decided now because the trusted publisher can't be edited later.
- **Considered:** an `NPM_TOKEN` secret, which is a long-lived credential to leak and rotate and comes with no automatic provenance.

### Backfill `v0.1.0`

Tag `f66cce5` as `v0.1.0` and give it a GitHub release, so every version on npm has one and `0.2.0`'s generated notes cover only what changed since. This is a one-time step during implementation, not part of the workflow.

### Recommend protecting `main` afterwards

After the first run, so the test checks exist to select, Josh adds a ruleset on `main` that requires a PR and passing `test.yml` checks. It isn't a prerequisite, because `publish` won't run if the tests fail.

## Risks / Trade-offs

- **The first real publish can only happen on merge.** OIDC can't be dry-run. → Check everything that can be checked first: `npm publish --dry-run`, `release-plan.js`'s tests, and `test.yml` running on the PR itself. If the merge's run fails, `0.2.0` is still unpublished: fix it in a follow-up PR or rerun the run.
- **The trusted publisher expires 2 days after it's created** if nothing publishes. → Josh creates it right before the merge.
- **The `repository.url` form (`git+https://….git`) might not match** what npm expects. → npm normalizes this form, so it should work. If the publish fails on a repository mismatch, change it to `https://github.com/reveer-ai/edda` in a follow-up PR.
- **Node 18 or 20 might fail the tests.** They've never been tested. → If they do, fix the code if that's small. Otherwise stop and ask Josh whether to raise `engines`, which would be a `cli` spec change.
- **Tags are created by the workflow's `GITHUB_TOKEN`**, so they don't trigger other workflows. Nothing here needs them to.
- **Token publishing stays open until Josh closes it.** → After the first automated publish, Josh sets "Require two-factor authentication and disallow tokens" on the package. That doesn't affect trusted publishing.

## Migration Plan

1. In the PR: add the workflows, the script and its tests, bump to `0.2.0`, and add the release convention to the record (`edda/index.md`, which stays uncommitted for now).
2. Before merging, with Josh's approval:
   - Create the `npm` environment, restricted to `main`.
   - Push the `v0.1.0` tag and its release.
   - Josh creates the trusted publisher on npmjs.com.
3. Merge. Then confirm that `0.2.0` is `latest` with provenance, that `npx edda-ai@0.2.0 --version` prints `0.2.0`, and that the `v0.2.0` release exists.
4. Afterwards, Josh disallows token publishing on npm and adds the ruleset on `main`.

To roll back, revert the workflows. A published version can be deprecated but not reused.
