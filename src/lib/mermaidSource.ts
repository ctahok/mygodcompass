// ============================================================
// mermaidSource — pure builder for the Theogony Decision Map
// mermaid.js source (flowchart). Extracted from <MermaidMap />
// so it can be unit-tested and reproduced outside React.
// ============================================================

import { NODES, type Lang } from "@/data/ontology";
import { pathNodeIds, type PathStep } from "@/store/wizardStore";

export interface BuildMermaidSourceOptions {
  path: PathStep[];
  lang: Lang;
  viewMode: "pruned" | "full";
}

/**
 * Clean and escape label text safely for Mermaid node/edge labels.
 * Avoids double-escaping entities and strips syntax breakers.
 */
export function mmd(s: string): string {
  if (!s) return "";
  return s
    .replace(/"/g, "'") // replace double quotes with single quotes inside Mermaid labels
    .replace(/[;\\|]/g, " ") // avoid semicolons/backslashes/pipes breaking line lexing
    .replace(/[<>{}]/g, "") // strip angle/curly brackets
    .replace(/\s+/g, " ") // collapse newlines and extra spaces
    .trim();
}

export function buildMermaidSource({ path, lang, viewMode }: BuildMermaidSourceOptions): string {
  const l: Lang = lang;
  const lines: string[] = [];
  lines.push("flowchart TD");

  const pathIds = new Set(pathNodeIds({ path }));

  // In pruned view, include path nodes plus immediate next candidates
  const activeNodes = new Set<string>();
  if (viewMode === "pruned") {
    for (const id of pathIds) activeNodes.add(id);
    // add next nodes from the last path step
    if (path.length > 0) {
      const lastStep = path[path.length - 1];
      for (const nxt of lastStep.nextNodeIds) activeNodes.add(nxt);
    } else {
      // at start: include start and its immediate targets
      activeNodes.add("start");
      const startNode = NODES.start;
      if (startNode) {
        for (const c of startNode.choices) {
          for (const nxt of c.next || []) activeNodes.add(nxt);
        }
      }
    }
  } else {
    // Full DAG
    for (const id of Object.keys(NODES)) activeNodes.add(id);
  }

  // Nodes
  for (const nid of activeNodes) {
    const node = NODES[nid];
    if (!node) continue;
    const q = node.prompt?.[l] || node.id;
    lines.push(`  ${nid}["${mmd(q)}"]`);
  }

  // Edges
  for (const nid of activeNodes) {
    const node = NODES[nid];
    if (!node) continue;
    for (const opt of node.choices) {
      for (const next of opt.next || []) {
        if (activeNodes.has(next)) {
          const edgeLabel = mmd(opt.label?.[l] || opt.id);
          if (edgeLabel) {
            lines.push(`  ${nid} -->|"${edgeLabel}"| ${next}`);
          } else {
            lines.push(`  ${nid} --> ${next}`);
          }
        }
      }
    }
  }

  // Class styles
  lines.push(`  classDef default fill:#1e293b,stroke:#475569,color:#e2e8f0,stroke-width:1.5px;`);
  lines.push(`  classDef cur fill:#fbbf24,stroke:#fff7ed,color:#0f172a,stroke-width:2.5px;`);
  lines.push(`  classDef past fill:#78350f,stroke:#f59e0b,color:#fef3c7,stroke-width:1.5px;`);

  // Apply classes: current active node vs earlier visited path
  const pathArr = Array.from(pathIds);
  const lastNode = path.length > 0 ? (path[path.length - 1].nextNodeIds[0] || pathArr[pathArr.length - 1]) : "start";
  for (const pid of pathArr) {
    if (pid === lastNode) {
      lines.push(`  class ${pid} cur;`);
    } else {
      lines.push(`  class ${pid} past;`);
    }
  }

  return lines.join("\n");
}
