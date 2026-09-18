// buddy.mjs — the hint layer. Isomorphic: no top-level DOM or Node access, so the browser imports
// TEMPLATES / payload() / hint() / gate() and the server imports phrase(). See docs/BUDDY-CONTRACT.md.
//
// Code owns truth (fence.mjs classify picks id + tier). The model only PHRASES a template it is
// handed, from a payload that contains no integer derived from the build — it cannot leak an
// answer it was never given. Any failure anywhere → the template ships.

export const IDS = ["off_by_one_in_one_group", "off_by_one_per_group", "counted_groups_as_group_size",
  "one_group_only", "over_count", "right_total_wrong_grouping", "pack_unit_confusion",
  "ordered_short", "ordered_over", "counted_present_not_missing", "fixed_one_part_only",          // Fix the fence (docs/MODES.md)
  "parts_equal_total", "parts_equal_per", "parts_one_short", "parts_one_over",                     // Share it out
  "ambiguous"];

// Mirror of data/hints_v2.txt (the source of truth; evals/run_all.py asserts set-equality).
// The browser cannot read a file, hence the copy.
const HINTS = `off_by_one_in_one_group	1	That part of the fence is short. Count a full part again.
off_by_one_in_one_group	2	Look at the top of every part. Which part is not as tall as the other parts?
off_by_one_in_one_group	3	Find the part that is not as tall as the others. Put a plank on it.
off_by_one_per_group	1	Every part of the fence is a little short. Look at how tall a full part is.
off_by_one_per_group	2	Look at the top of each post. Every part stops before the top of its post.
off_by_one_per_group	3	Each part needs a plank more. Put a plank on every part, up to the top of its post.
counted_groups_as_group_size	1	Each part needs the same planks. Look at what is in a full part.
counted_groups_as_group_size	2	The number of parts is not the number of planks in a part. Look how tall a post is.
counted_groups_as_group_size	3	Put planks on a part up to the top of its post. Then make every part look just like it.
one_group_only	1	Only the first part is built. The other parts are still empty.
one_group_only	2	Each part needs planks. Look at the empty posts next to the built part.
one_group_only	3	Put planks on the empty part next to it. Make it look just like the first part.
over_count	1	That part has a plank sticking out over the post. Take it back to the cart.
over_count	2	Look at the top of each post. A plank over the top of the post does not go there.
over_count	3	Find the plank that sticks out over the post. Put it back in the cart.
right_total_wrong_grouping	1	A part is still empty, but some parts are too tall. Look at the top of each post.
right_total_wrong_grouping	2	A part stops at the top of its post. Move the extra planks to the empty part.
right_total_wrong_grouping	3	Take a plank that sticks out over a post. Put it on the empty part.
pack_unit_confusion	1	A pack holds many planks. Look inside a pack.
pack_unit_confusion	2	Open a pack and count the planks inside. A pack is more than a plank.
pack_unit_confusion	3	Count the planks in a pack. Then think how many packs a part needs.
ambiguous	1	Show me a part that looks finished.
ambiguous	2	Point to a part you think is done. Look at the top of its post.
ambiguous	3	Point to a part you think is done. Does it reach the top of the post?
ordered_short	1	Not every gap is filled. Count the empty spaces in each part again.
ordered_short	2	Look at each part. Count the empty spaces, not the planks that are there.
ordered_short	3	Count all the empty spaces in every part. Then tap the note for each space.
ordered_over	1	There are planks left over in the cart. Count the empty spaces again.
ordered_over	2	You got more planks than gaps. Count only the empty spaces in each part.
ordered_over	3	Count the empty spaces in each part. Get only that many, and no more.
counted_present_not_missing	1	You counted the planks that are there. Count the empty spaces instead.
counted_present_not_missing	2	The planks that are up are done. The fence needs the gaps filled.
counted_present_not_missing	3	Point to each empty space in a part. Count those, not the planks that are up.
fixed_one_part_only	1	Only that part is fixed. Look at the other parts.
fixed_one_part_only	2	The other parts still have gaps. Count the empty spaces in every part.
fixed_one_part_only	3	Count the empty spaces in all the parts. Then tap the note for each space.
parts_equal_total	1	Every part is too thin. Each part needs its full set of planks.
parts_equal_total	2	Look at the sign. It says how many planks go in each part, not how many parts.
parts_equal_total	3	Take the extra parts away. Fill a part to the top of its post.
parts_equal_per	1	You made as many parts as planks in a part. Look at the sign again.
parts_equal_per	2	The sign says how many planks go in each part. It does not say how many parts.
parts_equal_per	3	Fill a part up to the top of its post. Keep adding parts until the cart is empty.
parts_one_short	1	There are planks left in the cart. Another part is needed.
parts_one_short	2	Every part is full but the cart is not empty. Add a part for the planks that are left.
parts_one_short	3	Tap add part. Put the planks that are left on the new part.
parts_one_over	1	A part is bare. There are too many parts for the planks.
parts_one_over	2	The cart is empty but a part has nothing on it. Take that part away.
parts_one_over	3	Take a part away. Then check every part is full to the top.`;

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
    nouns: id === "pack_unit_confusion" ? NOUNS : { group: NOUNS.group, unit: NOUNS.unit },   // "pack" only when packs are in play
    template: TEMPLATES[id]?.[tier], constraint: CONSTRAINT,
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
// numbers=false only for the planner's line (D-081): the next fence's numbers stand on its own sign,
// so a count there leaks nothing; digits stay banned so the line is read, not calculated.
export function gate(text, wordlist, { numbers = true } = {}) {
  if (typeof text !== "string" || !text.trim()) return "empty";
  if (text.trim().split(/[.!?]+/).filter(s => s.trim()).length > 2) return "sentences";
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  if (/\d/.test(text) || (numbers && words.some(w => NUMBER_WORDS.has(w)))) return "number";
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
      body: JSON.stringify({ model: "claude-haiku-4-5-20251001", max_tokens: job.max_tokens, temperature: job.temperature ?? 0.4, system: job.system(),
        messages: [{ role: "user", content: JSON.stringify(payload) }],
        output_config: { format: { type: "json_schema", schema: job.schema } } }) }],
    parse: data => ({ text: data?.content?.find(b => b.type === "text")?.text ?? "",
      usage: data?.usage && { input_tokens: data.usage.input_tokens, output_tokens: data.usage.output_tokens } }),
  },
  deepseek: {
    model: "deepseek-v4-flash", usd_per_mtok: { in: 0.44, out: 1.32 },   // peak list price; off-peak is half
    request: (payload, apiKey, job = HINT_JOB) => ["https://api.deepseek.com/chat/completions", {
      method: "POST", headers: { authorization: "Bearer " + apiKey, "content-type": "application/json" },
      body: JSON.stringify({ model: "deepseek-v4-flash", max_tokens: job.max_tokens, temperature: job.temperature ?? 0.4,
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
  ordered_short: ["When fixing a broken fence, fewer planks get ordered than there are gaps. Some gaps get missed in the count.", "Point to every gap in the fence. How many did you find?"],
  ordered_over: ["When fixing a broken fence, more planks get ordered than there are gaps, so some are left over.", "Count only the gaps. Show me each one with your finger."],
  counted_present_not_missing: ["When fixing a broken fence, the planks already standing get counted instead of the gaps.", "Which planks are already there, and which spaces are empty?"],
  fixed_one_part_only: ["When fixing a broken fence, the gaps in a single part get counted and the other parts are left as they were.", "Does every part of the fence have its gaps filled?"],
  parts_equal_total: ["When sharing planks into parts, a part is made for every plank instead of full parts.", "How many planks go in each part? Show me a full one."],
  parts_equal_per: ["When sharing planks into parts, the number of planks in a part is used as the number of parts.", "Which number on the sign says how many go in each part?"],
  parts_one_short: ["When sharing planks into parts, the fence stops a part early and planks are left in the cart.", "Are there planks left over? What could you do with them?"],
  parts_one_over: ["When sharing planks into parts, a part too many gets built, so one is left bare.", "Is there a part with nothing on it? Why might that be?"],
  ambiguous: ["Every part came out short by the same amount. It is not clear yet whether the size of a part was miscounted or the two numbers were mixed up.", "Show me one part that looks finished."],
};
export const NOTE_KEYS = ["open_id", "tier", "solo", "helped", "days"];
const FENCE_NAME = /^[2-5] parts of [2-5]( \((packs|fix|share)\))?$/;
export const validNote = (b) => b && typeof b === "object" && Object.keys(b).every(k => NOTE_KEYS.includes(k))
  && (b.open_id === null || IDS.includes(b.open_id)) && [1, 2, 3].includes(b.tier)
  && [b.solo, b.helped].every(a => Array.isArray(a) && a.length <= 12 && a.every(x => FENCE_NAME.test(x)))
  && Number.isInteger(b.days) && b.days >= 0 && b.days <= 7;
// What the model is told: fence names (the parent may know the sizes), the meaning of the open
// misconception in parent words, the template question. No event log, no counts, no ids alone.
// "3 parts of 4 (packs)" -> an unambiguous object; the model once read "2 parts of 3" as two fences.
const fenceObj = (name) => { const m = /^(\d) parts of (\d)(?: \((packs|fix|share)\))?$/.exec(name);
  return { parts: +m[1], planks_in_each_part: +m[2], ordered_in_packs: m[3] === "packs",
    job: { fix: "fixing a broken fence by counting the gaps", share: "sharing the planks out into equal parts" }[m[3]] || "building the fence" }; };
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


// ---- the semantic judge: a second, colder model call that the lexical gate cannot replace ----
// The gate stops digits and number words; it cannot see a sentence that points the wrong way. After a
// rephrase passes the gate, the judge is shown the reference template and the candidate and answers
// one question. Anything but a clear yes ships the template. Fail-closed by design.
const JUDGE_SYSTEM = () => "You check a hint written for a child aged 8. The reference hint is correct. " +
  "Reply ok:true only if the candidate says the same thing as the reference, points the child to the same place, " +
  "and never tells her to pick up, move, choose or count a different pit, part, seed or plank than the reference does. " +
  "Reply ok:false otherwise.";
const JUDGE_SCHEMA = { type: "object", additionalProperties: false, required: ["ok"], properties: { ok: { type: "boolean" } } };
export const JUDGE_JOB = { system: JUDGE_SYSTEM, schema: JUDGE_SCHEMA, max_tokens: 20, temperature: 0,
  extra: " Reply with only a JSON object with the key ok." };

// -> true | false | null (null = the judge could not answer; callers treat null as a rejection)
export async function judgeHint(reference, candidate, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", timeoutMs = 1000, job = JUDGE_JOB } = {}) {
  try {
    const [url, init] = PROVIDERS[provider].request({ reference, candidate }, apiKey, job);
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return null;
    const { text } = PROVIDERS[provider].parse(await res.json());
    const out = JSON.parse(text);
    return typeof out?.ok === "boolean" ? out.ok : null;
  } catch { return null; }
}

export async function phrase(payload, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", wordlist, timeoutMs = 2000, judge = true, judgeMs = 1000 } = {}) {
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
    if (why) return fallback(why, { usage, rejected: out.text });
    if (judge) {
      const ok = await judgeHint(template, out.text.trim(), { fetchImpl, apiKey, provider, timeoutMs: judgeMs });
      if (ok !== true) return fallback(ok === false ? "judge" : "judge_unavailable", { usage, rejected: out.text });
    }
    return { text: out.text.trim(), source: "model", usage, judged: judge };
  } catch (e) {
    return fallback(e?.name === "TimeoutError" ? "timeout" : "error");
  }
}

// ---- Pip cheers: the model notices what she did right (docs/MODES.md). Booleans in, one gated
// sentence out, judged against the template it rephrases. Nothing specific to say -> no call at all.
export const CHEER_KEYS = ["first_try", "used_hint", "fixed_after_count", "mode", "chapter_done"];
export const CHEER_MODES = ["build", "packs", "fix", "share"];
export const validCheer = (b) => b && typeof b === "object" && Object.keys(b).every(k => CHEER_KEYS.includes(k))
  && CHEER_MODES.includes(b.mode) && ["first_try", "used_hint", "fixed_after_count", "chapter_done"].every(k => typeof b[k] === "boolean");
export function cheerFallback(b) {
  if (b.chapter_done) return "That was the last fence here. A new chapter is open!";
  if (b.first_try) return { fix: "You counted the gaps, not the planks. The fence is whole again.",
    share: "Every part got its full share. That is fair." }[b.mode] || "Every part right on the first try. Good counting!";
  if (b.fixed_after_count) return "You counted a full part, then fixed the short part. That is how to do it.";
  return "The fence is done.";
}
const CHEER_SYSTEM = () => "You write praise for a child aged 8 who just finished building a fence in a game, reading at a 500-word level. " +
  "Max 2 sentences. Say only what the input says she did; invent nothing. Use no numbers of any kind, no digits, no number words. " +
  "Never say wrong, bad, sad, or miss you. Call the pieces parts and planks.";
const CHEER_SCHEMA = { type: "object", additionalProperties: false, required: ["text"], properties: { text: { type: "string" } } };
export const CHEER_JOB = { system: CHEER_SYSTEM, schema: CHEER_SCHEMA, max_tokens: 80, temperature: 0.3, extra: " Reply with only a JSON object with the key text." };
// The cheer's judge asks a different question from the hint's: not "same place", but "nothing invented".
const CHEER_JUDGE_JOB = { ...JUDGE_JOB, system: () => "You check praise written for a child aged 8. The reference lists the facts. " +
  "Reply ok:true only if everything the candidate says she did is in the facts, and it claims nothing the facts do not. Warm wording is fine. Reply ok:false otherwise." };
const cheerFacts = (b) => cheerPayload(b).what_she_did.join("; ");
const cheerPayload = (b) => ({ audience: "child", age: 8, what_she_did: [
  b.chapter_done && "finished the last fence of this chapter, so the next chapter is open",
  b.first_try && "got every part right on the first try",
  !b.first_try && b.fixed_after_count && "counted a full part and then fixed the short part",
  { fix: "the job was to fix a broken fence by counting the gaps", share: "the job was to share the planks out into equal parts" }[b.mode] ].filter(Boolean),
  template: cheerFallback(b), constraint: CONSTRAINT });
export async function writeCheer(b, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", wordlist, timeoutMs = 2000, judge = true, judgeMs = 1000 } = {}) {
  const template = cheerFallback(b);
  const fallback = (reason, extra) => ({ text: template, source: "template", reason, ...extra });
  if (!b.chapter_done && !b.first_try && !b.fixed_after_count) return fallback("nothing_to_say");
  if (!apiKey) return fallback("no_key");
  try {
    const [url, init] = PROVIDERS[provider].request(cheerPayload(b), apiKey, CHEER_JOB);
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return fallback(`http_${res.status}`);
    const { text } = PROVIDERS[provider].parse(await res.json());
    let out; try { out = JSON.parse(text); } catch { return fallback("parse"); }
    if (typeof out?.text !== "string") return fallback("schema");
    const why = gate(out.text, wordlist);
    if (why) return fallback(why, { rejected: out.text });
    if (judge) {
      const ok = await judgeHint(cheerFacts(b), out.text.trim(), { fetchImpl, apiKey, provider, timeoutMs: judgeMs, job: CHEER_JUDGE_JOB });
      if (ok !== true) return fallback(ok === false ? "judge" : "judge_unavailable", { rejected: out.text });
    }
    return { text: out.text.trim(), source: "model", judged: judge };
  } catch (e) { return fallback(e?.name === "TimeoutError" ? "timeout" : "error"); }
}
// browser side: never throws, never blocks the star
export async function cheer(b, { timeoutMs = 3500, fetchImpl = globalThis.fetch } = {}) {
  try {
    const res = await fetchImpl("/api/cheer", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(b), signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) { const out = await res.json(); if (typeof out?.text === "string" && out.text) return out; }
  } catch {}
  return { text: cheerFallback(b), source: "template" };
}

// ---- Pip plans the next fence (D-081): the model chooses among fences code already allows ----
// The record is booleans, counts of hints and fence names; the choices are pre-filtered by code
// (fence.mjs candidates). The model's one line of "why" goes through the gate and the facts judge.
// Any failure -> node null, and the page uses code's own next().
const NODE = /^[2-5]x[2-5]_(concrete|packs|fix|share)$/;
export const PLAN_KEYS = ["mastery", "history", "last"];
export const validPlan = (b) => b && typeof b === "object" && Object.keys(b).every(k => PLAN_KEYS.includes(k))
  && b.mastery && typeof b.mastery === "object" && Object.entries(b.mastery).every(([k, v]) => NODE.test(k) && [0, 0.5, 1].includes(v)) && Object.keys(b.mastery).length <= 24
  && Array.isArray(b.history) && b.history.length <= 8 && b.history.every(h => h && typeof h === "object" && NODE.test(h.node)
    && Array.isArray(h.ids) && h.ids.length <= 4 && h.ids.every(i => IDS.includes(i)) && Number.isInteger(h.hints) && h.hints >= 0 && h.hints <= 9
    && typeof h.first_try === "boolean" && typeof h.fixed_after_count === "boolean")
  && b.last && typeof b.last === "object" && NODE.test(b.last.node) && (b.last.id === "correct" || IDS.includes(b.last.id));
const JOBS = { concrete: "building the fence", packs: "ordering packs, then building", fix: "fixing a broken fence by counting the gaps", share: "sharing the planks out into parts" };
export const describe = (node) => { const m = /^(\d)x(\d)_(\w+)$/.exec(node); return { node, parts: +m[1], planks_in_each_part: +m[2], job: JOBS[m[3]] }; };
const PLAN_SYSTEM = () => "You plan the next practice fence for a child aged 8 in a counting game. Pick exactly one of the choices, by its node key. " +
  "Choose the fence that best helps her practise what went wrong last time. After repeated trouble prefer a smaller fence of the same kind; " +
  "after a first-try success prefer a bigger fence or a new kind; do not repeat the very same fence more than twice in a row. " +
  "Then write one short line telling her why you picked it, in plain words a young child reads: say only what is true from the input, no digits, and never the words wrong, bad or sad.";
const PLAN_SCHEMA = { type: "object", additionalProperties: false, required: ["node", "why"], properties: { node: { type: "string" }, why: { type: "string" } } };
export const PLAN_JOB = { system: PLAN_SYSTEM, schema: PLAN_SCHEMA, max_tokens: 100, temperature: 0.2, extra: " Reply with only a JSON object with the keys node and why." };
const meaning = (id) => id === "correct" ? "finished with no mistake" : PARENT_WORDS[id]?.[0] ?? id;
export function planPayload(b, choices) {
  return { audience: "planner", child_age: 8,
    last_fence: { ...describe(b.last.node), what_happened: meaning(b.last.id) },
    recent_fences_oldest_first: b.history.map(h => ({ ...describe(h.node), first_try: h.first_try, hints: h.hints, fixed_after_count: h.fixed_after_count, what_happened: h.ids.map(meaning) })),
    choices: choices.map(describe) };
}
// What the judge is told is true: the size of the next fence against the last, its kind, and what
// happened last time. The model may say these warmly; it may not add anything else.
function planFacts(b, node) {
  const a = describe(b.last.node), n = describe(node), cmp = (x, y, w) => x === y ? `the same number of ${w}` : x > y ? `more ${w}` : `fewer ${w}`;
  const last = b.history.at(-1), went = b.last.id === "correct" ? (last?.first_try ? "she got it right on the first try" : "she finished it" + (last?.hints ? " after some help" : ""))
    : `${meaning(b.last.id).replace(/\.$/, "").toLowerCase()}${last?.fixed_after_count ? "; she then counted and fixed it" : ""}`;
  return `The next fence is ${n.job}${n.job === a.job ? " (the same kind as last time)" : " (a new kind)"}, with ${cmp(n.parts, a.parts, "parts")} and ${cmp(n.planks_in_each_part, a.planks_in_each_part, "planks in each part")} than the last one. ` +
    `Last time: ${went}. Praise and encouragement are fine.`;
}
export async function writePlan(b, choices, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", wordlist, timeoutMs = 2500, judge = true, judgeMs = 1000 } = {}) {
  const fallback = (reason, extra) => ({ node: null, why: "", source: "template", reason, ...extra });
  if (!choices.length) return fallback("no_choices");
  if (choices.length === 1) return { node: choices[0], why: "", source: "code", reason: "one_choice" };
  if (!apiKey) return fallback("no_key");
  try {
    const [url, init] = PROVIDERS[provider].request(planPayload(b, choices), apiKey, PLAN_JOB);
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return fallback(`http_${res.status}`);
    const { text } = PROVIDERS[provider].parse(await res.json());
    let out; try { out = JSON.parse(text); } catch { return fallback("parse"); }
    if (typeof out?.node !== "string" || typeof out?.why !== "string") return fallback("schema");
    if (!choices.includes(out.node)) return fallback("choice", { rejected: out.node });          // the pick must be one code allows
    const why = gate(out.why, wordlist, { numbers: false });
    if (why) return { node: out.node, why: "", source: "model", reason: why, rejected: out.why };  // the pick stands; the line does not
    if (judge) {
      const ok = await judgeHint(planFacts(b, out.node), out.why.trim(), { fetchImpl, apiKey, provider, timeoutMs: judgeMs, job: CHEER_JUDGE_JOB });
      if (ok !== true) return { node: out.node, why: "", source: "model", reason: ok === false ? "judge" : "judge_unavailable", rejected: out.why };
    }
    return { node: out.node, why: out.why.trim(), source: "model", judged: judge };
  } catch (e) { return fallback(e?.name === "TimeoutError" ? "timeout" : "error"); }
}
// browser side: never throws; node null means "use next()"
export async function plan(b, { timeoutMs = 4000, fetchImpl = globalThis.fetch } = {}) {
  try {
    const res = await fetchImpl("/api/plan", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(b), signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) { const out = await res.json(); if (out && typeof out === "object") return out; }
  } catch {}
  return { node: null, why: "", source: "template", reason: "network" };
}

// ---- Pip shows her (D-082): the model writes moves, not words; code simulates them first ----
// The payload carries the real counts: the output is a script, and the only words in it (say) go
// through the gate with numbers banned, so a count cannot leak as text. No judge: the simulation in
// fence.mjs validShow() is a stronger check than a second model call would be.
export const SHOW_KEYS = ["per", "parts", "cart", "misconception_id", "tier"];
export const validShowBody = (b) => b && typeof b === "object" && Object.keys(b).every(k => SHOW_KEYS.includes(k))
  && Number.isInteger(b.per) && b.per >= 2 && b.per <= 5 && Array.isArray(b.parts) && b.parts.length >= 1 && b.parts.length <= 8
  && b.parts.every(n => Number.isInteger(n) && n >= 0 && n <= 8) && Number.isInteger(b.cart) && b.cart >= 0 && b.cart <= 40
  && IDS.includes(b.misconception_id) && [1, 2, 3].includes(b.tier);
const SHOW_SYSTEM = () => "You are Pip, a helper in a fence-building game for a child aged 8. Every part of the fence must hold exactly planks_in_each_part planks. " +
  "Write a worked example as a list of moves on her actual fence: point (at a part), count (the planks on a part, aloud), place (one plank from the cart onto a part), remove (one plank from a part back to the cart), say (one short line). " +
  "Fix exactly one part, the one that best shows her mistake; leave the other parts for her. Never put more planks on a part than planks_in_each_part. At most twelve moves and three say lines. " +
  "Say lines use no numbers of any kind, no digits, no number words, and never the words wrong, bad or sad. The last move is a say line that hands the rest back to her.";
const SHOW_SCHEMA = { type: "object", additionalProperties: false, required: ["steps"], properties: { steps: { type: "array", items: { type: "object", additionalProperties: false, required: ["op"],
  properties: { op: { type: "string", enum: ["point", "count", "place", "remove", "say"] }, part: { type: "integer" }, text: { type: "string" } } } } } };
export const SHOW_JOB = { system: SHOW_SYSTEM, schema: SHOW_SCHEMA, max_tokens: 400, temperature: 0.2, extra: " Reply with only a JSON object with the key steps, an array of {op, part?, text?}." };
export const showPayload = (b) => ({ planks_in_each_part: b.per, planks_on_each_part_now: b.parts, planks_in_cart: b.cart,
  what_went_wrong: PARENT_WORDS[b.misconception_id]?.[0] ?? "", parts_are_numbered_from: 0 });
export async function writeShow(b, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", wordlist, timeoutMs = 4000, valid, fallback: codeScript } = {}) {
  const fallback = (reason, extra) => ({ steps: codeScript ? codeScript(b) : [], source: "template", reason, ...extra });
  if (!apiKey) return fallback("no_key");
  try {
    const [url, init] = PROVIDERS[provider].request(showPayload(b), apiKey, SHOW_JOB);
    const res = await fetchImpl(url, { ...init, signal: AbortSignal.timeout(timeoutMs) });
    if (!res.ok) return fallback(`http_${res.status}`);
    const { text } = PROVIDERS[provider].parse(await res.json());
    let out; try { out = JSON.parse(text); } catch { return fallback("parse"); }
    const steps = out?.steps;
    if (valid && !valid(steps, b)) return fallback("simulation", { rejected: steps });
    for (const st of steps) if (st.op === "say") { const why = gate(st.text, wordlist); if (why) return fallback(why, { rejected: st.text }); }
    return { steps, source: "model" };
  } catch (e) { return fallback(e?.name === "TimeoutError" ? "timeout" : "error"); }
}
// browser side: never throws; empty steps means "nothing to show"
export async function show(b, { timeoutMs = 6000, fetchImpl = globalThis.fetch } = {}) {
  try {
    const res = await fetchImpl("/api/show", { method: "POST", headers: { "content-type": "application/json" },
      body: JSON.stringify(b), signal: AbortSignal.timeout(timeoutMs) });
    if (res.ok) { const out = await res.json(); if (Array.isArray(out?.steps)) return out; }
  } catch {}
  return { steps: [], source: "template", reason: "network" };
}
