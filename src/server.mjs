// Minimal zero-dependency server: serves the play UI and proxies the buddy call so the API
// key stays server-side. Node 22 global fetch, no framework. Deploy: Render/Railway free
// tier, or lift /api/coach into a Vercel/Netlify function unchanged.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { coach } from "./engine/coach.mjs";
import { makeStory, narrateBuild } from "./engine/story.mjs";
import { IDS, SHAPE_KEYS, TEMPLATES, redact, phrase, parseWordlist } from "./engine/buddy.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5177;
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
  try { out = await phrase(redact(id, tier, shape), { apiKey: process.env.ANTHROPIC_API_KEY, wordlist: WORDLIST }); }
  catch { out = { text: TEMPLATES[id][tier], source: "template", reason: "error" }; }
  const { text, source, reason } = out;
  return send(res, 200, JSON.stringify(reason ? { text, source, reason } : { text, source }), "application/json");
}
const TYPES = { ".html": "text/html", ".mjs": "text/javascript", ".js": "text/javascript",
  ".css": "text/css", ".svg": "image/svg+xml" };

const send = (res, code, body, type = "text/plain") =>
  res.writeHead(code, { "Content-Type": type, "Cache-Control": "no-store" }).end(body);

const server = createServer(async (req, res) => {
  try {
    if (req.method === "POST" && req.url === "/api/coach") {
      let raw = ""; for await (const c of req) raw += c;
      const { problem, history, message } = JSON.parse(raw || "{}");
      const out = await coach(problem, history || [], message, {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    if (req.method === "POST" && req.url === "/api/narrate") {
      let raw = ""; for await (const c of req) raw += c;
      const out = await narrateBuild(JSON.parse(raw || "{}"), {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    if (req.method === "POST" && req.url === "/api/buddy") return buddy(req, res);
    if (req.method === "POST" && req.url === "/api/story") {
      let raw = ""; for await (const c of req) raw += c;
      const { problem, theme } = JSON.parse(raw || "{}");
      const out = await makeStory(problem, theme, {});
      return send(res, 200, JSON.stringify(out), "application/json");
    }
    // static: / -> index.html ; /engine.mjs -> the real engine module (no duplication)
    let path = req.url.split("?")[0];
    if (path === "/") path = "/public/index.html";
    if (path === "/measure") path = "/public/measure.html";
    if (path === "/engine.mjs") path = "/engine/engine.mjs";
    if (path === "/village.mjs") path = "/public/village.mjs";
    if (path === "/build") path = "/public/build.html";
    if (path === "/fence.mjs") path = "/public/fence.mjs";
    if (path === "/buddy.mjs") path = "/engine/buddy.mjs";
    if (path.startsWith("/assets/")) path = "/public" + path;
    const file = join(HERE, path.replace(/^\/+/, ""));
    if (!file.startsWith(HERE)) return send(res, 403, "no");
    const body = await readFile(file);
    return send(res, 200, body, TYPES[extname(file)] || "application/octet-stream");
  } catch (e) {
    if (e.code === "ENOENT") return send(res, 404, "not found");
    return send(res, 500, "server error");   // never a stack or a path
  }
});

server.listen(PORT, () => console.log(`Rung running on http://localhost:${PORT}`));
