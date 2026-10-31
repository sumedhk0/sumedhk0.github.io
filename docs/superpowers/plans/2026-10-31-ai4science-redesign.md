# AI-for-Science Portfolio Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild sumedhk0.github.io as a periodic-table-of-work portfolio on lab-notebook graph paper, with polymer-chain spines beside lists and a findings page per project, previewed locally before one approved merge to `main`.

**Architecture:**
- **Content data:** `data/` plus `content/` hold typed records. Pure functions in `lib/` number and place the elements, build spine paths and scale charts, and Vitest tests them.
- **Rendering:** pages stay server components in a static export. Two small client islands remain: the table's toggle, panel and keyboard handling, and the scroll-drawn spine. Charts render to inline SVG at build time from committed CSV/JSON.
- **The cell → page "expand":** a CSS cross-document view transition between plain `<a>` navigations. It needs no JS and no React canary APIs.

**Tech Stack:**
- Next.js 16 (`output: "export"`), React 19, Tailwind 4, TypeScript.
- `next/font/google`: Newsreader, IBM Plex Sans, IBM Plex Mono.
- Vitest for unit tests. `sharp` (dev dependency) for image conversion.

**Spec:** `docs/superpowers/specs/2026-10-31-ai4science-redesign-design.md`. Read it fully before Task 1.

## Global Constraints

- **Work location:** all work happens in a git worktree at the short local path `C:/dev/pw-redesign` on branch `redesign/ai4science`. Never build or run dev servers in the OneDrive copy. It hangs; see the memory note "Builds break in OneDrive repo path".
- **Branch and deploy:** push the branch after each commit. Never push to or merge into `main` without asking the owner. Every push to `main` deploys the live site.
- **Commits:** frequent, with messages that explain the reasoning. **No `Co-Authored-By`, `Claude-Session` or "Generated with" trailers.** Use `git commit -F <file>`, and never `-m` with `$(`, backticks or heredocs inside.
- **Numbers:** use only values from `docs/superpowers/research/*.md`, `data/*.ts`, or the committed CSV/JSON. Never invent or round beyond what the source shows.
- **Tone:** benefit-first. A trade-off gets at most one short sentence, only in a findings page's "Details and limits".
- **Witness AI:** show resume details only (10K prompts; 60% attack success on Claude, Qwen and Gemma; 1,000+ papers; 3,000+ prompts; 8 LLMs; 3 classifiers). No images, diagrams or extra research.
- **Type:**
  - Newsreader for display, IBM Plex Sans for body, IBM Plex Mono for labels and numbers.
  - No Inter or Space Grotesk.
  - No gradients, glass, shadows, emoji, or radius above 2 px.
- **Palette** (light): paper `#f5f6f2`, ink `#1c2433`, muted `#5b6676`, rule `#c9d0d6`, blueprint `#2c5aa0`, red-pencil `#c23b22`. Dark theme via `prefers-color-scheme` only, with no toggle.
- **Graph paper:** an 8 px minor and 40 px major grid in the blueprint hue at about 3.5% and 7% alpha, CSS only, on `body`, on every route.
- **Motion:** only three things move: the spine drawing on scroll, the cell → page view transition, and in-view video. All are disabled or static under `prefers-reduced-motion`.
- **Performance and accessibility targets:**
  - Home-page site JS under about 30 KB gzipped beyond the framework.
  - Mobile Lighthouse performance 95+.
  - CLS about 0.
  - WCAG AA contrast in both themes.
  - Visible focus.
- **Static export output:** `trailingSlash: true` so `/work/<slug>/` emits `work/<slug>/index.html` for GitHub Pages.

## Review Focus

1. **Phone width (360–400 px).** The 8-column table must fit without horizontal scroll. Names and years are hidden and only the number and symbol show. Long names like "Adversarial self-play" never overflow a cell. *Test: Task 3 `cell-fit` export assertion plus a 390 px screenshot check.*
2. **JavaScript disabled.** Every element's content is reachable through the home-page lists and links. The spine shows as a static CSS fallback. Findings pages are fully readable. *Test: Task 5 export assertions on raw HTML (no JS ran), and Task 4's fallback-class assertion.*
3. **Dark theme.** The graph paper, family colours, chart marks and text stay at AA or better on dark paper. *Test: Task 2 contrast tests run over both palettes.*
4. **Direct load or refresh of `/work/<slug>/` on GitHub Pages, and back navigation.** Every findings page exists as `work/<slug>/index.html`, and the back link lands on the table (`/#work`). *Test: Task 7 export assertion over every page slug.*
5. **`prefers-reduced-motion`.** No video autoplays, the spine renders fully drawn, and no view-transition animation runs. *Test: Task 4 and Task 8 CSS assertions on the reduced-motion blocks.*

---

### Task 1: Worktree, preview server and test harness

**Files:**
- Create: `vitest.config.ts`, `tests/smoke.test.ts`, `scripts/check-export.mjs`
- Modify: `package.json` (scripts `test`, `check:export`, devDeps `vitest`, `sharp`), `next.config.js` (`trailingSlash: true`), `.github/workflows/deploy.yml` (run `npm test` before build and `npm run check:export` after)

**Interfaces:**
- Produces:
  - `npm test` runs Vitest in node env over `tests/**/*.test.ts`, with path alias `@/` mapped to the repo root.
  - `npm run check:export` runs `node scripts/check-export.mjs`. It reads `out/` and exits non-zero on the first failed assertion, printing it.
  - Later tasks append assertions with `assertFile(path)`, `assertContains(path, substring, label)` and `assertNotContains(path, substring, label)`, all exported helpers in that script.

- [ ] **Step 1:** Create the worktree and install. Run in the OneDrive repo:
  ```
  git worktree add -b redesign/ai4science C:/dev/pw-redesign main
  ```
  Then in `C:/dev/pw-redesign`: `npm ci`. Expected: install completes.
- [ ] **Step 2:** Add Vitest and a smoke test `tests/smoke.test.ts` asserting `1 + 1 === 2`. Run `npm test`. Expected: 1 passed.
- [ ] **Step 3:** Write `scripts/check-export.mjs` with the three helpers and initial assertions:
  - `out/index.html` exists.
  - `out/404.html` exists.
- [ ] **Step 4:** Set `trailingSlash: true`. Run `npx next build && npm run check:export`. Expected: build succeeds and the check passes.
- [ ] **Step 5:** Start the preview: `npx next dev` (run in background) in `C:/dev/pw-redesign`. Expected: "Ready" and `http://localhost:3000` serves the current site. **This is the owner's test site for the whole build**, and it updates live as files change.
- [ ] **Step 6:** Update the workflow to `npm ci → npm test → configure-pages → npx next build → npm run check:export → upload`. Commit, then push the branch with `git push -u origin redesign/ai4science`. The workflow only deploys on `main`, so nothing goes live.

### Task 2: Design tokens, fonts, graph paper and contrast tests

**Files:**
- Create: `lib/theme.ts`, `tests/theme.test.ts`
- Modify: `app/globals.css`, `app/layout.tsx`

**Interfaces:**
- Produces:
  - `lib/theme.ts` exports `PALETTE: { light: Palette; dark: Palette }`, where `Palette = { paper, ink, muted, rule, blueprint, pencil: string }`.
  - It also exports `FAMILIES: Record<Family, { label: string; light: string; dark: string }>`, with `Family = "materials" | "safety" | "optimization" | "vision" | "chemistry" | "software"`.
  - It also exports `contrast(fg: string, bg: string): number`, the WCAG 2.1 ratio from hex.
  - CSS custom properties `--paper --ink --muted --rule --blueprint --pencil --fam-<family>` are defined in `globals.css` from the same values. A test keeps the two in sync.
  - Font CSS variables `--font-display`, `--font-body`, `--font-mono` come from `next/font/google` in `layout.tsx`.

- [ ] **Step 1: Write the failing tests** in `tests/theme.test.ts`:
  - `contrast("#000000", "#ffffff")` is about 21. `contrast("#ffffff", "#ffffff")` is 1.
  - For both themes: ink/paper ≥ 7, muted/paper ≥ 4.5, blueprint/paper ≥ 4.5, pencil/paper ≥ 4.5.
  - For every family in both themes: white `#ffffff` on the family colour ≥ 4.5 (hover fill with white text), and family vs paper ≥ 3 (the 4 px bar as a non-text graphic).
  - `globals.css` contains each palette hex (read the file and assert substrings), so CSS and TS cannot drift.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `lib/theme.ts`.
  - Light values come from Global Constraints.
  - Family colours start from mockup C (`#2f62a8 #b04a35 #2f7d63 #8a5aa8 #b0841f #5f6872`) and are darkened or lightened until the tests pass.
  - Dark palette: near-black blue-grey paper about `#11161d`, light ink, the blueprint lightened. Tune until the tests pass.
- [ ] **Step 4:** Implement the CSS:
  - Tokens on `:root`, with a dark override in `@media (prefers-color-scheme: dark)`.
  - The `body` graph-paper background: four `linear-gradient`s with sizes `40px 40px, 40px 40px, 8px 8px, 8px 8px`. Minor lines use `color-mix(in srgb, var(--blueprint) 3.5%, transparent)` and major lines 7%.
  - Base type: body 17–18 px Plex Sans, line-height about 1.6; headings Newsreader; `.mono` is Plex Mono with uppercase labels at +0.06em tracking.
  - `:focus-visible` outline 2 px blueprint.
  - Wire fonts in `layout.tsx`.
- [ ] **Step 5:** Run `npm test`. Expected: PASS. Then screenshot `localhost:3000` (headless Chrome, 1440 wide) and check the grid is visible but quiet behind the old content.
- [ ] **Step 6:** Commit and push.

### Task 3: Element model, numbering and the periodic table

**Files:**
- Create: `data/elements.ts`, `lib/elements.ts`, `tests/elements.test.ts`, `components/table/periodic-table.tsx` (server), `components/table/table-client.tsx` (client island), `components/table/cell.tsx`
- Modify: `lib/types.ts`, `scripts/check-export.mjs`

**Interfaces:**
- Consumes: `Family` and `FAMILIES` from Task 2.
- Produces:
  - In `lib/types.ts`:
    ```ts
    export type PageKind = "full" | "restricted" | "card";
    export interface ElementRecord { slug: string; symbol: string; name: string; family: Family; start: string /* "YYYY-MM" */; kind: PageKind; oneLiner: string; tech: string[]; links: { label: string; href: string }[] }
    export interface PlacedElement extends ElementRecord { number: number; year: number; col: number; row: number; href: string | null }
    ```
  - In `lib/elements.ts`:
    - `placeElements(records: ElementRecord[]): PlacedElement[]` sorts by `start` ascending, ties by `name`, and numbers from 1. Placement is by number: n=1 → (col 1, row 1); n=2 → (8, 1); n=3..10 → row 2, cols 1–8; n=11..18 → row 3, cols 1–8. `href` is `/work/<slug>/` when `kind !== "card"`, else `null`.
    - `neighbor(els: PlacedElement[], from: number, key: "ArrowLeft"|"ArrowRight"|"ArrowUp"|"ArrowDown"): number` returns the number of the nearest cell in that direction, or `from` if none.
  - `ELEMENTS: ElementRecord[]` in `data/elements.ts`.
  - `<PeriodicTable />` renders the grid, legend and detail panel. The panel defaults to `pf` (PolyFrameNet, the flagship) when nothing is selected. The newest by number is PolyT5-RLVR after the alphabetical tie-break, so "newest" would not pick the flagship.

- [ ] **Step 1: Write the failing tests** in `tests/elements.test.ts`:
  - `ELEMENTS.length === 18`; symbols are unique and two characters, starting uppercase.
  - `placeElements(ELEMENTS)[0].name === "Fluorinated MOFs"` (start 2024-08).
  - Ties sort by name, e.g. ChemE Cube (2025-08) comes before Lignin (2025-08).
  - Positions: number 1 → (1,1), 2 → (8,1), 3 → (1,2), 18 → (8,3). No two elements share a cell.
  - Every `kind: "full" | "restricted"` element has a non-null `href`; every `card` has `href === null`.
  - `as` and `li` (Witness AI) are `kind !== "full"`.
  - `pf`, `pt`, `pp`, `ps`, `gs`, `rb`, `gt` are `kind: "full"`.
  - `neighbor` from 1 with ArrowRight → 2. From 3 with ArrowUp → 1. From 18 with ArrowRight → 18.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Write `data/elements.ts`:
  - Use the spec §4.2 roster and date table. Slugs: `pf dy pt as li pp ps gs rb gt cc ht lg mf ar ef rf ga`.
  - For Robotech, take the month from the Devpost submission date (https://devpost.com/software/buzzinga-robotech-submission). If you can't find it, use the repo's first commit month and note that in the commit message.
  - `oneLiner` is the headline result from `data/` text, benefit-first, ≤ 70 characters (e.g. "2.5–5.5× faster than MACE; scales to 26K atoms").
  - `links`: repo, live, Devpost, video, using the correct URLs from `small-projects.md`. Arbitrage uses `-theta`. AiApply links to its repo only.
- [ ] **Step 4:** Implement `lib/elements.ts`. Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Implement the table components to match mockup C.
  - **Cell:** a 4 px family bar on top, number at top left, year at top right, large symbol, name below.
  - **Cell element:** an `<a href>` when `href` is set, otherwise a `<button>`. `aria-label` is `"<name>, element <n>, <family label>"`.
  - **Legend and toggle:** a legend, and a "Colour: field / year" toggle with `aria-pressed`.
  - **Detail panel:** sticky to the right on desktop; on screens under 860 px it sits below the grid.
  - **Interaction:** hover or focus updates the panel. Arrow keys use `neighbor`. A card cell click pins the panel.
  - **Narrow screens:** under 560 px, hide the name and year.
  - **Grid:** `repeat(8, minmax(0,1fr))`, cells `aspect-ratio: 1/1.08`, `overflow:hidden`, name `text-overflow: ellipsis`.
  - The server component renders all cells. The client island only adds state, so without JS the cells still link or show.
- [ ] **Step 6:** Add export assertions, labelled `cell-fit` and `table`:
  - `out/index.html` contains 18 `aria-label="` strings ending in `, element N, …` for N = 1..18.
  - It contains `href="/work/pf/"`.
  - It contains no `href="/work/ar/"`.
- [ ] **Step 7:** Render the table temporarily at the top of `app/page.tsx`. Build, run `npm run check:export` (expected: PASS), then take screenshots at 1440 and 500 px. Commit and push.

### Task 4: Polymer spine

**Files:**
- Create: `lib/spine.ts`, `tests/spine.test.ts`, `components/spine/spine-list.tsx` (server wrapper), `components/spine/spine-svg.tsx` (client island)
- Modify: `app/globals.css`, `scripts/check-export.mjs`

**Interfaces:**
- Produces:
  - `spinePath(y0: number, y1: number, opts?: { step?: number; xL?: number; xR?: number }): string` returns the zig-zag `d`. Defaults: `step 22, xL 14, xR 38`. Vertices sit at y = multiples of `step` within `[y0, y1]`, and x alternates by `Math.round(y/step) % 2`.
  - `snapToVertex(y: number, step?: number): { x: number; y: number }`.
  - `<SpineList segments={{ id: string; colorVar: string; children: ReactNode }[]}>` renders entries with a left gutter.
  - `<SpineSvg>` measures `[data-spine-seg]` and `[data-spine-entry]` and draws segment paths, dashed side groups and atom nodes. It redraws on `ResizeObserver` and maps scroll to `stroke-dashoffset`.

- [ ] **Step 1: Write the failing tests:**
  - `spinePath(0, 88)` has 5 vertices: x values 14, 38, 14, 38, 14 at y 0, 22, 44, 66, 88.
  - `spinePath(10, 50)` starts at y 22, the first multiple ≥ 10.
  - `snapToVertex(30)` returns `{ x: 38, y: 22 }`.
  - `spinePath(0, 0)` is `"M14,0"`.
  - CSS check: `globals.css` contains `@media (prefers-reduced-motion: reduce)` with `.spine-path` and `stroke-dashoffset: 0`.
  - CSS check: `.spine-fallback` exists.
- [ ] **Step 2:** Run `npm test`. Expected: FAIL.
- [ ] **Step 3:** Implement `lib/spine.ts`.
  - **No-JS fallback:** `.spine-fallback` is a static zig-zag drawn in CSS on the list gutter (a `repeating-linear-gradient` diagonal pair, or an inline SVG data-URI background tiled vertically). The client island hides it once mounted.
  - **Phones under 480 px:** the spine moves into a 24 px gutter with `xL 6, xR 18`.
- [ ] **Step 4:** Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Add an export assertion that `out/index.html` contains `spine-fallback`. Build, run the check, take screenshots, then commit and push.

### Task 5: Home page assembly

**Files:**
- Create: `components/home/hero.tsx`, `components/home/title-block.tsx`, `components/home/drawing-index.tsx`, `components/home/entry.tsx`
- Modify: `app/page.tsx`, `components/sections/{about,experience,research,projects,education,contact}.tsx` (restyle; they keep reading `data/`), `components/layout/footer.tsx`, `scripts/check-export.mjs`
- Delete: `components/sections/hero.tsx` (replaced)

**Interfaces:**
- Consumes: `<PeriodicTable/>` (Task 3), `<SpineList/>` (Task 4), and the tokens (Task 2).
- Produces:
  - `<Entry meta={string} title={ReactNode} body={ReactNode} tags?={string[]} elementHref?={string} />`: a ruled two-column row with a mono meta column on the left and content on the right.
  - Section ids, in order: `work about experience research projects education contact`.

- [ ] **Step 1:** Add the export assertions:
  - The section ids appear in that order in `out/index.html`.
  - The drawing index contains `01` through `07` with labels Work, About, Experience, Research, Projects, Education, Contact.
  - `out/index.html` contains "Crop Growth Predictor" and "AiApply" (off-table projects remain listed).
  - It contains `Sumedh_Kothari_Resume.pdf`.
  - It contains no `Witness.ai`; the resume spelling is "Witness AI".

  Run the build and the check. Expected: FAIL.
- [ ] **Step 2:** Build the hero and title block:
  - Hero: Newsreader name, a one-sentence thesis drawn from `about.tsx` content, and the links.
  - Title block, mockup A style: `Drawn by Sumedh Kothari · Georgia Tech · ChBE + CS · Rev 2026.10`.
- [ ] **Step 3:** Build the drawing index: a sticky left rail ≥ 1024 px, a horizontal strip below that. Highlight the current section with `IntersectionObserver` in a tiny client island. Without JS it is plain anchors.
- [ ] **Step 4:** Restyle the sections:
  - Experience, Research, Projects and Education render `<Entry>` rows inside `<SpineList>`, with one coloured segment per section.
  - Research and Projects entries that match an element link to it (`elementHref`).
  - About keeps the focus areas and skills. Contact keeps the email as selectable text.
  - Footer: "Built with Next.js · Rev 2026.10".
- [ ] **Step 5:** Run the build and `npm run check:export`. Expected: PASS.
- [ ] **Step 6:** Screenshot the full page at 1440 and 500 px and **show the owner** (local preview `http://localhost:3000`). This is the first owner checkpoint: collect feedback before the findings pages.
- [ ] **Step 7:** Commit and push.

### Task 6: Chart primitives and data loading

**Files:**
- Create: `lib/charts/scale.ts`, `lib/data/read.ts`, `components/charts/bar-chart.tsx`, `components/charts/line-chart.tsx`, `tests/charts.test.ts`
- Create: `content/data/<slug>/…`, copying only the CSV/JSON that charts use, from `docs/superpowers/research/assets/{polyframenet,polyt5-rlvr,ml-pso}/` and `docs/superpowers/research/data/panoptic-pigskin/`

**Interfaces:**
- Produces:
  - `linearScale(domain: [number, number], range: [number, number]): (v: number) => number`
  - `logScale(domain: [number, number], range: [number, number]): (v: number) => number`, which throws if the domain is ≤ 0.
  - `niceTicks(min: number, max: number, count?: number): number[]` (1/2/5 steps, includes 0 when `min === 0`)
  - `logTicks(min: number, max: number): number[]` (powers of 10 in range)
  - `readCsv(relPath: string): Record<string, string>[]` (build-time `fs`, path relative to `content/data/`, handles quoted fields)
  - `readJson<T>(relPath: string): T`
  - `<BarChart rows={{ label: string; value: number; highlight?: boolean; note?: string }[]} unit?: string; log?: boolean; refLine?: { value: number; label: string } />`
    - Horizontal bars with a 0-based axis (log when `log`).
    - The highlighted bar uses `--blueprint` and the others `--muted`.
    - Mono tick labels, `tabular-nums`, `role="img"`, and `aria-label` summarizing the values.
  - `<LineChart series={{ name: string; points: [number, number][]; highlight?: boolean; oomAfter?: number }[]} xLog?: boolean; yLog?: boolean; xLabel: string; yLabel: string />`
    - An "OOM" marker × drawn at the last point when `oomAfter` is set.

- [ ] **Step 1: Write the failing tests:**
  - `linearScale([0,10],[0,100])(5) === 50`.
  - `logScale([1,1000],[0,300])(10) === 100`.
  - `niceTicks(0, 4)` equals `[0,1,2,3,4]`.
  - `logTicks(20, 30000)` equals `[100, 1000, 10000]`.
  - `readCsv("polyframenet/l40s_speed_memory.csv")` returns rows whose PolyFrameNet v2 and MACE ms/step values give ratios that round to 2.55 at 976 atoms and 5.51 at 7,808 atoms.
  - `readCsv` parses a quoted field containing a comma.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Copy the data files and implement. Charts use only CSS variables for colour, so they theme automatically.
- [ ] **Step 4:** Run the tests. Expected: PASS. Commit and push.

### Task 7: Findings page route, template and view transition

**Files:**
- Create:
  - `lib/findings.ts`
  - `content/findings/index.ts` (registry)
  - `content/findings/types.ts`
  - `app/work/[slug]/page.tsx`
  - `components/findings/{header,figure,steps,pager}.tsx`
  - `components/charts/registry.tsx`
  - `tests/findings.test.ts`
  - `app/not-found.tsx`
- Modify: `app/globals.css` (view-transition rules), `scripts/check-export.mjs`

**Interfaces:**
- Consumes: `PlacedElement` and `placeElements` (Task 3); the charts (Task 6).
- Produces:
  - Types:
    ```ts
    export type Figure =
      | { kind: "chart"; chartId: ChartId; caption: string }
      | { kind: "image"; src: string; alt: string; width: number; height: number; caption: string }
      | { kind: "video"; src: string; poster: string; width: number; height: number; caption: string };
    export interface Findings { slug: string; dates: string; affiliation?: string; lead: string; figures: Figure[]; steps: string[]; limits?: string; stats?: { value: string; label: string }[] }
    ```
  - `ChartId` is a string union exported from `components/charts/registry.tsx` with `CHARTS: Record<ChartId, () => JSX.Element>`.
  - `getFindings(slug: string): Findings | undefined`; `findingsSlugs(): string[]`.
  - `generateStaticParams()` returns `findingsSlugs()`.
  - The page renders, in order:
    1. A large cell header with `style={{ viewTransitionName: "el-" + slug }}`, matching the table cell's name.
    2. Title, dates, affiliation, links and tags.
    3. The lead.
    4. "Key findings" as `<figure>` elements with "Fig. n —" captions.
    5. "How it works" (an ordered list).
    6. "Details and limits", only if `limits` is set.
    7. Previous/next by element number among non-card elements, and "← Back to the table" linking to `/#work`.

- [ ] **Step 1: Write the failing tests:**
  - Every `ELEMENTS` entry with `kind !== "card"` has `getFindings(slug)` defined, and `findingsSlugs()` contains no card slugs.
  - Every figure has a non-empty caption under 280 characters.
  - Every `image`/`video` `src` and `poster` exists under `public/`.
  - The `restricted` slugs (`as`, `li`) have zero `image`/`video`/`chart` figures and at least one `stats` item, each of whose `value` appears in the allowed Witness list from Global Constraints.
  - CSS check: `globals.css` contains `@view-transition { navigation: auto; }` and a reduced-motion block setting `::view-transition-group(*)` to `animation: none`.

  To start, give `pf` a placeholder Findings with one chart so the route compiles. Tasks 8–9 fill in the content.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement the route, template and registry.
  - The table cell `<a>` gets the matching `viewTransitionName` (modify `cell.tsx`).
  - Video figures: `<video muted loop playsInline preload="none" poster>`. They play only when in view (a tiny client island) and never under reduced motion.
  - The 404 page uses the site layout with a large "404" set as an element cell: symbol "?", name "Not found", and a link home.
- [ ] **Step 4:** Add export assertions:
  - For each slug in `findingsSlugs()` (read from a generated `out/work/` listing), `out/work/<slug>/index.html` exists and contains `Back to the table`.
  - There is no `out/work/ar/`.
- [ ] **Step 5:** Run the tests, build and check. Expected: PASS. Click a cell in Chrome locally and confirm the morph. Commit and push.

### Task 8: Findings content: PolyFrameNet, PolyT5-RLVR, ML-assisted PSO

**Files:**
- Create: `content/findings/{pf,pt,ps}.ts`, `public/work/pf/architecture.webp`, `scripts/optimize-media.mjs`
- Modify: `components/charts/registry.tsx` (add chart ids), `tests/findings.test.ts`

**Interfaces:**
- Consumes: `Findings`, `CHARTS` and `readCsv` (Tasks 6–7).
- Produces:
  - Chart ids: `pf-speed`, `pf-memory`, `pf-ablation`, `pt-frontier`, `pt-ablation`, `pt-scaling`, `ps-objective`, `ps-ml-gain`.
  - `scripts/optimize-media.mjs <in> <outDir> --width N` writes `.webp` (quality 80) with sharp and prints width and height.

- [ ] **Step 1: Write the failing data-fidelity tests**, one per chart, asserting the chart's input rows reproduce the spec numbers:
  - `pf-speed`: 2.55× at 976 atoms, 5.51× at 7,808; MACE and Allegro carry `oomAfter`.
  - `pf-memory`: 12.35 vs 3.62 GB at 7,808 atoms; v2 has a point at 26,352 atoms.
  - `pf-ablation`: 115.6, 44.3, 34.4.
  - `pt-frontier`: replay slope 0.973 and baseline 0.904.
  - `pt-ablation`: A1 mean 27.11 vs B0 28.60, with a threshold line at 27.9142.
  - `pt-scaling`: 62.39 → 44.45.
  - `ps-objective`: Ackley vanilla 2.891 vs +ML 0.278 and Rastrigin 201.5 vs 93.443. Griewank is present.
  - `ps-ml-gain`: values span 38.3–95.6%.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Implement the charts and content.
  - Follow the spec §6 figure plan and the research notes for each project.
  - Leads are 2–3 sentences, benefit-first.
  - Steps come from each note's "Method" section. `limits` is one sentence at most:
    - **pf:** the accuracy trade-off (43.4 vs 19.7 meV/Å).
    - **ps:** Griewank and the runtime overhead.
    - **pt:** omit, or the single-seed note.
  - Convert `architecture.png` with `optimize-media.mjs`.
  - Do **not** use `speed.png`.
- [ ] **Step 4:** Run the tests and the build. Expected: PASS. Screenshot the three pages, light and dark. Commit and push.

### Task 9: Findings content: Panoptic Pigskin, GameSense, Robotech, GT Transfer, Witness AI

**Files:**
- Create: `content/findings/{pp,gs,rb,gt,as,li}.ts`, `public/work/{pp,gs,rb,gt}/…`
- Modify: `components/charts/registry.tsx` (`pp-calibration`, `pp-surges`, `pp-pck`), `tests/findings.test.ts`

**Interfaces:**
- Consumes: as Task 8.

- [ ] **Step 1: Write the failing tests:**
  - `pp-calibration`: 6.17 → 0.15 m on a log axis, with the caption naming the Helmet-Assignment play.
  - `pp-surges`: 17.3% → 5.5%.
  - `pp-pck`: endzone 0.7 → 66.1 and sideline 50.7 → 87.5.
  - `gt` stats: 2,076 / 104,073 / 1,461.
  - `as`/`li` stats match the Witness allowed list.
- [ ] **Step 2:** Run the tests. Expected: FAIL.
- [ ] **Step 3:** Prepare the media:
  - Convert the photos and stills listed in `small-projects.md` and `panoptic-pigskin.md` to WebP (max width 1600).
  - For Panoptic Pigskin video, download the site's follow-cam MP4 (URL in `panoptic-pigskin.md`). Use its poster frame `poster_follow_cam.jpg`, converted to WebP. Do not commit GIFs.
  - Keep each file ≤ 4.5 MB and each findings page's media total ≤ 8 MB.
- [ ] **Step 4:** Write the content.
  - **Robotech:** describe the 95% as the team's reported detection-and-removal rate and credit the team.
  - **GameSense:** do not claim Kalman filtering.
  - **Witness AI pages:** text plus stats only, in resume wording.
  - **Panoptic Pigskin:** links to the Film Room, playground and report.
- [ ] **Step 5:** Run the tests, build and check. Expected: PASS. Screenshot the six pages. Commit and push.

### Task 10: OG image, performance and accessibility pass, owner review

**Files:**
- Modify: `app/opengraph-image.tsx`, `app/layout.tsx` (metadata description), `scripts/check-export.mjs`

- [ ] **Step 1:** Restyle the OG image:
  - Paper background with a drawn grid (CSS gradients via `ImageResponse` divs).
  - Name in Newsreader. Keep the existing font-fetch fallback.
  - A large "Pf"-style element cell. Keep `dynamic = "force-static"`.
  - Update the metadata description to "ML for polymers and materials: fast interatomic potentials, RL-tuned polymer language models, and adversarial testing of LLMs."
- [ ] **Step 2:** Add export assertions:
  - `out/index.html` has `prefers-reduced-motion` in its CSS.
  - It has no `<video` with `autoplay`.
  - The total size of `out/_next/static/chunks/*.js` referenced by `index.html` that is not the framework is ≤ 100 KB raw, a proxy for the 30 KB gzipped budget. Print the measured value.
- [ ] **Step 3:** Serve `out/` with `npx serve out` (or `python -m http.server` in `out`).
  - Run Lighthouse in mobile mode with Chrome DevTools or `npx lighthouse http://localhost:3000 --form-factor=mobile --only-categories=performance,accessibility --output=json`.
  - **Expected:** performance ≥ 95, accessibility ≥ 95, and CLS ≤ 0.02. If the `npx lighthouse` download is blocked, stop and ask the owner to run it or allow it. Do not work around the block.
- [ ] **Step 4:** Use the keyboard alone to tab through the home page, arrow around the table, open a findings page, and go back. Turn on OS reduced motion and reload. Disable JS in Chrome and reload the home page and one findings page. Record what you observed in the commit message.
- [ ] **Step 5:** Commit and push. Then **owner review:**
  - Send screenshots at 1440 and 390 px, light and dark, plus the local preview URL.
  - List all new copy for approval: the hero thesis, panel one-liners, leads, captions and limits.
  - Ask whether to merge `redesign/ai4science` into `main`. Merge only on an explicit yes. After the merge, check the Pages deploy run succeeds and that `https://sumedhk0.github.io/` and one `/work/<slug>/` return 200.
- [ ] **Step 6:** Remove the worktree (`git worktree remove C:/dev/pw-redesign`) once merged.
