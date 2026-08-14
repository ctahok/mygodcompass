// Validate: generate the same mermaid source the component does, render it via mermaid in jsdom.
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

function buildSource(lang, path = []) {
  const lines = ["flowchart TD"];
  const edgeIndex = new Map();
  let idx = 0;
  for (const node of Object.values(NODES)) lines.push(`  ${node.node_id}["${mmd(node.question[lang])}"]`);
  for (const term of Object.values(TERMINALS)) lines.push(`  ${term.node_id}(["${mmd(term.title[lang])}"])`);
  for (const node of Object.values(NODES)) {
    for (const opt of node.options) {
      edgeIndex.set(`${node.node_id}->${opt.next_node}`, idx++);
      lines.push(`  ${node.node_id} -->|"${mmd(opt.label[lang])}"| ${opt.next_node}`);
    }
  }
  lines.push(`  classDef term fill:#3b1d05,stroke:#fbbf24,color:#fde68a,stroke-width:1.5px;`);
  lines.push(`  classDef onp fill:#451a03,stroke:#fbbf24,color:#fde68a,stroke-width:1px;`);
  lines.push(`  classDef cur fill:#fbbf24,stroke:#fff7ed,color:#451a03,stroke-width:2px;`);
  const termIds = Object.keys(TERMINALS);
  lines.push(`  class ${termIds.join(",")} term;`);
  lines.push(`  class existence cur;`);
  return lines.join("\n");
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
// jsdom lacks SVG getBBox — polyfill with a cheap estimate
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

for (const lang of ["en", "ru", "az"]) {
  const src = buildSource(lang);
  try {
    const { svg } = await mermaid.render(`probe-${lang}`, src);
    const nNodes = (svg.match(/class="node"/g) || []).length;
    const nEdges = (svg.match(/class="edgePath"/g) || []).length;
    console.log(`${lang}: render OK, nodes=${nNodes}, edges=${nEdges}, svgLen=${svg.length}`);
  } catch (e) {
    console.log(`${lang}: RENDER FAILED: ${e.message.slice(0, 300)}`);
  }
}
