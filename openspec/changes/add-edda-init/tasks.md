# Tasks

## 1. Package

- [x] 1.1 Add `package.json` for `edda-ai` (an `edda` bin, `files` limited to `bin/` and `starter/`, Node 18 or later, MIT, and a `test` script), and verify that `npm pack --dry-run` lists only `LICENSE`, `package.json`, `bin/edda.js` and `starter/README.md`

## 2. CLI

- [x] 2.1 Implement `bin/edda.js` with help, version and the unknown-command error, and verify it with tests in `test/cli.test.js` covering each scenario in `specs/cli`

## 3. Init

- [x] 3.1 Add the starter record at `starter/README.md` (what the directory is, the principles, and what doesn't belong there), and verify that it renders as plain Markdown and doesn't mention Edda's own decisions
- [x] 3.2 Implement `edda init` and verify it with tests in `test/init.test.js` covering each scenario in `specs/init`

## 4. Edda's own record

- [x] 4.1 Update `edda/README.md` so it doesn't repeat what this change's specs and proposal now hold (the package name and the 0.1.0 scope), and so it links to `starter/README.md` for the principles. Verify by reading it against the principle "Each fact lives in one place"

## 5. Integration

- [x] 5.1 Pack the package, run `npx --package=<tarball> edda init` in an empty git repository, run it a second time, and verify that the record is created once and is still unchanged after the second run
- [x] 5.2 Run `openspec validate add-edda-init --strict` and verify that it passes

## Workflow follow-up

- Archive the change after the PR is approved and merged.
- Publish 0.1.0 to npm (Linear issue EDA-7).
