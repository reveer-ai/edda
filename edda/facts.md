# Facts

Hard-won facts that no file in the repository shows. Each says where it came from and when; check again before relying on an old one.

## Claude Code

From its docs ([skills](https://code.claude.com/docs/en/skills), [memory](https://code.claude.com/docs/en/memory), [hooks](https://code.claude.com/docs/en/hooks), [subagents](https://code.claude.com/docs/en/sub-agents)), checked 2026-11-15 and 2026-11-16. The ones the pointer block relies on are also in the archived design `point-agents-at-record`.

- It finds project skills only in `.claude/skills/<name>/SKILL.md`. The docs don't mention `.agents/skills/`.
- At session start, only a skill's name and description load; the body loads when the skill is used. Neither the Claude Code docs nor the Agent Skills standard ([agentskills.io](https://agentskills.io)) offers a way to make a skill always load.
- It reads `AGENTS.md` only when there's no `CLAUDE.md`. A "Project instructions" setting (v2.1.277+) can make it read both. `CLAUDE.md` can pull in `AGENTS.md` with `@AGENTS.md`.
- `@path` imports work in `CLAUDE.md`, and in `AGENTS.md` when Claude Code reads it. Paths resolve relative to the importing file, imports nest up to four deep, and they're skipped inside code spans and fences.
- The project-root `CLAUDE.md` is re-read from disk after compaction. A `SessionStart` hook with the matcher `compact` also fires then and can add context.
- Block-level HTML comments are stripped from `CLAUDE.md` before the model sees it. That's why the seed index uses a Markdown comment, `[//]: # (...)`.
- The built-in Explore and Plan subagents start without `CLAUDE.md`. Other subagents get it, unless one sets `omitClaudeMd: true`.
- `.claude/rules/` files without `paths:` load at launch.
- The docs call `CLAUDE.md` "context, not enforced configuration", ask for concrete, verifiable rules, and suggest staying under 200 lines. Nothing official says IMPORTANT or ALL CAPS helps.
- **Verified by running it, 2026-11-16:** headless `claude -p`, with every file tool blocked, quoted `edda/index.md` exactly, both through a `CLAUDE.md` in a scratch repo and through `AGENTS.md` alone in this repo. The `[//]: # (...)` comment survived.
- `claude -p --tools ""` swallows the prompt; pipe the prompt on stdin instead.
- Its permission check blocked `npx -y yaml-lint` (2026-11-17); `ruby -ryaml` parses workflow YAML instead.

## Other agent tools

- **Codex** ([AGENTS.md guide](https://developers.openai.com/codex/guides/agents-md), which now redirects to `learn.chatgpt.com/docs/agent-configuration/agents-md`; checked 2026-11-16): it reads `AGENTS.md` files from the repository root down to the current directory, at most one per directory, up to 32 KiB in total (`project_doc_max_bytes`). The guide doesn't mention imports.
- **Where tools look for skills** (community guides, not official docs, so unverified): Codex, Gemini CLI and Cursor read `.agents/skills/`; Copilot and OpenCode probably do too. Aider has no skills.

## Research on instruction files

Checked 2026-11-16.
- Gloaguen et al. ([arXiv 2602.11988](https://arxiv.org/abs/2602.11988)) says what the principles cite it for. Agents follow context files well, but the files don't raise task success and add about 20% to cost. Repository overviews don't help; the files are useful mainly for non-standard practices.
- McMillan ([arXiv 2605.10039](https://arxiv.org/pdf/2605.10039)) found no detectable effect of file size, position, architecture or contradictions on adherence, and found that compliance drops as a session goes on.

## OpenSpec 2.0.0

- It writes skills only, no `/opsx:*` command files. In Claude Code you run `/openspec-new-change` and so on.
- `--tools claude,agents` puts the real skills in `.agents/skills/` and symlinks them from `.claude/skills/`.
- Homebrew's formula only goes up to 1.17.0 (2026-11-15).
- `skip_specs: true` in a change's `.openspec.yaml` makes a change with no behavior change (docs or tooling).
- `openspec validate --strict` fails if a MODIFIED requirement drops or renames one of its existing scenarios.

## npm

- Right after a publish, the registry shows the version as accepted before it's listed, and lists it before its tarball downloads. A brand-new package briefly shows a `0.0.0-stage` placeholder ("Your package is being processed"); `edda-ai` still lists it. Measured for 0.2.0 (2026-11-17): accepted 12:23:01 UTC, listed 12:24:42, downloadable 12:29:26. Only one measurement; EDA-8's design is built on it.
- Trusted publishing needs npm 11.5.1+ and Node 22.14.0+. A new trusted publisher shows "Pending validation" until its first publish, and expires 2 days after it's created if nothing publishes. Provenance is automatic for a public package from a public repository.
- `npm view <pkg>@<missing version>` exits 1 with E404; to test for a version, check `npm view <pkg> versions --json` with `jq`. `--prefer-online` skips the local cache. `gitHead` records the commit a version was published from.
- The `files` field can include a dot-directory such as `.agents/skills/edda`.

## GitHub

- Force-pushing `main` to history unrelated to an open PR's head closes that PR, and it can't be reopened if the branch was pushed again afterwards. PR #1 was lost this way on 2026-11-15 and replaced by #2.
- A force-push to `main` triggers `release.yml`; that's harmless when the version is already on npm.
- A squash commit rebuilt or reworded locally loses GitHub's "Verified" signature, and its committer becomes the local user. The EDA-1, EDA-2 and EDA-8 commits on `main` were rewritten this way (EDA-8's original was `1d133d0`, which PR #8 still links to).
- Relative file links in a PR description don't resolve; use full `blob/<branch>/…` URLs.
- `gh run rerun <run> --job <job id>` reruns one job and reuses earlier jobs' outputs. `gh release view --json isLatest` isn't a valid field; use `gh release list`.
- A workflow step can be tested locally: extract its `run` script with `ruby -ryaml` and run it with `bash -e` against stub commands on `PATH`.

## Linear

- An issue can't have an empty title.
- `AGENTS.md/CLAUDE.md` in a heading gets auto-linked as a URL; wrap it in backticks.

## Shell (zsh on Josh's Mac)

- zsh doesn't split an unquoted `$VAR` into words; use arrays or functions.
- `$VAR:r…` is read as a filename modifier, so write `${VAR}:refs/…` in git refspecs.
- `git rm` of the only file in a directory removes the directory.
