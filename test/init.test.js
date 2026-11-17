import assert from "node:assert/strict";
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, readlinkSync, symlinkSync, writeFileSync } from "node:fs";
import { join, relative } from "node:path";
import { test } from "node:test";
import { edda, seed, tempDir } from "./helpers.js";

const begin = "<!-- edda:begin";
const end = "<!-- edda:end -->";

// Every file, directory and link under root, for before/after comparisons.
function snapshot(root, dir = root, entries = {}) {
  for (const name of readdirSync(dir)) {
    const path = join(dir, name);
    const key = relative(root, path);
    const stat = lstatSync(path);
    if (stat.isSymbolicLink()) {
      entries[key] = `-> ${readlinkSync(path)}`;
    } else if (stat.isDirectory()) {
      entries[`${key}/`] = null;
      snapshot(root, path, entries);
    } else {
      entries[key] = readFileSync(path, "utf8");
    }
  }
  return entries;
}

function setup(files) {
  const cwd = tempDir();
  for (const [path, content] of Object.entries(files)) {
    mkdirSync(join(cwd, path, ".."), { recursive: true });
    writeFileSync(join(cwd, path), content);
  }
  return cwd;
}

const read = (cwd, path) => readFileSync(join(cwd, path), "utf8");
const count = (text, needle) => text.split(needle).length - 1;

// The block exactly as init writes it, taken from a fresh AGENTS.md so the tests don't repeat its text.
const block = read(edda(["init"]).cwd, "AGENTS.md");

// The index

test("creates edda/index.md from the seed in a fresh directory", () => {
  const { status, stdout, cwd } = edda(["init"]);
  assert.equal(status, 0);
  assert.match(stdout, /Created edda\/index\.md/);
  assert.equal(read(cwd, "edda/index.md"), seed);
});

test("adds the index to an existing edda/ directory without touching its other files", () => {
  const cwd = setup({ "edda/notes.md": "kept\n" });
  const { status } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.equal(read(cwd, "edda/index.md"), seed);
  assert.equal(read(cwd, "edda/notes.md"), "kept\n");
});

test("leaves a 0.1.0 edda/README.md alone and adds the index beside it", () => {
  const cwd = setup({ "edda/README.md": "# Old record\n" });
  const { status } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.equal(read(cwd, "edda/index.md"), seed);
  assert.equal(read(cwd, "edda/README.md"), "# Old record\n");
});

test("leaves an existing index unchanged when run again", () => {
  const { cwd } = edda(["init"]);
  writeFileSync(join(cwd, "edda", "index.md"), "# Our index\n");
  const { status, stdout } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.match(stdout, /already exists, so it was left as it is/);
  assert.equal(read(cwd, "edda/index.md"), "# Our index\n");
});

// The pointer block

test("the block names the index and imports it", () => {
  assert.ok(block.startsWith(`${begin} -->\n`));
  assert.ok(block.endsWith(`\n${end}\n`));
  assert.match(block, /Start by reading `edda\/index\.md`/);
  assert.match(block, /^@edda\/index\.md$/m);
});

test("appends the block to both AGENTS.md and CLAUDE.md", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": "# Claude" });
  const { status, stdout } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.match(stdout, /Added a pointer to the record to AGENTS\.md/);
  assert.match(stdout, /Added a pointer to the record to CLAUDE\.md/);
  assert.equal(read(cwd, "AGENTS.md"), `# Agents\n\n${block}`);
  assert.equal(read(cwd, "CLAUDE.md"), `# Claude\n\n${block}`);
});

test("adds the block only to the file that exists", () => {
  const cwd = setup({ "CLAUDE.md": "# Claude\n" });
  edda(["init"], cwd);
  assert.equal(read(cwd, "CLAUDE.md"), `# Claude\n\n${block}`);
  assert.equal(existsSync(join(cwd, "AGENTS.md")), false);
});

test("creates AGENTS.md holding only the block when there's neither file", () => {
  const { status, stdout, cwd } = edda(["init"]);
  assert.equal(status, 0);
  assert.match(stdout, /Created AGENTS\.md with a pointer to the record/);
  assert.equal(read(cwd, "AGENTS.md"), block);
  assert.equal(existsSync(join(cwd, "CLAUDE.md")), false);
});

// A CLAUDE.md that imports AGENTS.md

test("leaves a CLAUDE.md that only imports AGENTS.md unchanged", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": "@AGENTS.md\n" });
  const { status, stdout } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.match(stdout, /CLAUDE\.md imports AGENTS\.md, so it was left as it is/);
  assert.equal(read(cwd, "AGENTS.md"), `# Agents\n\n${block}`);
  assert.equal(read(cwd, "CLAUDE.md"), "@AGENTS.md\n");
});

test("removes an earlier block from CLAUDE.md once it imports AGENTS.md", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": "# Claude\n" });
  edda(["init"], cwd);
  writeFileSync(join(cwd, "CLAUDE.md"), `${read(cwd, "CLAUDE.md")}@./AGENTS.md\n`);
  const { stdout } = edda(["init"], cwd);
  assert.match(stdout, /Removed the pointer from CLAUDE\.md/);
  assert.equal(read(cwd, "CLAUDE.md"), "# Claude\n\n@./AGENTS.md\n");
  assert.equal(count(read(cwd, "AGENTS.md"), begin), 1);
});

test("restores CLAUDE.md exactly when the block it removes was at the end", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": "@AGENTS.md\n" });
  writeFileSync(join(cwd, "CLAUDE.md"), `@AGENTS.md\n\n${block}`);
  edda(["init"], cwd);
  assert.equal(read(cwd, "CLAUDE.md"), "@AGENTS.md\n");
});

test("doesn't count @AGENTS.md in a sentence, a code span or a fenced block as an import", () => {
  for (const claude of [
    "Read @AGENTS.md first.\n",
    "Import it with `@AGENTS.md`.\n",
    "```\n@AGENTS.md\n```\n",
  ]) {
    const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": claude });
    edda(["init"], cwd);
    assert.equal(read(cwd, "CLAUDE.md"), `${claude}\n${block}`, JSON.stringify(claude));
    assert.equal(count(read(cwd, "AGENTS.md"), begin), 1);
  }
});

test("adds the block to a CLAUDE.md that imports a missing AGENTS.md", () => {
  const cwd = setup({ "CLAUDE.md": "@AGENTS.md\n" });
  edda(["init"], cwd);
  assert.equal(read(cwd, "CLAUDE.md"), `@AGENTS.md\n\n${block}`);
  assert.equal(existsSync(join(cwd, "AGENTS.md")), false);
});

// Replacing the block

test("replaces the block where it is when run again", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n" });
  edda(["init"], cwd);
  const stale = block.replace("The project record", "Old heading");
  writeFileSync(join(cwd, "AGENTS.md"), `# Agents\n\n${stale}\n## Added later\n`);
  const { stdout } = edda(["init"], cwd);
  assert.match(stdout, /Updated the pointer to the record in AGENTS\.md/);
  assert.equal(read(cwd, "AGENTS.md"), `# Agents\n\n${block}\n## Added later\n`);
});

test("adds the block once when CLAUDE.md links to AGENTS.md", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n" });
  symlinkSync("AGENTS.md", join(cwd, "CLAUDE.md"));
  const { status } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.equal(read(cwd, "AGENTS.md"), `# Agents\n\n${block}`);
  assert.ok(lstatSync(join(cwd, "CLAUDE.md")).isSymbolicLink());
});

test("pairs the end marker with the nearest begin marker", () => {
  const stray = `${begin} -->\n\nKeep this.\n`;
  const cwd = setup({ "AGENTS.md": stray });
  edda(["init"], cwd);
  edda(["init"], cwd);
  assert.equal(read(cwd, "AGENTS.md"), `${stray}\n${block}`);
});

// Failures and scope

test("fails without changes when edda is a file", () => {
  const cwd = setup({ edda: "not a directory\n", "AGENTS.md": "# Agents\n" });
  const before = snapshot(cwd);
  const { status, stderr } = edda(["init"], cwd);
  assert.notEqual(status, 0);
  assert.match(stderr, /^edda: /);
  assert.deepEqual(snapshot(cwd), before);
});

test("changes nothing but the index and the block", () => {
  const cwd = setup({
    "AGENTS.md": "# Agents\n",
    "src/index.js": "code\n",
    "edda/notes.md": "notes\n",
    ".claude/settings.json": "{}\n",
  });
  const before = snapshot(cwd);
  edda(["init"], cwd);
  assert.deepEqual(snapshot(cwd), {
    ...before,
    "AGENTS.md": `# Agents\n\n${block}`,
    "edda/index.md": seed,
  });
});

test("a second run changes nothing", () => {
  const cwd = setup({ "AGENTS.md": "# Agents\n", "CLAUDE.md": "# Claude\n" });
  edda(["init"], cwd);
  const first = snapshot(cwd);
  const { status } = edda(["init"], cwd);
  assert.equal(status, 0);
  assert.deepEqual(snapshot(cwd), first);
});
