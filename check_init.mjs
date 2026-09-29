import mermaid from 'mermaid';
const result = mermaid.default ? mermaid.default.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "dark",
  fontFamily: "inherit",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 10,
    useMaxWidth: false,
    nodeSpacing: 36,
    rankSpacing: 48,
  },
}) : mermaid.initialize({
  startOnLoad: false,
  securityLevel: "loose",
  theme: "dark",
  fontFamily: "inherit",
  flowchart: {
    htmlLabels: true,
    curve: "basis",
    padding: 10,
    useMaxWidth: false,
    nodeSpacing: 36,
    rankSpacing: 48,
  },
});
console.log("Init result:", result);
