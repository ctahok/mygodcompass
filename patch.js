const fs = require('fs');

let mmdCode = fs.readFileSync('src/components/MermaidMap.tsx', 'utf8');

// 1. Turn off htmlLabels
mmdCode = mmdCode.replace('htmlLabels: true', 'htmlLabels: false');

// 2. Simplify mmd function to the absolute bare minimum for htmlLabels: false
const newMmd = `function mmd(s: string): string {
  if (!s) return "";
  let text = s;
  // If running in browser, decode once to remove any stray &amp; etc.
  if (typeof document !== 'undefined') {
    const doc = new DOMParser().parseFromString(text, "text/html");
    text = doc.documentElement.textContent || text;
  } else {
    text = text.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&#8212;/g, '—').replace(/&#40;/g, '(').replace(/&#41;/g, ')');
  }

  // Mermaid strings use Node["Label"] or Node -->|"Label"| Node
  // We ONLY need to escape quotes, brackets, and ensure newlines are \n
  return text
    .replace(/"/g, "#quot;") // Mermaid's specific entity for quotes
    .replace(/\\(/g, "#40;")
    .replace(/\\)/g, "#41;")
    .replace(/\\[/g, "#91;")
    .replace(/\\]/g, "#93;")
    .replace(/;/g, "#59;") // Protect semicolons
    .replace(/</g, "&lt;") // Protect against stray tags just in case
    .replace(/>/g, "&gt;")
    .replace(/\\n/g, "\\n"); // Ensure literal newline character is preserved
}`;

mmdCode = mmdCode.replace(/function mmd\(s: string\): string \{[\s\S]*?\n\}/, newMmd);
fs.writeFileSync('src/components/MermaidMap.tsx', mmdCode);
console.log("MermaidMap patched.");

let qCode = fs.readFileSync('src/components/QuestionCard.tsx', 'utf8');

// Conditionally render the tooltip to physically remove it when closed
qCode = qCode.replace(
  /return \(\n\s*<span\n\s*ref=\{tooltipRef\}[\s\S]*?\{children\}\n\s*<span\n[\s\S]*?<\/span>\n\s*<\/span>\n\s*\);/m,
  `if (!open || !position) return null;
  return (
    <span
      ref={tooltipRef}
      onClick={(e: any) => e.stopPropagation()}
      style={{
        position: "fixed",
        left: \`\${position.left}px\`,
        top: \`\${position.top}px\`,
        zIndex: 99999, // Ensure it's above any frames/cards
      }}
      className={\`w-max max-w-[calc(100vw-2rem)] sm:max-w-[320px] max-h-[calc(100vh-1rem)] overflow-y-auto rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] leading-snug text-slate-300 shadow-xl \${
        position.placement === "above" ? "mb-2" : "mt-2"
      }\`}
    >
      {children}
      <span
        className={\`absolute left-1/2 -translate-x-1/2 border-4 border-transparent \${
          position.placement === "above"
            ? "top-full border-t-slate-700"
            : "bottom-full border-b-slate-700"
        }\`}
      />
    </span>
  );`
);

fs.writeFileSync('src/components/QuestionCard.tsx', qCode);
console.log("QuestionCard patched.");

