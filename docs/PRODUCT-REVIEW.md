# PRODUCT REVIEW — Rung, as a Nerdy hiring panel would read it

6 Sep 2026 (12 days to the 18 Sep deadline). Reviewer: senior AI Product Engineer, Nerdy hackathon panel.
Tree reviewed: `436a997` (master, clean). Server run on :5190, no `ANTHROPIC_API_KEY` (template path), a
`DEEPSEEK_API_KEY` **is** present in this environment. Browser: own tab, 1280×720 then 468×397. Nothing edited
except this file. Disclosed limits (no live Haiku call, pilot not yet run, no deploy, no README) were weighed,
not "discovered".

---

## Verdict: **Promising, fix X first.**

The thinking is hire-grade; the artefact is not yet playable by hand. The thesis (build-is-the-maths, error
persistence, answer-blind hint layer, measured leak rate, pre-committed null) is the best-argued submission
concept I expect to see this round, and the evidence trail is real: I ran every eval and they pass; the
redacted payload genuinely contains no integer; the server genuinely re-validates and rebuilds the payload;
the 20-second beat genuinely produces a goat in the corn and a number-free hint on the gap. But on the
committed tree **two of the three fence parts cannot be tapped with a mouse or finger** — the transparent corn
sprite `<img>` (z-index 150+) sits over the hit regions (z-index 50), so every real tap on parts 1 and 2 logs
`place_failed`. I only got through the beat by dispatching `.click()` on the hit `<div>`s from JS. The
independent QA pass (`docs/TEST-REPORT.md`) did not catch it because it drove the DOM, not the pointer. That
single fact — nobody has played this with a finger — is what stops "talk to this person" today. It is a
one-line CSS fix. Fix it, kill the three open LLM-proxy endpoints inherited from the frozen arm, scrub the
attribution tells, and film. Then it is a "talk to this person".

---

## Strengths (verified, not asserted)

1. **The mechanic is intrinsic, not a tollgate.** There is no answer box anywhere in `build.html`. The only
   inputs are `plank_held / place / remove / tap_count / order / commit` (`build.html:120–149`). The wrong
   build stands on screen: `[4,4,3]` shows bare post above part 3's rails and the goat walks through that part
   (`fence.mjs:227–245`, observed). `[5,4,3]` shows a −12° tilted rail with a shadow above the post
   (`fence.mjs:262`, observed). `[3,3,3]` shows the probe "Show me a part that looks finished." with **no**
   network call, then a tap on a short part resolves to `counted_groups_as_group_size` (observed; event log
   `hint:ambiguous/1 | tap_count | hint:counted_groups_as_group_size/1`). This is Habgood & Ainsworth's
   integration, done, not described. `coach.mjs:12` (`The correct answer is ${problem.answer}`) beside
   `buddy.mjs` with no answer in the prompt is a real, honest diff.
2. **Code owns truth; the model phrases.** `classify()` (`fence.mjs:44–100`) is pure, importable under `node`,
   no `Date.now()`, no I/O. 68 fixtures → 55/55 right when committed, 13 silent, 0 mismatches
   (`node evals/classifier_eval.mjs`, ran clean). Silence (`ambiguous`, `in_progress`, unconfirmed) is a
   first-class outcome, which is the correct design for a diagnostic that talks to a 7-year-old.
3. **The redaction is real and tested at the boundary.** `payload()` (`buddy.mjs:63–71`) emits five booleans
   and `"some"`; `buddy_test.mjs:80–92` asserts no digit outside `age/tier/reading_level` over every fixture
   (ran clean). `server.mjs:24–29` keeps only `{id, tier, shape}`, 400s unknown keys, non-enum ids, digits in
   `shape`, bodies > 4 KB, and rebuilds via `redact()` so client template text never reaches the model. I
   curled a valid body (200, template, `reason:"no_key"`) and an invalid one (400). Traversal `/public/../server.mjs` → 404,
   `.png` → `image/png` (QA D-5/D-6 closed as claimed).
4. **The gate is honest about what it is.** CONCEPT §3 and REDTEAM UPDATE 1 §4 say plainly the gate is
   lexical and protects the total, not the next action. The red-team went *harder* three times (forced choice,
   final templates, tiers 1–3 on the shipped `payload()`) and got stronger; UPDATE 4 / D-063 documents the
   0/60 "spectacular PASS" that was actually an unparsed-reply bug and refuses to publish it. That paragraph is
   worth more to a panel than any headline number.
5. **Degrade path works.** No key → template, `reason:"no_key"`; `buddy_test` covers throw, hang, non-200,
   schema miss, each gate stage. Templates are gate-checked at build time (`readinglevel.py --assert`, 24/24)
   so the fallback can never fail its own gate. `run_all.py` asserts `TEMPLATES == hints_v2.txt`.
6. **Measurement plan is honest.** `TRANSFER-TEST.md`: pre/post/48 h, no trained shape or commute in any item,
   two pre-registered unrelated-skill controls scored separately, falsification sentence written before any
   child is seen, COI and unblinding scripted for camera. n=3, no p-value, said first. This is the correct
   posture and almost no entry will have it.
7. **R5 holds at runtime.** No `package.json`, no `node_modules`, ~830 lines across the five shipping files,
   one localStorage key, one delegated listener, CSS-only animation. Zero console errors across every page I
   opened. Persistence restores a mid-level packs build exactly (`[4,4,2]`, 10 rails, 1 pack in cart — observed
   after reload). Parent page reads the same log through the same `classify()` and produced the right "ask
   out loud" for the last named misconception (observed).
8. **Negative decisions are documented with evidence** (no voice: child-ASR WER + COPPA voiceprints; no vision;
   no RAG over 12 nodes; no agents; deleted latency heuristic; deleted `rapid_guessing`; 6×2 → 2×5 to fix the
   baseline). This is exactly Nerdy's "user value over novelty" line, shown rather than quoted.

---

## Weaknesses, ranked by what they cost with a Nerdy panel

### W1 · SEV1 · Parts 1 and 2 are unreachable by a real tap — the demo beat cannot be played by hand
- **Evidence.** Real clicks at the centre of part 1 and part 2's hit regions logged seven `place_failed`
  events and placed nothing; part 0 worked. `document.elementFromPoint` over a 9×9 grid of each hit box:
  part 0 **52 %** reachable, part 1 **0 %**, part 2 **0 %**; blocker in 87 % of samples = `.bld` /
  `cornYoungDouble_E.png`, the rest = posts.
- **Cause.** `fence.mjs:178` renders the corn as full 132×264 px `<img>` canvases at `z-index: 150 + r`;
  `fence.mjs:259` gives `.hit` `z-index: 50`. Transparent pixels of an `<img>` still receive pointer events. The
  goat (`z-index: 90`, `fence.mjs:263`) also overlaps parts 0/1 at rest.
- **Why QA missed it.** `TEST-REPORT.md` case 3 built `[4,4,3]` and reports events, not pointer coordinates;
  the harness clicked elements. A senior engineer reads "independent QA PASS" against "cannot tap part 2" and
  concludes the author has not played their own game with a finger. That is the most expensive sentence a
  panel can write about a *product* engineer.
- **Fix.** One CSS line in `FENCE_CSS`: `.isoworld .tile,.isoworld .bld,.isoworld .goat{pointer-events:none}`
  (rails must keep events for `remove`). Then re-verify with a real tap on all three parts at 1280 and 375.

### W2 · SEV1 · Three unauthenticated LLM-proxy endpoints from the frozen arm are live on the shipping server
- **Evidence.** `POST /api/coach` on my :5190 instance returned a real DeepSeek reply ("Hi there! 😊 …")
  using the `DEEPSEEK_API_KEY` in the environment. `server.mjs:48–65` routes `/api/coach`, `/api/narrate`,
  `/api/story` to `coach.mjs` / `story.mjs`, which read `process.env.DEEPSEEK_API_KEY` at runtime.
- **Why it costs.** `TECH-STACK.md §4` states "`DEEPSEEK_API_KEY` is eval-only and never touched at runtime" —
  false on the committed tree. `/api/coach` forwards caller-supplied `history` verbatim (`coach.mjs:55–59`) =
  an open LLM proxy; the three handlers read the body with no size cap (`server.mjs:49,55,61`, contrast the
  4 KB cap at `:22`). Deployed to Render with that key set, anyone with the URL burns the owner's credit and uses
  the child-safety-branded server as a free chatbot. It also contradicts the pitch "the child never types, so
  there is no free text to send" — there is, one route over.
- **Fix.** Either stop mounting the frozen routes in `server.mjs` (the frozen pages can 404 — they are a
  side-by-side for the *video*, not a judged URL) or gate them behind `process.env.CONTROL_ARM === "1"`. Update
  TECH-STACK §4 to match. ~0.5 h.

### W3 · SEV2 · R1 (no AI-assistant attribution) is violated in the places a panel actually reads
The model id, API host, header and env-var name are legitimate config. These are not:
- `evals/killtest_beta.py:24` — a hard-coded absolute path
  `C:/Users/Manpreet/AppData/Local/Temp/claude/D--My-work-Project-learning-app/<session-id>/scratchpad/sp`
  committed in `9e5f842`. It names the assistant's scratchpad and a session id. Tracked.
- `.claude/launch.json` — tracked. The directory name is the tell.
- `docs/DECISIONS.md:33–37` (D-002) — "No `Co-Authored-By: Claude`, no `Generated with Claude Code`" written into
  the public decision log announces exactly what it forbids. `docs/LEARNING.md:85–86` "swap … to Claude for the
  final submission (CLAUDE.md: default to latest Claude models)". `CLAUDE.md` itself is referenced by name in
  `INDEX`, `TECH-STACK:3`, `REVIEW-R1:5`, `REVIEW-R3:5`, `IDEAS:8`, `DECISIONS:50,57`, `TEST-REPORT:65`.
- **Voice.** Several docs read as a team process rather than one author; reworded 6 Sep so review rounds and research passes are described in the author's voice.

### W4 · SEV2 · "Tap a full part to count" collides with "tap a plank to remove"
- `build.html:146–148`: with an empty hand, a tap that lands on a rail `<img>` (has `data-i`) **removes** the
  plank; only a tap on the bare hit region counts. On a full part, 35 % of the hit box is rail (measured). My
  first empty-hand tap at the centre of a full part removed a plank (`remove group:0 n_in_group:3`). A child told
  "count a full part" will tap the planks — that is what counting *is* — and dismantle the correct part. On
  camera, the presenter's counting tap has a one-in-three chance of breaking the fence. Decide: remove only via
  a long-press / only the top rail / only while a "take back" mode is held; or count on any empty-hand tap and
  make remove a second tap on the same rail. Write the decision down (D-0xx).

### W5 · SEV2 · Two differentiators the docs sell are not in the build
- "The farm is a **readout of mastered skills**" (D-044, MARKET.md gap #2, CONCEPT §1 "one data structure,
  four readers") — the shipped page shows one plot at a time; mastery is a 0/0.5/1 number surfaced only as a
  sentence on `parent.html:58–59`. There is no world that accumulates. Say "one screen, one plot, mastery is a
  parent sentence" or do not list the readout as a differentiator.
- "Adaptive floor, learner-chosen ceiling — child picks which building, harder always allowed" (D-043 #6) — not
  present. `next()` (`fence.mjs:22–25`) is a linear scan; the first level is hard-coded to the demo shape
  (`build.html:257–258`, `3x4_concrete`, not the graph's first node `2x3`). A panel will ask why the "mastery
  graph" opens on the camera shape. Also: a level finished *with* a hint scores 0.5 and is re-served on every
  pass until finished unaided — defensible, but undocumented, and a child stuck on one misconception replays the
  same plot indefinitely.

### W6 · SEV2 · The classifier eval measures self-consistency, not accuracy
`classifier_fixtures.json` was written by the same author who wrote the precedence rules it tests
(`fence.mjs:78–86`). "100 % right when committed" is therefore a regression suite, not a validity number, and
the docs lean on it as "the headline artefact". Example of a precedence call the fixtures simply agree with:
`4×3 [4,4,4,0]` is labelled `counted_groups_as_group_size` (`fence.mjs:63,79`) but is also "all the wood used,
one part bare" — the literal definition of `right_total_wrong_grouping` (`:80`). Which one a child *meant* is an
empirical question the pilot could answer (ask her) and the eval cannot. Say "68 hand-written fixtures, 100 %
consistent with the spec" in the video; do not say "100 % accurate".

### W7 · SEV3 · Trust boundary and hygiene nits a code reviewer would leave
- `server.mjs:36–37` `TYPES` fine now; `server.mjs:69` `path.includes("..")` + `startsWith(PUBLIC+sep)` is
  sound for raw URLs; `%2e%2e` is not decoded so it cannot traverse — OK, but add the test to `buddy_test` or a
  tiny `server_test.mjs` so QA D-5 cannot regress silently.
- `phrase()` `timeoutMs = 1000` (`buddy.mjs:132`) inside `hint()` `timeoutMs = 1200` (`:100`): 200 ms of slack
  for the round trip on a cold Render instance is thin; the client will time out first and show the template
  while the server is still paying for the model call. Set server 800 / client 1500 or measure on day 7.
- `build.html:81` `save()` serialises up to 500 events on every tap; fine at this scale, note the ceiling
  (`ponytail:`) or trim to 200.
- No `requirements.txt`: `redteam_leak.py`, `killtest_*.py` need `openai`, `killtest_beta.py` needs `numpy`,
  `make_parts.py` needs `Pillow`. "Zero dependencies" is true of the runtime; say "zero runtime dependencies".
- `evals/latency_cost.mjs` exits 0 with SKIPPED when no key — correct — but the cost/latency table is still a
  promise, and CONCEPT §5 lists p50/p95 in "the headline is the deterministic set". Drop it from the headline
  until measured.

### W8 · SEV3 · Accessibility floor
- The hint bubble (`build.html:51`) has no `role="status"` / `aria-live`; the hit regions are `<div>`s with no
  keyboard path; every sprite is `alt=""`. For a children's touch product this is arguable, but a panel
  asking "how does a screen reader hear the hint?" gets "it doesn't". `role="status"` on `#bubble` is one
  attribute. Tap targets: 44 px minimum verified on buttons; hit regions are 66–170 px wide (QA) — fine.
- `prefers-reduced-motion`: pips static, rails/goat no animation — verified in CSS (`build.html:44`,
  `fence.mjs:266`). Good.

### W9 · SEV3 · Presentation cues that will read wrong on camera
- `[5,4,3]`: goat walks to part 3 (first short part, `build.html:197`) while the bubble points at part 1 (first
  `!== per`, `:198`) — two cues, two places, one sentence about "that part". Point both at the same part.
- Packs `[4,4,4]` from 12 packs: a complete-looking fence that the game refuses to finish (QA D-10, by design
  D-047). Without a voiceover line it reads as a bug.
- `#task` header carries the problem as digits ("3 parts. 4 planks in each part.") — the only diegetic "situation
  written on the rail" promised in CONCEPT §2 is a header line. Fine, but do not say "the situation is on the
  rail" in the video.

### W10 · SEV3 · Docs-to-product ratio
6,490 lines in `docs/` against ~830 lines of shipping code, 32 markdown files, five killed concepts, three
review rounds, and a two-day slip (D-049) spent on documents. A panel that values shipped-over-described will
read this either as unusual rigour or as a process that produces documents about documents. The README must
make the case in the first screen that the docs are the *evidence*, and INDEX.md must be the only doc a
reviewer needs to open. As it stands a reviewer opens `docs/` and sees `CONCEPT.md`, `CONCEPT-V3.md`,
`CONCEPT-V3.1.md`, `CONCEPT-V3.2.md`, `IDEAS.md`, `IDEAS-V2.md` — move history into `docs/history/`.

---

## What to fix before filming (ordered; effort in hours)

| # | Fix | Where | h |
|---|---|---|---|
| 1 | `pointer-events:none` on `.tile`, `.bld`, `.goat`; then **play all six error states with a real finger on a phone** and re-run the `elementFromPoint` grid at 1280 and 375. Add the grid as a check in a tiny browser smoke test or in TEST-REPORT with coordinates. | `fence.mjs:257–266` | 0.5 + 1 |
| 2 | Unmount `/api/coach`, `/api/narrate`, `/api/story` from the shipping server (or env-gate them); cap their bodies if kept; correct TECH-STACK §4's "never touched at runtime". | `server.mjs:48–65`, `docs/TECH-STACK.md` | 0.5 |
| 3 | Attribution scrub: remove the scratchpad path from `killtest_beta.py:24` (make it a CLI arg), untrack `.claude/`, reword D-002 and LEARNING:85, decide CLAUDE.md's fate (rename to `docs/CONSTITUTION.md` or leave and own it), and write **one** README sentence that owns the workflow instead of hiding it. Rewriting 35 orchestration tells is optional; the README sentence is not. | `evals/killtest_beta.py`, `.gitignore`, `docs/DECISIONS.md`, `docs/LEARNING.md`, README | 1.5 |
| 4 | Resolve count-vs-remove (W4): make an empty-hand tap on a full part count, and remove only from the top rail *while* the part is not full, or after a second tap. Fixture + decision entry. | `build.html:146–148`, `fence.mjs`, `DECISIONS.md` | 2 |
| 5 | Align goat and bubble on the same part for over-count/right-total states (W9). | `build.html:197–198` | 0.5 |
| 6 | Reword the claims (W5, W6): "one plot at a time; mastery is one parent sentence", "68 fixtures, 100 % spec-consistent". Remove "farm is a readout" from MARKET's gap list or ship a 12-tile strip of finished fences on `parent.html` (2 h, optional). | `docs/CONCEPT-V3.2.md §1`, `MARKET.md`, `README` | 0.5 (+2) |
| 7 | Move superseded docs to `docs/history/`; INDEX becomes the one entry point. | `docs/` | 0.5 |
| 8 | `role="status"` on `#bubble`; `requirements.txt` for the eval scripts (or a comment header); server 800 / client 1500 ms. | `build.html:51`, `evals/`, `buddy.mjs:100,132` | 0.5 |
| 9 | Live Haiku check the day the key arrives: one curl, then `latency_cost.mjs`, then paste the table into the split-screen. If no key by day 7, the video says "template path shown; live path unit-tested, not measured". | — | 0.5 |
| 10 | Run the pilot exactly as `TRANSFER-TEST.md` says, and film the null if it is a null. | — | as planned |

Total before filming: **~8 h** of engineering plus the pilot.

---

## What to say — and not say — in the video

**Say**
- "There is no answer box. The number of planks she places *is* the answer, and a wrong count leaves a fence
  with a hole in it that a goat walks through." Show it inside 20 s. Tap with a visible finger.
- "The model never sees a number. Here is the whole payload." Show `payload()` output on screen: five booleans
  and the word `some`. "An attacker model given this exact input recovers the total 30 % of the time against a
  32 % always-guess-12 baseline."
- "The classifier is a table. Sixty-eight hand-written sequences, and when it is not sure it says so — and asks
  her to show me a finished part." Show the `[3,3,3]` probe.
- "Pull the cable." Show the template bubble with `reason: no_key`.
- The ten scripted disclosures in CONCEPT §9 — all of them, especially the COI, the unblinding, n=3, and
  "the gap between this and what ships is narrower than the pitch implies".
- The pilot result, whichever way it went, in the pre-committed words.

**Do not say**
- "100 % accurate classifier" (say *spec-consistent*).
- "The farm is a readout of mastered skills" / "the child chooses her plot" (not built).
- "Zero dependencies" (say *zero runtime dependencies*).
- "p50/p95 latency" or "$0.0007 per hint" as measured numbers unless `latency_cost.mjs` has run on a real key.
- "Independent QA passed" without adding "and I then played every state by hand on a phone" — after fix #1.
- Anything about the live Haiku phrasing being *better* than the template. You have no measurement of that and
  the template is what runs.

---

## Questions the panel will ask in the interview — be ready

1. You have 68 fixtures you wrote yourself. How would you know if the classifier is *wrong* about a child? What
   did the three pilot children's logs say when the classifier committed?
2. `[4,4,4,0]` on 4×3 — counted-groups-as-size or right-total-wrong-grouping? Why does precedence get to decide?
3. The gate is lexical. "Add another plank" passes. Why is that fine, and where exactly would it stop being fine
   (division? subtraction?).
4. Why Haiku at all? The template is what ships and what you measured. What does the model add that a 7-year-old
   can feel — and did you test whether children preferred the phrasing?
5. Show me the last time you tapped part 2 on a phone. (Have the answer be "this morning, here is the video".)
6. Three unauthenticated LLM endpoints were on the server. Walk me through how that got past your own trust
   boundary section.
7. Your docs describe review rounds and research passes. What did *you* decide, and what would you have
   done differently without them? (Have an honest answer; it is a strength if owned.)
8. The parent gets one sentence and one question. What is the evidence that a parent reads it, and what happens
   at week two?
9. You froze an Elo engine as a "control arm" that appears in no measured comparison. Why keep it in the
   shipping server?
10. Twelve nodes, all Year 2–4 grouping. What is the next node, and does the mechanic survive division or
    anything beyond ~30 objects?
11. Render cold start is ~60 s. What does the judge see at second 5?
12. If the pilot is a null, what do you ship next — and what would have to be true for you to conclude the
    mechanic, not the dose, is the problem?

---

*Method note.* Everything above marked "observed" was produced in my own browser tab against `PORT=5190
node src/server.mjs` on the committed tree, with `localStorage` cleared first; all eval commands were run from
the repo root; no source, data or eval file was edited; the server was stopped and the tab closed afterwards.
