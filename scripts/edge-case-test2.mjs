import { JSDOM } from "jsdom";

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

const cases = {
  "node 8212": 'flowchart TD\n  B(["Term #8212; x"])',
  "node 151": 'flowchart TD\n  B(["Term #151; x"])',
  "node literal dash": 'flowchart TD\n  B(["Term — x"])',
  "node 601 (ə)": 'flowchart TD\n  B(["m#601;n"])',
  "node 601 literal": 'flowchart TD\n  B(["mən"])',
  "node html entity": 'flowchart TD\n  B(["Term &#8212; x"])',
  "node &mdash;": 'flowchart TD\n  B(["Term &mdash; x"])',
  "node charref numeric": 'flowchart TD\n  B(["Term &#151; x"])',
  "node hash inside word": 'flowchart TD\n  B(["abc #35; def"])',
  "node curly quotes": 'flowchart TD\n  B(["«Term» — x"])',
  "node apostrophe": 'flowchart TD\n  B(["l\'homme"])',
  "full ru-ish node": 'flowchart TD\n  A["Существует ли высшая сила?"]\n  A -->|"Да — верю"| B\n  B(["Атеист"])',
};

for (const [name, src] of Object.entries(cases)) {
  try {
    const { svg } = await mermaid.render(`t-${name.replace(/[^a-z0-9]/gi, "")}`, src);
    const has = svg.includes("error") && svg.length < 5000 ? " (tiny!)" : "";
    console.log(`${name}: OK (${svg.length} bytes${has})`);
  } catch (e) {
    console.log(`${name}: FAIL — ${e.message.slice(0, 100)}`);
  }
}
