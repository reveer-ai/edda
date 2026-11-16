import assert from "node:assert/strict";
import { test } from "node:test";
import { edda, version } from "./helpers.js";

test("no arguments prints usage listing init", () => {
  const { status, stdout } = edda([]);
  assert.equal(status, 0);
  assert.match(stdout, /^Usage: edda <command>/);
  assert.match(stdout, /\binit\b/);
});

test("--help and -h print the same usage", () => {
  const plain = edda([]).stdout;
  for (const flag of ["--help", "-h"]) {
    const { status, stdout } = edda([flag]);
    assert.equal(status, 0);
    assert.equal(stdout, plain);
  }
});

test("--version and -v print only the package version", () => {
  for (const flag of ["--version", "-v"]) {
    const { status, stdout } = edda([flag]);
    assert.equal(status, 0);
    assert.equal(stdout, `${version}\n`);
  }
});

test("an unknown command fails with the command name and usage on stderr", () => {
  const { status, stdout, stderr } = edda(["bogus"]);
  assert.notEqual(status, 0);
  assert.equal(stdout, "");
  assert.match(stderr, /Unknown command: bogus/);
  assert.match(stderr, /Usage: edda <command>/);
});
