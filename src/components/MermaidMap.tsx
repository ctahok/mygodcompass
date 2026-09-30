"use client";

// ============================================================
// <MermaidMap /> — the Theogony Decision Map, rendered with
// mermaid.js.
//   - Supports Pruned View (active path + immediate next steps)
//     and Full DAG.
//   - Localized to the current UI language.
//   - Active path highlighted (amber), branches clearly indicated.
//   - Pan (drag) + zoom (wheel / buttons) + JPG download.
//   - Fallback error state with retry.
// ============================================================

import { useCallback, useEffect, useRef, useState } from "react";
import { NODES } from "@/data/ontology";
import type { Lang } from "@/data/ontology";
import { useWizard, pathNodeIds } from "@/store/wizardStore";

function loadMermaid(isDark = true) {
  return import("mermaid").then((m) => {
    const instance = m.default || m;
    instance.initialize({
      startOnLoad: false,
      securityLevel: "loose",
      theme: isDark ? "dark" : "default",
      fontFamily: "inherit",
      flowchart: {
        htmlLabels: true,
        curve: "basis",
        padding: 12,
        useMaxWidth: false,
        nodeSpacing: 36,
        rankSpacing: 48,
      },
    });
    return instance;
  });
}

/**
 * Clean and escape label text safely for Mermaid node/edge labels.
 * Avoids double-escaping entities and strips syntax breakers.
 */
function mmd(s: string): string {
  if (!s) return "";
  return s
    .replace(/"/g, "'") // replace double quotes with single quotes inside Mermaid labels
    .replace(/[;\\]/g, " ") // avoid semicolons/backslashes breaking line lexing
    .replace(/[<>{}]/g, "") // strip angle/curly brackets
    .replace(/\s+/g, " ") // collapse newlines and extra spaces
    .trim();
}

interface MermaidMapProps {
  height?: number;
}

export default function MermaidMap({ height = 440 }: MermaidMapProps) {
  const path = useWizard((s) => s.path);
  const lang = useWizard((s) => s.lang);
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [svgKey, setSvgKey] = useState(0);
  const [viewMode, setViewMode] = useState<"pruned" | "full">("pruned");
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const svgHostRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  // Scale the rendered SVG to fit the host container (contain, min 40%)
  const fitToScreen = useCallback(() => {
    const host = svgHostRef.current;
    const svg = host?.querySelector("svg");
    if (!host || !svg) return;

    try {
      const bbox = typeof svg.getBBox === "function" ? svg.getBBox() : null;
      const naturalWidth = bbox && bbox.width > 0 ? bbox.width : svg.clientWidth;
      const naturalHeight = bbox && bbox.height > 0 ? bbox.height : svg.clientHeight;
      const containerWidth = host.clientWidth;
      const containerHeight = host.clientHeight;

      let scale = 1;
      if (naturalWidth > 0 && containerWidth > 0) {
        scale = Math.min(containerWidth / naturalWidth, containerHeight / naturalHeight, 1);
        scale = Math.max(scale, 0.4); // don't shrink past 40% for readability
      }

      setZoom(scale);
      setPan({ x: 0, y: 0 });
    } catch (e) {
      console.warn("Auto-fit note:", e);
    }
  }, []);

  // Fullscreen handler
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = "hidden";
      const fitTimer = setTimeout(fitToScreen, 150);
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsFullscreen(false);
      };
      document.addEventListener("keydown", handleEscape);
      return () => {
        clearTimeout(fitTimer);
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [isFullscreen, fitToScreen]);

  // ===== Build mermaid source from current path + language + viewMode =====
  const buildSource = useCallback(() => {
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
  }, [path, lang, viewMode]);

  // Render SVG with debounce and explicit error handling
  useEffect(() => {
    const src = buildSource();

    const timer = setTimeout(async () => {
      try {
        const isDark = typeof document !== "undefined" && !document.documentElement.classList.contains("light");
        const mermaid = await loadMermaid(isDark);
        const id = `theogony-${++renderIdRef.current}`;
        const { svg } = await mermaid.render(id, src);

        if (!svgHostRef.current) return;
        if (svg.includes("error-text") || svg.includes("Syntax error")) {
          setErrorMessage("Mermaid encountered a diagram syntax error.");
          return;
        }

        setSvgContent(svg);
        setErrorMessage(null);
        setSvgKey((k) => k + 1);
      } catch (err) {
        console.error("Mermaid render failed:", err);
        setErrorMessage(err instanceof Error ? err.message : "Failed to render map diagram.");
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [buildSource]);

  // Auto-fit after SVG renders
  useEffect(() => {
    if (!svgContent) return;
    const timer = setTimeout(fitToScreen, 100);
    return () => clearTimeout(timer);
  }, [svgKey, svgContent, fitToScreen]);

  // Pan handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
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
    if (!svgHostRef.current) return;
    const svg = svgHostRef.current.querySelector("svg");
    if (!svg) return;

    try {
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(svg);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const img = new Image();
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const scale = 2;
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;
        ctx.scale(scale, scale);
        ctx.fillStyle = "#0f172a";
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
      className={`rounded-2xl border border-slate-800 bg-slate-950/80 overflow-hidden flex flex-col ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : ""
      }`}
      style={{ height: isFullscreen ? "100vh" : height }}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3 border-b border-slate-800 bg-slate-900/60 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">
            {viewMode === "pruned" ? "Focus View (Path)" : "Full Diagram"}
          </span>
          <button
            type="button"
            onClick={() => setViewMode((v) => (v === "pruned" ? "full" : "pruned"))}
            className="rounded-lg px-2.5 py-1 text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/40 hover:bg-amber-400/30 transition-colors cursor-pointer"
          >
            Switch to {viewMode === "pruned" ? "Full DAG" : "Focus"}
          </button>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-lg bg-slate-800 border border-slate-700 px-1 py-0.5">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.2, +(z - 0.15).toFixed(2)))}
              className="w-7 h-7 rounded-md text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Zoom out"
            >
              −
            </button>
            <span className="text-xs text-slate-400 font-mono w-10 text-center">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(3, +(z + 0.15).toFixed(2)))}
              className="w-7 h-7 rounded-md text-sm font-bold text-slate-300 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Zoom in"
            >
              +
            </button>
            <button
              type="button"
              onClick={() => {
                setZoom(1);
                setPan({ x: 0, y: 0 });
              }}
              className="w-7 h-7 rounded-md text-[10px] font-semibold text-slate-400 hover:bg-slate-700 hover:text-amber-300 transition-colors cursor-pointer"
              aria-label="Reset zoom"
            >
              1:1
            </button>
            <button
              type="button"
              onClick={fitToScreen}
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
            {isFullscreen ? "✕" : "⛶"}
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="rounded-lg px-2.5 py-1 text-xs font-medium bg-amber-400/20 text-amber-300 border border-amber-400/30 hover:bg-amber-400/30 transition-colors cursor-pointer"
          >
            ⬇ JPG
          </button>
        </div>
      </div>

      {/* SVG Host */}
      <div
        ref={svgHostRef}
        className="mermaid-svg-host flex-1 w-full overflow-hidden touch-pan-x touch-pan-y cursor-grab active:cursor-grabbing relative p-4 flex items-center justify-center bg-slate-950/40"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        {errorMessage && (
          <div className="p-6 text-center max-w-md">
            <p className="text-amber-300 font-semibold mb-2">Diagram rendering</p>
            <p className="text-xs text-slate-400 mb-4">{errorMessage}</p>
            <button
              type="button"
              onClick={() => {
                setErrorMessage(null);
                setSvgKey((k) => k + 1);
              }}
              className="px-3 py-1.5 rounded-lg bg-amber-400 text-slate-950 font-semibold text-xs"
            >
              Retry
            </button>
          </div>
        )}

        {!errorMessage && svgContent && (
          <div
            key={svgKey}
            style={{
              transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
              transformOrigin: "center center",
              transition: isPanning ? "none" : "transform 0.15s ease-out",
            }}
            dangerouslySetInnerHTML={{ __html: svgContent }}
          />
        )}

        {!errorMessage && !svgContent && (
          <div className="text-xs text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            Loading decision map…
          </div>
        )}
      </div>
    </div>
  );
}