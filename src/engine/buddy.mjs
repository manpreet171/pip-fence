// buddy.mjs — the hint layer. Isomorphic: no top-level DOM or Node access, so the browser imports
// TEMPLATES / payload() / hint() / gate() and the server imports phrase(). See docs/BUDDY-CONTRACT.md.
//
// Code owns truth (fence.mjs classify picks id + tier). The model only PHRASES a template it is
// handed, from a payload that contains no integer derived from the build — it cannot leak an
// answer it was never given. Any failure anywhere → the template ships.

export const IDS = ["off_by_one_in_one_group", "off_by_one_per_group", "counted_groups_as_group_size",
  "one_group_only", "over_count", "right_total_wrong_grouping", "pack_unit_confusion", "ambiguous"];

// Mirror of data/hints_v2.txt (the source of truth; evals/run_all.py asserts set-equality).
// The browser cannot read a file, hence the copy.
const HINTS = `off_by_one_in_one_group	1	That part of the fence is short. Count a full part again.
off_by_one_in_one_group	2	Look at the top of every part. Which part is not as tall as the other parts?
off_by_one_in_one_group	3	Find the part that is not as tall as the other parts. Put a plank from the cart on that part.
off_by_one_per_group	1	Every part of the fence is a little short. Look at how tall a full part is.
off_by_one_per_group	2	Look at the top of each post. Every part stops before the top of its post.
off_by_one_per_group	3	Each part needs a plank more. Put a plank on every part, up to the top of its post.
counted_groups_as_group_size	1	Each part needs the same planks. Look at what is in a full part.
counted_groups_as_group_size	2	How many parts there are is not how many planks go in a part. Look at how tall a post is.
counted_groups_as_group_size	3	Put planks on a part up to the top of its post. Then make every part look just like it.
one_group_only	1	Only the first part is built. The other parts are still empty.
one_group_only	2	Each part needs planks. Look at the empty posts next to the built part.
one_group_only	3	Put planks on the empty part next to the built part. Make it look just like the first part.
over_count	1	That part has a plank sticking out over the post. Take it back to the cart.
over_count	2	Look at the top of each post. A plank over the top of the post does not go there.
over_count	3	Find the plank that sticks out over the post. Take that plank off and put it back in the cart.
right_total_wrong_grouping	1	A part is still empty, but some parts are too tall. Look at the top of each post.
right_total_wrong_grouping	2	Each part stops at the top of its post. The planks over the top need to go to the empty part.
right_total_wrong_grouping	3	Take a plank that sticks out over a post. Put it on the empty part.
pack_unit_confusion	1	A pack holds many planks. Look inside a pack.
pack_unit_confusion	2	Open a pack and count the planks inside. A pack is more than a plank.
pack_unit_confusion	3	Count the planks in a pack. Then count the planks a part needs, and get packs for that.
ambiguous	1	Show me a part that looks finished.
ambiguous	2	Point to a part you think is done. Look at the top of its post.
ambiguous	3	Point to the part you think is done. Does its top plank come up to the top of the post?`;

export const TEMPLATES = {};
for (const line of HINTS.split("\n")) {
  const [id, tier, text] = line.split("\t");
  (TEMPLATES[id] ??= {})[+tier] = text;
}

const READING_LEVEL = "500-word list, max 2 sentences";
const CONSTRAINT = "Use no numbers of any kind. Point with words, not digits.";
const NOUNS = { group: "part", unit: "plank", pack: "pack" };
export const SHAPE_KEYS = ["groups", "one_group_short", "all_groups_short", "has_over", "has_empty"];

// The redacted payload of CONCEPT §3 from already-boolean shape facts. Server-side the body is
// rebuilt through this from the validated {id, tier, shape} so the client's template/nouns text is
// never forwarded to the model.
export function redact(id, tier, shape) {
  return {
    age: 8, reading_level: READING_LEVEL, misconception_id: id, tier,
    shape: { groups: "some", one_group_short: !!shape.one_group_short, all_groups_short: !!shape.all_groups_short,
      has_over: !!shape.has_over, has_empty: !!shape.has_empty },
    nouns: NOUNS, template: TEMPLATES[id]?.[tier], constraint: CONSTRAINT,
  };
}

// result = classify() output {id, tier, counts, node, confirmed}. `per` comes from the node name
// ("4x3_concrete" → 3) and is used only to derive booleans; no count survives into the payload.
export function payload(result) {
  const per = +result.node.split("x")[1].split("_")[0];
  const c = result.counts || [];
  const short = c.filter(n => n < per).length;
  return redact(result.id, result.tier, {
    one_group_short: short === 1, all_groups_short: c.length > 0 && short === c.length,
    has_over: c.some(n => n > per), has_empty: c.includes(0),
  });
}

// ---- the output gate (lexical; CONCEPT §3 says exactly what it does and does not protect) ----
export const NUMBER_WORDS = new Set(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "fifteen", "twenty", "hundred", "dozen", "half", "twice", "once", "single",
  "pair", "couple", "both", "double",
  "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]);   // ordinals name a position and leak the group count; "first" stays allowed (D-068)
const AFFECT = /\b(sad|disappointed|wrong|bad)\b|miss you/;

// data/wordlist.txt text → Set of lowercase words (BASE ∪ DOMAIN; comments dropped).
export const parseWordlist = (text) =>
  new Set(text.split(/\r?\n/).map(l => l.trim()).filter(l => l && !l.startsWith("#")).map(l => l.toLowerCase()));

const inList = (w, list) => {
  for (const suf of ["ing", "ed", "es", "s"]) if (w.endsWith(suf) && w.length - suf.length >= 3 && list.has(w.slice(0, -suf.length))) return true;
  return list.has(w);
};

// null = passes; otherwise the reason it fails ("sentences" | "number" | "affect" | "vocab").
export function gate(text, wordlist) {
  if (typeof text !== "string" || !text.trim()) return "empty";
  if (text.trim().split(/[.!?]+/).filter(s => s.trim()).length > 2) return "sentences";
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  if (/\d/.test(text) || words.some(w => NUMBER_WORDS.has(w))) return "number";
  if (AFFECT.test(text.toLowerCase())) return "affect";
  if (wordlist && words.filter(w => !inList(w, wordlist)).length > 2) return "vocab";
  return null;
}

// ---- browser side: POST the redacted payload, fall back to the template on anything at all ----
export async function hint(result, { timeoutMs = 2500, fetchImpl = globalThis.fetch } = {}) {
  const template = TEMPLATES[result?.id]?.[result?.tier] ?? "";
  try {
    const res = await fetchImpl("/api/buddy", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(payload(result)), signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return { text: template, source: "template", reason: `http_${res.status}` };
    const out = await res.json();
    if (out?.source === "model" && typeof out.text === "string" && out.text) return { text: out.text, source: "model", ...(out.model && { model: out.model }) };
    return { text: template, source: "template", reason: out?.reason || "server_fallback" };
  } catch (e) {
    return { text: template, source: "template", reason: e?.name === "TimeoutError" ? "timeout" : "network" };
  }
}

// ---- server side: one request builder per provider, then the same gate, in order ----
// Provider follows the key: Anthropic (Haiku, strict JSON schema) if ANTHROPIC_API_KEY is set, else
// DeepSeek (v4-flash, JSON mode, thinking disabled) with DEEPSEEK_API_KEY. Same payload, same gate,
// same template fallback either way; the gate is what makes the output safe, not the vendor (D-067).
const SYSTEM = () => "You phrase one hint for a child aged 8 reading at a 500-word level. Max 2 sentences. " +
  "Use no numbers of any kind — no digits, no number words. Never state or imply how many. Point with words. " +
  "Never say sad, disappointed, or miss you.";
const SCHEMA = { type: "object", additionalProperties: false, required: ["tier", "misconception_id", "text"],
  properties: { tier: { type: "integer", enum: [1, 2, 3] }, misconception_id: { type: "string", enum: IDS }, text: { type: "string" } } };

// A job = system prompt + strict schema + token budget. Two jobs share the providers: the child's
// hint (60 tokens, no numbers) and the parent's weekly note (CONCEPT §7: AI pointed at the adult).
export const HINT_JOB = { system: SYSTEM, schema: SCHEMA, max_tokens: 120,
  extra: " Reply with only a JSON object with the keys tier, misconception_id and text. Copy tier and misconception_id from the input exactly." };
const NOTE_SYSTEM = (open = true) => "You write a short weekly note to a parent about their child, aged about 8, who is learning to " +
  "count groups by building fences in a game. Plain words a parent can read in ten seconds. Warm, specific, never blaming. " +
  "Do not use the words wrong, bad, lazy, slow, behind, struggling, failed. Do not name the game's internal labels. " +
  "Mention only what the input lists; invent nothing. Call the pieces of the fence parts and planks, never sections or segments. " +
  (open
    ? "note: at most three sentences saying what the child did and what they are still working on. "
    : "note: at most two sentences saying what the child did. Nothing is open: do not mention anything they are still working on, practising, or should do next. ") +
  "question: exactly one thing the parent can ask the child out loud.";
const NOTE_SCHEMA = { type: "object", additionalProperties: false, required: ["note", "question"],
  properties: { note: { type: "string" }, question: { type: "string" } } };
export const NOTE_JOB = { system: NOTE_SYSTEM, schema: NOTE_SCHEMA, max_tokens: 220,
  extra: " Reply with only a JSON object with the keys note and question." };
const noteJobFor = (payload) => ({ ...NOTE_JOB, system: () => NOTE_SYSTEM(!!payload.still_working_on) });

export const PROVIDERS = {
  anthropic: {
    model: "claude-haiku-4-5-20251001", usd_per_mtok: { in: 1, out: 5 },
    request: (payload, apiKey, job = HINT_JOB) => ["https://api.anthropic.com/v1/messages", {
      method: "POST", headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: job.max_tokens, temperature: 0.4, system: job.system(),
        messages: [{ role: "user", content: JSON.stringify(payload) }],
        output_config: { format: { type: "json_schema", schema: job.schema } } }) }],
    parse: data => ({ text: data?.content?.find(b => b.type === "text")?.text ?? "",
      usage: data?.usage && { input_tokens: data.usage.input_tokens, output_tokens: data.usage.output_tokens } }),
  },
  deepseek: {
    model: "deepseek-v4-flash", usd_per_mtok: { in: 0.44, out: 1.32 },   // peak list price; off-peak is half
    request: (payload, apiKey, job = HINT_JOB) => ["https://api.deepseek.com/chat/completions", {
      method: "POST", headers: { authorization: "Bearer " + apiKey, "content-type": "application/json" },
      body: JSON.stringify({ model: "deepseek-v4-flash", max_tokens: job.max_tokens, temperature: 0.4,
        thinking: { type: "disabled" }, response_format: { type: "json_object" },
        messages: [
          { role: "system", content: job.system() + job.extra },
          { role: "user", content: JSON.stringify(payload) }] }) }],
    parse: data => ({ text: data?.choices?.[0]?.message?.content ?? "",
      usage: data?.usage && { input_tokens: data.usage.prompt_tokens, output_tokens: data.usage.completion_tokens } }),
  },
};
export const request = (payload, apiKey, provider = "anthropic") => PROVIDERS[provider].request(payload, apiKey);

// ---- the parent note: the same architecture pointed at the adult (CONCEPT §7, Tutor CoPilot shape) ----
// Plain words per misconception, and the one question to ask. These are the fallback AND the
// meaning the model is given; the model never sees the child's counts or the game's ids alone.
export const PARENT_WORDS = {
  off_by_one_in_one_group: ["One part of the fence comes out a plank short. The counting is nearly there; it stops one early on a single part.", "Show me one full part. Now count it out loud for me."],
  off_by_one_per_group: ["Every part comes out one plank short. The number for each part is being remembered as one less than it is.", "How many planks does one part need? Show me with your fingers."],
  counted_groups_as_group_size: ["Each part gets as many planks as there are parts. The two numbers in the job are getting swapped.", "Which number says how many parts, and which says how many go in each part?"],
  one_group_only: ["One part is built and then the job stops, as if one part were the whole fence.", "Is the fence finished? Walk along it with your finger."],
  over_count: ["A part gets too many planks, so one sticks out over the post.", "Show me where one part stops and the next one starts."],
  right_total_wrong_grouping: ["All the wood gets used, but it is piled into fewer parts than the job asked for.", "How many parts does this fence need? Point to each one."],
  pack_unit_confusion: ["A pack is being treated as one plank, so far too many packs get ordered.", "Open a pack in your head. What is inside it?"],
  ambiguous: ["Every part came out short by the same amount. It is not clear yet whether the size of a part was miscounted or the two numbers were mixed up.", "Show me one part that looks finished."],
};
export const NOTE_KEYS = ["open_id", "tier", "solo", "helped", "days"];
const FENCE_NAME = /^[2-5] parts of [2-5]( \(packs\))?$/;
export const validNote = (b) => b && typeof b === "object" && Object.keys(b).every(k => NOTE_KEYS.includes(k))
  && (b.open_id === null || IDS.includes(b.open_id)) && [1, 2, 3].includes(b.tier)
  && [b.solo, b.helped].every(a => Array.isArray(a) && a.length <= 12 && a.every(x => FENCE_NAME.test(x)))
  && Number.isInteger(b.days) && b.days >= 0 && b.days <= 7;
// What the model is told: fence names (the parent may know the sizes), the meaning of the open
// misconception in parent words, the template question. No event log, no counts, no ids alone.
// "3 parts of 4 (packs)" -> an unambiguous object; the model once read "2 parts of 3" as two fences.
const fenceObj = (name) => { const m = /^(\d) parts of (\d)( \(packs\))?$/.exec(name);
  return { parts: +m[1], planks_in_each_part: +m[2], ordered_in_packs: !!m[3] }; };
export function notePayload(b) {
  return { audience: "parent", child_age: 8, days_played_this_week: b.days,
    fences_finished_without_a_hint: { how_many_fences: b.solo.length, fences: b.solo.map(fenceObj) },
    fences_finished_with_a_hint: { how_many_fences: b.helped.length, fences: b.helped.map(fenceObj) },
    still_working_on: b.open_id ? { what_happens: PARENT_WORDS[b.open_id][0], hints_reached: b.tier } : null,
    suggested_question: b.open_id ? PARENT_WORDS[b.open_id][1] : "Which fence did you like building best?" };
}
const BLAME = /\b(wrong|bad|lazy|slow|behind|struggling|failed|fail|stupid)\b/i;
export function noteGate(out, open = true, fences = 1) {
  if (!out || typeof out.note !== "string" || typeof out.question !== "string") return "schema";
  if (fences === 0 && /\b(built|finished|completed|made|put up)\b/i.test(out.note)) return "invented";   // a thin week is not a built fence
  if (!open && /\b(still|working on|practi[cs]|keep|next|needs? to|improve|struggl)/i.test(out.note)) return "invented";
  if (out.note.trim().split(/[.!?]+/).filter(s => s.trim()).length > 3) return "sentences";
  // "one thing to ask out loud" may be an instruction ("Show me one full part.") or a question; never a speech.
  const q = out.question.trim();
  if (!q || q.split(/[.!?]+/).filter(x => x.trim()).length > 2 || (q.match(/\?/g) || []).length > 1) return "question";
  if (BLAME.test(out.note) || BLAME.test(out.question)) return "blame";
  if (/_/.test(out.note + out.question)) return "labels";
  if (/\b(sections?|segments?)\b/i.test(out.note + out.question)) return "vocab";   // the child hears "part"; the parent must too
  if (out.note.length > 400 || out.question.length > 160) return "length";
  return null;
}
export function noteFallback(b) {
  const done = b.solo.length + b.helped.length;
  const note = (done ? `This week ${done === 1 ? "one fence went up" : done + " fences went up"}${b.helped.length ? (b.solo.length ? ", some with a hint" : ", with a hint") : ""}. ` : "No fences went up this week yet. ")
    + (b.open_id ? PARENT_WORDS[b.open_id][0] : "Nothing is open right now.");
  return { note, question: b.open_id ? PARENT_WORDS[b.open_id][1] : "Which fence did you like building best?" };
}
export async function writeNote(b, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", timeoutMs = 4000 } = {}) {
  const fallback = (reason) => ({ ...noteFallback(b), source: "template", reason });
  if (!apiKey) return fallback("no_key");
  if (!b.solo.length && !b.helped.length && !b.open_id) return fallback("nothing_to_say");   // an empty week gets the plain sentence, never an invented one
  try {
    const pl = notePayload(b);
    const [url, init] = PROVIDERS[provider].request(pl, apiKey, noteJobFor(pl));
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return fallback(`http_${res.status}`);
    const { text } = PROVIDERS[provider].parse(await res.json());
    let out; try { out = JSON.parse(text); } catch { return fallback("parse"); }
    const why = noteGate(out, !!b.open_id, b.solo.length + b.helped.length);
    return why ? fallback(why) : { note: out.note.trim(), question: out.question.trim(), source: "model" };
  } catch (e) { return fallback(e?.name === "TimeoutError" ? "timeout" : "error"); }
}
// browser side: never throws
export async function note(b, { timeoutMs = 5000, fetchImpl = globalThis.fetch } = {}) {
  try {
    const res = await fetchImpl("/api/note", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(b), signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) { const out = await res.json(); if (out?.note && out?.question) return out; }
  } catch {}
  return { ...noteFallback(b), source: "template" };
}

export async function phrase(payload, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", wordlist, timeoutMs = 2000 } = {}) {
  const template = TEMPLATES[payload?.misconception_id]?.[payload?.tier] ?? "";
  const fallback = (reason, extra) => ({ text: template, source: "template", reason, ...extra });
  if (!apiKey) return fallback("no_key");
  try {
    const [url, init] = PROVIDERS[provider].request(payload, apiKey);
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return fallback(`http_${res.status}`);
    const data = await res.json();
    const { text, usage } = PROVIDERS[provider].parse(data);
    let out;
    try { out = JSON.parse(text); } catch { return fallback("parse", { usage }); }
    const keys = Object.keys(out ?? {}).sort().join(",");
    if (keys !== "misconception_id,text,tier" || out.tier !== payload.tier || out.misconception_id !== payload.misconception_id
      || typeof out.text !== "string") return fallback("schema", { usage });
    const why = gate(out.text, wordlist);
    return why ? fallback(why, { usage, rejected: out.text }) : { text: out.text.trim(), source: "model", usage };
  } catch (e) {
    return fallback(e?.name === "TimeoutError" ? "timeout" : "error");
  }
}
