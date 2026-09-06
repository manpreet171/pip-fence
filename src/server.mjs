// Minimal zero-dependency server: serves the play UI and proxies the buddy call so the API
// key stays server-side. Node 22 global fetch, no framework. Deploy: Render/Railway free
// tier, or lift /api/coach into a Vercel/Netlify function unchanged.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname, resolve, sep } from "node:path";
import { coach } from "./engine/coach.mjs";
import { makeStory, narrateBuild } from "./engine/story.mjs";
import { IDS, SHAPE_KEYS, TEMPLATES, redact, phrase, parseWordlist } from "./engine/buddy.mjs";

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
  return send(res, 200, JSON.stringify(reason ? { text, source, reason } : { text, source }), "application/json");
}
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".ico": "image/x-icon", ".json": "application/json", ".txt": "text/plain" };
// Static routing: short URLs map to real files (no duplication). Only these files plus src/public/** are servable.
const ROUTES = { "/": "/public/index.html", "/measure": "/public/measure.html", "/build": "/public/build.html",
  "/engine.mjs": "/engine/engine.mjs", "/buddy.mjs": "/engine/buddy.mjs", "/village.mjs": "/public/village.mjs", "/fence.mjs": "/public/fence.mjs" };
const PUBLIC = join(HERE, "public");

const send = (res, code, body, type = "text/plain") =>
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" }).end(body);

// The frozen control arm's LLM routes (index.html) only exist when explicitly switched on, so the
// shipping server exposes exactly one model endpoint: /api/buddy.
const CONTROL_ARM = process.env.CONTROL_ARM === "1";
const readBody = async req => { let raw = ""; for await (const c of req) { raw += c; if (raw.length > 4096) throw new Error("body too large"); } return raw; };

const server = createServer(async (req, res) => {
  try {
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
