"use client";

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ThemeToggle() {
  const { t } = useTranslation();
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const html = document.documentElement;
    const isCurrentlyDark = html.classList.contains("dark") || !html.classList.contains("light");
    setIsDark(isCurrentlyDark);
  }, []);

  const toggleTheme = () => {
    const nextDark = !isDark;
    setIsDark(nextDark);
    const html = document.documentElement;

    if (nextDark) {
      html.classList.add("dark");
      html.classList.remove("light");
      try {
        localStorage.setItem("theme", "dark");
      } catch {}
    } else {
      html.classList.add("light");
      html.classList.remove("dark");
      try {
        localStorage.setItem("theme", "light");
      } catch {}
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", nextDark ? "#020617" : "#f8fafc");
    }
  };

  if (!mounted) {
    return (
      <div className="fixed top-3 right-3 z-50 w-20 h-8 pointer-events-none" />
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`fixed top-3 right-3 z-50 rounded-full px-3 py-1.5 text-xs font-semibold shadow-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 border ${
        isDark
          ? "bg-slate-900/90 text-amber-300 border-slate-700/80 hover:border-amber-400/70 hover:bg-slate-800"
          : "bg-white/95 text-slate-800 border-slate-300 hover:border-amber-500 hover:bg-slate-100 shadow-md"
      }`}
      aria-label={isDark ? (t("app.themeLight") || "Light") : (t("app.themeDark") || "Dark")}
    >
      <span className="text-sm">{isDark ? "☀" : "🌙"}</span>
      <span>{isDark ? (t("app.themeLight") || "Light") : (t("app.themeDark") || "Dark")}</span>
    </button>
  );
}
