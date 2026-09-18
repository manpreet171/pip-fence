> History. The final pre-build design review. Kept for the record.

# REVIEW — Round 3 (final) verification of CONCEPT-V3.2

4 Sep 2026. Same review series as R1 and R2. Verified against REVIEW-R2, CONCEPT-V3.2,
ART-FEASIBILITY, REDTEAM-RESULTS (incl. updates 1–2), READINGLEVEL-RESULTS, `data/wordlist.txt`,
`data/hints_v2.txt`, RESEARCH-LEARNER, AI-ARCHITECTURE, CONSTITUTION.md and the source.

## Verification table

| Item | Verdict | Reason |
|---|---|---|
| R1-1 red-team floor / question | **CLOSED** | REDTEAM UPDATE 2: forced choice, bucket leak closed, "still needed" dropped, rerun on final templates — 40.0% vs 48.3% baseline, shape 11.7% vs 16.7% floor. Genuine PASS. |
| R1-2 packs force multiplication | **CLOSED** | Ordered once, delivered once, no top-up; indivisible at point of use. UNEVIDENCED flag verified true (no concreteness/unitising citation in RESEARCH-LEARNER). |
| R1-3 art proof | **CLOSED** | Goat everywhere; SVG sheep gone; `fenceHighBroken` dropped; missing section adopted; `assets/animals/goat.png` on disk. |
| R1-4 sequence classifier | **CLOSED** | Strengthened — the unvalidatable latency heuristic is deleted. |
| R1-5 over-count | **CLOSED** | `[5,4,3]`, `[12,0,0]` specified. See NEW-1. |
| R1-6 transfer instrument | **CLOSED** | Pre-test added, item 1 replaced, controls separated. Constraint verified: {3,6},{3,5},{4,6},{3,7},{2,9},{5,6} — no trained shape in either order, no commutes. |
| R1-7 n=3 contradiction | **CLOSED** | §5 and §8 agree: three children, no arms, within-child. |
| R1-8 / N7 Elo | **CLOSED** | Verified `index.html` and `measure.html` both import the engine; freezing is the only correct call; lost measurement named. |
| R1-9 wording | **CLOSED** | |
| R1-10 parent screen | **CLOSED** | Correlational flag preserved. |
| R1-11 day-12 collision | **CLOSED** | Pilot 9 → retests 11 → film 12. |
| R1-12 split screen + number | **PATCH** | Uses the superseded UPDATE-1 number. |
| R1-13 wordlist | **PATCH** | Doc overstated the file (at review time). |
| N1 majority baseline | **CLOSED** | Recomputed on fixtures; `"a couple"` leak closed to `"some"`. |
| N2 lexical gate oversold | **CLOSED** | Honest correction paragraph, repeated on camera. |
| N3 `[3,3,3]` collision | **PATCH** | Fix right (diagnostic on 4×3, latency deleted); §4's list wrong — 4×5 collides. |
| N4 place_failed / rapid_guessing | **CLOSED** | Held-only definition; rapid_guessing dropped with reason. |
| N5 village.mjs rescale | **CLOSED** | Verified against source: export `iso`/`BB` (one word each), `insertAdjacentHTML` on `.isofit`, `plop` bound to `.bld`. "~1 h" honest for hit-testing; §8 budgets ~4 h for all three changes. |
| N6 cart finiteness | **CLOSED** | FINITE, logged. See NEW-1. |
| N8 control items | **CLOSED** | Named, pre-registered, /2 separately, registered prediction. |
| N9 unblinding | **CLOSED** | Substitution explained, not silently dropped. |

## PATCH list (all applied — see CONCEPT-V3.2 Errata)
1. §3/§9: old template → `data/hints_v2.txt` line 1. Doc lag, not design.
2. §3/§0: wordlist claim vs file. *(Resolved the other way: Fry was added to the file after review; doc and file now agree; domain count 40→28 corrected.)*
3. §3/§9: red-team numbers → UPDATE 2; final-template rerun marked done.
4. §4: 4×5 moved to the colliding set — "true for 2×3, 3×4, 4×5; false for 3×3, 4×3, 2×5."
5. §6: add the three `server.mjs` route lines.
6. §3: templates gate-checked at build time by a committed assert (`readinglevel.py --assert`).
7. `coach.mjs` line 12 confirmed — no change.

## OPEN list
**None.** Nothing remaining requires design work before building.

## New problems (all applied as patches)
- **NEW-1** — the finite cart makes `[4,4,3]` readable as abandonment (one plank visibly left).
  Resolution (b) taken: say it aloud — *"she still had a plank and walked away — that is the
  misconception, on screen."*
- **NEW-2** — the decomposed fence frame (posts + rail + N parts) is uncosted art on the critical
  path. Added to day 2 at 1–2 h.
- **NEW-3** — §2's "top rail floating" assumes the day-1 height test passes; hedged with the
  rail-less fallback.

## Verdict
**SATISFIED, subject to the PATCH list** (now applied).

"Every R1 and R2 item is closed or is a doc edit an editor makes in under thirty minutes. The three
evidence documents produced today did real work: the red-team result survived being made *harder*
twice (forced choice, then final templates) and got stronger; the reading-level measurement caught
the product violating its own gate and produced compliant rewrites before a line of buddy code
exists; the art probe killed a beat rather than defending it. That pattern — evidence that changes
the plan — is the thing a Nerdy panel is actually looking for, and it is now visible in the repo
rather than asserted in a pitch."

**Residual risks accepted, logged as CONCEPT-V3.2 §10 items 8–10:** three of six shapes collide on
the per-group pair (ambiguity channel carries more load); all eight test items are near-transfer (a
null is the likely outcome and is pre-committed); the leftover-plank cue.

**"Build it."** Learner on screen doing arithmetic with her hands; the mechanic is the maths; the beat
fits in twenty seconds; the AI layer is a real product decision — redacted payload, measured leak
rate, code-owned truth table, graceful offline degrade — not a chat box. What is left is fourteen
days of execution. The riskiest remaining thing is day 1 being spent on documents with `mountScene` +
`appendPlank` + the delegated listener unstarted: ship those tonight or move them explicitly and cut
the day-10 buffer — do not carry a silent four-hour slip into a fourteen-day plan.
