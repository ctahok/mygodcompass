import mermaid from 'mermaid';
mermaid.default?.initialize ? mermaid.default.initialize({ startOnLoad: false, theme: 'dark', flowchart: { htmlLabels: false, curve: 'basis' } }) : mermaid.initialize({ startOnLoad: false, theme: 'dark', flowchart: { htmlLabels: false, curve: 'basis' } });
const src = `flowchart TD\n  A["Test &#40;parens&#41;"]`;
try {
  const result = await mermaid.render('t1', src);
  console.log('OK, len=', result.svg.length, 'error?', result.svg.includes('Syntax error'));
} catch (e) {
  console.error('FAIL', e.message);
}
