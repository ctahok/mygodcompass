// Temporary Mermaid repro harness: serves the repo + generated diagram
// sources so headless Chrome can render them exactly like the app does.
// Run:  npx tsx scripts/repro/serve.mts
// Then: chrome --headless=new --dump-dom http://127.0.0.1:8787/
import http from "node:http";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { NODES } from "@/data/ontology";
import { buildMermaidSource } from "@/lib/mermaidSource";
import type { PathStep } from "@/store/wizardStore";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");
const PORT = 8787;

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".ico": "image/x-icon",
};

/** Deterministically walk the graph to build a few realistic paths. */
function walk(seed: number, steps = 6): PathStep[] {
  const path: PathStep[] = [];
  let nodeId = "start";
  for (let i = 0; i < steps; i++) {
    const node = NODES[nodeId];
    if (!node || !node.choices.length) break;
    const c = node.choices[(seed + i) % node.choices.length];
    const next = c.next || [];
    path.push({ nodeId, choiceIds: [c.id], tags: [], nextNodeIds: next });
    if (!next.length) break;
    nodeId = next[(seed + i) % next.length];
  }
  return path;
}

function buildCases() {
  const cases: { name: string; id: string; src: string }[] = [];
  let n = 0;
  for (const lang of ["en", "ru", "az"] as const) {
    for (const viewMode of ["pruned", "full"] as const) {
      for (let seed = 0; seed < 5; seed++) {
        const path = walk(seed);
        cases.push({
          name: `${lang}/${viewMode}/path${seed}(len=${path.length})`,
          id: `case-${n++}`,
          src: buildMermaidSource({ path, lang, viewMode }),
        });
      }
    }
  }
  return cases;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = (req.url || "/").split("?")[0];

    if (url === "/") {
      const html = await readFile(path.join(ROOT, "scripts", "repro", "repro.html"));
      res.writeHead(200, { "content-type": MIME[".html"] });
      res.end(html);
      return;
    }

    if (url === "/sources.json") {
      res.writeHead(200, { "content-type": MIME[".json"] });
      res.end(JSON.stringify(buildCases()));
      return;
    }

    const file = path.join(ROOT, decodeURIComponent(url));
    if (!file.startsWith(ROOT)) {
      res.writeHead(403).end("forbidden");
      return;
    }
    const data = await readFile(file);
    res.writeHead(200, { "content-type": MIME[path.extname(file)] || "application/octet-stream" });
    res.end(data);
  } catch {
    res.writeHead(404).end("not found");
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`repro server on http://127.0.0.1:${PORT}/`);
});
