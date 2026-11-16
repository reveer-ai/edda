#!/usr/bin/env node
import { constants, copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
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

// Adds the starter record. An existing record is never overwritten,
// so running init again is always safe.
function init(cwd) {
  const target = join(cwd, "edda", "README.md");
  if (existsSync(target)) {
    console.log("edda/README.md already exists, so it was left as it is.");
    return;
  }
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(join(packageRoot, "starter", "README.md"), target, constants.COPYFILE_EXCL);
  console.log("Created edda/README.md.");
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
