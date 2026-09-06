# CRITIC — Round 1 review of CONCEPT-V3

4 Sep 2026. Independent expert critic (children's edtech, learning science, applied AI).
Mission: find every loophole so the concept can be made bulletproof — not to kill it. Read
CONCEPT-V3, RESEARCH-LEARNER, AI-ARCHITECTURE, MARKET, CLAUDE.md and the actual source
(`engine.mjs`, `coach.mjs`, `village.mjs`, `index.html`, `server.mjs`, `measure.html`, assets).

---

## Loopholes (ranked by severity)

**[FATAL] 1. "The model cannot leak a number it was never given" is false — the target is in the prompt, factored.**
The prompt contains the build state and the misconception ID. Build state for the demo case is
`[4,4,3]` with `required_per_section: 4`; the hint written at 0:48 is *"Section three has 3
planks. The other two have 4."* Any model that can count has been handed 12 in factored form —
and `off_by_one_per_group` + placed count *is* the target, exactly. So "answer-blind" is a
phrasing trick, and 0/60 leak rate measures the **output gate**, not the architecture. The gate
is also ill-defined: is the forbidden number 12 (total), 3 (still needed), or 4 (per group)? Ban
all three and the buddy cannot speak; ban only 12 and it can say "you need three more," which is
the answer to the actual task.
**What would satisfy me:** stop claiming "never given." Either (a) genuinely redact — send
`{groups: 3, one_group_short: true, tier: 1}` with no counts, so the number is not
reconstructable; or (b) keep the state and run a **red-team eval**: give a frontier model the
exact hint prompt and ask it to name the target, over 60 fixtures, and publish its accuracy.
"Shown our prompt, Opus recovers the target 6% of the time" is a far stronger artifact than 0/60
against your own regex, and it is 90 minutes of work. Define the answer set explicitly in the
gate and say which numbers are legal.

**[FATAL] 2. Dragging twelve planks is counting to twelve, not multiplying — it inverts Habgood, it doesn't replicate him.**
In *Zombie Division* the arithmetic was **one decision** (hit the skeleton with the correct
divisor); there was no counting path to success. Here the arithmetic decision is dissolved into
twelve motor acts, and a child can complete every fence with pure one-to-one counting and zero
multiplicative reasoning. The ×3 abstraction never occurs. P1 is the *only* controlled learning
gain in the evidence base and the entire concept stands on it; if the mechanic isn't
structurally like P1's, the citation doesn't transfer.
**What would satisfy me:** make the drag unit scale. The cart brings planks **in bundles of 4** —
she drags 3 bundles, not 12 planks. Introduce at build 3 after the concrete version has done its
job. Bundles fix four problems at once: the multiplicative decision is back in a single act, the
~30-object ceiling dies, the fifth-fence boredom dies, and the strong child gets a harder version
that costs no new art. **Single highest-leverage change in this review.** The near-transfer test
must then contain symbolic items (`3 × 4 = □`) so transfer can actually be seen.

**[SERIOUS] 3. "Reuses the Kenney iso art and `village.mjs` renderer as-is" is not true, and the demo beat depends on art that does not exist.**
`assets/farm/` holds 16 whole-object sprites. The fence is **one sprite** — no plank, no
partial-fence state, no per-unit compositing. **There is no sheep.** `village.mjs` renders a fixed
5×5 grid at 10 hardcoded slots with no drag targets, no hit-testing, and no inverse of `iso()`.
The repo has never implemented a drag interaction. Days 1–4 must absorb: plank art, a legible gap
state, a sheep with a walk path, iso hit-testing, and touch drag. That is where the plan breaks.
**What would satisfy me:** spend two hours *today* proving the art. Composite a 3-section fence
with a visibly wrong section, and find or draw the sheep. If a gap and a sheep aren't legible at
320px by end of day 1, switch the beat to something the existing art supports (a corn row planted
short — `cornYoungDouble` vs `cornDouble`) or drop the iso pack for flat SVG planks. Decide by
day 2, not day 12.

**[SERIOUS] 4. The classifier collides, and the documented fallback is unanswerable by design.**
On target 3×4: `[4,4,3]` is simultaneously off-by-one-in-last-group, a failed drag, a
distraction, and "I re-read the 3 on the rail." `[3,3,3]` is off-by-one-per-group and also "I
used the 3." `[4,0,0]` is one-group-only and also "I stopped to think." A final-state delta
cannot separate these — and §5(c)'s fallback ("ask the child to show which section they
counted") has no answer path: the child never types and placement is her only channel.
**What would satisfy me:** classify on the **time-stamped placement sequence**, not the final
delta. Order and inter-drop latency separate "walked away" from "believes it's finished." The data
is free, it makes the classifier defensible under a confusion matrix, and it yields the Baker
disengagement proxies from the same stream. Give the child one non-typing answer channel: **tap a
section to count it with the buddy — the tap is the answer.**

**[SERIOUS] 5. Over-count is unhandled, and the answer determines whether the thesis survives.**
Nothing says what happens when she puts 5 planks in a 4-plank section. If the fifth is rejected
on drop, the mechanic is validated-on-place and the error **cannot persist** — killing error
persistence for one of the most common Year-2 errors. If accepted, art is needed for an
over-built section.
**What would satisfy me:** name it and draw it — a plank that sticks out, or a wobbling section —
and add `over_count` to the table. Decide what 12 planks dumped in section one renders as. "The
wrong build is visible" has to hold in both directions or it's a slogan.

**[SERIOUS] 6. The near-transfer test is a phrase, not an instrument.**
Appears in three documents, specified in none: no items, no scoring rule, no delay interval, no
administration mode. At age 8 the test's reading level is itself a confound.
**What would satisfy me:** one page in `docs/` by day 9: 8 items (4 symbolic, 4 worded grouping),
read aloud identically to both arms, scored 0/1, delayed retest at 48h, and the falsification line
written *before* the pilot.

**[SERIOUS] 7. The A/B is confounded by construction, and you built one of the arms.**
The tollgate arm is the author's own earlier build: different UI, art, polish, and visibly less
pride. Add novelty, and "equal time-on-task" is not equal *items* (12 drags vs one typed answer).
At n=3 this looks like a comparison and isn't one.
**What would satisfy me:** demote it. Headline = the deterministic set (classifier accuracy with a
confusion matrix over 60 fixtures, the red-team leak number, p50/p95, cost); report the pilot as
three named case studies. And say on camera: *"The control arm is my own earlier build, which is
a conflict of interest."* That sentence buys more credibility than any n=3 number.

**[SERIOUS] 8. At this scope the Elo engine becomes theatre, and a reviewer will open `engine.mjs`.**
`generateProblem` buckets into 6 tiers up to 2-digit × 2-digit. Under build-is-the-problem, tiers
4–6 are unbuildable and ~ten live shapes remain (2×3 … 5×6). A continuous Rasch/Elo scale over
ten items is a lookup table wearing a lab coat.
**What would satisfy me:** re-scope `generateProblem` into a grouping generator (difficulty =
groups × per-group with factor structure) with an honest note — or delete Elo for a 12-node
mastery graph and say on camera: "I deleted my own adaptive engine because at this scope it was
theatre." The deletion is the better hire signal.

**[MINOR] 9. "Error persistence — no product has this" is overclaimed.**
MARKET.md itself calls Minecraft Education's block-building "genuinely intrinsic" — a wrong
structure stands there indefinitely. DragonBox leaves an unsolved board.
**What would satisfy me:** "no product we found couples a persistent wrong build to a *named
misconception* and a *published leak rate*." Put MARKET's "the gap is narrower than the pitch
implies" in the video, not just the doc.

**[MINOR] 10. Day 2 has no answer.**
"Nothing asks her to come back" is ethically right and commercially empty. §1 has the unused
answer: **parents control return**, with co-use correlating with gains.
**What would satisfy me:** promote the parent screen from stretch to the retention answer — a
weekly summary the parent opens and hands to the child — or state plainly this is a 20-minute
experience and retention is out of scope. Silence is not fine.

**[MINOR] 11. Pilot ethics and scheduling.** Day 12 pilot / day 13 film with real children, no
mention of written parental consent or film release, identifiable children in a public video.
**What would satisfy me:** book them today for day 9–10, written consent, film hands only. Film
day 12, buffer 13–14.

**[MINOR] 12. "Is this an AI product?"** The LLM as a pullable phrasing layer is correct
engineering and readable as a text skin.
**What would satisfy me:** 15 seconds showing the same misconception rendered by template vs by
the model, side by side on a real build, plus the red-team leak number.

**[MINOR] 13. Reading level is asserted, never measured.** *Section* is not a Year-2 word; the
0:48 hint is three clauses. Run 20 generated hints through a word-list check and publish it.

---

## What is genuinely strong (do not lose these)

- **The wrong build persisting as a repairable object** — real, filmable, no narration. Every fix
  must preserve it; especially don't let over-count validation quietly kill it (#5).
- **Deletion as the design move**: removing `The correct answer is ${answer}` and the regex from
  `coach.mjs` is genuinely better architecture, and a strong story even after softening
  "never given."
- **Killing free-text chat** removes third-party disclosure, PII, prompt injection and moderation
  in one move — the most senior decision in these documents. The "ask me anything" box must go.
- **Refusing voice with the child-ASR WER as the reason**, and refusing vision, RAG, agents and
  fine-tuning by name. Negative decisions with numbers are the hire signal.
- **Preserved confidence flags** and the willingness to report a null. Do not launder any.
- **Killing "Teach the Buddy" for the right reason** — say it out loud somewhere.

---

## Verdict

**NOT SATISFIED.**

Must be resolved: **1** (redact or red-team the answer-blind claim), **2** (bundles — the mechanic
must require multiplication), **3** (prove the art today; "reuses as-is" is false), **4**
(classify on placement sequence; give a tap-to-count channel), **5** (draw and classify
over-count), **6** (write the transfer instrument). Plus two minutes-cost edits: **7**'s reframing
and conflict-of-interest sentence, and **9**'s wording.

Nice-to-have: **8** (Elo re-scope or deletion — best line in the video if done), **10**, **11**,
**12**, **13**.

Fix 1, 2 and 3 and this is a strong submission. Ship with the current answer-blind wording and a
counting mechanic, and the first sharp reviewer takes both apart in one question each.
