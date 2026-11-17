import assert from "node:assert/strict";
import { test } from "node:test";
import { releasePlan } from "../scripts/release-plan.js";

const published = ["0.0.0-stage", "0.1.0"];
const outcome = (version, versions = published, latest = "0.1.0") => releasePlan(version, versions, latest).outcome;

test("a version already on npm is skipped", () => {
  assert.equal(outcome("0.1.0"), "skip");
  assert.equal(outcome("0.0.0-stage"), "skip");
});

test("a new version above latest is published", () => {
  assert.equal(outcome("0.1.1"), "publish");
  assert.equal(outcome("0.2.0"), "publish");
  assert.equal(outcome("1.0.0"), "publish");
});

test("versions compare by number, not as text", () => {
  assert.equal(outcome("0.10.0", ["0.9.0"], "0.9.0"), "publish");
  assert.equal(outcome("0.9.1", ["0.10.0"], "0.10.0"), "fail");
});

test("a new version equal to or below latest fails", () => {
  assert.equal(outcome("0.1.0", ["0.0.0-stage"], "0.1.0"), "fail");
  assert.equal(outcome("0.0.9"), "fail");
  assert.equal(outcome("0.1.5", ["0.1.0", "0.2.0"], "0.2.0"), "fail");
});

test("a prerelease fails", () => {
  assert.equal(outcome("0.2.0-beta.1"), "fail");
});

test("a fail comes with a reason", () => {
  assert.match(releasePlan("0.0.9", published, "0.1.0").reason, /latest \(0\.1\.0\)/);
});
