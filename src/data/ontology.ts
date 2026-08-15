// ============================================================
// The Ontological Compass — Multi-axis orientation map (v2)
// A graph (not a tree). Nodes can have multiple incoming edges.
// Responses activate tags; multiple selections allowed.
// Self-description stored alongside analytic tags.
// ============================================================

export type Lang = "en" | "ru" | "az";
export type LocalizedText = Record<Lang, string>;

// Response affordances: Yes, No, Unsure, Not how I frame it, More than one/both
export interface Choice {
  id: string;
  label: LocalizedText;
  /** Analytic tags for profiling (not shown to user) */
  tags?: string[];
  /** Next node(s) — can branch to multiple paths */
  next?: string[];
  /** Allow this choice to be selected alongside others */
  allowsMultiple?: boolean;
  /** Universal escape hatches always offered */
  isUniversal?: "unsure" | "not_my_frame" | "multiple" | "decline_label";
}

export interface Node {
  id: string;
  prompt: LocalizedText;
  help?: LocalizedText;
  /** "single" | "multiple" | "free-text" | "scale" */
  responseMode: "single" | "multiple" | "free-text" | "scale";
  /** Always offer unsure/not-my-frame/multiple/decline */
  universalChoices?: boolean;
  choices: Choice[];
}

export interface Profile {
  /** User's own words */
  selfDescription?: string;
  /** Analytic tags from answers */
  orientation?: string[];
  ultimateReality?: string[];
  numberUnity?: string[];
  agency?: string[];
  worldRelation?: string[];
  epistemicSources?: string[];
  traditions?: string[];
  practices?: string[];
  culturalHeritages?: string[];
  confidence?: "settled" | "tentative" | "exploring" | "varies";
  /** Legacy single-label classification (deprecated, for backward compat) */
  legacyTerminal?: string;
}

export interface Reference {
  title: LocalizedText;
  url: string;
  type: "wikipedia" | "sep" | "official" | "academic" | "other";
}

// ------------------------------------------------------------
// NODES — the multi-axis graph
// ------------------------------------------------------------
export const NODES: Record<string, Node> = {
  // ============ ENTRY: ORIENTATION FRAME ============
  start: {
    id: "start",
    prompt: {
      en: "What kind of orientation best describes you?",
      ru: "Какой подход лучше всего описывает ваш взгляд?",
      az: "Hangi yanaşma sizi ən yaxşı təsvir edir?",
    },
    help: {
      en: "You can select more than one. This sets the overall pathway.",
      ru: "Можно выбрать несколько. Это определяет общий путь.",
      az: "Bir neçə seçmək olar. Bu ümumi yolu müəyyən edir.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      {
        id: "no_frame",
        label: {
          en: "I do not use religious or spiritual categories",
          ru: "Я не использую религиозные или духовные категории",
          az: "Mən dini və ya mənəvi kateqoriyalar istifadə etmirəm",
        },
        tags: ["non-religious-frame"],
        next: ["nonreligious"],
      },
      {
        id: "explore",
        label: {
          en: "I use, or am open to, religious/spiritual/philosophical categories",
          ru: "Я использую или открыт к религиозным/духовным/философским категориям",
          az: "Mən dini/mənəvi/fəlsəfi kateqoriyalardan istifadə edirəm və ya onlara açıqəm",
        },
        tags: ["open-to-categories"],
        next: ["ultimate"],
      },
      {
        id: "unsure_frame",
        label: {
          en: "Unsure / exploring / varies by context",
          ru: "Не уверен / изучаю / зависит от контекста",
          az: "Əmin deyiləm / araşırəm / kontekstə görə dəyişir",
        },
        tags: ["unsure-frame"],
        next: ["ultimate"],
        isUniversal: "unsure",
      },
    ],
  },

  // ============ NON-RELIGIOUS FRAME BRANCH ============
  nonreligious: {
    id: "nonreligious",
    prompt: {
      en: "Do you nevertheless regard any reality, value, or experience as sacred, transcendent, or spiritually significant?",
      ru: "Всё же считаете ли вы какую-то реальность, ценность или опыт священным, траендентным или духовно значимым?",
      az: "Hər də, hansısa realliyi, dəyəri və ya təcrübəni məqdis, üstdə və ya mənəvi cəhətdən əhəmiyyətli hesab edirsiniz?",
    },
    help: {
      en: "Some non-religious people still hold certain things as sacred (e.g., nature, humanity, truth).",
      ru: "Некоторые нерелигиозные люди всё равно считают что-то священным (природа, человечество, правда).",
      az: "Bəzi dini deyil şəxslər hələ də bir şeyi məqdis hesab edir (təbiat, insanlıq, haqq).",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      {
        id: "no_sacred",
        label: {
          en: "No — nothing is sacred or transcendent for me",
          ru: "Нет — ничего не является священным или траендентным для меня",
          az: "Xeyr — heç bir şey məni üçün məqdis və ya üstdə deyil",
        },
        tags: ["secular", "naturalist"],
        next: ["secular_profile"],
      },
      {
        id: "yes_sacred",
        label: {
          en: "Yes or perhaps — I relate to something as sacred/transcendent",
          ru: "Да или, возможно, — я отношусь к чему-то как к священному/траендентному",
          az: "Bəli və ya belə ki — mən bir şeyə məqdis/üstdə kimi baxırım",
        },
        tags: ["religious-naturalist", "spiritual-naturalist"],
        next: ["rnatural_profile"],
      },
      {
        id: "unclear_nonreligious",
        label: {
          en: "The question is unclear to me",
          ru: "Вопрос неясен для меня",
          az: "Sual mənim üçün anlaşılmır",
        },
        tags: ["non-categorised"],
        next: ["nonlabel_profile"],
        isUniversal: "not_my_frame",
      },
    ],
  },

  secular_profile: {
    id: "secular_profile",
    prompt: {
      en: "How would you describe your non-religious orientation?",
      ru: "Как бы вы описали вашу нерелигиозную ориентацию?",
      az: "Siz öz dini olmayan yanaşmanızı necə təsvir edərdiniz?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "atheist", label: { en: "Atheist", ru: "Атеист", az: "Ateist" }, tags: ["atheist"] },
      { id: "secular_humanist", label: { en: "Secular humanist", ru: "Светский гуманист", az: "Dünyəvi humanist" }, tags: ["secular-humanist"] },
      { id: "naturalist", label: { en: "Naturalist", ru: "Натуралист", az: "Naturalist" }, tags: ["naturalist"] },
      { id: "apatheist", label: { en: "Apatheist (indifferent to the question)", ru: "Апатеист (безразличен к вопросу)", az: "Apatist (sualdan bəxid etməz)" }, tags: ["apatheist"] },
      { id: "anti_theist", label: { en: "Anti-theist", ru: "Антитеист", az: "Anti-teist" }, tags: ["anti-theist"] },
      { id: "self_described_nonrel", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_nonrel"] },
    ],
  },

  rnatural_profile: {
    id: "rnatural_profile",
    prompt: {
      en: "Which term fits your naturalistic sacred orientation?",
      ru: "Какой термин подходит для вашего натуралистического священного отношения?",
      az: "Hansı termin sizin naturalistik məqdis yanaşmanıza uyğun gəlir?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "religious_naturalist", label: { en: "Religious naturalist", ru: "Религиозный натуралист", az: "Dini naturalist" }, tags: ["religious-naturalist"] },
      { id: "spiritual_naturalist", label: { en: "Spiritual naturalist", ru: "Духовный натуралист", az: "Mənəvi naturalist" }, tags: ["spiritual-naturalist"] },
      { id: "nontheistic_sacred", label: { en: "Non-theistic sacred orientation", ru: "Нетеистическое священное отношение", az: "Non-teistik məqdis yanaşma" }, tags: ["nontheistic-sacred"] },
      { id: "self_described_rnatural", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_rnatural"] },
    ],
  },

  nonlabel_profile: {
    id: "nonlabel_profile",
    prompt: {
      en: "You have chosen not to categorise your orientation. Would you like to add a free-text self-description?",
      ru: "Вы выбрали не категоризировать свою ориентацию. Хотите добавить свободное описание?",
      az: "Siz yanaşmanızı kateqoriyalaşdırmamaq seçdiniz. Azad təsvir əlavə etmək istəyirsiniz?",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "skip_nonlabel", label: { en: "Skip — no label needed", ru: "Пропустить — ярлык не нужен", az: "Keç — etiket lazım deyil" }, tags: ["decline-label"] },
    ],
  },

  // ============ CORE METAPHYSICS: ULTIMATE REALITY ============
  ultimate: {
    id: "ultimate",
    prompt: {
      en: "Do you affirm an ultimate, sacred, divine, spiritual, or transcendent reality?",
      ru: "Признаете ли вы высшую, священную, божественную, духовную или траендентную реальность?",
      az: "Siz əlli, məqdis, ilahi, mənəvi və ya üstdə bir realliyi təsdiqləyirsiniz?",
    },
    help: {
      en: "This question is about metaphysical commitment, not institutional membership.",
      ru: "Этот вопрос о метафизическом обязательстве, а не об институциональной принадлежности.",
      az: "Bu sual metafizik öhdəlik haqqındadır, institutual aidiyyətdən deyil.",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      {
        id: "no_ultimate",
        label: {
          en: "No — I do not affirm such a reality",
          ru: "Нет — я не признаю такую реальность",
          az: "Xeyr — mən belə realliyi təsdiqləmirəm",
        },
        tags: ["non-theism"],
        next: ["nontheistic"],
      },
      {
        id: "unsure_ultimate",
        label: {
          en: "Unsure / suspended judgment / seeking",
          ru: "Не уверен / приостановленное суждение / в поиске",
          az: "Əmin deyiləm / hökm dayandırılıb / axtarırəm",
        },
        tags: ["agnostic", "seeking"],
        next: ["agnostic"],
        isUniversal: "unsure",
      },
      {
        id: "not_framed",
        label: {
          en: "Not framed this way — I start from practice, community, ancestry, or tradition",
          ru: "Не в таких терминах — я начинаю с практики, общины, предков или традиции",
          az: "Bu formada deyil — mən praktika, cəmiyyət, atalar və ya ənənə ilə başlayıram",
        },
        tags: ["practice-first"],
        next: ["practicefirst"],
        isUniversal: "not_my_frame",
      },
      {
        id: "yes_ultimate",
        label: {
          en: "Yes — I affirm an ultimate/sacred/divine reality",
          ru: "Да — я признаю высшую/священную/божественную реальность",
          az: "Bəli — mən əlli/məqdis/ilahi realliyi təsdiqləyirəm",
        },
        tags: ["affirms-ultimate"],
        next: ["reality"],
      },
    ],
  },

  nontheistic: {
    id: "nontheistic",
    prompt: {
      en: "Do you identify with a non-theistic religion, philosophy, or practice?",
      ru: "Относите ли вы себя к нетеистической религии, философии или практике?",
      az: "Siz özünüzü non-teistik bir din, fəlsəfə və ya praktika ilə aid edirsiz?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "buddhist_nontheist", label: { en: "Buddhist (non-theistic)", ru: "Буддист (нетеистический)", az: "Buddist (non-teistik)" }, tags: ["buddhist", "nontheistic"] },
      { id: "jain", label: { en: "Jain", ru: "Джайнист", az: "Cayn" }, tags: ["jain", "nontheistic"] },
      { id: "daoist", label: { en: "Daoist", ru: "Даосист", az: "Daost" }, tags: ["daoist", "nontheistic"] },
      { id: "confucian", label: { en: "Confucian", ru: "Конфуцианец", az: "Konfutsiyçi" }, tags: ["confucian", "nontheistic"] },
      { id: "secular_humanist_nt", label: { en: "Secular / religious humanist", ru: "Светский / религиозный гуманист", az: "Dünyəvi / dini humanist" }, tags: ["humanist", "nontheistic"] },
      { id: "self_described_nt", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_nt"] },
      { id: "practice_first_nt", label: { en: "I prefer to start from practice/community rather than belief", ru: "Лучше начать с практики/общины, а не веры", az: "Mən inam əvəzinə praktika/cəmiyyətlə başlamayı yüksək tuturam" }, tags: ["practice-first"], next: ["practicefirst"] },
    ],
  },

  agnostic: {
    id: "agnostic",
    prompt: {
      en: "How would you characterise your current stance?",
      ru: "Как бы вы охарактеризовали свою текущую позицию?",
      az: "Siz cari vəziyyətinizi necə xarakterizə edərdiniz?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "agnostic_skeptical", label: { en: "Agnostic / sceptical", ru: "Агностик / скептик", az: "Agnostik / skeptik" }, tags: ["agnostic", "skeptical"] },
      { id: "seeking", label: { en: "Actively seeking / exploring", ru: "Активно ищу / изучаю", az: "Faizlə axtarırəm / araşırəm" }, tags: ["seeking"] },
      { id: "suspended", label: { en: "Suspended judgment", ru: "Приостановленное суждение", az: "Dayandırılmış hökm" }, tags: ["suspended-judgment"] },
      { id: "varies_context", label: { en: "Varies by context / moment", ru: "Зависит от контекста / момента", az: "Kontekstə / anına görə dəyişir" }, tags: ["contextual"] },
      { id: "self_described_agnostic", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_agnostic"] },
    ],
  },

  practicefirst: {
    id: "practicefirst",
    prompt: {
      en: "What is your primary entry point — practice, community, ancestry, or tradition?",
      ru: "Что является вашей главной точкой входа — практика, община, происхождение или традиция?",
      az: "Sizin əsas giriş nöqtəniz nədir — praktika, cəmiyyət, əsəl və ya ənənə?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "practice_primary", label: { en: "Practice (meditation, ritual, prayer, service)", ru: "Практика (медитация, ритуал, молитва, служение)", az: "Praktika (meditasiya, ritual, dua, xidmət)" }, tags: ["practice-primary"] },
      { id: "community_primary", label: { en: "Community / sangha / congregation / tribe", ru: "Община / сангха / приход / племя", az: "Cəmiyyət / sangha / cəmaət / qabilə" }, tags: ["community-primary"] },
      { id: "ancestry_primary", label: { en: "Ancestry / lineage / land / heritage", ru: "Происхождение / родословная / земля / наследие", az: "Əsəl / soy / torpaq / irsi" }, tags: ["ancestry-primary"] },
      { id: "tradition_primary", label: { en: "Tradition / school / path (even if mixed)", ru: "Традиция / школа / путь (даже если смешанная)", az: "Ənənə / məktəb / yol (çoxlu olsa da)" }, tags: ["tradition-primary"] },
      { id: "self_described_practice", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_practice"] },
    ],
  },

  // ============ REALITY STRUCTURE ============
  reality: {
    id: "reality",
    prompt: {
      en: "How do you understand ultimate or sacred reality?",
      ru: "Как вы понимаете высшую или священную реальность?",
      az: "Siz üstdə və ya məqdis realliyi necə anlaya bilərsiniz?",
    },
    help: {
      en: "Select all that fit. You can also say the question does not fit your outlook.",
      ru: "Выберите все подходящее. Можно также сказать, что вопрос не подходит вашему взгляду.",
      az: "Uyğun gələnlərə seçin. Sualın sizin näzarınızə uyğun olmadığını da qeyd edə bilərsiniz.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "none", label: { en: "I do not affirm such a reality", ru: "Я не утверждаю существование такой реальности", az: "Mən belə realliyin mövcudluğunu iddia etmirəm" }, tags: ["non-theism"] },
      { id: "one", label: { en: "One ultimate reality", ru: "Одна высшая реальность", az: "Bir üstdə reallik" }, tags: ["monism", "monotheism", "one"] },
      { id: "many", label: { en: "Many divine beings, spirits, ancestors, or sacred powers", ru: "Много божественных существ, духов, предков или священных сил", az: "Çoxlu ilahi varlıqlar, ruhlar, atalar və ya məqdis qüvvələr" }, tags: ["plurality", "many"] },
      { id: "one_many", label: { en: "One reality expressed through many beings/forms", ru: "Одна реальность, выражающаяся через много существ/форм", az: "Bir reallik, çoxlu varlıqlar/formalar vasitəsilə ifadə edilən" }, tags: ["unity-plurality", "henotheism", "monolatry"] },
      { id: "nondual", label: { en: "Non-dual or beyond meaningful counting", ru: "Недуалистическая или за пределами осмысленного счёта", az: "Non-dual və ya mənalı saymaqın ötesində" }, tags: ["non-dual", "advaita"] },
      { id: "cosmic", label: { en: "Identical with, or wholly immanent within, the cosmos/nature", ru: "Тождественна или полностью имманентна космосу/природе", az: "Kosmos/təbiat ilə eynidir və ya tamamilə immanentdir" }, tags: ["immanence", "pantheism", "panentheism"] },
      { id: "unknown_count", label: { en: "Unknown or suspended judgment", ru: "Неизвестно или приостановленное суждение", az: "Naməlum və ya dayandırılmış hökm" }, tags: ["agnostic"], isUniversal: "unsure" },
      { id: "not_frame_reality", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən öz näzarımı belə formullaşdırmıram" }, tags: ["non-categorised"], isUniversal: "not_my_frame" },
    ],
  },

  // ============ AGENCY ============
  agency: {
    id: "agency",
    prompt: {
      en: "Is ultimate reality personal, impersonal, both, or beyond those categories?",
      ru: "Является ли высшая реальность личной, безличной, и тем, и другим, или выходит за эти категории?",
      az: "Üstdə reallik şəxsidirmi, şəxsiyyətsizmi, her ikisimi, yoxsa bu kateqoriyaların ötesindəmidir?",
    },
    help: {
      en: "\"Personal\" = has will, intention, relationality. \"Impersonal\" = law-like, principle, ground. \"Beyond\" = apophatic, transpersonal.",
      ru: "\"Личная\" = имеет волю, намерение, реляционность. \"Безличная\" = законоподобная, принцип, основание. \"За пределами\" = апофатическая, трансперсональная.",
      az: "\"Şəxsi\" = iradəsi, niyyəti, əlaqəliyi var. \"Şəxsiyyətsiz\" = qanun kimi, prinsip, əsas. \"Ötesində\" = apofatik, transpersonal.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "personal", label: { en: "Personal or relational ultimate reality", ru: "Личная или реляционная высшая реальность", az: "Şəxsi və ya əlaqəli üstdə reallik" }, tags: ["personalism", "relational"] },
      { id: "impersonal", label: { en: "Impersonal ultimate reality (law, principle, ground)", ru: "Безличная высшая реальность (закон, принцип, основание)", az: "Şəxsiyyətsiz üstdə reallik (qanun, prinsip, əsas)" }, tags: ["impersonalism"] },
      { id: "both_agency", label: { en: "Personal and impersonal / transpersonal", ru: "Личная и безличная / трансперсональная", az: "Şəxsi və şəxsiyyətsiz / transpersonal" }, tags: ["transpersonal", "both"] },
      { id: "beyond_agency", label: { en: "Beyond personal-versus-impersonal language", ru: "За пределами языка «личное против безличного»", az: "\"Şəxsi qarşı şəxsiyyətsiz\" dili ötesində" }, tags: ["apophatic", "beyond-categories"] },
      { id: "unknown_agency", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Naməlum / dayandırılmış hökm" }, tags: ["agnostic"], isUniversal: "unsure" },
      { id: "not_frame_agency", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən öz näzarımı belə formullaşdırmıram" }, tags: ["non-categorised"], isUniversal: "not_my_frame" },
    ],
  },

  // ============ WORLD RELATION ============
  relation: {
    id: "relation",
    prompt: {
      en: "How, if at all, does ultimate reality relate to people and the world?",
      ru: "Как, если вообще, высшая реальность относится к людям и миру?",
      az: "Üstdə reallik necə, əgər bağlıdırsa, insanlarla və dünyayla əlaqədardır?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "creator", label: { en: "Creates or originates the world", ru: "Создаёт или порождает мир", az: "Dünyanı yaradır və ya mənbə olur" }, tags: ["creator", "origination"] },
      { id: "sustainer", label: { en: "Sustains / orders the world", ru: "Поддерживает / упорядочивает мир", az: "Dünyanı dəstəkləyir / nizama salır" }, tags: ["sustainer", "providence"] },
      { id: "participant", label: { en: "Acts, communicates, or responds in the world", ru: "Действует, общается или отвечает в мире", az: "Dünyada hərəkət edir, əlaqə qurur və ya cavab verir" }, tags: ["interventionist", "revelation", "providence"] },
      { id: "nonintervention", label: { en: "Does not ordinarily intervene (deism, some naturalisms)", ru: "Обычно не вмешивается (деизм, некоторые натурализмы)", az: "Adi hallarda müdaxil olmur (deizm, bəzi naturalizmlər)" }, tags: ["deism", "nonintervention"] },
      { id: "karmic", label: { en: "Relates through moral, karmic, ritual, or cosmic order", ru: "Отношается через моральный, кармический, ритуальный или космический порядок", az: "Əhlaki, karmik, ritual və ya kosmik nizama vasitəsilə əlaqələnir" }, tags: ["karmic", "ritual-order", "cosmic-order"] },
      { id: "identity", label: { en: "Is not separate from world / self / nature", ru: "Не отделена от мира / себя / природы", az: "Dünya / öz / təbiətdən ayrı deyil" }, tags: ["nondual", "identity", "immanence"] },
      { id: "mixed_relation", label: { en: "Several of these / not settled", ru: "Несколько из перечисленных / не определено", az: "Bunların bir neçəsi / müəyyən edilməyib" }, tags: ["mixed", "unsettled"] },
      { id: "unknown_relation", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Naməlum / dayandırılmış hökm" }, tags: ["agnostic"], isUniversal: "unsure" },
      { id: "not_frame_relation", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən öz näzarımı belə formullaşdırmıram" }, tags: ["non-categorised"], isUniversal: "not_my_frame" },
    ],
  },

  // ============ EPISTEMIC SOURCES ============
  knowing: {
    id: "knowing",
    prompt: {
      en: "How is religious or spiritual truth best known?",
      ru: "Как лучше всего познается религиозная или духовная правда?",
      az: "Dini və ya mənəvi haqq necə yaxşı anlaşıla bilər?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "scripture", label: { en: "Scripture, prophets, or historical revelation", ru: "Писание, пророки или историческое откровение", az: "Müqəddəs kitab, peyğəmbərlər və ya tarixi vəhiy" }, tags: ["scripture", "revelation", "prophetic"] },
      { id: "reason", label: { en: "Reason, philosophy, or natural theology", ru: "Разум, философия или естественное богословие", az: "Ağıl, fəlsəfə və ya təbiizi ilahiyyət" }, tags: ["reason", "philosophy", "natural-theology"] },
      { id: "experience", label: { en: "Mystical, contemplative, or direct experience", ru: "Мистический, контемплативный или прямой опыт", az: "Mistik, konteмпляtiv və ya birbaşa təcrübə" }, tags: ["experience", "mystical", "contemplative"] },
      { id: "ritual", label: { en: "Ritual, practice, divination, or embodied tradition", ru: "Ритуал, практика, гадание или телесная традиция", az: "Ritual, praktika, fal və ya cismani ənənə" }, tags: ["ritual", "practice", "embodied"] },
      { id: "ancestry", label: { en: "Ancestors, elders, land, oral tradition, or community", ru: "Предки, старшие, земля, устная традиция или община", az: "Atalar, yaşlılar, torpaq, sözlü ənənə və ya cəmiyyət" }, tags: ["ancestry", "oral-tradition", "elders"] },
      { id: "plural_sources", label: { en: "Several sources / pluralistic", ru: "Несколько источников / плюралистично", az: "Bir neçə mənbə / plyuralistik" }, tags: ["pluralistic", "multiple-sources"] },
      { id: "no_epistemic", label: { en: "No claim to know / not central to my orientation", ru: "Не претендую на знание / не центрально для моего взгляда", az: "Bilmək iddiası yoxdur / mənim näzarımın mərkəzi deyil" }, tags: ["agnostic", "non-epistemic"] },
      { id: "unknown_knowing", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Naməlum / dayandırılmış hökm" }, tags: ["agnostic"], isUniversal: "unsure" },
      { id: "not_frame_knowing", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən öz näzarımı belə formullaşdırmıram" }, tags: ["non-categorised"], isUniversal: "not_my_frame" },
    ],
  },

  // ============ TRADITION / BELONGING (MULTI-SELECT) ============
  belonging: {
    id: "belonging",
    prompt: {
      en: "Which traditions, communities, practices, and cultural inheritances matter to you? Select all that apply.",
      ru: "Какие традиции, общины, практики и культурное наследие важны для вас? Выберите все подходящее.",
      az: "Hansı ənənələr, cəmiyyətlər, praktikalar və mədəni irsi sizin üçün əhəmiyyətli? Uğurlu gələn hamısını seçin.",
    },
    help: {
      en: "Belonging and belief do not always match. Affiliation may be multiple, cultural-only, or ancestral without doctrinal assent.",
      ru: "Принадлежность и вера не всегда совпадают. Аффилиация может быть множественной, только культурной или родовой без догматического согласия.",
      az: "Aidiyyət və inam daima uyğun gəlmür. Aidiyyət çoxlu, yalnız mədəni və ya əqli razılıqsız əsəlli ola bilər.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "abrahamic", label: { en: "Jewish; Christian; Muslim; Baháʼí; Samaritan; Druze; Mandaean; Yazidi; Rastafari; other Abrahamic/West Asian", ru: "Еврейская; Христианская; Мусульманская; Бахаи; Самаритянская; Дерзская; Мандейская; Езидская; Растафари; другое Авраамическое/Западноазиатское", az: "Yəhudi; Xristian; Müslüman; Baháʼi; Samaritan; Druze; Mandey; Yezidi; Rastafari; digər İbrahimi/Qərbi Asiya" }, tags: ["abrahamic"], next: ["abrahamic_detail"] },
      { id: "southasian", label: { en: "Hindu traditions; Sikh; Jain; Buddhist; other South Asian/Himalayan traditions", ru: "Индуистские традиции; Сикх; Джайн; Буддист; другие Южноазиатские/Гималайские традиции", az: "Hindu ənənələri; Sikh; Jain; Buddhist; digər Cənubi Asiya/Himalaya ənənələri" }, tags: ["south-asian"], next: ["southasian_detail"] },
      { id: "eastasian", label: { en: "Daoist; Confucian; Chinese folk/religious traditions; Shinto; Korean traditions; Vietnamese traditions; Japanese new religions", ru: "Даосизм; Конфуцианство; Китайские народные/религиозные традиции; Синто; Корейские традиции; Вьетнамские традиции; Японские новые религии", az: "Daost; Konfutsiyçilik; Çin xalq/dini ənənələri; Şinto; Koreya ənənələri; Vietnam ənənələri; Yaponiya yeni dini" }, tags: ["east-asian"], next: ["eastasian_detail"] },
      { id: "indigenous", label: { en: "Indigenous, land-based, ancestral, African traditional, African diasporic, Pacific, American, or circumpolar traditions — self-described region/people first", ru: "Коренные, земельные, родовые, Африканские традиционные, Африканские диаспорные, Тихоокеанские, Американские или полярные традиции — самописание региона/народа превыше всего", az: "Yerli, torpaq-asılı, əsəlli, Afrika ənənəvi, Afrika diasporası, Pasifik, Amerikan və ya qütb traditions — region/xalq öz təsviri birinci" }, tags: ["indigenous", "land-based", "ancestral"], next: ["indigenous_detail"] },
      { id: "pagan", label: { en: "Contemporary Pagan, Heathen, Druid, Wiccan, reconstructionist, or related", ru: "Современное язычество, Хейтн, Друидизм, Уикка, реконструкционизм или смежное", az: "Müasir Yaqutçuluq, Heathen, Druid, Wiccan, rekonstrüksionist və ya əlaqəli" }, tags: ["pagan", "heathen", "druid", "wiccan", "reconstructionist"], next: ["pagan_detail"] },
      { id: "esoteric", label: { en: "Spiritualist, Theosophical, occult/esoteric, New Thought, New Age, or related", ru: "Спиритуализм, Теософия, оккультное/эзотерическое, Нью Сот, Новый век или смежное", az: "Spiritualist, Teosofiya, okkult/ezoterik, Yeni Fikir, Yeni Dövr və ya əlaqəli" }, tags: ["esoteric", "theosophical", "occult", "new-thought", "new-age"], next: ["esoteric_detail"] },
      { id: "newreligion", label: { en: "New religious movement or independent spiritual path", ru: "Новое религиозное движение или независимый духовный путь", az: "Yeni dini hərəkat və ya müstəqil mənəvi yol" }, tags: ["new-religious-movement", "independent-path"], next: ["newreligion_detail"] },
      { id: "unaffiliated", label: { en: "Unaffiliated, cultural affiliation only, mixed affiliation, or no label", ru: "Неаффилированный, только культурная принадлежность, смешанная принадлежность, или без ярлыка", az: "Aidiyyətsiz, yalnız mədəni aidiyyət, qarışıq aidiyyət və ya etiketsiz" }, tags: ["unaffiliated", "cultural-only", "mixed", "no-label"] },
      { id: "self_described_belonging", label: { en: "Other self-described (free text)", ru: "Другое (свободный текст)", az: "Digər (azad mətn)" }, tags: ["self-described"], next: ["free_text_belonging"] },
    ],
  },

  // ============ DETAIL NODES FOR TRADITION SUB-BRANCHES ============
  abrahamic_detail: {
    id: "abrahamic_detail",
    prompt: {
      en: "Which Abrahamic tradition(s) do you identify with? Select all that apply.",
      ru: "С какой авраамической традицией(ями) вы себя идентифицируете? Выберите все подходящее.",
      az: "Hansı İbrahimi ənənəsi ilə özünüzü aid edirsiz? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "jewish", label: { en: "Jewish", ru: "Еврейская", az: "Yəhudi" }, tags: ["jewish"] },
      { id: "christian", label: { en: "Christian", ru: "Христианская", az: "Xristian" }, tags: ["christian"] },
      { id: "muslim", label: { en: "Muslim", ru: "Мусульманская", az: "Müslüman" }, tags: ["muslim"] },
      { id: "bahai", label: { en: "Baháʼí", ru: "Бахаи", az: "Bahai" }, tags: ["bahai"] },
      { id: "samaritan", label: { en: "Samaritan", ru: "Самаритянская", az: "Samaritan" }, tags: ["samaritan"] },
      { id: "druze", label: { en: "Druze", ru: "Дерзская", az: "Druze" }, tags: ["druze"] },
      { id: "mandaean", label: { en: "Mandaean", ru: "Мандейская", az: "Mandey" }, tags: ["mandaean"] },
      { id: "yazidi", label: { en: "Yazidi", ru: "Езидская", az: "Yezidi" }, tags: ["yazidi"] },
      { id: "rastafari", label: { en: "Rastafari", ru: "Растафари", az: "Rastafari" }, tags: ["rastafari"] },
      { id: "other_abrahamic", label: { en: "Other Abrahamic / West Asian (self-described)", ru: "Другое Авраамическое / Западноазиатское (самоописание)", az: "Digər İbrahimi / Qərbi Asiya (öz təsviri)" }, tags: ["other-abrahamic"], next: ["free_text_abrahamic"] },
    ],
  },

  southasian_detail: {
    id: "southasian_detail",
    prompt: {
      en: "Which South Asian tradition(s)? Select all that apply.",
      ru: "Какая(ие) Южноазиатская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Cənubi Asiya ənənəsi? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "hindu", label: { en: "Hindu traditions", ru: "Индуистские традиции", az: "Hindu ənənələri" }, tags: ["hindu"], next: ["hindu_detail"] },
      { id: "sikh", label: { en: "Sikh", ru: "Сихизм", az: "Sikh" }, tags: ["sikh"] },
      { id: "jain", label: { en: "Jain", ru: "Джайнизм", az: "Jain" }, tags: ["jain"] },
      { id: "buddhist_sa", label: { en: "Buddhist", ru: "Буддизм", az: "Buddizm" }, tags: ["buddhist"] },
      { id: "other_southasian", label: { en: "Other South Asian / Himalayan (self-described)", ru: "Другое Южноазиатское / Гималайское (самоописание)", az: "Digər Cənubi Asiya / Himalaya (öz təsviri)" }, tags: ["other-south-asian"], next: ["free_text_southasian"] },
    ],
  },

  eastasian_detail: {
    id: "eastasian_detail",
    prompt: {
      en: "Which East Asian tradition(s)? Select all that apply.",
      ru: "Какая(ие) Восточноазиатская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Şərqi Asiya ənənəsi? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "daoist", label: { en: "Daoist", ru: "Даосизм", az: "Daost" }, tags: ["daoist"] },
      { id: "confucian", label: { en: "Confucian", ru: "Конфуцианство", az: "Konfutsiyçilik" }, tags: ["confucian"] },
      { id: "chinese_folk", label: { en: "Chinese folk / religious traditions", ru: "Китайские народные / религиозные традиции", az: "Çin xalq / dini ənənələri" }, tags: ["chinese-folk"] },
      { id: "shinto", label: { en: "Shinto", ru: "Синто", az: "Şinto" }, tags: ["shinto"] },
      { id: "korean", label: { en: "Korean traditions", ru: "Корейские традиции", az: "Koreya ənənələri" }, tags: ["korean"] },
      { id: "vietnamese", label: { en: "Vietnamese traditions", ru: "Вьетнамские традиции", az: "Vietnam ənənələri" }, tags: ["vietnamese"] },
      { id: "japanese_new", label: { en: "Japanese new religions", ru: "Японские новые религии", az: "Yaponiya yeni dini" }, tags: ["japanese-new"] },
      { id: "other_eastasian", label: { en: "Other East Asian (self-described)", ru: "Другое Восточноазиатское (самоописание)", az: "Digər Şərqi Asiya (öz təsviri)" }, tags: ["other-east-asian"], next: ["free_text_eastasian"] },
    ],
  },

  indigenous_detail: {
    id: "indigenous_detail",
    prompt: {
      en: "Which Indigenous / ancestral tradition? Self-describe your people/region.",
      ru: "Какая коренная / родовая традиция? Самоопишите свой народ/регион.",
      az: "Hansı Yerli / əsəlli ənənə? Xalqınızı / regionunuzu özünüz təsvir edin.",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "indigenous_self", label: { en: "Enter your tradition / people / region", ru: "Введите свою традицию / народ / регион", az: "Ənənənizi / xalqınızı / regionunuzu yazın" }, tags: ["indigenous-self-described"], next: ["free_text_indigenous"] },
    ],
  },

  pagan_detail: {
    id: "pagan_detail",
    prompt: {
      en: "Which contemporary Pagan path? Select all that apply.",
      ru: "Какой современный языческий путь? Выберите все подходящее.",
      az: "Hansı müasir Yaqutçuluq yolu? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "heathen", label: { en: "Heathen / Germanic/Norse reconstructionist", ru: "Хейтн / Германо/Скандинавский реконструкционизм", az: "Heathen / Alman/İskandinav rekonstrüksionist" }, tags: ["heathen"] },
      { id: "druid", label: { en: "Druid / Celtic reconstructionist", ru: "Друид / Кельтский реконструкционизм", az: "Druid / Kelt rekonstrüksionist" }, tags: ["druid"] },
      { id: "wiccan", label: { en: "Wiccan / Neo-Wiccan", ru: "Уиккан / Нео-уиккан", az: "Wiccan / Neo-Wiccan" }, tags: ["wiccan"] },
      { id: "reconstructionist", label: { en: "Polytheist reconstructionist (Greek, Roman, Egyptian, etc.)", ru: "Политеист-реконструкционист (Греческий, Римский, Египетский и др.)", az: "Politeist rekonstrüksionist (Yunan, Roma, Misir və s.)" }, tags: ["reconstructionist"] },
      { id: "other_pagan", label: { en: "Other Pagan / related (self-described)", ru: "Другое язычество / смежное (самоописание)", az: "Digər Yaqutçuluq / əlaqəli (öz təsviri)" }, tags: ["other-pagan"], next: ["free_text_pagan"] },
    ],
  },

  esoteric_detail: {
    id: "esoteric_detail",
    prompt: {
      en: "Which esoteric / spiritualist tradition? Select all that apply.",
      ru: "Какая эзотерическая / спиритуалистическая традиция? Выберите все подходящее.",
      az: "Hansı ezoterik / spiritualist ənənə? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "spiritualist", label: { en: "Spiritualist", ru: "Спиритуализм", az: "Spiritualist" }, tags: ["spiritualist"] },
      { id: "theosophical", label: { en: "Theosophical", ru: "Теософия", az: "Teosofiya" }, tags: ["theosophical"] },
      { id: "occult", label: { en: "Occult / ceremonial magic / hermetic", ru: "Оккультизм / церемониальная магия / герметизм", az: "Okkultizm / ceremoniya magiyası / hermətik" }, tags: ["occult"] },
      { id: "new_thought", label: { en: "New Thought / Unity / Science of Mind", ru: "Новый Мысли / Юнити / Наука Разума", az: "Yeni Fikir / Unity / Mind Elmi" }, tags: ["new-thought"] },
      { id: "new_age", label: { en: "New Age / holistic spirituality", ru: "Новый Век / целостная духовность", az: "Yeni Dövr / bütövlük mənəviyyəti" }, tags: ["new-age"] },
      { id: "other_esoteric", label: { en: "Other esoteric / related (self-described)", ru: "Другое эзотерическое / смежное (самоописание)", az: "Digər ezoterik / əlaqəli (öz təsviri)" }, tags: ["other-esoteric"], next: ["free_text_esoteric"] },
    ],
  },

  newreligion_detail: {
    id: "newreligion_detail",
    prompt: {
      en: "Which new religious movement or independent path?",
      ru: "Какое новое религиозное движение или независимый путь?",
      az: "Hansı yeni dini hərəkat və ya müstəqil yol?",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "nr_self", label: { en: "Enter name / description", ru: "Введите название / описание", az: "Adı / təsviri yazın" }, tags: ["nr-self-described"], next: ["free_text_nr"] },
    ],
  },

  hindu_detail: {
    id: "hindu_detail",
    prompt: {
      en: "Which Hindu tradition(s)? Select all that apply.",
      ru: "Какая(ие) индуистская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Hindu ənənəsi? Uğurlu gələn hamısını seçin.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "vaishnava", label: { en: "Vaishnava (Vishnu/Krishna)", ru: "Ваишнава (Вишну/Кришна)", az: "Vaişnava (Vişnu/Krişna)" }, tags: ["vaishnava"] },
      { id: "shaiva", label: { en: "Shaiva (Shiva)", ru: "Шаива (Шива)", az: "Şaiva (Şiva)" }, tags: ["shaiva"] },
      { id: "shakta", label: { en: "Shakta (Devi/Goddess)", ru: "Шакта (Деви/Богиня)", az: "Şakta (Devi/Əliyyə)" }, tags: ["shakta"] },
      { id: "smarta", label: { en: "Smarta / Advaita Vedanta", ru: "Смарта / Адвайта Веданта", az: "Smarta / Advayta Vedanta" }, tags: ["smarta", "advaita"] },
      { id: "other_hindu", label: { en: "Other Hindu / new movements (self-described)", ru: "Другое индуистское / новые движения (самоописание)", az: "Digər Hindu / yeni hərəkatlar (öz təsviri)" }, tags: ["other-hindu"], next: ["free_text_hindu"] },
    ],
  },

  // ============ FREE-TEXT NODES ============
  free_text_nonrel: { id: "free_text_nonrel", prompt: { en: "Describe your non-religious orientation", ru: "Опишите вашу нерелигиозную ориентацию", az: "Dini olmayan yanaşmanızı təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_rnatural: { id: "free_text_rnatural", prompt: { en: "Describe your naturalistic sacred orientation", ru: "Опишите ваше натуралистическое священное отношение", az: "Naturalistik məqdis yanaşmanızı təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_nt: { id: "free_text_nt", prompt: { en: "Describe your non-theistic identification", ru: "Опишите вашу нетеистическую идентификацию", az: "Non-teistik aidiyyətinizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_agnostic: { id: "free_text_agnostic", prompt: { en: "Describe your agnostic stance", ru: "Опишите вашу агностическую позицию", az: "Agnostik vəziyyətinizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_practice: { id: "free_text_practice", prompt: { en: "Describe your practice/community entry point", ru: "Опишите вашу точку входа через практику/общину", az: "Praktika/cəmiyyət giriş nöqtənizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_abrahamic: { id: "free_text_abrahamic", prompt: { en: "Describe your Abrahamic identification", ru: "Опишите вашу авраамическую идентификацию", az: "İbrahimi aidiyyətinizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_southasian: { id: "free_text_southasian", prompt: { en: "Describe your South Asian identification", ru: "Опишите вашу южноазиатскую идентификацию", az: "Cənubi Asiya aidiyyətinizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_eastasian: { id: "free_text_eastasian", prompt: { en: "Describe your East Asian identification", ru: "Опишите вашу восточноазиатскую идентификацию", az: "Şərqi Asiya aidiyyətinizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_indigenous: { id: "free_text_indigenous", prompt: { en: "Describe your Indigenous/ancestral tradition", ru: "Опишите вашу коренную/родовую традицию", az: "Yerli/əsəlli ənənənizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_pagan: { id: "free_text_pagan", prompt: { en: "Describe your Pagan path", ru: "Опишите ваш языческий путь", az: "Yaqutçuluq yolunuzu təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_esoteric: { id: "free_text_esoteric", prompt: { en: "Describe your esoteric tradition", ru: "Опишите вашу эзотерическую традицию", az: "Ezoterik ənənənizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_nr: { id: "free_text_nr", prompt: { en: "Describe your new religious movement / independent path", ru: "Опишите ваше новое религиозное движение / независимый путь", az: "Yeni dini hərəkatınızı / müstəqil yolunuzu təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_hindu: { id: "free_text_hindu", prompt: { en: "Describe your Hindu tradition", ru: "Опишите вашу индуистскую традицию", az: "Hindu ənənənizi təsvir edin" }, responseMode: "free-text", choices: [] },
  free_text_belonging: { id: "free_text_belonging", prompt: { en: "Describe your tradition / cultural inheritance", ru: "Опишите вашу традицию / культурное наследие", az: "Ənənənizi / mədəni irsinizi təsvir edin" }, responseMode: "free-text", choices: [] },
};

// ============ TERMINAL PROFILES (multi-axis, not single-label) ============
// These are example composite profiles generated from tag combinations
export const TERMINAL_PROFILES: Record<string, { title: LocalizedText; blueprint: LocalizedText; tags: string[] }> = {
  // Generated dynamically from profile tags — see wizardStore.ts for composition logic
  // Kept here for reference structure only
  profile_template: {
    title: { en: "Your Orientation Profile", ru: "Ваш профиль ориентации", az: "Yanaşma Profiliniz" },
    blueprint: { en: "Your answers currently describe a {confidence} {orientation} orientation. You {ultimateReality}, draw primarily on {epistemicSources}, and identify connections with {traditions}. This is a description, not an authoritative label.", ru: "Ваши ответы описывают {confidence} {orientation} ориентацию. Вы {ultimateReality}, опираетесь на {epistemicSources} и идентифицируете связи с {traditions}. Это описание, а не авторитетный ярлык.", az: "Cavablarınız {confidence} {orientation} yanaşmasını təsvir edir. Siz {ultimateReality}, əsasən {epistemicSources} üzərinə dayanırsınız və {traditions} ilə əlaqələri müəyyən edirsiniz. Bu təsvirdir,авторитетli etiket deyil." },
    tags: [],
  },
};

// Export legacy terminal compatibility map (for old links/analytics)
export const LEGACY_TERMINAL_MAP: Record<string, string[]> = {
  // Maps old terminal IDs to new profile tag combinations
  "terminal_secular_humanist": ["secular", "humanist"],
  "terminal_deist": ["deism"],
  "terminal_durkheimian": ["constructivist", "durkheimian"],
  "terminal_jungian": ["constructivist", "jungian"],
  "terminal_olympian": ["polytheist", "personalism"],
  // ... add more as needed
};