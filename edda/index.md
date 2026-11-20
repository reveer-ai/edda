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

## The record

| File | Holds | Read when |
|---|---|---|
| [conventions.md](conventions.md) | How work is done here: working with Josh, branches and PRs, OpenSpec, releases | Always, before acting |
| [decisions.md](decisions.md) | Josh's decisions about Edda's form and design, with reasons | Before designing anything, or re-opening a question |
| [principles.md](principles.md) | How Edda thinks a record should be kept | Designing what Edda tells agents, or keeping this record |
| [status.md](status.md) | Where things stand: releases, Linear, loose ends, open questions | Starting or finishing work, or asking what's next |
| [facts.md](facts.md) | Hard-won facts about Claude Code, Codex, npm, GitHub, Linear, OpenSpec and the shell | Working with any of those tools, or designing how Edda reaches agents |
| [ideas.md](ideas.md) | Ideas for the later skills, not yet planned or decided | Scoping or writing a skill |

Everything here before 2026-11-20 came from session notes Josh kept in a gitignored `buffer/` while Edda wasn't ready to use on itself. They were folded into this record and deleted on 2026-11-20.
