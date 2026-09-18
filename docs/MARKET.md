> Written 4 Sep 2026 under the working name Rung. The product is Pip.

# MARKET — competitive landscape for kids' maths edtech (Sept 2026)

Produced 4 Sep 2026 as the competitive-landscape review, grounded in `docs/RESEARCH-LEARNER.md`.
Vendor claims are labelled as such throughout. Companion to `docs/AI-ARCHITECTURE.md`.

---


## Landscape table

| Product | Maths IS the mechanic? | AI role | Evidence | Closeness to Rung |
|---|---|---|---|---|
| **Zombie Division** (Habgood & Ainsworth) | YES — dividing skeletons by their number IS the combat | None (2007–2011 research prototype, never commercialised) | Gold-standard RCT, ages 7–11 | Direct on mechanic; the *ancestor* — not a live product |
| **DragonBox** (Kahoot!) | YES — dragging tiles to isolate x IS the algebra | None | Vendor + some classroom studies | Adjacent (algebra; no AI; no persistent world) |
| **Slice Fractions / Motion Math** | YES — manipulation embodies the relation | None | Vendor/awards | Adjacent — proves intrinsic integration is shippable, sans AI/mastery world |
| **Matific** | UNCLEAR — islands wrapper; couldn't confirm mechanic vs gate | None found | Vendor only | UNVERIFIED |
| **Minecraft Education** (Math Subject Kit) | PARTIAL — block-building for area/volume is genuinely intrinsic | None (teacher-led) | Vendor blog cites "a study", unverified | Adjacent — closest proof that build = maths, but bolted-on lessons, no mastery model, no AI coach |
| **Prodigy Math** | **NO — confirmed tollgate.** Correct answer → cast spell; world is a wrapper | None (right/wrong only) | Vendor only | Adjacent on fame only; the exact extrinsic pattern the research rejects |
| **Math Town / Mystery Math Town** | **NO — confirmed tollgate.** Solve → earn coins → decorate town | None | None | **Surface-closest analogue** — and exactly the coin-spend pattern Rung rejects |
| **Khanmigo Kids** | No — general chatbot tutor, not embedded in a mechanic | Socratic, claims never to give answers | "23% improvement" sourced only from a review-farm site — LOW, do not cite | Adjacent on AI philosophy, distant on mechanic |
| **Synthesis Tutor** ("Oliver") | No — voice-first conversational tutor K–5 | Prompts reasoning per vendor | Vendor/forum only | Adjacent on AI philosophy, no build world |
| **Grokkoli** | No — one-question diagnostic; non-generative symbolic AI | Adaptive sequencing, not scaffolding dialogue | Vendor ("2–4x faster"), no independent study | Distant |
| **Squirrel AI** | No — adaptive path sequencing at scale | Adaptivity engine | PR stunts, no independent efficacy study | Distant |
| **My Math Academy** (Age of Learning) | PARTIAL — themed contextualised practice, not build-is-the-problem | None | **The RCT already in RESEARCH-LEARNER — strongest independent evidence in this whole search** | Closest on evidence + mastery pacing; Pre-K–2 only, no world, no buddy |
| **DreamBox / IXL / Sumdog / Mathletics** | No — adaptive drill / SmartScore; Sumdog "world" unconfirmed as mastery readout | Not AI-coach products | Vendor only | Distant–Adjacent; **parent dashboards are COMMODITY** — not novel by itself |
| **Nerdy / Varsity Tutors own tools** | No — worksheet generator, CrossMath, practice problems | AI copilots for **live human tutors** (Live+AI), diagnostics, session summaries | Company-published | Not a competitor to a K–5 self-directed game — but Nerdy's own thesis is already "AI augments the tutor" (Tutor CoPilot insight) |

## What is genuinely unoccupied
No product combines all four of:
1. the arithmetic literally IS the build action (not a tollgate before, not a coin spent after);
2. the fence the child builds **is the record of the skill** (the parent page reads the same log), not a decorated reward shop;
3. an AI buddy architecturally barred from stating answers **and this is measured** (hint-tier escalation / leakage rate tracked);
4. a shipped near-transfer + delayed-retest + intrinsic-vs-tollgate A/B harness inside the product.

Individually every piece exists: intrinsic integration (Zombie Division, DragonBox, Minecraft Ed), Socratic non-answering AI (Khanmigo, Synthesis), adaptive mastery with independent RCT (My Math Academy), parent dashboards (commodity).
**The gap is narrower than the pitch implies: a recombination of four separately-proven pieces, not a new discovery.** Own the lineage; don't claim novelty it doesn't have.

## Closest competitor and how Rung differs
- **Math Town / Mystery Math Town** — closest surface match ("solve maths, build a village") and the most useful contrast: coin-tollgate. Rung's differentiator is exactly what Math Town doesn't do: the quantity placed IS the answer, a wrong count builds a visibly wrong structure, and the village reads mastered skills not spent currency.
- **My Math Academy** — closest on rigor (only genuinely independent RCT found), but no build world, no AI buddy, Pre-K–2 only.

## Risks — "X already does this"
- "Prodigy already gamifies maths with a fantasy wrapper" — the demo MUST show wrong-count-builds-wrong-structure early and explicitly, or the distinction reads as cosmetic.
- "We already ship Live+AI copilots that help the tutor" — frame Rung's buddy as extending Nerdy's own philosophy to UNACCOMPANIED practice, not as inventing it.
- "Khanmigo/Synthesis already never give the answer" — vendor self-claims with no measured leakage; Rung's differentiator is the MEASUREMENT of hint-tier escalation, not the claim.
- "DreamBox/IXL have parent dashboards" — true; pitch mastery-as-world-state as novel, not the dashboard.

## Confidence flags
- UNVERIFIED: Matific / Sumdog worlds as mastery readout vs reward shop.
- LOW: Khanmigo "23%" (review-farm source) — do not cite.
- LOW: Grokkoli "2–4x", all Squirrel AI efficacy — vendor only.
- Not verified: Minecraft Education's linked impact study (only the vendor blog checked).

Sources: https://dl.acm.org/doi/abs/10.1145/3549503 · https://dragonbox.com/products · https://playmath.org/games/mm-slice-fractions · https://education.minecraft.net/class-resources/math-subject-kit/ · https://en.wikipedia.org/wiki/Prodigy_Math_Game · https://prodigygame.zendesk.com/hc/en-us/articles/12910978061844-Battling-in-Prodigy-Math · https://mwm.ai/apps/math-town/919616195 · https://www.khanmigo.ai/parents · https://www.synthesis.com/tutor · https://grokkoli.com/ · https://squirrelai.com/ · https://www.dreambox.com/ · https://learn.sumdog.com/en-us/ · https://link.springer.com/article/10.1007/s10643-022-01332-3 · https://edunlp.stanford.edu/projects/tutor-copilot · https://hackathon.nerdy.com/ · https://ai.varsitytutors.com/ · https://www.matific.com/us/en-us/home/
