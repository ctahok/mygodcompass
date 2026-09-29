import mermaid from 'mermaid';
console.log("type:", typeof mermaid);
console.log("keys:", Object.keys(mermaid));
console.log("default:", typeof mermaid.default, mermaid.default ? Object.keys(mermaid.default).slice(0,10) : "none");
console.log("render:", typeof mermaid.render);
console.log("default.render:", mermaid.default ? typeof mermaid.default.render : "n/a");
