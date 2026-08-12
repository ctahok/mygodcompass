"use client";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Redirect to the best-matching locale based on browser language
    const nav = navigator.language?.toLowerCase() ?? "en";
    let locale = "en";
    if (nav.startsWith("ru")) locale = "ru";
    else if (nav.startsWith("az")) locale = "az";
    window.location.replace(`/${locale}`);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <p className="text-slate-400">Redirecting…</p>
    </div>
  );
}
