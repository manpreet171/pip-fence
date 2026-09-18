// Zero-dependency server: static files plus the two model endpoints, /api/buddy (a hint from a
// redacted payload) and /api/note (the parent's weekly note from a validated summary). The key stays
// here. Node 22 global fetch, no framework.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, resolve, sep } from "node:path";
import { IDS, SHAPE_KEYS, TEMPLATES, redact, phrase, parseWordlist, validNote, writeNote, noteFallback, PROVIDERS, validCheer, writeCheer, cheerFallback, validPlan, writePlan, validShowBody, writeShow } from "./engine/buddy.mjs";
import { candidates, validShow, codeShow } from "./public/fence.mjs";
import { createHash } from "node:crypto";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5177;
// Provider follows the key: Anthropic if present, else DeepSeek, else templates only (D-067).
const PHRASER = process.env.ANTHROPIC_API_KEY ? { provider: "anthropic", apiKey: process.env.ANTHROPIC_API_KEY }
  : process.env.DEEPSEEK_API_KEY ? { provider: "deepseek", apiKey: process.env.DEEPSEEK_API_KEY } : {};
// The key is spent only through here: a hard daily cap on model requests, whatever the traffic.
// Past the cap every job falls back to its template (they all treat a missing key as "no call"),
// so a public link cannot drain the balance and the game keeps working. Resets at midnight UTC.
const CAP = +process.env.MODEL_DAILY_CAP || 1500;
let day = "", spent = 0;
function model() {
  const d = new Date().toISOString().slice(0, 10);
  if (d !== day) { day = d; spent = 0; }
  if (!PHRASER.apiKey || spent >= CAP) return {};
  spent++; return PHRASER;
}
// Pip's voice at run time (D-086). Lines the model writes are spoken by the same neural voice as
// the bundled clips, through the server: the browser asks /api/say for a line, the server will only
// synthesise a line it produced itself (or a fixed line), caches the audio by text, and returns mp3.
// Provider follows the key. No key: the route answers 404 and the browser uses its own voice.
const TTS = process.env.AZURE_SPEECH_KEY
  ? { kind: "azure", key: process.env.AZURE_SPEECH_KEY, region: process.env.AZURE_SPEECH_REGION || "eastus", voice: process.env.TTS_VOICE || "en-US-AnaNeural" }
  : process.env.ELEVENLABS_API_KEY
  ? { kind: "elevenlabs", key: process.env.ELEVENLABS_API_KEY, voice: process.env.TTS_VOICE || "pFZP5JQG7iQjIQuC4Bku" }
  : process.env.OPENAI_API_KEY
  ? { kind: "openai", key: process.env.OPENAI_API_KEY, voice: process.env.TTS_VOICE || "coral" }
  : null;
const SAID = new Map();                                   // text -> mp3 Buffer, the cache
const ALLOW = new Set();                                  // texts this server produced or ships; only these are voiced
const SAY_CAP = +process.env.TTS_DAILY_CHARS || 60000;    // characters per day (about an hour of speech), then the browser voice takes over
let sayDay = "", sayChars = 0;
const allow = (...texts) => { for (const t of texts) if (typeof t === "string" && t.trim()) ALLOW.add(t.trim()); };
const ttsRequest = {
  azure: (t) => [`https://${TTS.region}.tts.speech.microsoft.com/cognitiveservices/v1`, { method: "POST",
    headers: { "Ocp-Apim-Subscription-Key": TTS.key, "Content-Type": "application/ssml+xml", "X-Microsoft-OutputFormat": "audio-24khz-48kbitrate-mono-mp3", "User-Agent": "pip" },
    body: `<speak version='1.0' xml:lang='en-US'><voice name='${TTS.voice}'><prosody rate='-5%'>${t.replace(/[<>&]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;" }[c]))}</prosody></voice></speak>` }],
  elevenlabs: (t) => [`https://api.elevenlabs.io/v1/text-to-speech/${TTS.voice}?output_format=mp3_22050_32`, { method: "POST",
    headers: { "xi-api-key": TTS.key, "Content-Type": "application/json" },
    body: JSON.stringify({ text: t, model_id: "eleven_turbo_v2_5" }) }],
  openai: (t) => ["https://api.openai.com/v1/audio/speech", { method: "POST",
    headers: { authorization: "Bearer " + TTS.key, "Content-Type": "application/json" },
    body: JSON.stringify({ model: "gpt-4o-mini-tts", voice: TTS.voice, input: t, response_format: "mp3", instructions: "A warm, playful young child's voice, speaking slowly and clearly to a friend." }) }],
};
async function sayRoute(req, res) {
  if (!TTS) return send(res, 404, "no voice");
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 1024) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  const text = typeof body?.text === "string" ? body.text.trim() : "";
  if (!text || text.length > 300 || !ALLOW.has(text)) return send(res, 403, "not a line of mine");
  if (SAID.has(text)) return send(res, 200, SAID.get(text), "audio/mpeg");
  const d = new Date().toISOString().slice(0, 10); if (d !== sayDay) { sayDay = d; sayChars = 0; }
  if (sayChars + text.length > SAY_CAP) return send(res, 404, "quiet today");
  try {
    const [url, init] = ttsRequest[TTS.kind](text);
    const r = await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
    if (!r.ok) return send(res, 502, "voice failed");
    const buf = Buffer.from(await r.arrayBuffer());
    sayChars += text.length;
    if (SAID.size > 3000) SAID.clear();
    SAID.set(text, buf);
    return send(res, 200, buf, "audio/mpeg");
  } catch { return send(res, 502, "voice failed"); }
}
const WORDLIST = parseWordlist(await readFile(join(HERE, "..", "data", "wordlist.txt"), "utf8"));
for (const id in TEMPLATES) for (const t in TEMPLATES[id]) allow(TEMPLATES[id][t]);
try { allow(...Object.keys(JSON.parse(await readFile(join(HERE, "public", "assets", "voice", "manifest.json"), "utf8")))); } catch {}
// The page's own fixed lines (sheets, demos, counting, the card's stock lines) are read from the page
// at startup, so a line added to the page is voiced without anyone remembering to list it here.
try {
  const page = await readFile(join(HERE, "public", "build.html"), "utf8");
  for (const m of page.matchAll(/(?:say|bubble)\("([^"]+)"/g)) allow(m[1]);
  for (const m of page.matchAll(/(?:sub|title): "([^"]+)"/g)) allow(m[1]);
  for (const m of page.matchAll(/steps: \[([^\]]+)\]/g)) for (const x of m[1].matchAll(/"([^"]+)"/g)) allow(x[1]);
  for (const m of page.matchAll(/pip\.star\([^,]+, [^"]*"([^"]+)" : "([^"]+)"\)/g)) allow(m[1], m[2]);
  allow("one", "two", "three", "four", "five", "six", "The fence is done.", "Look at this part.", "Every fence is done!");
  for (const b of [{ first_try: true, mode: "fix" }, { first_try: true, mode: "share" }, { first_try: true, mode: "build" }, { fixed_after_count: true }, { chapter_done: true }, {}]) allow(cheerFallback(b));
  for (const st of [{ per: 3, parts: [3, 1, 3], cart: 2 }, { per: 3, parts: [3, 5, 1], cart: 0 }]) for (const x of codeShow(st)) if (x.op === "say") allow(x.text);
} catch {}
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
  try { out = await phrase(redact(id, tier, shape), { ...model(), wordlist: WORDLIST }); }
  catch { out = { text: TEMPLATES[id][tier], source: "template", reason: "error" }; }
  const { text, source, reason } = out; allow(text);
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
  try { out = await writeNote(body, model()); } catch { out = { ...noteFallback(body), source: "template", reason: "error" }; }
  return send(res, 200, JSON.stringify(out), "application/json");
}
// Pip cheers: validated booleans in, one gated and judged sentence out; the same fallback discipline.
async function cheerRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validCheer(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writeCheer(body, { ...model(), wordlist: WORDLIST }); } catch { out = { text: cheerFallback(body), source: "template", reason: "error" }; }
  const { text, source, reason } = out; allow(text);
  return send(res, 200, JSON.stringify({ text, source, ...(reason && { reason }) }), "application/json");
}
// Pip plans the next fence: validated record in, a pick from code's own candidate list plus one gated line out.
async function planRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 8192) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validPlan(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writePlan(body, candidates(body.mastery, body.last), { ...model(), wordlist: WORDLIST }); }
  catch { out = { node: null, why: "", source: "template", reason: "error" }; }
  const { node, why, source, reason } = out; allow(why);
  return send(res, 200, JSON.stringify({ node, why, source, ...(reason && { reason }) }), "application/json");
}
// Pip shows her: real counts in, a script of moves out, simulated before it is sent; code's script otherwise.
async function showRoute(req, res) {
  let body;
  try { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw 0; } body = JSON.parse(raw); }
  catch { return send(res, 400, "bad json"); }
  if (!validShowBody(body)) return send(res, 400, "bad payload");
  let out;
  try { out = await writeShow(body, { ...model(), wordlist: WORDLIST, valid: validShow, fallback: codeShow }); }
  catch { out = { steps: codeShow(body), source: "template", reason: "error" }; }
  const { steps, source, reason } = out; allow(...steps.filter(s => s.op === "say").map(s => s.text));
  return send(res, 200, JSON.stringify({ steps, source, ...(reason && { reason }) }), "application/json");
}
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".ttf": "font/ttf", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain" };
// Static routing: short URLs map to real files (no duplication). Only these files plus src/public/** are servable.
const ROUTES = { "/": "/public/home.html", "/fence": "/public/build.html", "/build": "/public/build.html",
  "/buddy.mjs": "/engine/buddy.mjs", "/fence.mjs": "/public/fence.mjs" };
const PUBLIC = join(HERE, "public");

const send = (res, code, body, type = "text/plain") =>
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" }).end(body);


// ponytail: fixed window per IP, in memory; enough to stop a script spending the key, not a DDoS answer
const HITS = new Map(), LIMIT = 60, WINDOW = 60_000;
function limited(req) {
  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "?", now = Date.now(), h = HITS.get(ip) || { t: now, n: 0 };
  if (now - h.t > WINDOW) { h.t = now; h.n = 0; }
  h.n++; HITS.set(ip, h);
  if (HITS.size > 5000) HITS.clear();
  return h.n > LIMIT;
}

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url.startsWith("/api/") && limited(req)) return send(res, 429, "slow down");
    // A browser always sends Origin on a cross-site POST; only our own pages may call the model routes.
    if (req.method === "POST" && req.url.startsWith("/api/") && req.headers.origin && new URL(req.headers.origin).host !== req.headers.host) return send(res, 403, "no");
    if (req.method === "POST" && req.url === "/api/buddy") return buddy(req, res);
    if (req.method === "POST" && req.url === "/api/note") return noteRoute(req, res);
    if (req.method === "POST" && req.url === "/api/cheer") return cheerRoute(req, res);
    if (req.method === "POST" && req.url === "/api/plan") return planRoute(req, res);
    if (req.method === "POST" && req.url === "/api/show") return showRoute(req, res);
    if (req.method === "POST" && req.url === "/api/say") return sayRoute(req, res);
    if (req.method === "GET" && req.url === "/api/say") return send(res, 200, JSON.stringify({ voice: TTS ? TTS.voice : null }), "application/json");
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

server.listen(PORT, () => console.log(`Pip running on http://localhost:${PORT}`));
