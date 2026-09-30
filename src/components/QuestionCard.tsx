"use client";

// ============================================================
// <QuestionCard /> — the main stage: question + options.
// Supports: single | multiple | free-text | scale response modes
// Universal escape hatches: Unsure, Not my frame, Multiple, Decline label
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useLayoutEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import type { ReactNode, RefObject, MouseEvent } from "react";
import { create } from "zustand";

import { type LocalizedText, type Lang } from "@/data/ontology";

interface TooltipStore {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const useTooltipStore = create<TooltipStore>((set) => ({
  activeId: null,
  setActiveId: (id: string | null) => set({ activeId: id }),
}));
import { useWizard, currentNodeId, currentNode } from "@/store/wizardStore";
import { getTermDefinition, type TermDefinition } from "@/data/termDefinitions";

type TooltipPosition = {
  left: number;
  top: number;
  placement: "above" | "below";
};

function useTooltipPosition(
  open: boolean,
  triggerRef: RefObject<HTMLButtonElement>,
  tooltipRef: RefObject<HTMLSpanElement>,
) {
  const [position, setPosition] = useState<TooltipPosition | null>(null);

  useLayoutEffect(() => {
    if (!open) {
      setPosition(null);
      return;
    }

    const positionTooltip = () => {
      const trigger = triggerRef.current;
      const tooltip = tooltipRef.current;
      if (!trigger || !tooltip) return;

      const popupWidth = tooltip.offsetWidth || 280;
      const popupHeight = tooltip.offsetHeight || 80;
      const triggerRect = trigger.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const padding = 12;

      // Position horizontally aligned with the trigger, clamped within viewport
      const center = triggerRect.left + triggerRect.width / 2;
      const left = Math.min(
        Math.max(center - popupWidth / 2, padding),
        Math.max(padding, viewportWidth - popupWidth - padding),
      );

      // Prefer displaying above the trigger; flip below if tight on space above
      let top = triggerRect.top - popupHeight - 8;
      let placement: TooltipPosition["placement"] = "above";
      if (top < padding) {
        top = triggerRect.bottom + 8;
        placement = "below";
      }
      top = Math.min(
        Math.max(top, padding),
        Math.max(padding, viewportHeight - popupHeight - padding),
      );

      setPosition({ left, top, placement });
    };

    positionTooltip();
    window.addEventListener("resize", positionTooltip);
    window.addEventListener("scroll", positionTooltip, true);
    return () => {
      window.removeEventListener("resize", positionTooltip);
      window.removeEventListener("scroll", positionTooltip, true);
    };
  }, [open, triggerRef, tooltipRef]);

  return { position };
}

function Tooltip({
  open,
  tooltipRef,
  position,
  children,
}: {
  open: boolean;
  tooltipRef: RefObject<HTMLSpanElement>;
  position: TooltipPosition | null;
  children: ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!open || !mounted) return null;

  const content = (
    <span
      ref={tooltipRef}
      onClick={(e: MouseEvent) => {
        e.stopPropagation();
      }}
      style={{
        position: "fixed",
        left: position ? `${position.left}px` : "0px",
        top: position ? `${position.top}px` : "0px",
        visibility: position ? "visible" : "hidden",
        opacity: position ? 1 : 0,
        zIndex: 99999,
      }}
      className={`w-max max-w-[calc(100vw-2rem)] sm:max-w-[340px] max-h-[calc(100vh-2rem)] overflow-y-auto rounded-xl border border-slate-700 bg-slate-900/95 backdrop-blur-md px-3.5 py-2.5 text-xs leading-snug text-slate-200 shadow-2xl transition-opacity duration-150 ${
        position?.placement === "above" ? "mb-2" : "mt-2"
      }`}
    >
      {children}
    </span>
  );

  return createPortal(content, document.body);
}

function TermTip({ text }: { text: LocalizedText }) {
  const { t } = useTranslation();
  const lang = useWizard((s) => s.lang);
  
  const activeId = useTooltipStore((s) => s.activeId);
  const setActiveId = useTooltipStore((s) => s.setActiveId);
  const tipId = useMemo(() => `tip-${Math.random()}`, []);
  const open = activeId === tipId;
  const toggleOpen = () => setActiveId(open ? null : tipId);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const { position } = useTooltipPosition(open, triggerRef, tooltipRef);

  return (
    <span className="relative inline-flex items-center overflow-visible">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("app.tooltip")}
        onClick={(e) => {
          e.stopPropagation();
          toggleOpen();
        }}
        className="ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-slate-700/70 text-[10px] font-bold text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
      >
        i
      </button>
      <Tooltip
        open={open}
        tooltipRef={tooltipRef}
        position={position}
      >
        {text[lang]}
      </Tooltip>
    </span>
  );
}

/**
 * TermInfo — small "i" button next to a choice label showing a gloss
 * (localized) plus clickable authoritative sources (SEP, Wikipedia, etc.).
 */
function TermInfo({ def }: { def: TermDefinition }) {
  const { t } = useTranslation();
  const lang = useWizard((s) => s.lang);
  
  const activeId = useTooltipStore((s) => s.activeId);
  const setActiveId = useTooltipStore((s) => s.setActiveId);
  const tipId = useMemo(() => `tip-${Math.random()}`, []);
  const open = activeId === tipId;
  const toggleOpen = () => setActiveId(open ? null : tipId);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipRef = useRef<HTMLSpanElement>(null);
  const { position } = useTooltipPosition(open, triggerRef, tooltipRef);

  return (
    <span className="relative inline-flex items-center overflow-visible">
      <button
        ref={triggerRef}
        type="button"
        aria-label={t("app.tooltip")}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          toggleOpen();
        }}
        className="ml-1.5 inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border border-slate-600/70 bg-slate-800/80 text-[11px] font-bold text-slate-400 hover:border-amber-400/70 hover:text-amber-300 focus-visible:outline-amber-400 transition-colors cursor-pointer"
      >
        i
      </button>
      <Tooltip
        open={open}
        tooltipRef={tooltipRef}
        position={position}
      >
        <span className="block text-slate-200">{def.gloss[lang]}</span>
        {def.sources.length > 0 && (
          <span className="mt-2 block border-t border-slate-800 pt-1.5">
            {def.sources.map((src, idx) => (
              <a
                key={idx}
                href={src.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="block py-0.5 text-amber-300/90 hover:text-amber-200 hover:underline"
              >
                ↗ {src.title[lang]}
              </a>
            ))}
          </span>
        )}
      </Tooltip>
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

  // Close tooltips on outside click
  useEffect(() => {
    const handleClickOutside = () => useTooltipStore.getState().setActiveId(null);
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

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

  const isUniversalEscapeHatch = (choice: typeof node.choices[0]) =>
    choice.isUniversal === "unsure" || choice.isUniversal === "not_my_frame";

  const handleChoiceToggle = (choiceId: string) => {
    setSelectedIds((prev) => {
      const choice = node.choices.find(c => c.id === choiceId);
      if (!choice) return prev;

      const isCurrentlySelected = prev.includes(choiceId);
      const isEscapeHatch = isUniversalEscapeHatch(choice);

      if (isCurrentlySelected) {
        // Deselecting - just remove it
        return prev.filter((id) => id !== choiceId);
      }

      // Selecting
      if (isEscapeHatch) {
        // Selecting an escape hatch: clear all other choices
        return [choiceId];
      } else {
        // Selecting a regular choice: remove any escape hatches
        return [...prev.filter(id => {
          const c = node.choices.find(opt => opt.id === id);
          return c && !isUniversalEscapeHatch(c);
        }), choiceId];
      }
    });
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
              {getTermDefinition(opt.id) && <TermInfo def={getTermDefinition(opt.id)!} />}
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
                  {getTermDefinition(opt.id) && <TermInfo def={getTermDefinition(opt.id)!} />}
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