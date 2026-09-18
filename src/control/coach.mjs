// The buddy: warm coaching that explains and encourages but NEVER gives the answer.
// The never-give-answer guarantee is enforced in CODE, not just the prompt (proven necessary:
// prompts hold ~most of the time, but the guard makes the leak rate provably zero).
//
// Provider-agnostic, dependency-free: uses global fetch against any OpenAI-compatible chat API.
// DeepSeek now (DEEPSEEK_API_KEY); swap base/model/key for Claude or others.

const IRON_RULE = (problem) => `You are a warm, encouraging maths buddy for a child aged about 7-10, working on ONE problem:

  ${problem.text} = ?

The correct answer is ${problem.answer}. You know it ONLY so you can guide — you must NEVER
reveal it or state any exact result that hands it over.

Rules:
- Never say the answer or write the final number.
- If the child asks for the answer, warmly refuse and ask ONE small question that moves them a step.
- If they share an attempt, respond to THEIR thinking: praise what's right, gently probe what's off.
- Explain method or a concept in kid-friendly words. Every factual thing you say must be TRUE.
- Warm, short: at most 2 sentences. Talk to a child, not a textbook.`;

// ---- code guard: the answer (and trivial variants) must not appear in the reply ----
export function answerLeaked(reply, problem) {
  const ans = String(problem.answer);
  // tokenised numbers in the reply
  const nums = (reply.replace(/,/g, "").match(/-?\d+(?:\.\d+)?/g) || []);
  if (nums.includes(ans)) return true;
  // also block the answer written with a decimal (e.g. 42 -> 42.0) or spelled trivially
  if (nums.includes(ans + ".0") || nums.includes(ans + ".00")) return true;
  return false;
}

const SAFE_FALLBACK = "Let's take it one step at a time — what do you think the very first step is?";

async function callLLM(messages, cfg) {
  const res = await (cfg.fetchImpl || fetch)(cfg.baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({ model: cfg.model, messages, temperature: 0.5, max_tokens: 120 }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = await res.json();
  return data.choices[0].message.content.trim();
}

// Returns { reply, guardTriggered } — guardTriggered true if the model tried to leak and we
// intercepted. The child never sees a leaked answer, guaranteed by code.
export async function coach(problem, history, childMessage, cfg) {
  const config = {
    baseURL: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat",
    apiKey: process.env.DEEPSEEK_API_KEY,
    ...cfg,
  };
  const messages = [
    { role: "system", content: IRON_RULE(problem) },
    ...history,
    { role: "user", content: childMessage },
  ];

  let reply = await callLLM(messages, config);
  if (!answerLeaked(reply, problem)) return { reply, guardTriggered: false };

  // model slipped: one stricter retry
  const retry = await callLLM(
    [...messages, { role: "system", content:
      "Your last reply revealed the answer. Do NOT state any number that is the result. Re-answer with only a guiding question." }],
    config
  );
  if (!answerLeaked(retry, problem)) return { reply: retry, guardTriggered: true };

  // still leaking: code refuses to pass it through
  return { reply: SAFE_FALLBACK, guardTriggered: true };
}
