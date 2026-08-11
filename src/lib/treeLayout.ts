// ============================================================
// Tree layout engine for the FamilyTree visualization.
// Converts the DAG into positioned React Flow nodes.
// ============================================================

import { NODES, TERMINALS, buildEdges, maxDepthFrom, isTerminal } from "@/data/ontology";
import type { Lang } from "@/data/ontology";
import type { Choice } from "@/store/wizardStore";

export interface TreeNode {
  id: string;
  label: string;
  isTerminal: boolean;
  depth: number;
  x: number;
  y: number;
}

export interface TreeEdge {
  source: string;
  target: string;
  active: boolean;
  rejected: boolean;
}

const X_GAP = 60;
const Y_GAP = 130;
const TERMINAL_W = 170;
const NODE_W = 150;

/** Assigns column (depth) and row via DFS, returns positioned nodes */
export function buildTreeLayout(lang: Lang, path: Choice[]): { nodes: TreeNode[]; edges: TreeEdge[] } {
  const pathIds = new Set<string>(["existence"]);
  for (const c of path) {
    pathIds.add(c.nodeId);
    pathIds.add(c.nextNode);
  }

  // last answered option edges — the active trail
  const activeEdges = new Set<string>();
  for (const c of path) {
    const node = NODES[c.nodeId];
    if (node && node.options[c.optionIndex]) {
      activeEdges.add(`${c.nodeId}->${node.options[c.optionIndex].next_node}`);
    }
  }

  // DFS assign rows; group by depth column
  const depthRows: Map<number, number> = new Map();
  const rowOf = new Map<string, { row: number; depth: number }>();

  const dfs = (nodeId: string, depth: number) => {
    if (rowOf.has(nodeId)) return;
    const row = depthRows.get(depth) ?? 0;
    rowOf.set(nodeId, { row, depth });
    depthRows.set(depth, row + 1);
    const node = NODES[nodeId];
    if (!node) return; // terminal
    for (const opt of node.options) {
      dfs(opt.next_node, depth + 1);
    }
  };
  dfs("existence", 0);

  // X: column by depth, Y: row within column
  const nodes: TreeNode[] = [];
  rowOf.forEach(({ row, depth }, id) => {
    const node = NODES[id];
    const term = TERMINALS[id];
    let label = id;
    if (node) label = node.question[lang];
    else if (term) label = term.title[lang];
    nodes.push({
      id,
      label,
      isTerminal: isTerminal(id),
      depth,
      x: depth * (NODE_W + X_GAP),
      y: row * (TERMINAL_W + Y_GAP),
    });
  });

  // edges with active/rejected status
  const edges: TreeEdge[] = buildEdges().map((e) => {
    const key = `${e.source}->${e.target}`;
    const onPath = pathIds.has(e.source) && pathIds.has(e.target);
    return {
      ...e,
      active: activeEdges.has(key),
      rejected: onPath && !activeEdges.has(key),
    };
  });

  return { nodes, edges };
}

export function treeMaxDepth(): number {
  return maxDepthFrom("existence");
}
