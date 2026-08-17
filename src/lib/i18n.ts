// ============================================================
// i18n setup — EN / RU / AZ with browser language detection
// ============================================================

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

export const resources = {
  en: {
    translation: {
      app: {
        title: "The Ontological Compass",
        subtitle: "A gamified journey to define your exact concept of God",
        start: "Begin the Journey",
        restart: "Start Over",
        back: "Back",
        next: "Continue",
        continue: "Continue",
        progress: "Coherence",
        tooltip: "What does this mean?",
        blueprint: "The Blueprint",
        socialProof: "other users defined God exactly this way",
        community: "You are in the {{pct}}% of users",
        similarMinds: "Your definition matches",
        share: "Share my Definition",
        copied: "Copied to clipboard!",
        footer: "Built with philosophical rigor, not dogma.",
        freeTextPlaceholder: "Describe in your own words...",
        scaleLow: "Not at all",
        scaleHigh: "Completely",
        finish: "Finish for now",
        whatAppDoes: "What it does",
        whatPersonGains: "What you gain",
        candidatesTitle: "Most Compatible Pathways",
        candidatesHint: "Your answers do not determine your religion — they identify paths you may wish to explore next.",
        explorePath: "Explore this path",
        noneFit: "None of these fit",
        alreadyIdentify: "I already identify with a tradition",
        keepAnswering: "Keep answering general questions",
      },
      animal: {
        neutral: "Watching...",
        coherent: "In harmony",
        conflict: "Hmm, that contradicts...",
        complete: "Ascended!"
      },
      terms: {
        ontology: "The study of what exists and how things are categorized.",
        monotheism: "Belief in a single supreme God.",
        polytheism: "Belief in multiple gods with distinct domains.",
        pantheism: "The belief that God and the universe are identical.",
        deism: "God created the universe but does not intervene in it.",
        theism: "Belief in a God who actively interacts with the world.",
        constructivism: "The view that categories like 'God' are created by societies or minds.",
        realism: "The view that things exist independently of human minds."
      },
      meta: {
        description: "Answer a few questions and discover your exact concept of God — mapped through the history of philosophy."
      }
    }
  },
  ru: {
    translation: {
      app: {
        title: "Онтологический Компас",
        subtitle: "Игровое путешествие к определению вашего понятия Бога",
        start: "Начать путешествие",
        restart: "Начать заново",
        back: "Назад",
        next: "Продолжить",
        continue: "Продолжить",
        progress: "Когерентность",
        tooltip: "Что это значит?",
        blueprint: "Чертёж",
        socialProof: "других пользователей определили Бога точно так же",
        community: "Вы в {{pct}}% пользователей",
        similarMinds: "Ваше определение совпадает с",
        share: "Поделиться определением",
        copied: "Скопировано в буфер!",
        footer: "Создано с философской строгостью, а не догмой.",
        freeTextPlaceholder: "Опишите своими словами...",
        scaleLow: "Совсем нет",
        scaleHigh: "Полностью",
        finish: "Завершить сейчас",
        whatAppDoes: "Что делает приложение",
        whatPersonGains: "Что вы получаете",
        candidatesTitle: "Наиболее совместимые пути",
        candidatesHint: "Ваши ответы не определяют вашу религию — они выявляют пути, которые вы можете исследовать дальше.",
        explorePath: "Исследовать этот путь",
        noneFit: "Ничего из этого не подходит",
        alreadyIdentify: "Я уже отношу себя к традиции",
        keepAnswering: "Продолжить отвечать на общие вопросы",
      },
      animal: {
        neutral: "Наблюдает...",
        coherent: "В гармонии",
        conflict: "Хм, это противоречие...",
        complete: "Вознёсся!"
      },
      terms: {
        ontology: "Учение о том, что существует и как вещи категоризируются.",
        monotheism: "Вера в единого верховного Бога.",
        polytheism: "Вера во множество богов с разными сферами.",
        pantheism: "Учение о том, что Бог и вселенная тождественны.",
        deism: "Бог создал вселенную, но не вмешивается в неё.",
        theism: "Вера в Бога, активно взаимодействующего с миром.",
        constructivism: "Взгляд, что категории вроде «Бога» созданы обществами или сознанием.",
        realism: "Взгляд, что вещи существуют независимо от человеческого сознания."
      },
      meta: {
        description: "Ответьте на несколько вопросов и узнайте своё точное понятие Бога — через историю философии."
      }
    }
  },
  az: {
    translation: {
      app: {
        title: "Ontoloji Kompas",
        subtitle: "Tanrı haqqında dəqiq anlayışınızı müəyyən etmək üçün oyunlaşdırılmış səyahət",
        start: "Səyahətə başla",
        restart: "Başdan başla",
        back: "Geri",
        next: "Davam et",
        continue: "Davam et",
        progress: "Uyğunluq",
        tooltip: "Bu nə deməkdir?",
        blueprint: "Plan",
        socialProof: "digər istifadəçi Tanrını məhz belə müəyyən edib",
        community: "Siz istifadəçilərin {{pct}}%-indəsiniz",
        similarMinds: "Tərifiniz uyğun gəlir",
        share: "Tərifimi paylaş",
        copied: "Panoya kopyalandı!",
        footer: "Fəlsəfi sərtliklə qurulub, dogma ilə yox.",
        freeTextPlaceholder: "Öz sözlerinizlə təsvir edin...",
        scaleLow: "Həqiqətən yox",
        scaleHigh: "Tamamilə",
        finish: "İndi tamamla",
        whatAppDoes: "Tətbiq nə edir",
        whatPersonGains: "Siz nə qazandırırsınız",
        candidatesTitle: "Ən uyğun yollar",
        candidatesHint: "Cavablarınız dininizi müəyyən etmir — onlar araşdıra biləcəyiniz yolları göstərir.",
        explorePath: "Bu yolu araşdır",
        noneFit: "Bunlardan heç biri uyğun deyil",
        alreadyIdentify: "Mən artıq bir ənənə ilə eyniləşirəm",
        keepAnswering: "Ümumi suallara cavab verməyə davam et",
      },
      animal: {
        neutral: "Müşahidə edir...",
        coherent: "Harmoniyada",
        conflict: "Hmm, bu ziddiyyətdir...",
        complete: "Ucaldı!"
      },
      terms: {
        ontology: "Nəyin mövcud olduğunu və şeylərin necə kateqoriyalaşdırıldığını öyrənən təlim.",
        monotheism: "Vahid ali Tanrıya inam.",
        polytheism: "Fərqli sahələri olan çoxlu tanrılara inam.",
        pantheism: "Tanrı və kainatın eyni olması inancı.",
        deism: "Tanrı kainatı yaradıb, amma ona müdaxilə etmir.",
        theism: "Dünya ilə fəal əlaqədə olan Tanrıya inam.",
        constructivism: "«Tanrı» kimi kateqoriyaların cəmiyyət və ya şüur tərəfindən yaradıldığı görüşü.",
        realism: "Şeylərin insan şüurundan asılı olmayaraq mövcud olduğu görüşü."
      },
      meta: {
        description: "Bir neçə suala cavab verin və fəlsəfə tarixi boyunca Tanrı haqqında dəqiq anlayışınızı kəşf edin."
      }
    }
  }
};

/** Detect a supported language, defaulting to EN */
function detectLang(): "en" | "ru" | "az" {
  if (typeof window === "undefined") return "en";
  const nav = navigator.language?.toLowerCase() ?? "en";
  if (nav.startsWith("ru")) return "ru";
  if (nav.startsWith("az")) return "az";
  return "en";
}

if (!i18n.isInitialized) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
      resources,
      lng: detectLang(),
      fallbackLng: "en",
      supportedLngs: ["en", "ru", "az"],
      interpolation: { escapeValue: false },
    });
}

export default i18n;