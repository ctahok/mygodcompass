"use client";

import { useEffect } from "react";
import IslamQuiz from "@/components/IslamQuiz";
import { useWizard } from "@/store/wizardStore";
import type { Lang } from "@/data/ontology";
import i18n from "@/lib/i18n";

export default function QuizPageClient({ locale }: { locale: string }) {
  const setLang = useWizard((s) => s.setLang);
  const l = locale as Lang;

  useEffect(() => {
    document.documentElement.lang = l;
    setLang(l);
    i18n.changeLanguage(l);
  }, [l, setLang]);

  return <IslamQuiz />;
}