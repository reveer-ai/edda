# Design

## Context

`bin/edda.js` has one init step, which seeds `edda/README.md` from `seed/README.md`. The package has no dependencies and runs on Node 18 or later. See `proposal.md` for why init now points agents at the record, and `specs/init` for the behavior.

Facts that shaped this, from the Claude Code docs ([memory](https://code.claude.com/docs/en/memory), [hooks](https://code.claude.com/docs/en/hooks)) and the [Codex AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md), checked on 2026-11-16:

- Claude Code expands `@path` imports in `CLAUDE.md`, and in `AGENTS.md` when it reads that file. Paths resolve relative to the importing file. After compaction it re-reads the project-root file from disk, imports included.
- Claude Code strips block-level HTML comments from `CLAUDE.md` before the agent sees it.
- Claude Code reads `AGENTS.md` only when there's no `CLAUDE.md`, unless a setting says otherwise.
- The Codex guide doesn't mention imports, so for Codex the block's instruction to read the index has to do the work.

## Goals / Non-Goals

**Goals:**
- Wherever the agent tool supports it, the index is in context every session, including after compaction, without the agent having to choose to read it.
- Init stays safe to run again: every run leaves the same files as the first.

**Non-Goals:**
- Enforcing the record with hooks. Instructions are advisory, and hooks are tool-specific, which was the reason a `SessionStart` hook was rejected on 2026-11-15.
- Recognizing every form of import. Only a line that's just `@AGENTS.md` counts (see Decisions).

## Decisions

- **The block's text is a constant in `bin/edda.js`.** Josh Gillette settled its wording on 2026-11-16. The constant is the only copy, and the tests read the block from the files init writes rather than repeating it. *Alternative:* a `seed/pointer.md` file. Rejected because the block is installed, not seeded, and keeping it in the code makes that clear.
- **The block imports the index with a bare `@edda/index.md` line.** The import is what guarantees the index loads in Claude Code. The block's own sentence, "Start by reading `edda/index.md`", serves every other tool. *Alternative:* a `SessionStart` hook, rejected on 2026-11-15 because it works only in Claude Code.
- **The seed index is a single Markdown comment, `[//]: # (...)`.** It's invisible when rendered, and it isn't an HTML comment, so Claude Code's comment stripping, if it applies to imported files, doesn't hide it from the agent. The comment text can't contain parentheses. Josh settled its wording on 2026-11-16.
- **The markers are HTML comments, and an end marker pairs with the nearest begin marker before it.** Claude Code strips the markers from `CLAUDE.md`, so they cost the agent nothing. To update, init finds the first `<!-- edda:end -->` line and the last `<!-- edda:begin` line before it, and replaces everything from one to the other. If there's no such pair, init appends the block after a blank line. Pairing this way means a stray begin marker can never swallow the text after it. A `CLAUDE.md` that's a symlink to `AGENTS.md` (or the other way round) needs no special case: the second write finds the block the first one added and leaves it as it is.
- **A `CLAUDE.md` that imports `AGENTS.md` gets no block, and loses any block it already has.** That setup is common (`CLAUDE.md` holding only `@AGENTS.md`), and a second block there would show Claude Code the block and the index twice. Josh decided this on 2026-11-16, including removing an earlier run's block, which init can do safely because its markers show exactly where the block is. The check is cautious on purpose, because its two possible mistakes cost differently. Wrongly deciding that `CLAUDE.md` imports `AGENTS.md` would leave Claude Code with no block at all, since it doesn't read `AGENTS.md` when there's a `CLAUDE.md`. Missing a real import only shows the block twice. So the check counts only a line that, after trimming, is exactly `@AGENTS.md` or `@./AGENTS.md`, outside fenced code blocks, and only when `AGENTS.md` exists. An import in the middle of a sentence, which Claude Code does expand, isn't recognized, and that `CLAUDE.md` gets the block anyway. *Alternative:* searching the whole file for `@AGENTS.md`. Rejected, because it would also match prose and code examples.
- **Steps run in order and stop at the first failure:** index first, then the pointer. With the index first, the existing failure case (`edda` is a file) still changes nothing.
- **Init doesn't touch an existing `edda/README.md`.** It's a seeded file, so it belongs to the project.

## Risks / Trade-offs

- [The index loads into every Claude Code session, so a long index costs context everywhere] → The seed says the index is the agent's to shape, and an index is meant to stay short. That's left to each project's agent.
- [A project edits the block and the next run replaces the edits] → The markers make the block's extent visible, and the block is an installed file, which Edda's record says projects shouldn't edit.
- [A 0.1.0 project ends up with both `edda/README.md` and `edda/index.md`, and nothing points agents at the old file] → Accepted. Edda itself is the only known 0.1.0 user, and this change moves its record by hand. A migration command can handle this later.
