# Proposal

## Why

Edda needs a way into a repository before the skill exists. The first release (0.1.0) is the npm package `edda-ai` with one command, `edda init`. It gives a project an `edda/` directory and a seed record, so agents have somewhere to keep what the project establishes. The name `edda` on npm belongs to an unrelated package, so the package is `edda-ai` and its command is `edda`.

## What Changes

- Add the `edda-ai` npm package. Its `edda` command has no dependencies and runs with `npx edda-ai <command>`.
- Add `edda init`. It creates `edda/README.md` from a seed file that ships with the package, and it never overwrites a record that already exists.
- Add the seed record (`seed/README.md`). It says what the directory is and carries Edda's principles for keeping a record. These stand in for the skill until it exists.
- Add `edda --help` and `edda --version`. An unknown command gets a usage error.
- Add Edda's own record (`edda/README.md`), so Edda is developed using Edda.
- Out of scope: installing the skill, adding a pointer to `AGENTS.md`/`CLAUDE.md`, and publishing to npm. Publishing is tracked separately in Linear issue EDA-7.

## Capabilities

### New Capabilities

- `cli`: The `edda` command itself: how commands are run, plus help, version and errors for unknown commands.
- `init`: What `edda init` sets up in a repository, and that running it again is safe.

### Modified Capabilities

None.

## Impact

- New files: `package.json`, `bin/edda.js`, `seed/README.md`, tests under `test/`, and `edda/README.md`.
- The package uses only Node's standard library and needs Node 18 or later.
- Nothing changes in the repositories it's run in, except an added `edda/README.md`.
