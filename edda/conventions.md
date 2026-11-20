# Conventions

How work is done on Edda. Josh Gillette is the maintainer; these are his rules, with the date he set each one.

## Working with Josh

- **Josh decides; the agent proposes.** When Josh says "I'll lead", propose and wait; don't build ahead of him. On 2026-11-16 the first attempt at EDA-4 ran ahead (it wrote a skill, picked its own design and asked to archive), and Josh had it all thrown out and restarted.
- **Hand work to Josh for review before anything else.** When implementation is done, end by listing what needs his review: content you drafted, and any call you made without asking. Don't offer to archive, commit or open a PR until he has reviewed it. Commit and PR come after his approval, often as separate steps ("Looks good", then "Yes, open the PR"). Set on 2026-11-16, after an agent offered "Archive and open PR" before Josh had seen anything.
- **Merge only when Josh explicitly says so, for that PR.** Approval of one PR doesn't carry over to the next (2026-11-15, after merges happened on a looser go-ahead). He may also merge it himself.
- **`main` changes only through merged PRs.** Rewriting `main`'s history is fine only when Josh asks for it ("Please fix with history rewrite", 2026-11-20). Keep the tree exactly as it was, change only what he asked for, and push with `--force-with-lease` pinned to the old SHA. On 2026-11-15, three force-pushes to `main` outside PRs (each approved in chat) prompted this rule.
- **Ask before rerunning or repairing anything outside the repository**, such as a failed release job.
- **Track new work in Linear when it comes up** ("Please open a task to track this work", 2026-11-17), with its own Linear branch and its own OpenSpec change.
- **Lay out options from the user's side.** Josh reasons about how a choice lands for people using Edda. For EDA-8 he rejected waiting only for npm's listing, since the GitHub release would still be ahead of what users can install; the archived design `wait-for-npm-before-release` has the details.
- **Write agent-facing text with Josh, over several rounds**, rather than drafting it in one go. His taste, from settling the pointer block on 2026-11-16:
  - Don't list examples such as "the code, history and specs". Edda can't assume git, code or specs exist, so say "the work itself".
  - Prefer one general, powerful framing to a set of specific rules. He rejected four bullet-point rules as "random and arbitrary".
  - Themes he chose: the record is the project's **memory**, **persistent context** that **outlives every session**; it's **complete**; the test is a fresh agent who **could carry on as if it had been here all along**; and the agent should **take pride** in it.
- **Don't mention Clare** in anything Edda says (2026-11-15). Josh's original pitch said documentation for people was "Clare's job", and he asked for that to be removed.
- **Project knowledge goes in this record, not in a tool's private memory** (2026-11-15).

## Branches, PRs and commits

- Each piece of work gets its own branch and PR, using the branch name Linear gives the issue (for example `eda-1-initialize-the-repository`). Renaming an issue changes that name; rename the local branch to match.
- PR titles start with the Linear issue key: `EDA-1: Initialize the repository with OpenSpec`. Commit messages don't carry the key on a line of their own.
- PRs are squash-merged into `main`, and the squashed commit's subject is the PR title plus its number: `EDA-5: Publish edda-ai to npm automatically from a release (#7)`. For a PR with a single commit, GitHub defaults the subject to that commit's message instead, so pass it explicitly (`gh pr merge <n> --squash --subject "<PR title> (#<n>)"`).
- Auto-fix on PRs isn't wanted for small PRs (declined for #8, 2026-11-20).

## OpenSpec

- Changes are developed with OpenSpec 2.0.0. Its skills live in `.agents/skills/`, linked from `.claude/skills/`. Run it with `npx @fission-ai/openspec@2.0.0`, because Homebrew's `openspec` is older.
- The order is: implement, Josh reviews, open the PR with the change still active, then archive the change (`openspec archive <change>`) in the same PR right before it's merged (Josh, 2026-11-20). That way the change and its archived specs land in one commit on `main`. The archive for EDA-2 was first opened as a separate PR (#4) and was folded back into EDA-2's commit on 2026-11-15.

## Releases

Since EDA-5 (2026-11-17). How they work is in the archived OpenSpec change `automate-npm-release`.
- `main` is the release branch. A release is a PR that bumps `package.json`'s version; merging it publishes that version to npm. A merge without a bump publishes nothing.
- Versions must go up, and prereleases aren't supported. The release workflow fails rather than move `latest` backwards.
- npm's trusted publisher for `edda-ai` (labeled "Release" on npmjs.com) is owner `reveer-ai`, repository `edda`, workflow `release.yml`, environment `npm`. It can't be edited, only deleted and recreated, so renaming the workflow file or the environment breaks publishing until it's recreated. The GitHub environment `npm` allows deployments only from `main`.
- The GitHub release is a tag plus a release page with generated notes, linking an npm version to its commit. Nobody installs from it. Every version on npm has one; `v0.1.0` was backfilled at `f66cce5` on 2026-11-17.
- Publishing by hand needs Josh's npm login and two-factor approval, so an agent can't do it.
