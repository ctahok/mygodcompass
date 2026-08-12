"use client";

// ============================================================
// <LanguageToggle /> — EN / RU / AZ switcher.
// ============================================================

import { useTranslation } from "react-i18next";
import { useWizard } from "@/store/wizardStore";
import type { Lang } from "@/data/ontology";

const LANGS: { code: Lang; label: string }[] = [
  { code: "en", label: "EN" },
  { code: "ru", label: "RU" },
  { code: "az", label: "AZ" },
];

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const lang = useWizard((s) => s.lang);
  const setLang = useWizard((s) => s.setLang);

  const change = (code: Lang) => {
    setLang(code);
    i18n.changeLanguage(code);
    // Navigate to the locale-prefixed URL (keeps /en /ru /az paths)
    const path = window.location.pathname.replace(/^\/(en|ru|az)\/?/, "");
    window.location.href = `/${code}/${path}`.replace(/\/$/, "");
  };

  return (
    <div className="flex items-center gap-1 rounded-full border border-slate-700/70 bg-slate-900/70 p-1">
      {LANGS.map((l) => (
        <button
          key={l.code}
          type="button"
          onClick={() => change(l.code)}
          className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors cursor-pointer ${
            lang === l.code ? "bg-amber-400 text-slate-950" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
