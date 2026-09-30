// End-to-end check: load the built app in headless Chrome, click "Begin",
// and report whether the mermaid map actually rendered (and screenshot it).
// Run: node scripts/repro/e2e.mjs
import { spawn } from "node:child_process";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const CHROME = process.env.CHROME || "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PORT = Number(process.env.CDP_PORT || 9333);
const APP_URL = process.env.APP_URL || "http://127.0.0.1:8788/en/";
const SHOT = path.join(HERE, "shot.png");

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const chrome = spawn(
  CHROME,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${path.join(process.env.TEMP, "chrome-e2e")}`,
    "--window-size=1440,1600",
    "--hide-scrollbars",
    "--no-first-run",
    "about:blank",
  ],
  { stdio: "ignore" },
);

async function waitHttp(url, ms = 25000) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    try {
      const r = await fetch(url);
      if (r.ok || r.status === 405) return r;
    } catch {}
    await sleep(300);
  }
  throw new Error(`timeout waiting for ${url}`);
}

let msgId = 0;
const pending = new Map();
const consoleErrors = [];
const pageErrors = [];

try {
  await waitHttp(`http://127.0.0.1:${PORT}/json/version`);

  const t = await fetch(`http://127.0.0.1:${PORT}/json/new?${encodeURIComponent(APP_URL)}`, {
    method: "PUT",
  }).then((r) => r.json());

  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((res, rej) => {
    ws.onopen = res;
    ws.onerror = () => rej(new Error("cdp websocket failed"));
  });

  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data.toString());
    if (m.id && pending.has(m.id)) {
      const { res, rej } = pending.get(m.id);
      pending.delete(m.id);
      m.error ? rej(new Error(m.error.message)) : res(m.result);
      return;
    }
    if (m.method === "Runtime.consoleAPICalled" && m.params?.type === "error") {
      consoleErrors.push((m.params.args || []).map((a) => a.value ?? a.description ?? "").join(" "));
    }
    if (m.method === "Runtime.exceptionThrown") {
      pageErrors.push(m.params?.exceptionDetails?.text || "exception");
    }
    if (m.method === "Log.entryAdded" && m.params?.entry?.level === "error") {
      consoleErrors.push(m.params.entry.text);
    }
  };

  const send = (method, params = {}) =>
    new Promise((res, rej) => {
      const id = ++msgId;
      pending.set(id, { res, rej });
      ws.send(JSON.stringify({ id, method, params }));
    });

  const evalJs = async (expression) => {
    const r = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (r.exceptionDetails) return `EVAL_ERROR: ${r.exceptionDetails.text}`;
    return r.result?.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Log.enable");

  await sleep(3500); // hydrate

  const before = await evalJs(`JSON.stringify({ title: document.title, buttons: [...document.querySelectorAll("button")].map(b=>b.textContent.trim()).filter(Boolean).slice(0,6) })`);

  const clicked = await evalJs(`(() => {
    const b = [...document.querySelectorAll("button")].find((x) => x.className.includes("from-amber-400"));
    if (!b) return "NO_START_BUTTON";
    b.click();
    return "CLICKED:" + b.textContent.trim();
  })()`);

  await sleep(5000); // dynamic import of mermaid + render + auto-fit

  const report = await evalJs(`(() => {
    const host = document.querySelector(".mermaid-svg-host");
    if (!host) return JSON.stringify({ hostPresent: false, body: document.body.innerText.slice(0, 300) });
    const svg = host.querySelector("svg");
    const text = host.innerText || "";
    return JSON.stringify({
      hostPresent: true,
      hasSvg: !!svg,
      svgLength: svg ? svg.outerHTML.length : 0,
      nodeCount: svg ? svg.querySelectorAll(".node").length : 0,
      edgeCount: svg ? svg.querySelectorAll(".edgePath").length : 0,
      errorShown: text.includes("Diagram rendering"),
      loading: text.includes("Loading decision map"),
      visibleText: text.replace(/\\s+/g, " ").trim().slice(0, 200),
    });
  })()`);

  const shot = await send("Page.captureScreenshot", { format: "png" });
  await mkdir(HERE, { recursive: true });
  await writeFile(SHOT, Buffer.from(shot.data, "base64"));

  console.log(JSON.stringify({ before, clicked, report, consoleErrors, pageErrors, shot: SHOT }, null, 2));
  ws.close();
} catch (e) {
  console.log(JSON.stringify({ harnessError: String(e && e.stack ? e.stack : e), consoleErrors, pageErrors }, null, 2));
} finally {
  chrome.kill();
}
