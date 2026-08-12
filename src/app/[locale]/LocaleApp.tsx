"use client";

import { useEffect } from "react";
import "@/lib/i18n";
import i18n from "@/lib/i18n";
import { useWizard } from "@/store/wizardStore";
import WizardEngine from "@/components/WizardEngine";
import type { Lang } from "@/data/ontology";

export default function LocaleApp({ locale }: { locale: string }) {
  const setLang = useWizard((s) => s.setLang);
  const l = locale as Lang;

  useEffect(() => {
    document.documentElement.lang = l;
    setLang(l);
    i18n.changeLanguage(l);
  }, [l, setLang]);

  return <WizardEngine />;
}
