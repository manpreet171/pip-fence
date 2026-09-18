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
const ph = (fetchImpl) => phrase(P, { fetchImpl, apiKey: "k", wordlist, timeoutMs: 50, judge: false });

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
r = await phrase(P, { fetchImpl: modelReply("x"), wordlist, judge: false });
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
check("TEMPLATES covers 16 ids x 3 tiers", IDS.length === 16 && IDS.every(id => [1, 2, 3].every(t => typeof TEMPLATES[id]?.[t] === "string" && TEMPLATES[id][t])));
check("every template passes gate()", IDS.every(id => [1, 2, 3].every(t => gate(TEMPLATES[id][t], wordlist) === null)));
check("gate: 'one'/'both'/'half' are number words", ["Add one plank.", "Both parts.", "Half a part."].every(t => gate(t, wordlist) === "number"));
check("gate: 'wrong' and 'miss you' are affect words", gate("That is wrong.", wordlist) === "affect" && gate("I miss you.", wordlist) === "affect");

// ---- latency_cost parsing with the fake fetch ----
const row = await runOne(P, { judge: false,  fetchImpl: modelReply("Look at that part again."), apiKey: "k", wordlist });
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
  n = await wn(noteReply({ note: "Good week.", question: "Show me one full part." }));
  check("note: an instruction counts as the thing to ask -> model", n.source === "model", n.reason);
  n = await wn(noteReply({ note: "Good week.", question: "Sit down. Look at the fence. Count it. Tell me." }));
  check("note: a four-sentence 'question' -> template", n.source === "template" && n.reason === "question", n.reason);
  n = await wn(noteReply({ note: "See counted_groups_as_group_size.", question: "Ok?" }));
  check("note: internal label leaked -> template", n.source === "template" && n.reason === "labels", n.reason);
  n = await wn(async () => { throw new Error("boom"); });
  check("note: fetch throws -> template with fallback text", n.source === "template" && n.note === noteFallback(B).note, n.reason);
  const B0 = { ...B, open_id: null, tier: 1 };
  let seenSystem = "";
  const spy = (o) => async (url, init) => { const body = JSON.parse(init.body); seenSystem = body.system || body.messages?.[0]?.content || ""; return { ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) }; };
  n = await writeNote(B0, { fetchImpl: spy({ note: "Two fences went up this week. They are still working on counting the parts.", question: "Which fence was your favourite?" }), apiKey: "k", timeoutMs: 50 });
  check("note: nothing open -> prompt says so and an invented weakness is rejected", /Nothing is open/.test(seenSystem) && n.source === "template" && n.reason === "invented", seenSystem.slice(-80) + " | " + n.reason);
  n = await writeNote(B0, { fetchImpl: spy({ note: "Two fences went up this week, both on their own.", question: "Which fence was your favourite?" }), apiKey: "k", timeoutMs: 50 });
  check("note: nothing open -> a plain factual note passes", n.source === "model", n.reason);
  const BZ = { ...B, solo: [], helped: [], days: 1 };
  n = await writeNote(BZ, { fetchImpl: spy({ note: "Your child built a fence this week and is still counting the parts.", question: "Show me one full part." }), apiKey: "k", timeoutMs: 50 });
  check("note: zero fences -> a claimed fence is rejected", n.source === "template" && n.reason === "invented", n.reason);
}

// ---- Pip cheers: booleans in, one gated and judged sentence out ----
{
  const { validCheer, cheerFallback, writeCheer, cheer } = await import("../src/engine/buddy.mjs");
  const C = { first_try: true, used_hint: false, fixed_after_count: false, mode: "fix", chapter_done: false };
  check("cheer: valid summary accepted, extra key and bad mode rejected", validCheer(C) && !validCheer({ ...C, name: "x" }) && !validCheer({ ...C, mode: "seeds" }));
  check("cheer: every fallback passes gate()", [C, { ...C, mode: "share" }, { ...C, mode: "build" }, { ...C, first_try: false, fixed_after_count: true }, { ...C, chapter_done: true }, { ...C, first_try: false }]
    .every(b => gate(cheerFallback(b), wordlist) === null));
  let called = 0;
  let c = await writeCheer({ ...C, first_try: false, used_hint: true }, { fetchImpl: async () => { called++; }, apiKey: "k", wordlist, timeoutMs: 50 });
  check("cheer: nothing specific to praise -> no model call, plain line", called === 0 && c.reason === "nothing_to_say" && c.text === "The fence is done.");
  const reply = (o) => async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) });
  c = await writeCheer(C, { fetchImpl: reply({ text: "You looked for the gaps and filled them. The fence stands again." }), apiKey: "k", wordlist, timeoutMs: 50, judge: false });
  check("cheer: a gated rephrase ships as model", c.source === "model", JSON.stringify(c));
  c = await writeCheer(C, { fetchImpl: reply({ text: "You filled all three gaps." }), apiKey: "k", wordlist, timeoutMs: 50, judge: false });
  check("cheer: a number word -> template", c.source === "template" && c.reason === "number", c.reason);
  c = await writeCheer(C, { fetchImpl: async () => { throw new Error("boom"); }, apiKey: "k", wordlist, timeoutMs: 50 });
  check("cheer: fetch throws -> template", c.source === "template" && c.text === cheerFallback(C), c.reason);
  let n = 0;
  c = await writeCheer(C, { fetchImpl: async () => (++n === 1 ? reply({ text: "You counted the gaps, not the planks. The fence is whole again." })() : reply({ ok: false })()), apiKey: "k", wordlist, timeoutMs: 50 });
  check("cheer: the judge says no -> template, reason judge", c.source === "template" && c.reason === "judge", c.reason);
  c = await cheer(C, { fetchImpl: async () => ({ ok: false, status: 500 }) });
  check("cheer: browser side falls back to the template line", c.source === "template" && c.text === cheerFallback(C));
}

// ---- Pip plans the next fence: code lists, the model picks, code checks ----
{
  const { validPlan, writePlan, plan, planPayload } = await import("../src/engine/buddy.mjs");
  const { candidates, next } = await import("../src/public/fence.mjs");
  const M = { "2x3_concrete": 1, "3x3_concrete": 1, "3x4_concrete": 0.5 };
  const B = { mastery: M, history: [{ node: "3x4_concrete", ids: ["counted_groups_as_group_size"], hints: 2, first_try: false, fixed_after_count: true }], last: { id: "counted_groups_as_group_size", node: "3x4_concrete" } };
  check("plan: valid record accepted; extra key, bad node, bad id rejected", validPlan(B) && !validPlan({ ...B, name: "x" }) && !validPlan({ ...B, last: { id: "correct", node: "9x9_concrete" } }) && !validPlan({ ...B, history: [{ ...B.history[0], ids: ["seeds"] }] }));
  const c = candidates(M, B.last);
  check("candidates: only open, unmastered fences that exercise the last mistake", c.length > 0 && c.every(n => n.endsWith("_concrete") && M[n] !== 1 && n[0] !== n[2]), c.join(" "));
  check("candidates: packs stay closed until three gold; 'correct' opens every unmastered fence", !candidates(M, { id: "correct", node: "3x4_concrete" }).some(n => n.endsWith("_packs")) && candidates(M, { id: "correct", node: "3x4_concrete" }).includes("3x3_packs") === false && candidates({ ...M, "3x4_concrete": 1 }, { id: "correct", node: "3x4_concrete" }).some(n => n.endsWith("_packs")));
  check("candidates: an id with no fitting fence falls back to all open", candidates(M, { id: "pack_unit_confusion", node: "3x4_concrete" }).length > 0);
  check("plan payload: no internal id reaches the model", !/counted_groups|_concrete"/.test(JSON.stringify(planPayload(B, c)).replace(/"node":"[^"]+"/g, "")));
  const reply = (o) => async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) });
  let p = await writePlan(B, c, { fetchImpl: reply({ node: c[0], why: "This fence has more parts than planks in a part, so you can see which is which." }), apiKey: "k", wordlist, timeoutMs: 50, judge: false });
  check("plan: a pick from the list with a gated line -> model", p.source === "model" && p.node === c[0] && p.why.length > 0, JSON.stringify(p));
  p = await writePlan(B, c, { fetchImpl: reply({ node: "4x5_share", why: "Try this." }), apiKey: "k", wordlist, timeoutMs: 50, judge: false });
  check("plan: a pick outside the list -> node null, reason choice", p.node === null && p.reason === "choice", p.reason);
  p = await writePlan(B, c, { fetchImpl: reply({ node: c[0], why: "Try 4 parts of 3 now." }), apiKey: "k", wordlist, timeoutMs: 50, judge: false });
  check("plan: a line with a digit -> the pick stands, the line is dropped", p.node === c[0] && p.why === "" && p.reason === "number", p.reason);
  p = await writePlan(B, c, { fetchImpl: async () => { throw new Error("boom"); }, apiKey: "k", wordlist, timeoutMs: 50 });
  check("plan: fetch throws -> node null", p.node === null && p.source === "template", p.reason);
  p = await writePlan(B, [c[0]], { fetchImpl: async () => { throw new Error("no call expected"); }, apiKey: "k", wordlist });
  check("plan: one choice -> no model call", p.node === c[0] && p.reason === "one_choice");
  p = await plan(B, { fetchImpl: async () => ({ ok: false, status: 500 }) });
  check("plan: browser side never throws, node null on failure", p.node === null);
  check("next() still returns a candidate for the same record", c.includes(next(M, B.last)) || next(M, B.last) === null, next(M, B.last));
}

// ---- Pip shows her: moves from the model, simulated by code before they run ----
{
  const { validShowBody, writeShow, show, showPayload } = await import("../src/engine/buddy.mjs");
  const { validShow, codeShow } = await import("../src/public/fence.mjs");
  const B = { per: 3, parts: [3, 1, 3], cart: 2, misconception_id: "off_by_one_in_one_group", tier: 2 };
  check("show: valid body accepted; extra key, over-long parts, bad id rejected", validShowBody(B) && !validShowBody({ ...B, x: 1 }) && !validShowBody({ ...B, parts: Array(9).fill(1) }) && !validShowBody({ ...B, misconception_id: "seeds" }));
  const good = [{ op: "point", part: 1 }, { op: "count", part: 1 }, { op: "place", part: 1 }, { op: "place", part: 1 }, { op: "say", text: "Now it is full. You do the rest." }];
  check("validShow: a script that fixes a part passes", validShow(good, B));
  check("validShow: over-filling, breaking a full part, empty cart, thirteen moves, or no fix all fail",
    !validShow([...good, { op: "place", part: 1 }], B) && !validShow([{ op: "remove", part: 0 }, ...good], B) && !validShow(good, { ...B, cart: 1 })
    && !validShow(Array(13).fill({ op: "count", part: 1 }), B) && !validShow([{ op: "count", part: 1 }], B) && !validShow([{ op: "place", part: 7 }], B));
  check("codeShow: code's own script fixes the first wrong part and hands back", validShow(codeShow(B), B) && codeShow(B).at(-1).op === "say" && codeShow({ ...B, cart: 0 }).length === 0);
  check("codeShow: an over-count is taken back to the cart", validShow(codeShow({ ...B, parts: [3, 5, 3], cart: 0 }), { ...B, parts: [3, 5, 3], cart: 0 }));
  check("show payload: counts go to the model, the id does not", showPayload(B).planks_on_each_part_now.length === 3 && !JSON.stringify(showPayload(B)).includes("off_by_one"));
  const reply = (o) => async () => ({ ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(o) }] }) });
  const ws = (f, extra = {}) => writeShow(B, { fetchImpl: f, apiKey: "k", wordlist, timeoutMs: 50, valid: validShow, fallback: codeShow, ...extra });
  let w = await ws(reply({ steps: good }));
  check("show: a simulated-good script with gated lines -> model", w.source === "model" && w.steps.length === 5, JSON.stringify(w));
  w = await ws(reply({ steps: [{ op: "place", part: 0 }] }));
  check("show: a script that over-fills -> code's script, reason simulation", w.source === "template" && w.reason === "simulation" && w.steps.length > 0, w.reason);
  w = await ws(reply({ steps: [...good.slice(0, 4), { op: "say", text: "Now it has three planks." }] }));
  check("show: a say line with a number word -> code's script", w.source === "template" && w.reason === "number", w.reason);
  w = await ws(async () => { throw new Error("boom"); });
  check("show: fetch throws -> code's script", w.source === "template" && validShow(w.steps, B));
  w = await show(B, { fetchImpl: async () => ({ ok: false, status: 500 }) });
  check("show: browser side never throws, empty steps on failure", Array.isArray(w.steps) && w.steps.length === 0);
}

// ---- the semantic judge ----
{
  const good = "Look at the part that is short. Count a full part again.";
  const twoCalls = (verdict) => { let n = 0; return async (url, init) => { n++;
    const body = JSON.parse(init.body);
    if (n === 1) return { ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify({ tier: P.tier, misconception_id: P.misconception_id, text: good }) }] }) };
    twoCalls.last = body;
    return { ok: true, status: 200, json: async () => ({ content: [{ type: "text", text: JSON.stringify(verdict) }] }) }; }; };
  let jr = await phrase(P, { fetchImpl: twoCalls({ ok: true }), apiKey: "k", wordlist, timeoutMs: 50 });
  check("judge: a faithful rephrase ships as model", jr.source === "model" && jr.judged === true, jr.reason);
  const sent = JSON.stringify(twoCalls.last);
  check("judge: sees the reference and the candidate, and no digit", /reference/.test(sent) && /candidate/.test(sent) && !/\d/.test(JSON.parse(twoCalls.last.messages.at(-1).content).candidate), sent.slice(0, 120));
  jr = await phrase(P, { fetchImpl: twoCalls({ ok: false }), apiKey: "k", wordlist, timeoutMs: 50 });
  check("judge: a rephrase the judge rejects -> template, reason judge", jr.source === "template" && jr.reason === "judge", jr.reason);
  jr = await phrase(P, { fetchImpl: twoCalls({ verdict: "maybe" }), apiKey: "k", wordlist, timeoutMs: 50 });
  check("judge: an unreadable verdict -> template, fail closed", jr.source === "template" && jr.reason === "judge_unavailable", jr.reason);
}

process.exit(fails ? 1 : 0);
