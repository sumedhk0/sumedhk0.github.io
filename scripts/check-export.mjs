// Post-build assertions over the static export in out/.
// Runs in CI after `next build`; exits non-zero on the first failure.
// These read raw HTML, so they also prove what a reader sees with JS disabled.
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";

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

// Task 7 — findings pages exist for direct load / refresh on Pages
const PAGES = ["pf", "pt", "ps", "pp", "gs", "rb", "gt", "cc", "as", "li"];
for (const slug of PAGES) assertContains(`work/${slug}/index.html`, "Back to the table", `findings page ${slug}`);
if (fs.existsSync(path.join(OUT, "work/ar"))) fail("findings: card element ar must not have a page");
assertContains("work/pf/index.html", "view-transition-name:el-pf", "findings (expand target matches the table cell)");

// Task 10 — motion and performance budget
{
  const html = read("index.html");
  const css = [...new Set([...html.matchAll(/\/_next\/static\/[^"']+\.css/g)].map((m) => m[0]))]
    .map((p) => fs.readFileSync(path.join(OUT, p), "utf8"))
    .join("\n");
  if (!css.includes("prefers-reduced-motion")) fail("motion: home CSS has no prefers-reduced-motion handling");
  for (const slug of PAGES) {
    if (/<video[^>]*\sautoplay/i.test(read(`work/${slug}/index.html`))) fail(`motion: work/${slug} autoplays video`);
  }
  // Site JS = chunks carrying our own component code (framework chunks excluded).
  const chunks = [...new Set([...html.matchAll(/\/_next\/static\/chunks\/[^"']+\.js/g)].map((m) => m[0]))];
  const site = chunks.filter((p) => /spine-ready|pt-toggle|di-head|cell-sym/.test(fs.readFileSync(path.join(OUT, p), "utf8")));
  const gz = site.reduce((s, p) => s + zlib.gzipSync(fs.readFileSync(path.join(OUT, p))).length, 0);
  console.log(`check-export: home site JS ${(gz / 1024).toFixed(1)} KB gzipped across ${site.length} chunk(s)`);
  if (site.length === 0) fail("perf: could not find the site's own JS chunk (markers changed?)");
  if (gz > 30 * 1024) fail(`perf: home site JS ${(gz / 1024).toFixed(1)} KB gzipped exceeds the 30 KB budget`);
}

console.log("check-export: all assertions passed");
