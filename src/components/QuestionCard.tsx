"use client";

// ============================================================
// <QuestionCard /> — the main stage: question + tappable options.
// Complex terms get an (i) icon with a 1-sentence tooltip.
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { getNode, type LocalizedText } from "@/data/ontology";
import { useWizard, currentNodeId } from "@/store/wizardStore";

function TermTip({ text }: { text: LocalizedText }) {
  const { t } = useTranslation();
  const lang = useWizard((s) => s.lang);
  const [open, setOpen] = useState(false);
  return (
    <span className="relative inline-flex items-center">
      <button
        type="button"
        aria-label={t("app.tooltip")}
        onClick={() => setOpen((o) => !o)}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-700/70 text-[10px] font-bold text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
      >
        i
      </button>
      <AnimatePresence>
        {open && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-[11px] leading-snug text-slate-300 shadow-xl z-30"
          >
            {text[lang]}
            <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-700" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}

export default function QuestionCard() {
  const path = useWizard((s) => s.path);
  const answer = useWizard((s) => s.answer);
  const lang = useWizard((s) => s.lang);

  const current = currentNodeId({ path });
  const node = getNode(current);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1.5 flex items-start gap-1">
          {node.question[lang]}
          <TermTip
            text={{
              en: "The study of what exists and how things are categorized.",
              ru: "Учение о том, что существует и как вещи категоризируются.",
              az: "Nəyin mövcud olduğunu və şeylərin necə kateqoriyalaşdırıldığını öyrənən təlim.",
            }}
          />
        </h2>
        {node.hint && <p className="text-sm text-slate-400 mb-6 italic">{node.hint[lang]}</p>}

        <div className="flex flex-col gap-3">
          {node.options.map((opt, i) => (
            <motion.button
              key={i}
              type="button"
              onClick={() => answer(i)}
              whileHover={{ scale: 1.015, x: 4 }}
              whileTap={{ scale: 0.985 }}
              className="group text-left rounded-xl border border-slate-700/70 bg-slate-900/60 hover:border-amber-400/60 hover:bg-slate-800/70 px-5 py-4 transition-colors cursor-pointer"
            >
              <span className="flex items-center justify-between gap-2">
                <span className="text-base text-slate-100 group-hover:text-amber-200 transition-colors">
                  {opt.label[lang]}
                </span>
                <span className="text-amber-400/0 group-hover:text-amber-400/80 transition-colors text-lg leading-none">→</span>
              </span>
              {opt.tip && (
                <span className="flex items-center mt-1.5 text-[11px] text-slate-500 group-hover:text-slate-400">
                  <TermTip text={opt.tip} />
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
