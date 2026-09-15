// Unit checks for the hint layer with an injected fake fetch. Zero deps. Exit 1 on any failure.
// Run: node heritage/evals/buddy_test.mjs
import { readFileSync, existsSync } from "node:fs";
import { IDS, TEMPLATES, SHAPE_KEYS, payload, hint, phrase, gate, request, parseWordlist } from "../src/buddy.mjs";
import { runOne, summarise } from "./latency_cost.mjs";

const root = new URL("../", import.meta.url);
const wordlist = parseWordlist(readFileSync(new URL("data/wordlist.txt", root), "utf8"));

// AbortSignal.timeout's timer is unref'd in Node; with nothing else pending the process would exit
// before it fires. A server has its socket; the test needs this.
const keepAlive = setInterval(() => {}, 1000);
let fails = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : "  -- " + detail}`); if (!ok) fails++; };

// ---- fakes ----
const P = { misconception_id: "counted_start_pit", tier: 1 };
const TPL = TEMPLATES.counted_start_pit[1];
const modelReply = (text, extra = {}) => async () => ({ ok: true, status: 200, json: async () => ({
  content: [{ type: "text", text: JSON.stringify({ tier: 1, misconception_id: P.misconception_id, text, ...extra }) }],
  usage: { input_tokens: 400, output_tokens: 60 } }) });
const hangs = () => (url, init) => new Promise((_, rej) => init.signal.addEventListener("abort", () => rej(init.signal.reason)));
const ph = (fetchImpl) => phrase(P, { fetchImpl, apiKey: "k", wordlist, timeoutMs: 50 });

// ---- phrase(): the gate, in order ----
let r = await ph(modelReply("Look at the pit you picked up. The first seed goes in the next pit."));
check("valid model JSON passes -> source model", r.source === "model" && r.text === "Look at the pit you picked up. The first seed goes in the next pit.", JSON.stringify(r));
check("usage parsed from API fields", r.usage?.input_tokens === 400 && r.usage?.output_tokens === 60);
r = await ph(modelReply("The last seed lands in pit 4."));
check("digit '4' rejected -> template", r.source === "template" && r.reason === "number" && r.text === TPL, r.reason);
r = await ph(modelReply("You have six seeds in your hand."));
check("number word 'six' rejected -> template", r.source === "template" && r.reason === "number", r.reason);
r = await ph(modelReply("It is early. Move the marker. Then look again."));
check("3 sentences rejected -> template", r.source === "template" && r.reason === "sentences", r.reason);
r = await ph(modelReply("That call is sad and early. Count it again."));
check("'sad' rejected -> template", r.source === "template" && r.reason === "affect", r.reason);
r = await ph(modelReply("Inspect the erroneous trajectory. Recalibrate it."));
check("too many out-of-list words rejected -> template", r.source === "template" && r.reason === "vocab", r.reason);
r = await ph(modelReply("Look at the pit you picked up.", { extra: 1 }));
check("extra schema key rejected -> template", r.source === "template" && r.reason === "schema", r.reason);
r = await ph(async () => { throw new Error("boom"); });
check("fetch throws -> template", r.source === "template" && r.reason === "error" && r.text === TPL, r.reason);
r = await ph(hangs());
check("fetch hangs past timeoutMs -> template (timeout)", r.source === "template" && r.reason === "timeout", r.reason);
r = await ph(async () => ({ ok: false, status: 529, json: async () => ({}) }));
check("non-200 -> template", r.source === "template" && r.reason === "http_529", r.reason);
r = await phrase(P, { fetchImpl: modelReply("x"), wordlist });
check("no apiKey -> template reason no_key (offline path)", r.source === "template" && r.reason === "no_key" && r.text === TPL, r.reason);

// ---- the exact Haiku request ----
const [url, init] = request(P, "sk-test");
const body = JSON.parse(init.body);
check("request: url/model/max_tokens/temperature/headers", url === "https://api.anthropic.com/v1/messages"
  && body.model === "claude-haiku-4-5-20251001" && body.max_tokens === 120 && body.temperature === 0.2
  && init.headers["anthropic-version"] === "2023-06-01" && init.headers["x-api-key"] === "sk-test");
check("request: json_schema format, no effort, no thinking", body.output_config?.format?.type === "json_schema"
  && body.output_config.format.schema.additionalProperties === false && !("effort" in body.output_config) && !("thinking" in body));
check("request: system prompt has no answer and forbids numbers", /no numbers/.test(body.system) && !/\d/.test(body.system.replace(/aged 8|500-word|2 sentences/g, "")));

// ---- hint(): browser side, never throws ----
const R1 = { id: "counted_start_pit", tier: 1, confirmed: true, called: 3, landed: 4, path: [1, 2, 3, 4], node: "4_single" };
const srv = (out, ok = true, status = 200) => async () => ({ ok, status, json: async () => out });
r = await hint(R1, { fetchImpl: srv({ text: "Look at the pit you picked up.", source: "model" }) });
check("hint: server model hint passes through", r.source === "model" && r.text === "Look at the pit you picked up.");
r = await hint(R1, { fetchImpl: srv({ text: TPL, source: "template", reason: "no_key" }) });
check("hint: server fallback -> template", r.source === "template" && r.text === TPL);
r = await hint(R1, { fetchImpl: srv("x", false, 500) });
check("hint: non-200 -> template", r.source === "template" && r.text === TPL);
r = await hint(R1, { fetchImpl: async () => { throw new TypeError("network"); } });
check("hint: network error -> template", r.source === "template" && r.text === TPL);
r = await hint(R1, { fetchImpl: hangs(), timeoutMs: 50 });
check("hint: hang past timeoutMs -> template", r.source === "template" && r.reason === "timeout" && r.text === TPL);
let threw = false;
try { r = await hint(null, { fetchImpl: srv({}) }); } catch { threw = true; }
check("hint: garbage input never throws", !threw && r.source === "template");

// ---- payload(): no integer from the board survives, across every fixture ----
// Preferred: the engine's own fixtures through classify(). If the engine is not written yet, a
// hand-built list of classify()-shaped results covering every id and shape (real pit numbers and
// paths, which is what must not leak).
let results, sweep;
if (existsSync(new URL("evals/classifier_eval.mjs", root)) && existsSync(new URL("src/sow.mjs", root))) {
  const { classify } = await import("../src/sow.mjs");
  const { expand } = await import("./classifier_eval.mjs");
  const { fixtures } = JSON.parse(readFileSync(new URL("evals/classifier_fixtures.json", root), "utf8"));
  results = fixtures.map(f => classify(expand(f.node, f.seq))); sweep = `${fixtures.length} engine fixtures`;
} else {
  const mk = (id, tier, called, landed, path, node) => ({ id, tier, confirmed: true, called, landed, path, node, flags: [] });
  results = [
    mk("correct", 1, 4, 4, [1, 2, 3, 4], "4_single"), mk("correct", 2, 13, 13, [8, 9, 10, 11, 12, 13], "6_single"), mk("correct", 3, 0, 0, [11, 12, 13, 0], "4_single"),
    mk("counted_start_pit", 1, 3, 4, [1, 2, 3, 4], "4_single"), mk("counted_start_pit", 2, 7, 8, [3, 4, 5, 6, 7, 8], "6_single"), mk("counted_start_pit", 3, 13, 0, [12, 13, 0], "3_single"),
    mk("overshot_by_one", 1, 5, 4, [1, 2, 3, 4], "4_single"), mk("overshot_by_one", 2, 9, 8, [3, 4, 5, 6, 7, 8], "6_single"), mk("overshot_by_one", 3, 1, 0, [12, 13, 0], "3_single"),
    mk("stopped_at_corner", 1, 6, 8, [5, 6, 7, 8], "4_single"), mk("stopped_at_corner", 2, 13, 2, [11, 12, 13, 0, 1, 2], "6_single"), mk("stopped_at_corner", 3, 6, 9, [4, 5, 6, 7, 8, 9], "6_single"),
    mk("stopped_at_first_lap", 1, 4, 8, [2, 3, 4, 5, 6, 7, 8], "3_relay"), mk("stopped_at_first_lap", 2, 8, 13, [5, 6, 7, 8, 9, 10, 11, 12, 13], "4_relay"), mk("stopped_at_first_lap", 3, 12, 3, [10, 11, 12, 13, 0, 1, 2, 3], "3_relay"),
    mk("direction_reversed", 1, 12, 4, [1, 2, 3, 4], "4_single"), mk("direction_reversed", 2, 10, 8, [3, 4, 5, 6, 7, 8], "6_single"), mk("direction_reversed", 3, 4, 10, [8, 9, 10], "3_single"),
    mk("miscounted_seeds", 1, 2, 4, [1, 2, 3, 4], "4_single"), mk("miscounted_seeds", 2, 4, 8, [3, 4, 5, 6, 7, 8], "6_single"), mk("miscounted_seeds", 3, 6, 4, [1, 2, 3, 4, 5, 6], "6_single"),
    mk("guessing", 1, 11, 4, [1, 2, 3, 4], "4_single"), mk("guessing", 2, 0, 8, [3, 4, 5, 6, 7, 8], "6_single"), mk("guessing", 3, 9, 4, [1, 2, 3, 4], "4_single"),
    mk("ambiguous", 1, 6, 7, [5, 6, 7], "2_single"), mk("ambiguous", 2, 13, 0, [12, 13, 0], "2_single"), mk("ambiguous", 3, 6, 7, [4, 5, 6, 7], "3_single"),
    mk("miscounted_seeds", 1, 0, 3, [11, 12, 13, 0, 1, 2, 3], "6_single"), mk("counted_start_pit", 1, 6, 7, [4, 5, 6, 7], "3_single"), mk("overshot_by_one", 1, 8, 7, [4, 5, 6, 7], "3_single"),
  ].map(x => ({ ...x, confirmed: x.id !== "ambiguous" }));
  sweep = `${results.length} hand-built results (engine not present yet)`;
}
let digitLeaks = 0, keyLeaks = 0;
for (const res of results) {
  const p = payload(res);
  const { age, tier, reading_level, ...rest } = p;   // the only fixed fields allowed to hold a digit
  if (/\d/.test(JSON.stringify(rest))) digitLeaks++;
  if (age !== 8 || ![1, 2, 3].includes(tier) || reading_level !== "500-word list, max 2 sentences") keyLeaks++;
  if (Object.keys(p.shape).length !== 6 || !SHAPE_KEYS.every(k => typeof p.shape[k] === "boolean")) keyLeaks++;
}
check(`payload: no digit outside age/tier/reading_level over ${sweep}`, digitLeaks === 0, `${digitLeaks} leaks`);
check("payload: fixed fields exact, shape has 6 boolean keys", keyLeaks === 0, `${keyLeaks} bad`);
check("payload: counted_start_pit -> early + by_one only", JSON.stringify(payload(R1).shape) ===
  JSON.stringify({ early: true, late: false, by_one: true, past_corner: false, reversed: false, relay: false }), JSON.stringify(payload(R1).shape));
const early = payload({ id: "miscounted_seeds", tier: 1, called: 2, landed: 4, path: [1, 2, 3, 4] }).shape, late = payload({ id: "miscounted_seeds", tier: 1, called: 6, landed: 4, path: [1, 2, 3, 4, 5, 6] }).shape;
check("payload: miscounted_seeds carries only the side of the landing", early.early && !early.late && !early.by_one && late.late && !late.early, JSON.stringify([early, late]));
check("payload: template is TEMPLATES[id][tier]", payload(R1).template === TPL);

// ---- TEMPLATES coverage and the gate on the templates themselves ----
check("TEMPLATES covers 9 ids x 3 tiers", IDS.length === 9 && IDS.every(id => [1, 2, 3].every(t => typeof TEMPLATES[id]?.[t] === "string" && TEMPLATES[id][t])));
check("every template passes gate()", IDS.every(id => [1, 2, 3].every(t => gate(TEMPLATES[id][t], wordlist) === null)));
check("gate: 'one'/'both'/'second' are number words", ["Add one seed.", "Both rows.", "The second pit."].every(t => gate(t, wordlist) === "number"));
check("gate: 'wrong' and 'miss you' are affect words", gate("That is wrong.", wordlist) === "affect" && gate("I miss you.", wordlist) === "affect");

// ---- latency_cost parsing with the fake fetch ----
const row = await runOne(P, { fetchImpl: modelReply("Look at that pit again."), apiKey: "k", wordlist });
const s = summarise([row, { ...row, ms: 900, source: "template" }]);
check("latency_cost: runOne records ms/tokens/source", row.source === "model" && row.in === 400 && row.out === 60 && row.ms >= 0);
check("latency_cost: summarise p50/p95/$ and gate pass rate", s.p95 === 900 && s.pass === 0.5 && Math.abs(s.usd - (400 * 1 + 60 * 5) / 1e6) < 1e-12, JSON.stringify(s));

// ---- the parent note: same discipline pointed at the adult ----
{
  const { validNote, notePayload, noteGate, writeNote, noteFallback } = await import("../src/buddy.mjs");
  const B = { open_id: "counted_start_pit", tier: 2, solo: ["2 seeds a pit", "3 seeds a pit"], helped: ["3 seeds a pit, with a relay"], days: 3 };
  check("note: valid summary accepted", validNote(B));
  check("note: unknown key rejected", !validNote({ ...B, name: "Aanya" }));
  check("note: bad level name rejected", !validNote({ ...B, solo: ["<script>"] }) && !validNote({ ...B, solo: ["5 seeds a pit"] }));
  check("note: payload carries no internal id and no event log", !JSON.stringify(notePayload(B)).includes("counted_start") && !("events" in notePayload(B)));
  const noteReply = (o) => async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) });
  const wn = (f) => writeNote(B, { fetchImpl: f, apiKey: "k", timeoutMs: 50 });
  let n = await wn(noteReply({ note: "Two levels were finished on their own this week. The call that stops a pit short is the one to watch.", question: "Which pit does the first seed go in?" }));
  check("note: good model note passes -> source model", n.source === "model" && n.question.endsWith("?"), JSON.stringify(n));
  n = await wn(noteReply({ note: "Fine. Fine. Fine. Fine.", question: "Ok?" }));
  check("note: four sentences -> template", n.source === "template" && n.reason === "sentences", n.reason);
  n = await wn(noteReply({ note: "She got it wrong again.", question: "Why?" }));
  check("note: blame word -> template", n.source === "template" && n.reason === "blame", n.reason);
  n = await wn(noteReply({ note: "Good week.", question: "Show me where the first seed goes." }));
  check("note: an instruction counts as the thing to ask -> model", n.source === "model", n.reason);
  n = await wn(noteReply({ note: "Good week.", question: "Sit down. Look at the board. Count it. Tell me." }));
  check("note: a four-sentence 'question' -> template", n.source === "template" && n.reason === "question", n.reason);
  n = await wn(noteReply({ note: "See counted_start_pit.", question: "Ok?" }));
  check("note: internal label leaked -> template", n.source === "template" && n.reason === "labels", n.reason);
  n = await wn(noteReply({ note: "The seeds go in holes.", question: "Ok?" }));
  check("note: 'holes' for pits -> template", n.source === "template" && n.reason === "vocab", n.reason);
  n = await wn(async () => { throw new Error("boom"); });
  check("note: fetch throws -> template with fallback text", n.source === "template" && n.note === noteFallback(B).note, n.reason);
  const B0 = { ...B, open_id: null, tier: 1 };
  let seenSystem = "";
  const spy = (o) => async (url, init) => { const body = JSON.parse(init.body); seenSystem = body.system || body.messages?.[0]?.content || ""; return { ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) }; };
  n = await writeNote(B0, { fetchImpl: spy({ note: "Two levels were finished this week. They are still working on counting round the corner.", question: "Which level did you like best?" }), apiKey: "k", timeoutMs: 50 });
  check("note: nothing open -> prompt says so and an invented weakness is rejected", /Nothing is open/.test(seenSystem) && n.source === "template" && n.reason === "invented", seenSystem.slice(-80) + " | " + n.reason);
  n = await writeNote(B0, { fetchImpl: spy({ note: "Two levels were finished this week, both on their own.", question: "Which level did you like best?" }), apiKey: "k", timeoutMs: 50 });
  check("note: nothing open -> a plain factual note passes", n.source === "model", n.reason);
  const BZ = { ...B, solo: [], helped: [], days: 1 };
  n = await writeNote(BZ, { fetchImpl: spy({ note: "Your child finished a level this week and is still counting round the corner.", question: "Show me where the first seed goes." }), apiKey: "k", timeoutMs: 50 });
  check("note: zero games finished -> a claimed level is rejected", n.source === "template" && n.reason === "invented", n.reason);
  const BE = { open_id: null, tier: 1, solo: [], helped: [], days: 0 };
  let called = false;
  n = await writeNote(BE, { fetchImpl: async () => { called = true; return { ok: true, status: 200, json: async () => ({}) }; }, apiKey: "k", timeoutMs: 50 });
  check("note: empty week -> nothing_to_say without a model call", !called && n.source === "template" && n.reason === "nothing_to_say", n.reason);
}

clearInterval(keepAlive);
console.log(`\n${fails ? fails + " FAILED" : "all checks passed"}`);
process.exit(fails ? 1 : 0);
