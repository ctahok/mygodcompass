"use client";

import { useEffect } from "react";
import "@/lib/i18n";
import WizardEngine from "@/components/WizardEngine";

export default function Home() {
  useEffect(() => {
    document.documentElement.lang = "en";
  }, []);

  return <WizardEngine />;
}
