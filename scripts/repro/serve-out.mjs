// Tiny static server for the Next.js export in `out/`.
// Run: node scripts/repro/serve-out.mjs
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..", "out");
const PORT = 8788;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".txt": "text/plain; charset=utf-8",
  ".woff2": "font/woff2",
};

async function resolve(urlPath) {
  const rel = decodeURIComponent(urlPath.split("?")[0]);
  const base = path.join(ROOT, rel);
  const candidates =
    rel.endsWith("/") || rel === ""
      ? [path.join(base, "index.html")]
      : [base, `${base}.html`, path.join(base, "index.html")];
  for (const c of candidates) {
    if (!c.startsWith(ROOT)) continue;
    try {
      await readFile(c);
      return c;
    } catch {}
  }
  return null;
}

http
  .createServer(async (req, res) => {
    const file = await resolve(req.url || "/");
    if (!file) {
      res.writeHead(404, { "content-type": "text/plain" }).end("not found");
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  })
  .listen(PORT, "127.0.0.1", () => console.log(`out/ on http://127.0.0.1:${PORT}/`));
