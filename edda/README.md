# Edda

Edda keeps a project's record: what the project has established, written down in the repository, so any agent or person who starts fresh gets the full picture.

This is Edda's own record. Edda is built using Edda, so this repository has two things that look alike:
- **`edda/`** (this directory) is Edda's own record: the project's direction and its decisions.
- **`starter/README.md`** is the file `edda init` adds to other projects. Until the skill exists, it also holds Edda's principles. Read them there; they aren't repeated here.

Work is tracked in Linear: the team is "edda" (key EDA), and the project is [Edda v1](https://linear.app/reveer/project/edda-v1-c74dfbbf87b6). What the code does, and the reasons for each change, are in OpenSpec: the specs are in `openspec/specs/`, and each change's proposal and design are in `openspec/changes/`. This record doesn't repeat them.

## Why

Agents start every session knowing nothing. What a project knows tends to be scattered: in one tool's private memory, old chats, a task tracker, the maintainer's head. Each new agent rediscovers it or works without it, and each tool remembers something different. Edda puts that knowledge in one place that the project owns and any agent can read.

## What Edda isn't

- A template. Each project finds its own structure.
- Documentation for people.
- A task tracker, at least for now.

## Decisions

All of these were made by Josh Gillette on 2026-11-15.

### Form: an agent skill, plus a minimal CLI

Edda ships mainly as an agent skill that teaches an agent to keep and tend a project's record. The skill is the spec: its instructions define the method, and there's no separate spec document. Once the skill exists, the principles move into it from `starter/README.md`.

There's a CLI for `edda init`, which sets Edda up in a repository. Nothing more goes into the CLI until there's a need for it.

### Location: one top-level `edda/` directory

A project's record lives entirely in a top-level `edda/` directory, so Edda doesn't scatter files around the repository. Josh had used the name `record/` before; it was dropped because it's more likely to clash with a directory a project already has. The entry file is `README.md` for now.

### Install: the skill goes in `.agents/`, with a link for Claude Code if it's present

`edda init` will install the skill at `.agents/skills/edda/`, the only real copy. If `.claude/` exists, init links `.claude/skills/edda` to that copy, because Claude Code reads skills only from `.claude/skills/`. Init never creates `.claude/`. Running init again picks up a tool that was added later.

### Discovery: a pointer in the project's own `AGENTS.md`/`CLAUDE.md`

`edda init` will add a short pointer to the record to whichever of `AGENTS.md` and `CLAUDE.md` the checkout already has. Skills stay ordinary skills, because no skill can make itself load at session start. Two other ways in were considered and rejected because both are Claude-only: a file in `.claude/rules/` (which loads at launch) and a `SessionStart` hook (which needs `.claude/settings.json` or a plugin).

## Conventions

- Each piece of work gets its own branch and PR, using the branch name Linear gives the issue (for example `eda-1-initialize-the-repository`).
- PR titles start with the Linear issue key: `EDA-1: Initialize the repository with OpenSpec`. Commit messages don't carry the key on a line of their own.
- PRs are squash-merged into `main`.
- Changes are developed with OpenSpec 2.0.0. Its skills live in `.agents/skills/`, linked from `.claude/skills/`. Run it with `npx @fission-ai/openspec@2.0.0`, because Homebrew's `openspec` is older.

## Facts that shape the design

Checked against the Claude Code docs ([skills](https://code.claude.com/docs/en/skills), [memory](https://code.claude.com/docs/en/memory)) on 2026-11-15:

- Claude Code finds project skills only in `.claude/skills/<name>/SKILL.md`. The docs don't mention `.agents/skills/`.
- At session start, only a skill's name and description are loaded. The body loads when the skill is used. Neither the Claude Code docs nor the Agent Skills standard ([agentskills.io](https://agentskills.io)) offers a way to make a skill always load.
- Claude Code reads `AGENTS.md` only when there's no `CLAUDE.md`, unless a setting tells it to read both. `CLAUDE.md` can pull in another file with `@AGENTS.md`.

## Open

The unsettled questions about the skill install and the pointer are on Linear issues [EDA-5](https://linear.app/reveer/issue/EDA-5) and [EDA-6](https://linear.app/reveer/issue/EDA-6). Don't settle them without asking Josh.
