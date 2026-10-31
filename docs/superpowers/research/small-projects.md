# Small projects: source material for portfolio pages

Research date: 2026-10-31. Repos were shallow-cloned to `scratchpad/research/repos/<Repo>`. Assets are in `scratchpad/research/assets/<slug>/`. Witness AI is excluded.
Path root for everything below: `C:/Users/sumedh/AppData/Local/Temp/claude/C--Users-sumedh-OneDrive---Georgia-Institute-of-Technology-Python-PersonalWebsite/637319ef-4fb5-4672-9d5a-e9416fcaa69a/scratchpad/research/`

Note: the shallow clones need `git -c core.longpaths=true clone ...`. Without it they fail with "Filename too long" because the scratchpad path is so long.

---

## 1. GameSense (Tech(Hack) Valley 2026). Verdict: FULL PAGE

**Summary.** GameSense is a gaming headband that turns a game's surround-sound audio into directional vibration, so a player feels where footsteps or gunfire come from. Head tilt also works as WASD movement keys, which helps players with limited hand mobility. Team on Devpost: Chase Twyman, Ryan Karami, Sumedh Kothari, William Schotte.

**What's built (repo `Game-Sense-TechHackValley`)**
- `audio_capture_send.py`: captures 7.1 audio from the PC through a WASAPI loopback (`pyaudiowpatch`). It reads 50 ms chunks, computes RMS per channel with the LFE channel dropped, and maps 7 channels to 8 motors (Front, FR, R, BR, B, BL, L, FL). Stereo and 5.1 mappings use angular-distance weights. The script sends `0xFF` plus 8 intensity bytes over serial at 115200 baud.
- ESP32 firmware (PlatformIO, `esp32doit-devkit-v1`, Arduino, C++17), in `Firmware/src/`:
  - `motorDrivers.cpp`: `analogWrite` PWM on 8 GPIO pins. Constants are 1 kHz and 8-bit.
  - `main.cpp`: a UART frame parser that waits for the sync byte, reads 8 bytes, sets the motors, and flushes stale buffer data.
  - `IMU_interface.cpp`: SparkFun ICM-20948 9-DoF IMU over SPI, plus a Kalman filter for pitch and roll (Q_angle 0.001, Q_bias 0.003, R 0.03).
  - `ble_keyboard_hid.cpp`: a BLE HID keyboard named "GameSense Controller". Pitch maps to W/S and roll maps to A/D. Keys press at 15° and release at 10° (hysteresis). It updates at about 50 Hz.
- A switch on GPIO 35 triggers IMU recalibration.

**Diagrammable steps**
1. The game outputs 7.1 audio. A Windows WASAPI loopback captures it at the OS level, which avoids anti-cheat.
2. The Python script computes RMS per channel every 50 ms and maps the channels to 8 motor intensities.
3. A UART frame (`0xFF` + 8 bytes) goes to the ESP32.
4. The ESP32 sets PWM on 8 motors spaced around the headband, so the player feels the sound's direction.
5. In parallel, IMU head tilt is filtered and sent as W/A/S/D key presses over BLE HID.

**Claims vs evidence**
| Claim | Status | Source |
|---|---|---|
| TechHack Valley 2026 hardware-track winner | VERIFIED | The Devpost project badge reads "Winner: Kado Portable Monitor". The techhack.devpost.com prize list says that prize goes to "each of the Hardware Track Winners". Event: "Tech(HACK) Valley", Mar 6–8 2026, Georgia Tech Howey Physics, 52 participants. |
| ESP32 | VERIFIED | `platformio.ini`, Devpost tag `esp32` |
| 9-axis IMU | VERIFIED | ICM-20948 9DoF library. `setOutput` emits 9 values (acc, gyro, mag). |
| 8-motor haptic array | VERIFIED | `NUM_MOTORS = 8`, 8 pins in `constants.h` |
| 3D-printed enclosure | PARTLY | Devpost has a "GameSense Black Box CAD Render" and photos of a black box. The Devpost text never says it was 3D-printed. |
| C++ PWM firmware | VERIFIED | `motorDrivers.cpp`, `constants.h` (1 kHz, 8-bit) |
| UART | VERIFIED | Serial at 115200 with a sync-byte protocol |
| Audio amplitude → haptic intensity | VERIFIED | RMS per channel → 0–254 values in `audio_capture_send.py` |
| Kalman-filtered head tilt → WASD | CAVEAT | The Kalman filter is implemented, but `enableKalman()`/`updateKalman()` are never called. `main.cpp` calls `imu.getPitch()`/`getRoll()` and `imu.calibrate()`, which are declared in the header but have **no definition in the committed repo**, so the committed firmware would not link as-is. Tilt → WASD via BLE HID is real code. Safer wording: "IMU head-tilt → WASD over BLE HID, with a Kalman pitch/roll filter". Also note it is **BLE HID**, not wired. |

**Media inventory**
| Media | Shows | Portfolio quality |
|---|---|---|
| Devpost `.../software_photos/004/408/619/datas/original.png` → `assets/gamesense/enclosure-cad-render.png` | CAD render of the black enclosure box | yes (clean) |
| `.../004/408/620/datas/original.jpg` → `assets/gamesense/full-setup.jpg` | Full rig on a lab bench: box, wiring harness, headband | yes |
| `.../004/408/621/datas/original.jpg` → `assets/gamesense/headband-motor-harness.jpg` | Fabric headband with the motor wiring loop | yes (best "product" shot) |
| `.../004/408/622/datas/original.jpg` (not copied) | Similar bench setup | meh, duplicate |
| `.../004/408/623/datas/original.jpg` → `assets/gamesense/esp32-breadboard.jpg` | ESP32 breadboard with motor drivers | yes, technical |
| YouTube demo https://www.youtube.com/watch?v=MPyTruaT-h8 (200) | Devpost demo video | embed-worthy |
| Repo | No images | — |

**Links:** GitHub 200, Devpost 200, YouTube 200.

---

## 2. IEEE Robotech 2026 autonomous debris robot ("Buzzinga"). Verdict: FULL PAGE (light; photos and CAD are good, metrics are thin)

**Summary.** For GT IEEE's Robotech 2026 hackathon ("build your own space rover"), the team built an autonomous rover that prepares a lunar landing zone. It drives to the zone, finds debris with a camera and an on-board YOLO detector, pushes the debris out with servo "bulldozer arms", then drops transponder beacons at the zone corners from a rotating carousel. Team: Jack DeFusco, Jack Scafidi, Sumedh Kothari, William Schotte. The repo is owned by wschotte.

**What's built (repo `wschotte/buzzinga-robotech-2026`)**
- `robot/main.py` is the phased mission: Phase 0 navigates to the landing zone (IMU heading + dead reckoning, `navigation.py`), Phase 1 clears debris (`debris_clearing.py`: rotate 360° scanning with the camera, go to the debris heading, sweep with the arms, return to center), Phase 2 places beacons (`beacon_placing.py`: spinner servo plus drop), and Phase 3 drives away.
- Hardware layer (`robot/hardware/`): pigpio DC motors and servos, ultrasonic sensor, IMU, and camera. The drivetrain has strafe functions and the photos show mecanum wheels.
- Model: `debris_model.pt` plus an NCNN export. `metadata.yaml` says **Ultralytics YOLO11n, single class "Debris", imgsz 480×480, trained 2026-01-24** (in Colab, `/content/data.yaml`). NCNN suits Raspberry Pi 4B CPU inference.
- Devpost: the body was 3D-printed from SolidWorks CAD, with DC motors, servos, a 6-DoF IMU, an ultrasonic sensor, and a Raspberry Pi 4B with a camera.

**Diagrammable steps:** 1) Navigate to the zone (IMU heading) → 2) 360° camera scan and YOLO11n debris detection → 3) Align heading and bulldoze debris out → 4) Rotate the carousel and drop beacons at the corners → 5) Exit.

**Claims vs evidence**
| Claim | Status | Source |
|---|---|---|
| SolidWorks CAD | VERIFIED | Devpost tag `solidworks`, text, and 2 SolidWorks screenshots |
| YOLO model | VERIFIED | `debris_model_ncnn_model/metadata.yaml` (YOLO11n) |
| "95% debris detection accuracy" | WORDING MISMATCH / UNVERIFIED | Devpost text says "resulting in a **95% detection and removal rate** with our proprietary debris removal algorithm". That is a combined detection-and-removal rate, not model accuracy. The repo has no training logs, mAP, or eval set. Suggested wording: "~95% detection-and-removal rate in team testing (self-reported)". |
| Placement or win | NONE | No winner badge on Devpost. Don't claim a placement. |

**Media inventory**
| Media | Shows | Quality |
|---|---|---|
| Devpost `.../software_photos/004/203/119/datas/original.jpeg` → `assets/robotech-debris-robot/robot-front.jpg` (2.7 MB) | Robot front view: yellow bulldozer arms, Pi, breadboard, ultrasonic, mecanum wheels | yes |
| `.../004/203/120/datas/original.jpeg` → `robot-front-angle.jpg` (2.6 MB) | Angled close-up with a debris puck in frame | yes |
| `.../004/203/118/datas/original.jpeg` → `robot-top-spinner.jpg` | Top view showing the beacon carousel and arms | yes |
| `.../004/203/132/datas/original.png` → `beacon-carousel-cad.png` | SolidWorks CAD of the 4-slot beacon carousel. Has a black strip at the right edge, so crop it. | yes (after crop) |
| `.../004/203/131/datas/original.png` (not copied) | CAD of the carousel lid plate | weak |
| Repo `yolo_output.mp4` (262 KB) | **Corrupt** (ffprobe reports "moov atom not found") | no |
| Repo `runs/detect/predict/bus.jpg`, `zidane.jpg` | Ultralytics stock sample images | no |
| YouTube https://www.youtube.com/watch?v=cWmjeuB-yqk (200) | Devpost demo video | embed-worthy |

**Links:** GitHub 200, Devpost 200.

---

## 3. GT Transfer Equivalencies. Verdict: FULL PAGE (best data story of the set)

**Summary.** This is a searchable, reversed mirror of Georgia Tech's transfer-equivalency table. GT's official OSCAR tool looks up one school at a time. This site lets you pick a GT course (for example APPH 1040) and see every school whose course transfers in. You can filter by state and to community colleges only, which uses a College Scorecard join.

**What's built**
- `scraper/reverse_transfer.py` (360 lines) scrapes `oscar.gatech.edu/pls/bprod` letter by letter, collecting schools and then each school's equivalencies, with retries. It also pulls the College Scorecard API (`api.data.gov/ed/collegescorecard`) to get state and "predominant degree = associate's" for the community-college flag, matching institutions by normalized name. It doubles as a CLI: `python -m scraper.reverse_transfer APPH 1040 --state CA --community-college`.
- `scraper/scrape.py` writes `site/data.json` (13 MB).
- `.github/workflows/scrape.yml` runs on cron at `0 4 * * *` (nightly), and the bot commits data.json only when it changed. `pages.yml` deploys `site/` (vanilla HTML/JS/CSS) to GitHub Pages.
- The UI has a single search box (GT code, external code, title, or school), a state dropdown, and a CC-only checkbox, with results capped at 500 rows.

**Diagrammable steps:** 1) Nightly GitHub Action → 2) scrape OSCAR across A–Z schools and their equivalencies → 3) join with College Scorecard (state, CC flag) → 4) commit `data.json` → 5) GitHub Pages static site with client-side search.

**Numbers (computed by me from `site/data.json`, generated_at 2026-10-30T11:12:20Z; latest commit "data: nightly refresh 2026-10-30", so the nightly job is live)**
| Claim | Measured | Status |
|---|---|---|
| 2,000+ institutions | **2,076** schools/entries (includes non-institution entries such as "*Advanced Placement, Col Board") | VERIFIED |
| 100k+ course mappings | **104,073** rows. Note: **38,357** of these map to GT "ET" placeholders (e.g. ET NOGT / ET DEPT, meaning no direct GT credit or a department evaluation). | VERIFIED, but about 37% are non-credit placeholders |
| 1,400+ GT courses | **1,461** distinct GT subj+num codes (1,455 excluding ET; 1,240 excluding ET and generic "1XXX"-style codes) | VERIFIED (counts generic codes) |
| College Scorecard join | Code verified. Only **832 / 2,076** schools got matched to a state; **187** are flagged as community colleges; 50 states are represented. | VERIFIED. Match rate is about 40%. |
| Nightly scraper | cron `0 4 * * *` plus bot commits | VERIFIED |

**Media**
- `assets/gt-transfer-equivalencies/live-landing.png`: headless Chrome screenshot of the live site showing the table, filters, and "Showing 500 of 104,073 matches". Usable. A filtered screenshot (APPH 1040 + CA + CC) would be stronger, but the site has no URL params, so it needs a manual capture.
- The repo has no images. Charts can be generated from data.json (e.g. mappings per state, top GT courses by number of feeder schools).

**Links:** https://sumedhk0.github.io/GTTransferEquivalency/ 200; `/data.json` 200 (13.0 MB); GitHub 200.

---

## 4. Sports Betting Arbitrage. Verdict: CARD ONLY (could be a small page)

**Summary.** The app scans sportsbook odds from The Odds API and finds arbitrage: sets of bets across bookmakers that guarantee a profit. For each one it reports ROI and the stake split per $1,000. It started as a Python CLI (`arbitrageCalculator.py`, Docker, optional SMTP email alerts above a minimum ROI) and is now a Next.js + Tailwind UI with Python serverless functions on Vercel (`api/scan.py`, `sports.py`, `bookmakers.py`, `health.py`).

**Core math (`api/lib/arbitrage.py`):** convert American odds to decimal, then compute inverse_sum = Σ 1/d and ROI = (1/inverse_sum − 1)·100, with stake share ∝ 1/d. It supports 2-way and 3-way markets, player props (sport-specific prop market lists in `markets.py`), and a filter that drops events starting within 10 minutes. There are 14 unit tests in `tests/test_arbitrage.py`. The latest commit is the merged PR #1 "fix/arbitrage-logic" (Sep 2026).

**Diagrammable steps:** pick a sport and bookmakers → fetch odds (Odds API) → find the best price per outcome across books → check inverse_sum < 1 → output ROI and stake split.

**Numbers:** none to claim. The README says the free tier is 500 req/month and a full scan uses about 1,500 credits; those figures describe the API, not results.

**Media:** `assets/sports-betting-arbitrage/live-landing.png` (dark UI: scan config, 9 bookmaker toggles, "API Credits: 500"). This is an empty state with no opportunities, so it's okay-ish. There are no repo images.

**Links:** the **correct URL is https://sports-betting-arbitrage-theta.vercel.app/ (200)**, and `/api/health` returns `{"api_key_configured":true,"status":"healthy"}`. The GitHub homepage field **https://sports-betting-arbitrage-beige.vercel.app is 404 (BROKEN)**, so the repo's "About" link should be fixed.

---

## 5. EcoFlow. Verdict: CARD ONLY (could be a small page with a Sankey screenshot)

**Summary.** EcoFlow does cradle-to-grave life-cycle assessment for Amazon products. You enter an ASIN and description. Claude (`claude-sonnet-4-5`) extracts the material breakdown as structured output, and the backend computes kg CO2e across 5 phases (raw materials, manufacturing, transport, use, end-of-life). The frontend draws a Sankey diagram and has a What-If slider for disposal scenarios (baseline, best, or worst case).

**Stack:** FastAPI backend on Render (`ecoflow-ykyb.onrender.com`), Next.js 15 frontend on Vercel, Upstash Redis cache-aside with a 24 h TTL, Supabase Postgres for storing analyses, and a Rainforest API product fetcher.

**Numbers (verified from `backend/data/emission_factors.py` via AST):** **50 material emission factors** (matches the README's "50 materials"), 64 material aliases, 14 manufacturing-category factors, and 3 EOL scenarios. Sources cited in the file: ecoinvent 3.9, EPA WARM, and Carbon Footprint Ltd. These are reference tables, not results.

**Diagrammable steps:** ASIN → product fetch → LLM material extraction (JSON) → per-phase emission calculation → Sankey + what-if.

**Media:** `assets/ecoflow/live-landing.png` shows the input form only, which is low value. A results screenshot with the Sankey would be the hero image, but it needs a real ASIN run and costs an Anthropic API call. There are no repo images.

**Links:** https://eco-flow-rose.vercel.app/ 200. Backend `https://ecoflow-ykyb.onrender.com/health` returns 200 `{"status":"ok"}` after a **73 s cold start** (Render free tier), so the first analysis will be slow.

---

## 6. GitHub Analyzer. Verdict: CARD ONLY

**Summary.** A Flask app that pulls a GitHub user's repos, commits, and patches through the GitHub API (with rate-limit handling) and has an LLM produce a "brutally honest" developer rating. It has three modes: single-user analysis, Job Match (parses a JD, then evaluates and ranks candidates), and Search GitHub (finds users by language, location, and experience). It can also export results. The LLM is called through **OpenRouter** with `arcee-ai/trinity-large-preview:free`.
**Numbers:** none. The UI copy "Most developers score 4-5/10" and "calibrated to FAANG standards" are marketing claims, not measurements.
**Media:** `assets/github-analyzer/live-landing.png` (dark landing page with a username box). The image is weak.
**Links:** https://github-analyzer-navy.vercel.app/ 200; GitHub 200.

---

## 7. AiApply. Verdict: CARD ONLY

**Summary.** A Flask multi-user app with login, register, and settings, and a Postgres database on Render. It automates job outreach in two ways:
- Contact workflow: find companies and contacts by industry and location (Claude/OpenRouter plus Hunter API), dedupe against contact history, generate personalized emails, and send them with the resume attached over SMTP.
- Handshake workflow: Playwright/Selenium automation (`HandshakeJobApply.py`, `HandshakeDMAutomation.py`). For each job, `ResumeGenerator.py` makes an ATS-tailored LaTeX resume (PyLaTeX) and `CoverLetterGenerator.py` writes a cover letter. Applications are tracked as history.

It also has resume and transcript upload and management endpoints and a progress-polling task API.
**Numbers:** none.
**Privacy flag:** the **public** repo contains `Sumedh Kothari Resume.pdf`, `Workflow Company Log.xlsx`, and `Industry Codes Handshake.xlsx`. The user may want to remove the resume and company log from the public repo before linking it from the portfolio.
**Media:** none in the repo, and the live app is down.
**Links:** **BOTH BROKEN.** The GitHub homepage https://ai-apply-murex.vercel.app returns **404**. The portfolio link https://ai-apply-12tq.onrender.com/ gives **no response (timed out at 60 s and at 180 s)**, so the free Render service is likely suspended or deleted. Recommend linking only to GitHub.

---

## 8. ResumeForge / ResumeOptimizer. Verdict: CARD ONLY (merge into one card)

**ResumeForge** (`ResumeForge/main.py`, 457 lines, single commit from Jan 2026) is a FastAPI service. It parses PDF/DOCX/TXT (PyMuPDF), asks an LLM through OpenRouter to rewrite the resume against a JD as JSON, fills a LaTeX template, and compiles the PDF through the remote `latex.ytotech.com` API. There are `/optimize` (PDF) and `/optimize-json` endpoints. The code's model string is `moonshotai/mimo-7b-rl:free`, while the HF Space metadata lists `arcee-ai/Trinity-Large-Preview` and was last modified 2026-02-17, so the Space is newer than the GitHub repo.
**ResumeOptimizer** is the earlier Next.js version (Jan 2026). It uses Python serverless functions on Vercel and Netlify, `xiaomi/mimo-v2-flash:free`, and generates PDFs with ReportLab-style styles (`lib/pdf_generator.py`). It has no live deployment URL.
**Numbers:** none.
**Media:** none.
**Links:** HF Space page https://huggingface.co/spaces/sk31415/resume-forge returns 200, but the runtime stage is **SLEEPING** (it wakes on visit, and `sk31415-resume-forge.hf.space/health` returned 404 while asleep). Both GitHub repos return 200.

---

## 9. polyuma. Verdict: CARD ONLY, or drop the link

The repo `sumedhk0/polyuma` has **only an empty `README.md`** (single commit "initial commit", 2026-06-27). Nothing in it backs a "PolyUMA polymer property GNN" claim. Don't link the repo as evidence. If PolyUMA is described anywhere, it needs another source (paper or slides).
Link: GitHub 200, but the repo is empty.

## 10. Medford-VIP-Training. Not a project (exclude)

This repo is a Slurm "hello world" training exercise for GT's PACE HPC cluster (`train.sh` with `#SBATCH -A paceship-pso`, queue `inferno`; `test.py` prints "Hello world!"; `test.out` is the job log from 2026-09-08). Commit message: "Completed Exercises HPC.1, HPC.2". It is onboarding for a VIP (Vertically Integrated Projects) team. It is **not portfolio material.**

---

## Link status summary
| URL | HTTP | Action |
|---|---|---|
| sumedhk0.github.io/GTTransferEquivalency/ | 200 | ok |
| sports-betting-arbitrage-theta.vercel.app | 200 | **use this one** |
| sports-betting-arbitrage-beige.vercel.app | **404** | broken (repo homepage field) |
| eco-flow-rose.vercel.app | 200 | ok (backend cold start ~73 s) |
| github-analyzer-navy.vercel.app | 200 | ok |
| ai-apply-murex.vercel.app | **404** | broken |
| ai-apply-12tq.onrender.com | **timeout (no response)** | broken; link GitHub only |
| huggingface.co/spaces/sk31415/resume-forge | 200 (Space sleeping) | ok-ish |
| All GitHub repos and both Devposts and YouTube videos | 200 | ok |
