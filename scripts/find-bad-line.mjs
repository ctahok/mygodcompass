import { JSDOM } from "jsdom";
import { NODES, TERMINALS } from "../src/data/ontology.ts";

function mmd(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "#quot;")
    .replace(/#/g, "#35;")
    .replace(/—/g, "#8212;")
    .replace(/[^\x00-\x7F]/g, (c) => `#${c.codePointAt(0)};`)
    .replace(/\n/g, "<br/>");
}

const dom = new JSDOM("<!DOCTYPE html><html><body></body></html>", { pretendToBeVisual: true });
global.window = dom.window;
global.document = dom.window.document;
Object.defineProperty(global, "navigator", { value: dom.window.navigator, configurable: true });
global.DOMParser = dom.window.DOMParser;
global.Node = dom.window.Node;
global.Element = dom.window.Element;
global.SVGElement = dom.window.SVGElement;
global.CSSStyleSheet = dom.window.CSSStyleSheet;
global.getComputedStyle = dom.window.getComputedStyle;
global.SVGElement.prototype.getBBox = function () {
  const r = this.getBoundingClientRect?.();
  const w = parseFloat(this.getAttribute?.("width") || "") || 100;
  const h = parseFloat(this.getAttribute?.("height") || "") || 30;
  return { x: 0, y: 0, width: r?.width || w, height: r?.height || h };
};
global.SVGElement.prototype.getComputedTextLength = function () {
  return (this.textContent || "").length * 7;
};

const mermaid = (await import("mermaid")).default;
mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "dark", flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: false } });

const lang = process.argv[2] || "ru";
const lines = ["flowchart TD"];
for (const node of Object.values(NODES)) lines.push(`  ${node.node_id}["${mmd(node.question[lang])}"]`);
for (const term of Object.values(TERMINALS)) lines.push(`  ${term.node_id}(["${mmd(term.title[lang])}"])`);
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    lines.push(`  ${node.node_id} -->|"${mmd(opt.label[lang])}"| ${opt.next_node}`);
  }
}
lines.push(`  class ${Object.keys(TERMINALS).join(",")} term;`);

// binary search the failing line
const full = lines.join("\n");
try {
  await mermaid.render("probe", full);
  console.log("FULL OK");
} catch (e) {
  // find first failing line by bisection on line count
  let lo = 1, hi = lines.length;
  const renders = async (n) => {
    try { await mermaid.render(`p-${n}`, lines.slice(0, n).join("\n")); return true; }
    catch { return false; }
  };
  while (lo < hi) {
    const mid = Math.ceil((lo + hi) / 2);
    if (await renders(mid)) lo = mid; else hi = mid - 1;
  }
  // lo = last good line; failing line = lo+1 (0-indexed lo)
  const bad = lines[lo]; // index lo is the first that failed? bisection: lo is last good COUNT, so failing index = lo (0-based)
  console.log("FAILING LINE (index " + lo + "):");
  console.log(bad);
  // find suspicious chars
  const suspicious = (bad.match(/[^\x00-\x7F\u0400-\u04FF\u0500-\u052F]/g) || []);
  console.log("non-cyrillic non-ascii chars:", [...new Set(suspicious)]);
}
