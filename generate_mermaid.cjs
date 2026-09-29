const { JSDOM } = require('jsdom');
const mermaid = require('mermaid');
const fs = require('fs');

const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>');
global.document = dom.window.document;
global.window = dom.window;

mermaid.default?.initialize ? mermaid.default.initialize({ startOnLoad: false, theme: 'dark', flowchart: { htmlLabels: false, curve: 'basis', padding: 10, useMaxWidth: false, nodeSpacing: 36, rankSpacing: 48 } }) : mermaid.initialize({ startOnLoad: false, theme: 'dark', flowchart: { htmlLabels: false, curve: 'basis', padding: 10, useMaxWidth: false, nodeSpacing: 36, rankSpacing: 48 } });

function mmd(s) {
  if (!s) return "";
  let text = s;
  if (typeof document !== 'undefined') {
    const doc = new DOMParser().parseFromString(text, "text/html");
    text = doc.documentElement.textContent || text;
  }
  return text
    .replace(/"/g, "&quot;")
    .replace(/;/g, "&#59;")
    .replace(/\(/g, "&#40;")
    .replace(/\)/g, "&#41;")
    .replace(/\[/g, "&#91;")
    .replace(/\]/g, "&#93;")
    .replace(/—/g, "&#8212;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, " ");
}

// Simplified source for testing (English initial node)
const src = `flowchart TD
  start["How do you understand ultimate reality?"]
  reality["How does ultimate reality relate?"]
  start -->|"How is truth best known?"| reality
`;

const container = document.createElement('div');
document.body.appendChild(container);

mermaid.render('test', src, container)
  .then(({ svg }) => {
    console.log('SVG generated, length:', svg.length);
    console.log('Contains error?', svg.includes('Syntax error'));
    fs.writeFileSync('/home/iliko/projects/ontological-compass/test_mermaid_output.svg', svg);
    console.log('Saved to test_mermaid_output.svg');
  })
  .catch((e) => console.error('FAIL:', e.message));
