"use client";

import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const html = document.documentElement;
    if (!isDark) {
      html.classList.remove("dark");
      html.classList.add("light");
    } else {
      html.classList.remove("light");
      html.classList.add("dark");
    }
    // Update meta theme color
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute("content", isDark ? "#020617" : "#f8fafc");
    }
  }, [isDark]);

  return (
    <button
      type="button"
      onClick={() => setIsDark((d) => !d)}
      className="fixed top-4 right-4 z-50 rounded-full bg-slate-800 border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-amber-300 hover:border-amber-400 transition-colors shadow-lg"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
    >
      {isDark ? "☀ Light" : "🌙 Dark"}
    </button>
  );
}
