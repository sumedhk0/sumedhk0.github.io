import type { Findings } from "./types";

// Sources: docs/superpowers/research/panoptic-pigskin.md and small-projects.md.

export const pp: Findings = {
  slug: "pp",
  dates: "February – September 2026",
  lead: "Teams get precise player tracking; fans get broadcast video. Panoptic Pigskin turns the two broadcast angles of a play into a full 3D replay you can watch from any seat. Against official NFL tracking data its camera solve places held-out players to 0.15 m, 41× better than calibrating each frame alone, and the reconstruction powers Gaussian-splat replays and a per-player film report.",
  figures: [
    {
      kind: "video",
      src: "/work/pp/follow.mp4",
      poster: "/work/pp/poster_follow_cam.webp",
      width: 1280,
      height: 720,
      caption: "Follow-cam replay rendered from the reconstruction: Mahomes to Noah Gray for 9.7 yards, Ravens at Chiefs, 2024 Week 1, all 22 players on every live frame.",
    },
    {
      kind: "chart",
      chartId: "pp-calibration",
      caption: "Median player position error against official 10 Hz NFL tracking on a Kaggle NFL Helmet Assignment play (log scale). The shared-camera solve reaches 0.15 m on players it never saw.",
    },
    {
      kind: "chart",
      chartId: "pp-surges",
      caption: "The sideline camera can't see depth, so tracks jittered along its line of sight. Smoothing hardest along that axis cut implausible accelerations from 17.3% to 5.5% of body-frames.",
    },
    {
      kind: "chart",
      chartId: "pp-pck",
      caption: "Self-training YOLOv8x-pose on each play's own ~115K pose pseudo-labels: keypoints within 10 px rise from 0.7% to 66.1% on the endzone camera and 50.7% to 87.5% on the sideline.",
    },
    {
      kind: "image",
      src: "/work/pp/film_room_catch.webp",
      alt: "The in-browser Film Room viewer at the moment of the catch, showing the reconstructed players on a 3D field.",
      width: 1280,
      height: 720,
      caption: "The Film Room on panopticpigskin.tech: the same play in an interactive 3D viewer, from either broadcast camera, any seat, or first person.",
    },
    {
      kind: "image",
      src: "/work/pp/report_page.webp",
      alt: "A page of the per-player report with metrics for receivers and pass rushers.",
      width: 1280,
      height: 1600,
      caption: "The per-player report built from the 3D tracks: time to throw, air yards, yards after catch, receiver separation and pass-rush distance.",
    },
  ],
  steps: [
    "Take the sideline and endzone All-22 clips of one play and align them in time.",
    "Solve both moving broadcast cameras on every frame from the field's own paint, with one shared camera centre per play and players' height pinning the lens.",
    "Detect, track and name all 22 players with YOLOv8 and EasyOCR jersey numbers, and pair them across the two views.",
    "Self-train a pose model on the play, fit a full SMPL-X body to both cameras at once, and place each body on the turf using the endzone view for depth.",
    "Smooth every track hardest along its camera's blind axis, then render Gaussian-splat replays and compute the football metrics.",
  ],
  limits: "Accuracy is measured on one Helmet Assignment play with known player identities, so 0.15 m is the geometry's best case rather than an end-to-end score on the demo play.",
};

export const gs: Findings = {
  slug: "gs",
  dates: "March 2026 · Tech(HACK) Valley",
  lead: "GameSense is a headband that lets deaf and hard-of-hearing players feel where a sound comes from. It turns a game's surround audio into vibration from eight motors placed around the head, and head tilt doubles as WASD movement for players with limited hand mobility. Built in a weekend, it won the hardware track at Tech(HACK) Valley 2026.",
  figures: [
    {
      kind: "image",
      src: "/work/gs/headband-motor-harness.webp",
      alt: "Fabric headband with a loop of wiring connecting eight vibration motors.",
      width: 1215,
      height: 1620,
      caption: "The headband: eight vibration motors spaced around the head, one per direction from front to front-left.",
    },
    {
      kind: "image",
      src: "/work/gs/full-setup.webp",
      alt: "The full GameSense rig on a lab bench: black electronics box, wiring harness and headband.",
      width: 1400,
      height: 1050,
      caption: "The full rig: an ESP32 drives the motors from 8 PWM pins while a 9-axis IMU reads head tilt.",
    },
    {
      kind: "image",
      src: "/work/gs/esp32-breadboard.webp",
      alt: "ESP32 development board on a breadboard wired to motor drivers.",
      width: 1215,
      height: 1620,
      caption: "Firmware bench: C++ on the ESP32 parses 8-byte serial frames from the PC and sets motor PWM at 1 kHz.",
    },
  ],
  steps: [
    "Capture the game's 7.1 audio at the operating-system level, which keeps it clear of anti-cheat software.",
    "Every 50 ms, measure each channel's loudness and map the seven directions onto eight motor intensities.",
    "Send the intensities to the ESP32 over serial, which drives eight motors around the headband.",
    "In parallel, read head tilt from the IMU and send it as W, A, S and D key presses over Bluetooth LE.",
  ],
};

export const rb: Findings = {
  slug: "rb",
  dates: "January 2026 · IEEE Robotech",
  lead: "For GT IEEE's Robotech 2026 rover challenge, our team of four built an autonomous rover that prepares a lunar landing zone: it drives to the zone, finds debris with an on-board YOLO detector, bulldozes it clear, and drops transponder beacons at the corners from a rotating carousel. The team reported a 95% detection-and-removal rate in testing.",
  figures: [
    {
      kind: "image",
      src: "/work/rb/robot-front-angle.webp",
      alt: "The rover from a low angle, with yellow bulldozer arms, mecanum wheels and a debris puck in front.",
      width: 1400,
      height: 1051,
      caption: "The rover on mecanum wheels, with servo bulldozer arms and a debris puck in view of the camera.",
    },
    {
      kind: "image",
      src: "/work/rb/robot-top-spinner.webp",
      alt: "Top view of the rover showing the Raspberry Pi, wiring and the four-slot beacon carousel.",
      width: 1400,
      height: 1865,
      caption: "From above: a Raspberry Pi 4B runs the mission and the detector; the beacon carousel sits on top.",
    },
    {
      kind: "image",
      src: "/work/rb/beacon-carousel-cad.webp",
      alt: "SolidWorks render of the four-slot beacon carousel.",
      width: 1050,
      height: 1038,
      caption: "SolidWorks design of the 3D-printed beacon carousel, which rotates to drop one beacon per corner.",
    },
  ],
  steps: [
    "Drive to the landing zone by IMU heading and dead reckoning.",
    "Turn a full circle while the camera runs a single-class YOLO11n debris detector on the Raspberry Pi.",
    "Align to each piece of debris and sweep it out with the servo arms.",
    "Rotate the carousel and drop a transponder beacon at each corner, then drive clear.",
  ],
};

export const gt: Findings = {
  slug: "gt",
  dates: "April 2026 – present",
  lead: "Georgia Tech's transfer tool looks up one school at a time. This site flips it: pick a GT course and see every school whose course transfers in, filtered by state or to community colleges only. A scraper refreshes the whole dataset every night.",
  stats: [
    { value: "2,076", label: "schools covered" },
    { value: "104,073", label: "course mappings" },
    { value: "1,461", label: "Georgia Tech courses" },
  ],
  figures: [
    {
      kind: "image",
      src: "/work/gt/live-landing.webp",
      alt: "The GT Transfer Equivalencies search page with a course search box, state filter and community-college checkbox.",
      width: 1440,
      height: 1000,
      caption: "The live site: search by GT course, outside course, title or school, and filter by state or community colleges.",
    },
  ],
  steps: [
    "Scrape Georgia Tech's OSCAR equivalency tables school by school, with retries.",
    "Join each school against the federal College Scorecard API for its state and whether it is a community college.",
    "Publish one JSON dataset that a static search page filters entirely in the browser.",
    "Re-run nightly with GitHub Actions, committing only when the data changed.",
  ],
  limits: "Not every school matches the College Scorecard by name, so state and community-college filters cover a subset of the 2,076 schools.",
};
