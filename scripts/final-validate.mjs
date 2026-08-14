import { JSDOM } from "jsdom";
import { NODES, TERMINALS } from "../src/data/ontology.ts";

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

function mmd(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "#quot;")
    .replace(/#/g, "#35;")
    .replace(/—/g, "#8212;")
    .replace(/[^\x00-\x7F]/g, (c) => `#${c.codePointAt(0)};`)
    .replace(/\n/g, "<br/>");
}

function buildSource(lang) {
  const lines = ["flowchart TD"];
  for (const n of Object.values(NODES)) lines.push(`  ${n.node_id}["${mmd(n.question[lang])}"]`);
  for (const t of Object.values(TERMINALS)) lines.push(`  ${t.node_id}(["${mmd(t.title[lang])}"])`);
  for (const n of Object.values(NODES)) {
    for (const o of n.options) {
      lines.push(`  ${n.node_id} -->|"${mmd(o.label[lang])}"| ${o.next_node}`);
    }
  }
  lines.push(`  class ${Object.keys(TERMINALS).join(",")} term;`);
  return lines.join("\n");
}

const mermaid = (await import("mermaid")).default;
mermaid.initialize({ startOnLoad: false, securityLevel: "loose", theme: "dark", flowchart: { htmlLabels: true, curve: "basis", useMaxWidth: false } });

for (const lang of ["en", "ru", "az"]) {
  const src = buildSource(lang);
  try {
    const { svg } = await mermaid.render(`test-${lang}`, src);
    // crude node count via pattern
    const nNodes = (svg.match(/class="node"/g) || []).length;
    const nEdges = (svg.match(/class="edgePath"/g) || []).length;
    console.log(`${lang}: OK nodes=${nNodes} edges=${nEdges} svg=${svg.length}`);
  } catch (e) {
    console.log(`${lang}: FAIL — ${e.message.slice(0, 200)}`);
  }
}
