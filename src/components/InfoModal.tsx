"use client";

// ============================================================
// <InfoModal /> — accessible modal for app info sections
// ============================================================

import { motion, AnimatePresence } from "framer-motion";
import { useWizard } from "@/store/wizardStore";
import type { Lang } from "@/data/ontology";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  titleKey: string;
  // contentKey kept for API consistency but not used (content derived from titleKey)
  contentKey: string; // eslint-disable-line @typescript-eslint/no-unused-vars
}

const translations = {
  en: {
    whatAppDoes: {
      title: "What the app does",
      content: "Ontological Compass is a guided map of questions that helps a person describe their relationship to God, gods, ultimate reality, spirituality, and religious life. Rather than assigning one definitive label, it builds a nuanced orientation across questions of existence, unity or plurality, personhood, relation to the world, revelation, knowledge, and belonging. Crucially, it does not treat religion, practice, belief, ethnicity/culture, and ancestry as interchangeable: someone may participate in a tradition without holding its metaphysical beliefs, inherit a cultural or ancestral identity without practising a religion, hold spiritual beliefs without belonging to an institution, or belong meaningfully to more than one tradition."
    },
    whatPersonGains: {
      title: "What a person gains from this site",
      content: "By answering the questions, a person can arrive at a clearer, more precise account of their own outlook—one that distinguishes what they believe exists, how they think truth is known, how they practise or relate to tradition, and which communities or inheritances matter to them. The result is not a verdict on what they \"really are,\" but a revisable map that can make their position easier to understand, articulate, compare, and discuss with others."
    }
  },
  ru: {
    whatAppDoes: {
      title: "Что делает приложение",
      content: "Онтологический Компас — это навигатор вопросов, помогающий человеку описать свои отношения к Богу, богам, высшей реальности, духовности и религиозной жизни. Вместо назначения единственного ярлыка, он строит нюансированную ориентацию по вопросам бытия, единства или множественности, личности, отношения к миру, откровения, знания и принадлежности. Важно: он не смешивает религию, практику, веру, этнику/культуру и происхождение: можно участвовать в традиции, не разделяя её метафизические убеждения, наследовать культурную идентичность без религии, иметь духовные убеждения без принадлежности к институту или значимо принадлежать к нескольким традициям одновременно."
    },
    whatPersonGains: {
      title: "Что человек получает от этого сайта",
      content: "Отвечая на вопросы, человек может прийти к более ясному и точному пониманию своей позиции — позиции, которая разделяет: во что он верует существующим, как считает, что познаётся истина, как он практикуется или относится к традиции, и какие общины или наследия для него важны. Результат — не вердикт о том, кем он «на самом деле является», а пересматриваемая карта, делающая его позицию легче для понимания, формулирования, сравнения и обсуждения с другими."
    }
  },
  az: {
    whatAppDoes: {
      title: "Tətbiq nə edir",
      content: "Ontoloji Kompas — bir şəxsin Tanrı, tanrılar, yekun reallıq, mənəviyyət və dini həyata əlaqəsini təsvir etməyə kömək edən sualların rehber xəritəsidir. Yeganə müayyən etiket qoymaq yerine, bu tətbiq mövcudluq, vahidlik və ya çoxluqluq, şəxsiyyət, dünya ilə əlaqə, vahiy, bilik və aidiyyət sualları boylama inci bir orientasiya qurur. Bu vacibdir: o, dini, təcrübəni, inanı, etniya/mədaniyyəti və əsili bir-birinə bərabər görmür: kimsə inanışların метафизикаschen inanışlarını paylaşmadan bir ənənədə iştirak edə bilər, dini praktika olmadan mədəni və ya əsilli identiteti miras olaraq götürə bilər, institut-a aidiyyət olmadan mənəvi inanışları ola bilər və ya bir neçə ənənəyə eyni vaxtda mənalı aidiyyəti ola bilər."
    },
    whatPersonGains: {
      title: "Bu saytdan insan nə qazandır",
      content: "Sualara cavab verərək, insan öz worldview-ına (dünyaqarışına) daha aydın, dəqiq bir hesabat ala bilər — hansı bir hesabat ki, onlar nəyin mövcud olduğunu inandırır, həqiqətin necə başa düşüldüyünü, ənənə ilə necə təcrübə edir və ya əlaqədar olduğunu, və hansı cəmmələr və miraslar onların üçün vacibdir. Nəticə — onlar «həqiqətən kimdir» haqqında bir hökmdar deyil, amma onları başa düşmək, ifadə etmək, müqayisə etmək və başqaları ilə müzakirə etmək asanlaşdıran, yenidən baxıla bilən bir xəritədir."
    }
  }
};

export default function InfoModal({ isOpen, onClose, titleKey, contentKey }: InfoModalProps) {
  const lang = useWizard((s) => s.lang) as Lang;

  const getContent = (lang: Lang, key: string) => {
    const langMap = translations[lang] || translations.en;
    const section = langMap[key as keyof typeof langMap];
    return section ? { title: section.title, content: section.content } : { title: "", content: "" };
  };

  const { title, content } = getContent(lang, titleKey);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-labelledby="info-modal-title"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900/95 shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-6 py-4">
            <h2 id="info-modal-title" className="text-xl font-bold text-slate-100">
              {title}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(85vh-80px)]">
            <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed">
              <p className="whitespace-pre-wrap">{content}</p>
            </div>
          </div>

          {/* Footer accent */}
          <div className="border-t border-slate-700 px-6 py-3">
            <div className="flex items-center justify-center gap-2">
              <div className="w-12 h-px bg-gradient-to-r from-transparent via-amber-400 to-transparent" />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}