"use client";

// ============================================================
// <ProgressBar /> — the "emotional" progress bar.
// Color shifts with coherence: red (conflict) → amber → gold.
// ============================================================

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { coherenceState, collectedTags, progress, useWizard, isAtTerminal } from "@/store/wizardStore";

export default function ProgressBar() {
  const { t } = useTranslation();
  const path = useWizard((s) => s.path);
  const prog = progress({ path });
  const tags = collectedTags({ path });
  const done = isAtTerminal({ path });

  const state = coherenceState(tags);
  const color = done ? "#fde68a" : state === "conflict" ? "#f87171" : state === "coherent" ? "#fbbf24" : "#94a3b8";

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] uppercase tracking-wider text-slate-400">{t("app.progress")}</span>
        <motion.span key={Math.round(prog * 100)} className="text-[11px] font-mono text-slate-300" initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}>
          {Math.round(prog * 100)}%
        </motion.span>
      </div>
      <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700/60">
        <motion.div
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}88, ${color})`, boxShadow: `0 0 14px ${color}66` }}
          animate={{ width: `${Math.max(prog * 100, 4)}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
    </div>
  );
}
