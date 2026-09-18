// Generative theming: the LLM wraps a code-generated problem in a story world the child
// chose (autonomy + curiosity — the two SDT needs shipped designs under-serve). The NUMBERS
// and the answer stay owned by code; the story is flavour only, and the exact equation is
// still shown, so correctness is never at the LLM's mercy.
//
// Guard: the generated story must contain BOTH operands and must NOT contain the answer.
// If it fails, we fall back to the plain problem. Dependency-free (global fetch).

const WORLDS = {
  dragons: "a friendly dragon adventure",
  space:   "an outer-space mission",
  sport:   "a football match",
  bakery:  "a busy cake bakery",
};

const opWord = { "+": "adding things together", "-": "taking things away",
                 "*": "groups of equal size (multiplication)" };

function prompt(problem, theme) {
  const { a, b, op } = problem;
  return `Write ONE short, fun maths word problem for a 7-year-old, set in ${WORLDS[theme]}.
It must use the numbers ${a} and ${b} exactly once each, and be solved by ${opWord[op]}.
Do NOT state or compute the answer. Keep it to ONE sentence ending in a question.
Return only the sentence.`;
}

async function callLLM(messages, cfg) {
  const res = await (cfg.fetchImpl || fetch)(cfg.baseURL, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${cfg.apiKey}` },
    body: JSON.stringify({ model: cfg.model, messages, temperature: 0.8, max_tokens: 90 }),
  });
  if (!res.ok) throw new Error(`LLM ${res.status}`);
  return (await res.json()).choices[0].message.content.trim();
}

const has = (text, n) => (text.replace(/,/g, "").match(/\d+/g) || []).includes(String(n));

export async function makeStory(problem, theme, cfg) {
  const config = {
    baseURL: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat", apiKey: process.env.DEEPSEEK_API_KEY, ...cfg,
  };
  if (!theme || theme === "numbers" || !WORLDS[theme]) return { text: null, themed: false };
  try {
    const text = await callLLM(
      [{ role: "system", content: "You write playful, correct maths word problems for young children." },
       { role: "user", content: prompt(problem, theme) }], config);
    // guard: both operands present, answer absent -> else fall back to the plain equation
    const ok = has(text, problem.a) && has(text, problem.b) && !has(text, problem.answer);
    return ok ? { text, themed: true } : { text: null, themed: false };
  } catch {
    return { text: null, themed: false };
  }
}

export const WORLD_KEYS = Object.keys(WORLDS);

// ---- the world narrator: what happens when the child BUILDS something ----
// This is the piece Prodigy structurally cannot do: the world is generated, personal, and
// it remembers. Numbers stay code-owned; the narrator only ever writes flavour.
export async function narrateBuild({ name, building, built, isFirst, lastSession }, cfg) {
  const config = {
    baseURL: "https://api.deepseek.com/chat/completions",
    model: "deepseek-chat", apiKey: process.env.DEEPSEEK_API_KEY, ...cfg,
  };
  const others = built.filter((b) => b !== building.label);
  const memory = others.length
    ? `Already in the village: ${others.join(", ")}.`
    : "This is the very first thing in the village.";
  const back = lastSession ? `The child was last here and built ${lastSession}.` : "";
  const who = name ? `The builder is called ${name}.` : "";
  try {
    const res = await (config.fetchImpl || fetch)(config.baseURL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${config.apiKey}` },
      body: JSON.stringify({
        model: config.model, temperature: 0.9, max_tokens: 70,
        messages: [
          { role: "system", content:
            "You narrate a cosy village a child is building. Warm, vivid, ONE sentence, max 22 words. " +
            "Speak to the child. Mention something they built before when it makes sense, so the village feels remembered. " +
            "No numbers, no maths, no praise-clichés like 'great job'." },
          { role: "user", content:
            `${who} They just finished building: ${building.label} ${building.emoji}. ${memory} ${back}` },
        ],
      }),
    });
    if (!res.ok) throw new Error("narrate failed");
    const t = (await res.json()).choices[0].message.content.trim().replace(/^["']|["']$/g, "");
    return { text: t };
  } catch {
    return { text: `The ${building.label} is finished — the village grows.` };
  }
}
