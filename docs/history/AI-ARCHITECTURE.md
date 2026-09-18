> History. Pre-build specification. What was built is in README.md and docs/DECISIONS.md (D-071, D-075, D-079 to D-082).

# AI ARCHITECTURE — what AI earns its place in Rung (Sept 2026)

Written 4 Sep 2026 as the AI-architecture review, grounded in `docs/RESEARCH-LEARNER.md`.
Model IDs, prices and API features were verified against vendor docs at time of writing; see the
confidence flags at the end. Companion to `docs/MARKET.md`.

---


## AI that earns its place (ranked)
1. **Deterministic misconception classification — not AI at all.** Error-specific feedback ("you counted the beams, not the logs in each") is derivable from the placement delta with a lookup table. The game knows target, placed, grouping. An LLM re-deriving it will sometimes be wrong; a table never. **The model does not decide what is true.**
2. **Hint-tier PHRASING is the buddy's only job.** Code picks misconception ID + tier; the LLM renders it as ≤2 sentences a 7-year-old reads. **The answer is never in the prompt, so it cannot leak** — beats a regex guard fighting a model that holds the answer.
3. **Per-turn safety/age re-injection.** KIDBench (arXiv 2605.25510): child cues +9–47%, explicit age +10–30%, multi-turn degrades 6–24%. Age + reading level + never-state-answer in EVERY request.
4. **LLM-as-judge in the eval harness, offline.** Scores every hint on: contains the answer digit / ≤2 sentences / names the misconception. Runs in CI, never at runtime.

**Bolted-on novelty a panel sees through:** vision reading the child's blocks (code IS the ground truth — theatre), RAG over ~40 skill nodes (it's a dict), agentic multi-step tutoring, LLM-generated levels, memory/personality layer.

## Recommended stack (verified)
- **Coach:** `claude-haiku-4-5-20251001` — $1/$5 per MTok, fastest tier, structured outputs GA (`output_config.format`, `strict: true`). Hint ≈ 400 in / 60 out ≈ **$0.0007**. 10,000 hints ≈ $7.
- **Judge:** `gemini-3.8-flash` ($0.75/$3.75) or `gemini-2.5-flash-lite` ($0.10/$0.40, free tier). Judge must be a **different family** from the candidate (self-preference bias: GPT-4 ~+10%, Claude ~+25% on own outputs).
- **Do NOT use frontier tiers** (`claude-opus-5`, `gpt-5.6-sol`, `gpt-6-astra`) for a 60-token schema-constrained hint — reads as not having measured.
- **Speech: do not ship.** Whisper-class ≈ 25% WER on children; best public fine-tune (Kid-Whisper) ≈ 8.6–9.1% on MyST; worst at ages 4–7. SoapBox Labs (only production child engine) is inside Curriculum Associates, pilots only. Realtime APIs (`gpt-realtime-2.1`, `gemini-3.1-flash-live-preview`, ~$3/$12 per MTok audio) work for adults. **Amended COPPA classifies voiceprints as personal information.**
- **Vision: no.** Second 25%-error channel over data code already holds exactly.
- **Structured output schema:** `{tier: 1|2|3, misconception_id: enum, text: string}`; API doesn't enforce maxLength — cap sentences in code.

## Architecture
```
child places objects
  ↓
GAME STATE (authoritative, code) — target, placed, grouping
  ↓
MISCONCEPTION CLASSIFIER (pure function, ~30 lines, a table) → (id, tier)   ← adaptive floor lives HERE, not in the LLM
  ↓
HINT TEMPLATE for (id, tier)   ← ships offline, works with no key
  ↓ optional
PHRASING CALL: Haiku 4.5, structured output, strict
  prompt = [age 7–11 + reading level + never-state-answer]  ← re-injected EVERY turn
         + misconception_id + template + the child's BUILD STATE ONLY
  the answer value is NOT in the prompt
  ↓
OUTPUT GATE: schema valid? ≤2 sentences? no digit == answer? no banned affect words
  (sad / disappointed / miss you)? → else fall back to template
  ↓
render ON the object, diegetically (split-attention)
```
Two properties a panel notices: **the model cannot leak an answer it was never given**, and **pulling the network cable degrades the buddy to templates instead of breaking the game.** Prefetch the hint the instant the wrong placement lands (hides ~600ms).

Eval harness: ~60 hand-written `(state, error) → expected misconception_id` fixtures; judge pass over generated hints; report leak rate, tier-escalation rate, p50/p95 latency. Randomise A/B order and length-normalise (position bias up to 75% toward first option; verbosity bias 15–30 pts).

## Safety / compliance build list (COPPA amended rule in full effect since 22 Apr 2026)
- Written data-retention policy in the privacy notice (§312.10).
- Written information-security programme with annual risk assessment.
- Separate verifiable parental consent for third-party disclosure — sending a child's free text to an LLM vendor IS a disclosure. **Kill the requirement: the child never types.** Buddy is one-way; child's only inputs are placements. Removes free-text PII, prompt injection and moderation in one design move.
- Voiceprints and facial templates are now personal information — another reason for no mic, no camera.
- Children's Code: high privacy by default, data minimisation, no nudge techniques, Standard 13. No-streaks is already compliant — say so.
- On-device store only (mastery vector + build state). No account, no analytics SDK, no ad ID. Parent view reads local data.
- ICO statutory AI Code (2026) is draft — don't claim compliance.

## What a panel respects / sees through
**Respects:** cost-and-latency table with real numbers; model-swap proven by running two families; an eval harness with a publishable leak rate; knowing why the judge is a different vendor; a slide saying "we did not ship voice — here is the child-ASR WER that decided it." Negative decisions are the strongest evidence of "user value over novelty" + "define success metrics".
**Sees through:** any "agent"; RAG on 40 nodes; a fine-tune with no eval; a system prompt that is the product; "we use GPT-5.6 Sol" as a capability claim; a demo where the model happens to behave.

## Do NOT build (14 days, one builder)
Voice in/out. Vision/handwriting. RAG. Fine-tuning. Multi-agent tutors. MCP. LLM-generated personalised narrative. A local open-weight model (Gemma 3 4B / Qwen3-8B are good but a browser child-safe coach is a week — "the template layer is the offline path"). Long-term memory beyond the mastery vector. An LLM anywhere on the difficulty or mastery decision.

## Confidence flags
Model IDs, prices, structured-output GA, Gemini/OpenAI audio pricing verified against vendor docs; Gemini Live and some Flash-Lite tiers preview-priced. Child-ASR figures from read/prompted speech papers — gameplay speech will be worse. SoapBox GA unverified. `gpt-transcribe` child benchmark: none found. ICO AI Code: unpublished.

Sources: https://platform.claude.com/docs/en/about-claude/models/overview · https://platform.claude.com/docs/en/build-with-claude/structured-outputs · https://developers.openai.com/api/docs/models · https://ai.google.dev/gemini-api/docs/pricing · https://arxiv.org/abs/2605.25510 · https://arxiv.org/html/2309.07927 · https://the-learning-agency.com/the-cutting-ed/article/how-speech-recognition-systems-struggle-with-childrens-voices/ · https://www.finnegan.com/en/insights/articles/coppas-amended-rule-is-now-in-full-effect-what-operators-need-to-know.html · https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/ · https://www.adaline.ai/blog/llm-as-a-judge-reliability-bias
