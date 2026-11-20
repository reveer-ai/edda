# Design

## Context

See proposal.md for why. The release workflow comes from the archived change `2026-11-17-automate-npm-release`. In its first run ([44082542088](https://github.com/reveer-ai/edda/actions/runs/44082542088)):
- npm accepted `npm publish` at 12:23:01 UTC with "Your package is being processed and may take a few minutes to become available."
- npm's registry listed `0.2.0` as `latest` at 12:24:42, and its tarball was downloadable at 12:29:26.

Between the listing and the tarball, npm tells installers the new version exists but can't serve it, so an install fails or gets the previous version.

## Goals / Non-Goals

**Goals:**
- A run that publishes either creates the GitHub release or fails.
- The GitHub release appears only once the version can be installed, so a reader of the Releases page can rely on it.
- Reruns still repair, as before: rerunning only `github-release` reuses `publish`'s outputs, and rerunning everything turns `publish` into a skip.

**Non-Goals:**
- Guaranteeing that every npm server serves the version. npm serves tarballs from many servers, and the one that answers GitHub's runner may be ahead of others by a little.

## Decisions

### `publish` outputs its plan

`publish` passes the plan's outcome (`publish` or `skip`) to `github-release` as an output. `publish` only succeeds with outcome `publish` if `npm publish` succeeded, so `github-release` knows a version was just published. **Considered:** always waiting for the version to appear. A merge without a version bump would then wait the full timeout whenever the version wasn't on npm, which shouldn't happen but would be slow and confusing.

### Wait up to 20 minutes for the download, then fail

When the outcome is `publish`, `github-release` checks every 15 seconds that npm gives a tarball URL for the version (`npm view <name>@<version> dist.tarball`) and that the URL downloads. It fails the run if that hasn't happened after 20 minutes. The first run's 6.5 minutes is well inside that, and the margin allows for npm being slower than in that one measurement. The job gets `timeout-minutes: 25`. Each `npm view` uses `--prefer-online` so npm's local cache can't hide a newly listed version.

**Considered:**
- **Waiting only for the listing.** It's faster (100 seconds in the first run), but the release would still be a few minutes ahead of the download: it would cost a wait and still be out of sync.
- **Not waiting**, and tagging `$GITHUB_SHA` (the commit `publish` checked out) as soon as `publish` succeeds. It's the simplest and has no timeout, but the release would be ahead of npm every time, and would exist for a version npm failed to process.

## Risks / Trade-offs

- **npm takes longer than 20 minutes.** → The run fails loudly. Once the version downloads, rerunning `github-release` creates the release.
- **This can only be fully checked by the next release.** → Check the script locally against stub `npm` and `curl` that make the version listed and downloadable only after a few calls, and that never make it downloadable.
