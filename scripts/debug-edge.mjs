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

const lang = "az";
const lines = ["flowchart TD"];
for (const node of Object.values(NODES)) lines.push(`  ${node.node_id}["${mmd(node.question[lang])}"]`);
for (const term of Object.values(TERMINALS)) lines.push(`  ${term.node_id}(["${mmd(term.title[lang])}"])`);
for (const node of Object.values(NODES)) {
  for (const opt of node.options) {
    lines.push(`  ${node.node_id} -->|"${mmd(opt.label[lang])}"| ${opt.next_node}`);
  }
}
lines.push(`  class ${Object.keys(TERMINALS).join(",")} term;`);

// Show the exact failing line and try rendering with detailed parse
console.log("LINE 234 (az):");
console.log(lines[234]);
console.log("LINE 235 (az):");
console.log(lines[235]);
console.log("LINE 236 (az):");
console.log(lines[236]);

// Try a minimal graph with this exact edge
const edge = lines[234].trim();
const src = `flowchart TD\n  existence["Ali güc mövcuddurmu?"]\n  ${edge}\n  terminal_secular_humanist(["Sekulyar Humanist"])`;
try {
  const { svg } = await mermaid.render("mini", src);
  console.log("MINIMAL WITH EXACT EDGE: OK", svg.length);
} catch (e) {
  console.log("MINIMAL WITH EXACT EDGE: FAIL —", e.message.slice(0, 200));
}

// Try with the entity rendered as literal em dash instead
const src2 = `flowchart TD\n  existence["Ali güc mövcuddurmu?"]\n  existence -->|"Xeyr — mən ateistəm"| terminal_secular_humanist\n  terminal_secular_humanist(["Sekulyar Humanist"])`;
try {
  const { svg } = await mermaid.render("mini2", src2);
  console.log("MINIMAL RAW EDGE: OK", svg.length);
} catch (e) {
  console.log("MINIMAL RAW EDGE: FAIL —", e.message.slice(0, 200));
}
