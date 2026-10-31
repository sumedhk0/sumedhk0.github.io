# Panoptic Pigskin — portfolio source material

Research date 2026-10-31. Sources: shallow clones (HEAD only) of `sumedhk0/PanopticPigskin` (the cleaned public repo),
`sumedhk0/NFLGSPLAT` (the development repo; holds the 7,660-line lab notebook `docs/HANDOFF.md` and the validation
scripts), `GRIDIRON-GAMEVIEWER` and `TEST-NFL-SPLAT` (early prototypes), plus the live site https://panopticpigskin.tech/.
Clones: `scratchpad/research/repos/<Repo>`. Paths below are repo-relative.

---

## 1. Plain-language summary

**Problem.** NFL teams get precise player-tracking data, but the public only gets broadcast video. Broadcast cameras
pan, tilt and zoom every frame, the sideline camera cannot tell how far away a player is, and players pile up and
hide each other — so turning TV footage into a 3D replay is hard.

**Idea.** Use the two All-22 broadcast clips of one play (sideline + endzone). Solve both moving cameras on every
frame from the field's own paint (yard lines, hashes, numerals), with players' known height pinning the lens. Detect,
track and name all 22 players (YOLOv8 + EasyOCR jersey numbers), join them across the two views, fit a full SMPL-X
human body to what both cameras saw, then place each body on the turf — using the endzone camera to fix the depth the
sideline camera cannot see. Render the result as Gaussian splats from any viewpoint, and compute football analytics
(time to throw, separation, air yards, YAC, pocket pressure) from the 3D tracks.

**Result.** On the demo play (Ravens at Chiefs, 2024 Wk 1, Mahomes → Noah Gray, 9.7 yd) the replay draws exactly
11 v 11 on all 213 live frames (snap to whistle), with 0 teleport steps, 0 hops, and 4.3 % of body-frames over a
25 m/s² acceleration threshold. On an external dataset with official NFL tracking (Kaggle NFL Helmet Assignment),
the shared-centre camera solve triangulates players to 0.15 m (held-out players) vs 6.17 m for naive per-frame
calibration — ≈41×. The site ships three rendered angles, an interactive in-browser "Film Room" (any seat, both
broadcast poses, first person), and a per-player graded report.

---

## 2. Pipeline (6 diagrammable stages)

| # | Stage | What happens | Key code |
|---|---|---|---|
| 1 | **Two broadcast clips** | Sideline + endzone All-22 clips, 59.94 fps; endzone offset measured from moving players (−15 frames on play 1). | `scripts/05o_clip_offset.py`, `plays/.../events.json` |
| 2 | **Camera calibration** | Each PTZ camera solved per frame from field paint; one shared camera centre per play (tripod) makes focal determined; players' height fixes the lens; refine every frame; move into rule-book field frame; endzone camera on its own paint. | `nfl_gsplat/calibration/*` (`from_paint.py`, `joint_solve.py`, `refine_paint.py`), `08_reconstruct_all22.py`, `08e`, `08d`, `08l` |
| 3 | **Players: detect → track → identify** | YOLOv8 person detection, 3D-on-turf linking, kit splits, EasyOCR jersey numbers, cross-camera pairing by number/kit/ankle rays, twin folding, id-switch cuts, nflverse roster names. | `nfl_gsplat/tracking/*`, `identity/*`, `08c`, `08i`, `08k`, `08o`, `08r/08s`, `08t/08u` |
| 4 | **Pose: keypoints → SMPL-X** | YOLOv8x-pose 17 keypoints in both views → self-trained per-play copy on SMPL-X pseudo-labels (09g/09h, 30 epochs) → triangulate → SMPL-X fit to both cameras at once; SMPLest-X initial poses. | `05m`, `09g`, `09h`, `05n`, `05f`, `05p`, `05r`, `05c`; `nfl_gsplat/pose/pseudo_labels.py` |
| 5 | **Placement + timeline** | Feet traced to turf; each sideline body slid along its own camera ray onto the endzone detection ("depth snap"); path smoothed hardest along the camera's blind (depth) axis (31 frames vs 9 across); feet anchored; helmet triangulation for men neither camera places; ball events, gait, foot-lock, tackle. | `nfl_gsplat/render/depth_snap.py`, `render/timeline.py` (`XY_ALONG_WINDOW=31`), `render/play_timeline.py` |
| 6 | **Outputs** | (a) Gaussian-splat render (follow cam, skycam, either broadcast camera's solved pose) in team kits, stadium bowl; (b) Film Room WebGL viewer; (c) per-player report (facts.json → HTML). | `05k_render_hifi.py`, `viewer/play_room.html`, `report/analyze.py`, `report/build_report.py` |

Cross-cutting: **rulers** (census, steps, hops, surges, joint jitter, hinge angles) read from what the renderer draws
gate every change — `scripts/07l_measure_plausibility.py`, `eval/surge_ruler.py`, `scripts/09d_joint_rulers.py`,
`docs/RULERS.md`.

---

## 3. Quantitative results (exact values + sources)

### 3a. Resume claims — verification

| Resume claim | Verdict | Evidence |
|---|---|---|
| "validated at **0.15 m median error** against official NFL player-tracking data" | **Verified, with caveats.** 0.15 m is the *held-out* xy triangulation error (in-sample 0.13 m) on Kaggle **NFL Health & Safety Helmet Assignment** play **57583/82**, whose `train_player_tracking.csv` is official 10 Hz NFL tracking. Caveats: (1) single play; (2) cameras were calibrated from the dataset's *labelled helmet boxes + tracking* (half the squad), scored on the other half — so it's the **geometry's error floor with identity given**, not an end-to-end score of the full pipeline on the demo play (the code says so explicitly); (3) "median" — 07c prints a median across plays; the docstrings just say "0.15 m". | NFLGSPLAT `nfl_gsplat/calibration/from_helmets.py:26-30, 170-174`; `scripts/07c_measure_accuracy.py:22-34, 56-63, 204`; `scripts/07_fetch_helmet_dataset.py:1-25` |
| "**41× below per-frame calibration**" | **Verified arithmetic**: 6.17 m (per-frame homography calibration) ÷ 0.15 m = 41.1×. (Vs in-sample 0.13 m it would be 47×.) | `from_helmets.py:28-30`; `from_paint.py:1003-1004` ("took the helmet-fitted cameras from 6.17 m to 0.13 m") |
| "self-trains YOLOv8x-pose per play on **115K SMPL-X pseudo-labels**" | **Number found but definition differs.** The shipped fine-tune dataset `pose_ds2` has **114,988 keypoint *slots*** (6,764 player instances × 17 COCO keypoints, 395 images). Not all are SMPL-X projections: slots are labelled `fit_self`/`fit_cross` (SMPL-X fit reprojected), `det` (detector's own point) or `none` (unlabelled). The sister dataset pose_ds4 broke down as det 34.9 %, fit_self 41,196, fit_cross 6,791, none 26,906 of 114,971; for pose_ds1 fit_self 48.5 % + fit_cross 16.3 %. **Safer phrasing:** "~115K keypoint labels, most projected from the two-camera SMPL-X fit" or "≈6.8K player instances". The 30-epoch per-play fine-tune is verified. | NFLGSPLAT `docs/HANDOFF.md:6643-6646, 6877-6879, 6963`; `:6180-6183` (ds1 breakdown); PanopticPigskin `README.md:41-43`, `nfl_gsplat/pose/pseudo_labels.py:1-20` |
| "positionally and rotationally solved cameras" | Consistent with code (per-frame K, R, t; shared centre; `view_rotation.py`, `orientation.py`). | `site/public/embed/playground/play_joints.json` carries per-frame K/R/t |
| Tech: Ultralytics YOLOv8, SMPL-X, SMPLest-X, EasyOCR, OpenCV, SciPy | **Verified** (README third-party list; code imports). | PanopticPigskin `README.md:106-113` |
| "cut physically implausible motion from **17 % to 5 %** of frames by smoothing each track along its camera's depth axis" | **Verified.** Surge ruler (smoothed pelvis accel > 25 m/s²): **396 of 2,295 live body-frames (17 %) → 127** after along-ray 31-frame smoothing + feet anchoring (127/2295 = **5.5 %**, computed here). Along-ray smoothing alone: 396 → 116 (5.1 %). Shipped demo play later reads **4.3 %**. Note: unit is *body-frames*, not frames. | PanopticPigskin `nfl_gsplat/render/timeline.py:296-303`; NFLGSPLAT `docs/HANDOFF.md:7416-7418, 7429-7441`; `README.md:72` |
| "powers free-viewpoint Gaussian-splat replays" | **Verified** — three rendered MP4s on site; renderer `05k_render_hifi.py`. | site `/media/*.mp4` |
| "automated report grading all 22 players (separation, time to throw, air yards, YAC)" | **Mostly verified.** All metrics are computed automatically from the 3D tracks (`report/analyze.py`; YAC at `:177`), and all 22 players get a grade card. **But the grade values themselves are hand-assigned** per player in `report/build_report.py:157-245` (`grade(pid, 1.0, ...)`), with auto-generated rationale text. Suggest "a per-player report on all 22 players built from the tracking" rather than "automated grading". | `report/analyze.py`, `report/build_report.py:157-245`, live `/embed/report/` |

### 3b. Demo-play rulers (PanopticPigskin `README.md:62-75`; live window snap 395 → down 607, 213 frames @ 59.94 fps)

| Ruler | Value | Real-player reference (`docs/RULERS.md`) |
|---|---|---|
| census: \|KC−11\|+\|BAL−11\| mean/frame | **0.00** (213/213 live frames 11 v 11; 390 of 401 clip frames) | 0 |
| steps > 0.25 m between consecutive frames | **0** | < 0.20 m/frame (12 m/s) |
| hops > 0.15 m beyond neighbours' median | **0** | 0 |
| surges: pelvis accel > 25 m/s², share of body-frames | **4.3 %** | sprint start ≈10, hard tackle stop 25–30 m/s² |
| joint jitter p50 / p90 (m/frame²) | **0.016 / 0.059** | 0.01–0.02; 0.05 = visible twitch |

### 3c. Calibration vs official tracking (NFLGSPLAT)

| Method | xy error vs NFL tracking | Source |
|---|---|---|
| Per-frame homography (each frame independent) | **6.17 m** | `from_helmets.py:28-29` |
| Shared camera centre, in-sample players | **0.13 m** | `07c_measure_accuracy.py:26, 63` |
| Shared camera centre, held-out players | **0.15 m** | same |
| Why per-frame fails | per-frame focal ranged **2,125–18,430 px (8.7×)** while homography fit to 6.3 px | `from_helmets.py:14-16` |

### 3d. Placement along the blind axis

- **Depth snap** (slide sideline body along its ray onto endzone detection), 3,479 paired body-frames, two-camera answer
  held out as truth: fires on 69 % of frames, right man 97 %; distance to truth **0.20 → 0.05 m median, 0.43 → 0.15 m p90**;
  worse on 8 % of touched frames. (`nfl_gsplat/render/depth_snap.py:21-25`)
- **Along-ray smoothing** (31 frames along / 9 across) + feet anchor: surges 396 → 127; full-clip steps 36 → 20, live
  2 → 0; census live 0.13 → 0.04; planted feet 14 → 34 %; joint jitter p99 0.169 → 0.162; endzone-film joints > 40 px
  8.0 → 5.0 %, p99 113 → 87 px; *sideline-film joints > 20 px got slightly worse 9.3 → 10.3 %* (honest trade-off).
  (`timeline.py:296-303`)
- Surge rate by placing source before the fix: two-view 7 %, sideline-only 24 %, endzone-only 33 %. (`HANDOFF.md:7430`)

### 3e. Per-play keypoint fine-tune (pose_ft2, NFLGSPLAT `HANDOFF.md:6689-6693`, baseline `:6542-6547`)

Held-out frames (same play — the doc itself cautions this is partly the fit learned back), PCK@10:

| Camera / label class | Pretrained | Fine-tuned | median px |
|---|---|---|---|
| endzone fit_cross (labels the detector could not produce) | 0.7 % | **66.1 %** | 20.4 → 7.3 |
| endzone fit_self | 83.2 % | 92.3 % | — |
| sideline fit_cross | 50.7 % | **87.5 %** | 9.6 → 4.1 |
| sideline fit_self | 97.0 % | 96.9 % | — |

Training: 30 epochs, 0.69 h, imgsz 1920, batch 2, backbone frozen 10 layers. Two alternative label rules (ft3/ft4) were
tried and rejected on film and rulers (`HANDOFF.md:6955-6963`) — good "rigor" story.

### 3f. Report numbers (live `/embed/report/`, from `report/analyze.py` + `build_report.py`)

Time to throw **2.25 s**; closest rusher **2.8 m** (Madubuike at 2.1 s); air yards **8.1 yd**; gain **9.7 yd**, YAC
**1.6 yd**; ball speed **57 mph** (25.7 m/s, 0.53 s flight); separation at catch **2.0 m**; QB drop 7.5 yd; Gray down
0.75 s after catch; Hamilton within 1 m 0.37 s after catch; fastest player Receiver B 20.0 mph. Reach-margin table at the
throw and time series for 5 receivers; rusher-distance series for 4 rushers; 22 grade cards (−2..+2) with "seen by both
cameras on X % of live frames".

### 3g. Other context numbers

- Demo play clip: 401 frames, 6.7 s @ 59.94 fps (`site/src/content.ts` STATS). Published MP4s are 29.97 fps, 6.67 s.
- Early prototype (NFLGSPLAT `docs/RESULTS_first_end_to_end.md`, 2026-08-26): 147 skeletons over 8 frames, 0 rejected;
  procedural field 264,600 Gaussians at 0.15 m/px; naive cross-camera foot-point matching median residual **4.5 m** —
  the motivating failure.
- Placement error before identity work: "2.90 m placement error ... nearly all upstream of geometry" (`07c:31-34`).
- NFLGSPLAT README: CPU test suite 157 passing (early); later "full suite 1377 passed, 8 skipped" (`HANDOFF.md`, 2026-09-25).
  PanopticPigskin has ~110 test files.

---

## 4. Figure / media inventory

### Live site & repo media

| Asset | URL / path | Size | Shows | Portfolio? |
|---|---|---|---|---|
| Follow-cam hero clip | https://panopticpigskin.tech/media/follow.mp4 (`site/public/media/follow.mp4`) | 4.13 MB, 1920×1080, 6.67 s, H.264 | Rendered replay following the play | **Yes** — best hero video (embed directly; small) |
| Skycam clip | https://panopticpigskin.tech/media/skycam.mp4 | 4.28 MB, 1920×1080 | Virtual camera behind the offense | **Yes** |
| Broadcast-pose clip | https://panopticpigskin.tech/media/broadcast.mp4 | 2.01 MB, 1280×720 | Render from the sideline camera's own solved pose — proves calibration | **Yes** (pairs well with "cameras solved every frame") |
| Poster | https://panopticpigskin.tech/media/poster.jpg | 136 KB, 1280×720 | Follow-cam still | Yes |
| README hero | `docs/img/catch.jpg` (raw: https://raw.githubusercontent.com/sumedhk0/PanopticPigskin/main/docs/img/catch.jpg) | 135 KB, 1280×720 | Follow cam at the catch, 22 splatted players in kits, bowl stands | **Yes** |
| Film Room data | https://panopticpigskin.tech/embed/playground/play_joints.json | 2.71 MB | Per-frame cameras (K,R,t) + joints | data, not figure |
| Report page | https://panopticpigskin.tech/embed/report/ | 96 KB HTML | Graded report with SVG charts | **Yes** (screenshot) |

No broadcast footage is published (by design; site footer says so). No GIFs exist in the repos — made below.

### Copied to `scratchpad/research/assets/panoptic-pigskin/` (8 files, all < 5 MB)

| File | Size | What | Notes |
|---|---|---|---|
| `catch_follow_cam.jpg` | 135 KB | README hero: follow cam at the catch | best still |
| `poster_follow_cam.jpg` | 136 KB | site poster frame | alt hero |
| `skycam_t4.5.jpg` | 98 KB | skycam frame at 4.5 s: QB with ball, OL vs DL, routes | good "any seat" still |
| `broadcast_t1.5.jpg` | 64 KB | render from sideline camera's solved pose, pre-snap formation, 11 v 11 | pairs with calibration claim |
| `follow.gif` | 2.9 MB | full follow clip, 480 px, 10 fps, 64 colours | use MP4 if possible (better quality, ~same size) |
| `skycam.gif` | 3.3 MB | full skycam clip, 480 px | same |
| `film_room_catch.png` | 515 KB | headless-Chrome screenshot of Film Room, endzone preset at frame 562 (catch) — shows camera presets bar & timeline with SNAP/RELEASE/CATCH/DOWN markers | **Yes** — shows interactivity |
| `report_page.png` | 188 KB | headless screenshot of report top: 6 stat tiles + top-down route diagram | **Yes** |

### Interactive viewer (linkable)

- **Film Room** (three.js/WebGL, static): https://panopticpigskin.tech/playground (in-app) or the bare embed
  https://panopticpigskin.tech/embed/playground/ . Presets: Sideline, Endzone, Overhead, Pocket, Follow Ball, Sideline Cam,
  Endzone Cam (= broadcast solved poses), First Person; orbit/zoom/pan; click a body for its id; 1×/½×/¼× playback; timeline
  with snap/release/catch/down. Deep links (from `site/src/content.ts` MOMENTS):
  - Snap from the pocket: `/embed/playground/?cam=pocket&frame=394&r=9`
  - Release riding with the ball: `?cam=ball&frame=530`
  - Catch from behind the defense: `?cam=endzone&frame=562`
  - Down through the broadcast sideline camera: `?cam=real:sideline&frame=608`
  - First person: `?cam=fpv&id=80` (README:90)
- **Report**: https://panopticpigskin.tech/report (animated "generate" stages) or plain https://panopticpigskin.tech/embed/report/

---

## 5. Chartable data (copied to `scratchpad/research/data/panoptic-pigskin/`)

| File | Contents | Chart idea |
|---|---|---|
| `calibration_vs_tracking.csv` | 6.17 / 0.13 / 0.15 m | **Log-scale bar**: per-frame vs shared-centre (in/held-out) error vs official tracking; annotate "41×" |
| `surges_before_after.csv` | 396/2295 (17.3 %) → 127 (5.5 %) → 4.8 % → 4.3 % | **Step/bar** of implausible-motion share across versions |
| `surge_rate_by_source.csv` | two-view 7 / sideline-only 24 / endzone-only 33 % | bar: why the blind axis matters |
| `along_ray_smoothing_side_effects.csv` | 9 metrics before/after incl. one that got worse | slope chart / dumbbell (honest trade-offs) |
| `depth_snap.csv` | 0.20→0.05 m median, 0.43→0.15 m p90 | dumbbell |
| `pose_finetune_pck.csv` | PCK@10 pretrained vs ft2 by camera/label class | grouped bar (endzone fit_cross 0.7 → 66.1 % is the headline) |
| `demo_play_rulers.csv` | README results table with real-player references | stat tiles |
| `receiver_reach_margin.csv` | 5 receivers × 7 times (0.75–2.25 s) | small-multiple line chart ("how open each receiver was"), zero line = open |
| `pass_rush_distance_m.csv` | 4 rushers × 10 times | line chart with 2 m pressure band |
| `receivers_at_throw.csv` | depth / nearest defender / reach margin | scatter: depth vs margin |
| `player_grades.csv` | 22 players, grade, % frames seen by both cameras | diverging bar of grades, coloured by team |
| `events.json`, `film_reads.json` | snap 395, release 530, catch 562, down 607; hand-read helmet depth | timeline annotations |

Not available: a per-player **error distribution** vs tracking data (only aggregate 0.13/0.15 m reported; the per-sample
output of `07c` would be in the gitignored `data/helmet/` — not in either repo). Also no raw surge histogram. Don't
fabricate a distribution; use the bar chart.

---

## 6. Links

- Live site: https://panopticpigskin.tech/ · Film Room: https://panopticpigskin.tech/playground · Report: https://panopticpigskin.tech/report
- Repo: https://github.com/sumedhk0/PanopticPigskin (AGPL-3.0)
- Dev repo / lab notebook: https://github.com/sumedhk0/NFLGSPLAT (`docs/HANDOFF.md`, `docs/PLAUSIBILITY.md`, `scripts/07c_measure_accuracy.py`)
- Early prototypes: https://github.com/sumedhk0/GRIDIRON-GAMEVIEWER (PyOpenGL SMPL skeleton viewer, "football-render"),
  https://github.com/sumedhk0/TEST-NFL-SPLAT (first pipeline skeleton: calibration/fusion/reconstruction/exporter + tests)
- Validation dataset: Kaggle "NFL Health & Safety — Helmet Assignment" (`nfl-health-and-safety-helmet-assignment`)
- Key docs: `README.md` (results table), `docs/RULERS.md`, `plays/bal_at_kc_2024_wk1/play_001/README.md`

---

## 7. Suggested "key findings" figures

1. **"41× more accurate cameras"** — log-scale bar from `calibration_vs_tracking.csv` (6.17 m per-frame vs 0.15 m held-out
   vs official NFL tracking). Caption must say: one Helmet-Assignment play, identity given (geometry floor).
2. **"Fixing the camera's blind axis"** — two-panel: (a) surge share by placing source (7/24/33 %), (b) implausible-motion
   share 17.3 % → 5.5 % → shipped 4.3 % (`surges_before_after.csv`). Pair with `broadcast_t1.5.jpg` or a small diagram of
   a sideline ray with along-ray vs across-ray smoothing windows (31 vs 9 frames).
3. **"The detector teaches itself on the play"** — grouped bar PCK@10 from `pose_finetune_pck.csv` (endzone cross-camera
   labels 0.7 % → 66.1 %; sideline 50.7 % → 87.5 %).
4. **"From pixels to football analytics"** — small multiples of reach margin per receiver (`receiver_reach_margin.csv`)
   next to `report_page.png`; or the rusher-distance chart with the 2 m pressure line. Hero media: `follow.mp4` (or
   `catch_follow_cam.jpg`) + `film_room_catch.png` linking to the live Film Room.

### Phrasing cautions for the portfolio page
- Say "0.15 m median triangulation error on held-out players vs official NFL tracking (Kaggle Helmet Assignment play)",
  not "the reconstruction is accurate to 0.15 m" — the demo play has no tracking truth.
- "17 % → 5 % of body-frames" (not frames).
- "~115K keypoint labels" rather than "115K SMPL-X pseudo-labels" (mix of SMPL-X projections, detector points, empties).
- Grades are authored per player from automatically computed metrics; the metrics are automated, the grade values are not.
- Single demo play throughout; README "Limits": piles are weakest; gait > 4.8 m/s, throw/catch/tackle poses and head
  direction are modelled not measured; snap/passer/down frames and some identity fixes are by hand.
