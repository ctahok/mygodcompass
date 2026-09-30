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
      az: "Sizi ən yaxşı hansı dünyagörüşü təsvir edir?",
    },
    help: {
      en: "You can select more than one. This sets the overall pathway.",
      ru: "Можно выбрать несколько. Это определяет общий путь.",
      az: "Bir neçə variant seçə bilərsiniz. Bu, ümumi istiqaməti müəyyənləşdirir.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      {
        id: "no_frame",
        label: {
          en: "I do not use religious or spiritual categories",
          ru: "Я не использую религиозные или духовные категории",
          az: "Dini və ya mənəvi anlayışlardan istifadə etmirəm",
        },
        tags: ["non-religious-frame"],
        next: ["nonreligious"],
      },
      {
        id: "explore",
        label: {
          en: "I use, or am open to, religious/spiritual/philosophical categories",
          ru: "Я использую или открыт к религиозным/духовным/философским категориям",
          az: "Dini, mənəvi və ya fəlsəfi anlayışlardan istifadə edirəm (və ya onlara açığam)",
        },
        tags: ["open-to-categories"],
        next: ["ultimate"],
      },
      {
        id: "unsure_frame",
        label: {
          en: "Unsure / exploring / varies by context",
          ru: "Не уверен / изучаю / зависит от контекста",
          az: "Əmin deyiləm / axtarışdayam / kontekstə görə dəyişir",
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
      az: "Buna baxmayaraq, hər hansı bir reallığı, dəyəri və ya təcrübəni müqəddəs, transsendent və ya mənəvi cəhətdən əhəmiyyətli hesab edirsinizmi?",
    },
    help: {
      en: "Some non-religious people still hold certain things as sacred (e.g., nature, humanity, truth).",
      ru: "Некоторые нерелигиозные люди всё равно считают что-то священным (природа, человечество, правда).",
      az: "Dindar olmayan bəzi insanlar da müəyyən anlayışları müqəddəs sayırlar (məsələn: təbiət, bəşəriyyət, həqiqət).",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      {
        id: "no_sacred",
        label: {
          en: "No — nothing is sacred or transcendent for me",
          ru: "Нет — ничего не является священным или траендентным для меня",
          az: "Xeyr - mənim üçün müqəddəs və ya transsendent heç nə yoxdur",
        },
        tags: ["secular", "naturalist"],
        next: ["secular_profile"],
      },
      {
        id: "yes_sacred",
        label: {
          en: "Yes or perhaps — I relate to something as sacred/transcendent",
          ru: "Да или, возможно, — я отношусь к чему-то как к священному/траендентному",
          az: "Bəli və ya ola bilsin ki - müəyyən şeylərə müqəddəs/transsendent dəyər kimi yanaşıram",
        },
        tags: ["religious-naturalist", "spiritual-naturalist"],
        next: ["rnatural_profile"],
      },
      {
        id: "unclear_nonreligious",
        label: {
          en: "The question is unclear to me",
          ru: "Вопрос неясен для меня",
          az: "Sual mənim üçün aydın deyil",
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
      az: "Qeyri-dini dünyagörüşünüzü necə təsvir edərdiniz?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "atheist", label: { en: "Atheist", ru: "Атеист", az: "Ateist" }, tags: ["atheist"] },
      { id: "secular_humanist", label: { en: "Secular humanist", ru: "Светский гуманист", az: "Dünyəvi humanist" }, tags: ["secular-humanist"] },
      { id: "naturalist", label: { en: "Naturalist", ru: "Натуралист", az: "Naturalist" }, tags: ["naturalist"] },
      { id: "apatheist", label: { en: "Apatheist (indifferent to the question)", ru: "Апатеист (безразличен к вопросу)", az: "Apateist (bu suala qarşı laqeyd / fərq etməz)" }, tags: ["apatheist"] },
      { id: "anti_theist", label: { en: "Anti-theist", ru: "Антитеист", az: "Antiteist / dinə qarşı tənqidi" }, tags: ["anti-theist"] },
      { id: "self_described_nonrel", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_nonrel"] },
    ],
  },

  rnatural_profile: {
    id: "rnatural_profile",
    prompt: {
      en: "Which term fits your naturalistic sacred orientation?",
      ru: "Какой термин подходит для вашего натуралистического священного отношения?",
      az: "Naturalist müqəddəslik dünyagörüşünüzü hansı termin daha yaxşı ifadə edir?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "religious_naturalist", label: { en: "Religious naturalist", ru: "Религиозный натуралист", az: "Dini naturalist" }, tags: ["religious-naturalist"] },
      { id: "spiritual_naturalist", label: { en: "Spiritual naturalist", ru: "Духовный натуралист", az: "Mənəvi naturalist" }, tags: ["spiritual-naturalist"] },
      { id: "nontheistic_sacred", label: { en: "Non-theistic sacred orientation", ru: "Нетеистическое священное отношение", az: "Qeyri-teist müqəddəslik dünyagörüşü" }, tags: ["nontheistic-sacred"] },
      { id: "self_described_rnatural", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_rnatural"] },
    ],
  },

  nonlabel_profile: {
    id: "nonlabel_profile",
    prompt: {
      en: "You have chosen not to categorise your orientation. Would you like to add a free-text self-description?",
      ru: "Вы выбрали не категоризировать свою ориентацию. Хотите добавить свободное описание?",
      az: "Dünyagörüşünüzü təsnif etməməyi seçdiniz. Öz təsvirinizi sərbəst mətn şəklində əlavə etmək istərdinizmi?",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "skip_nonlabel", label: { en: "Skip — no label needed", ru: "Пропустить — ярлык не нужен", az: "Bu sualı keç - təsnifata ehtiyac yoxdur" }, tags: ["decline-label"] },
    ],
  },

  // ============ CORE METAPHYSICS: ULTIMATE REALITY ============
  ultimate: {
    id: "ultimate",
    prompt: {
      en: "Do you affirm an ultimate, sacred, divine, spiritual, or transcendent reality?",
      ru: "Признаете ли вы высшую, священную, божественную, духовную или траендентную реальность?",
      az: "Mütləq, müqəddəs, ilahi, mənəvi və ya transsendent bir reallığı qəbul edirsinizmi?",
    },
    help: {
      en: "This question is about metaphysical commitment, not institutional membership.",
      ru: "Этот вопрос о метафизическом обязательстве, а не об институциональной принадлежности.",
      az: "Bu sual hər hansı təşkilati və ya dini mənsubiyyət deyil, metafizik baxışınızla bağlıdır.",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      {
        id: "no_ultimate",
        label: {
          en: "No — I do not affirm such a reality",
          ru: "Нет — я не признаю такую реальность",
          az: "Xeyr - belə bir reallığı qəbul etmirəm",
        },
        tags: ["non-theism"],
        next: ["nontheistic"],
      },
      {
        id: "unsure_ultimate",
        label: {
          en: "Unsure / suspended judgment / seeking",
          ru: "Не уверен / приостановленное суждение / в поиске",
          az: "Əmin deyiləm / hökmü dayandırıram / axtarışdayam",
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
          az: "Məsələyə bu cür yanaşmıram - inancdan deyil; əməli təcrübə, icma, əcdadlar və ya ənənədən çıxış edirəm",
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
          az: "Bəli - mütləq/müqəddəs/ilahi reallığı qəbul edirəm",
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
      az: "Özünüzü qeyri-teist bir din, fəlsəfə və ya təlimlə eyniləşdirirsinizmi?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "buddhist_nontheist", label: { en: "Buddhist (non-theistic)", ru: "Буддист (нетеистический)", az: "Buddist (qeyri-teist)" }, tags: ["buddhist", "nontheistic"] },
      { id: "jain", label: { en: "Jain", ru: "Джайнист", az: "Caynist" }, tags: ["jain", "nontheistic"] },
      { id: "daoist", label: { en: "Daoist", ru: "Даосист", az: "Daosist" }, tags: ["daoist", "nontheistic"] },
      { id: "confucian", label: { en: "Confucian", ru: "Конфуцианец", az: "Konfutsiçi" }, tags: ["confucian", "nontheistic"] },
      { id: "secular_humanist_nt", label: { en: "Secular / religious humanist", ru: "Светский / религиозный гуманист", az: "Dünyəvi / dini humanist" }, tags: ["humanist", "nontheistic"] },
      { id: "self_described_nt", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_nt"] },
      { id: "practice_first_nt", label: { en: "I prefer to start from practice/community rather than belief", ru: "Лучше начать с практики/общины, а не веры", az: "İnancdan daha çox əməli təcrübədən və ya icmadan çıxış etməyə üstünlük verirəm" }, tags: ["practice-first"], next: ["practicefirst"] },
    ],
  },

  agnostic: {
    id: "agnostic",
    prompt: {
      en: "How would you characterise your current stance?",
      ru: "Как бы вы охарактеризовали свою текущую позицию?",
      az: "Mövcud mövqeyinizi ən yaxşı nə xarakterizə edir?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "agnostic_skeptical", label: { en: "Agnostic / sceptical", ru: "Агностик / скептик", az: "Agnostik / skeptik" }, tags: ["agnostic", "skeptical"] },
      { id: "seeking", label: { en: "Actively seeking / exploring", ru: "Активно ищу / изучаю", az: "Fəal axtarışdayam / araşdırıram" }, tags: ["seeking"] },
      { id: "suspended", label: { en: "Suspended judgment", ru: "Приостановленное суждение", az: "Hökmün dayandırılması (mühakimə yürütməmək)" }, tags: ["suspended-judgment"] },
      { id: "varies_context", label: { en: "Varies by context / moment", ru: "Зависит от контекста / момента", az: "Kontekstdən və vəziyyətdən asılı olaraq dəyişir" }, tags: ["contextual"] },
      { id: "self_described_agnostic", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_agnostic"] },
    ],
  },

  practicefirst: {
    id: "practicefirst",
    prompt: {
      en: "What is your primary entry point — practice, community, ancestry, or tradition?",
      ru: "Что является вашей главной точкой входа — практика, община, происхождение или традиция?",
      az: "Dünyagörüşünüzdə ən başlıca dayaq nöqtəsi nədir: əməli təcrübə, icma, əcdadlar, yoxsa ənənə?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "practice_primary", label: { en: "Practice (meditation, ritual, prayer, service)", ru: "Практика (медитация, ритуал, молитва, служение)", az: "Əməli təcrübə (meditasiya, ritual, dua, xidmət)" }, tags: ["practice-primary"] },
      { id: "community_primary", label: { en: "Community / sangha / congregation / tribe", ru: "Община / сангха / приход / племя", az: "İcma / sanqha / camaat / qəbilə" }, tags: ["community-primary"] },
      { id: "ancestry_primary", label: { en: "Ancestry / lineage / land / heritage", ru: "Происхождение / родословная / земля / наследие", az: "Soy / nəsil şəcərəsi / torpaq / tarixi irs" }, tags: ["ancestry-primary"] },
      { id: "tradition_primary", label: { en: "Tradition / school / path (even if mixed)", ru: "Традиция / школа / путь (даже если смешанная)", az: "Ənənə / təlim məktəbi / mənəvi yol (hətta qarışıq olsa belə)" }, tags: ["tradition-primary"] },
      { id: "self_described_practice", label: { en: "Other self-described", ru: "Другое (своё описание)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_practice"] },
    ],
  },

  // ============ REALITY STRUCTURE ============
  reality: {
    id: "reality",
    prompt: {
      en: "How do you understand ultimate or sacred reality?",
      ru: "Как вы понимаете высшую или священную реальность?",
      az: "Mütləq və ya müqəddəs reallığı necə başa düşürsünüz?",
    },
    help: {
      en: "Select all that fit. You can also say the question does not fit your outlook.",
      ru: "Выберите все подходящее. Можно также сказать, что вопрос не подходит вашему взгляду.",
      az: "Uyğun gələn bütün variantları seçin. Bu sualın dünyagörüşünüzə uyğun olmadığını da qeyd edə bilərsiniz.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "none", label: { en: "I do not affirm such a reality", ru: "Я не утверждаю существование такой реальности", az: "Belə bir reallığı qəbul etmirəm" }, tags: ["non-theism"], next: ["nontheistic"] },
      { id: "one", label: { en: "One ultimate reality", ru: "Одна высшая реальность", az: "Vahid ali reallıq" }, tags: ["monism", "monotheism", "one"], next: ["agency"] },
      { id: "many", label: { en: "Many divine beings, spirits, ancestors, or sacred powers", ru: "Много божественных существ, духов, предков или священных сил", az: "Çoxsaylı ilahi varlıqlar, ruhlar, əcdadlar və ya müqəddəs qüvvələr" }, tags: ["plurality", "many"], next: ["agency"] },
      { id: "one_many", label: { en: "One reality expressed through many beings/forms", ru: "Одна реальность, выражающаяся через много существ/форм", az: "Çoxsaylı varlıqlar və ya formalar vasitəsilə təcəssüm edən vahid reallıq" }, tags: ["unity-plurality", "henotheism", "monolatry"], next: ["agency"] },
      { id: "nondual", label: { en: "Non-dual or beyond meaningful counting", ru: "Недуалистическая или за пределами осмысленного счёта", az: "Qeyri-dual (vəhdət) və ya hər cür say anlayışının fövqündə" }, tags: ["non-dual", "advaita"], next: ["agency"] },
      { id: "cosmic", label: { en: "Identical with, or wholly immanent within, the cosmos/nature", ru: "Тождественна или полностью имманентна космосу/природе", az: "Kosmos və ya təbiətlə eyni olan, yaxud tamamilə onda mövcud olan (immanent)" }, tags: ["immanence", "pantheism", "panentheism"], next: ["agency"] },
      { id: "unknown_count", label: { en: "Unknown or suspended judgment", ru: "Неизвестно или приостановленное суждение", az: "Bilinmir / hökm dayandırılıb" }, tags: ["agnostic"], isUniversal: "unsure", next: ["agency"] },
      { id: "not_frame_reality", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən dünyagörüşümü bu şəkildə ifadə etmirəm" }, tags: ["non-categorised"], isUniversal: "not_my_frame", next: ["practicefirst"] },
    ],
  },

  // ============ AGENCY ============
    agency: {
      id: "agency",
      prompt: {
        en: "Is ultimate reality personal, impersonal, both, or beyond those categories?",
        ru: "Является ли высшая реальность личной, безличной, и тем, и другим, или выходит за эти категории?",
        az: "Ali reallıq şəxsi mahiyyətə (zati şüura) malikdirmi, şəxsiyyətsizdirmi, hər ikisidirmi, yoxsa bu anlayışların fövqündədir?",
      },
      help: {
        en: "\"Personal\" = has will, intention, relationality. \"Impersonal\" = law-like, principle, ground. \"Beyond\" = apophatic, transpersonal.",
        ru: "\"Личная\" = имеет волю, намерение, реляционность. \"Безличная\" = законоподобная, принцип, основание. \"За пределами\" = апофатическая, трансперсональная.",
        az: "\"Şəxsi\" = iradəsi, niyyəti və əlaqə qurma qabiliyyəti var. \"Şəxsiyyətsiz\" = qanunabənzər prinsip, təməl əsas. \"Fövqündə\" = apofatik, transpersonal.",
      },
      responseMode: "multiple",
      universalChoices: true,
      choices: [
        { id: "personal", label: { en: "Personal or relational ultimate reality", ru: "Личная или реляционная высшая реальность", az: "Şəxsi (və ya münasibət qurula bilən) ali reallıq" }, tags: ["personalism", "relational"], next: ["relation"] },
        { id: "impersonal", label: { en: "Impersonal ultimate reality (law, principle, ground)", ru: "Безличная высшая реальность (закон, принцип, основание)", az: "Şəxsiyyətsiz ali reallıq (qanun, prinsip, təməl varlıq)" }, tags: ["impersonalism"], next: ["relation"] },
        { id: "both_agency", label: { en: "Personal and impersonal / transpersonal", ru: "Личная и безличная / трансперсональная", az: "Həm şəxsi, həm də şəxsiyyətsiz / transpersonal" }, tags: ["transpersonal", "both"], next: ["relation"] },
        { id: "beyond_agency", label: { en: "Beyond personal-versus-impersonal language", ru: "За пределами языка «личное против безличного»", az: "\"Şəxsi və ya şəxsiyyətsiz\" kateqoriyalarının tamamilə fövqündə" }, tags: ["apophatic", "beyond-categories"], next: ["relation"] },
        { id: "unknown_agency", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Bilinmir / hökm dayandırılıb" }, tags: ["agnostic"], isUniversal: "unsure", next: ["relation"] },
        { id: "not_frame_agency", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən dünyagörüşümü bu şəkildə ifadə etmirəm" }, tags: ["non-categorised"], isUniversal: "not_my_frame", next: ["practicefirst"] },
      ],
    },

  // ============ WORLD RELATION ============
  relation: {
    id: "relation",
    prompt: {
      en: "How, if at all, does ultimate reality relate to people and the world?",
      ru: "Как, если вообще, высшая реальность относится к людям и миру?",
      az: "Ali reallıq insanlarla və dünya ilə necə əlaqədədir (əgər ümumiyyətlə əlaqədədirsə)?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "creator", label: { en: "Creates or originates the world", ru: "Создаёт или порождает мир", az: "Dünyanı yaradır və ya onun ilk qaynağıdır" }, tags: ["creator", "origination"], next: ["knowing"] },
      { id: "sustainer", label: { en: "Sustains / orders the world", ru: "Поддерживает / упорядочивает мир", az: "Dünyanı nizamlayır, qoruyur və davamlılığını təmin edir" }, tags: ["sustainer", "providence"], next: ["knowing"] },
      { id: "participant", label: { en: "Acts, communicates, or responds in the world", ru: "Действует, общается или отвечает в мире", az: "Dünyada fəaliyyət göstərir, ünsiyyət qurur və ya cavab verir" }, tags: ["interventionist", "revelation", "providence"], next: ["knowing"] },
      { id: "nonintervention", label: { en: "Does not ordinarily intervene (deism, some naturalisms)", ru: "Обычно не вмешивается (деизм, некоторые натурализмы)", az: "Adətən müdaxilə etmir (deizm, bəzi naturalizm formaları)" }, tags: ["deism", "nonintervention"], next: ["knowing"] },
      { id: "karmic", label: { en: "Relates through moral, karmic, ritual, or cosmic order", ru: "Отношается через моральный, кармический, ритуальный или космический порядок", az: "Əxlaqi, karmik, ritual və ya kosmik nizam vasitəsilə əlaqələnir" }, tags: ["karmic", "ritual-order", "cosmic-order"], next: ["knowing"] },
      { id: "identity", label: { en: "Is not separate from world / self / nature", ru: "Не отделена от мира / себя / природы", az: "Dünyadan, mənlikdən və ya təbiətdən ayrı deyil (vəhdət)" }, tags: ["nondual", "identity", "immanence"], next: ["knowing"] },
      { id: "mixed_relation", label: { en: "Several of these / not settled", ru: "Несколько из перечисленных / не определено", az: "Bunlardan bir neçəsi / qəti qərar verməmişəm" }, tags: ["mixed", "unsettled"], next: ["knowing"] },
      { id: "unknown_relation", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Bilinmir / hökm dayandırılıb" }, tags: ["agnostic"], isUniversal: "unsure", next: ["knowing"] },
      { id: "not_frame_relation", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən dünyagörüşümü bu şəkildə ifadə etmirəm" }, tags: ["non-categorised"], isUniversal: "not_my_frame", next: ["practicefirst"] },
    ],
  },

  // ============ EPISTEMIC SOURCES ============
  knowing: {
    id: "knowing",
    prompt: {
      en: "How is religious or spiritual truth best known?",
      ru: "Как лучше всего познается религиозная или духовная правда?",
      az: "Dini və ya mənəvi həqiqət ən yaxşı necə dərk olunur?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "scripture", label: { en: "Scripture, prophets, or historical revelation", ru: "Писание, пророки или историческое откровение", az: "Müqəddəs mətnlər, peyğəmbərlər və ya tarixi vəhy" }, tags: ["scripture", "revelation", "prophetic"], next: ["candidate_traditions"] },
      { id: "reason", label: { en: "Reason, philosophy, or natural theology", ru: "Разум, философия или естественное богословие", az: "Ağıl, fəlsəfə və ya təbii ilahiyyat" }, tags: ["reason", "philosophy", "natural-theology"], next: ["candidate_traditions"] },
      { id: "experience", label: { en: "Mystical, contemplative, or direct experience", ru: "Мистический, контемплативный или прямой опыт", az: "Mistik, kontemplativ (daxili seyr) və ya birbaşa təcrübə" }, tags: ["experience", "mystical", "contemplative"], next: ["candidate_traditions"] },
      { id: "ritual", label: { en: "Ritual, practice, divination, or embodied tradition", ru: "Ритуал, практика, гадание или телесная традиция", az: "Ritual, əməli təcrübə, öncəgörmə və ya cismaniləşmiş ənənə" }, tags: ["ritual", "practice", "embodied"], next: ["candidate_traditions"] },
      { id: "ancestry", label: { en: "Ancestors, elders, land, oral tradition, or community", ru: "Предки, старшие, земля, устная традиция или община", az: "Əcdadlar, el ağsaqqalları, torpaq, şifahi ənənə və ya icma" }, tags: ["ancestry", "oral-tradition", "elders"], next: ["candidate_traditions"] },
      { id: "plural_sources", label: { en: "Several sources / pluralistic", ru: "Несколько источников / плюралистично", az: "Bir neçə mənbə / plüralist yanaşma" }, tags: ["pluralistic", "multiple-sources"], next: ["candidate_traditions"] },
      { id: "no_epistemic", label: { en: "No claim to know / not central to my orientation", ru: "Не претендую на знание / не центрально для моего взгляда", az: "Bilmək iddiasında deyiləm / dünyagörüşüm üçün əsas deyil" }, tags: ["agnostic", "non-epistemic"], next: ["candidate_traditions"] },
      { id: "unknown_knowing", label: { en: "Unknown / suspended judgment", ru: "Неизвестно / приостановленное суждение", az: "Bilinmir / hökm dayandırılıb" }, tags: ["agnostic"], isUniversal: "unsure", next: ["candidate_traditions"] },
      { id: "not_frame_knowing", label: { en: "This is not how I frame my outlook", ru: "Так я свой взгляд не формулирую", az: "Mən dünyagörüşümü bu şəkildə ifadə etmirəm" }, tags: ["non-categorised"], isUniversal: "not_my_frame", next: ["practicefirst"] },
    ],
  },

  // ============ CANDIDATE TRADITIONS (weighted matching) ============
  candidate_traditions: {
    id: "candidate_traditions",
    prompt: {
      en: "Based on your answers so far, these pathways appear most compatible. Which, if any, would you like to explore?",
      ru: "На основе ваших ответов эти пути выглядят наиболее совместимыми. Какой, если есть, вы хотели бы исследовать?",
      az: "İndiyə qədər verdiyiniz cavablara əsasən, bu istiqamətlər sizə ən uyğun görünür. Hansını (əgər istəyirsinizsə) araşdırmaq istərdiniz?",
    },
    help: {
      en: "Your answers do not determine your religion — they identify paths you may wish to explore next.",
      ru: "Ваши ответы не определяют вашу религию — они выявляют пути, которые вы, возможно, захотите исследовать дальше.",
      az: "Cavablarınız dininizi müəyyən etmir; sadəcə növbəti addımda araşdırmaq istəyə biləcəyiniz yolları göstərir.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "explore_christian", label: { en: "Explore Christianity", ru: "Исследовать христианство", az: "Xristianlığı araşdır" }, tags: ["exploring-christian"], next: ["christian_detail"] },
      { id: "explore_islam", label: { en: "Explore Islam", ru: "Исследовать ислам", az: "İslamı araşdır" }, tags: ["exploring-islam"], next: ["islam_detail"] },
      { id: "explore_jewish", label: { en: "Explore Judaism", ru: "Исследовать иудаизм", az: "Yəhudiliyi araşdır" }, tags: ["exploring-jewish"], next: ["jewish_detail"] },
      { id: "explore_sikh", label: { en: "Explore Sikhism", ru: "Исследовать сикхизм", az: "Siqhizmi araşdır" }, tags: ["exploring-sikh"], next: ["sikh_detail"] },
      { id: "explore_bahai", label: { en: "Explore the Baháʼí Faith", ru: "Исследовать Веру Бахаи", az: "Bəhai inancını araşdır" }, tags: ["exploring-bahai"], next: ["bahai_detail"] },
      { id: "explore_hindu", label: { en: "Explore Hindu traditions", ru: "Исследовать индуистские традиции", az: "Hindu ənənələrini araşdır" }, tags: ["exploring-hindu"], next: ["hindu_detail"] },
      { id: "explore_buddhist", label: { en: "Explore Buddhism", ru: "Исследовать буддизм", az: "Buddizmi araşdır" }, tags: ["exploring-buddhist"], next: ["buddhist_detail"] },
      { id: "explore_deism", label: { en: "Explore Deism", ru: "Исследовать деизм", az: "Deizmi araşdır" }, tags: ["exploring-deism"], next: ["deism_detail"] },
      { id: "explore_pantheism", label: { en: "Explore Pantheism / Panentheism", ru: "Исследовать пантеизм / панентеизм", az: "Panteizm / Panenteizmi araşdır" }, tags: ["exploring-pantheism"], next: ["pantheism_detail"] },
      { id: "explore_polytheism", label: { en: "Explore Polytheist / Pagan paths", ru: "Исследовать политеистические / языческие пути", az: "Politeist / Paqan yollarını araşdır" }, tags: ["exploring-polytheism"], next: ["pagan_detail"] },
      { id: "explore_secular", label: { en: "Explore Secular / Non-religious outlooks", ru: "Исследовать светские / нерелигиозные взгляды", az: "Dünyəvi / qeyri-dini dünyagörüşləri araşdır" }, tags: ["exploring-secular"], next: ["secular_profile"] },
      { id: "explore_none", label: { en: "None of these fit — keep answering general questions", ru: "Ничего из этого не подходит — продолжу отвечать на общие вопросы", az: "Bunların heç biri uyğun gəlmir - ümumi suallara cavab verməyə davam et" }, tags: ["none-fit"], next: ["belonging"] },
      { id: "already_identify", label: { en: "I already identify with a tradition", ru: "Я уже отношу себя к традиции", az: "Mən artıq müəyyən bir ənənəyə mənsubam" }, tags: ["already-identify"], next: ["belonging"] },
    ],
  },

  // ============ RELIGION-SPECIFIC REFINEMENT SUBTREES ============
  christian_detail: {
    id: "christian_detail",
    prompt: {
      en: "Which Christian communion or tradition resonates with you?",
      ru: "Какая христианская община или традиция вам близка?",
      az: "Xristianlıq daxilində hansı məzhəb və ya ənənə sizə daha yaxındır?",
    },
    help: {
      en: "Select all that apply. This is about affinity, not formal membership.",
      ru: "Выберите все подходящее. Это об affinity, а не о формальном членстве.",
      az: "Uyğun gələn bütün variantları seçin. Bu, formal üzvlük deyil, mənəvi yaxınlıqla bağlıdır.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "catholic", label: { en: "Catholic", ru: "Католичество", az: "Katoliklik" }, tags: ["catholic", "christian"] },
      { id: "orthodox", label: { en: "Eastern Orthodox", ru: "Православие", az: "Şərq Pravoslavlığı" }, tags: ["orthodox", "christian"] },
      { id: "oriental_orthodox", label: { en: "Oriental Orthodox", ru: "Ориентальное православие", az: "Qədim Şərq Kilsələri (Orienta Pravoslavlığı)" }, tags: ["oriental-orthodox", "christian"] },
      { id: "protestant", label: { en: "Protestant (incl. Anglican, Baptist, Methodist, Pentecostal, Reformed, etc.)", ru: "Протестантизм (вкл. англиканство, баптизм, методизм, пятидесятничество, реформатство и др.)", az: "Protestantlıq (Anqlikan, Baptist, Metodist, Pentikostal, Reformist və s. daxil olmaqla)" }, tags: ["protestant", "christian"] },
      { id: "restorationist", label: { en: "Restorationist / other Christian (self-described)", ru: "Реставрационизм / другое христианство (самоописание)", az: "Bərpaçılıq cərəyanları / digər xristian cərəyanı (öz təsviriniz)" }, tags: ["restorationist", "christian"], next: ["free_text_christian"] },
      { id: "christian_unsure", label: { en: "Unsure which Christian path", ru: "Не уверен, какой христианский путь", az: "Hansı xristian yolunun uyğun olduğuna əmin deyiləm" }, tags: ["christian", "unsure"], isUniversal: "unsure" },
    ],
  },

  islam_detail: {
    id: "islam_detail",
    prompt: {
      en: "Which Islamic tradition or orientation resonates with you?",
      ru: "Какая исламская традиция или направление вам близко?",
      az: "İslam daxilində hansı ənənə və ya istiqamət sizə daha yaxındır?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "sunni", label: { en: "Sunni", ru: "Суннизм", az: "Sünnilik (Əhli-sünnə)" }, tags: ["sunni", "muslim"] },
      { id: "shia", label: { en: "Shia", ru: "Шиизм", az: "Şiəlik" }, tags: ["shia", "muslim"] },
      { id: "ibadi", label: { en: "Ibadi", ru: "Ибадизм", az: "İbadilik" }, tags: ["ibadi", "muslim"] },
      { id: "sufi", label: { en: "Sufi-oriented", ru: "Суфийское направление", az: "Təsəvvüf / Sufi yönümlü" }, tags: ["sufi", "muslim"] },
      { id: "quranist", label: { en: "Quranist / Quran-focused", ru: "коранизм / Коран-центричный", az: "Quraniyyun / Yalnız Qurana əsaslanan" }, tags: ["quranist", "muslim"] },
      { id: "muslim_unsure", label: { en: "Unspecified Muslim / unsure", ru: "Неопределённый мусульманин / не уверен", az: "Dəqiqləşdirilməmiş müsəlman / əmin deyiləm" }, tags: ["muslim", "unsure"], isUniversal: "unsure" },
    ],
  },

  jewish_detail: {
    id: "jewish_detail",
    prompt: {
      en: "Which Jewish tradition or orientation resonates with you?",
      ru: "Какая еврейская традиция или направление вам близко?",
      az: "Yəhudilik daxilində hansı ənənə və ya cərəyan sizə daha yaxındır?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "orthodox_jewish", label: { en: "Orthodox", ru: "Ортодоксальный", az: "Ortodoks Yəhudilik" }, tags: ["orthodox-jewish", "jewish"] },
      { id: "conservative_jewish", label: { en: "Conservative / Masorti", ru: "Консервативный / Масорти", az: "Mühafizəkar (Masorti) Yəhudilik" }, tags: ["conservative-jewish", "jewish"] },
      { id: "reform_jewish", label: { en: "Reform / Liberal", ru: "Реформистский / Либеральный", az: "Reformist / Liberal Yəhudilik" }, tags: ["reform-jewish", "jewish"] },
      { id: "reconstructionist_jewish", label: { en: "Reconstructionist", ru: "Реконструкционистский", az: "Rekonstruksionist Yəhudilik" }, tags: ["reconstructionist-jewish", "jewish"] },
      { id: "secular_cultural_jewish", label: { en: "Secular / cultural Jewish", ru: "Светский / культурный еврей", az: "Dünyəvi / mədəni Yəhudi kimliyi" }, tags: ["secular-jewish", "jewish"] },
      { id: "jewish_unsure", label: { en: "Unspecified Jewish / unsure", ru: "Неопределённый еврей / не уверен", az: "Dəqiqləşdirilməmiş yəhudi / əmin deyiləm" }, tags: ["jewish", "unsure"], isUniversal: "unsure" },
    ],
  },

  sikh_detail: {
    id: "sikh_detail",
    prompt: {
      en: "How do you relate to the Sikh path?",
      ru: "Как вы относитесь к сикхскому пути?",
      az: "Siqh təliminə münasibətiniz necədir?",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      { id: "sikh_khalsa", label: { en: "I connect with the Khalsa / Amritdhari path", ru: "Я связан с путём Хальсы / Амритдхари", az: "Xalsa / Amritdhari yolu ilə əlaqə qururam" }, tags: ["khalsa", "sikh"] },
      { id: "sikh_sehajdhari", label: { en: "I connect as a Sehajdhari (non-initiated)", ru: "Я связан как сехадждхари (непосвящённый)", az: "Sehacdari kimi yanaşıram (təlimə xüsusi ritualla daxil olmayan)" }, tags: ["sehajdhari", "sikh"] },
      { id: "sikh_cultural", label: { en: "Cultural / ancestral connection to Sikhism", ru: "Культурная / родовая связь с сикхизмом", az: "Siqhizmə mədəni və ya əcdad bağı ilə bağlıyam" }, tags: ["sikh-cultural", "sikh"] },
      { id: "sikh_unsure", label: { en: "Unsure / just exploring", ru: "Не уверен / просто изучаю", az: "Əmin deyiləm / sadəcə araşdırıram" }, tags: ["sikh", "unsure"], isUniversal: "unsure" },
    ],
  },

  bahai_detail: {
    id: "bahai_detail",
    prompt: {
      en: "What draws you to the Baháʼí Faith?",
      ru: "Что привлекает вас в Вере Бахаи?",
      az: "Bəhai inancında sizi ən çox cəlb edən nədir?",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      { id: "bahai_unity", label: { en: "The unity of humanity and religions", ru: "Единство человечества и религий", az: "Bəşəriyyətin və dinlərin vəhdəti" }, tags: ["bahai-unity", "bahai"] },
      { id: "bahai_manifestation", label: { en: "Baháʼuʼlláh as a Manifestation of God", ru: "Бахаулла как Проявление Бога", az: "Bəhaullahın Allahın Zühuru (Məzhəri) olması" }, tags: ["bahai-manifestation", "bahai"] },
      { id: "bahai_community", label: { en: "The Baháʼí community and administrative order", ru: "Община бахаи и административный порядок", az: "Bəhai icması və inzibati nizamı" }, tags: ["bahai-community", "bahai"] },
      { id: "bahai_unsure", label: { en: "Unsure / just exploring", ru: "Не уверен / просто изучаю", az: "Əmin deyiləm / sadəcə araşdırıram" }, tags: ["bahai", "unsure"], isUniversal: "unsure" },
    ],
  },

  buddhist_detail: {
    id: "buddhist_detail",
    prompt: {
      en: "Which Buddhist tradition resonates with you?",
      ru: "Какая буддийская традиция вам близка?",
      az: "Buddizm daxilində hansı ənənə sizə daha yaxındır?",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "theravada", label: { en: "Theravada", ru: "Тхеравада", az: "Teravada" }, tags: ["theravada", "buddhist"] },
      { id: "mahayana", label: { en: "Mahayana (incl. Zen/Chan, Pure Land, Nichiren)", ru: "Махаяна (вкл. дзен/чань, Чистая земля, Нитирэн)", az: "Mahayana (Dzen/Çan, Təmiz Torpaq, Niçiren daxil olmaqla)" }, tags: ["mahayana", "buddhist"] },
      { id: "vajrayana", label: { en: "Vajrayana / Tibetan", ru: "Ваджраяна / Тибетский", az: "Vacrayana / Tibet Buddizmi" }, tags: ["vajrayana", "buddhist"] },
      { id: "buddhist_unsure", label: { en: "Unsure / just exploring", ru: "Не уверен / просто изучаю", az: "Əmin deyiləm / sadəcə araşdırıram" }, tags: ["buddhist", "unsure"], isUniversal: "unsure" },
    ],
  },

  deism_detail: {
    id: "deism_detail",
    prompt: {
      en: "Which style of deism fits your outlook?",
      ru: "Какой стиль деизма соответствует вашему взгляду?",
      az: "Deizmin hansı forması dünyagörüşünüzə uyğundur?",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      { id: "classical_deism", label: { en: "Classical deism (creator who does not intervene)", ru: "Классический деизм (творец, который не вмешивается)", az: "Klassik deizm (müdaxilə etməyən Yaradıcı)" }, tags: ["classical-deism", "deism"] },
      { id: "pandeism", label: { en: "Pandeism (God became the universe)", ru: "Пандеизм (Бог стал вселенной)", az: "Pandeizm (Kainata çevrilmiş Tanrı)" }, tags: ["pandeism", "deism"] },
      { id: "deistic_naturalism", label: { en: "Deistic naturalism / religious naturalism", ru: "Деистический натурализм / религиозный натурализм", az: "Deistik naturalizm / dini naturalizm" }, tags: ["deistic-naturalism", "deism", "religious-naturalist"] },
      { id: "deism_unsure", label: { en: "Unsure / just exploring", ru: "Не уверен / просто изучаю", az: "Əmin deyiləm / sadəcə araşdırıram" }, tags: ["deism", "unsure"], isUniversal: "unsure" },
    ],
  },

  pantheism_detail: {
    id: "pantheism_detail",
    prompt: {
      en: "Which immanence-oriented path fits your outlook?",
      ru: "Какой имманентно-ориентированный путь соответствует вашему взгляду?",
      az: "İmmanentliyə (ilahi varlığın aləmlə eyniliyinə) əsaslanan hansı yol dünyagörüşünüzə uyğundur?",
    },
    responseMode: "single",
    universalChoices: true,
    choices: [
      { id: "pantheism", label: { en: "Pantheism (God = universe)", ru: "Пантеизм (Бог = вселенная)", az: "Panteizm (Tanrı = Kainat)" }, tags: ["pantheism"] },
      { id: "panentheism", label: { en: "Panentheism (universe in God, God exceeds universe)", ru: "Панентеизм (вселенная в Боге, Бог превышает вселенную)", az: "Panenteizm (Kainat Tanrıdadır, Tanrı kainatı aşır)" }, tags: ["panentheism"] },
      { id: "process_theism", label: { en: "Process / relational theism", ru: "Процесс / реляционный теизм", az: "Proses ilahiyyatı / münasibət teizmi" }, tags: ["process-theism"] },
      { id: "immanence_unsure", label: { en: "Unsure / just exploring", ru: "Не уверен / просто изучаю", az: "Əmin deyiləm / sadəcə araşdırıram" }, tags: ["immanence", "unsure"], isUniversal: "unsure" },
    ],
  },

  // ============ TRADITION / BELONGING (MULTI-SELECT) ============
  belonging: {
    id: "belonging",
    prompt: {
      en: "Which traditions, communities, practices, and cultural inheritances matter to you? Select all that apply.",
      ru: "Какие традиции, общины, практики и культурное наследие важны для вас? Выберите все подходящее.",
      az: "Hansı ənənələr, icmalar, təcrübələr və mədəni irs sizin üçün əhəmiyyətlidir? (Uyğun olanların hamısını seçin)",
    },
    help: {
      en: "Belonging and belief do not always match. Affiliation may be multiple, cultural-only, or ancestral without doctrinal assent.",
      ru: "Принадлежность и вера не всегда совпадают. Аффилиация может быть множественной, только культурной или родовой без догматического согласия.",
      az: "Mənsubiyyət və inanc həmişə eyni olmaya bilər. Əlaqəniz çoxşaxəli, sırf mədəni və ya doqmaları qəbul etmədən əcdad irsinə bağlı ola bilər.",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "abrahamic", label: { en: "Jewish; Christian; Muslim; Baháʼí; Samaritan; Druze; Mandaean; Yazidi; Rastafari; other Abrahamic/West Asian", ru: "Еврейская; Христианская; Мусульманская; Бахаи; Самаритянская; Дерзская; Мандейская; Езидская; Растафари; другое Авраамическое/Западноазиатское", az: "İbrahimi ənənələr (Yəhudilik, Xristianlıq, İslam, Bəhai, Samariya, Dürzi, Məndayi, Yezidi, Rastafari və digər Qərbi Asiya ənənələri)" }, tags: ["abrahamic"], next: ["abrahamic_detail"] },
      { id: "southasian", label: { en: "Hindu traditions; Sikh; Jain; Buddhist; other South Asian/Himalayan traditions", ru: "Индуистские традиции; Сикх; Джайн; Буддист; другие Южноазиатские/Гималайские традиции", az: "Cənubi Asiya / Dharmik ənənələr (Hindu, Siqh, Caynist, Buddist və digər Himalay ənənələri)" }, tags: ["south-asian"], next: ["southasian_detail"] },
      { id: "eastasian", label: { en: "Daoist; Confucian; Chinese folk/religious traditions; Shinto; Korean traditions; Vietnamese traditions; Japanese new religions", ru: "Даосизм; Конфуцианство; Китайские народные/религиозные традиции; Синто; Корейские традиции; Вьетнамские традиции; Японские новые религии", az: "Şərqi Asiya ənənələri (Daosist, Konfutsiçi, Çin xalq inancları, Şintoist, Koreya, Vyetnam və Yaponiyanın yeni dini hərəkatları)" }, tags: ["east-asian"], next: ["eastasian_detail"] },
      { id: "indigenous", label: { en: "Indigenous, land-based, ancestral, African traditional, African diasporic, Pacific, American, or circumpolar traditions — self-described region/people first", ru: "Коренные, земельные, родовые, Африканские традиционные, Африканские диаспорные, Тихоокеанские, Американские или полярные традиции — самописание региона/народа превыше всего", az: "Yerli, torpağa bağlı, əcdad, ənənəvi Afrika və ya Afrika diasporu, Sakit okean, Amerika və ya qütbyanı ənənələr (ilk növbədə xalq/region)" }, tags: ["indigenous", "land-based", "ancestral"], next: ["indigenous_detail"] },
      { id: "pagan", label: { en: "Contemporary Pagan, Heathen, Druid, Wiccan, reconstructionist, or related", ru: "Современное язычество, Хейтн, Друидизм, Уикка, реконструкционизм или смежное", az: "Müasir Paqan, Heten, Druid, Vikka, rekonstruksionist və ya əlaqəli ənənələr" }, tags: ["pagan", "heathen", "druid", "wiccan", "reconstructionist"], next: ["pagan_detail"] },
      { id: "esoteric", label: { en: "Spiritualist, Theosophical, occult/esoteric, New Thought, New Age, or related", ru: "Спиритуализм, Теософия, оккультное/эзотерическое, Нью Сот, Новый век или смежное", az: "Spiritualist, Teosofiya, okkult/ezoterik, Yeni Düşüncə, Yeni Əsr (New Age) və ya əlaqəli təlimlər" }, tags: ["esoteric", "theosophical", "occult", "new-thought", "new-age"], next: ["esoteric_detail"] },
      { id: "newreligion", label: { en: "New religious movement or independent spiritual path", ru: "Новое религиозное движение или независимый духовный путь", az: "Yeni dini hərəkat və ya müstəqil mənəvi yol" }, tags: ["new-religious-movement", "independent-path"], next: ["newreligion_detail"] },
      { id: "unaffiliated", label: { en: "Unaffiliated, cultural affiliation only, mixed affiliation, or no label", ru: "Неаффилированный, только культурная принадлежность, смешанная принадлежность, или без ярлыка", az: "Heç bir ənənəyə mənsub deyiləm, yalnız mədəni bağlılıq, qarışıq mənsubiyyət və ya təsnifatsız" }, tags: ["unaffiliated", "cultural-only", "mixed", "no-label"] },
      { id: "self_described_belonging", label: { en: "Other self-described (free text)", ru: "Другое (свободный текст)", az: "Digər (öz təsviriniz)" }, tags: ["self-described"], next: ["free_text_belonging"] },
    ],
  },

  // ============ DETAIL NODES FOR TRADITION SUB-BRANCHES ============
  abrahamic_detail: {
    id: "abrahamic_detail",
    prompt: {
      en: "Which Abrahamic tradition(s) do you identify with? Select all that apply.",
      ru: "С какой авраамической традицией(ями) вы себя идентифицируете? Выберите все подходящее.",
      az: "Hansı İbrahimi ənənə(lər) ilə özünüzü eyniləşdirirsiniz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "jewish", label: { en: "Jewish", ru: "Еврейская", az: "Yəhudi" }, tags: ["jewish"] },
      { id: "christian", label: { en: "Christian", ru: "Христианская", az: "Xristian" }, tags: ["christian"] },
      { id: "muslim", label: { en: "Muslim", ru: "Мусульманская", az: "Müsəlman" }, tags: ["muslim"] },
      { id: "bahai", label: { en: "Baháʼí", ru: "Бахаи", az: "Bəhai" }, tags: ["bahai"] },
      { id: "samaritan", label: { en: "Samaritan", ru: "Самаритянская", az: "Samariyalı" }, tags: ["samaritan"] },
      { id: "druze", label: { en: "Druze", ru: "Дерзская", az: "Dürzi" }, tags: ["druze"] },
      { id: "mandaean", label: { en: "Mandaean", ru: "Мандейская", az: "Məndayi" }, tags: ["mandaean"] },
      { id: "yazidi", label: { en: "Yazidi", ru: "Езидская", az: "Yezidi" }, tags: ["yazidi"] },
      { id: "rastafari", label: { en: "Rastafari", ru: "Растафари", az: "Rastafari" }, tags: ["rastafari"] },
      { id: "other_abrahamic", label: { en: "Other Abrahamic / West Asian (self-described)", ru: "Другое Авраамическое / Западноазиатское (самоописание)", az: "Digər İbrahimi / Qərbi Asiya ənənəsi (öz təsviriniz)" }, tags: ["other-abrahamic"], next: ["free_text_abrahamic"] },
    ],
  },

  southasian_detail: {
    id: "southasian_detail",
    prompt: {
      en: "Which South Asian tradition(s)? Select all that apply.",
      ru: "Какая(ие) Южноазиатская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Cənubi Asiya ənənə(lər)inə mənsubsunuz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "hindu", label: { en: "Hindu traditions", ru: "Индуистские традиции", az: "Hindu ənənələri (Sanatana Dxarma)" }, tags: ["hindu"], next: ["hindu_detail"] },
      { id: "sikh", label: { en: "Sikh", ru: "Сихизм", az: "Siqh" }, tags: ["sikh"] },
      { id: "jain", label: { en: "Jain", ru: "Джайнизм", az: "Caynizm" }, tags: ["jain"] },
      { id: "buddhist_sa", label: { en: "Buddhist", ru: "Буддизм", az: "Buddist" }, tags: ["buddhist"] },
      { id: "other_southasian", label: { en: "Other South Asian / Himalayan (self-described)", ru: "Другое Южноазиатское / Гималайское (самоописание)", az: "Digər Cənubi Asiya / Himalay ənənəsi (öz təsviriniz)" }, tags: ["other-south-asian"], next: ["free_text_southasian"] },
    ],
  },

  eastasian_detail: {
    id: "eastasian_detail",
    prompt: {
      en: "Which East Asian tradition(s)? Select all that apply.",
      ru: "Какая(ие) Восточноазиатская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Şərqi Asiya ənənə(lər)inə mənsubsunuz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "daoist", label: { en: "Daoist", ru: "Даосизм", az: "Daosizm" }, tags: ["daoist"] },
      { id: "confucian", label: { en: "Confucian", ru: "Конфуцианство", az: "Konfutsiçilik" }, tags: ["confucian"] },
      { id: "chinese_folk", label: { en: "Chinese folk / religious traditions", ru: "Китайские народные / религиозные традиции", az: "Çin xalq / dini ənənələri" }, tags: ["chinese-folk"] },
      { id: "shinto", label: { en: "Shinto", ru: "Синто", az: "Şintoist" }, tags: ["shinto"] },
      { id: "korean", label: { en: "Korean traditions", ru: "Корейские традиции", az: "Koreya ənənələri (Sinqyo, Çondoqyo və s.)" }, tags: ["korean"] },
      { id: "vietnamese", label: { en: "Vietnamese traditions", ru: "Вьетнамские традиции", az: "Vyetnam ənənələri (Kaodayizm, Xoahao və s.)" }, tags: ["vietnamese"] },
      { id: "japanese_new", label: { en: "Japanese new religions", ru: "Японские новые религии", az: "Yaponiyanın yeni dini hərəkatları" }, tags: ["japanese-new"] },
      { id: "other_eastasian", label: { en: "Other East Asian (self-described)", ru: "Другое Восточноазиатское (самоописание)", az: "Digər Şərqi Asiya ənənəsi (öz təsviriniz)" }, tags: ["other-east-asian"], next: ["free_text_eastasian"] },
    ],
  },

  indigenous_detail: {
    id: "indigenous_detail",
    prompt: {
      en: "Which Indigenous / ancestral tradition? Self-describe your people/region.",
      ru: "Какая коренная / родовая традиция? Самоопишите свой народ/регион.",
      az: "Hansı yerli və ya əcdad ənənəsinə mənsubsunuz? Xalqınızı və ya bölgənizi qeyd edin.",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "indigenous_self", label: { en: "Enter your tradition / people / region", ru: "Введите свою традицию / народ / регион", az: "Ənənənizi, xalqınızı və ya bölgənizi qeyd edin" }, tags: ["indigenous-self-described"], next: ["free_text_indigenous"] },
    ],
  },

  pagan_detail: {
    id: "pagan_detail",
    prompt: {
      en: "Which contemporary Pagan path? Select all that apply.",
      ru: "Какой современный языческий путь? Выберите все подходящее.",
      az: "Hansı müasir paqan yoluna üstünlük verirsiniz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "heathen", label: { en: "Heathen / Germanic/Norse reconstructionist", ru: "Хейтн / Германо/Скандинавский реконструкционизм", az: "Heten / German-Skandinav rekonstruksionizmi" }, tags: ["heathen"] },
      { id: "druid", label: { en: "Druid / Celtic reconstructionist", ru: "Друид / Кельтский реконструкционизм", az: "Druid / Kelt rekonstruksionizmi" }, tags: ["druid"] },
      { id: "wiccan", label: { en: "Wiccan / Neo-Wiccan", ru: "Уиккан / Нео-уиккан", az: "Vikka / Neo-Vikka" }, tags: ["wiccan"] },
      { id: "reconstructionist", label: { en: "Polytheist reconstructionist (Greek, Roman, Egyptian, etc.)", ru: "Политеист-реконструкционист (Греческий, Римский, Египетский и др.)", az: "Rekonstruksionist politeizm (Yunan, Roma, Misir və s.)" }, tags: ["reconstructionist"] },
      { id: "other_pagan", label: { en: "Other Pagan / related (self-described)", ru: "Другое язычество / смежное (самоописание)", az: "Digər paqan və ya əlaqəli yol (öz təsviriniz)" }, tags: ["other-pagan"], next: ["free_text_pagan"] },
    ],
  },

  esoteric_detail: {
    id: "esoteric_detail",
    prompt: {
      en: "Which esoteric / spiritualist tradition? Select all that apply.",
      ru: "Какая эзотерическая / спиритуалистическая традиция? Выберите все подходящее.",
      az: "Hansı ezoterik və ya spiritualist ənənəyə üstünlük verirsiniz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "spiritualist", label: { en: "Spiritualist", ru: "Спиритуализм", az: "Spiritualist" }, tags: ["spiritualist"] },
      { id: "theosophical", label: { en: "Theosophical", ru: "Теософия", az: "Teosofik / Antroposofik" }, tags: ["theosophical"] },
      { id: "occult", label: { en: "Occult / ceremonial magic / hermetic", ru: "Оккультизм / церемониальная магия / герметизм", az: "Okkultizm / mərasim magiyası / hermetizm" }, tags: ["occult"] },
      { id: "new_thought", label: { en: "New Thought / Unity / Science of Mind", ru: "Новый Мысли / Юнити / Наука Разума", az: "Yeni Düşüncə (New Thought) / Yuniti / Zehin Elmi" }, tags: ["new-thought"] },
      { id: "new_age", label: { en: "New Age / holistic spirituality", ru: "Новый Век / целостная духовность", az: "Yeni Əsr (New Age) / holistik mənəviyyat" }, tags: ["new-age"] },
      { id: "other_esoteric", label: { en: "Other esoteric / related (self-described)", ru: "Другое эзотерическое / смежное (самоописание)", az: "Digər ezoterik və ya əlaqəli təlim (öz təsviriniz)" }, tags: ["other-esoteric"], next: ["free_text_esoteric"] },
    ],
  },

  newreligion_detail: {
    id: "newreligion_detail",
    prompt: {
      en: "Which new religious movement or independent path?",
      ru: "Какое новое религиозное движение или независимый путь?",
      az: "Hansı yeni dini hərəkat və ya müstəqil yola mənsubsunuz?",
    },
    responseMode: "free-text",
    universalChoices: true,
    choices: [
      { id: "nr_self", label: { en: "Enter name / description", ru: "Введите название / описание", az: "Adını və ya təsvirini qeyd edin" }, tags: ["nr-self-described"], next: ["free_text_nr"] },
    ],
  },

  hindu_detail: {
    id: "hindu_detail",
    prompt: {
      en: "Which Hindu tradition(s)? Select all that apply.",
      ru: "Какая(ие) индуистская(ие) традиция(ии)? Выберите все подходящее.",
      az: "Hansı Hindu ənənə(lər)inə mənsubsunuz? (Uyğun olanların hamısını seçin)",
    },
    responseMode: "multiple",
    universalChoices: true,
    choices: [
      { id: "vaishnava", label: { en: "Vaishnava (Vishnu/Krishna)", ru: "Ваишнава (Вишну/Кришна)", az: "Vayşnavizm (Vişnu / Krişna)" }, tags: ["vaishnava"] },
      { id: "shaiva", label: { en: "Shaiva (Shiva)", ru: "Шаива (Шива)", az: "Şaivizm (Şiva)" }, tags: ["shaiva"] },
      { id: "shakta", label: { en: "Shakta (Devi/Goddess)", ru: "Шакта (Деви/Богиня)", az: "Şaktizm (Devi / İlahə)" }, tags: ["shakta"] },
      { id: "smarta", label: { en: "Smarta / Advaita Vedanta", ru: "Смарта / Адвайта Веданта", az: "Smartizm / Advayta Vedanta" }, tags: ["smarta", "advaita"] },
      { id: "other_hindu", label: { en: "Other Hindu / new movements (self-described)", ru: "Другое индуистское / новые движения (самоописание)", az: "Digər Hindu ənənələri və ya yeni hərəkatlar (öz təsviriniz)" }, tags: ["other-hindu"], next: ["free_text_hindu"] },
    ],
  },

  // ============ FREE-TEXT NODES ============
  free_text_nonrel: { id: "free_text_nonrel", prompt: { en: "Describe your non-religious orientation", ru: "Опишите вашу нерелигиозную ориентацию", az: "Dini olmayan dünyagörüşünüzü öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_rnatural: { id: "free_text_rnatural", prompt: { en: "Describe your naturalistic sacred orientation", ru: "Опишите ваше натуралистическое священное отношение", az: "Naturalist müqəddəslik dünyagörüşünüzü öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_nt: { id: "free_text_nt", prompt: { en: "Describe your non-theistic identification", ru: "Опишите вашу нетеистическую идентификацию", az: "Qeyri-teist baxışınızı və ya kimliyinizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_agnostic: { id: "free_text_agnostic", prompt: { en: "Describe your agnostic stance", ru: "Опишите вашу агностическую позицию", az: "Agnostik mövqeyinizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_practice: { id: "free_text_practice", prompt: { en: "Describe your practice/community entry point", ru: "Опишите вашу точку входа через практику/общину", az: "Əsas dayaq nöqtəniz olan əməli təcrübə və ya icmanızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_abrahamic: { id: "free_text_abrahamic", prompt: { en: "Describe your Abrahamic identification", ru: "Опишите вашу авраамическую идентификацию", az: "İbrahimi ənənələrlə bağlı baxışınızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_southasian: { id: "free_text_southasian", prompt: { en: "Describe your South Asian identification", ru: "Опишите вашу южноазиатскую идентификацию", az: "Cənubi Asiya (Dharmik) ənənələri ilə bağlı baxışınızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_eastasian: { id: "free_text_eastasian", prompt: { en: "Describe your East Asian identification", ru: "Опишите вашу восточноазиатскую идентификацию", az: "Şərqi Asiya ənənələri ilə bağlı baxışınızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_indigenous: { id: "free_text_indigenous", prompt: { en: "Describe your Indigenous/ancestral tradition", ru: "Опишите вашу коренную/родовую традицию", az: "Yerli və ya əcdad ənənənizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_pagan: { id: "free_text_pagan", prompt: { en: "Describe your Pagan path", ru: "Опишите ваш языческий путь", az: "Paqan təliminizlə bağlı baxışınızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_esoteric: { id: "free_text_esoteric", prompt: { en: "Describe your esoteric tradition", ru: "Опишите вашу эзотерическую традицию", az: "Ezoterik və ya mistik ənənənizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_nr: { id: "free_text_nr", prompt: { en: "Describe your new religious movement / independent path", ru: "Опишите ваше новое религиозное движение / независимый путь", az: "Yeni dini hərəkat və ya müstəqil yolunuzu öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_hindu: { id: "free_text_hindu", prompt: { en: "Describe your Hindu tradition", ru: "Опишите вашу индуистскую традицию", az: "Hinduizm (Sanatana Dxarma) ilə bağlı baxışınızı öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_belonging: { id: "free_text_belonging", prompt: { en: "Describe your tradition / cultural inheritance", ru: "Опишите вашу традицию / культурное наследие", az: "Mənsub olduğunuz ənənəni və ya mədəni irsinizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
  free_text_christian: { id: "free_text_christian", prompt: { en: "Describe your Christian tradition", ru: "Опишите вашу христианскую традицию", az: "Xristianlıq daxilindəki ənənənizi öz sözlərinizlə təsvir edin:" }, responseMode: "free-text", choices: [] },
};

// ============ TERMINAL PROFILES (multi-axis, not single-label) ============
// These are example composite profiles generated from tag combinations
export const TERMINAL_PROFILES: Record<string, { title: LocalizedText; blueprint: LocalizedText; tags: string[] }> = {
  // Generated dynamically from profile tags — see wizardStore.ts for composition logic
  // Kept here for reference structure only
  profile_template: {
    title: { en: "Your Orientation Profile", ru: "Ваш профиль ориентации", az: "Yanaşma Profiliniz" },
    blueprint: { en: "Your answers currently describe a {confidence} {orientation} orientation. You {ultimateReality}, draw primarily on {epistemicSources}, and identify connections with {traditions}. This is a description, not an authoritative label.", ru: "Ваши ответы описывают {confidence} {orientation} ориентацию. Вы {ultimateReality}, опираетесь на {epistemicSources} и идентифицируете связи с {traditions}. Это описание, а не авторитетный ярлык.", az: "Cavablarınız {confidence} {orientation} yanaşmasını təsvir edir. Siz {ultimateReality}, əsasən {epistemicSources} üzərinə dayanırsınız və {traditions} ilə əlaqələri müəyyən edirsiniz. Bu təsvirdir, rəsmi bir etiket deyil." },
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