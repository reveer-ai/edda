import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
export const starter = readFileSync(join(packageRoot, "starter", "README.md"), "utf8");
export const { version } = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf8"));

// Runs the real CLI the way a user would, in the given directory.
export function edda(args, cwd = tempDir()) {
  const result = spawnSync(process.execPath, [join(packageRoot, "bin", "edda.js"), ...args], {
    cwd,
    encoding: "utf8",
  });
  return { status: result.status, stdout: result.stdout, stderr: result.stderr, cwd };
}

export function tempDir() {
  return mkdtempSync(join(tmpdir(), "edda-test-"));
}
