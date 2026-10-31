# ML-Assisted Particle Swarm Optimization — portfolio source material

Repo: https://github.com/sumedhk0/ML-Assisted-Particle-Swarm-Optimization
- Default branch: **`Repositioning_Updates_v2`** (HEAD `93fb9f5`, 2026-05-27). Other branches: `main` (`e63f320`, merge of PR #1 by collaborator Quyen Xuan Tran adding rescue-policy benchmarking) and `Repositioning_Updates` (`43ae7d4`, older, no results section).
- `README.md` is **identical** on `main` and `Repositioning_Updates_v2`. v2 adds `analyze_paired.py`, batch GP acquisition, uncertainty-aware explore/exploit split, adaptive `ml_period` (`--ml-v2`), and PACE chunked submitters.
- Local clone (short dir name because of Windows path limits): `C:/Users/sumedh/AppData/Local/Temp/claude/C--Users-sumedh-OneDrive---Georgia-Institute-of-Technology-Python-PersonalWebsite/637319ef-4fb5-4672-9d5a-e9416fcaa69a/scratchpad/research/repos/mlpso`

`out/`, `results/`, `*.jsonl`, `*.npz`, and `*.lgb` are all gitignored. **No raw result files, curves, traces, notebooks, or images are committed on any branch.** Every number below comes from the README "Benchmark snapshot" and "Compute cost" sections (README L366–660).

## 1. Plain-language summary

- **Problem.** Particle swarm optimization stalls in high dimensions. Particles plateau in poor regions and waste the evaluation budget.
- **Idea.** Start from the six GP-directed PSO variants (A1–C2) of arXiv:2102.04172, where a Gaussian-process surrogate fitted to past evaluations steers particles. Add an offline-trained LightGBM "stuck-particle" classifier. Every K iterations it flags the top 20% of particles by P(stuck) and teleports them: half to the GP's lower-confidence-bound minimum (exploit), half to its max-uncertainty point (explore). v2 makes the split uncertainty-aware and the period adaptive. The stack is tensorized in PyTorch/GPyTorch and runs as SLURM arrays on Georgia Tech's PACE cluster.
- **Result.** At 50 dimensions with 51 seeds, the ML layer cut median final objective by 38–93% for the strong variants (B, C1, C2) on all five functions. The best +ML variant beats vanilla PSO on Rastrigin (−53.6%), Ackley (−90.4%), and Rosenbrock (−23.6%). It **loses** on Griewank (+29.9%). The cost is +3.5% to +22.6% wall-clock. Under a fixed 240 s budget on Ackley, *random* rescue beat learned rescue.

## 2. Method in diagrammable steps

1. **Swarm + GP surrogate.** A tensorized swarm evaluates the objective. An exact GP (ARD-RBF kernel, GPyTorch) is fit to a curated memory of evaluations (`memory_manager.py`). Budget = 200 × dim evaluations.
2. **GP-directed motion (variants A1–C2).** Paper-derived rules move particles toward GP-predicted optima (A-family) or relocate them via acquisition searches (B, C1, C2).
3. **Offline classifier training.** About 500 PSO trajectories across dims {5, 10, 20, 50} and ten landscapes produce 11 per-particle features: velocity norm, pbest plateau length, value rank, distance to centroid and to gbest, GP mean and std, GP prediction error, distance to GP memory, iteration progress, and recent value variance. The labels mark stuck particles, and LightGBM is trained on them (`generate_training_data.py`, `train_classifier.py`, `features.py`).
4. **Rescue every `ml_period` (default 5) iterations.** The classifier scores P(stuck), and the top 20% are selected. Half jump to the GP-LCB minimum (exploit) and half to the max-σ point (explore), with jitter. v2 adds batch acquisition for diverse picks, an uncertainty-aware split, and an adaptive period. Alternative selectors are random and heuristic-plateau (`rescue_policies.py`).
5. **Benchmark.** Vanilla PSO, A1–C2, and A1–C2+ML run on Sphere, Rastrigin, Ackley, Griewank, and Rosenbrock at dim 50 with 51 seeds as PACE SLURM arrays. Each run reports the median final value, wall-clock, and time-to-target.

## 3. Quantitative results (exact values + source)

All values are the median final objective over 51 seeds at dim=50 (lower is better), from `README.md` on `Repositioning_Updates_v2`/`main`.

| Function | Vanilla PSO | Best plain GP variant | Best +ML variant | +ML vs plain (same variant) | Best +ML vs PSO | README lines |
|---|---|---|---|---|---|---|
| Sphere | **not reported** | C1 1.132 | C1+ML 0.475 | B −58.3%, C1 −58.1%, C2 20.272→0.901 (−95.6%) | n/a | L372–393 |
| Rastrigin | 201.500 | C1 151.477 | C1+ML 93.443 | B −44.3%, C1 −38.3%, C2 −52.1% | **−53.6%** | L395–417 |
| Ackley | 2.891 | B 0.570 | B+ML 0.278 | B −51.2%, C1 −52.6%, C2 −60.0% | **−90.4%** | L419–440 |
| Griewank | **15.635 (best overall)** | B 65.698 | C1+ML / C2+ML 20.317 | B −68.7%, C1 −69.9%, C2 −69.9% | **+29.9% (worse)** | L442–469 |
| Rosenbrock | 3214.229 | B 21484.953 | C1+ML 2454.871 | B −84.9%, C1 −88.7%, C2 −93.0% | **−23.6%** | L471–494 |

- The A1–A3 family stays poor with or without ML: ±5%, sometimes worse (same tables).
- The README states its own percentages (L590–600): sphere B 58.3%, C1 58.1%; rastrigin B 44.3%, C1 38.3%; ackley B 51.2%, C1 52.6%. The other % values above are computed from the rounded README medians (`assets/ml-pso/derived_*.csv`).

**Rescue-policy comparison** (Ackley, dim 50, fixed 240 s wall-clock, README L496–537):

| Variant | none | learned | random | heuristic |
|---|---|---|---|---|
| B median | 0.657 | 0.647 | **0.600** | 0.667 |
| C1 median | 0.805 | 0.782 | **0.613** | 0.826 |
| B hit ≤0.5 | 0.059 | 0.118 | **0.255** | 0.098 |
| C1 hit ≤0.5 | 0.039 | 0.059 | **0.235** | 0.039 |

Under a time cap, random rescue was strongest and learned rescue only beat no rescue.

**Compute overhead** (README L558–571): average CPU chunk runtime baseline → ML: Sphere 2.08→2.33 h (+11.9%), Rastrigin 3.80→4.66 h (+22.6%), Ackley 4.02→4.16 h (+3.5%). One-time data generation costs about 3.0–3.3 GPU-hours and classifier training 0.02–0.19 CPU-hours.

### Resume-claim check — **mostly NOT verifiable**

| Resume claim | Status |
|---|---|
| $1,000 PACESHIP grant | ⚠️ Not stated. The only trace is the SLURM account default `paceship-pso` (`scripts/pace/run_v2_chunked.sh` L37), which is consistent with a PACESHIP allocation but has no dollar amount. |
| GP surrogate + LightGBM repositioning of stagnating particles | ✅ README L9–17, L63–86; code. |
| Adaptive exploration–exploitation | ✅ Explore/exploit split (README L16). Adaptive period and uncertainty split are v2 flags (`gp_directed_optimizer.py` L55–56, L189; `experiment.py` L214). |
| "Autoresearch loop" | ❌ **Not found** on any branch (grep for "autoresearch" returns nothing). |
| 28% average improvement over baseline PSO | ❌ **Not reproducible.** The best +ML vs vanilla PSO is Rastrigin 53.6%, Ackley 90.4%, Griewank −29.9%, Rosenbrock 23.6%, with no Sphere PSO row. The mean of those four is 34.4%, not 28%. |
| Sphere 97.8% | ❌ No vanilla-PSO Sphere number in the README. No pair of README Sphere medians gives 97.8% (closest: C2→C2+ML 95.6%). |
| Rastrigin 99.9% | ❌ **Contradicted.** The best possible reduction from README medians is 53.6% vs PSO (81.3% from A3 to C1+ML). A 50D Rastrigin median of 93.4 cannot be a 99.9% reduction from 201.5. |
| Ackley 90.4% | ✅ Matches PSO 2.891 → B+ML 0.278 = 90.38% (README L419–433). |
| Rosenbrock 58.8% | ❌ PSO→best+ML = 23.6%; plain→+ML = 84.9–93.0%. No README pair gives 58.8%. |

The resume numbers probably come from a different run set (another dimension or a later v2 run) that is not committed. Ask the user for the source before publishing them. Also note that **Griewank, where ML is worse than PSO, is omitted** from the resume list.

Other repo inconsistencies:
- README L711–720 "Reference" attributes arXiv:2102.04172 to "Yan, Xinyue, and Jun Lu", while L26–37 attribute it to Jakubik, Binding & Feuerriegel (2021). The latter matches the arXiv ID.
- The README's own "Bottom line" (L648–659) says the ML variants are better in quality, not cheaper in compute, and that time-to-optimum is not yet claimable.

## 4. Figure inventory

**No images, GIFs, notebooks, or result files exist on any branch.** The repo can render trajectory GIFs (`render_trace_animation.py`, with PCA for >2D) and convergence NPZs (`--curve-dir`), but none were committed. Running `python main_gp.py --dim 2 --func rastrigin --variant C1 --use-ml --trace-out ...` then `render_trace_animation.py` locally would produce a portfolio GIF. That requires the trained `stuck_classifier.lgb`, which is also not committed, so the training pipeline must run first. `assets/ml-pso/` therefore contains only CSVs.

## 5. Chartable data (copied to `assets/ml-pso/`)

| File | Source | Chart |
|---|---|---|
| `dim50_median_final_objective.csv` | README L372–494 (long format: function, variant, base_variant, ml, median) | Per-function grouped bars, plain vs +ML, for A1–C2 with vanilla PSO as a reference line. Use a log y-axis because Rosenbrock spans 2.4e3–3.1e5. |
| `derived_ml_vs_base_improvement.csv` | computed from above | Heatmap of variant × function, % reduction from the ML layer. B/C rows are strongly positive and A rows near zero. |
| `derived_best_ml_vs_vanilla_pso.csv` | computed from above | Diverging bar chart: best +ML vs PSO per function (Ackley −90.4, Rastrigin −53.6, Rosenbrock −23.6, Griewank +29.9). |
| `ackley_rescue_policy_240s.csv` | README L507–526 | Grouped bars of median and hit-rate for none/learned/random/heuristic, for B and C1. |
| `ml_runtime_overhead.csv` | README L558–563 | Paired bars of baseline vs ML hours, or a quality-gain vs runtime-overhead scatter. |

Convergence curves per benchmark function are **not available**. That instrumentation exists, but no curve files are committed.

## 6. Links

- Repo: https://github.com/sumedhk0/ML-Assisted-Particle-Swarm-Optimization
- README (default branch): https://github.com/sumedhk0/ML-Assisted-Particle-Swarm-Optimization/blob/Repositioning_Updates_v2/README.md
- PLAN (research reframing toward cost-benefit study): https://github.com/sumedhk0/ML-Assisted-Particle-Swarm-Optimization/blob/Repositioning_Updates_v2/PLAN.md
- Base method: https://arxiv.org/abs/2102.04172 (Jakubik, Binding, Feuerriegel 2021)

## 7. Suggested key-findings figures (real data only)

1. **"ML rescue rescues the strong variants"**: plain vs +ML medians for B, C1, C2 on the five functions (log scale) with a vanilla-PSO reference line. Source: `dim50_median_final_objective.csv`.
2. **"Where it beats PSO, and where it doesn't"**: diverging bars of best +ML vs vanilla PSO (Ackley −90.4%, Rastrigin −53.6%, Rosenbrock −23.6%, Griewank +29.9%). This shows the honest picture. Source: `derived_best_ml_vs_vanilla_pso.csv`.
3. **"Under a time budget, random wins"**: Ackley 240 s hit-rate ≤0.5 by rescue policy. Source: `ackley_rescue_policy_240s.csv`.
4. Optional, **cost vs benefit**: ML overhead (+3.5 to +22.6%) against median gain for Sphere/Rastrigin/Ackley. Sources: `ml_runtime_overhead.csv` + `derived_ml_vs_base_improvement.csv`.
