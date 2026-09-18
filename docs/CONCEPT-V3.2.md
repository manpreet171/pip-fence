> The design as approved on 5 Sep 2026, under the working name Rung. What shipped as Pip differs in four ways: four chapters instead of two (docs/MODES.md), three more model jobs (DECISIONS D-079 to D-082), a child's voice and a six-year-old's vocabulary (D-084), and no pilot yet. The plan and demo sections here are superseded by docs/DEMO-V2.md.

# CONCEPT v3.2 — "the plot is the problem", final revision

4 Sep 2026. Day 1 of 14. Answers `docs/REVIEW-R2.md` completely. Nothing marked CLOSED is
reopened; nothing marked strong is softened. Two pieces of evidence produced today —
`ART-FEASIBILITY.md` and `REDTEAM-RESULTS.md` — do most of the closing.

---

## 0. Resolution table

| # | Claimed in v3.1 | Changed in v3.2 | Where | Closed |
|---|---|---|---|---|
| 1 | Red-team vs a 1-in-12 floor | Floor was wrong. Reported vs the **majority-class baseline on the actual fixtures**; **total + shape only**; shapes rebalanced, baseline 48%→33% | §3 | Yes |
| 2 | Packs force a multiplicative act | **Ordered once, delivered once, no top-up**; pack indivisible at point of use; finite cart. Progression flagged **UNEVIDENCED** | §2 | Yes |
| 3 | Art proof = 2 h gate day 1 | Proof ran. **Goat, not sheep**; "hand-drawn SVG sheep" deleted; broken-fence sprite illegible, dropped; gap = **missing section**; `planksHole` adopted. Day 1 = **1 h re-test of the one uncovered state** | §2, §8 | Yes |
| 4 | Sequence classifier, tap channel | Unchanged, minus the latency heuristic (N3) | §4 | Was closed |
| 5 | Over-count drawn | Unchanged; finiteness resolved (N6) | §2 | Was closed |
| 6 | 8 items, 48h, falsification | Items 3 & 6 = **pre-registered controls**; trained **/6**, controls **/2**; item 1 replaced; **pre-test added** | §5 | Yes |
| 7 | Case studies; COI on camera | **Three children total, no arms**; within-child pre→post→48h. §5 and §8 agree | §5, §8 | Yes |
| 8 | Elo deleted | Engine **frozen, not deleted**; the new build just doesn't import it | §6 | Yes |
| 9 | Wording verbatim | Unchanged | §1 | Was closed |
| 10 | Parent screen | Unchanged | §7 | Was closed |
| 11 | Pilot 9–10, film 12 | Pilot **all three day 9**, retests **day 11**. No collision | §8 | Yes |
| 12 | Split screen + number | Now the honest number (lift vs baseline) | §9 | Was closed |
| 13 | "a 500-word list" | **Named**: Dolch 315 + Fry 300 + 40 domain words ≈ 500; `data/wordlist.txt` day 1; "out-of-list" defined | §3, §8 | Yes |
| N1 | — | Majority baseline; "still needed" dropped (the label determines it); **bucket leak closed** — `"a couple"` identified groups==2, now `"some"` | §3 | Yes |
| N2 | — | The gate is **lexical**: protects the target total, not the next action | §3 | Yes |
| N3 | — | Diagnostic node **4×3** (`[2,2,2,2]` vs `[4,4,4,4]`); latency heuristic **deleted** | §4 | Yes |
| N4 | — | `place_failed` = off-target tap **while holding**; `rapid_guessing` **dropped** | §4 | Yes |
| N5 | — | bbox+scale pinned from the *finished* fence; incremental append; `data-part` + one delegated listener. Day 2 = **~1 h** | §6, §8 | Yes |
| N6 | — | Cart **FINITE**; over-filling one part starves another | §2 | Yes |
| N7 | — | Engine/index/measure frozen; the lost measurement named | §6 | Yes |
| N8 | — | Items 3 & 6 named as unrelated-skill controls, scored separately | §5 | Yes |
| N9 | — | Unblinding disclosed on camera. Exact N9 wording ("which arm") would be false once the arms are gone; the substitute is stated in §5 | §5, §9 | Yes |

---

## 1. The insight (final wording)

One data structure, four readers. When the arithmetic *is* the build (P1, Habgood & Ainsworth), the
placement state **is** the answer; it is also the mastery record, the only thing the coach is shown,
and the telemetry stream. No translation layer.

The mechanic that follows is **error persistence**: a miscount leaves a fence with a hole in it,
standing, repairable, on screen — not a red X deleted on the frame it appears.

Lineage is owned on camera: intrinsic integration is *Zombie Division*'s (2011); mastery pacing is My
Math Academy's; non-answering AI is Khanmigo's *claim*; persistent wrong structures already exist in
Minecraft Education and DragonBox. So the claim is exactly this and no larger: **no product we found
couples a persistent wrong build to a *named misconception* and a *published leak rate*.** The gap is
narrower than the pitch implies, and that sentence is in the video.

---

## 2. The mechanic, precisely

**Shapes.** `2×3, 3×3, 3×4, 4×3, 4×5, 2×5`. `6×2` is gone: it made three of six shapes total 12,
which is what inflated the red-team baseline to 50%. Totals are now {6, 9, 12, 12, 20, 10},
majority baseline 33%. Six shapes × two modes = the 12-node graph.

**Phase A — concrete.** Tap a plot. A frame appears: posts, top rail, N empty parts, the situation
written on the rail. **The cart is FINITE and holds exactly the target total.** Running out *is* the
answer, and over-filling part one *starves* part three. `[5,4,3]` and `[12,0,0]` are reachable;
total over-count is not.

**Phase B — packs.** Loose planks are gone. She **orders packs once**: taps the cart to add a pack
to a delivery slip (one silhouette per tap), then taps DELIVER. **Delivery happens once. No
top-up.** That is all the wood there will be. This is what forces the up-front quantity decision;
v3.1 did not, because she could fill by inspection one pack at a time.

**A pack is indivisible at the point of use.** Tap a pack, tap a part, *all* its planks go in. A
**pack of 6 tapped into a part of 3**: three planks fill the part, three stand crooked and
overtopping the post (the drawn over-count state), and three planks another part needed are spent.
Both errors visible at once — and this is how `pack_unit_confusion` becomes observed, not inferred.
Pack size ≠ planks-per-part by design: `4×3, packs of 6` → 2 packs; `3×4, packs of 2` → 6 packs.

> **UNEVIDENCED, flagged.** `RESEARCH-LEARNER.md` contains **no** concreteness-fading citation and
> nothing on unitising at age 7. The concrete → packs progression is a design bet. It is watched
> specifically in the day-9 pilot; if a child treats a pack as one plank, the diagnosis is
> `pack_unit_confusion` and the concrete phase gets longer.

**Tap-to-place**, not drag: tap the cart, tap the part. Identical arithmetic, ~20 lines (§6).
**Repair is symmetrical**: tapping a placed plank returns it to the cart, a logged `remove` event —
evidence, not an undo button. **Tap-to-count**: code, never the model, walks the planks with a pip
1-2-3-4. It counts what is on screen; never what should be there.

**What persists, per error case** (`3 parts × 4`; the animal is a **goat**):

| Build | What she sees |
|---|---|
| `[4,4,3]` | Two full parts; part three a plank short — its top rail floating *if the day-1 height test passes; otherwise the part draws no top rail* (the proven absent-rail cue). The **goat** puts its head through into the corn. |
| `[3,3,3]` | Uniformly short — a stripe of sky under the rail across all three. No comparative cue; see §4. |
| `[4,0,0]` | One finished part, **two bare ground slots** (the proven "absence" state). Goat walks out. |
| `[5,4,3]` | Part one has a plank past the post at an angle with its own shadow; part three short. |
| `[12,0,0]` | A leaning tower in part one, two bare slots. |

`fenceHighBroken` is **not used** — at 320px it reads as a whole fence. Absence and `planksHole`
are the two states proved legible; `planksHole` also gives a cheap second build type (a plank deck
whose wrong state is a hole).

---

## 3. The AI layer, precisely

Code owns truth: a table maps the placement sequence to `(misconception_id, tier)`. The model
phrases, and is not on the critical path.

```json
{
  "age": 8,
  "reading_level": "500-word list, max 2 sentences",
  "misconception_id": "off_by_one_in_one_group",
  "tier": 1,
  "shape": { "groups": "some", "one_group_short": true, "all_groups_short": false },
  "nouns": { "group": "part", "unit": "plank", "pack": "pack" },
  "template": "That part of the fence is short. Count a full part again.",
  "constraint": "Use no numbers of any kind. Point with words, not digits."
}
```

`"groups"` is the single word **`"some"`** for every count. It was `"a couple"` for groups==2, which
identified shape (2,3) exactly — a real leak, found by the red-team run today and closed.

**The gate is lexical, and that is the honest claim.** It rejects any digit and 36 number words (cardinals, quantity words, and ordinals from *second* up — D-068), so
it protects the **target total**: the model cannot emit "twelve" or "4". It does **not** close the
semantic channel — "add another plank" is legal and as informative as "add one more". That is
deliberate: the next action is exactly what a tutor hints. What must not be derivable is the answer
to the arithmetic, and that is what we measured. v3.1 oversold this gate; this paragraph is the
correction.

**Output gate**, in order: schema valid (`{tier, misconception_id, text}`, strict) → ≤2 sentences →
zero digits/number words → no banned affect words (`sad`, `disappointed`, `miss you`) → out-of-list
words ≤2. Any failure → the template ships. **Templates are themselves gate-checked at build time by a
committed assert (`evals/readinglevel.py --assert`), so a template that fails the gate can never be
its own fallback.** Templates work offline: pulling the cable degrades the buddy, it does not break
the game.

**Red-team, as run** (`evals/redteam_leak.py`). 60 fixtures, the exact serialised payload, attacker
from a different family (DeepSeek vs Claude Haiku), **forced choice from the known answer set** — an
abstaining attacker made the first run look better than it was. Scored on **total and shape only**:
"planks still needed" was dropped because for `off_by_one_in_one_group` it is always 1, determined by
the misconception label we deliberately hand over. It is the hint, not a secret.

| Recovered | Attacker | Majority-class baseline on these fixtures | Lift |
|---|---|---|---|
| Target total | 24/60 = 40.0% | always-12 = 48.3% | **−8.3%** |
| Exact shape | 7/60 = 11.7% | 21.7% (floor 16.7%) | **−10.0%** |

**No signal beyond the prior. PASS on the honest baseline.** Published residuals: one attacker
family; the final-template rerun is **done** (REDTEAM-RESULTS UPDATE 2: 40.0% vs 48.3%, PASS); the run
used the old shape set, so the rebalanced-fixture rerun is **also done** (REDTEAM UPDATE 3: PASS on the v3.2 shape set). No red-team rerun remains; only a second attacker family is outstanding. The output gate's 0/60 is reported separately, labelled as a measurement of the
gate.

Model `claude-haiku-4-5-20251001`, structured output strict, ~$0.0007/hint *(Errata 4: the provider now follows the key; the live path was measured on `deepseek-v4-flash` at $0.00015/hint, p50 757 ms — D-067, LATENCY-RESULTS)*, age re-injected every
turn (KIDBench multi-turn degradation 6–24%), prefetch on the wrong placement.

**Wordlist, named.** `data/wordlist.txt` = **Dolch sight words (220 service + 95 nouns)** ∪ **Fry's
first 300 instant words** ∪ a 28-word domain allowlist (`fence plank part pack post cart …`), deduped; exact counts in the
file header. Measured on the six v2 templates: Dolch∪Fry 77%, +domain 99%, one residual word
(*past*), 0 number words (READINGLEVEL-RESULTS, final run). Committed day 1. **Out-of-list** = a token,
lowercased, punctuation stripped, simple inflections removed (`-s`, `-ing`, `-ed`), absent from the
file. We publish out-of-list % and mean sentence length over 20 hints. *Section* is very likely not a
Year-2 word; the child-facing noun is **"part"**.

---

## 4. The classifier, precisely

```json
[ {"t":0,     "e":"level_start",  "node":"4x3_concrete"},
  {"t":2140,  "e":"plank_held"},
  {"t":2900,  "e":"place",        "unit":"plank", "group":0, "n_in_group":1},
  {"t":9880,  "e":"place_failed", "nearest_group":2, "held":"plank"},
  {"t":14200, "e":"tap_count",    "group":0},
  {"t":42300, "e":"remove",       "unit":"plank", "group":1},
  {"t":51100, "e":"commit",       "reason":"left_plot"} ]
```

`commit` fires on leaving the plot, tapping another plot, or 45 s idle.

**`place_failed`, defined for taps (N4):** fires **only while a plank or pack is held**, when the tap
lands inside `.isoworld` on no `data-part` region. A tap with nothing held is `tap_idle` and is not
evidence about arithmetic. An off-target tap mid-build is an interface failure and is counted in the
interface-failure rate we publish.

**`rapid_guessing` is dropped.** A <400 ms median inter-place fires on a competent child tapping
fast, which under tap-to-place is the normal input rate — it measured the interface, not
disengagement. `idle_off_task` (>30 s gap, no commit) and `wheel_spinning` (≥4 place/remove cycles on
one group, no net progress) survive tapping and are kept.

**Set:** `off_by_one_in_one_group`, `off_by_one_per_group`, `counted_groups_as_group_size`,
`one_group_only`, `over_count`, `right_total_wrong_grouping`, `pack_unit_confusion`, `ambiguous`.

**The `[3,3,3]` collision, fixed by level design (N3).** `off_by_one_per_group` and
`counted_groups_as_group_size` collide exactly when `per_group − 1 = groups` — true for **2×3, 3×4 and 4×5**;
**false for 3×3, 4×3, 2×5**. On **4×3** they predict `[2,2,2,2]` versus `[4,4,4,4]`: two
completely different fences. **The latency heuristic is deleted; there is no timing signal in the
classifier at all.** The diagnostic node is 4×3. When the demo shape (3×4) yields `[3,3,3]` the
classifier says `ambiguous` and the system offers 4×3 next.

**Ambiguity is a channel.** Tier-1 hint: *"Show me a part that looks finished."* Full part → she
holds a correct reference → `off_by_one_in_one_group`. Short part → `counted_groups_as_group_size`,
and tap-count runs on that part and a full one side by side. No tap in 20 s → escalate on the more
likely branch, log the classification **unconfirmed**.

`[4,4,3]`: `place_failed` on group 2 immediately before the end → interface, not maths; final gap
>30 s with no `commit` → `idle_off_task`; `commit` within 5 s of the last placement → misconception.
`[4,0,0]`: `commit` → `one_group_only`; idle with no commit → `idle_off_task`.

**Eval:** 60 hand-written `(sequence) → expected_id` fixtures, published as a confusion matrix with
`ambiguous` as its own row and column. Right 100% of the time it commits and silent 15% of the time
is a better artefact than right 85%.

---

## 5. Measurement, precisely

**Instrument** (`docs/TRANSFER-TEST.md`, written day 8, before any child sees it). Paper and pencil,
no device. Trained shapes are `2×3, 3×3, 3×4, 4×3, 4×5, 2×5`; **no item repeats a trained shape in
either order, and no two items are commutes of each other.** Same adult reads each item aloud
verbatim, once, repeated on request. No hints, no feedback, 60 s per item.

**Trained-skill items — scored /6:**
1. `3 × 6 = □` *(replaces v3.1's `2 × 6`, which was trained `6×2` commuted)*
2. `5 × 3 = □`
4. `4 × 6 = □`
5. "There are 7 plates. Each plate has 3 buns. How many buns altogether?"
7. "A bike has 2 wheels. How many wheels on 9 bikes?"
8. "6 children each have 5 stickers. How many stickers altogether?"

**Pre-registered unrelated-skill CONTROL items — scored /2, separately, never taught:**
3. `□ × 4 = 8` *(missing factor)*
6. "18 pencils go into boxes. Each box holds 6. How many boxes?" *(quotitive division)*

The controls are the gauge for practice effect, rapport and test-taking. **Registered prediction:
trained items may move; controls should not.** If controls move as much, the effect is not the
mechanic.

**Timing:** pre-test immediately before the session, post-test immediately after, retest at **48 h**;
same 8 items each time, order reshuffled. Three administrations risk a practice effect — a real
limitation, stated, and precisely what the control items measure.

**n = 3 children total; there are no arms** (this resolves the v3.1 contradiction). The comparison is
**within child**, pre → post → 48 h, trained /6 against control /2. The tollgate build is not a
measured arm; it appears in the demo as a side-by-side of the same problem.

**Falsification line, committed now:**
> If trained-item scores do not rise from pre-test to immediate post-test in at least 2 of 3
> children, or if the control items rise as much as the trained items, we report in the video, in
> these words, that build-is-the-problem showed **no measurable near-transfer signal in this pilot**.

**The headline is the deterministic set:** classifier accuracy + confusion matrix over 60 fixtures ·
red-team recovery vs the majority-class baseline · gate leak rate 0/60 (labelled: this measures the
gate) · reading-level check over 20 hints · p50/p95 latency · cost per hint · interface-failure rate.

**The pilot is three named case studies, reported raw.** On camera, verbatim, both sentences:
> "The comparison build is my own earlier build, which is a conflict of interest."
> "I administered the post-test myself, unblinded — I knew exactly what each child had just done."

(N9 asked for "knowing which arm each child was in." Since §5 removes the arms, that exact sentence
would be false; the unblinding it discloses is the same and is stated above.)

---

## 6. What is kept and what is deleted in the code

**Kept, frozen, git-tagged `control-arm-frozen` on day 1, not touched again:** `src/engine/engine.mjs`,
`src/engine/coach.mjs`, `src/public/index.html`, `src/public/measure.html`, `evals/engine_eval2.mjs`.

Deleting `engine.mjs` on day 4 would break both pages that import it and destroy a real,
**non-circular** result: `measure.html` / `engine_eval2.mjs` show the adaptive selector wasting far
fewer questions than a fixed ramp against a simulated child the engine's model cannot see (2-parameter
+ guessing + learning). **The 12-node mastery graph has no baseline and no such result.** That is the
measurement that would have been lost; it is named here and in `DECISIONS.md`.

**New, additive:** `src/public/build.html`, `src/public/fence.mjs`, `src/engine/buddy.mjs`,
`data/wordlist.txt`, `evals/classifier_fixtures.json`. **Plus three route lines in `src/server.mjs`**
for `/build.html`, `/fence.mjs`, `/buddy.mjs` — `server.mjs` is not on the frozen list.

`buddy.mjs` sits beside `coach.mjs` rather than replacing it, and the diff *is* the demo: `coach.mjs`
line 12 reads `The correct answer is ${problem.answer}`; `buddy.mjs` has no answer in its prompt at
all, and `answerLeaked()` has nothing left to guard. Two files side by side beats a deletion.

**`village.mjs` — three surgical changes (N5), all safe for the frozen page:**
1. Export `iso` and `BB` (one line; `renderVillage` untouched, so `index.html` is unaffected).
2. `mountScene(el, plan)` in `fence.mjs` computes the bounding box and `scale` **once, from the
   *finished* fence** (ground, posts, rails, every part at full height), then renders the empty frame.
   Because the bbox derives from the final layout it never changes as planks land — this is the fix
   for the camera zooming on every placement.
3. `appendPlank(part, i)` uses `isofit.insertAdjacentHTML("beforeend", …)`. No `innerHTML` rebuild, so
   no `plop` re-fires on existing sprites and the 20-second beat survives.

Hit-testing needs **no inverse `iso()` and no per-part bounding boxes**: the renderer already emits one
`<img>` per item. Add `data-part="0|1|2"` and put **one** delegated `click` listener on `.isoworld`
using `e.target.closest("[data-part]")`. That is **~1 hour**, not a day; v3.1's estimate was wrong.

---

## 7. Day 2 and the parent

Retention is not left silent and is not solved with a nudge loop — Children's Code Standard 13 and
Lepper 1973 both close that door, and closing it is a decision we defend.

**The answer is the parent, because parents control return** (`RESEARCH-LEARNER` §1). One screen,
local data, no account, opened by the parent: what was mastered this week, the named misconception
still open, and **one question to ask out loud** — the Tutor CoPilot shape (+4pp mastery, +9pp for
the weakest tutors), pointed at the adult.

> "Aanya finished four fences this week. She is still counting the parts instead of what goes in each
> part. Ask her: *show me one full part.*"

**Flagged, unchanged:** parent co-use → gains is **correlational**; no controlled study shows
creation/ownership mechanics cause return in 6–12. A reasoned bet, and a ~20-minute sitting by design.

---

## 8. The revised 14-day plan

| Day | Work |
|---|---|
| **1 (4 Sep)** | **1 h art re-test** of the one state the probe did not cover: a **height difference between adjacent parts** (3-plank part beside a 4-plank part, 320px, naive viewer points at the wrong one in <2 s). Absence and `planksHole` are already proved. **Fail → an incomplete part draws no top rail**, so "short" degrades to the proven absent-rail cue and the goat exits the rail-less part. Then: commit `data/wordlist.txt`; tag `control-arm-frozen`; book three families, consent + film-release out; `DECISIONS.md` entries (finite cart, packs-once, 6×2→2×5, engine frozen). **Remaining ~4 h pulled forward from day 2: `mountScene` + `appendPlank` + delegated click.** |
| 2 | **Decomposed fence frame (posts + rail + N empty parts, planks landing individually) — 1–2 h of cropping `planks_E` and compositing posts; this composite does not yet exist and is on the critical path.** One fence end to end, tap-to-place (~1 h). Gap / over-count / leaning-stack states; remove-to-cart; goat walk. 320px re-check. |
| 3 | Packs: order-once delivery slip, indivisible pack-into-part, starve/overflow. Buffer for day-2 overrun. |
| 4 | Event log, `commit` semantics, held-only `place_failed`, tap-to-count. 12-node graph (new build only). |
| 5 | Classifier over the sequence; 60 fixtures; confusion matrix. |
| 6 | `buddy.mjs`: redacted payload, lexical gate, templates, offline proof. |
| 7 | Haiku phrasing call, prefetch, latency/cost table, reading-level check over 20 hints. |
| 8 | **Red-team re-run** on rebalanced fixtures + final templates. `TRANSFER-TEST.md` written and printed. |
| **9** | **Pilot — three children, three 20-minute sessions in one afternoon**, written consent held. Pre-test before, post-test after, each child. |
| 10 | Buffer / parent weekly summary. |
| **11** | **All three 48 h retests.** (v3.1 landed a retest on film day; fixed by pilot-in-one-day.) |
| **12** | **Film — hands only.** No faces, names or child voice (voiceprints are personal information under amended COPPA — the same reason we refused the mic). |
| 13 | Edit to under 3:00. README. |
| 14 | Buffer. Submit 18 Sep. |

**First thing to slip: day 3, packs.** If it overruns the pilot runs concrete-only, the packs beat is
cut, and §2's multiplicative claim is **withdrawn** rather than described — a withdrawn claim is
cheap, a described-but-unbuilt one is fatal. The goat then becomes a static sprite in the gap rather
than an animated walk-through.

---

## 9. The demo

**The 20-second beat.** The wrong build is on screen inside twenty seconds. Aanya orders packs — one
decision, one delivery. The fence stands with one part a plank short, its rail floating. **The goat**
puts its head through into the corn. Nothing red, nothing buzzing, no modal. Text appears **on the
gap**: *"That part of the fence is short. Count a full part again."* She taps a full
part; pips count 1-2-3-4. One more plank. The gap closes. The goat comes back. Cut to the same
problem in the frozen tollgate build: red X, farm unchanged.

**Split screen, 15 s.** One real build state: left the template, right Haiku's phrasing of the same
`misconception_id`. Under both: **40% recovery against a 48% always-12 baseline — no lift; shape 11.7%, below the 16.7% floor.**

**Said aloud, all of it:**
- "The mechanic is Zombie Division's, from 2011. It is credited."
- "The comparison build is my own earlier build, which is a conflict of interest."
- "I administered the post-test myself, unblinded — I knew exactly what each child had just done."
- "The new build doesn't use my Elo engine — at this scope it was theatre. It's a twelve-node graph.
  The old engine stays in the repo because it's the control arm and holds the one result I'd
  otherwise lose."
- "The number gate is lexical. It stops the model saying the total. It does not stop it saying 'add
  another plank' — and it shouldn't, because that is what a tutor does."
- "Two of the misconceptions are indistinguishable on the shape you just watched, so the diagnostic
  runs on a shape where they aren't."
- "The gap between this and what already ships is narrower than the pitch implies."
- "This is a Year 2–4 grouping tool, not a general arithmetic tutor."
- "n=3. No p-value. Three case studies, and a null if that is what we got."
- "She still had a plank in the cart and walked away — that *is* the misconception, on screen."
  (The finite cart makes the leftover visible in the `[4,4,3]` beat; we say it rather than hide it.)

---

## 10. Residual risks to log in DECISIONS.md

1. **Packs at age 7 have no citation.** No concreteness-fading or unitising evidence exists in
   `RESEARCH-LEARNER`. An unevidenced design bet, watched in the day-9 pilot.
2. **A goat over an isometric field is a style compromise.** Kenney's animals are flat; no sheep
   exists in any Kenney pack. Accepted.
3. **n=3, within-child, three administrations of the same items.** Supports no inference; the
   practice effect is real and the control items are the only gauge. The video says so first.
4. **The red-team number is published either way.** Both reruns (final templates; rebalanced shapes)
   are done and passed. Residual: one attacker family only.
5. **The height cue is unproven until tonight.** The rail-less fallback is named and cheap but
   collapses "short" and "empty" into one visual, weakening the `[4,4,3]` / `[4,0,0]` contrast.
6. **The wordlist may reject templates already written here** — "shorter" and "altogether" are at
   risk. If they fail the templates change and this document's prose is wrong. The list wins.
7. **The 12-node mastery graph has no baseline.** Deliberate: the baseline that exists belongs to the
   frozen engine, and the new graph is asserted adequate, not measured.
8. **Three of six shapes collide** on `off_by_one_per_group` / `counted_groups_as_group_size` (2×3, 3×4,
   4×5), so `ambiguous` fires more than §4 implies — the ambiguity channel carries more load than budgeted.
9. **All eight test items are near-transfer** (no trained shape appears), so a null after one 20-minute
   session is the likely outcome; §5 pre-commits to reporting it.
10. **The leftover-plank cue** (NEW-1) — accepted and spoken aloud rather than hidden.


---

## Errata — Review R3 PATCH list applied (4 Sep 2026)

- P1 template (2x)
- P3 table total (1x)
- P3 table shape (1x)
- P3 split-screen (1x)
- P3 residual sentence (1x)
- P4 collision list (1x)
- P2 wordlist (1x)
- P6 gate assert (1x)
- P5 server routes (1x)
- NEW-1 voiceover (1x)
- NEW-3 hedge (1x)
- NEW-2 fence frame (1x)
- R3 residuals 8-10 (1x)

Note on P2: Review R3 suggested making the doc match a Dolch-only file. Fry's first 300 was obtained and added as a second named list *after* the review read the file, so the doc's Dolch ∪ Fry claim now matches `data/wordlist.txt`; only the domain-list count (40→28) needed correcting.

## Errata 3 — corrections found in code on build day 1 (6 Sep 2026; see D-047, D-048, D-049)

- **§2 "4×3, packs of 6 → 2 packs" is unsolvable**: a pack is indivisible at the point of use, so a
  6-pack can never fill a 3-part. Pack size is now the largest proper divisor of `per`, else `per`.
  Only 3×4 has a pack that is not a whole part. `pack_unit_confusion` is observed at the **order**
  (a pack per plank, or a pack per part when a pack is not a part), not by overflow.
- **§4 "[2,2,2,2] versus [4,4,4,4] on 4×3"**: the cart holds 12, so [4,4,4,4] is unreachable.
  `counted_groups_as_group_size` on 4×3 appears as **[4,4,4,0]**. Still a different fence; the
  diagnostic node stands.
- **§2 / §10.5 height cue**: rails stack bottom-up on a post whose height encodes `per`, so a short
  part shows bare post above its top rail — this *is* the proven absent-rail cue. The rail-less
  fallback is moot. Naive-viewer <2 s check still owed (D-048).
- **§4 eval**: 67 fixtures (not 60). `correct`, `in_progress`, `interface_failure`, `idle_off_task`
  are their own rows alongside the eight misconception ids.
- **§8 dates**: re-baselined to a 6 Sep start (D-049): pilot 13 Sep, retests 15 Sep, film 16 Sep.
