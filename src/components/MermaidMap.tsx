"use client";

// ============================================================
// <MermaidMap /> — the Theogony Decision Map, rendered with
// mermaid.js instead of React Flow.
//   - Full DAG: every question node + every answer option as
//     an edge label, terminal archetypes as stadium nodes.
//   - Localized to the current UI language.
//   - Active path highlighted (amber), rejected branches dashed.
//   - Pan (drag) + zoom (wheel / buttons) + JPG download.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { NODES, TERMINALS } from "@/data/ontology";
import type { Lang } from "@/data/ontology";
import { useWizard, pathNodeIds } from "@/store/wizardStore";

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
function loadMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then((m) => {
      m.default.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "dark",
        fontFamily: "inherit",
        flowchart: {
          htmlLabels: true,
          curve: "basis",
          padding: 10,
          useMaxWidth: false,
          nodeSpacing: 36,
          rankSpacing: 48,
        },
      });
      return m.default;
    });
  }
  return mermaidPromise;
}

/** Escape text for safe use inside mermaid quoted labels */
function mmd(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "#quot;")
    .replace(/#/g, "#35;")
    .replace(/—/g, "#8212;") // em-dash breaks the edge-label parser
    .replace(/[^\x00-\x7F]/g, (c) => `#${c.codePointAt(0)!};`) // any other non-ASCII -> numeric entity
    .replace(/\n/g, "<br/>");
}

interface MermaidMapProps {
  height?: number;
}

export default function MermaidMap({ height = 480 }: MermaidMapProps) {
  const path = useWizard((s) => s.path);
  const lang = useWizard((s) => s.lang);
  const containerRef = useRef<HTMLDivElement>(null);
  const svgHostRef = useRef<HTMLDivElement>(null);

  // ---- Pan / zoom state -------------------------------------
  const [view, setView] = useState({ scale: 0.6, tx: 0, ty: 0 });
  const dragRef = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null);
  const [svgKey, setSvgKey] = useState(0); // force re-layout after render

  const onPath = useMemo(() => {
    const ids = pathNodeIds({ path });
    return new Set(ids);
  }, [path]);

  const activeEdges = useMemo(() => {
    const set = new Set<string>();
    for (const c of path) {
      const node = NODES[c.nodeId];
      if (node && node.options[c.optionIndex]) {
        set.add(`${c.nodeId}->${node.options[c.optionIndex].next_node}`);
      }
    }
    return set;
  }, [path]);

  // ---- Mermaid source generation ----------------------------
  const source = useMemo(() => {
    const l = lang as Lang;
    const lines: string[] = ["flowchart TD"];
    const edgeIndex = new Map<string, number>();
    let idx = 0;

    // Question nodes
    for (const node of Object.values(NODES)) {
      lines.push(`  ${node.node_id}["${mmd(node.question[l])}"]`);
    }
    // Terminal nodes (stadium)
    for (const term of Object.values(TERMINALS)) {
      lines.push(`  ${term.node_id}(["${mmd(term.title[l])}"])`);
    }

    // Edges with answer options as labels
    for (const node of Object.values(NODES)) {
      for (const opt of node.options) {
        edgeIndex.set(`${node.node_id}->${opt.next_node}`, idx++);
        lines.push(
          `  ${node.node_id} -->|"${mmd(opt.label[l])}"| ${opt.next_node}`,
        );
      }
    }

    // Classes
    lines.push(`  classDef term fill:#3b1d05,stroke:#fbbf24,color:#fde68a,stroke-width:1.5px;`);
    lines.push(`  classDef onp fill:#451a03,stroke:#fbbf24,color:#fde68a,stroke-width:1px;`);
    lines.push(`  classDef cur fill:#fbbf24,stroke:#fff7ed,color:#451a03,stroke-width:2px;`);

    const curId = path.length > 0 ? path[path.length - 1].nextNode : "existence";
    const termIds: string[] = [];
    const onpIds: string[] = [];
    for (const node of Object.values(NODES)) {
      if (node.node_id === curId) continue;
      if (onPath.has(node.node_id)) onpIds.push(node.node_id);
    }
    for (const term of Object.values(TERMINALS)) {
      if (term.node_id === curId) {
        lines.push(`  class ${term.node_id} cur;`);
      } else {
        termIds.push(term.node_id);
      }
    }
    if (termIds.length) lines.push(`  class ${termIds.join(",")} term;`);
    if (onpIds.length) lines.push(`  class ${onpIds.join(",")} onp;`);
    lines.push(`  class ${curId} cur;`);

    // Edge styling: active = amber, on-path-but-not-chosen = dashed
    const activeIdx: number[] = [];
    const rejectedIdx: number[] = [];
    for (const c of path) {
      const node = NODES[c.nodeId];
      if (!node) continue;
      for (const opt of node.options) {
        const key = `${node.node_id}->${opt.next_node}`;
        const ei = edgeIndex.get(key);
        if (ei === undefined) continue;
        if (onPath.has(node.node_id) && onPath.has(opt.next_node)) {
          if (activeEdges.has(key)) activeIdx.push(ei);
          else rejectedIdx.push(ei);
        }
      }
    }
    for (const ei of activeIdx) lines.push(`  linkStyle ${ei} stroke:#fbbf24,stroke-width:2.5px;`);
    for (const ei of rejectedIdx) lines.push(`  linkStyle ${ei} stroke:#64748b,stroke-width:1px,stroke-dasharray:4 3;`);

    return lines.join("\n");
  }, [lang, path, onPath, activeEdges]);

  // ---- Render via mermaid -----------------------------------
  const renderIdRef = useRef(0);

  useEffect(() => {
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const mermaid = await loadMermaid();
        if (cancelled) return;
        const id = `theogony-${++renderIdRef.current}`;
        const { svg } = await mermaid.render(id, source);
        if (cancelled || !svgHostRef.current) return;
        svgHostRef.current.innerHTML = svg;
        setSvgKey((k) => k + 1);
      } catch (err) {
        console.error("Mermaid render failed:", err);
      }
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [source]);

  // ---- Pan / zoom handlers ----------------------------------
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    setView((v) => {
      const factor = e.deltaY < 0 ? 1.12 : 0.89;
      const scale = Math.min(2.5, Math.max(0.15, v.scale * factor));
      return { ...v, scale };
    });
  }, []);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { x: e.clientX, y: e.clientY, tx: view.tx, ty: view.ty };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [view]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    setView((v) => ({ ...v, tx: d.tx + (e.clientX - d.x), ty: d.ty + (e.clientY - d.y) }));
  }, []);

  const onPointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  const zoomBy = useCallback((factor: number) => {
    setView((v) => ({ ...v, scale: Math.min(2.5, Math.max(0.15, v.scale * factor)) }));
  }, []);

  // ---- JPG download (html2canvas on the rendered host) ------
  const downloadMap = useCallback(async () => {
    if (!svgHostRef.current) return;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(svgHostRef.current, {
        backgroundColor: "#0f172a",
        scale: 2,
        logging: false,
        useCORS: true,
        windowWidth: svgHostRef.current.scrollWidth,
      } as Record<string, unknown>);
      const link = document.createElement("a");
      link.download = `ontological-compass-map-${new Date().toISOString().split("T")[0]}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (err) {
      console.error("Failed to download map:", err);
      alert("Failed to download map. Please try again.");
    }
  }, []);

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden relative">
      <div className="absolute top-2 left-3 z-10 text-[10px] uppercase tracking-widest text-slate-500 font-medium pointer-events-none">
        Theogony Map · mermaid.js
      </div>
      <div className="absolute top-2 right-3 z-10 flex gap-2">
        <button
          type="button"
          onClick={() => zoomBy(1.25)}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Zoom in"
        >
          +
        </button>
        <button
          type="button"
          onClick={() => zoomBy(0.8)}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Zoom out"
        >
          −
        </button>
        <button
          type="button"
          onClick={() => setView({ scale: 0.6, tx: 0, ty: 0 })}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 transition-colors cursor-pointer"
          title="Reset view"
        >
          ⟲
        </button>
        <button
          type="button"
          onClick={downloadMap}
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 transition-colors cursor-pointer flex items-center gap-1"
          title="Download map as JPG"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          JPG
        </button>
        <a
          href="/ontology-tree.mmd"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-500 hover:bg-slate-800/80 hover:text-amber-400 transition-colors cursor-pointer flex items-center gap-1"
          title="View full Mermaid source"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="16" y1="13" x2="8" y2="13"></line>
            <line x1="16" y1="17" x2="8" y2="17"></line>
            <polyline points="10 9 9 9 8 9"></polyline>
          </svg>
          Source
        </a>
      </div>
      <div
        ref={containerRef}
        className="relative w-full cursor-grab active:cursor-grabbing overflow-hidden touch-none select-none"
        style={{ height }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          className="absolute inset-0"
          style={{ transform: `translate(${view.tx}px, ${view.ty}px) scale(${view.scale})`, transformOrigin: "0 0" }}
        >
          <div key={svgKey} ref={svgHostRef} className="mermaid-svg-host" />
        </div>
      </div>
    </div>
  );
}
