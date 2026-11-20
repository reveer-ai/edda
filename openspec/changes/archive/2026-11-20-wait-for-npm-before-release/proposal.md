# Proposal

## Why

The first automated release, `0.2.0` on 2026-11-17, was published to npm but got no GitHub release. `github-release` checked npm 7 seconds after `npm publish`, before npm listed the version, and exited successfully. It treats "npm doesn't show this version yet" the same as "nothing was published". npm took about 100 seconds to list `0.2.0`, so every release would hit this, and the run reports success when it fails (Linear issue EDA-8). `v0.2.0` was created by rerunning only `github-release`.

## What Changes

- `publish` reports whether this run published.
- When it did, `github-release` waits until npm serves the version for download before creating the release, so the release only appears once the version can be installed. It fails the run if that doesn't happen in time.
- When it didn't, `github-release` works as it does now: it creates a missing release for a version that's on npm, and otherwise does nothing.
- No change to the CLI's behavior, so there are no spec changes (`skip_specs: true`).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None.

## Impact

- `.github/workflows/release.yml` only. The package, its version and its tests don't change, so merging this publishes nothing.
