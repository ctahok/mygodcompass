// ============================================================
// WizardEngine — Zustand store
// Tracks the path (history of choices), enables Back, and
// computes coherence from accumulated tags.
// ============================================================

import { create } from "zustand";
import { getNode, getTerminal, isTerminal, maxDepthFrom, type Lang } from "@/data/ontology";

export interface Choice {
  nodeId: string;
  optionIndex: number;
  tags: string[];
  /** The node we navigated to */
  nextNode: string;
}

export type CoherenceState = "neutral" | "coherent" | "conflict";

interface WizardState {
  /** History of choices; empty = at start node */
  path: Choice[];
  /** Whether the user has clicked "Begin the Journey" */
  begun: boolean;
  /** Localization used for UI (mirrors i18next) */
  lang: Lang;
  /** Reveal the first question */
  begin: () => void;
  /** Answer a question */
  answer: (optionIndex: number) => void;
  /** Go back one step */
  back: () => void;
  /** Reset the whole journey */
  reset: () => void;
  setLang: (l: Lang) => void;
}

// ------------------------------------------------------------
// Coherence rules — tag pairs that reward or penalize
// ------------------------------------------------------------
const COHERENT_PAIRS: [string, string][] = [
  ["interventionist", "theism"],
  ["monotheist", "theism"],
  ["personalism", "theism"],
  ["spinozism", "pantheist"],
  ["hegelianism", "pantheist"],
  ["classical_theism", "impersonal"],
  ["durkheimian", "constructivist"],
  ["jungian", "constructivist"],
  ["christian", "trinitarian"],
  ["protestant", "christian"],
  ["orthodox", "christian"],
  ["catholic", "christian"],
];

const CONFLICT_PAIRS: [string, string][] = [
  // Constructivist + Realist can't coexist
  ["constructivist", "realist"],
  // Impersonal force + personal will
  ["impersonal", "personalism"],
  // Pantheism + classical separate God
  ["pantheist", "classical_theism"],
  // Deism (leaves alone) + interventionist
  ["deism", "interventionist"],
  // Polytheism + strict monotheism
  ["polytheist", "monotheist"],
];

/** Coherence score: positive = consistent, negative = conflicted */
export function computeCoherence(tags: string[]): number {
  let score = 0;
  for (const [a, b] of COHERENT_PAIRS) {
    if (tags.includes(a) && tags.includes(b)) score += 1;
  }
  for (const [a, b] of CONFLICT_PAIRS) {
    if (tags.includes(a) && tags.includes(b)) score -= 2;
  }
  return score;
}

export function coherenceState(tags: string[]): CoherenceState {
  const s = computeCoherence(tags);
  if (s < 0) return "conflict";
  if (s > 0) return "coherent";
  return "neutral";
}

const START_NODE = "existence";

export const useWizard = create<WizardState>((set, get) => ({
  path: [],
  begun: false,
  lang: "en",

  begin: () => set({ begun: true }),

  answer: (optionIndex: number) => {
    const { path } = get();
    const currentNode = path.length === 0 ? START_NODE : path[path.length - 1].nextNode;
    const node = getNode(currentNode);
    const option = node.options[optionIndex];
    if (!option) return;
    const choice: Choice = {
      nodeId: currentNode,
      optionIndex,
      tags: option.tags,
      nextNode: option.next_node,
    };
    set({ path: [...path, choice] });
  },

  back: () => set((s) => ({ path: s.path.slice(0, -1) })),

  reset: () => set({ path: [], begun: false }),

  setLang: (l: Lang) => set({ lang: l }),
}));

// ------------------------------------------------------------
// Selectors / derived helpers
// ------------------------------------------------------------

export function currentNodeId(state: { path: Choice[] }): string {
  if (state.path.length === 0) return START_NODE;
  return state.path[state.path.length - 1].nextNode;
}

export function isAtTerminal(state: { path: Choice[] }): boolean {
  return isTerminal(currentNodeId(state));
}

/** All tags accumulated along the path */
export function collectedTags(state: { path: Choice[] }): string[] {
  return state.path.flatMap((c) => c.tags);
}

/** Progress: answered steps / max depth from start */
export function progress(state: { path: Choice[] }): number {
  const total = maxDepthFrom(START_NODE);
  return Math.min(state.path.length / total, 1);
}

/** The current terminal definition, or null */
export function currentTerminal(state: { path: Choice[] }) {
  const id = currentNodeId(state);
  return isTerminal(id) ? getTerminal(id) : null;
}

/** Node ids on the current path (for highlighting in the tree) */
export function pathNodeIds(state: { path: Choice[] }): string[] {
  const ids = [START_NODE];
  for (const c of state.path) ids.push(c.nodeId, c.nextNode);
  return ids;
}
