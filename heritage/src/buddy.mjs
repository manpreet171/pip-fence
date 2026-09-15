// buddy.mjs — the hint layer. Isomorphic: no top-level DOM or Node access, so the browser imports
// TEMPLATES / payload() / hint() / gate() and the server imports phrase(). See docs/BUDDY-CONTRACT.md.
//
// Code owns truth (sow.mjs classify picks id + tier). The model only PHRASES a template it is
// handed, from a payload that contains no integer derived from the board — it cannot leak a pit
// number or a seed count it was never given. Any failure anywhere → the template ships.

export const IDS = ["correct", "counted_start_pit", "overshot_by_one", "stopped_at_corner", "stopped_at_first_lap",
  "direction_reversed", "miscounted_seeds", "guessing", "ambiguous"];

// Mirror of data/hints.txt (the source of truth; evals/run_all.py asserts set-equality).
// The browser cannot read a file, hence the copy.
const HINTS = `correct	1	The last seed landed on your marker. That was the right call.
correct	2	Your marker was on the pit where the last seed landed. Keep counting like that.
correct	3	Your call and the last seed met in the same pit. Sow the next turn the same way.
counted_start_pit	1	Your marker is a pit early. The pit you pick up does not get a seed.
counted_start_pit	2	The first seed goes in the pit after the pit you picked up. Start counting there.
counted_start_pit	3	Put your hand on the pit you picked up. The first seed goes in the next pit, so count from there.
overshot_by_one	1	Your marker is a pit late. The last seed landed before it.
overshot_by_one	2	Count the seeds in your hand again. The last seed stops where the seeds run out.
overshot_by_one	3	Put a seed in the next pit each time you count. When your hand is empty, that pit is the last pit.
stopped_at_corner	1	Your marker is on the corner. The seeds keep going round the corner.
stopped_at_corner	2	The row ends at the corner, but the seeds do not stop there. Look at the other row.
stopped_at_corner	3	Count up to the corner, then keep counting into the other row. The seeds go round.
stopped_at_first_lap	1	Your marker is where the first sowing ended. That pit had seeds in it, so the sowing went on.
stopped_at_first_lap	2	When the last seed lands in a pit with seeds, pick that pit up and keep sowing. Look where the next sowing ends.
stopped_at_first_lap	3	Sow to the first pit in your head, then pick it up and sow again. Your marker goes where the last seed of that sowing lands.
direction_reversed	1	Your marker is the other way from the pit you picked up. The seeds always go round the same way.
direction_reversed	2	Look at which way the seeds went on your last turn. They go that way every turn.
direction_reversed	3	Put your hand on the pit you picked up. The first seed goes in the next pit along the way the seeds go.
miscounted_seeds	1	Your marker is on the path, but not where the last seed landed. Count the seeds in your hand again.
miscounted_seeds	2	Look at the seeds in your hand. Say each seed as you point along the pits.
miscounted_seeds	3	Point at a pit for every seed in your hand, starting with the next pit. The last seed shows you the pit.
guessing	1	Your marker is far from where the seeds landed. Count before you call.
guessing	2	Look at the seeds in your hand first. Then point along the pits before you call.
guessing	3	Put your hand on the pit you picked up. Point to the next pit for each seed, and call the last pit.
ambiguous	1	Show me where your first seed goes.
ambiguous	2	Point to the pit where your first seed goes. Then we will count on from there.
ambiguous	3	Put your hand on the pit you picked up. Now tap the pit where the first seed goes.`;

export const TEMPLATES = {};
for (const line of HINTS.split("\n")) {
  const [id, tier, text] = line.split("\t");
  (TEMPLATES[id] ??= {})[+tier] = text;
}

const READING_LEVEL = "500-word list, max 2 sentences";
const CONSTRAINT = "Use no numbers of any kind. Point with words, not digits.";
const NOUNS = { unit: "seed", place: "pit", marker: "marker" };
export const SHAPE_KEYS = ["early", "late", "by_one", "past_corner", "reversed", "relay"];

// The redacted payload of CONCEPT §6 from already-boolean shape facts. Server-side the body is
// rebuilt through this from the validated {id, tier, shape} so the client's template/nouns text is
// never forwarded to the model.
export function redact(id, tier, shape) {
  return {
    age: 8, reading_level: READING_LEVEL, misconception_id: id, tier,
    shape: Object.fromEntries(SHAPE_KEYS.map(k => [k, !!shape[k]])),
    nouns: NOUNS, template: TEMPLATES[id]?.[tier], constraint: CONSTRAINT,
  };
}

// result = classify() output {id, tier, confirmed, called, landed, path, node}. The shape is fixed by
// the id (ENGINE-CONTRACT: "derived from the id"); miscounted_seeds adds which side of the landing the
// marker sits — a comparison of two path positions, so a boolean, never the distance or a pit number.
const SHAPE_OF = { counted_start_pit: ["early", "by_one"], overshot_by_one: ["late", "by_one"], stopped_at_corner: ["early", "past_corner"],
  stopped_at_first_lap: ["early", "relay"], direction_reversed: ["reversed"] };
export function payload(result) {
  const on = new Set(SHAPE_OF[result?.id] || []);
  if (result?.id === "miscounted_seeds" && Array.isArray(result.path)) on.add(result.path.indexOf(result.called) < result.path.indexOf(result.landed) ? "early" : "late");
  return redact(result?.id, result?.tier, Object.fromEntries(SHAPE_KEYS.map(k => [k, on.has(k)])));
}

// ---- the output gate (lexical; CONCEPT §6 says exactly what it does and does not protect) ----
export const NUMBER_WORDS = new Set(["zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "fifteen", "twenty", "hundred", "dozen", "half", "twice", "once", "single",
  "pair", "couple", "both", "double",
  "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth", "eleventh", "twelfth"]);   // ordinals name a position and leak the count; "first" stays allowed (HD-008)
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
// same template fallback either way; the gate is what makes the output safe, not the vendor.
const SYSTEM = () => "You phrase one hint for a child aged 8 reading at a 500-word level. Max 2 sentences. " +
  "Never tell her which pit to pick up or to move seeds; only say where to look or what to count again. " +
  "Use no numbers of any kind — no digits, no number words. Never state or imply how many. Point with words. " +
  "Never say sad, disappointed, or miss you.";
const SCHEMA = { type: "object", additionalProperties: false, required: ["tier", "misconception_id", "text"],
  properties: { tier: { type: "integer", enum: [1, 2, 3] }, misconception_id: { type: "string", enum: IDS }, text: { type: "string" } } };

// A job = system prompt + strict schema + token budget. Two jobs share the providers: the child's
// hint (60 tokens, no numbers) and the parent's weekly note (CONCEPT §6: AI pointed at the adult).
export const HINT_JOB = { system: SYSTEM, schema: SCHEMA, max_tokens: 120, temperature: 0.2,
  extra: " Reply with only a JSON object with the keys tier, misconception_id and text. Copy tier and misconception_id from the input exactly." };
const NOTE_SYSTEM = (open = true) => "You write a short weekly note to a parent about their child, aged about 8, who is learning to " +
  "count on around a ring of pits in a sowing game: she calls the pit where the last seed will land before the seeds move. " +
  "Plain words a parent can read in ten seconds. Warm, specific, never blaming. " +
  "Do not use the words wrong, bad, lazy, slow, behind, struggling, failed. Do not name the game's internal labels. " +
  "Mention only what the input lists; invent nothing. Call the pieces seeds and pits, never holes or beads; call each game a board, never a level. " +
  (open
    ? "note: at most three sentences and sixty words, saying what the child did and what they are still working on. "
    : "note: at most two sentences and forty words, saying what the child did. Nothing is open: do not mention anything they are still working on, practising, or should do next. ") +
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

// ---- the parent note: the same architecture pointed at the adult (CONCEPT §6, Tutor CoPilot shape) ----
// Plain words per misconception, and the one thing to ask out loud. These are the fallback AND the
// meaning the model is given; the model never sees the child's board or the game's ids alone.
export const PARENT_WORDS = {
  correct: ["The calls are landing where the last seed lands. Counting on round the ring is working.", "Put some stones in a row. Start on the middle one and count on by the stones in your hand — where do you land?"],
  counted_start_pit: ["The call comes out a pit early. The pit the seeds are picked up from is being counted as the first drop, so every call stops a pit short.", "Put some stones in a row and pick one up. Which stone does the first seed go on — the one you picked up, or the next one?"],
  overshot_by_one: ["The call comes out a pit late. The seeds run out a pit before the marker, so the hand is being counted as holding one seed more than it does.", "Take a few stones in your hand. Drop them one at a time along a row and tell me where the last one goes."],
  stopped_at_corner: ["The call stops at the end of the row. The seeds keep going round the corner into the other row, and the count stops at the corner instead of following them.", "Put stones in a ring, not a line. Start on one and count on — what happens when you reach the end of the row?"],
  stopped_at_first_lap: ["On relay levels the call stops where the first sowing ends. When the last seed lands in a pit that already has seeds, that pit is picked up and sown again, and the second sowing is not being counted.", "Sow a handful of stones into a row of bowls. If the last one lands in a bowl with stones in it, what happens next?"],
  direction_reversed: ["The call is the right distance but the other way round. The seeds always go the same way round the board, and the count is going the opposite way.", "Which way do the seeds go round the board? Show me with your finger."],
  miscounted_seeds: ["The call is on the path but a few pits off. The seeds in the hand are being counted as more, or fewer, than there are.", "Put some stones in a row. Start on one and count on — where do you land?"],
  guessing: ["The last few calls were not counted at all; they landed nowhere near the seeds. The game goes quiet when this happens, so the marker says nothing until counting starts again.", "Pick up a handful of stones. Before you drop them, tell me where the last one will go — then check."],
  ambiguous: ["The call is a pit short, and it is not clear yet whether the picked-up pit was counted as the first drop or the count stopped at the corner. The game asks her to show where the first seed goes.", "Pick up a handful of stones. Show me where the first one goes."],
};
export const NOTE_KEYS = ["open_id", "tier", "solo", "helped", "days"];
const LEVEL_NAME = /^[2346] seeds a pit(, with a relay)?$/;
export const validNote = (b) => b && typeof b === "object" && Object.keys(b).every(k => NOTE_KEYS.includes(k))
  && (b.open_id === null || IDS.includes(b.open_id)) && [1, 2, 3].includes(b.tier)
  && [b.solo, b.helped].every(a => Array.isArray(a) && a.length <= 12 && a.every(x => LEVEL_NAME.test(x)))
  && Number.isInteger(b.days) && b.days >= 0 && b.days <= 7;
// What the model is told: level names (the parent may know the seed counts), the meaning of the open
// misconception in parent words, the template question. No event log, no board, no ids alone.
// "3 seeds a pit, with a relay" -> an unambiguous object; a bare name once read as a count of levels.
const levelObj = (name) => { const m = /^(\d) seeds a pit(, with a relay)?$/.exec(name);
  return { seeds_in_each_pit: +m[1], with_a_relay: !!m[2] }; };
export function notePayload(b) {
  return { audience: "parent", child_age: 8, days_played_this_week: b.days,
    levels_finished_without_a_hint: { how_many_levels: b.solo.length, levels: b.solo.map(levelObj) },
    levels_finished_with_a_hint: { how_many_levels: b.helped.length, levels: b.helped.map(levelObj) },
    still_working_on: b.open_id ? { what_happens: PARENT_WORDS[b.open_id][0], hints_reached: b.tier } : null,
    suggested_question: b.open_id ? PARENT_WORDS[b.open_id][1] : "Show me how the seeds go round the board." };
}
const BLAME = /\b(wrong|bad|lazy|slow|behind|struggling|failed|fail|stupid)\b/i;
export function noteGate(out, open = true, levels = 1) {
  if (!out || typeof out.note !== "string" || typeof out.question !== "string") return "schema";
  if (levels === 0 && /\b(finished|completed|mastered|won|cleared|got through)\b/i.test(out.note)) return "invented";   // a thin week is not a finished level
  if (!open && /\b(still|working on|practi[cs]|keep|next|needs? to|improve|struggl)/i.test(out.note)) return "invented";
  if (out.note.trim().split(/[.!?]+/).filter(s => s.trim()).length > 3) return "sentences";
  // "one thing to ask out loud" may be an instruction ("Show me where the first one goes.") or a question; never a speech.
  const q = out.question.trim();
  if (!q || q.split(/[.!?]+/).filter(x => x.trim()).length > 2 || (q.match(/\?/g) || []).length > 1) return "question";
  if (BLAME.test(out.note) || BLAME.test(out.question)) return "blame";
  if (/_/.test(out.note + out.question)) return "labels";
  if (/\b(holes?|beads?|levels?)\b/i.test(out.note + out.question)) return "vocab";   // the child hears "pit" and "seed"; the parent must too
  if (out.note.length > 520 || out.question.length > 160) return "length";
  return null;
}
export function noteFallback(b) {
  const done = b.solo.length + b.helped.length;
  const W = ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];
  const note = (done ? `This week ${done === 1 ? "one board was finished" : (W[done] || "many") + " boards were finished"}${b.helped.length ? (b.solo.length ? ", some with a hint" : ", with a hint") : ""}. ` : "No board was finished this week yet. ")
    + (b.open_id ? PARENT_WORDS[b.open_id][0] : "Nothing is open right now.");
  return { note, question: b.open_id ? PARENT_WORDS[b.open_id][1] : "Show me how the seeds go round the board." };
}
export async function writeNote(b, { fetchImpl = globalThis.fetch, apiKey, provider = "anthropic", timeoutMs = 6000 } = {}) {
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
export async function note(b, { timeoutMs = 7000, fetchImpl = globalThis.fetch } = {}) {
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
