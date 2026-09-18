# DEMO — the shot list for the 3-minute video (CONCEPT-V3.2 §9, built product)

Hard cap 3:00. Target 2:45. Hands only: no faces, no names, no child voice (voiceprints are
personal information under amended COPPA). Screen recording of `/build` at 1280×720 plus one
phone shot. Voice-over is the author, plain register, no music under speech.

Every number spoken on camera comes from a committed doc, named below in brackets.

| Time | Shot | On screen | Voice-over |
|---|---|---|---|
| 0:00–0:15 | **Cold open** | The Pip home page for two seconds (stars, badges), then `/fence`, clean slate: the How-to-play sheet, then Pip builds the first part herself, counting aloud, and hands over. Header "3 parts. 4 planks in each part." Cart with twelve planks, goat outside, corn inside. | "This is Pip. A child is told three parts, four planks each, and given exactly twelve planks. The maths is the build. There is no question to answer." |
| 0:15–0:35 | **The 20-second beat** | Tap cart, tap part one ×4, part two ×4, part three ×3. One plank left. Tap Done. Goat walks through the gap. Bubble on the gap: *"That part of the fence is short. Count a full part again."* | "She miscounts. Nothing goes red. The fence stands wrong, the goat finds the gap, and a hint lands on the gap. She still has a plank in the cart and walked away. That *is* the misconception, on screen." |
| 0:35–0:50 | **Repair** | Empty-hand tap on a full part: pips 1-2-3-4. Tap cart, tap the short part. Goat walks out. "The fence is done." Next plot. | "She counts a full part with her finger. One more plank. The goat leaves. No score, no confetti." |
| 0:50–1:05 | **Side by side** | Split: left the frozen earlier build (`CONTROL_ARM=1`, `/`) with its red X; right the new build's standing wrong fence. | "This is my earlier build, the one most hackathon entries look like: answer, red X, farm unchanged. It is the comparison build and it is my own, which is a conflict of interest." |
| 1:05–1:30 | **Code owns truth** | `fence.mjs` Part 1 scrolled slowly; then `node evals/classifier_eval.mjs` output: confusion matrix, "right when committed 55/55, silent 13, mismatches 0". | "The classifier is a pure function over the placement log. Sixty-eight hand-written sequences. It is right whenever it commits, and it stays silent when two mistakes make the same fence. That is spec-consistency, not accuracy on children." [TEST-REPORT, classifier_eval] |
| 1:30–1:55 | **Pip teaches** | Build a part one short, tap Done, the hint lands. Tap **Say it another way**: a fresh phrasing. Tap **Show me, Pip**: Pip points, counts the short part aloud, places the plank, hands back. Tap Next plot: "Pip is choosing", then the next fence with Pip's one-line reason on the card. | "Pip is not a chat box. She phrases, she praises what was actually done, she chooses the next fence from the child's own record, and she shows a repair as moves on the child's own fence. Every one of those is proposed by a model and checked by code: the moves are simulated before Pip makes them, the pick is checked against the list code allowed." [PLAN-RESULTS, SHOW-RESULTS] |
| 1:55–2:15 | **The AI layer, inside** | Press J: the overlay opens beside the game. The event log, the classifier's id, the payload with no digit, the hint's source and latency, and the two new panels: who chose the next fence and why, and who wrote the worked example's moves. Ten seconds on that screen, no cuts. | "The old coach was told the answer. This one is never given a number. Code names the mistake; a model only phrases the hint, through a gate that cannot emit a digit or a number word, and the browser reads it out. Twenty live hints: median under a second, a hundredth of a cent, four rejected for the word *one*." [LATENCY-RESULTS] |
| 2:15–2:30 | **Red-team** | `REDTEAM-RESULTS.md` Update 5 table. | "An attacker given the whole payload recovers the total no better than guessing the commonest one. Given only the hint the child sees, worse. Same family as the coach, which is a limitation I publish rather than hide." [REDTEAM-RESULTS §UPDATE 5] |
| 2:30–2:42 | **The pilot** | Paper test sheet (`TRANSFER-TEST.md`), then the three case-study lines, whatever they are. | "Three children, before and after and two days later, with two control items that were never taught. I ran the tests myself, unblinded. n equals three, no p-value." Then the result **in the pre-registered words if it is a null**. |
| 2:42–2:52 | **The parent** | `/public/parent.html` on a phone: the note writes itself in a second, then one question to ask out loud. | "Parents control return, so the retention screen is for the parent. The model writes this note from the child's mistakes, never from a transcript, through its own gate: one question, no blame. The best result in the tutoring literature came from pointing AI at the adult." |
| 2:52–3:00 | **Close** | README top, repo tree, `python evals/run_all.py` ALL PASS. | "The mechanic is Zombie Division's, from 2011, credited. The gap between this and what already ships is narrower than the pitch implies. Everything I just said is measured in the repo." |

## Say aloud, verbatim (CONCEPT §9)
- "The comparison build is my own earlier build, which is a conflict of interest."
- "I administered the post-test myself, unblinded — I knew exactly what each child had just done."
- "She still had a plank in the cart and walked away — that is the misconception, on screen."
- "The number gate is lexical. It stops the model saying the total. It does not stop it saying 'add another plank' — and it shouldn't."
- "n=3. No p-value. Three case studies, and a null if that is what we got."

## Do not say
- "100% accurate" (say *right whenever it commits*), "zero dependencies" without *runtime*, "independent QA passed" without *and I then played every state by hand*, "improves learning".

## Before filming
- Record in Microsoft Edge on Windows: the model's own lines then use the same child's voice (Ana) as the bundled clips. In Chrome they fall back to Google's voice.
- Reach `/fence` by tapping Play on the home page, not by typing the URL, so the browser lets the How-to sheet read itself aloud.
- Clear `rung.v1` in the browser; run with `DEEPSEEK_API_KEY` set so `?debug=1` shows `model`.
- Start the control arm in a second window with `CONTROL_ARM=1 PORT=5178 node src/server.mjs`.
- Tap Done inside a few seconds of the last plank; the idle timer is 45 s.
- Record the classifier and `run_all` terminal output at a readable font size (18 px or larger).
