// ============================================================
// Tree layout engine for the FamilyTree visualization (v2).
// Converts the multi-axis DAG into positioned React Flow nodes.
// ============================================================

import { NODES } from "@/data/ontology";
import type { Lang } from "@/data/ontology";

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
export function buildTreeLayout(lang: Lang, path: { nodeId: string; choiceIds: string[]; nextNodeIds: string[] }[]): { nodes: TreeNode[]; edges: TreeEdge[] } {
  const pathIds = new Set<string>(["start"]);
  for (const c of path) {
    pathIds.add(c.nodeId);
    for (const nxt of c.nextNodeIds) pathIds.add(nxt);
  }

  // last answered option edges — the active trail
  const activeEdges = new Set<string>();
  for (const c of path) {
    const node = NODES[c.nodeId];
    if (node) {
      for (const cid of c.choiceIds) {
        const choice = node.choices.find(ch => ch.id === cid);
        if (choice && choice.next) {
          for (const nxt of choice.next) {
            activeEdges.add(`${c.nodeId}->${nxt}`);
          }
        }
      }
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
    if (!node) return;
    for (const opt of node.choices) {
      for (const nxt of opt.next || []) {
        dfs(nxt, depth + 1);
      }
    }
  };
  dfs("start", 0);

  // X: column by depth, Y: row within column
  const nodes: TreeNode[] = [];
  rowOf.forEach(({ row, depth }, id) => {
    const node = NODES[id];
    const isTerminal = !node || node.choices.length === 0 || node.choices.every(c => !c.next || c.next.length === 0);
    let label = id;
    if (node) label = node.prompt?.[lang] || node.id;
    nodes.push({
      id,
      label,
      isTerminal,
      depth,
      x: depth * (NODE_W + X_GAP),
      y: row * (TERMINAL_W + Y_GAP),
    });
  });

  // edges with active/rejected status
  const edges: TreeEdge[] = [];
  for (const node of Object.values(NODES)) {
    for (const opt of node.choices) {
      for (const nxt of opt.next || []) {
        const key = `${node.id}->${nxt}`;
        const onPath = pathIds.has(node.id) && pathIds.has(nxt);
        edges.push({
          source: node.id,
          target: nxt,
          active: activeEdges.has(key),
          rejected: onPath && !activeEdges.has(key),
        });
      }
    }
  }

  return { nodes, edges };
}

export function treeMaxDepth(): number {
  let maxDepth = 0;
  const visited = new Set<string>();
  
  const dfs = (nodeId: string, depth: number) => {
    if (visited.has(nodeId)) return;
    visited.add(nodeId);
    maxDepth = Math.max(maxDepth, depth);
    const node = NODES[nodeId];
    if (!node) return;
    for (const opt of node.choices) {
      for (const nxt of opt.next || []) {
        dfs(nxt, depth + 1);
      }
    }
  };
  dfs("start", 0);
  return maxDepth;
}