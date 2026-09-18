// Zero-dependency server: static files plus the two model endpoints, /api/buddy (a hint from a
// redacted payload) and /api/note (the parent's weekly note from a validated summary). The key stays
// here. Node 22 global fetch, no framework. The frozen control arm mounts only with CONTROL_ARM=1.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, resolve, sep } from "node:path";
import { coach } from "./control/coach.mjs";
import { makeStory, narrateBuild } from "./control/story.mjs";
import { IDS, SHAPE_KEYS, TEMPLATES, redact, phrase, parseWordlist, validNote, writeNote, noteFallback, PROVIDERS, validCheer, writeCheer, cheerFallback, validPlan, writePlan, validShowBody, writeShow } from "./engine/buddy.mjs";
import { candidates, validShow, codeShow } from "./public/fence.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5177;
// Provider follows the key: Anthropic if present, else DeepSeek, else templates only (D-067).
const PHRASER = process.env.ANTHROPIC_API_KEY ? { provider: "anthropic", apiKey: process.env.ANTHROPIC_API_KEY }
  : process.env.DEEPSEEK_API_KEY ? { provider: "deepseek", apiKey: process.env.DEEPSEEK_API_KEY } : {};
const WORDLIST = parseWordlist(await readFile(join(HERE, "..", "data", "wordlist.txt"), "utf8"));
const BODY_KEYS = ["age", "reading_level", "misconception_id", "tier", "shape", "nouns", "template", "constraint"];

// The trust boundary. The body is payload(result) from the browser; we keep only {id, tier, shape},
// re-validate them, and rebuild the payload server-side so no client text reaches the model.
// Never logs the body or the key.
async function buddy(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  const { misconception_id: id, tier, shape } = body ?? {};
  const ok = body && typeof body === "object" && Object.keys(body).every(k => BODY_KEYS.includes(k))
    && IDS.includes(id) && [1, 2, 3].includes(tier)
    && shape && typeof shape === "object" && Object.keys(shape).every(k => SHAPE_KEYS.includes(k))
    && Object.values(shape).every(v => v === "some" || typeof v === "boolean") && !/\d/.test(JSON.stringify(shape));
  if (!ok) return send(res, 400, "bad payload");
  let out;
  try { out = await phrase(redact(id, tier, shape), { ...PHRASER, wordlist: WORDLIST }); }
  catch { out = { text: TEMPLATES[id][tier], source: "template", reason: "error" }; }
  const { text, source, reason } = out;
  const model = source === "model" && PHRASER.provider ? PROVIDERS[PHRASER.provider].model : undefined;
  return send(res, 200, JSON.stringify({ text, source, ...(reason && { reason }), ...(model && { model }) }), "application/json");
}
// The parent note: validated summary in, gated note out; same provider, same fallback discipline.
async function noteRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validNote(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writeNote(body, PHRASER); } catch { out = { ...noteFallback(body), source: "template", reason: "error" }; }
  return send(res, 200, JSON.stringify(out), "application/json");
}
// Pip cheers: validated booleans in, one gated and judged sentence out; the same fallback discipline.
async function cheerRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validCheer(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writeCheer(body, { ...PHRASER, wordlist: WORDLIST }); } catch { out = { text: cheerFallback(body), source: "template", reason: "error" }; }
  const { text, source, reason } = out;
  return send(res, 200, JSON.stringify({ text, source, ...(reason && { reason }) }), "application/json");
}
// Pip plans the next fence: validated record in, a pick from code's own candidate list plus one gated line out.
async function planRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 8192) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validPlan(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writePlan(body, candidates(body.mastery, body.last), { ...PHRASER, wordlist: WORDLIST }); }
  catch { out = { node: null, why: "", source: "template", reason: "error" }; }
  const { node, why, source, reason } = out;
  return send(res, 200, JSON.stringify({ node, why, source, ...(reason && { reason }) }), "application/json");
}
// Pip shows her: real counts in, a script of moves out, simulated before it is sent; code's script otherwise.
async function showRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validShowBody(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writeShow(body, { ...PHRASER, wordlist: WORDLIST, valid: validShow, fallback: codeShow }); }
  catch { out = { steps: codeShow(body), source: "template", reason: "error" }; }
  const { steps, source, reason } = out;
  return send(res, 200, JSON.stringify({ steps, source, ...(reason && { reason }) }), "application/json");
}
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".ttf": "font/ttf", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain" };
// Static routing: short URLs map to real files (no duplication). Only these files plus src/public/** are servable.
const CONTROL_ARM = process.env.CONTROL_ARM === "1";
const ROUTES = { "/": CONTROL_ARM ? "/control/index.html" : "/public/home.html", "/fence": "/public/build.html", ...(CONTROL_ARM && { "/measure": "/control/measure.html", "/engine.mjs": "/control/engine.mjs" }), "/build": "/public/build.html",
  "/buddy.mjs": "/engine/buddy.mjs", "/fence.mjs": "/public/fence.mjs", "/village.mjs": "/public/village.mjs" };
const PUBLIC = join(HERE, "public");

const send = (res, code, body, type = "text/plain") =>
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" }).end(body);

// The frozen control arm's LLM routes (index.html) only exist when explicitly switched on, so the
// shipping server exposes exactly one model endpoint: /api/buddy.
const readBody = async req => { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw new Error("body too large"); } return raw; };

// ponytail: fixed window per IP, in memory; enough to stop a script spending the key, not a DDoS answer
const HITS = new Map(), LIMIT = 60, WINDOW = 60_000;
function limited(req) {
  const ip = req.socket.remoteAddress || "?", now = Date.now(), h = HITS.get(ip) || { t: now, n: 0 };
  if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
  h.n++; HITS.set(ip, h);
  if (HITS.size > 5000) HITS.clear();
  return h.n > LIMIT;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url.startsWith("/api/") && limited(req)) return send(res, 429, "slow down");
    if (req.method === "POST" && /^\/api\/(coach|narrate|story)$/.test(req.url) && !CONTROL_ARM) return send(res, 404, "not found");
    if (req.method === "POST" && req.url === "/api/coach") {
      const raw = await readBody(req);
      const { problem, history, message } = JSON.parse(raw || "{}");
      const out = await coach(problem, history || [], message, {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    if (req.method === "POST" && req.url === "/api/narrate") {
      const raw = await readBody(req);
      const out = await narrateBuild(JSON.parse(raw || "{}"), {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    if (req.method === "POST" && req.url === "/api/buddy") return buddy(req, res);
    if (req.method === "POST" && req.url === "/api/note") return noteRoute(req, res);
    if (req.method === "POST" && req.url === "/api/cheer") return cheerRoute(req, res);
    if (req.method === "POST" && req.url === "/api/plan") return planRoute(req, res);
    if (req.method === "POST" && req.url === "/api/show") return showRoute(req, res);
    if (req.method === "POST" && req.url === "/api/story") {
      const raw = await readBody(req);
      const { problem, theme } = JSON.parse(raw || "{}");
      const out = await makeStory(problem, theme, {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    const path = req.url.split("?")[0];
    const file = resolve(HERE, (ROUTES[path] || path.replace(/^\/assets\//, "/public/assets/")).replace(/^\/+/, ""));
    const routed = Object.values(ROUTES).some(p => file === join(HERE, p));
    if (path.includes("..") || !(routed || file.startsWith(PUBLIC + sep))) return send(res, 404, "not found");
    const body = await readFile(file);
    return send(res, 200, body, TYPES[extname(file)] || "application/octet-stream");
  } catch (e) {
    if (e.code === "ENOENT" || e.code === "EISDIR") return send(res, 404, "not found");
    return send(res, 500, "server error");   // never a stack or a path
  }
});

server.listen(PORT, () => console.log(`Rung running on http://localhost:${PORT}`));
