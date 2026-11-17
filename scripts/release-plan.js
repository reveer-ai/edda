#!/usr/bin/env node
// Decides whether the release workflow publishes package.json's version to npm.
// Prints "publish" or "skip" on stdout, the reason on stderr, and exits non-zero on "fail".
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const release = /^(\d+)\.(\d+)\.(\d+)$/;

// Compares two release versions (major.minor.patch, no prerelease): negative, zero or positive.
function compare(a, b) {
  const [x, y] = [a, b].map((v) => v.match(release).slice(1).map(Number));
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
}

// version: package.json's version. published: every version on npm. latest: npm's latest dist-tag.
export function releasePlan(version, published, latest) {
  if (published.includes(version)) {
    return { outcome: "skip", reason: `${version} is already on npm.` };
  }
  if (!release.test(version)) {
    return { outcome: "fail", reason: `${version} isn't a plain major.minor.patch version, and prereleases aren't supported.` };
  }
  if (!release.test(latest ?? "")) {
    return { outcome: "fail", reason: `npm's latest tag (${latest}) isn't a plain major.minor.patch version.` };
  }
  if (compare(version, latest) <= 0) {
    return { outcome: "fail", reason: `${version} isn't greater than latest (${latest}); publishing it would move latest backwards.` };
  }
  return { outcome: "publish", reason: `${version} is new and greater than latest (${latest}).` };
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const root = join(dirname(fileURLToPath(import.meta.url)), "..");
  const { name, version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  const npm = JSON.parse(execFileSync("npm", ["view", name, "versions", "dist-tags", "--json"], { encoding: "utf8" }));
  const { outcome, reason } = releasePlan(version, [].concat(npm.versions ?? []), npm["dist-tags"]?.latest);
  console.error(reason);
  if (outcome === "fail") process.exit(1);
  console.log(outcome);
}
