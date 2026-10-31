# AI-for-Science Portfolio Redesign: Design

Status: ready for owner approval (builder check done) · 2026-10-31 · site: https://sumedhk0.github.io (Next.js 16 static export, Tailwind 4, GitHub Pages)

## 1. Intent

The current site is a deliberately minimal single serif column. The owner, an undergraduate ML researcher (Georgia Tech ChBE + CS) working on machine-learned interatomic potentials for polymers, polymer language models, LLM safety and 3D reconstruction, has changed direction. He wants the site to read immediately as **AI for science** (polymers, crystals, blocks), using graphics that add appeal without clutter or slowdown. It must look made with taste, not AI-generated, and it must be very well organized.

A reader should be able to get from the home page into the actual evidence of each project (figures, photos, results) in one click.

## 2. Goals, non-goals, anti-goals

**Goals**
- The home page is a **periodic table of the owner's work**: each project or research item is an element, and the table is the primary navigation.
- **Lab-notebook graph paper** is the background on every page.
- **Polymer-chain spine**: a skeletal-formula backbone runs beside every *list of entries* (experience, education, research list, any project list), with each entry hanging off it as a side group.
- **Clicking an element opens its findings**: key results, figures, photos, video and links, built from real material in the owner's repos.
- Fast: no heavy 3D libraries, nothing that blocks first paint, fully usable with JavaScript disabled except for the toggle/transition niceties.

**Non-goals**
- No CMS, blog, analytics, dark-mode toggle UI (the site follows the OS theme), or contact form.
- No new projects or claims. Content comes from `data/*.ts` and the research notes (§8).
- Directions B (rotating crystal) and E (energy-surface hero) from the mockup round are not part of this design. See §10 for an optional later idea.

**Anti-goals** (failure even if it technically works)
- It looks AI-generated: purple/blue gradients, glass cards, glowing particle networks, emoji, `rounded-lg` cards everywhere, or Inter or Space Grotesk as the face.
- Decoration with no scientific meaning. Every graphic must be a specific object: a block chain, a periodic cell, a real plot.
- It publishes a number the repo does not support, or a figure of confidential work (§7).
- Graphics compete with each other. Each motif has one job (§4) and appears only where that job is.
- It is slow: layout shift, a loader screen, autoplaying full-bleed video, or scroll-jacking.

## 3. Reference and provenance

- Mockups the owner reviewed: https://claude.ai/artifact/2231BP83EKFqWCPnuEM4Aj. Tabs A (Lab Notebook), C (Periodic Table) and D (Polymer Chain) are the chosen sources. Their HTML/CSS/JS can be read with the Artifact tool and is the visual reference for this design.
- Design research (about 30 science sites): the strongest sites use specific scientific objects, restrained palettes, mono uppercase labels, ruled two-column lists and Distill-style figure captions. They avoid blobs, gradients and loader screens.
- Owner decisions, verbatim intent:
  - "I really like the periodic table"
  - "the background lab notebook is nice for everything"
  - "the polymer next to any list of entries"
  - "whenever I click on a project, it should expand into the key findings/work - figures, pictures, etc."
  - "Witness AI is off limits… keep the main details I put on the resume"
  - "weight more towards the benefits of my work rather than the tradeoffs; you can still mention them but keep that to a lower amount"

## 4. The three motifs: one job each

| Motif | Job | Where it appears | Never |
|---|---|---|---|
| Graph paper (from A) | Ground every page as a lab notebook | `body` background on all routes | Over text at more than about 7% contrast, or animated |
| Periodic table (from C) | Index and navigate the work | Home page and the `/work` index; a mini "you are here" cell on each findings page | As decoration elsewhere |
| Polymer spine (from D) | Give lists of entries structure and order | Beside experience, education, the research list, and any long list on a findings page | Beside prose, figures or the table |

### 4.1 Graph paper
- Two-scale grid in CSS only: a fine 8 px grid and a major 40 px grid, both in the accent hue at very low alpha.
- Minor lines about 3.5% opacity and major lines about 7% (mockup A values).
- In the dark theme, use the same structure with light lines on a near-black blue-grey.
- Content sits on panels the same colour as the paper only where text density needs it: tables, long paragraphs, figure frames. The grid should still be visible in the margins and gutters.

### 4.2 Periodic table (home)
- **Shape:** main-group periods 1–3, i.e. 2 + 8 + 8 = 18 cells in 8 columns. Row 1 uses columns 1 and 8; rows 2 and 3 are full. Column numbers 1–8 sit above in mono.
- **Cell anatomy, as in mockup C:** a 4 px family colour bar on top, an atomic number at top left, the year at top right, a large two-letter symbol, and the name below.
  - Atomic number is chronological, with 1 the newest.
  - On narrow screens, hide the name and year so only the number and symbol show.
- **Families (colour = field):** ML for materials, LLM safety, optimization, vision & hardware, chemistry, software. Each colour is a named token. Optionally name tokens after elements, Isomorphic-style. A legend sits below the table.
- **Recolour toggle:** "Colour: field / year", as in mockup C.
- **Interaction:**
  - **Desktop:** hover or focus shows a compact detail panel to the right of the table (symbol, name, one-line result, tech). Clicking a cell that has a findings page navigates to `/work/<slug>/`. Clicking a card-only cell pins the panel.
  - **Phone:** tapping a cell opens the detail panel below the table. The panel has an "Open findings →" link when a page exists.
  - **Keyboard:** cells are buttons or links in reading order, and arrow keys move across the grid.
- **Expansion feel:** use the View Transitions API (Next.js `unstable_ViewTransition` or a plain `document.startViewTransition` on client navigation) so the clicked cell morphs into the findings page's header cell. Fall back to a normal navigation when unsupported. This is progressive enhancement, not required for correctness.
- **Element roster (18 slots).** Symbols as in the mockup where already assigned.

| # | Sym | Element | Family | Findings page? |
|---|---|---|---|---|
| 1 | Pf | PolyFrameNet | ML for materials | Full |
| 2 | Dy | PolyDYN | ML for materials | Card only (no material exists; shows "in progress") |
| 3 | Pt | PolyT5-RLVR | ML for materials | Full |
| 4 | As | Adversarial self-play (Witness AI) | LLM safety | Restricted (§7) |
| 5 | Li | LiLAC (Witness AI) | LLM safety | Restricted (§7) |
| 6 | Pp | Panoptic Pigskin | Vision & hardware | Full |
| 7 | Ps | ML-assisted PSO | Optimization | Full (charts only, no images exist) |
| 8 | Gs | GameSense | Vision & hardware | Full |
| 9 | Rb | Robotech debris robot | Vision & hardware | Full |
| 10 | Gt | GT Transfer Equivalencies | Software | Full |
| 11 | Cc | ChemE Cube DAC reactor | Optimization | Card only |
| 12 | Ht | HyTech Racing | Vision & hardware | Card only |
| 13 | Lg | Lignin valorization | Chemistry | Card only |
| 14 | Mf | Fluorinated MOFs | Chemistry | Card only |
| 15 | Ar | Sports betting arbitrage | Software | Card only |
| 16 | Ef | EcoFlow | Software | Card only |
| 17 | Rf | ResumeForge (merge with ResumeOptimizer) | Software | Card only |
| 18 | Ga | GitHub Analyzer | Software | Card only |

- **Dates and numbering:**
  - **Rule:** atomic number = order of start date, **oldest = 1**. New work joins at the end and existing numbers never change, which matches how real elements were added. This replaces the mockup's "newest = 1" (Claude's call).
  - **Date source precedence:** (1) the October 2026 resume; (2) `data/experience.ts` periods; (3) the event date for hackathons; (4) the repo creation month for software projects.
  - Add a `start` field (YYYY-MM) to each element record. The cell shows its year.
  - Settled dates:

    | Element | Start | Source |
    |---|---|---|
    | MOFs | 2024-08 | experience |
    | Lignin | 2025-08 | experience |
    | ChemE Cube | 2025-08 | resume |
    | Arbitrage | 2025-11 | repo |
    | GitHub Analyzer | 2025-12 | repo |
    | ResumeForge | 2025-12 | ResumeOptimizer repo |
    | Panoptic Pigskin | 2026-02 | resume "Spring 2026"; first NFL repo 2026-04 |
    | HyTech | 2026-02 | experience |
    | EcoFlow | 2026-02 | repo |
    | GameSense | 2026-03 | Tech(HACK) Valley, Mar 6–8 |
    | PSO | 2026-03 | resume "Spring 2026" |
    | GT Transfer | 2026-04 | repo |
    | Robotech | 2026 | builder takes the month from the Devpost submission date |
    | Adversarial self-play | 2026-05 | resume |
    | LiLAC | 2026-05 | resume |
    | PolyT5-RLVR | 2026-08 | resume "Summer 2026"; repo 2026-08 |
    | PolyFrameNet | 2026-08 | resume |
    | PolyDYN | 2026-08 | Ramprasad start |

    Ties break alphabetically.
- Cell placement in the 2/8/8 shape is the builder's call. Keep families visually clustered where possible.
- Items left off the table are the PFAS review, GreenGrade, eutrophication modelling, crop predictor, AiApply and PolyUMA. They remain in the research and project lists below the table.
- AiApply is left off because its live link is dead. PolyUMA is dropped entirely because its repo is empty.

### 4.3 Polymer spine
- An inline SVG zig-zag runs in the left margin of a list: a skeletal formula with a 22 px step, alternating between two x positions.
- The spine is split into coloured segments, one per list section, like a block copolymer. Each entry gets a dashed side-group line ending in an atom node at the entry's title baseline.
- **Scroll-drawn:** `stroke-dashoffset` follows scroll progress. Use CSS `animation-timeline: view()` where supported and an `IntersectionObserver` + rAF fallback. With `prefers-reduced-motion`, the spine is drawn fully.
- The spine is generated from measured DOM positions and recomputed on resize via `ResizeObserver`. On screens under about 480 px it sits in a 24 px gutter or is hidden; the builder decides, but text must not lose width.

## 5. Pages and information architecture

1. **`/` (home)**, in order:
   - **Hero:** name, a one-line thesis, and links: résumé, GitHub, LinkedIn, email.
   - **Drawing title block:** a strip in the style of mockup A ("Drawn by Sumedh Kothari · Georgia Tech · ChBE + CS · Rev 2026.10").
   - **The periodic table and detail panel.**
   - **About:** a short paragraph, focus areas and skills.
   - **Experience:** a list with the spine.
   - **Research:** a list with the spine, with each entry linking to its element.
   - **Projects:** a list with the spine. It holds every project, including those not on the table (crop predictor, AiApply, GreenGrade, etc.), and each entry that is an element links to it.
   - **Education:** with the spine.
   - **Contact.**

   These lists are also the no-JS and keyboard path to every card-only element's content, so hover panels are never the only way to reach it.

   A sticky **drawing index** navigates sections. On desktop it's a left rail styled as a drawing index (`01 Work`, `02 About`, `03 Experience`, `04 Research`, `05 Projects`, `06 Education`, `07 Contact`). On phones it becomes a horizontal strip.
2. **`/work/<slug>/`**: one statically generated findings page per "Full" or "Restricted" element (`generateStaticParams`). Template:
   - **Header:** the element cell (large), title, dates, affiliation, links (repo, live, Devpost, video), and family and tech as mono tags.
   - **Lead paragraph (2–3 sentences):** problem, idea and headline result, benefit-first.
   - **Key findings:** 2–4 numbered "Fig. n —" figures, each with a one-sentence caption that states the result and its basis (dataset, baseline). The figure is a re-plotted chart (§6), a repo image, or a photo or video.
   - **How it works:** 3–6 steps as a short ordered list or one method diagram.
   - **Details and limits:** one short paragraph at most, for trade-offs and caveats, in plain language.
   - **Previous / next element navigation**, and a back link to the table that keeps scroll position.
3. **`/work/`** (optional): the table alone, for direct linking. The builder decides whether it is needed.
4. **404 page** in the same style.

## 6. Figures and media

- **Charts are re-plotted at build time** from the CSV/JSON in `docs/superpowers/research/` into static inline SVG, using the site's tokens and typography. They need no client-side charting library.
  - The builder may write a small build-time script or React server components that read the data files.
  - Charts follow the shared style: 0-based bar axes, one accent for the owner's method and grey for baselines, mono tick labels, and `font-variant-numeric: tabular-nums`. They must read in both themes.
- **Repo images** go into `public/work/<slug>/`, converted to WebP/AVIF at sensible sizes, with explicit width and height to avoid layout shift. GIFs become MP4/WebM (muted, loop, playsinline, poster frame, `preload="none"`). Video autoplays only when in view and never under reduced motion.
- **Per-project figure plan** (all values must come from the cited research notes):
  - **PolyFrameNet** (`polyframenet.md`, `assets/polyframenet/`):
    - The method diagram is `architecture.png`.
    - **Fig. 1:** ms/step vs atoms, log-log (`l40s_speed_memory.csv`). PFN v2 vs MACE vs Allegro, with OOM markers and callouts 2.5× / 5.5× faster and 3.4× less memory.
    - **Fig. 2:** GPU memory vs atoms, showing 26K atoms where the others run out of memory.
    - **Fig. 3:** the many-body ablation, 115.6 → 44.3 → 34.4 meV/Å (`ablation_8min.json`).
    - **Optional:** `rdf.png`, showing that the melt structure matches MACE.
    - **Do not use** `speed.png` (distorted by laptop paging).
    - The accuracy trade-off appears only in "Details and limits", as one sentence.
  - **PolyT5-RLVR** (`polyt5-rlvr.md`, `assets/polyt5-rlvr/`):
    - **Fig. 1:** valid-polymer rate vs Tg-conditioning slope across rounds (`conditioning_frontier_rounds.csv`). It shows baseline → reward arms → supervised replay recovering 99%.
    - **Fig. 2:** Tg MAE by ablation arm with the pre-registered threshold line (`group_a_tg_ablation.csv`).
    - **Fig. 3:** pretraining scaling, RMSE 62.39 → 44.45 (`pretraining_scaling_tg.csv`).
  - **Panoptic Pigskin** (`panoptic-pigskin.md`, `assets/panoptic-pigskin/`, `data/panoptic-pigskin/`):
    - The hero is the follow-cam MP4 (from the site; `follow.gif` is a fallback) or `catch_follow_cam.jpg`.
    - **Fig. 1:** calibration error on a log bar chart, 6.17 m → 0.15 m (`calibration_vs_tracking.csv`). The caption names the Helmet-Assignment play.
    - **Fig. 2:** implausible motion 17% → 5.5% of body-frames (`surges_before_after.csv`).
    - **Fig. 3:** pose PCK gains from self-training (`pose_finetune_pck.csv`).
    - `film_room_catch.png` and `report_page.png` link to the live Film Room, playground and report.
  - **ML-assisted PSO** (`ml-pso.md`, `assets/ml-pso/`):
    - **Fig. 1:** median final objective, vanilla vs best +ML, per function, on a log scale (`dim50_median_final_objective.csv`).
    - **Fig. 2:** +ML vs the same optimizer without it (`derived_ml_vs_base_improvement.csv`).
    - Griewank appears in Fig. 1 because the data is plotted as is, and is mentioned once in "Details and limits".
  - **GameSense, Robotech, GT Transfer** (`small-projects.md` and their asset folders): photos and CAD renders as figures, plus linked Devpost and YouTube demos. GT Transfer gets one stat row (2,076 schools · 104,073 mappings · 1,461 GT courses) and the live screenshot.
- **Card-only elements:** the detail panel shows the existing `data/` description, tech and links. No page.

## 7. Content rules

- **Numbers:** use only figures supported by the repos, as recorded in `docs/superpowers/research/*.md`. The site's `data/*.ts` was corrected to these in commits 45e6174 and 6b14065, and the October 2026 resume LaTeX matches.
- **Tone:** benefit-first. Each page leads with what the work achieved. Trade-offs get at most one short sentence, in "Details and limits".
- **Witness AI (restricted):** show only the details already on the resume and in `data/` (10K prompts, 60% attack success on Claude/Qwen/Gemma, 1,000+ papers, 3,000+ prompts, 8 LLMs, 3 classifiers). Use no internal figures, diagrams, code or extra research.
  - Their findings pages, if built, are text plus simple stat callouts only.
  - The builder may instead make these two cells card-only. Both are acceptable; prefer the simpler one.
- **Affiliation note:** the PolyFrameNet repo does not mention the Ramprasad Lab. The site states the affiliation as the owner gives it in `data/`.
- **Links:**
  - The arbitrage link stays on `...-theta.vercel.app` (the `-beige` link returns 404).
  - AiApply links to its GitHub repo only.
  - ResumeForge's Hugging Face Space sleeps; label it "may take a moment to wake".

## 8. Source material

- **Research notes** (committed): `docs/superpowers/research/{polyframenet,polyt5-rlvr,ml-pso,panoptic-pigskin,small-projects}.md`. Each lists every number with its repo file and line, plus a figure inventory and suggested figures.
- **Assets** (committed): `docs/superpowers/research/assets/<slug>/` (images, CSV, JSON) and `docs/superpowers/research/data/panoptic-pigskin/`.
  - The notes mention absolute scratchpad paths; the files live at the paths above.
  - Move the images the site uses into `public/work/<slug>/` and optimize them. Leave the research copies alone or delete them once used; the builder decides.
- **Content data:** `data/projects.ts`, `data/research.ts`, `data/experience.ts`, `data/education.ts`, `data/skills.ts`. Extend `lib/types.ts` with element metadata (symbol, family, slug, page kind), either on the existing records or in a new `data/elements.ts`.

## 9. Visual system

- **Type** (mockup A): Newsreader for display (headings, name, lede, italics for emphasis), IBM Plex Sans for body, and IBM Plex Mono for labels, numbers, cell metadata and axis ticks. Load with `next/font/google`, which self-hosts and works with static export. Do not use Inter or Space Grotesk.
- **Palette:** light paper `#f5f6f2`, ink `#1c2433`, muted `#5b6676`, rule `#c9d0d6`, blueprint accent `#2c5aa0`, and red-pencil `#c23b22` for annotation and highlights only. Add the six family colours from mockup C, tuned so each passes contrast as a 4 px bar and as a hover fill with white text. Provide a dark theme with the same structure via `prefers-color-scheme`.
- **Structure devices:**
  - Mono uppercase section labels with numbers that match the drawing index.
  - 1px ruled rows, and two-column entries (mono date and place column, then content).
  - "Fig. n —" captions.
  - Borders mark objects (cells, figure frames, the title block), not every block. No shadows, and radius 0–2 px.
- **Motion:** only three moving things exist: the spine drawing on scroll, the cell → page view transition, and in-view video. All respect `prefers-reduced-motion`. Nothing animates on the home page before interaction except the spine.

## 10. Constraints

- **Static export:** `output: "export"`, deployed by `.github/workflows` to GitHub Pages. Pages source must remain "GitHub Actions".
- **Build environment:** builds hang or break inside the OneDrive-synced repo path, so reproduce builds from a clean copy at a short local path. CI is the deploy gate.
- **Performance budget for the home page:**
  - No client JS beyond the table interactions, spine and transitions (target under about 30 KB gzipped of site JS on top of the framework).
  - LCP is text.
  - CLS about 0.
  - Lighthouse performance 95+ on mobile.
- **Accessibility:** WCAG AA contrast in both themes, visible focus, the table operable by keyboard and labelled for screen readers ("PolyFrameNet, element 1, ML for materials"), and alt text and captions on every figure.
- **Existing content and OG image:** `app/opengraph-image.tsx` stays force-static. Update its look to match, optionally a periodic cell.
- **Commits:** frequent, with messages that explain the reasoning. No attribution trailers, per the owner's CLAUDE.md.
- **Rollout:**
  - Every push to `main` deploys the live site, so build on a feature branch (`redesign/ai4science`) and push that branch freely.
  - The live site switches over in one merge.
  - The owner's CLAUDE.md requires asking before a merge. At that point the owner reviews the built site, including all new copy (hero thesis, panel one-liners, lead paragraphs, figure captions, limits sentences), via screenshots or a local or preview build.
  - Small content fixes to `data/` may still go to `main` meanwhile. Rebase the branch onto it.
- **Optional later idea:** a small static periodic-cell or block-chain illustration in the OG image. No WebGL crystal for now.

## 11. Left to the builder

- Exact cell placement within the 2/8/8 shape, and the final atomic numbering from dates.
- Whether `/work/` exists as a separate index, and whether the Witness AI cells get restricted pages or are card-only.
- The spine's behaviour on phones (narrow gutter vs hidden).
- The chart-generation mechanism: a build script vs server components reading CSV.
- Image formats and sizes.
- Exact dark-theme values.
- Component structure, file layout and test approach. Verify each page renders in a static build; the spine and table must survive no-JS.

## 12. Calls made by Claude (owner should check)

- Findings open as **separate pages with a view-transition "expand"** rather than in-place expansion. This gives linkable URLs and room for figures, and avoids a cramped panel.
- An **18-element roster**: what's on the table, what's card-only, and that PolyUMA and AiApply are off the table.
- **Type and palette** are taken from mockup A, with mockup C's family colours.
- Charts are **re-plotted** in site style rather than embedding repo PNGs, except the PolyFrameNet `architecture.png` and photos.
- **Numbering is oldest = 1**, so numbers stay stable as work is added. The date table in §4.2 settles each element's start date from the resume first.
- A **Projects list** stays on the home page with the spine. It is also the accessible path to card-only content.
- The redesign is built on a **branch** and goes live in one approved merge. The owner reviews all new copy at that merge.
