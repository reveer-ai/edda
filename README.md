# Edda

Edda keeps a project's record: what the project has established, written down in the repository, so any agent or person who starts fresh gets the full picture.

Agents start every session knowing nothing. What a project knows tends to be scattered: in one tool's private memory, old chats, a task tracker, the maintainer's head. Edda gives that knowledge one home inside the repository, which the project owns and any agent can read. The record holds what the code, history and specs can't show: intent, decisions and why they were made, conventions, and hard-won facts.

## Get started

In the root of your repository, run:

```sh
npx edda-ai init
```

This creates `edda/README.md`, your project's record. It explains how to keep the record, and from then on the file is yours. Running `edda init` again never overwrites it.

Edda needs Node 18 or later and has no dependencies.

## Commands

| Command | What it does |
|---|---|
| `edda init` | Creates `edda/README.md` in the current directory, unless one already exists |
| `edda --help` | Shows usage |
| `edda --version` | Shows the installed version |

## Status

This is an early release. `edda init` only creates the record for now. Next comes the Edda agent skill, which teaches agents to keep the record, along with a pointer in your `AGENTS.md` or `CLAUDE.md` so agents find the record when a session starts.

## License

MIT
