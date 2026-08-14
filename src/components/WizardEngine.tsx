"use client";

// ============================================================
// <WizardEngine /> — the orchestrator.
// Layout:
//   Top Bar   : SpiritAnimal (left) + ProgressBar (center) + LanguageToggle (right)
//   Main Stage: QuestionCard OR DefinitionCard (when terminal reached)
//   Bottom    : Back button (path history) + FamilyTree visualization
// ============================================================

import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import SpiritAnimal from "./SpiritAnimal";
import ProgressBar from "./ProgressBar";
import LanguageToggle from "./LanguageToggle";
import QuestionCard from "./QuestionCard";
import DefinitionCard from "./DefinitionCard";
import MermaidMap from "./MermaidMap";
import { useWizard, isAtTerminal } from "@/store/wizardStore";

export default function WizardEngine() {
  const { t } = useTranslation();
  const path = useWizard((s) => s.path);
  const begun = useWizard((s) => s.begun);
  const begin = useWizard((s) => s.begin);
  const back = useWizard((s) => s.back);
  const reset = useWizard((s) => s.reset);

  const started = begun;
  const done = isAtTerminal({ path });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* ambient background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(60% 40% at 20% 0%, rgba(251,191,36,0.07) 0%, transparent 60%), radial-gradient(50% 40% at 80% 100%, rgba(147,51,234,0.06) 0%, transparent 60%)",
        }}
      />

      <div className="relative mx-auto max-w-4xl px-4 py-8 md:py-12">
        {/* ===== Header ===== */}
        <header className="flex items-center justify-between gap-4 mb-8">
          <div className="w-24">
            <SpiritAnimal />
          </div>
          <div className="flex-1">
            <ProgressBar />
          </div>
          <LanguageToggle />
        </header>

        {/* ===== Title (start screen) ===== */}
        <AnimatePresence mode="wait">
          {!started && (
            <motion.div
              key="title"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center mb-10"
            >
              <h1 className="text-4xl md:text-6xl font-black tracking-tight bg-gradient-to-br from-amber-200 via-amber-400 to-orange-500 bg-clip-text text-transparent mb-4">
                {t("app.title")}
              </h1>
              <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">{t("app.subtitle")}</p>
              <button
                type="button"
                onClick={begin}
                className="rounded-2xl bg-gradient-to-r from-amber-400 to-orange-500 px-10 py-4 text-lg font-bold text-slate-950 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
              >
                {t("app.start")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ===== Main stage ===== */}
        {started && (
          <main className="mb-8">
            {done ? <DefinitionCard /> : <QuestionCard />}
          </main>
        )}

        {/* ===== Controls (Back / Restart) ===== */}
        {started && (
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={back}
              disabled={path.length === 0}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-300 hover:border-slate-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← {t("app.back")}
            </button>
            <button
              type="button"
              onClick={reset}
              className="rounded-xl border border-slate-700 px-5 py-2.5 text-sm text-slate-400 hover:border-slate-500 hover:text-slate-200 transition-colors cursor-pointer"
            >
              ↺ {t("app.restart")}
            </button>
          </div>
        )}

        {/* ===== The Theogony Decision Map (mermaid.js) ===== */}
        {started && (
          <div className="mb-10">
            <MermaidMap />
          </div>
        )}

        {/* ===== Footer ===== */}
        <footer className="text-center text-xs text-slate-600 mt-4">
          {t("app.footer")}
          <div className="mt-1">
            <a href="mailto:ij@klaud.uk" className="text-amber-500/80 hover:text-amber-400 transition-colors">
              ij@klaud.uk
            </a>
          </div>
          <div className="mt-1 text-slate-500">
            Copyright 2026 © www.klaud.uk
          </div>
        </footer>
      </div>
    </div>
  );
}
