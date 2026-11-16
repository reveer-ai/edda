# Design

## Context

This is a new package in a repository that has only `LICENSE`, `.gitignore` and the OpenSpec setup. The package has to run through `npx` on any machine with Node, with nothing else installed. The specs (`specs/cli`, `specs/init`) define the behavior. This document covers only how it's built.

## Goals / Non-Goals

**Goals:**
- A single, dependency-free command file that is easy to extend when init gains more steps (installing the skill, adding the pointer).
- Tests that run the real command the way a user would.

**Non-Goals:**
- An argument-parsing framework, subcommand plugins, or configuration files.
- Finding the repository root. Init works in the current directory, as the specs say.

## Decisions

- **No dependencies; ES modules on Node 18+.** The CLI only reads and copies one file, which Node's standard library covers. With no dependencies, `npx edda-ai` stays fast and there's nothing to keep updated. *Alternative:* `commander` or `yargs`. Rejected: too much for three flags and one command.
- **The seed is a real file in the package, `seed/README.md`, and init copies it.** Copying it, rather than embedding the text in code, keeps the seed readable and reviewable as Markdown, and lets Edda's own record link to it. `package.json`'s `files` field ships only `bin/` and `seed/`, so Edda's own `edda/` record and the OpenSpec files never go into the package. The directory is called `seed/` because init plants its files once and the project owns them from then on. That sets them apart from the files Edda will install and keep up to date, such as the skill (see "Two kinds of files" in `edda/README.md`). *Alternatives:* `starter/`, which reads like a starter kit, and `template/`, `scaffold/` and `skeleton/`, which all suggest a structure to fill in, which Edda isn't.
- **The copy fails if the file already exists (`COPYFILE_EXCL`).** Init first checks whether `edda/README.md` exists and reports that it's leaving it alone. The exclusive copy also guards the gap between that check and the write, so a record can't be overwritten even by a race.
- **It works in the current directory, not the git root.** That's predictable, works outside git, and matches how `npm init` and `git init` behave. *Alternative:* walk up to the git root. Deferred until there's a need.
- **Tests use `node:test` and run `bin/edda.js` as a child process in a temporary directory.** That tests the behavior users see (output, exit status, files on disk) with no test dependency. `npm test` runs `node --test`.

## Risks / Trade-offs

- [Someone runs init in a subdirectory and gets `edda/` in the wrong place] → The command reports the path it created, so the mistake is visible right away. Finding the git root can come later if it turns out to be a real problem.
- [The principles in `seed/README.md` drift from the skill once the skill exists] → The skill change (Linear issue EDA-4) moves the principles into the skill and makes the seed link to it.
