# Decisions

All of these were made by Josh Gillette, on the date each one gives. Decisions about a single change, and the alternatives weighed, are in that change's OpenSpec design (`openspec/changes/archive/`); this file holds the ones that shape Edda as a whole.

## Form: a pointer block and a minimal CLI, with skills later

Decided 2026-11-16. Edda reaches agents through a pointer block that `edda init` adds to the project's `AGENTS.md`/`CLAUDE.md`, and through a blank `edda/index.md` that the block imports. There's no Edda skill for now. The reason is jen (`../jen`), the reveer project Edda is based on: its agents keep its `record/` well with only an `AGENTS.md` pointer and an index. Skills will come later, for specific work such as tending and documenting the record.

This supersedes the 2026-11-15 decision that Edda ships mainly as a skill that is the spec for its method, along with the plan to install that skill in `.agents/skills/edda/` and link it from `.claude/skills/` only when `.claude/` exists. The answers that depended on the skill went with it: copying the skill where symlinks fail (Windows), and not supporting tools that read skills from neither directory "for now".

There's a CLI for `edda init`, which sets Edda up in a repository. Nothing more goes into the CLI until there's a need for it (2026-11-15). In particular, moving a 0.1.0 `edda/README.md` into `index.md` isn't init's job, because init never deletes or moves a file the project owns; a later `edda update` or migration command could do it (2026-11-16, deferred: "disregard for now").

## What Edda gives a project: a blank index, and no principles

Decided 2026-11-16. The seeded `edda/index.md` holds only a comment saying that the record is the agent's to build. Edda doesn't decide what a project's record or index looks like; that's for the project's agent. The principles stopped shipping for two reasons. A seeded file is never updated, so principles kept in one would go stale in every project. And a principles file would decide part of the record's layout for the project.

## Location: one top-level `edda/` directory

Decided 2026-11-15. A project's record lives entirely in a top-level `edda/` directory, so Edda doesn't scatter files around the repository. Josh had used the name `record/` before; it was dropped because it's more likely to clash with a directory a project already has.

The entry file has been `index.md` since 2026-11-16, when it replaced `README.md` (chosen "for now" on 2026-11-15). It's an index for agents, everything Edda adds gets indexed there so it can grow, and the pointer block imports it. `AGENTS.md` was considered for the entry file and rejected: a nested `AGENTS.md` reads as instructions for that directory, and would only load when an agent works inside `edda/`.

## Two kinds of files: seeded and installed

Decided 2026-11-15. `edda init` handles two kinds of files, and treats them differently:
- **Seeded:** created once if they're missing, then owned by the project and never touched again. The index (`edda/index.md`) is one. They ship in the package's `seed/` directory.
- **Installed:** owned by Edda and replaced on every run, so they stay current. The pointer block is one. Projects shouldn't edit them.

The name `seed/` was chosen over `starter/` (which reads like a starter kit) and over `template/`, `scaffold/` and `skeleton/`, because each of those suggests a structure to fill in, and Edda isn't a template.

## Discovery: a pointer in the project's own `AGENTS.md`/`CLAUDE.md`

Decided 2026-11-15. `edda init` adds a pointer block to whichever of `AGENTS.md` and `CLAUDE.md` the checkout already has. Josh first asked for an always-loaded skill instead of editing those files, since every project has its own `AGENTS.md`; no tool supports that (see [facts.md](facts.md)). Two other ways in were rejected because both work only in Claude Code: a file in `.claude/rules/` (which loads at launch) and a `SessionStart` hook (which needs `.claude/settings.json` or a plugin).

Josh settled the block's wording on 2026-11-16, over several rounds; his taste in that wording is in [conventions.md](conventions.md). The wording is in `bin/edda.js`, and how init places the block is in the archived OpenSpec change `point-agents-at-record`.

## The package: `edda-ai` on npm

Decided 2026-11-15. The name `edda` on npm belongs to an unrelated restlang package, last updated in 2022. The package README is product documentation for people, not part of a record. Releases are automated (see [conventions.md](conventions.md)).

## Edda is developed with Edda

Decided 2026-11-15. Josh wants Edda's development to use Edda. Until Edda could set itself up, the record was kept roughly: first in `edda/README.md` on `main`, then (from EDA-4, PR #6, 2026-11-16) only in Josh's local checkout, plus session notes in a gitignored `buffer/`. On 2026-11-17 Josh decided to keep the record uncommitted until EDA-5 shipped its first release, and then start using Edda here. 0.2.0 was released on 2026-11-17, and Josh ran `edda init` here on 2026-11-20, had the buffers folded into this record, and had it committed (EDA-9).
