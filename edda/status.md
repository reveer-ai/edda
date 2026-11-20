# Status

Where things stand, as of 2026-11-20. Update this as things change; Linear, git and npm are the primary sources for anything they show.

## This record

- Josh ran `edda init` here on 2026-11-20, after removing the old block from `AGENTS.md` for a fresh install, and the block came back identical to `main`'s. The record was committed with EDA-9, so the `@edda/index.md` import in `AGENTS.md` (there since EDA-4, #6) now resolves in every clone.
- Changes to `edda/` alone don't release anything: `files` in `package.json` ships only `bin/` and `seed/`, and the release workflow publishes only when `package.json`'s version is new.

## Releases

- `edda-ai` 0.2.0 is `latest` on npm (published 2026-11-17 by the release workflow, with provenance, `gitHead` `e2ef0ad`). 0.1.0 was published by hand on 2026-11-16 by the npm user `joshtg`.
- GitHub releases `v0.1.0` and `v0.2.0` (Latest) exist. `v0.2.0` needed a rerun of the `github-release` job, which is what EDA-8 fixed.
- **The next version bump is EDA-8's real test:** check that its run creates the GitHub release without a rerun.

## Linear

- Done: EDA-1, EDA-2, EDA-3, EDA-4, EDA-5, EDA-8. EDA-9 (commit this record) is In Progress. EDA-7 is a duplicate of EDA-3. EDA-6 is "TBD", blank and in Backlog, kept to fill in later (Linear won't allow an empty title).
- On 2026-11-16 the original EDA-4 (write the skill), EDA-5 (install the skill) and EDA-6 (add the pointer) were merged into EDA-4, and EDA-5 was later reused for release automation.
- **Stale in Linear** (Josh's to fix or leave): the Edda v1 project's summary and description still describe the skill as the spec and the record as `edda/README.md`, and the milestone "1.0.0: the Edda skill" (holding EDA-4, EDA-5 and EDA-6) describes the dropped skill plan.

## Loose ends

- `stash@{0}` in Josh's checkout ("EDA-4 first attempt", commit `6e48877`) holds the abandoned first attempt at EDA-4: a `SKILL.md` draft with reading, writing, tending and asking sections, init code that installs the skill and links it from `.claude/skills/`, and a test preload that makes `symlinkSync` fail. It may be raw material for the later skills. Keep or drop it: Josh's call.
- The merged PR branches `eda-4-…`, `eda-5-…` and `eda-8-…` are still on GitHub and local. Whether to delete them is Josh's call.
- Josh's own follow-ups on settings, from the EDA-5 design:
  - On npm, set "Require two-factor authentication and disallow tokens" for `edda-ai`. Not confirmed done.
  - On GitHub, add a ruleset on `main` requiring a PR and passing `test.yml` checks (`test / Node 18` through `Node 26`). There's no branch protection or ruleset on `main` (checked 2026-11-20).

## Open questions

Not settled. Ask Josh; don't settle them yourself.

- **The principle "Agents keep the record; people decide"** says agents never decide. Josh pointed out on 2026-11-16 that agents make decisions too, and that those should be recorded. One option an agent floated: record who made each decision and why, so a person can tell an agent's call from their own. How to reword it isn't settled.
- **Where to name who decided.** The record attributes decisions to Josh, and the EDA-5 design does too, but the EDA-8 design doesn't. Which place should say who decided hasn't been confirmed with Josh.
- **Whether `edda init` should find the git root** instead of using the current directory. Deferred on 2026-11-15 until there's a need.
- **A migration command (`edda update`)** for 0.1.0 records in `edda/README.md`. Deferred on 2026-11-16.
