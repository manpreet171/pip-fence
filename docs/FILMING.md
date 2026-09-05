> **SUPERSEDED 4 Sep 2026.** This filming script describes the OLD build. Film day is day 12, hands only, no child voice (voiceprints are personal information under amended COPPA). Consent + film-release forms per §8. Current authority: `docs/CONCEPT-V3.2.md §8–9`.

# FILMING — the 3-minute demo (do this, in this order)

Server: `PORT=5177 node src/server.mjs`. Screens: `/` (build your village) and `/measure` (evidence).
**Clear localStorage before filming** so the village starts empty: devtools → Application → Local Storage → delete `rung.village`.
Record at 1000×760+, browser zoom 100%. One clean take per shot, stitch after.
Canonical numbers (deterministic, shown on `/measure`): **wastes 24% of questions vs 58%** for a fixed curriculum; **frustration 2% vs 27%** —
robust even when the engine's assumptions are wrong.

## Cold open (0:00–0:15) — the thesis, spoken over the play screen
Say: "Photomath gives kids the answer. Khanmigo withholds it but gets the maths wrong.
Rung does neither." Show the play screen, buddy line visible.

## Shot 1 (0:15–0:45) — the maths IS the building
Two build options appear, each with its own cost. PICK ONE (say: "their village, their call").
Work out the cost → the tile pops into the village. Say: "You can't build without doing the maths."
Then reload the page — the village is still there and the buddy greets them back. That memory is
the thing a hand-authored game structurally cannot do.

## Shot 1b — the village grows (the visual wow)
After the build lands, hold on the village strip: their building is drawn into the scene
instantly — smoke curls from the cottage chimney, the wheel turns, lanterns glow. Build 4-5
things and the sky shifts to dusk and stars come out. Say: "Their maths decisions build the
world — drawn in code, so it's instant and it always shows exactly what they chose."
NOTE: no network needed for the scene; it cannot fail on camera.

## Shot 1c — help that won't just tell
On `/`. Type a WRONG answer to the shown problem (e.g. for 62−17 type 55). Check.
Buddy diagnoses the exact slip and asks a guiding question. Point: "It caught the mistake,
and it will not hand over the answer." Then click "just tell me" via the buddy box → it
refuses warmly.

## Shot 1b (0:40–0:55) — the child's world (autonomy + generative AI)
On `/`. Tap a theme (🐉 Dragons). The SAME problem re-appears as a story — "Blaze the dragon
 found 20 pebbles…" Say: "They pick the world; AI writes the story — but the numbers are still
 generated and checked in code, so it can't be wrong."

## Shot 2 (0:55–1:10) — it adapts, and there's a summit to climb
On `/`. Answer 3–4 correctly in a row; the level ladder visibly climbs. Miss one; it eases.
Say: "Every problem is picked for where this child actually is."

## Shot 3 (1:05–1:15) — correct by construction
Point to the footer line: "Every problem is generated and checked in code — the buddy
literally cannot give a wrong number." Say: "That's the reliability the market leader lacks."

## Shot 4 (1:15–2:00) — the evidence (the money shot)
Go to `/measure`. Let it animate. Two children start together; the difficulty paths split —
Sam to Level 5–6, Maya to Level 2–3. Say: "Same app, no setup. It found each child's level."

## Shot 5 (2:00–2:25) — the number
Stay on `/measure`. Read the headline: "It keeps children in the productive-struggle band
wastes just 24% of a child's questions on boredom or frustration, versus 58% for a fixed
curriculum — and this holds even when the simulated child behaves in ways the engine never assumed — computed live, over 400 learners."

## Shot 6 (2:25–2:45) — honesty (the senior signal)
Read the footer: "Honest scope — this measures that the engine targets the right difficulty,
not that children learn more; that needs a classroom." Say: "I'm showing what I can prove."

## Close (2:45–3:00) — the one-sentence architecture
Say: "Code owns the truth. The AI owns the language. The engine owns the difficulty.
That's Rung." End on the play screen or a title card.

## Pre-flight checklist
- [ ] `DEEPSEEK_API_KEY` set in the server's env (buddy replies)
- [ ] Hard-refresh both pages; buddy responds within ~2s
- [ ] `/measure` shows 63% vs 16% (deterministic)
- [ ] Enter submits an answer; spinner arrows hidden
- [ ] Pick the wrong-answer number in advance so the buddy's diagnosis is crisp
