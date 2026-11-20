# Tasks

## 1. Release workflow

- [x] 1.1 In `.github/workflows/release.yml`, give `publish` an `outcome` output from the plan step. In `github-release` (with `timeout-minutes: 25`): when the outcome is `publish`, wait up to 20 minutes for the version's tarball to download, checking every 15 seconds for its `dist.tarball` URL (with `--prefer-online`) and fetching it, and fail if it never downloads; otherwise keep the current behavior. Verify that the workflow parses, and verify the step's script locally against stub `npm`, `curl` and `gh` on `PATH`, using a shortened wait: the version is listed and then downloads after a few checks (the release is created), it's listed but never downloads (the step fails), it's never listed (the step fails), the release already exists (it exits 0), outcome `skip` with the version missing (it exits 0 without waiting), and outcome `skip` with the version on npm and the release missing (the release is created).

## 2. Integration

- [x] 2.1 Run `openspec validate wait-for-npm-before-release --strict` and verify that it passes.

## Workflow follow-up

- Josh reviews the change, then it's archived in the same PR (`openspec archive wait-for-npm-before-release`) before the merge.
- Merging doesn't bump the version, so its `release.yml` run should skip `publish` and leave the releases alone. Check that run.
- The next version bump is the real test: check that its run creates the GitHub release without a rerun.
