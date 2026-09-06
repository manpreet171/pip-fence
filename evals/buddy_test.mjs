// Unit checks for the hint layer with an injected fake fetch. Zero deps. Exit 1 on any failure.
// Run: node evals/buddy_test.mjs
import { readFileSync } from "node:fs";
import { IDS, TEMPLATES, payload, hint, phrase, gate, request, parseWordlist } from "../src/engine/buddy.mjs";
import { classify } from "../src/public/fence.mjs";
import { expand } from "./classifier_eval.mjs";
import { runOne, summarise } from "./latency_cost.mjs";

const root = new URL("../", import.meta.url);
const wordlist = parseWordlist(readFileSync(new URL("data/wordlist.txt", root), "utf8"));
const { fixtures } = JSON.parse(readFileSync(new URL("evals/classifier_fixtures.json", root), "utf8"));

// AbortSignal.timeout's timer is unref'd in Node; with nothing else pending the process would exit
// before it fires. A server has its socket; the test needs this.
const keepAlive = setInterval(() => {}, 1000);
let fails = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : "  -- " + detail}`); if (!ok) fails++; };

// ---- fakes ----
const P = { misconception_id: "off_by_one_in_one_group", tier: 1 };
const TPL = TEMPLATES.off_by_one_in_one_group[1];
const modelReply = (text, extra = {}) => async () => ({ ok: true, status: 200, json: async () => ({
  content: [{ type: "text", text: JSON.stringify({ tier: 1, misconception_id: P.misconception_id, text, ...extra }) }],
  usage: { input_tokens: 400, output_tokens: 60 } }) });
const hangs = () => (url, init) => new Promise((_, rej) => init.signal.addEventListener("abort", () => rej(init.signal.reason)));
const ph = (fetchImpl) => phrase(P, { fetchImpl, apiKey: "k", wordlist, timeoutMs: 50 });

// ---- phrase(): the gate, in order ----
let r = await ph(modelReply("Look at the top of that part. Put a plank on it."));
check("valid model JSON passes -> source model", r.source === "model" && r.text === "Look at the top of that part. Put a plank on it.", JSON.stringify(r));
check("usage parsed from API fields", r.usage?.input_tokens === 400 && r.usage?.output_tokens === 60);
r = await ph(modelReply("Put 4 planks on that part."));
check("digit '4' rejected -> template", r.source === "template" && r.reason === "number" && r.text === TPL, r.reason);
r = await ph(modelReply("You need twelve planks in all."));
check("number word 'twelve' rejected -> template", r.source === "template" && r.reason === "number", r.reason);
r = await ph(modelReply("It is short. Add a plank. Then look again."));
check("3 sentences rejected -> template", r.source === "template" && r.reason === "sentences", r.reason);
r = await ph(modelReply("That part is sad and short. Count it again."));
check("'sad' rejected -> template", r.source === "template" && r.reason === "affect", r.reason);
r = await ph(modelReply("Inspect the deficient palisade segment. Reconcile it."));
check("too many out-of-list words rejected -> template", r.source === "template" && r.reason === "vocab", r.reason);
r = await ph(modelReply("Look at the top of that part.", { extra: 1 }));
check("extra schema key rejected -> template", r.source === "template" && r.reason === "schema", r.reason);
r = await ph(async () => { throw new Error("boom"); });
check("fetch throws -> template", r.source === "template" && r.reason === "error" && r.text === TPL, r.reason);
r = await ph(hangs());
check("fetch hangs past timeoutMs -> template (timeout)", r.source === "template" && r.reason === "timeout", r.reason);
r = await ph(async () => ({ ok: false, status: 529, json: async () => ({}) }));
check("non-200 -> template", r.source === "template" && r.reason === "http_529", r.reason);
r = await phrase(P, { fetchImpl: modelReply("x"), wordlist });
check("no apiKey -> template reason no_key (offline path)", r.source === "template" && r.reason === "no_key" && r.text === TPL, r.reason);

// ---- the exact Haiku request (TECH-STACK §1.1) ----
const [url, init] = request(P, "sk-test");
const body = JSON.parse(init.body);
check("request: url/model/max_tokens/temperature/headers", url === "https://api.anthropic.com/v1/messages"
  && body.model === "claude-haiku-4-5-20251001" && body.max_tokens === 120 && body.temperature === 0.4
  && init.headers["anthropic-version"] === "2023-06-01" && init.headers["x-api-key"] === "sk-test");
check("request: json_schema format, no effort, no thinking", body.output_config?.format?.type === "json_schema"
  && body.output_config.format.schema.additionalProperties === false && !("effort" in body.output_config) && !("thinking" in body));
check("request: system prompt has no answer and forbids numbers", /no numbers/.test(body.system) && !/\d/.test(body.system.replace(/aged 8|500-word|2 sentences/g, "")));

// ---- hint(): browser side, never throws ----
const R1 = { id: "off_by_one_in_one_group", tier: 1, counts: [4, 4, 3], node: "3x4_concrete", confirmed: true };
const srv = (out, ok = true, status = 200) => async () => ({ ok, status, json: async () => out });
r = await hint(R1, { fetchImpl: srv({ text: "Look up at the top of that part.", source: "model" }) });
check("hint: server model hint passes through", r.source === "model" && r.text === "Look up at the top of that part.");
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

// ---- payload(): no integer from the build survives, across every fixture ----
let digitLeaks = 0, keyLeaks = 0, shapeSample;
for (const f of fixtures) {
  const res = classify(expand(f.node, f.seq));
  const p = payload(res);
  const { age, tier, reading_level, ...rest } = p;   // the only fixed fields allowed to hold a digit
  if (/\d/.test(JSON.stringify(rest))) digitLeaks++;
  if (age !== 8 || ![1, 2, 3].includes(tier) || reading_level !== "500-word list, max 2 sentences") keyLeaks++;
  if (p.shape.groups !== "some" || Object.keys(p.shape).length !== 5) keyLeaks++;
  if (f.seq === "p0*4 p1*4 p2*3 c") shapeSample = p.shape;
}
check(`payload: no digit outside age/tier/reading_level over ${fixtures.length} fixtures`, digitLeaks === 0, `${digitLeaks} leaks`);
check("payload: fixed fields exact, shape has 5 keys and groups='some'", keyLeaks === 0, `${keyLeaks} bad`);
check("payload: [4,4,3] -> one_group_short only", JSON.stringify(shapeSample) ===
  JSON.stringify({ groups: "some", one_group_short: true, all_groups_short: false, has_over: false, has_empty: false }), JSON.stringify(shapeSample));
check("payload: template is TEMPLATES[id][tier]", payload(R1).template === TPL);

// ---- TEMPLATES coverage and the gate on the templates themselves ----
check("TEMPLATES covers 8 ids x 3 tiers", IDS.length === 8 && IDS.every(id => [1, 2, 3].every(t => typeof TEMPLATES[id]?.[t] === "string" && TEMPLATES[id][t])));
check("every template passes gate()", IDS.every(id => [1, 2, 3].every(t => gate(TEMPLATES[id][t], wordlist) === null)));
check("gate: 'one'/'both'/'half' are number words", ["Add one plank.", "Both parts.", "Half a part."].every(t => gate(t, wordlist) === "number"));
check("gate: 'wrong' and 'miss you' are affect words", gate("That is wrong.", wordlist) === "affect" && gate("I miss you.", wordlist) === "affect");

// ---- latency_cost parsing with the fake fetch ----
const row = await runOne(P, { fetchImpl: modelReply("Look at that part again."), apiKey: "k", wordlist });
const s = summarise([row, { ...row, ms: 900, source: "template" }]);
check("latency_cost: runOne records ms/tokens/source", row.source === "model" && row.in === 400 && row.out === 60 && row.ms >= 0);
check("latency_cost: summarise p50/p95/$ and gate pass rate", s.p95 === 900 && s.pass === 0.5 && Math.abs(s.usd - (400 * 1 + 60 * 5) / 1e6) < 1e-12, JSON.stringify(s));

clearInterval(keepAlive);
console.log(`\n${fails ? fails + " FAILED" : "all checks passed"}`);
// ---- the parent note: same discipline pointed at the adult ----
{
  const { validNote, notePayload, noteGate, writeNote, noteFallback } = await import("../src/engine/buddy.mjs");
  const B = { open_id: "counted_groups_as_group_size", tier: 2, solo: ["3 parts of 4 (packs)", "2 parts of 3"], helped: ["3 parts of 4"], days: 3 };
  check("note: valid summary accepted", validNote(B));
  check("note: unknown key rejected", !validNote({ ...B, name: "Aanya" }));
  check("note: bad fence name rejected", !validNote({ ...B, solo: ["<script>"] }));
  check("note: payload carries no internal id and no event log", !JSON.stringify(notePayload(B)).includes("counted_groups") && !("events" in notePayload(B)));
  const noteReply = (o) => async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) });
  const wn = (f) => writeNote(B, { fetchImpl: f, apiKey: "k", timeoutMs: 50 });
  let n = await wn(noteReply({ note: "Two fences went up on their own this week. The parts-versus-planks mix-up is the one to watch.", question: "Which number tells you how many parts?" }));
  check("note: good model note passes -> source model", n.source === "model" && n.question.endsWith("?"), JSON.stringify(n));
  n = await wn(noteReply({ note: "Fine. Fine. Fine. Fine.", question: "Ok?" }));
  check("note: four sentences -> template", n.source === "template" && n.reason === "sentences", n.reason);
  n = await wn(noteReply({ note: "She got it wrong again.", question: "Why?" }));
  check("note: blame word -> template", n.source === "template" && n.reason === "blame", n.reason);
  n = await wn(noteReply({ note: "Good week.", question: "No question here." }));
  check("note: missing question mark -> template", n.source === "template" && n.reason === "question", n.reason);
  n = await wn(noteReply({ note: "See counted_groups_as_group_size.", question: "Ok?" }));
  check("note: internal label leaked -> template", n.source === "template" && n.reason === "labels", n.reason);
  n = await wn(async () => { throw new Error("boom"); });
  check("note: fetch throws -> template with fallback text", n.source === "template" && n.note === noteFallback(B).note, n.reason);
}

process.exit(fails ? 1 : 0);
