# polyT5-RLVR — portfolio source material

Repo: https://github.com/sumedhk0/POLYT5-RLVR (only branch: `master`, HEAD `241e6c1`, 2026-10-19)
Local clone: `C:/Users/sumedh/AppData/Local/Temp/claude/C--Users-sumedh-OneDrive---Georgia-Institute-of-Technology-Python-PersonalWebsite/637319ef-4fb5-4672-9d5a-e9416fcaa69a/scratchpad/research/repos/POLYT5-RLVR`

All `results/` are gitignored, so every number below comes from the committed docs (`README.md`, `docs/*.md`) and the small JSONs under `artifacts/`. No per-split or per-step raw logs are in the repo. The only trajectory data is the summary tables in the docs.

## 1. Plain-language summary

- **Problem.** polyT5 (Sahu, Xiong, Savit, Shukla, Ramprasad, *npj AI* 2, 30 (2026), doi:10.1038/s44387-026-00087-1) is a chemical language model that predicts polymer glass-transition temperature (Tg) and generates polymers for a target Tg. Its data and code are not public, and it uses supervised training only.
- **Idea.** (a) Rebuild T5 from scratch in PyTorch (no `transformers`, no pretrained weights) and reproduce the method on public substitute data: 7.46M parameters, pretrained on 92.3M polymers from polyOne. (b) Post-train the generator with GRPO against chemistry-verifiable rewards (RDKit validity, novelty, synthetic accessibility, diversity), with no learned model in the reward. (c) Separately, improve Tg prediction with a 70-run ablation and add conformal uncertainty.
- **Result.** The reproduction lands in the same band as the paper: Tg RMSE 44.45 vs the paper's 40.82 K. Every verifiable reward optimized exactly what it measured. The validity arm raised the valid-polymer rate from 0.526 to 0.901, which cuts invalid generations by 79%. Every arm also destroyed Tg conditioning: slope fell from 0.904 to about 0.27–0.34. A uniform-random control stayed flat, so the rewards caused this, not GRPO. A 2.5× KL penalty recovered under 5% of the loss. **Supervised replay recovered 99% of the lost slope** (0.973) and kept +12.5 points of validity. For prediction, a numeric regression head cut Tg MAE from 28.60 to 27.11 K. It won on both seeds and on all 10 arm/split pairs. Split-conformal intervals are ±54.35 K at 90% coverage.

## 2. Method in diagrammable steps

1. **Build and pretrain.** A from-scratch T5 v1.0 encoder–decoder (polyT5-medium, 7,463,168 params) is pretrained by span corruption on polyOne: 92,293,770 polymers, 7.74B tokens, 2 epochs, effective batch 450 via gradient accumulation, on one RTX 4080 Laptop GPU (12 GB).
2. **Fine-tune two tasks.** (a) Tg prediction as text over five random 80/20 splits of 7,367 LamaLab labels. (b) Tg-conditioned generation: prompt with a target Tg, decode a PSMILES. The result is frozen as an immutable baseline with SHA-256s (`artifacts/baseline/frozen_baseline.json`).
3. **GRPO post-training with verifiable rewards.** For each prompt, sample a group of 16 candidates. Score each with an RDKit/SELFIES cascade (validity), corpus-novelty (ECFP6), SA score, a constraint conjunction, or a composite that includes within-batch diversity. The group-normalized advantage is (r − mean)/std. KL to the reference policy is 0.02. Each arm runs 2000 steps, with a uniform-random-reward control arm.
4. **Score against a frozen protocol.** Targets are 300/400/500 K with 500 samples each and ±50 K tolerance. A held-out "auditor" Tg predictor (split 4) is never in any reward path. Pre-registered metrics and a bootstrap success criterion (2000 resamples, 95%) are used.
5. **Diagnose and fix forgetting.** Round 2 tries a stronger KL anchor (0.05). Round 3 uses supervised replay: `loss += 0.5 × CE` on the 6,619 supervised (target, polymer) pairs.
6. **Prediction side (Group A/B).** A 7-arm × 5-split × 2-seed ablation (70 runs, 9,930 steps each) covers a regression head, descriptor auxiliaries, invariance augmentation, reliability weighting, a multi-task encoder, and all five combined. Split-conformal calibration then wraps the winning model.

## 3. Quantitative results (exact values + source)

### Reproduction
| Result | Value | Baseline / comparison | Source |
|---|---|---|---|
| Model size | 7,463,168 params (7.46M) | Paper Table S2 medium; 0.04% diff | `docs/baseline.md` L176; `docs/reproduction.md` L219 |
| Pretraining corpus | 92,293,770 polymers (7.74B tokens); 83,064,393 train / 4,614,689 val | Paper 100,145,883 (92% of it) | `docs/baseline.md` L189–191 |
| Pretrain val loss | 0.0433 → 0.0349 per epoch (2 epochs) | 9.2M-corpus run 0.0767 | `docs/baseline.md` L189–191 |
| Tg prediction, 5 splits | MAE **28.6733 ± 0.7591 K**; RMSE 44.4485 ± 2.5199; R² 0.8451; Pearson 0.9235 | Paper RMSE 40.82 ± 1.33, R² 0.86, r 0.93 | `artifacts/baseline/frozen_baseline.json` `tg_prediction_5split`; `docs/baseline.md` L365–369 |
| Scaling trajectory (RMSE) | 62.39 (random init) → 49.48 (small, PI1M 0.89M) → 45.85 (medium, 9.2M) → 44.45 (medium, 92.3M) | — | `docs/baseline.md` L365–369 |
| Pretraining effect (small) | MAE −11.59 K (7.0σ), RMSE −12.91 K | from scratch 46.24 / 62.39 | `docs/baseline.md` ~L434–440 |
| Conditional generation baseline | property MAE 47.316 K, PV 0.558, TP 0.5878 (Arm B, T=0.7, top_p=0.95) | Arm A defaults: 50.921 K / 0.562 / 0.5801 | `frozen_baseline.json` `arm_b_tuned_sampling` |

### RLVR (all seed 0, single seed)
| Result | Value | Baseline | Source |
|---|---|---|---|
| Validity arm PV rate | **0.901** | Arm B 0.526; Δ +0.375, 95% CI [0.347, 0.401] | `docs/rlvr_results.md` L18, L32 |
| → invalid-generation reduction | (1−0.526)=0.474 → (1−0.901)=0.099 = **−79.1%** (derived) | — | derived from L18 |
| Validity arm side effects | auditor Tg MAE 36.6 → 150.4 K; TP 0.693 → 0.047; length 63 → 131; near-copy 0.229 → 0.585 | Arm B | L60–63 |
| Accuracy arm (retired, not RLVR) | auditor MAE 36.6 → 21.8 K (−40%), PV 0.526 → 0.284, dup rate 0.635 | Arm B | L68–70 |
| Control (random reward) | PV 0.515, dup 0.129, len 62.9, MAE 36.3: flat | Arm B 0.526 / 0.121 / 63.2 / 36.6 | L45–47 |
| Diversity collapse (unique_fraction start → end) | accuracy 0.951→0.535; novelty 0.949→0.516; synthesisability 0.951→**0.221**; constraint 0.949→0.539; **composite 0.949→0.980** | — | L291–297 |
| Composite gate fraction | 0.328 → 0.035 (candidates failing SV/PV screen) | — | L232 |
| Conditioning slope | baseline 0.904; composite 0.268; validity 0.339 | slope 1.0 = perfect | L344–348 |
| KL sweep (round 2) | composite_kl05: PV 0.918, slope 0.295, TP 0.192; recovered "<5%" (+0.027 slope of a 0.636 gap) | composite kl0.02: 0.915 / 0.268 / 0.138 | L415–423 |
| **Supervised replay (round 3)** | PV **0.790**, slope **0.973**, TP **0.582**; 99% of lost slope recovered; +12.5 pt PV vs baseline | baseline 0.665 / 0.904 / 0.738 | L450–463; README L27–32 |
| Early-stop Pareto point | composite step 200: PV 0.736, TP 0.671 | baseline PV 0.658, TP 0.740 | L357–364 |

### Prediction ablation (Group A) and conformal (Group B)
| Result | Value | Baseline | Source |
|---|---|---|---|
| A1 regression head MAE | seed0 27.17, seed1 27.05, **mean 27.11 K** | B0 28.67 / 28.53 / **28.60 K** | `docs/group_a_results.md` L26–27 |
| → relative reduction | (28.60−27.11)/28.60 = **5.2%** (derived) | — | derived |
| Pre-registered threshold | 27.9142 K (1σ under 28.6733), cleared on both seeds; 10/10 arm/split pairs beat own B0 | No other arm clears it | L27, L36–41 |
| Other arms | A2 28.74, A3 29.68, A4 28.57, A5 30.10, A6 30.23 (means) | — | L28–32 |
| Catastrophic decode | 1 event: B0 seed0 split1 emitted 4293.10 K (truth 481.15 K); r² 0.828→0.051, RMSE 46.75→109.83 | A1 cannot emit digits, so 0 by construction | L63–78 |
| RMSE | A1 40.69–41.32 vs B0 43.46–56.33 | — | L80–81 |
| A5/A6 generation | TP down 0.131–0.182 vs control 0.6164 | — | L101–107 |
| Conformal 90% half-width (shipped) | **54.35 K** (n_cal=400); validated mean coverage **0.900325** over 200 repeated splits at n=200 | target 0.90 | `artifacts/conformal/a1_full_corpus.json` L94–98, L66–71 |
| Conformal 95% / 80% | 79.25 K / 37.85 K; coverage 0.949 / 0.799 | — | same file L88–105 |

### Resume-claim check
| Resume claim | Status |
|---|---|
| 7.5M-param T5, 92.3M polymers | ✅ 7.46M (7,463,168), 92,293,770 polymers. "Reproduced Ramprasad Lab's PolyT5" is accurate as the *method* on substitute data. README says explicitly that it does not reproduce the paper's numbers. |
| GRPO RLVR cut chemically invalid generations by 79% | ✅ Derived: validity arm PV 0.526→0.901 ⇒ invalid 0.474→0.099 (−79.1%). **Caveat:** that arm destroyed Tg conditioning (TP 0.693→0.047) and inflated length 2×. The deployable replay05 model cuts invalid only 0.335→0.210 (−37%), and composite cuts it 0.335→0.085 (−75%). One seed. |
| Regression head: 5.2% (28.60→27.11 K) | ✅ Exact. |
| Eliminated catastrophic decode failures | ✅ By construction. The repo itself calls the empirical support "thin" (1 event in 10 B0 runs). |
| Gain held for both seeds on all 10 splits | ✅ Wording nuance: "10/10 arm/split pairs" = 5 splits × 2 seeds, not 10 distinct splits. |
| 70-run five-factor ablation | ✅ 7 arms (control + 5 single switches + all-combined) × 5 splits × 2 seeds = 70. |
| Split-conformal ±54.35 K at 90% coverage | ✅ Shipped half-width 54.35 K. Coverage 0.900 is the repeated-split validation at n=200. The single-split measured coverage was 0.87 at 52.15 K. |

## 4. Figure inventory

**No image files exist in the repo** (`git ls-files` has no png/jpg/svg/gif/ipynb/csv). The README has no images. There is a web demo (`src/polyt5/app/static/index.html`, `scripts/serve.py`) that could be screenshotted if run locally, but it needs the model checkpoints, which are not committed. All figures must be made from the transcribed tables below.

## 5. Chartable data (copied to `assets/polyt5-rlvr/`)

| File | Source | Chart |
|---|---|---|
| `conditioning_frontier_rounds.csv` | rlvr_results.md L450–455 | **Hero chart**: PV vs conditioning slope scatter (baseline, composite, kl05, replay05). Alternative: grouped bars of PV/slope/TP across the 3 rounds. Also produced-Tg vs target lines (300/400/500) per model against the y=x ideal. |
| `rl_round1_matrix.csv` | rlvr_results.md L15–26 | Small-multiples bar chart: validity vs accuracy vs control vs Arm B on PV, auditor MAE, TP, length, near-copy ("each reward wins its metric, breaks another"). |
| `rl_round1_conditioning_by_arm.csv` | L322–331 | Bar chart of TP rate per arm, or dot plot of mean Tg produced (target avg 400 K). |
| `grpo_trajectories.csv` | L120–127, L164–170 | Line chart over GRPO steps: reward rising while unique_fraction falls (novelty, synthesisability). |
| `diversity_collapse_start_end.csv` | L291–297 | Slope/dumbbell chart of unique_fraction start→end for 5 arms (composite the only one that rises). |
| `composite_checkpoints.csv` | L357–364 | Dual line over steps 0–2000: PV rising vs slope/TP falling ("two failure modes on different schedules"). |
| `group_a_tg_ablation.csv` | group_a_results.md L24–32 | Dot plot of MAE per arm with seed0/seed1 points and the 27.9142 K threshold line. |
| `group_a_generation_check.csv` | L101–107 | Small bar chart: TP drop of A5/A6 vs control. |
| `pretraining_scaling_tg.csv` | baseline.md L365–369 | Line/bar of Tg RMSE vs pretraining corpus size (0 → 0.89M → 9.2M → 92.3M), with the paper's 40.82 as a reference line. |
| `conformal_a1_full_corpus.json` | artifacts/conformal | Calibration plot: target vs measured coverage at 80/90/95% with the p05–p95 band; half-width per level. |

Per-split Tg MAE and per-step reward curves are **not available**. `results/` is gitignored, so only the summary tables exist.

## 6. Links

- Repo: https://github.com/sumedhk0/POLYT5-RLVR
- Key docs: `docs/rlvr_results.md`, `docs/group_a_results.md`, `docs/baseline.md`, `docs/reproduction.md` (blob URLs: https://github.com/sumedhk0/POLYT5-RLVR/blob/master/docs/rlvr_results.md, etc.)
- Paper: https://doi.org/10.1038/s44387-026-00087-1
- Raw data example: https://raw.githubusercontent.com/sumedhk0/POLYT5-RLVR/master/artifacts/conformal/a1_full_corpus.json

## 7. Suggested key-findings figures (real data only)

1. **"Replay fixes forgetting"**: scatter of PV (x) vs conditioning slope (y). Baseline (0.665, 0.904), composite (0.915, 0.268), +KL (0.918, 0.295), +replay (0.790, 0.973). Arrows show the three rounds. Source: `conditioning_frontier_rounds.csv`.
2. **"Rewards optimize what they measure"**: GRPO step vs reward and unique_fraction for novelty and synthesisability, plus composite's start/end unique_fraction (0.949→0.980) as a contrast. Sources: `grpo_trajectories.csv`, `diversity_collapse_start_end.csv`.
3. **"Regression head is the only arm that wins"**: Tg MAE dot plot over 7 arms × 2 seeds with the 27.9142 K pre-registered threshold. Source: `group_a_tg_ablation.csv`.
4. **"Does the model hit the target?"**: produced Tg at targets 300/400/500 for baseline, composite, replay05 against the ideal y=x line. Source: `conditioning_frontier_rounds.csv`.
