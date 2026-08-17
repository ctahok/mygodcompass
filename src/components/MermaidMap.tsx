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

import { useCallback, useEffect, useRef, useState } from "react";
import { NODES } from "@/data/ontology";
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
  const DQ = String.fromCharCode(34);
  return s
    .replace(/&/g, "&")
    .replace(new RegExp(DQ, "g"), "\\\"")
    .replace(/#/g, "&#35;")
    .replace(/—/g, "&#8212;") // em-dash breaks the edge-label parser
    .replace(/[^\x00-\x7F]/g, (c) => "#" + c.codePointAt(0)! + ";") // any other non-ASCII -> numeric entity
    .replace(/\n/g, "<br/>");
}

interface MermaidMapProps {
  height?: number;
}

export default function MermaidMap({ height = 480 }: MermaidMapProps) {
  const path = useWizard((s) => s.path);
  const lang = useWizard((s) => s.lang);
  const [source, setSource] = useState("");
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [svgKey, setSvgKey] = useState(0);
  const [viewMode, setViewMode] = useState<"full" | "pruned">("pruned");
  const [autoFitted, setAutoFitted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  // Fullscreen handler
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      setAutoFitted(false); // reset auto-fit when entering fullscreen
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isFullscreen]);

  // ===== Build mermaid source from current path + language =====
  const buildSource = useCallback(() => {
    const l: Lang = lang;
    const lines: string[] = [];
    lines.push("flowchart TD");
    lines.push("  %% Ontological Compass — Theogony Map");
    lines.push(`  %% lang: ${l}`);

    // Nodes (questions)
    for (const node of Object.values(NODES)) {
      const q = node.prompt?.[l] || node.id;
      lines.push(`  ${node.id}["${mmd(q)}"]`);
    }

    // Edges with answer options as labels
    for (const node of Object.values(NODES)) {
      for (const opt of node.choices) {
        for (const next of opt.next || []) {
          lines.push(`  ${node.id} -->|"${mmd(opt.label[l])}"| ${next}`);
        }
      }
    }

    // Classes
    lines.push(`  classDef term fill:#3b1d05,stroke:#fbbf24,color:#fde68a,stroke-width:1.5px;`);
    lines.push(`  classDef onp fill:#451a03,stroke:#fbbf24,color:#fde68a,stroke-width:1px;`);
    lines.push(`  classDef cur fill:#fbbf24,stroke:#fff7ed,color:#451a03,stroke-width:2px;`);

    // Highlight answered path
    const visited = new Set<string>();
    const pathIds = pathNodeIds({ path });
    for (const pid of pathIds) visited.add(pid);
    for (const pid of visited) {
      lines.push(`  class ${pid} cur;`);
    }

    return lines.join("\n");
  }, [path, lang]);

  // Debounced render - use dangerouslySetInnerHTML via state to avoid React reconciliation conflicts
  useEffect(() => {
    const src = buildSource();
    setSource(src);

    const timer = setTimeout(async () => {
      try {
        const mermaid = await loadMermaid();
        const id = `theogony-${++renderIdRef.current}`;
        const { svg } = await mermaid.render(id, src);
        if (!svgHostRef.current) return;
        // Store SVG in state; render via dangerouslySetInnerHTML with key to force remount
        setSvgContent(svg);
        setSvgKey((k) => k + 1);
      } catch (err) {
        console.error("Mermaid render failed:", err);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [buildSource]);

  // Auto-fit after SVG renders - use ref callback to avoid direct DOM mutation
  useEffect(() => {
    if (!svgHostRef.current) return;
    const svg = svgHostRef.current.querySelector("svg");
    if (!svg || autoFitted) return;

    const timer = setTimeout(() => {
      try {
        // Use requestAnimationFrame to ensure SVG is in DOM before measuring
        requestAnimationFrame(() => {
          const currentSvg = svgHostRef.current?.querySelector("svg");
          if (currentSvg && !autoFitted) {
            currentSvg.setAttribute("width", "100%");
            currentSvg.setAttribute("height", "100%");
            currentSvg.style.maxWidth = "100%";
            currentSvg.style.maxHeight = "100%";
            setAutoFitted(true);
          }
        });
      } catch (e) {
        console.warn("Auto-fit failed:", e);
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [svgKey, autoFitted]);

  // Reset auto-fitted when source changes
  useEffect(() => {
    setAutoFitted(false);
  }, [source]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // only left click
    setIsPanning(true);
    setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    e.preventDefault();
  }, [pan.x, pan.y]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPanning) return;
    setPan({ x: e.clientX - panStart.x, y: e.clientY - panStart.y });
  }, [isPanning, panStart.x, panStart.y]);

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsPanning(false);
  }, []);

  const handleDownload = useCallback(async () => {
    if (!svgHostRef.current || !containerRef.current) return;
    const svg = svgHostRef.current.querySelector("svg");
    if (!svg) return;

    try {
      // Create a canvas and draw the SVG
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        // 2x scale for crispness
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = "#0f172a"; // dark bg matching slate-950
        ctx.fillRect(0, 0, img.width, img.height);
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);

        const date = new Date().toISOString().split("T")[0];
        const link = document.createElement("a");
        link.download = `ontological-compass-${date}.jpg`;
        link.href = canvas.toDataURL("image/jpeg", 0.92);
        link.click();
      };
      img.src = url;
    } catch (err) {
      console.error("JPG download failed:", err);
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden ${isFullscreen ? "fixed inset-0 z-50 rounded-none" : ""}`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800 bg-slate-900/60">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-slate-300">{viewMode === "pruned" ? "Pruned view" : "Full DAG"}</span>
          <button
            type="button"
            onClick={() => setViewMode((v) => (v === "pruned" ? "full" : "pruned"))}
            className={`rounded-lg px-2 py-1 text-xs font-medium transition-colors ${
              viewMode === "pruned"
                ? "bg-amber-400/20 text-amber-300 border border-amber-400/30"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            Toggle
          </button>
        </div>
        <div className="flex items-center gap-2">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-1 py-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.25).toFixed(2)))}
              className="w-7 h-7 rounded-md text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="text-xs text-slate-400 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.25).toFixed(2)))}
              className="w-7 h-7 rounded-md text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="w-7 h-7 rounded-md text-[10px] font-semibold text-slate-400 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Reset zoom"
            >
              1:1
            </button>
            <button
              type="button"
              onClick={() => setAutoFitted(false)}
              className="w-7 h-7 rounded-md text-[10px] font-semibold text-slate-400 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Fit to screen"
            >
              ⛶
            </button>
          </div>
          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-7 h-7 rounded-md text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
            aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
          >
            {isFullscreen ? "⛶" : "⛶"}
          </button>
          <a
            href="/ontology-tree.mmd"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg px-3 py-1.5 text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 transition-colors"
          >
            📄 Source
          </a>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg px-3 py-1.5 text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30 transition-colors"
          >
            ⬇ JPG
          </button>
        </div>
      </div>

      {/* SVG Host */}
      <div
        ref={svgHostRef}
        className="w-full h-full touch-pan-x touch-pan-y cursor-grab"
        style={{
          overflow: "auto",
          WebkitOverflowScrolling: "touch",
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <div key={svgKey} className="min-w-full min-h-full" style={{ minHeight: height }}>
          {svgContent && (
            <div
              className="w-full h-full"
              style={{
                transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                transformOrigin: "top left",
                width: `${100 / zoom}%`,
                height: `${100 / zoom}%`,
              }}
              dangerouslySetInnerHTML={{ __html: svgContent }}
            />
          )}
        </div>
      </div>
    </div>
  );
}