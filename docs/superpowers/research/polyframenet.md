# PolyFrameNet — project-page source material

Repo: https://github.com/sumedhk0/PolyFrameNet (branch `main`, MIT). Cloned at
`scratchpad/research/repos/PolyFrameNet`. Paths below are repo-relative unless noted.
Raw URL prefix: `https://raw.githubusercontent.com/sumedhk0/PolyFrameNet/main/`

Note: the repo itself does not name the Ramprasad Lab or Georgia Tech. That affiliation
comes only from the resume/site (`data/research.ts`, `data/experience.ts`).

## 1. Plain-language summary

To simulate polymers with quantum accuracy you need a machine-learned potential that
handles tens of thousands of atoms. General-purpose models like MACE and Allegro pay for
rotational symmetry with equivariant tensor products on every edge. That makes them slow
and memory-hungry: on a 46 GB L40S, both run out of memory on a 26k-atom polyethylene melt.
PolyFrameNet uses three facts about polymers: they are built from a few repeating
building blocks, their covalent bonds never change, and bonded atoms define local
directions. It cuts the bond graph into rigid blocks and gives each block local coordinate
frames, so every network can be a plain MLP. It averages over every frame drawn from
Weisfeiler–Lehman colour classes, which makes the energy exactly invariant to rotation,
reflection and relabelling, and makes forces exact gradients.

Each model trained for 90 min on the same data. Against MACE on an L40S, the general v2
model runs 2.5× faster at 1k atoms and 5.5× faster at 8k atoms, uses 3.4× less memory at
8k atoms, and still runs at 26k atoms. The cost is about 2× MACE's force error on mixed
hydrocarbons (43.4 vs 19.7 meV/Å). The polyethylene-only v1 model ties MACE on force error
(13.71 vs 13.73 meV/Å).

## 2. Method (diagram-ready)

1. **Bond graph → rigid blocks.** Bonds are read once from covalent radii
   (r < 1.2·(r_cov,i + r_cov,j)) and then frozen, because the potential is non-reactive.
   Block rule (`src/frame_potential/v2/graph.py` docstring, lines 5-10):
   - each ring system is one block;
   - each other non-terminal atom is its own block;
   - terminal atoms (H) join their neighbour's block;
   - linear sp carbons merge with their neighbours.

   Example from the figure: polystyrene → CH₂ block + CH block + phenyl-ring block.
2. **Frames from WL colour classes.** Weisfeiler–Lehman refinement colours the atoms.
   Each frame variant is built from:
   - an anchor class c;
   - neighbour classes a and b, which give e1 and e2 by Gram–Schmidt, with e3 = e1×e2;
   - a mirror sign ±1.

   Classes are chosen by colour, never by individual atom or by geometry. The variant set
   is therefore closed under rotation, reflection and permutation. Blocks with no anchor
   (ions, CO₂, H₂) get one frame-free row (graph.py lines 12-18).
3. **What the MLP sees.**
   - **Block encoder** (one MLP shared by all block types): atom coordinates in the frame,
     F_vᵀ(r − o), plus intra-block pair distances.
   - **Bonded message passing**, 3 layers on the sparse block graph: J's atoms projected
     into I's frame.
   - **Valence prior:** learnable 1-2 / 1-3 / 1-4 distance terms.
   - **Many-body layer** (4.5 Å): Cartesian moments M0, M1, M2 are projected into the
     frame (Fᵀ M F) and give 2- to 4-body products (the ACE/MACE trick without spherical
     harmonics).
4. **Frame averaging ⟨·⟩_v.** Every stage that sees a frame is evaluated for all frame
   variants and then mean-pooled. This gives exact O(3) and permutation invariance and a
   smooth energy, with no "select one frame" discontinuity.
5. **Energy and forces.** E = Σᵢ(εᵢ + vᵢ) + E_Coul (latent charges, erf / Ewald) +
   E_disp (learned C6 dispersion to 10 Å) + Σ E0(Zᵢ). E0 is stored as int64 micro-eV and
   summed in float64. Forces are F = −∂E/∂r by autodiff.
6. **Block registry** (diagnostic only). Each block is hashed at three levels: L0
   composition, L1 one WL round, L2 exact WL. At inference each block is flagged as
   seen / similar / novel relative to the training set (`src/frame_potential/v2/registry.py`
   lines 1-7).

The ready-made diagram is `docs/figures/architecture.png` (§4).

## 3. Key results (all with sources)

### 3a. v2, equal compute: 90 min training each, on the same 3,429 training frames

**Accuracy.** MAE in float64 on identical splits. Sources:
`docs/results/l40s/eval_l40s/all.json`, `allegro_test.json`, `allegro_pe.json`,
`docs/results/l40s/results.json`, and writeup `docs/writeup.md` §8.4 (lines 598-603).

| Model | Epochs | Test E MAE (meV/atom) | Test F MAE (meV/Å) | Test F RMSE | PE-test E MAE | PE-test F MAE | PE-test F RMSE |
|---|---|---|---|---|---|---|---|
| PolyFrameNet v2 (673,136 params) | 312 | 1.185 | 43.39 | 91.64 | 0.425 | 18.53 | 26.38 |
| MACE | 70 | **0.761** | **19.66** | 33.33 | **0.393** | **10.65** | 15.39 |
| Allegro* | ~18 | 1.501 | 47.21 | 94.97 | 0.687 | 23.58 | 32.98 |

- Test set: 782 frames. PE test: v1's 77 held-out frames.
- *Allegro trained 90 min on a **laptop RTX 4080**, not the L40S (one_pager.md footnote;
  writeup line 602).
- v2 validation, for reference (`results.json`): F MAE 65.70, E MAE 3.58 (650 frames).
- v2 best validation F MAE was 63.29 meV/Å at epoch 147 of 312 (`docs/results/l40s/history.json`).
  The writeup says it plateaued around epoch 120 and calls this a capacity gap, not
  under-training (line 615).

**Inference speed and peak GPU memory.** Float32 on an idle L40S through ASE, median of 20
energy+force calls on a periodic PE melt (`docs/results/l40s/bench_l40s/speed_*_r{1,2,3}.json`;
writeup lines 600-611):

| Model | 976 atoms ms/step (GB) | 7,808 atoms ms/step (GB) | 26,352 atoms ms/step (GB) |
|---|---|---|---|
| PolyFrameNet v2 | **22.9** (0.25) | 81.2 (3.62) | 551 (27.9) |
| PolyFrameNet v1 (PE-only) | 29.5 (0.15) | **33.8** (1.06) | **67.1** (3.50) |
| MACE | 58.5 (1.58) | 447.8 (12.35) | OOM (41.6 GB at failure) |
| Allegro (eager, uncompiled) | 55.8 (4.46) | OOM | OOM |

Ratios I derived from the JSON:
- v2 vs MACE speed: 2.55× at 976 atoms, 5.51× at 7,808 atoms.
- v2 vs MACE memory: 6.4× less at 976 atoms, 3.4× less at 7,808 atoms.
- v2 vs Allegro: 2.43× faster and 18× less memory at 976 atoms.

### 3b. v1 (polyethylene only) vs MACE on identical PE data

Setup: laptop RTX 4080, 12 GB. Sources: `docs/results/accuracy_test.json`,
`pfn_final_results.json`, writeup lines 13-22 and 273-292.

| | PolyFrameNet v1 | MACE |
|---|---|---|
| Test E MAE (meV/atom) | 0.327 | **0.280** |
| Test F MAE (meV/Å) | **13.71** | 13.73 |
| Test F RMSE (meV/Å) | 20.84 | **19.65** |
| Parameters | 656k | 213k |
| Training | 90 min, 392 epochs | 300 epochs, ~101 min |

Training was equal in data, not compute, and the two runs shared the GPU. The force RMS of
the data is 706 meV/Å, so both MAEs are about 2% of it.

**v1 speed on the 12 GB laptop** (`docs/results/md/speed_*.json`, writeup lines 358-364):

| Atoms | v1 ms/step (GB) | MACE ms/step (GB) | ns/day at 1 fs, v1 vs MACE |
|---|---|---|---|
| 976 | 48 (0.15) | 112 (1.6) | 1.78 vs 0.77 |
| 7,808 | 69 (1.1) | 5,946 (12.4) | – |
| 26,352 | 161 (3.5) | 81,593 (41.6) | 0.54 vs 0.001 |

The MACE times at 8k and 26k atoms measure memory paging on the 12 GB card, not compute.
The writeup says so itself (lines 369-375).

**NVE energy conservation.** 976 atoms, 3 ps, dt 0.5 fs (`docs/results/md/nve_*.json`,
writeup lines 399-402):

| | Drift (meV/atom/ps) | Std of E_total (meV/atom) |
|---|---|---|
| v1, float32 | 0.0003 | 0.014 |
| MACE, float32 | −0.020 | 0.457 |

Caveat: the MACE float32 trace is mostly E0 rounding noise (writeup §4.5). A float64 MACE
run was never completed.

**NVT melt at 450 K, 2 ps** (`docs/results/md/nvt_*.json`):

| | v1 | MACE |
|---|---|---|
| Mean T (K) | 440.8 | 439.8 |
| Trans fraction | 0.685 | 0.682 |
| Mean end-to-end distance, C40 (Å) | 26.5 | 26.4 |

The intermolecular C–C g(r) curves overlap. The run is not equilibrated, and the density
is 0.50 g/cm³.

**Ablation, 8-min runs** (`docs/results/ablation_8min.json`, writeup lines 327-331). Test
F MAE by what the many-body (Stage 4) channel sees:

| Stage 4 sees | Test F MAE (meV/Å) |
|---|---|
| Pairs more than 2 block hops apart (spec default) | 115.6 |
| Everything except the atom's own block | 44.3 |
| All pairs | **34.4** |

The spec default is therefore 3.4× worse than keeping all pairs. Two other short runs
(writeup lines 304-317):
- Adding the valence prior cut validation F MAE from about 340 to 121 meV/Å.
- Batches of 1,000 atoms gave 144 meV/Å vs 318 for 2,500-atom batches at epoch 10.

**Frame conditioning** (`accuracy_test.json`): minimum sin(H, e1) is 0.79 for mid blocks
(n = 14,732) and 0.80 for end blocks (n = 8,932). The minimum |s| is 0.58.

### 3c. Data and tests

- **v2 data** (writeup lines 559-567): 4,861 frames, **876k atoms**. Split by system: 3,429
  train / 650 val / 782 test. Block counts:
  - CH₂: 141.8k;
  - CH₃: 63.5k;
  - CH: 18.9k;
  - phenyl: 7.5k;
  - fused rings of up to 26 atoms.
- **Source data:** OPoly26 at ωB97M-V/def2-TZVPD, through the ColabFit mirror. Only C/H
  frames were used (70k available). The v1 PE subset is 631 frames, 75,458 atoms and 326
  systems.
- **Tests:** "81 correctness tests, about 30 s on Linux" (README; writeup line 571). The
  test files define 62 test functions across 6 files plus parametrize expansions; I did
  not run pytest.
- **What the tests check** (writeup lines 573-590), on an untrained float64 model:
  - rotation, permutation, reflection and wrap invariance to 1e-9 eV;
  - finite-difference forces to 1e-8 eV/Å, including through Ewald;
  - all of the above on heteroatom fragments never trained on: ether, amide, ester, C–Cl,
    CF₄, pyridine, thiophene, nitrile, CO₂, water, and PEO with Na/Cl;
  - a true variant-set oracle with optimal assignment;
  - negative controls.

### 3d. Resume claim check

| Resume claim | Status |
|---|---|
| Graph-defined rigid blocks, local frames, plain MLPs, exact O(3) and permutation symmetry via WL frame averaging | ✅ Matches the README, graph.py and writeup §8.1 |
| 2.5–5.5× faster than MACE | ✅ 2.55× at 976 atoms, 5.51× at 7,808 atoms (bench_l40s) |
| "…than MACE **and Allegro**" (2.5–5.5×) | ⚠️ Allegro has one data point: 2.43× at 976 atoms (rounds to 2.4×). It ran out of memory at 8k, so no 5.5× exists vs Allegro. |
| 3.4× less GPU memory than MACE | ✅ Only at 7,808 atoms (12.35 / 3.62 GB). At 976 atoms it is 6.4×. |
| 3.4× less memory than Allegro | ⚠️ Not supported. At 976 atoms it is 18×, and Allegro ran out of memory beyond that. |
| "Matched training budget (90 min, one L40S)" for MACE and Allegro | ⚠️ True for MACE and v2. **Allegro trained on a laptop RTX 4080**; only its inference was timed on the L40S. |
| 876K-atom OPoly26 data | ✅ writeup line 563 |
| Matched MACE force error on PE, 13.7 meV/Å | ✅ but needs a caveat. This is **v1 (PE-only)** vs a PE-only MACE: 13.71 vs 13.73, on a laptop RTX 4080, not the 90-min L40S run. At equal L40S compute, v2's PE-test force error is 18.5 vs MACE's 10.6. |
| Scaled to 26K-atom melts | ✅ 26,352 atoms: v2 at 551 ms/step, v1 at 67 ms/step. MACE and Allegro ran out of memory. |
| Open-sourced PyTorch/ASE code plus trained weights | ✅ `models/*.pt` and the ASE calculator |
| 81-test correctness suite | ✅ as stated in the README (not re-run here) |
| Block registry flags out-of-training chemistries | ✅ registry.py and the model card |
| Accuracy | ⚠️ Omitted from the resume: v2's force MAE is about 2.2× MACE's on hydrocarbons (43.4 vs 19.7 meV/Å) |

Internal inconsistency in the repo: writeup §8.6 (lines 647-649) still says "77.5 min of
training on one laptop GPU" and "MACE got about twice the wall clock". §8.4 and the
one-pager say 90 min each on the L40S. §8.6 looks stale.

## 4. Figure inventory (all copied to `scratchpad/research/assets/polyframenet/`)

| Path | Raw URL | Pixels | Shows | Portfolio quality? |
|---|---|---|---|---|
| docs/figures/architecture.png | https://raw.githubusercontent.com/sumedhk0/PolyFrameNet/main/docs/figures/architecture.png | 1892×2112 | Full architecture flow, bottom to top: atoms → rigid blocks → WL frame variants → shared block encoder → bonded message passing ×3 → 4.5 Å many-body layer → readout → Σ. Side boxes for valence prior and long range. An inset shows how a polystyrene repeat unit is cut into CH₂, CH and phenyl blocks with e1/e2 arrows. Energy equation at top. | **Yes, hero image.** Clean and white-background. Tall, so crop or scale it. |
| docs/figures/submission.png | …/docs/figures/submission.png | 1628×539 | 3 panels: (a) force MAE vs ms/step at 1k atoms for PFN, MACE, Allegro; (b) log-log ms/step vs atoms for PFN, PFN PE-only, MACE, Allegro, with OOM ×'s; (c) PE force MAE bar chart, 13.7 vs 13.7 | **Yes**, the best results summary. Small text; off-white background. |
| docs/figures/learning_curves.png | …/docs/figures/learning_curves.png | 1440×544 | v1 vs MACE validation E and F MAE vs epoch (log y) on PE; the curves converge together | OK, secondary. These are v1 (PE) curves, not v2. |
| docs/figures/nve.png | …/docs/figures/nve.png | 960×512 | NVE total-energy deviation over 3 ps, 976 atoms: PFN flat near 0.18 meV/atom, MACE float32 noisy to 1.75 | Usable, but needs the caveat that MACE noise is a float32 artifact. Risky as a "finding". |
| docs/figures/rdf.png | …/docs/figures/rdf.png | 960×512 | Intermolecular C–C g(r) at NVT 450 K: PFN and MACE overlap | Yes as a "physically consistent" panel. Modest. |
| docs/figures/speed.png | …/docs/figures/speed.png | 768×544 | v1 vs MACE ms/step vs atoms on the **12 GB laptop** (MACE paging up to 81 s) | **Avoid**: the comparison is distorted by paging and superseded by the L40S data. |
| docs/submission/one_pager.pdf | …/docs/submission/one_pager.pdf | PDF | One-page hackathon summary (copied) | Link-worthy |

No notebooks, SVGs or other images are in the repo. `lightning_logs/` holds only a
1-epoch Allegro smoke log.

## 5. Chartable data (in `assets/polyframenet/`)

| File | Contents | Chart |
|---|---|---|
| `l40s_speed_memory.csv` (I built it from the bench JSON) | ms/step and peak GB for v2, v1, MACE and Allegro at 976 / 7,808 / 26,352 atoms, with OOM status | Log-log ms/step vs atoms with OOM markers. Grouped bars of peak memory with a 46 GB card line. |
| `l40s_accuracy.csv` (I built it) | E/F MAE and RMSE for every model and split | Accuracy-vs-speed scatter (F MAE vs ms/step at 1k atoms). Grouped bars of test and PE-test F MAE. |
| `l40s_eval_all.json` | Raw v2 and MACE evaluation | – |
| `v2_l40s_history.json` | 105 validation checkpoints for v2: epoch, minutes, E/F MAE/RMSE | v2 validation F MAE vs wall-clock minutes, showing the plateau (no MACE curve for v2 in the repo) |
| `ablation_8min.json` | 5 eight-minute runs with different exclusion rules | Bar chart of test F MAE: 115.6 → 44.3 → 34.4 (with the 3.4× callout) |
| `accuracy_test.json` | v1 vs MACE on PE, plus frame-conditioning statistics | Tie bars (13.71 vs 13.73) |

In the repo but not copied:
- `docs/results/md/nve_*.json`: about 75 KB each, with a full trace_t_ps and energy trace.
  It could re-plot nve.png.
- `docs/results/md/nvt_*.json`: rdf_counts.
- `docs/results/mace_val_curve.log`: the MACE PE validation curve.
- `docs/results/pfn_final_history.json`: the v1 training history.

## 6. Links

- Repo: https://github.com/sumedhk0/PolyFrameNet
- Weights and model card: https://github.com/sumedhk0/PolyFrameNet/tree/main/models
  - `polyframenet_v2_hydrocarbon.pt` (2.7 MB, 673k params)
  - `polyframenet_v2_hydrocarbon.registry.json`
  - `polyframenet_v1_pe.pt` (2.6 MB, 656k params)
- Writeup: https://github.com/sumedhk0/PolyFrameNet/blob/main/docs/writeup.md
- One-pager: https://github.com/sumedhk0/PolyFrameNet/blob/main/docs/submission/one_pager.md (and .pdf)
- Architecture explainer: https://github.com/sumedhk0/PolyFrameNet/blob/main/docs/explainer/architecture_explained.md
- Baseline configs: https://github.com/sumedhk0/PolyFrameNet/tree/main/baselines
- Data: OPoly26 (Levine et al., arXiv 2512.23117), ColabFit mirror `colabfit/OPoly26-train`
- No paper or preprint of PolyFrameNet itself. Docs call it a "hackathon build, 2026-10-21".

## 7. Suggested key-findings figures (real data only)

1. **"How it works"**: `architecture.png` as is, possibly cropped to the polystyrene inset
   plus the stack.
2. **"Scales where equivariant models run out of memory"**: re-plot ms/step vs atoms
   (log-log) from `l40s_speed_memory.csv`.
   - v2 points: 22.9 / 81.2 / 551 ms.
   - v1 points: 29.5 / 33.8 / 67.1 ms.
   - MACE: 58.5 / 447.8 ms, then OOM.
   - Allegro: 55.8 ms, then OOM.
   - Callouts: "2.5× / 5.5× faster than MACE" and "3.4× less memory at 8k atoms".
   - Alternative: reuse panel (b) of `submission.png`.
3. **"Honest accuracy–speed trade-off"**: scatter of test F MAE vs ms/step at 1k atoms.
   - PFN v2: (22.9 ms, 43.4)
   - MACE: (58.5 ms, 19.7)
   - Allegro*: (55.8 ms, 47.2)

   Add the PE-only tie as a side bar (13.71 vs 13.73, v1 vs MACE). Alternatively reuse
   panels (a) and (c) of `submission.png`.
4. **"Design lesson: let the many-body layer see everything"**: bars from
   `ablation_8min.json`: 115.6 → 44.3 → 34.4 meV/Å test F MAE. Optionally pair with
   `rdf.png` to show that MD with PFN reproduces MACE's melt structure.

## PolyDYN

- **In the user's GitHub repos:** no PolyDYN repo among the 22 public repos (GitHub API
  listing). "polydyn" does not appear in PolyFrameNet. polyuma and POLYT5-RLVR READMEs
  were checked with no match.
- **On the website:** it appears only in this repo:
  - `data/research.ts` lines 14-21: "A multi-agent LLM framework for autonomous polymer
    design and discovery, using MLIP-driven property screening…", status In Progress;
  - `data/experience.ts` line 13.
- **Related public repos that might feed it:** `polyuma` (no description) and
  `POLYT5-RLVR` ("Reproduction and GRPO-RL Post-Training of POLYT5 - Polymer
  Encoder-Decoder Generation Model"). Neither is confirmed as PolyDYN.
- **Conclusion:** no source material exists for a PolyDYN page.
