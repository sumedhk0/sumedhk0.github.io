// Post-build assertions over the static export in out/.
// Runs in CI after `next build`; exits non-zero on the first failure.
// These read raw HTML, so they also prove what a reader sees with JS disabled.
import fs from "node:fs";
import path from "node:path";

const OUT = path.resolve(process.cwd(), "out");

export function read(rel) {
  return fs.readFileSync(path.join(OUT, rel), "utf8");
}

export function assertFile(rel) {
  if (!fs.existsSync(path.join(OUT, rel))) fail(`missing file: out/${rel}`);
}

export function assertContains(rel, needle, label) {
  assertFile(rel);
  if (!read(rel).includes(needle)) fail(`${label}: out/${rel} lacks ${JSON.stringify(needle)}`);
}

export function assertNotContains(rel, needle, label) {
  assertFile(rel);
  if (read(rel).includes(needle)) fail(`${label}: out/${rel} contains ${JSON.stringify(needle)}`);
}

function fail(msg) {
  console.error(`check-export FAILED — ${msg}`);
  process.exit(1);
}

// ---- assertions ----
assertFile("index.html");
assertFile("404.html");

// Task 3 — periodic table (table, cell-fit)
for (let n = 1; n <= 18; n++) {
  const re = new RegExp(`aria-label="[^"]+, element ${n}, [^"]+"`);
  if (!re.test(read("index.html"))) fail(`table: no cell labelled "element ${n}"`);
}
assertContains("index.html", 'href="/work/pf/"', "table");
assertNotContains("index.html", 'href="/work/ar/"', "table (card elements must not link)");
assertContains("index.html", "cell-name", "cell-fit (names render as truncatable spans)");

// Task 4 — polymer spine has a no-JS fallback in the static HTML
assertContains("index.html", "spine-fallback", "spine fallback");

console.log("check-export: all assertions passed");
