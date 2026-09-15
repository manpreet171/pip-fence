# DEMO — the 3-minute shot list for Kuzhi

Hard cap 3:00, target 2:45. Hands only, no faces, no names, no child voice. Screen recording of
`/board` at 1280×720, one phone shot, one real wooden board if one is to hand. Voice-over in a plain
register. Every number spoken comes from a committed document, named in brackets.

| Time | Shot | On screen | Voice-over |
|---|---|---|---|
| 0:00–0:12 | **Cold open** | A real sowing board if available, then `/board`: two rows of seven pits, two seeds in each. | "Children in Tamil Nadu, Karnataka and West Africa have played this for a long time. You lift a pit and drop one seed into each pit after it. I added one rule." |
| 0:12–0:35 | **The call** | Tap a pit: it lifts, the seeds sit in the hand. Tap the pit two along. Marker drops. Seeds sow one at a time. The last seed lands on the marker; it flips; a capture slides to her store. | "Before she sows, she has to call the pit her last seed will land in. That is counting on, out loud, with her finger. Nothing moves until she has committed." |
| 0:35–1:00 | **The miss** | Tap a pit with three seeds, call the pit two along. Seeds sow. The last seed lands one past the marker; it flies on past, into the far store. The marker stays. Card beside it (the template, tier 1): *"Your marker is a pit early. The pit you pick up does not get a seed."* Spoken. | "She counted the pit she picked up as the first drop. That is the commonest miscount in counting on, and it is sitting on the board where she can see it. Nothing red. The seed she miscounted is the seed she loses, every time, so the call always matters." |
| 1:00–1:15 | **Repair** | Empty-hand tap on the source pit: pips walk the path one per seed, ending on the landing pit. Next move, the same miss once more: this card is the model's (tier 2), then a correct call and a capture earned. | "She counts the path with a tap. The second time, the model phrases the hint; the first time it was the template, because at tier one the template is better than any rephrase, and I measured that." |
| 1:15–1:35 | **Code owns truth** | Press J. The overlay: the event log, the classifier line `counted_start_pit`, the payload with `[no digits]`, the hint's source, latency and model id, "other side: code, p_best = 0.6". | "Code named the miscount from the log. The model only phrased the hint, from a payload with no number in it, through a gate that cannot say a digit. The other side of the board is code with one knob, not a model." [BUDDY-CONTRACT, HD-005] |
| 1:35–1:50 | **The ladder** | `?node=4_count`: she calls the pit and taps a strip of seed silhouettes for how many it will hold. Then `?node=4_even`: she calls even or odd; the pit turns even and she captures it. | "Same board, same log, same classifier: counting on becomes addition, then even and odd. Ten levels, each tuned so a child wins about half her games against the code side." [policy_sim, HD-012] |
| 1:50–2:05 | **Measured** | `LATENCY-RESULTS.md` and `REDTEAM-RESULTS.md` tables; `python heritage/evals/run_all.py` ALL PASS. | "Twenty live hints: median under a second, a hundredth of a cent. An attacker given everything the model sees recovers the landing pit worse than guessing the commonest one. Ninety-four hand-written call sequences: right whenever it commits, silent when two miscounts look the same." [LATENCY-RESULTS, REDTEAM-RESULTS, classifier_eval] |
| 2:05–2:20 | **The parent** | `/public/parent.html` on a phone: the bar per move, then the note writing itself, then one question. | "Parents control return. The note is written by the model from a summary of her calls, never a transcript, through its own gate. The bars are her calls this week, in order. The strongest result in the tutoring literature came from pointing AI at the adult." |
| 2:20–2:40 | **Where it comes from** | `/public/source.html`. | "The rules vary by household; this is one simplified version and it says so. The call is my addition, not a traditional rule. No study anywhere shows sowing games improve arithmetic, so the pilot measures it, and I report a null if that is what I get." [RESEARCH, TRANSFER-TEST] |
| 2:40–3:00 | **Close** | `heritage/README.md`, the folder tree, the decision log. | "Everything I said is in the repository, measured. The mechanic is theirs; the call, the classifier and the gate are mine." |

## Say aloud, verbatim
- "The call is my addition. No traditional rule set has it."
- "No study anywhere shows sowing games improve arithmetic. This is the first measurement I know of, and it is tiny."
- "The other side of the board is code. There is no model near a move."
- "The number gate is lexical. It stops the model saying a pit or a count. It cannot see a sentence that points the wrong way, and I measured how often that happens."
- "n=3. No p-value."

## Do not say
- "Ancient", "5,000 years", "Chola kings", "Vedic", "invented in". Say *earliest evidence* and name the region.
- "The AI teaches counting." Code names the miscount; the model phrases; she counts.
- "100% accurate." Say *right whenever it commits*.

## Before filming
- Clear `kuzhi.v1`; run with `DEEPSEEK_API_KEY` set; check `?debug=1` shows `model` on the first wrong call, and if the live rephrase reads wrong, film the template (HD-010).
- Start on `2_single`; the miss shot uses a three-seed pit on `3_single` (`?node=3_single`); the ladder shot uses `?node=4_count` then `?node=4_even`.
- Record the eval output at 18 px or larger.
