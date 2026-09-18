// The server's routes, end to end, with a key that the provider will refuse. Every model route must
// answer 200 with a named fallback reason, never "error": "error" means the route itself threw
// before or around the model call, which is exactly the bug that once turned every hint into a
// template for a whole afternoon while the other routes kept working. Run: node evals/server_smoke.mjs
import { spawn } from "node:child_process";
const port = 5300 + Math.floor(Math.random() * 200);
const srv = spawn(process.execPath, ["src/server.mjs"], { env: { ...process.env, PORT: String(port), DEEPSEEK_API_KEY: "bogus-key-for-the-smoke-test", ANTHROPIC_API_KEY: "", AZURE_SPEECH_KEY: "" }, stdio: "ignore" });
const H = `http://localhost:${port}`;
const post = async (path, body) => { const r = await fetch(H + path, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) }); return { status: r.status, body: r.headers.get("content-type")?.includes("json") ? await r.json() : await r.text() }; };
let fails = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name}${ok || !detail ? "" : "  -- " + detail}`); if (!ok) fails++; };
try {
  for (let i = 0; i < 50; i++) { try { if ((await fetch(H + "/")).ok) break; } catch {} await new Promise(r => setTimeout(r, 100)); }
  const routes = [
    ["/api/buddy", { age: 8, reading_level: "x", misconception_id: "off_by_one_in_one_group", tier: 1, shape: { groups: "some", one_group_short: true, all_groups_short: false, has_over: false, has_empty: false }, nouns: { group: "part", unit: "plank" }, template: "x", constraint: "x" }],
    ["/api/cheer", { first_try: true, used_hint: false, fixed_after_count: false, mode: "build", chapter_done: false }],
    ["/api/plan", { mastery: { "2x3_concrete": 1 }, history: [{ node: "2x3_concrete", ids: [], hints: 0, first_try: true, fixed_after_count: false }], last: { id: "correct", node: "2x3_concrete" } }],
    ["/api/show", { per: 3, parts: [3, 1, 3], cart: 2, misconception_id: "off_by_one_in_one_group", tier: 2 }],
    ["/api/note", { open_id: "off_by_one_in_one_group", tier: 1, solo: ["2 parts of 3"], helped: [], days: 1 }],
  ];
  for (const [path, body] of routes) {
    const r = await post(path, body);
    check(`${path}: 200 with a named fallback, never "error"`, r.status === 200 && r.body && r.body.reason !== "error" && (r.body.source === "template" || r.body.source === "code" || r.body.node === null), JSON.stringify(r.body).slice(0, 120));
  }
  const bad = await post("/api/buddy", { misconception_id: "nope" });
  check("/api/buddy: a bad payload is refused with 400", bad.status === 400);
  const pages = ["/", "/fence", "/public/parent.html", "/buddy.mjs", "/fence.mjs", "/assets/voice/manifest.json"];
  for (const p of pages) { const r = await fetch(H + p); check(`GET ${p} 200`, r.status === 200); }
} finally { srv.kill(); }
console.log(`\n${fails ? fails + " FAILED" : "all checks passed"}`);
process.exit(fails ? 1 : 0);
