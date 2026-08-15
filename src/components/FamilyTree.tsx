"use client";

import { useMemo, useRef, useCallback } from "react";
import ReactFlow, { Background, Controls, MarkerType, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";
import { useWizard, pathNodeIds } from "@/store/wizardStore";
import { buildTreeLayout } from "@/lib/treeLayout";

export default function FamilyTree() {
  const path = useWizard((s) => s.path);
  const lang = useWizard((s) => s.lang);
  const { nodes, edges } = useMemo(() => buildTreeLayout(lang, path), [lang, path]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const onPath = useMemo(() => new Set(pathNodeIds({ path })), [path]);

  const flowNodes: Node[] = useMemo(
    () =>
      nodes.map((n) => {
        const isOnPath = onPath.has(n.id);
        const isCurrent = path.length > 0 && n.id === path[path.length - 1].nextNodeIds[0];
        return {
          id: n.id,
          position: { x: n.x, y: n.y },
          data: { label: n.label },
          className: "ontology-node",
          style: {
            width: n.isTerminal ? 170 : 150,
            background: isCurrent ? "rgba(251,191,36,0.18)" : isOnPath ? "rgba(251,191,36,0.10)" : "rgba(30,41,59,0.72)",
            border: isCurrent
              ? "1.5px solid #fbbf24"
              : isOnPath
                ? "1px solid rgba(251,191,36,0.45)"
                : "1px solid rgba(100,116,139,0.25)",
            color: isOnPath ? "#fde68a" : "#94a3b8",
            borderRadius: 8,
            padding: "8px 10px",
            fontSize: 11,
            lineHeight: 1.3,
            opacity: isOnPath ? 1 : 0.45,
            boxShadow: isCurrent ? "0 0 18px rgba(251,191,36,0.35)" : "none",
          },
        };
      }),
    [nodes, onPath, path],
  );

  const flowEdges: Edge[] = useMemo(
    () =>
      edges.map((e) => ({
        id: `${e.source}->${e.target}`,
        source: e.source,
        target: e.target,
        animated: e.active,
        type: "smoothstep",
        markerEnd: { type: MarkerType.ArrowClosed, color: e.active ? "#fbbf24" : e.rejected ? "#64748b55" : "#47556933" },
        style: {
          stroke: e.active ? "#fbbf24" : e.rejected ? "#64748b" : "#475569",
          strokeWidth: e.active ? 2.2 : 1,
          opacity: e.active ? 1 : e.rejected ? 0.5 : 0.18,
          strokeDasharray: e.rejected ? "4 3" : undefined,
        },
      })),
    [edges],
  );

  const downloadMap = useCallback(async () => {
    if (!reactFlowWrapper.current) return;
    
    try {
      // Dynamic import html2canvas
      const html2canvas = (await import("html2canvas")).default;
      
      const canvas = await html2canvas(reactFlowWrapper.current, {
        backgroundColor: "#0f172a", // slate-950
        scale: 2,
        logging: false,
        useCORS: true,
      } as Record<string, unknown>);
      
      const link = document.createElement("a");
      link.download = `ontological-compass-${new Date().toISOString().split("T")[0]}.jpg`;
      link.href = canvas.toDataURL("image/jpeg", 0.95);
      link.click();
    } catch (err) {
      console.error("Failed to download map:", err);
      alert("Failed to download map. Please try again.");
    }
  }, []);

  return (
    <div className="w-full h-[340px] rounded-2xl border border-slate-800 bg-slate-950/70 overflow-hidden relative">
      <div className="absolute top-2 left-3 z-10 text-[10px] uppercase tracking-widest text-slate-500 font-medium pointer-events-none">
        Theogony Map
      </div>
      <div className="absolute top-2 right-3 z-10 flex gap-2">
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
      </div>
      <div ref={reactFlowWrapper} className="w-full h-full">
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          fitView
          fitViewOptions={{ padding: 0.15, maxZoom: 1.1 }}
          minZoom={0.2}
          maxZoom={1.6}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnScroll
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#1e293b" gap={22} />
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}
