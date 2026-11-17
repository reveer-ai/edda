# Tasks

## 1. Release decision

- [x] 1.1 Add `scripts/release-plan.js`: an exported `releasePlan(version, published, latest)` that returns `skip`, `publish` or `fail` (with a reason) as the design describes, and a command-line entry point that reads `package.json`'s version and the output of `npm view edda-ai versions dist-tags --json`, prints the outcome for the workflow, and exits non-zero on `fail`. Verify that `node scripts/release-plan.js` prints `skip` against npm today (`0.1.0` is published).
- [x] 1.2 Add `test/release-plan.test.js` covering: a version already on npm (`skip`), a new version above `latest` (`publish`, including a major, minor and patch bump, and `0.10.0` above `0.9.0`), a new version equal to or below `latest` (`fail`), and a prerelease (`fail`). Verify that `npm test` passes and that `npm publish --dry-run` still lists only `LICENSE`, `README.md`, `package.json`, `bin/edda.js` and `seed/index.md`.

## 2. Test workflow

- [x] 2.1 Add `.github/workflows/test.yml`, triggered on `pull_request` and `workflow_call`, that runs `npm test` on Node 18, 20, 22, 24 and 26 with `actions/checkout@v6` and `actions/setup-node@v6`, and only `contents: read` permission. Verify that it parses (for example with `npx yaml-lint` or by inspection) and that its jobs pass on the PR's checks. If Node 18 or 20 fails and the fix isn't small, stop and ask Josh before changing `engines`.

## 3. Release workflow

- [x] 3.1 Add `.github/workflows/release.yml`, triggered on `push` to `main`, with `concurrency: release` (no cancelling). It calls `test.yml`, then:
  - `publish` (needs the tests; environment `npm`; `id-token: write`, `contents: read`; Node 24 with `registry-url: https://registry.npmjs.org` and `package-manager-cache: false`) checks that `npm --version` is at least 11.5.1, runs `scripts/release-plan.js`, and runs `npm publish` only on `publish`.
  - `github-release` (needs `publish`; `contents: write`) creates `v<version>` with `gh release create --target <sha> --generate-notes` when the version is on npm and the release doesn't exist yet.

  Verify, by reading it against the design, that the filename is exactly `release.yml`, that `npm publish` runs in `release.yml` itself (not a called workflow), that the npm identity token and the repository write token are never in the same job, and that a rerun after a partial failure repairs rather than repeats.

## 4. Version 0.2.0

- [x] 4.1 Bump `package.json` to `0.2.0`. Verify that `npm test` passes, that `node bin/edda.js --version` prints `0.2.0`, that `node scripts/release-plan.js` prints `publish`, and that `npm publish --dry-run` shows `edda-ai@0.2.0` with the same five files.

## 5. Record

- [x] 5.1 Add the release process to Conventions in `edda/index.md`:
  - `main` is the release branch.
  - A release is a PR that bumps `package.json`'s version; a merge without a bump publishes nothing.
  - Versions must go up; prereleases aren't supported.
  - The trusted publisher on npmjs.com is `reveer-ai`/`edda`/`release.yml`/environment `npm`, can't be edited (only recreated), and must keep matching the workflow's filename.

  Verify that it doesn't repeat the design, and that `edda/index.md` stays uncommitted (the record's 2026-11-17 decision).

## 6. Repository and npm setup

Each of these changes something outside the repository, so each needs Josh's go-ahead first.

- [x] 6.1 Create the GitHub environment `npm` on `reveer-ai/edda`, with deployments allowed only from `main`. Verify with `gh api repos/reveer-ai/edda/environments/npm` and its deployment branch policies.
- [x] 6.2 Tag `f66cce5` as `v0.1.0` and create its GitHub release. Verify that `gh release view v0.1.0` shows it at `f66cce5`, matching npm's `gitHead` for `0.1.0`.
- [x] 6.3 Josh creates the trusted publisher for `edda-ai` on npmjs.com: owner `reveer-ai`, repository `edda`, workflow `release.yml`, environment `npm`, with direct `npm publish` allowed. It expires 2 days after it's created if nothing publishes, so do this no earlier than shortly before the merge. Verify by Josh confirming it.

## 7. Integration

- [x] 7.1 Run `openspec validate automate-npm-release --strict` and verify that it passes.

## Workflow follow-up

- Josh reviews the change, then it's archived in the same PR (`openspec archive automate-npm-release`) before the merge.
- After the merge, check the `release.yml` run, then verify:
  - `npm view edda-ai dist-tags.latest` is `0.2.0`, and its npm page shows provenance;
  - `npx edda-ai@0.2.0 --version` prints `0.2.0`;
  - `gh release view v0.2.0` exists, and its notes cover only what's changed since `v0.1.0`.
- If the run fails, `0.2.0` is still unpublished: fix in a follow-up PR or rerun the run, within the trusted publisher's 2-day window.
- Afterwards, Josh:
  - sets "Require two-factor authentication and disallow tokens" on `edda-ai` on npm;
  - adds a ruleset on `main` that requires a PR and passing `test.yml` checks.
