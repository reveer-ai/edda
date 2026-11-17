#!/usr/bin/env node
import { constants, copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const { version } = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

const usage = `Usage: edda <command>

Commands:
  init           Set up Edda in the current directory

Options:
  -h, --help     Show this help
  -v, --version  Show the version`;

// The pointer block init keeps in AGENTS.md and CLAUDE.md. It's installed, not seeded:
// every run replaces it with this text.
const pointer = `<!-- edda:begin -->
## The project record: \`edda/\`

\`edda/\` is this project's memory: a complete record of everything it has established that the work itself doesn't show, and the source of truth. It's persistent context that outlives every session, so an agent starting fresh, with only the work and this record, can carry on as if it had been here all along. You keep it that way. Take pride in it: it should hold everything true that matters, and nothing else.

**Start by reading \`edda/index.md\`.** It indexes the record. Read what your task needs before you act, and work from what's recorded.

@edda/index.md
<!-- edda:end -->
`;

// Seeds the record's index. An existing index is never overwritten.
function seedIndex(cwd) {
  const target = join(cwd, "edda", "index.md");
  if (existsSync(target)) {
    console.log("edda/index.md already exists, so it was left as it is.");
    return;
  }
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(packageRoot, "seed", "index.md"), target, constants.COPYFILE_EXCL);
  console.log("Created edda/index.md.");
}

// Finds the pointer block: the first end marker, paired with the nearest begin marker
// before it, so a stray begin marker never swallows the text after it.
function findBlock(lines) {
  const end = lines.findIndex((line) => line.startsWith("<!-- edda:end -->"));
  if (end < 0) return null;
  const begin = lines.slice(0, end).findLastIndex((line) => line.startsWith("<!-- edda:begin"));
  return begin < 0 ? null : { begin, end };
}

// Replaces the block where it is, or appends it after a blank line.
function withPointer(text) {
  const lines = text.split("\n");
  const block = findBlock(lines);
  if (block) {
    const replaced = [...lines.slice(0, block.begin), pointer.trimEnd(), ...lines.slice(block.end + 1)];
    return { text: replaced.join("\n"), replaced: true };
  }
  return { text: text === "" ? pointer : text.replace(/\n*$/, "\n\n") + pointer, replaced: false };
}

// Removes the block, along with the blank line init put before it when appending.
function withoutPointer(text) {
  const lines = text.split("\n");
  const block = findBlock(lines);
  if (!block) return text;
  let { begin } = block;
  const after = lines[block.end + 1];
  if (begin > 0 && lines[begin - 1] === "" && (after === "" || after === undefined)) begin -= 1;
  return [...lines.slice(0, begin), ...lines.slice(block.end + 1)].join("\n");
}

// True when CLAUDE.md imports AGENTS.md with a line of its own, outside fenced code.
// Only a clear import counts: a false match would leave Claude Code without the pointer.
function importsAgents(text) {
  let fenced = false;
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (trimmed.startsWith("```") || trimmed.startsWith("~~~")) fenced = !fenced;
    else if (!fenced && (trimmed === "@AGENTS.md" || trimmed === "@./AGENTS.md")) return true;
  }
  return false;
}

function samePath(a, b) {
  return realpathSync(a) === realpathSync(b);
}

function writePointer(cwd, name) {
  const path = join(cwd, name);
  const before = readFileSync(path, "utf8");
  const { text: after, replaced } = withPointer(before);
  if (after === before) {
    console.log(`The pointer to the record in ${name} is up to date.`);
    return;
  }
  writeFileSync(path, after);
  console.log(replaced ? `Updated the pointer to the record in ${name}.` : `Added a pointer to the record to ${name}.`);
}

// Points agents at the record from AGENTS.md and CLAUDE.md. A CLAUDE.md that imports
// AGENTS.md gets the pointer through the import, so it keeps no block of its own.
function addPointer(cwd) {
  const agents = join(cwd, "AGENTS.md");
  const claude = join(cwd, "CLAUDE.md");
  const hasAgents = existsSync(agents);
  const hasClaude = existsSync(claude);
  if (!hasAgents && !hasClaude) {
    writeFileSync(agents, pointer, { flag: "wx" });
    console.log("Created AGENTS.md with a pointer to the record.");
    return;
  }
  if (hasAgents) writePointer(cwd, "AGENTS.md");
  if (!hasClaude || (hasAgents && samePath(agents, claude))) return;
  const text = readFileSync(claude, "utf8");
  if (hasAgents && importsAgents(text)) {
    const without = withoutPointer(text);
    if (without === text) {
      console.log("CLAUDE.md imports AGENTS.md, so it was left as it is.");
    } else {
      writeFileSync(claude, without);
      console.log("Removed the pointer from CLAUDE.md, which now gets it from AGENTS.md.");
    }
    return;
  }
  writePointer(cwd, "CLAUDE.md");
}

// Each step is safe to run again. The index goes first, so if it fails nothing else changes.
function init(cwd) {
  seedIndex(cwd);
  addPointer(cwd);
}

const [command] = process.argv.slice(2);

try {
  switch (command) {
    case "init":
      init(process.cwd());
      break;
    case "-v":
    case "--version":
      console.log(version);
      break;
    case undefined:
    case "-h":
    case "--help":
      console.log(usage);
      break;
    default:
      console.error(`Unknown command: ${command}\n\n${usage}`);
      process.exitCode = 1;
  }
} catch (error) {
  console.error(`edda: ${error.message}`);
  process.exitCode = 1;
}
