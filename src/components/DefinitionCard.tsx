"use client";

// ============================================================
// <DefinitionCard /> — the final output.
// "You are a [Constructivist Neo-Platonist]" + The Blueprint +
// Social proof + Similar minds.
// ============================================================

import { motion } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { currentTerminal, useWizard } from "@/store/wizardStore";
import type { Profile } from "@/data/ontology";

export default function DefinitionCard() {
  const { t } = useTranslation();
  const path = useWizard((s) => s.path);
  const profile = useWizard((s) => s.profile);
  const reset = useWizard((s) => s.reset);
  const lang = useWizard((s) => s.lang);
  const [copied, setCopied] = useState(false);

  const terminal = currentTerminal({ path, profile });
  if (!terminal) return null;

  const shareText = `${terminal.title[lang]} — ${terminal.blueprint[lang]}`;

  const copyShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 shadow-2xl shadow-amber-500/10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400/80 mb-2">{t("app.blueprint")}</p>

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-4">
          {t("app.blueprint")}
          <span className="block mt-1 text-lg text-slate-300 font-semibold">{terminal.title[lang]}</span>
        </h2>

        {/* The Blueprint */}
        <p className="text-slate-300 leading-relaxed mb-5">{terminal.blueprint[lang]}</p>

        {/* Profile tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(profile?.orientation || []).slice(0, 3).map((k) => (
            <span key={k} className="rounded-full border border-slate-700 bg-slate-800/60 px-3 py-1 text-[11px] text-slate-300 capitalize">
              {k}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={copyShare}
            className="flex-1 rounded-xl bg-amber-400/90 hover:bg-amber-300 px-5 py-3 font-semibold text-slate-950 transition-colors cursor-pointer"
          >
            {copied ? `✓ ${t("app.copied")}` : t("app.share")}
          </button>
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-xl border border-slate-700 hover:border-slate-500 px-5 py-3 font-medium text-slate-300 transition-colors cursor-pointer"
          >
            {t("app.restart")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
