"use client";

// ============================================================
// <CandidateCard /> — ranked candidate pathway presentation.
// Shown at the candidate_traditions stage. Does NOT end the
// journey: selecting a path opens the religion-specific subtree.
// ============================================================

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useWizard, topCandidates } from "@/store/wizardStore";
import { NODES } from "@/data/ontology";

const CANDIDATE_LABELS: Record<string, { name: string; nodeId: string }> = {
  christianity: { name: "Christianity", nodeId: "christian_detail" },
  islam: { name: "Islam", nodeId: "islam_detail" },
  judaism: { name: "Judaism", nodeId: "jewish_detail" },
  sikhism: { name: "Sikhism", nodeId: "sikh_detail" },
  bahai: { name: "the Baháʼí Faith", nodeId: "bahai_detail" },
  hindu: { name: "Hindu traditions", nodeId: "hindu_detail" },
  buddhism: { name: "Buddhism", nodeId: "buddhist_detail" },
  deism: { name: "Deism", nodeId: "deism_detail" },
  pantheism: { name: "Pantheism / Panentheism", nodeId: "pantheism_detail" },
  polytheism: { name: "Polytheist paths", nodeId: "pagan_detail" },
  pagan: { name: "Pagan paths", nodeId: "pagan_detail" },
  secular: { name: "Secular / non-religious", nodeId: "secular_profile" },
  atheism: { name: "Atheism", nodeId: "secular_profile" },
  agnosticism: { name: "Agnosticism", nodeId: "agnostic" },
  humanism: { name: "Humanism", nodeId: "secular_profile" },
  naturalism: { name: "Religious naturalism", nodeId: "rnatural_profile" },
  daoism: { name: "Daoism", nodeId: "eastasian_detail" },
  shinto: { name: "Shinto", nodeId: "eastasian_detail" },
  jainism: { name: "Jainism", nodeId: "southasian_detail" },
  indigenous: { name: "Indigenous / ancestral paths", nodeId: "indigenous_detail" },
  classical_theism: { name: "Classical theism", nodeId: "agency" },
  process_theism: { name: "Process / relational theism", nodeId: "pantheism_detail" },
  sufism: { name: "Sufi-oriented Islam", nodeId: "islam_detail" },
};

export default function CandidateCard() {
  const { t } = useTranslation();
  const answer = useWizard((s) => s.answer);
  const candidateScores = useWizard((s) => s.candidateScores);
  const path = useWizard((s) => s.path);

  const candidates = topCandidates(candidateScores, 6);

  const explore = (candidateId: string) => {
    const info = CANDIDATE_LABELS[candidateId];
    if (!info) return;
    // Find the matching choice in the current candidate_traditions node
    const node = NODES.candidate_traditions;
    const choice = node?.choices.find((c) => c.next?.[0] === info.nodeId);
    if (choice) answer([choice.id]);
  };

  const confidenceLevel = (score: number): { label: string; cls: string } => {
    if (score >= 6) return { label: "high", cls: "bg-emerald-400/20 text-emerald-300 border-emerald-400/30" };
    if (score >= 3) return { label: "moderate", cls: "bg-amber-400/20 text-amber-300 border-amber-400/30" };
    return { label: "tentative", cls: "bg-slate-700/40 text-slate-300 border-slate-600/50" };
  };

  if (candidates.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="w-full max-w-xl mx-auto"
    >
      <div className="rounded-2xl border border-amber-400/30 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-7 shadow-2xl shadow-amber-500/10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-amber-400/80 mb-2">Candidate pathways</p>
        <h2 className="text-2xl md:text-3xl font-bold text-amber-100 mb-2">
          {t("app.candidatesTitle")}
        </h2>
        <p className="text-slate-400 text-sm mb-6">{t("app.candidatesHint")}</p>

        {/* Ranked candidates */}
        <div className="flex flex-col gap-3 mb-6">
          {candidates.map((c) => {
            const info = CANDIDATE_LABELS[c.id];
            if (!info) return null;
            const conf = confidenceLevel(c.score);
            return (
              <div
                key={c.id}
                className="flex items-center justify-between gap-3 rounded-xl border border-slate-700/70 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <div className="text-base text-slate-100 font-medium">{info.name}</div>
                  <div className="text-[11px] text-slate-500">compatibility score: {c.score}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${conf.cls}`}>
                    {conf.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => explore(c.id)}
                    className="rounded-lg bg-amber-400/90 hover:bg-amber-300 px-3 py-1.5 text-xs font-semibold text-slate-950 transition-colors cursor-pointer"
                  >
                    {t("app.explorePath")}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Alternate actions */}
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={() => {
              const node = NODES.candidate_traditions;
              const choice = node?.choices.find((c) => c.id === "explore_none");
              if (choice) answer([choice.id]);
            }}
            className="flex-1 rounded-xl border border-slate-700 hover:border-slate-500 px-4 py-2.5 text-sm text-slate-300 transition-colors cursor-pointer"
          >
            {t("app.noneFit")}
          </button>
          <button
            type="button"
            onClick={() => {
              const node = NODES.candidate_traditions;
              const choice = node?.choices.find((c) => c.id === "already_identify");
              if (choice) answer([choice.id]);
            }}
            className="flex-1 rounded-xl border border-slate-700 hover:border-slate-500 px-4 py-2.5 text-sm text-slate-300 transition-colors cursor-pointer"
          >
            {t("app.alreadyIdentify")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
