# Tasks

## 1. Package README

- [x] 1.1 Add `README.md` at the repository root (what Edda is, `npx edda-ai init`, what it creates today, what's coming, and the license), and verify that every command in it runs as written against the local package

## 2. Publish safeguard

- [x] 2.1 Add a `prepublishOnly` script that runs `npm test` to `package.json`, and verify that `npm publish --dry-run` runs the tests and lists exactly `LICENSE`, `README.md`, `package.json`, `bin/edda.js` and `seed/README.md`

## 3. Integration

- [x] 3.1 Run `openspec validate prepare-npm-release --strict` and verify that it passes

## Workflow follow-up

- Archive this change in its own PR, before the merge.
- After the merge, publish 0.1.0 from `main` with `npm publish`. Josh logs in and approves the two-factor prompt. Then verify with `npx edda-ai@latest init` in an empty repository.
