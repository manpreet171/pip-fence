// Minimal zero-dependency server: serves the play UI and proxies the buddy call so the API
// key stays server-side. Node 22 global fetch, no framework. Deploy: Render/Railway free
// tier, or lift /api/coach into a Vercel/Netlify function unchanged.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, extname } from "node:path";
import { coach } from "./engine/coach.mjs";
import { makeStory, narrateBuild } from "./engine/story.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT || 5177;
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
    if (path.startsWith("/assets/")) path = "/public" + path;
    const file = join(HERE, path.replace(/^\/+/, ""));
    if (!file.startsWith(HERE)) return send(res, 403, "no");
    const body = await readFile(file);
    return send(res, 200, body, TYPES[extname(file)] || "application/octet-stream");
  } catch (e) {
    return send(res, 500, String(e.message || e));
  }
});

server.listen(PORT, () => console.log(`Rung running on http://localhost:${PORT}`));
