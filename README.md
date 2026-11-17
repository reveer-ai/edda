# Edda

Edda keeps a project's record: what the project has established, written down in the repository, so any agent or person who starts fresh gets the full picture.

Agents start every session knowing nothing. What a project knows tends to be scattered: in one tool's private memory, old chats, a task tracker, the maintainer's head. Edda gives that knowledge one home inside the repository, which the project owns and any agent can read. The record holds what the work itself can't show: intent, decisions and why they were made, conventions, and hard-won facts.

## Get started

In the root of your repository, run:

```sh
npx edda-ai init
```

This sets up two things:

- **`edda/index.md`**, the way into your project's record. It starts blank: what the record holds and how it's organized are up to your project's agents. From then on the file is yours, and running `edda init` again never overwrites it.
- **A pointer to the record** at the end of whichever of `AGENTS.md` and `CLAUDE.md` you have, so agents find the record at the start of every session. If you have neither, init creates `AGENTS.md`. The pointer imports the index with `@edda/index.md`, so Claude Code loads it into every session, even after compaction. If your `CLAUDE.md` already imports `AGENTS.md`, the pointer goes only in `AGENTS.md`. The pointer belongs to Edda: init replaces it on every run, between its `<!-- edda:begin -->` and `<!-- edda:end -->` markers, and never adds it twice.

Commit what init sets up, so every agent and person who checks out the repository gets it.

Edda needs Node 18 or later and has no dependencies.

## Commands

| Command | What it does |
|---|---|
| `edda init` | Sets up Edda in the current directory: `edda/index.md` (unless it exists) and the pointer in `AGENTS.md`/`CLAUDE.md` |
| `edda --help` | Shows usage |
| `edda --version` | Shows the installed version |

## Status

This is an early release. Skills that help agents tend and document the record come later.

If you ran 0.1.0, your record is in `edda/README.md`. Init leaves that file alone and adds `edda/index.md` beside it, so move your record into the index yourself.

## License

MIT
