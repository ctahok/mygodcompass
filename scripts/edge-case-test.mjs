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
  "raw em-dash + az chars": 'flowchart TD\n  A["Ali güc mövcuddurmu?"]\n  A -->|"Xeyr — mən ateistəm"| B\n  B(["Term"])',
  "entities": 'flowchart TD\n  A["Ali güc mövcuddurmu?"]\n  A -->|"Xeyr #8212; m#601;n ateist#601;m"| B\n  B(["Term"])',
  "no quotes edge": 'flowchart TD\n  A["Ali güc mövcuddurmu?"]\n  A -->|Xeyr #8212; m#601;n ateist#601;m| B\n  B(["Term"])',
  "no dash": 'flowchart TD\n  A["Ali güc mövcuddurmu?"]\n  A -->|"Xeyr m#601;n ateist#601;m"| B\n  B(["Term"])',
  "dash only in node": 'flowchart TD\n  A["Ali güc mövcuddurmu?"]\n  A -->|"Xeyr"| B\n  B(["Term #8212; x"])',
  "amp entity in edge": 'flowchart TD\n  A["Q"]\n  A -->|"A &amp; B"| B\n  B(["T"])',
  "semicolon text in edge": 'flowchart TD\n  A["Q"]\n  A -->|"x; y"| B\n  B(["T"])',
};

for (const [name, src] of Object.entries(cases)) {
  try {
    const { svg } = await mermaid.render(`t-${name.replace(/[^a-z0-9]/gi, "")}`, src);
    console.log(`${name}: OK (${svg.length} bytes)`);
  } catch (e) {
    console.log(`${name}: FAIL — ${e.message.slice(0, 120)}`);
  }
}
