# Ideas for the later skills

Observations from building Edda, not yet planned or decided. Skills are the next form Edda takes (see "Form" in [decisions.md](decisions.md)); Josh named `tend` and `document` as examples.

- **jen's `tend` skill** (`../jen/.agents/skills/tend/SKILL.md`) is a strong model: a pass that changes nothing is a good result; survey everything before editing; never add, change or remove a decision on your own judgment; propose rather than change skills and code. Its issue and PR format is specific to jen.
- **jen's record index** (`../jen/record/README.md`) has a "Read when" column for each file. A good example, but not something Edda should prescribe.
- **The core loop:** a person states a rule mid-conversation ("PR titles start with the tag"), and the agent records it in the project's record, not in its own memory.
- **Look for other primary sources and don't duplicate them.** When a project uses OpenSpec, the record shouldn't repeat what specs and proposals hold; the same goes for ADRs, issue trackers and the like.
- **An inbox.** Before Edda could run on itself, Josh kept a gitignored `buffer/` of dated session notes, each item marked *recorded* where it had already landed, processed into the record later and then deleted. It worked across sessions and might become a feature.
- **End implementation with a handoff for review**, listing first what needs the person's review, and archive at the merge, not at approval. A skill should learn the project's own order of steps instead of assuming one.
- **A project can look like its own product.** Developing Edda with Edda puts `edda/` (the record) beside `seed/` (what other projects get). A skill should expect this kind of thing in its own repository.
- **Write the skill text with the person**, as the pointer block was (see [conventions.md](conventions.md)).
