# Proposal

## Why

`edda init` (0.1.0) gives a project a record, but nothing tells an agent that it's there, so every session has to find it by chance. This change makes init point agents at the record from the files they already load at session start, `AGENTS.md` and `CLAUDE.md`. It's Linear issue EDA-4.

## What Changes

- `edda init` seeds `edda/index.md` instead of `edda/README.md`. The seed is a blank slate: a single Markdown comment saying the record and its index are the agent's to build. Edda doesn't decide what the record or its index looks like.
- `edda init` appends a pointer block to whichever of `AGENTS.md` and `CLAUDE.md` exist, and creates `AGENTS.md` if neither does. The block says what `edda/` is, tells the agent to start by reading `edda/index.md`, and imports it with `@edda/index.md`, so Claude Code loads the index at launch and again after compaction.
- If `CLAUDE.md` imports `AGENTS.md` (a line that's just `@AGENTS.md`), init writes the block only to `AGENTS.md`, since Claude Code gets it through the import. If an earlier run had put a block in `CLAUDE.md`, init removes it.
- The block sits between marker comments. Later runs replace it where it is, so it's never added twice.
- **BREAKING:** `seed/README.md`, and the principles list it carried, no longer ship. Init no longer creates `edda/README.md`.
- Edda's own record (`edda/README.md`) is removed from the repository. Josh Gillette will rebuild it with Edda once this change is merged. Edda runs init on itself, which adds `AGENTS.md`.
- Out of scope:
  - A skill. Skills such as tend and document come later.
  - Migrating a 0.1.0 project's `edda/README.md`. Init never deletes or moves a file the project owns, so such a project ends up with `edda/index.md` beside it. Moving it belongs to a later migration command.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `init`: Init seeds `edda/index.md` instead of `edda/README.md`, adds the pointer block to `AGENTS.md`/`CLAUDE.md` (creating `AGENTS.md` if neither exists, and skipping a `CLAUDE.md` that imports `AGENTS.md`), and stops at the first failing step. The requirement that it changes nothing outside `edda/` now also allows the pointer block.

## Impact

- Code: `bin/edda.js` and the tests in `test/`.
- Package: `seed/README.md` is replaced by `seed/index.md`.
- Docs: the root `README.md` describes what init now sets up. Edda's own record is removed, to be rebuilt with Edda.
- In repositories it's run in, init now edits `AGENTS.md`/`CLAUDE.md`, or creates `AGENTS.md`.
