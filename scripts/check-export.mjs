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

// Task 5 — home page structure
{
  const html = read("index.html");
  const ids = ["work", "about", "experience", "research", "projects", "education", "contact"];
  const pos = ids.map((id) => html.indexOf(`id="${id}"`));
  ids.forEach((id, i) => {
    if (pos[i] < 0) fail(`home: section #${id} missing`);
    if (i > 0 && pos[i] < pos[i - 1]) fail(`home: section #${id} is out of order`);
  });
  ["Work", "About", "Experience", "Research", "Projects", "Education", "Contact"].forEach((label, i) => {
    const num = String(i + 1).padStart(2, "0");
    if (!new RegExp(`${num}</span>\\s*${label}`).test(html)) fail(`home: drawing index lacks "${num} ${label}"`);
  });
}
assertContains("index.html", "Crop Growth Predictor", "home (off-table projects stay listed)");
assertContains("index.html", "AiApply", "home (off-table projects stay listed)");
assertContains("index.html", "Sumedh_Kothari_Resume.pdf", "home (resume link)");
assertNotContains("index.html", "Witness.ai", "home (resume spelling is Witness AI)");

console.log("check-export: all assertions passed");
