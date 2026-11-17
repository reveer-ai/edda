# Proposal

## Why

`edda-ai` reaches npm only when someone runs `npm publish` by hand. That's how `0.1.0` went out on 2026-11-16, and EDA-4's changes to `edda init` have been on `main` without a release since. Releases should come from the repository instead, so what's merged is what's published and nobody has to remember the steps (Linear issue EDA-5). Nothing checks pull requests either: the tests run only on whoever's machine runs them. The `cli` spec promises the tool works on Node 18 or later, but nothing tests that across versions.

## What Changes

- **A release branch.** Pushing to it publishes. The proposal is `main`: PRs are already squash-merged there, so each merge is one clean unit, and a separate `release` branch would add a second merge step for no gain at this size. The design settles this.
- **A publish workflow** in GitHub Actions that runs on every push to the release branch. It publishes only when `package.json`'s version isn't on npm yet, and otherwise exits without doing anything. npm never lets a version be reused, so the PR that bumps the version is the release, and merges that don't bump it publish nothing.
- **npm trusted publishing (OIDC)** in place of a stored `NPM_TOKEN`. The workflow proves its identity to npm with a short-lived GitHub token, so there's no long-lived secret to leak or rotate, and npm attaches provenance to each release. This needs a one-time manual step: Josh registers the repository and workflow as `edda-ai`'s trusted publisher on npmjs.com.
- **A tag and a GitHub release** (`vX.Y.Z`) for each version the workflow publishes, so every version on npm points back to its commit.
- **A test workflow** on every pull request (and on pushes to the release branch), run on each Node line that `engines` (`>=18`) covers. The design picks the lines. Branch protection that requires it to pass is optional: it's a repository setting Josh changes, and the design decides whether to recommend it.
- **The first automated release is `0.2.0`.** Bumping `package.json` from `0.1.0` ships EDA-4's changes and proves the pipeline works end to end. EDA-4 changed what `edda init` creates, so it's a minor bump, not a patch.
- **The release process goes into the record**, under Conventions in `edda/index.md`: how to cut a release, and what a merge without a version bump does.
- No change to the CLI's behavior, so there are no spec changes (`skip_specs: true`, as in EDA-3's `prepare-npm-release`).

Out of scope:
- Changelog tooling (Changesets, release-please). Release notes come from what GitHub generates or from the PR.
- Prereleases (for example a `next` dist-tag) on every merge.
- Retiring `0.0.0-stage` on npm.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

- New files: `.github/workflows/` gets a test workflow and a publish workflow (the repository has no workflows today), and `scripts/` gets the small script that decides whether to publish, with its tests in `test/`. `scripts/` isn't in `files`, so it doesn't ship.
- `package.json`: version `0.1.0` → `0.2.0`. `prepublishOnly` stays, so the tests also run inside the publish job.
- The published package doesn't change except for its version and provenance.
- Outside the repository: npmjs.com gets a trusted publisher for `edda-ai`, and GitHub gets tags, releases, and possibly branch protection on the release branch. All of these are Josh's to change.
- The repository is public, which npm provenance needs. (EDA-3's proposal described it as private; that's no longer true.)
