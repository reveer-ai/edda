# Principles

This is how Edda thinks a record should be kept, and this record is kept by them. Since 2026-11-16 they no longer ship to projects (see "What Edda gives a project" in [decisions.md](decisions.md)). The pointer block carries their core, and later skills will carry the rest.

- **The repository is the source of truth.** Direction, decisions and conventions live in the record, not in a tool's memory or with one user. If it isn't in the record, the project hasn't established it.
- **Record only what the primary source can't tell.** Code, history and specs speak for themselves. The record holds what no file shows: intent, decisions and why they were made, conventions, and hard-won facts. Repeating what agents can find themselves makes them worse and costs more ([Gloaguen et al., 2026](https://arxiv.org/abs/2602.11988); checked in [facts.md](facts.md)).
- **Each fact lives in one place.** Link to it; don't copy it. Every copy is one more thing that can drift.
- **Write for a reader with no context.** Use absolute dates and full names. Say what was decided and why.
- **Keep it lean.** Every reader pays to read the record, and what they read steers what they do.
- **Evidence wins.** When the record and reality disagree, fix the record.
- **Retire, don't accumulate.** When something is superseded, say so, then remove it.
- **The shape follows the content.** There's no required layout. Reorganize when the current one stops fitting.
- **Agents keep the record; people decide.** Agents write down and maintain what was established. They never invent a decision, and when the evidence doesn't settle something, they ask. (Under question: see "Open questions" in [status.md](status.md).)
- **Keep it up as you go, and tend it regularly.** Record the work as part of finishing it, and check the record against the project from time to time.
