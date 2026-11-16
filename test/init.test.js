import assert from "node:assert/strict";
import { mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { edda, starter, tempDir } from "./helpers.js";

// Every file and directory under root, with file contents, for before/after comparisons.
function snapshot(root, dir = root, entries = {}) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const key = relative(root, path);
    if (statSync(path).isDirectory()) {
      entries[`${key}/`] = null;
      snapshot(root, path, entries);
    } else {
      entries[key] = readFileSync(path, "utf8");
    }
  }
  return entries;
}

test("creates edda/README.md from the starter in a fresh directory", () => {
  const { status, stdout, cwd } = edda(["init"]);
  assert.equal(status, 0);
  assert.match(stdout, /Created edda\/README\.md/);
  assert.equal(readFileSync(join(cwd, "edda", "README.md"), "utf8"), starter);
});

test("adds the record to an existing edda/ directory without touching its other files", () => {
  const cwd = tempDir();
  mkdirSync(join(cwd, "edda"));
  writeFileSync(join(cwd, "edda", "notes.md"), "kept\n");
  const { status } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.equal(readFileSync(join(cwd, "edda", "README.md"), "utf8"), starter);
  assert.equal(readFileSync(join(cwd, "edda", "notes.md"), "utf8"), "kept\n");
});

test("leaves an existing record unchanged when run again", () => {
  const { cwd } = edda(["init"]);
  const record = join(cwd, "edda", "README.md");
  writeFileSync(record, "# Our record\n\nEdited by the project.\n");
  const { status, stdout } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.match(stdout, /already exists, so it was left as it is/);
  assert.equal(readFileSync(record, "utf8"), "# Our record\n\nEdited by the project.\n");
});

test("fails without changes when edda is a file", () => {
  const cwd = tempDir();
  writeFileSync(join(cwd, "edda"), "not a directory\n");
  const { status, stderr } = edda(["init"], cwd);
  assert.notEqual(status, 0);
  assert.match(stderr, /^edda: /);
  assert.equal(readFileSync(join(cwd, "edda"), "utf8"), "not a directory\n");
});

test("changes nothing outside edda/", () => {
  const cwd = tempDir();
  writeFileSync(join(cwd, "AGENTS.md"), "# Agents\n");
  writeFileSync(join(cwd, "CLAUDE.md"), "# Claude\n");
  mkdirSync(join(cwd, ".claude"));
  writeFileSync(join(cwd, ".claude", "settings.json"), "{}\n");
  const before = snapshot(cwd);
  edda(["init"], cwd);
  const after = snapshot(cwd);
  assert.deepEqual(after, { ...before, "edda/": null, "edda/README.md": starter });
});
