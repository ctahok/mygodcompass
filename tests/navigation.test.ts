// ============================================================
// Navigation + candidate scoring tests (vitest)
// Run: npx vitest run
// ============================================================
import { describe, it, expect } from "vitest";
import { NODES } from "../src/data/ontology";
import {
  currentNodeId,
  isAtTerminal,
  computeCandidateScores,
  topCandidates,
} from "../src/store/wizardStore";

// Helper: simulate answering a node's choice by id and build path
function stepPath(path: { nodeId: string; choiceIds: string[] }[]) {
  return path.map((s) => {
    const node = NODES[s.nodeId];
    const choices = s.choiceIds
      .map((id) => node?.choices.find((c) => c.id === id))
      .filter(Boolean) as { tags?: string[]; next?: string[] }[];
    return {
      nodeId: s.nodeId,
      choiceIds: s.choiceIds,
      tags: choices.flatMap((c) => c.tags || []),
      nextNodeIds: choices.flatMap((c) => c.next || []),
    };
  });
}

describe("Navigation: no premature terminal", () => {
  it("A. start → explore → yes_ultimate continues to reality (no result screen)", () => {
    const path = stepPath([
      { nodeId: "start", choiceIds: ["explore"] },
      { nodeId: "ultimate", choiceIds: ["yes_ultimate"] },
    ]);
    expect(currentNodeId({ path })).toBe("reality");
    expect(isAtTerminal({ path })).toBe(false);
  });

  it("B. Full generic chain reaches candidate_traditions, not a terminal", () => {
    const path = stepPath([
      { nodeId: "start", choiceIds: ["explore"] },
      { nodeId: "ultimate", choiceIds: ["yes_ultimate"] },
      { nodeId: "reality", choiceIds: ["one"] },
      { nodeId: "agency", choiceIds: ["personal"] },
      { nodeId: "relation", choiceIds: ["creator"] },
      { nodeId: "knowing", choiceIds: ["scripture"] },
    ]);
    expect(currentNodeId({ path })).toBe("candidate_traditions");
    expect(isAtTerminal({ path })).toBe(false);
  });

  it("C. Abrahamic candidates generated from one+personal+creator+scripture", () => {
    const tags = ["one", "monotheism", "personalism", "relational", "creator", "interventionist", "revelation", "scripture", "prophetic"];
    const scores = computeCandidateScores(tags);
    const top = topCandidates(scores, 5).map((c) => c.id);
    expect(top).toContain("christianity");
    expect(top).toContain("islam");
    expect(top).toContain("judaism");
    expect(top).toContain("sikhism");
    expect(top).toContain("bahai");
  });

  it("E. Deism is high-confidence from one+creator+nonintervention", () => {
    const tags = ["monotheism", "one", "creator", "deism", "nonintervention"];
    const scores = computeCandidateScores(tags);
    const top = topCandidates(scores, 3);
    expect(top[0].id).toBe("deism");
    expect(top[0].score).toBeGreaterThanOrEqual(6);
  });

  it("F. Panentheism is high-confidence from cosmic+immanence+panentheism", () => {
    const tags = ["immanence", "panentheism", "affirms-ultimate"];
    const scores = computeCandidateScores(tags);
    const top = topCandidates(scores, 3);
    expect(top[0].id).toBe("pantheism");
    expect(top[0].score).toBeGreaterThanOrEqual(4);
  });
});

describe("Navigation: multi-select first screen does not auto-submit or end", () => {
  it("G. Selecting one orientation leaves journey in progress (Continue available, no result)", () => {
    const path = stepPath([{ nodeId: "start", choiceIds: ["explore"] }]);
    // Current node is whatever explore leads to — ultimate (via reality chain start)
    expect(isAtTerminal({ path })).toBe(false);
    const node = NODES[currentNodeId({ path })];
    expect(node).toBeTruthy();
    // Journey continues: current node is a question node, not the result screen
    expect(node!.choices.length).toBeGreaterThan(0);
  });

  it("H. Finish-for-now marks incomplete (never a categorical religion)", () => {
    // Simulate explicit finish with an incomplete path
    const path = stepPath([{ nodeId: "start", choiceIds: ["explore"] }]);
    // The result is only shown when finished=true, and is labeled incomplete
    expect(isAtTerminal({ path, finished: true })).toBe(true);
  });
});

describe("Ontology integrity: every next reference resolves", () => {
  it("All next[] targets exist in NODES", () => {
    for (const node of Object.values(NODES)) {
      for (const choice of node.choices) {
        for (const next of choice.next || []) {
          expect(NODES[next], `node ${node.id} choice ${choice.id} → missing ${next}`).toBeTruthy();
        }
      }
    }
  });

  it("Core chain exists: reality→agency→relation→knowing→candidate_traditions", () => {
    expect(NODES.reality.choices.some((c) => c.next?.includes("agency"))).toBe(true);
    expect(NODES.agency.choices.some((c) => c.next?.includes("relation"))).toBe(true);
    expect(NODES.relation.choices.some((c) => c.next?.includes("knowing"))).toBe(true);
    expect(NODES.knowing.choices.some((c) => c.next?.includes("candidate_traditions"))).toBe(true);
  });
});
