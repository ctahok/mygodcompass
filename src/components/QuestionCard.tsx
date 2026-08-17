"use client";

// ============================================================
// <QuestionCard /> — the main stage: question + options.
// Supports: single | multiple | free-text | scale response modes
// Universal escape hatches: Unsure, Not my frame, Multiple, Decline label
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { type Choice, type LocalizedText, type Lang } from "@/data/ontology";
import { useWizard, currentNodeId, currentNode } from "@/store/wizardStore";

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

function renderLabel(label: LocalizedText, lang: Lang): string {
  return label[lang] || label.en || "";
}

export default function QuestionCard() {
  const { t } = useTranslation();
  const path = useWizard((s) => s.path);
  const answer = useWizard((s) => s.answer);
  const lang = useWizard((s) => s.lang);

  // Local state for multi-select (always initialized, used conditionally)
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [freeText, setFreeText] = useState("");
  const [scaleValue, setScaleValue] = useState(50);

  const node = currentNode({ path });
  if (!node) return null;

  const nodeId = currentNodeId({ path });

  const isMulti = node.responseMode === "multiple";
  const isFreeText = node.responseMode === "free-text";
  const isScale = node.responseMode === "scale";

  const handleChoiceToggle = (choiceId: string) => {
    setSelectedIds((prev) =>
      prev.includes(choiceId) ? prev.filter((id) => id !== choiceId) : [...prev, choiceId]
    );
  };

  const handleSubmit = () => {
    if (isFreeText) {
      answer([], freeText);
    } else if (isMulti) {
      // Require at least one selected choice before advancing
      if (selectedIds.length === 0) return;
      answer(selectedIds, freeText);
    } else {
      // Single select - handled by onClick in option
    }
    setSelectedIds([]);
    setFreeText("");
    setScaleValue(50);
  };

  const isSelected = (id: string) => selectedIds.includes(id);

  const universalChoices = node.choices.filter(c => c.isUniversal);
  const regularChoices = node.choices.filter(c => !c.isUniversal);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={nodeId}
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -40 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="w-full max-w-xl mx-auto"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-slate-100 mb-1.5 flex items-start gap-1">
          {node.prompt[lang]}
          {node.help && (
            <TermTip text={node.help} />
          )}
        </h2>
        {node.help && <p className="text-sm text-slate-400 mb-6 italic">{node.help[lang]}</p>}

        <div className="flex flex-col gap-3">
          {/* Regular choices */}
          {regularChoices.map((opt) => (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => {
                if (isMulti) {
                  handleChoiceToggle(opt.id);
                } else {
                  answer([opt.id]);
                }
              }}
              whileHover={{ scale: 1.015, x: 4 }}
              whileTap={{ scale: 0.985 }}
              className={`group text-left rounded-xl border px-5 py-4 transition-colors cursor-pointer flex items-center gap-3 ${
                isMulti
                  ? isSelected(opt.id)
                    ? "border-amber-400 bg-amber-400/10"
                    : "border-slate-700/70 bg-slate-900/60 hover:border-amber-400/60 hover:bg-slate-800/70"
                  : "border-slate-700/70 bg-slate-900/60 hover:border-amber-400/60 hover:bg-slate-800/70"
              }`}
            >
              {isMulti ? (
                <span className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                  isSelected(opt.id)
                    ? "border-amber-400 bg-amber-400 text-slate-950"
                    : "border-slate-600 text-slate-400 hover:border-amber-400/60"
                }`}>
                  {isSelected(opt.id) && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </span>
              ) : (
                <span className="flex-shrink-0 w-5 h-5" />
              )}
              <span className="flex-1 text-base text-slate-100 group-hover:text-amber-200 transition-colors">
                {renderLabel(opt.label, lang)}
              </span>
              {opt.allowsMultiple && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-700 text-slate-400">
                  +more
                </span>
              )}
            </motion.button>
          ))}

          {/* Free-text input */}
          {isFreeText && (
            <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-5 py-4">
              <textarea
                value={freeText}
                onChange={(e) => setFreeText(e.target.value)}
                placeholder={t("app.freeTextPlaceholder") || "Describe in your own words..."}
                rows={3}
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-base resize-none focus:outline-none"
              />
            </div>
          )}

          {/* Scale input */}
          {isScale && (
            <div className="rounded-xl border border-slate-700/70 bg-slate-900/60 px-5 py-4">
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={scaleValue}
                  onChange={(e) => setScaleValue(Number(e.target.value))}
                  className="flex-1 accent-amber-400"
                />
                <span className="text-amber-400 font-mono text-lg w-12 text-right">{scaleValue}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 mt-2">
                <span>{node.choices[0]?.label[lang] || t("app.scaleLow") || "Not at all"}</span>
                <span>{node.choices[1]?.label[lang] || t("app.scaleHigh") || "Completely"}</span>
              </div>
            </div>
          )}

          {/* Universal escape hatches */}
          {node.universalChoices && universalChoices.length > 0 && (
            <div className="pt-2 border-t border-slate-800/50">
              {universalChoices.map((opt) => (
                <motion.button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    if (isMulti) {
                      handleChoiceToggle(opt.id);
                    } else {
                      answer([opt.id]);
                    }
                  }}
                  whileHover={{ scale: 1.01, x: 2 }}
                  whileTap={{ scale: 0.99 }}
                  className={`group text-left rounded-lg border px-4 py-3 transition-colors cursor-pointer flex items-center gap-3 ${
                    isMulti && isSelected(opt.id)
                      ? "border-amber-400 bg-amber-400/10"
                      : "border-slate-700/50 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/50"
                  }`}
                >
                  <span className={`flex-shrink-0 w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                    isMulti
                      ? isSelected(opt.id)
                        ? "border-amber-400 bg-amber-400 text-slate-950"
                        : "border-slate-600 text-slate-400 hover:border-amber-400/60"
                      : "border-slate-600 text-slate-400"
                  }`}>
                    {isMulti && isSelected(opt.id) && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </span>
                  <span className="text-sm text-slate-300 group-hover:text-amber-300 transition-colors">
                    {renderLabel(opt.label, lang)}
                  </span>
                </motion.button>
              ))}
            </div>
          )}

          {/* Submit button for multi-select and free-text */}
          {(isMulti || isFreeText) && (
            <motion.button
              type="button"
              onClick={handleSubmit}
              disabled={isMulti && selectedIds.length === 0}
              whileHover={isMulti && selectedIds.length === 0 ? undefined : { scale: 1.01, y: -1 }}
              whileTap={isMulti && selectedIds.length === 0 ? undefined : { scale: 0.99 }}
              className={`rounded-xl px-5 py-3.5 font-semibold text-base transition-colors cursor-pointer flex items-center justify-center gap-2 ${
                (isMulti && selectedIds.length === 0)
                  ? "border-slate-700 bg-slate-800/50 text-slate-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-400 to-orange-500 text-slate-950 hover:shadow-amber-500/30 hover:shadow-lg"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
              {t("app.continue") || "Continue"}
            </motion.button>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}