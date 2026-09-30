// ============================================================
// Mermaid diagram source tests (vitest)
// Run: npx vitest run
//
// Guards the exact class of bug that made the map show
// "Mermaid encountered a diagram syntax error.": a label or line
// that breaks Mermaid's flowchart grammar.
// ============================================================
import { describe, it, expect } from "vitest";
import { NODES } from "../src/data/ontology";
import { buildMermaidSource, mmd } from "../src/lib/mermaidSource";
import type { PathStep } from "../src/store/wizardStore";

const LANGS = ["en", "ru", "az"] as const;
const MODES = ["pruned", "full"] as const;

/** Deterministically walk the graph so tests cover real paths. */
function walk(seed: number, steps = 6): PathStep[] {
  const out: PathStep[] = [];
  let nodeId = "start";
  for (let i = 0; i < steps; i++) {
    const node = NODES[nodeId];
    if (!node || !node.choices.length) break;
    const c = node.choices[(seed + i) % node.choices.length];
    const next = c.next || [];
    out.push({ nodeId, choiceIds: [c.id], tags: [], nextNodeIds: next });
    if (!next.length) break;
    nodeId = next[(seed + i) % next.length];
  }
  return out;
}

const ID = "[A-Za-z_][A-Za-z0-9_]*";
const PATTERNS: RegExp[] = [
  new RegExp(`^${ID}\\["[^"]*"\\]$`), // node declaration
  new RegExp(`^${ID} -->\\|"[^"]*"\\| ${ID}$`), // edge with label
  new RegExp(`^${ID} --> ${ID}$`), // edge without label
  /^classDef [A-Za-z_][A-Za-z0-9_]* [\w:#,.\-]+;$/, // style definition
  new RegExp(`^class ${ID} [A-Za-z_][A-Za-z0-9_]*;$`), // style application
];

function forEachCase(fn: (src: string, label: string) => void) {
  for (const lang of LANGS) {
    for (const viewMode of MODES) {
      for (let seed = 0; seed < 5; seed++) {
        const path = walk(seed);
        const src = buildMermaidSource({ path, lang, viewMode });
        fn(src, `${lang}/${viewMode}/path${seed}`);
      }
    }
  }
}

describe("buildMermaidSource output is valid Mermaid flowchart syntax", () => {
  it("emits only well-formed lines", () => {
    forEachCase((src, label) => {
      const lines = src.split("\n");
      expect(lines[0], label).toBe("flowchart TD");
      lines.slice(1).forEach((line, i) => {
        const trimmed = line.trim();
        const ok = PATTERNS.some((p) => p.test(trimmed));
        expect(ok, `${label} line ${i + 2}: ${JSON.stringify(trimmed)}`).toBe(true);
      });
    });
  });

  it("declares every node referenced by an edge or a class", () => {
    forEachCase((src, label) => {
      const lines = src.split("\n").slice(1).map((l) => l.trim());
      const declared = new Set<string>();
      for (const line of lines) {
        const m = line.match(new RegExp(`^(${ID})\\[`));
        if (m) declared.add(m[1]);
      }
      expect(declared.size, label).toBeGreaterThan(0);

      for (const line of lines) {
        let targets: string[] = [];
        const l1 = line.match(new RegExp(`^(${ID}) -->\\|"[^"]*"\\| (${ID})$`));
        if (l1) targets = [l1[1], l1[2]];
        const l2 = line.match(new RegExp(`^(${ID}) --> (${ID})$`));
        if (l2) targets = [l2[1], l2[2]];
        const cls = line.match(new RegExp(`^class (${ID}) `));
        if (cls) targets = [cls[1]];

        for (const t of targets) {
          expect(declared.has(t), `${label} -> undeclared id "${t}" in: ${line}`).toBe(true);
        }
      }
    });
  });

  it("never emits a character that breaks Mermaid labels", () => {
    forEachCase((src, label) => {
      const lines = src.split("\n").slice(1);
      for (const line of lines) {
        // A quoted label must not contain a quote (it would end the string),
        // and an edge label must not contain a pipe (it would end the label).
        const quoted = line.match(/\["([^"]*)"\]/) || line.match(/-->\|"([^"]*)"\|/);
        if (quoted) {
          expect(quoted[1]).not.toContain('"');
          expect(quoted[1]).not.toContain("|");
          expect(quoted[1]).not.toContain("\n");
        }
      }
      expect(src, label).not.toContain("\r");
    });
  });

  it("renders the complete graph (46 nodes) in full mode", () => {
    const src = buildMermaidSource({ path: [], lang: "en", viewMode: "full" });
    const declared = (src.match(new RegExp(`^\\s*${ID}\\[`, "gm")) || []).length;
    expect(declared).toBe(Object.keys(NODES).length);
    expect(Object.keys(NODES).length).toBe(46);
  });

  it("keeps pruned mode small: path plus immediate next steps", () => {
    const src = buildMermaidSource({ path: walk(2), lang: "en", viewMode: "pruned" });
    const declared = (src.match(new RegExp(`^\\s*${ID}\\[`, "gm")) || []).length;
    expect(declared).toBeLessThan(Object.keys(NODES).length);
    expect(declared).toBeGreaterThan(1);
  });
});

describe("mmd label escaping", () => {
  it("strips every character that can break a Mermaid label", () => {
    const nasty = 'He said "hello" [x] {y} <z> a;b c\\d';
    const out = mmd(nasty);
    for (const ch of ['"', "\\", ";", "<", ">", "{", "}"]) {
      expect(out, ch).not.toContain(ch);
    }
    expect(out.trim()).toBe(out);
    expect(out).not.toContain("\n");
  });

  it("never emits a pipe (would truncate an edge label)", () => {
    expect(mmd("a|b")).not.toContain("|");
  });

  it("handles empty input", () => {
    expect(mmd("")).toBe("");
    expect(mmd("   ")).toBe("");
  });
});
