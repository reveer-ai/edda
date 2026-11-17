# Edda

Edda keeps a project's record: what the project has established, written down in the repository, so any agent or person who starts fresh gets the full picture.

This is Edda's own record. Edda is built using Edda, so this repository has two things that look alike:
- **`edda/`** (this directory) is Edda's own record: the project's direction, its decisions and its principles.
- **`seed/index.md`** is the blank index `edda init` adds to other projects.

Work is tracked in Linear: the team is "edda" (key EDA), and the project is [Edda v1](https://linear.app/reveer/project/edda-v1-c74dfbbf87b6). What the code does, and the reasons for each change, are in OpenSpec: the specs are in `openspec/specs/`, and each change's proposal and design are in `openspec/changes/`. This record doesn't repeat them.

## Why

Agents start every session knowing nothing. What a project knows tends to be scattered: in one tool's private memory, old chats, a task tracker, the maintainer's head. Each new agent rediscovers it or works without it, and each tool remembers something different. Edda puts that knowledge in one place that the project owns and any agent can read.

## What Edda isn't

- A template. Each project finds its own structure.
- Documentation for people.
- A task tracker, at least for now.

## Principles

This is how Edda thinks a record should be kept. Since 2026-11-16 these principles no longer ship to projects (see "What Edda gives a project" below). The pointer block carries their core, and later skills will carry the rest.

- **The repository is the source of truth.** Direction, decisions and conventions live in the record, not in a tool's memory or with one user. If it isn't in the record, the project hasn't established it.
- **Record only what the primary source can't tell.** Code, history and specs speak for themselves. The record holds what no file shows: intent, decisions and why they were made, conventions, and hard-won facts. Repeating what agents can find themselves makes them worse and costs more ([Gloaguen et al., 2026](https://arxiv.org/abs/2602.11988)).
- **Each fact lives in one place.** Link to it; don't copy it. Every copy is one more thing that can drift.
- **Write for a reader with no context.** Use absolute dates and full names. Say what was decided and why.
- **Keep it lean.** Every reader pays to read the record, and what they read steers what they do.
- **Evidence wins.** When the record and reality disagree, fix the record.
- **Retire, don't accumulate.** When something is superseded, say so, then remove it.
- **The shape follows the content.** There's no required layout. Reorganize when the current one stops fitting.
- **Agents keep the record; people decide.** Agents write down and maintain what was established. They never invent a decision, and when the evidence doesn't settle something, they ask. (Under question: see "Open".)
- **Keep it up as you go, and tend it regularly.** Record the work as part of finishing it, and check the record against the project from time to time.

## Decisions

All of these were made by Josh Gillette, on the date each one gives.

### Form: a pointer block and a minimal CLI, with skills later

Decided 2026-11-16. Edda reaches agents through a pointer block that `edda init` adds to the project's `AGENTS.md`/`CLAUDE.md`, and through a blank `edda/index.md` that the block imports. There's no Edda skill for now. The reason is jen, the reveer project Edda is based on: its agents keep its record well with only a pointer and an index. Skills will come later, for specific work such as tending and documenting the record.

This supersedes the 2026-11-15 decision that Edda ships mainly as a skill that is the spec for its method, along with the plan to install that skill in `.agents/skills/edda/` and link it from `.claude/skills/`.

There's a CLI for `edda init`, which sets Edda up in a repository. Nothing more goes into the CLI until there's a need for it (2026-11-15).

### What Edda gives a project: a blank index, and no principles

Decided 2026-11-16. The seeded `edda/index.md` holds only a comment saying that the record is the agent's to build. Edda doesn't decide what a project's record or index looks like; that's for the project's agent. The principles stopped shipping for two reasons. A seeded file is never updated, so principles kept in one would go stale in every project. And a principles file would decide part of the record's layout for the project.

### Location: one top-level `edda/` directory

Decided 2026-11-15. A project's record lives entirely in a top-level `edda/` directory, so Edda doesn't scatter files around the repository. Josh had used the name `record/` before; it was dropped because it's more likely to clash with a directory a project already has. The entry file has been `index.md` since 2026-11-16, when it replaced `README.md`. It's an index for agents, and the pointer block imports it.

### Two kinds of files: seeded and installed

Decided 2026-11-15. `edda init` handles two kinds of files, and treats them differently:
- **Seeded:** created once if they're missing, then owned by the project and never touched again. The index (`edda/index.md`) is one. They ship in the package's `seed/` directory.
- **Installed:** owned by Edda and replaced on every run, so they stay current. The pointer block is one. Projects shouldn't edit them.

The name `seed/` was chosen over `starter/` (which reads like a starter kit) and over `template/`, `scaffold/` and `skeleton/`, because each of those suggests a structure to fill in, and Edda isn't a template.

### Discovery: a pointer in the project's own `AGENTS.md`/`CLAUDE.md`

Decided 2026-11-15. `edda init` adds a pointer block to whichever of `AGENTS.md` and `CLAUDE.md` the checkout already has. Two other ways in were considered and rejected because both work only in Claude Code: a file in `.claude/rules/` (which loads at launch) and a `SessionStart` hook (which needs `.claude/settings.json` or a plugin). Josh settled the block's wording on 2026-11-16. The wording is in `bin/edda.js`, and how init places the block is in the OpenSpec change `point-agents-at-record`.

## Conventions

- Each piece of work gets its own branch and PR, using the branch name Linear gives the issue (for example `eda-1-initialize-the-repository`).
- PR titles start with the Linear issue key: `EDA-1: Initialize the repository with OpenSpec`. Commit messages don't carry the key on a line of their own.
- PRs are squash-merged into `main`.
- Changes are developed with OpenSpec 2.0.0. Its skills live in `.agents/skills/`, linked from `.claude/skills/`. Run it with `npx @fission-ai/openspec@2.0.0`, because Homebrew's `openspec` is older.
- Archive an OpenSpec change (`openspec archive <change>`) in the same PR that implements it, after Josh has reviewed it and before asking for the merge. That way the change and its archived specs land in one commit on `main`. The archive for EDA-2 was first opened as a separate PR (#4) and was folded back into EDA-2's commit on 2026-11-15.

## Facts that shape the design

Checked against the Claude Code docs ([skills](https://code.claude.com/docs/en/skills), [memory](https://code.claude.com/docs/en/memory)) on 2026-11-15:

- Claude Code finds project skills only in `.claude/skills/<name>/SKILL.md`. The docs don't mention `.agents/skills/`.
- At session start, only a skill's name and description are loaded. The body loads when the skill is used. Neither the Claude Code docs nor the Agent Skills standard ([agentskills.io](https://agentskills.io)) offers a way to make a skill always load.
- Claude Code reads `AGENTS.md` only when there's no `CLAUDE.md`, unless a setting tells it to read both. `CLAUDE.md` can pull in another file with `@AGENTS.md`.

## Open

- The principle "Agents keep the record; people decide" says agents never decide. Josh pointed out on 2026-11-16 that agents make decisions too, and that those should be recorded. How to reword it isn't settled. Don't settle it without asking Josh.
