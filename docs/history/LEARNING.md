# LEARNING LOG

Running notes. What we learn while building — surprises, dead ends, things that worked.
Append with a date heading. Keep it honest; the dead ends are the useful part.

---

## 3 Sep 2026 — Day 0

- Read the brief. Deadline **18 Sep**, 15 days.
- Research pass done → `docs/RESEARCH.md`.
- Biggest surprise: the obvious build is contradicted by evidence. Unguarded GPT-4 left
  students **17% worse** than a control that never had AI (PNAS 2025). Guardrails erase the
  harm but add nothing. So "helpful AI tutor" is not a safe default — it is the trap.
- Second surprise: the largest measured win in the field points AI at the **tutor**, not
  the learner (Stanford Tutor CoPilot: +9pp for the weakest tutors).
- 10 candidate concepts → `docs/IDEAS.md`. Concept not yet chosen (D-007 open).

---

## 4 Sep 2026 — Day 1 of build (concept locked after 5 kill-tested pivots)

Committed to **Rung + buddy** (D-035) after killing 5 concepts, each with a cheap kill-test,
zero wasted build. Meta-lesson logged (D-034): the novelty veto cost 4 days; execution is
the real differentiator.

**Built today — the engine heart, verified:**
- `src/engine/engine.mjs` — Rasch/Elo adaptive engine + correct-by-construction problem
  generator (code owns every answer).
- `evals/engine_eval.mjs` — honest eval, 400 simulated learners. Real numbers:
  - **in productive-struggle band: adaptive 66% vs random 16%** (4×)
  - estimates ability in **12 items vs 23**
  - self-check + claim assertions pass (breaks loudly if logic regresses).
- Framing kept honest: measures the *selection policy*, not real-child learning gains
  (that needs a classroom — stated as a limitation).

Next: coach API (never-give-answer guard, reuse proven prompt), then play UI, then the
two-learner measurement view.

## 4 Sep 2026 — Day 1 build, later: the play UI runs

Full core loop working and verified live in-browser (localhost:5177):
- `src/server.mjs` — zero-dep Node server: serves the page, proxies the buddy call
  (API key server-side). Engine served as a module and reused client-side (no duplication).
- `src/public/index.html` — the play screen. Kid-friendly, one page. Adaptive difficulty
  ladder visibly climbs on success; correct-by-construction checking; buddy chat panel.
- Verified: correct answer -> harder problem (Level 3->4 on screen); wrong answer -> buddy
  diagnosed the *exact* error ("you subtracted 7 from 2... borrow one ten from the 60 first")
  and never gave the answer. In-sweet-spot % and streak update live.

Three days of build assets now real and runnable: engine, coach, playable UI. Next:
the two-learner measurement view (the split-screen demo shot) + light polish, then film.

## 4 Sep 2026 — Day 1 build, cont.: the measurement view runs

`/measure` (`src/public/measure.html`) verified live. Two simulated learners (Maya low
ability, Sam high) auto-play; the SVG difficulty chart shows their paths starting together
and diverging (Sam -> Level 5-6, Maya -> Level 2-3). Headline numbers computed LIVE in the
browser over 250 learners: ~62% vs ~17% in-band (matches the node eval's 66/16 within run
variance). Honest-scope note on screen (measures policy, not real-child learning gains).

Both demo screens now exist and run: / (play) and /measure (evidence). Build steps 1-4 of 5
done in day one. Remaining: polish (incl. seed the live batch for a stable headline; verify
Enter-to-check) + film the 3-min video.

NOTE for canonical numbers: cite the deterministic node eval (66% vs 16%, 12 vs 23 items) as
the headline; the live /measure view approximates it and varies per run by design.

## 4 Sep 2026 — Day 1 build, polish pass done

- `/measure` made DETERMINISTIC (seeded RNG): headline stable at **63% vs 16% in-band,
  finds level in 14 vs 23**, over 400 learners. Paired design (adaptive vs random face the
  same learners + coin-flips; only selection differs) — fairer and reproducible for film.
- Seeded the two-learner animation so Maya/Sam diverge cleanly on every take.
- Play screen: hid number-spinner arrows; hardened Enter-to-submit (verified: Enter →
  checks → advances → level climbs). Fixed learner-count label (250→400).
- `docs/FILMING.md`: full shot-by-shot 3-min script + pre-flight checklist.
- `docs/DEMO.md`: numbers aligned to what the app shows.

Build steps 1–5 essentially complete: engine, coach, play UI, measurement view, polish.
Product is demo-ready and runs clean. Remaining is Manpreet-side: record the video, and
optionally deploy (Render/Railway; or lift /api/coach to a serverless fn for Vercel) + git.

NOTE: buddy currently uses DeepSeek (only key available here). coach.mjs is provider-agnostic
— swap baseURL/model/key to the chosen phrasing model for the final submission. No code
change beyond the config object.

## 4 Sep 2026 — Day 1 build, rounds 1-3 (build↔critique loop)

Three verified engineer↔critic rounds turned the demo-ready product into a high-end one:
- R1: non-circular metric (`engine_eval2.mjs`) — adaptive wastes 24% vs 58% under model
  misspecification vs a real fixed-curriculum baseline. Live in `/measure`.
- R2: generative theming (`story.mjs`, `/api/story`) — pick-your-world stories, code-owned
  numbers + guard. Real genAI, correctness intact, autonomy+curiosity. Verified in browser.
- R3: game arc — summit goal + celebration + confetti + streak. Verified (8 correct → summit).
All running at localhost:5177. Files: src/engine/{engine,coach,story}.mjs, src/server.mjs,
src/public/{index,measure}.html, evals/{engine_eval,engine_eval2,coach_test,killtest_*}.

## 4 Sep 2026 — the de-generic rebuild (Manpreet's call, and he was right)

Product felt generic because the game was a *wrapper* around practice. Research: Prodigy works
because combat IS the maths; AI companions with memory create the bond that drives persistence.
Rebuilt: village-building where each build's cost is the adaptive problem, the child CHOOSES
what to build, and the AI narrates a persistent world that remembers them by name and references
earlier builds. Verified end-to-end in browser. Files: src/engine/story.mjs (narrateBuild),
/api/narrate, rewritten src/public/index.html.

## 4 Sep 2026 — the visual layer: AI paints the village

Manpreet: "very basic icons, no good visuals or animations — use free AI tech." Right.
Added a generative painting of the child's ACTUAL village (Pollinations: free, no API key,
browser-callable; ~6.3s first paint, ~0.5s cached, deterministic URL). Prompt composed from
their build list, seed fixed per child so the village stays theirs. Cross-fade + Ken-Burns
drift + tile pop + confetti + hover-lift. Graceful fallback to sky gradient on error.
Verified live. This is the answer to "generic": their maths decisions paint their world, and
a hand-authored competitor structurally cannot do it.

## 4 Sep 2026 — I shipped a broken feature and got caught

Added an AI-generated village painting, verified only that an image LOADED, and called it done.
Manpreet: "it's the exact same image." Tested it properly: buildings didn't appear (3-building
image had no bridge), fixed seed made every painting look identical, and long prompts returned
1.3KB error placeholders. Deleted it. Rebuilt the scene in code (src/public/village.mjs):
real SVG buildings at slots, parallax hills, drifting clouds, chimney smoke, turning wheel,
glowing lanterns, sky morning→dusk→stars as it grows. Instant, offline, always correct.
Lesson, and it is the same one as D-029 in a new costume: "it loaded" is not "it works" —
verify the OUTPUT, not the mechanism.

## 4 Sep 2026 — professional art pipeline (SVG was a school project)

Replaced hand-drawn SVG with Kenney CC0 isometric game art (landscape tiles + miniature farm).
Everything was measured, not assumed: projection verified by tessellation test; grass tile found
by pixel analysis of top faces; sprite anchors computed from PIL opaque-bbox and baked in; roof
offset found by visual sweep (-120); z-order bug (front tiles covering rear buildings) found by
forcing z-index and observing. World re-themed to a farm because that is what the art supports.
Trimmed to 361 KB of assets. 0 broken images, 0 errors.

## 4 Sep 2026 — slot layout

Buildings were clustering in one corner. Fixed by choosing slots in SCREEN space rather than
grid order: on an iso grid screen-x is (c-r) and screen-y is (c+r), so slots now vary both.
Spread spans x -264..+264 and y 33..231 across 10 distinct cells; early builds land far apart
so a 3-4 building village never looks cramped, and the centre (2,2) fills late so it reads as
a village green until the farm is busy. Verified at 4 builds and at 10: 16 sprites, 0 broken,
0 errors.

## 4 Sep 2026 — UI art direction pass

"Still not professional" was right, and the cause was specific: emoji sitting next to rendered
3D sprites, default system type, and a purple palette unrelated to wood-and-grass artwork.
Added buildPreview() so choice cards render the real sprite stack; removed every emoji used as
art; Fredoka + Nunito; palette pulled from the artwork; grounded the island with a shadow and
vignette; fixed choice cards wrapping (flex fixed-width -> 2-col grid, 427px -> 208px tall).

## 4 Sep 2026 — stopped building; researched the learner properly

Manpreet: "is it actually meaningful for a learner of that age? No storyline, placement makes no
sense. Stop and research." Ran 5 parallel research agents (attention, motivation, narrative,
game design, retention/ethics) + a master analyst; spot-checked the two load-bearing citations
myself. Verdict in docs/RESEARCH-LEARNER.md, decision in D-043.

The finding that reframes everything: the current build is EXTRINSICALLY integrated — maths is a
tollgate before the build, not the build. Habgood & Ainsworth (7–11s) show that configuration
gives engagement without learning; the intrinsic version gave more learning at equal time AND
7x longer voluntary play. And "no storyline" was the right symptom with the wrong cure: the one
direct RCT (Sýkora 2021) found cutscene story changed nothing — what's missing is meaning for the
numbers, i.e. the village's need must BE the problem.

Cheap, fast, and should have been step one.


## 4 Sep 2026 — the critic loop (3 rounds) and what it taught

Ran critic → innovator → critic → innovator → critic, capped at 3. R1 found two FATAL flaws I'd
have shipped: the "never given the answer" claim was false (the build state handed the target
over in factored form), and dragging 12 planks is counting, not multiplying. R3: SATISFIED.

The thing that actually moved the needle was not argument but MEASUREMENT run mid-loop: the
red-team eval found a real leak in a field I thought was harmless ("a couple" vs "a few"); the
reading-level scorer found the templates violated the product's own gate; the art probe killed the
sheep and the broken-fence beat. Each of those changed the plan. Lesson: when a critic says
"prove it", run the test before the next round — evidence closes items that prose only argues.
