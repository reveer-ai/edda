# Tasks

## 1. The seed index

- [x] 1.1 Replace `seed/README.md` with `seed/index.md`, holding only the agreed Markdown comment, and verify that `npm pack --dry-run` lists `seed/index.md` and no `seed/README.md`
- [x] 1.2 Make init seed `edda/index.md` (create if missing, never overwrite), and update `test/init.test.js` and `test/helpers.js` to the modified "Seeds the record" and "Never overwrites an existing record" scenarios, including the 0.1.0 record. Verify with `npm test`

## 2. The pointer block

- [x] 2.1 Add the block (the agreed wording) to `bin/edda.js`, and the step that appends it to `AGENTS.md`/`CLAUDE.md` or creates `AGENTS.md`, and verify with tests for the "Points agents at the record" and "Creates AGENTS.md when there's neither file" scenarios
- [x] 2.2 Replace an existing block in place, pairing each end marker with the nearest begin marker, and verify with tests for every "Replaces the pointer in place" scenario
- [x] 2.3 Skip a `CLAUDE.md` that imports `AGENTS.md` (a line of its own, outside fenced code, with `AGENTS.md` present), removing any block an earlier run put there, and verify with tests for every "Skips a CLAUDE.md that imports AGENTS.md" scenario
- [x] 2.4 Update the failure and "changes nothing else" tests to the modified "Reports failures" and "Changes nothing else" requirements, including running init twice. Verify with `npm test`

## 3. Docs and Edda's own record

- [x] 3.1 Update the root `README.md` (Get started, Commands, Status) to say what init now sets up, and verify each statement against `specs/init`
- [x] 3.2 Move Edda's own record from `edda/README.md` to `edda/index.md` with `git mv`. Keep the principles there as design reasoning, since `seed/README.md` no longer holds them. Record the 2026-11-16 decisions that this change's artifacts don't already hold: no skill for now, and why the principles stopped shipping. Remove what's now settled or out of date, such as the "Open" section and the plan to install a skill. Verify by reading it against "Each fact lives in one place"
- [x] 3.3 Update the `init` spec's Purpose in `openspec/specs/init/spec.md` to say init also points agents at the record, and verify that `openspec show init --type spec` shows it

## 4. Integration

- [x] 4.1 Run `node bin/edda.js init` in this repository, and verify that it creates `AGENTS.md` with the block, leaves `edda/index.md` unchanged, and that a second run changes nothing
- [x] 4.2 Pack the package, run `npx --package=<tarball> edda init` twice in an empty git repository with a `CLAUDE.md`, and verify that `edda/index.md` and exactly one block are there. Then start Claude Code there and verify that `/context` lists `edda/index.md` among the memory files
- [x] 4.3 Run `openspec validate point-agents-at-record --strict` and verify that it passes

## Workflow follow-up

- After Josh has reviewed the change, archive it in the same PR, before asking for the merge.
