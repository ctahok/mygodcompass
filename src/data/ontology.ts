// ============================================================
// The Ontological Compass — DAG ontology definition
// A Directed Acyclic Graph (not a linear quiz).
// Every node has localized questions/options + routing.
// ============================================================

export type Lang = "en" | "ru" | "az";
export type LocalizedText = Record<Lang, string>;

export interface Option {
  label: LocalizedText;
  /** Tooltip definition for complex terms (i icon) */
  tip?: LocalizedText;
  next_node: string;
  tags: string[];
  /** Extra weight for coherence scoring (default 1) */
  weight?: number;
}

export interface Node {
  node_id: string;
  question: LocalizedText;
  options: Option[];
  /** Optional short help line under the question */
  hint?: LocalizedText;
}

export interface Terminal {
  node_id: string;
  title: LocalizedText;
  /** "The Blueprint" generated paragraph with placeholders filled */
  blueprint: LocalizedText;
  social_proof: number;
  percent_of_users: number;
  similar_minds: LocalizedText[];
  tags: string[];
}

// ------------------------------------------------------------
// NODES — the DAG itself
// ------------------------------------------------------------
export const NODES: Record<string, Node> = {
  // ============ PHASE 1: THE GATE (Existence) ============
  existence: {
    node_id: "existence",
    question: {
      en: "Does a higher power exist?",
      ru: "Существует ли высшая сила?",
      az: "Ali güc mövcuddurmu?",
    },
    hint: {
      en: "The Gate. This answer determines whether you enter the rabbit hole.",
      ru: "Врата. Этот ответ определяет, войдёте ли вы в кроличью нору.",
      az: "Qapı. Bu cavab dovşan dəliyinə girib-girməyəcəyinizi müəyyən edir.",
    },
    options: [
      {
        label: { en: "No — I am an atheist", ru: "Нет — я атеист", az: "Xeyr — mən ateistəm" },
        next_node: "terminal_secular_humanist",
        tags: ["atheist"],
      },
      {
        label: { en: "Yes — I believe there is", ru: "Да — я верю, что есть", az: "Bəli — mövcud olduğuna inanıram" },
        next_node: "ontology_realism",
        tags: ["theist"],
      },
      {
        label: { en: "I'm unsure", ru: "Я не уверен", az: "Əmin deyiləm" },
        next_node: "ontology_realism",
        tags: ["agnostic"],
      },
    ],
  },

  // ============ PHASE 2: THE ONTOLOGY (Nature of Being) ============
  ontology_realism: {
    node_id: "ontology_realism",
    question: {
      en: "Is God a mind-independent entity — or a social/mental construct?",
      ru: "Бог — это независимая от сознания сущность или социальный/ментальный конструкт?",
      az: "Tanrı şüurdan asılı olmayan varlıqdır, yoxsa sosial/zehni konstruksiya?",
    },
    hint: {
      en: "Realism check: like a mountain, or like the value of money?",
      ru: "Проверка реализма: как гора или как ценность денег?",
      az: "Realizm yoxlanışı: dağ kimi, yoxsa pulun dəyəri kimi?",
    },
    options: [
      {
        label: { en: "Mind-independent (like a mountain)", ru: "Независим от сознания (как гора)", az: "Şüurdan asılı deyil (dağ kimi)" },
        next_node: "composition",
        tags: ["realist"],
      },
      {
        label: { en: "A social/mental construct (like money)", ru: "Социальный/ментальный конструкт (как деньги)", az: "Sosial/zehni konstruksiya (pul kimi)" },
        next_node: "constructivist_branch",
        tags: ["constructivist"],
      },
    ],
  },

  composition: {
    node_id: "composition",
    question: {
      en: "Is God One, Many, or Everything?",
      ru: "Бог — Один, Многие или Всё?",
      az: "Tanrı Birdir, Çoxdur, yoxsa Hər Şeydir?",
    },
    hint: {
      en: "Monotheism, Polytheism, or Pantheism.",
      ru: "Монотеизм, политеизм или пантеизм.",
      az: "Monoteizm, politeizm və ya panteizm.",
    },
    options: [
      {
        label: { en: "One (Monotheism)", ru: "Один (Монотеизм)", az: "Bir (Monoteizm)" },
        next_node: "relation",
        tags: ["monotheist"],
        tip: {
          en: "Belief in a single supreme God.",
          ru: "Вера в единого верховного Бога.",
          az: "Vahid ali Tanrıya inam.",
        },
      },
      {
        label: { en: "Many (Polytheism)", ru: "Многие (Политеизм)", az: "Çox (Politeizm)" },
        next_node: "polytheism_type",
        tags: ["polytheist"],
        tip: {
          en: "Belief in multiple gods with distinct domains.",
          ru: "Вера во множество богов с разными сферами.",
          az: "Fərqli sahələri olan çoxlu tanrılara inam.",
        },
      },
      {
        label: { en: "Everything (Pantheism)", ru: "Всё (Пантеизм)", az: "Hər şey (Panteizm)" },
        next_node: "pantheism_type",
        tags: ["pantheist"],
        tip: {
          en: "God and the universe are identical.",
          ru: "Бог и вселенная тождественны.",
          az: "Tanrı və kainat eynidir.",
        },
      },
    ],
  },

  relation: {
    node_id: "relation",
    question: {
      en: "Does God interact with us — or leave us alone?",
      ru: "Бог взаимодействует с нами — или оставил нас одних?",
      az: "Tanrı bizimlə əlaqədədirmi — yoxsa bizi tək qoyub?",
    },
    hint: {
      en: "Theism (active) vs Deism (watchmaker).",
      ru: "Теизм (активный) vs деизм (часовщик).",
      az: "Teizm (aktiv) vs deizm (saat ustası).",
    },
    options: [
      {
        label: { en: "God interacts with us (Theism)", ru: "Бог взаимодействует с нами (Теизм)", az: "Tanrı bizimlə əlaqədədir (Teizm)" },
        next_node: "personalism",
        tags: ["theism", "interventionist"],
      },
      {
        label: { en: "God left us alone (Deism)", ru: "Бог оставил нас одних (Деизм)", az: "Tanrı bizi tək qoyub (Deizm)" },
        next_node: "terminal_deist",
        tags: ["deism", "deist"],
        tip: {
          en: "God created the universe like a watchmaker, then stepped away.",
          ru: "Бог создал вселенную как часовщик, а затем ушёл.",
          az: "Tanrı kainatı saat ustası kimi yaradıb, sonra uzaqlaşıb.",
        },
      },
    ],
  },

  personalism: {
    node_id: "personalism",
    question: {
      en: "Is this God a person — or a force?",
      ru: "Этот Бог — личность или сила?",
      az: "Bu Tanrı şəxsdirmi — yoxsa qüvvə?",
    },
    hint: {
      en: "A person has will and emotion; a force is like gravity or logic.",
      ru: "Личность имеет волю и эмоции; сила — как гравитация или логика.",
      az: "Şəxsin iradəsi və duyğuları var; qüvvə cazibə və ya məntiq kimidir.",
    },
    options: [
      {
        label: { en: "A Person (has will/emotion)", ru: "Личность (имеет волю/эмоции)", az: "Şəxs (iradə/duyğu sahibi)" },
        next_node: "divine_action",
        tags: ["personalism"],
      },
      {
        label: { en: "An Abstract Force (gravity/logic)", ru: "Абстрактная сила (гравитация/логика)", az: "Abstrakt qüvvə (cazibə/məntiq)" },
        next_node: "abstract_type",
        tags: ["impersonal"],
      },
    ],
  },

  // ============ PHASE 3: THE BRANCHES ============
  // ---- Constructivist branch ----
  constructivist_branch: {
    node_id: "constructivist_branch",
    question: {
      en: "If God is a construct — what constructs it?",
      ru: "Если Бог — конструкт, то что его конструирует?",
      az: "Əgər Tanrı konstruksiyadırsa — onu nə yaradır?",
    },
    options: [
      {
        label: { en: "Society itself (Durkheimian)", ru: "Само общество (дюркгеймианство)", az: "Cəmiyyətin özü (Dürkheymçilik)" },
        next_node: "terminal_durkheimian",
        tags: ["durkheimian", "constructivist"],
        tip: {
          en: "Émile Durkheim: 'God' is society worshipping itself.",
          ru: "Эмиль Дюркгейм: «Бог» — это общество, поклоняющееся себе.",
          az: "Emil Dürkheym: «Tanrı» cəmiyyətin özünə ibadətidir.",
        },
      },
      {
        label: { en: "The human psyche (Jungian)", ru: "Человеческая психика (юнгианство)", az: "İnsan psixikası (Yunqçuluq)" },
        next_node: "terminal_jungian",
        tags: ["jungian", "constructivist"],
        tip: {
          en: "Carl Jung: God is a universal archetype of the collective unconscious.",
          ru: "Карл Юнг: Бог — универсальный архетип коллективного бессознательного.",
          az: "Karl Yunq: Tanrı kollektiv şüursuzluğun universal arxetipidir.",
        },
      },
    ],
  },

  // ---- Polytheism branch ----
  polytheism_type: {
    node_id: "polytheism_type",
    question: {
      en: "What kind of many?",
      ru: "Какие «многие»?",
      az: "Hansı «çoxluq»?",
    },
    options: [
      {
        label: { en: "Personal gods with domains (Greek/Roman)", ru: "Личные боги со сферами (греческие/римские)", az: "Sahələri olan şəxsi tanrılar (Yunan/Roma)" },
        next_node: "terminal_olympian",
        tags: ["polytheist", "personalism"],
      },
      {
        label: { en: "Cosmic forces/aspects (Hindu tradition)", ru: "Космические силы/аспекты (индуистская традиция)", az: "Kosmik qüvvələr/aspektlər (Hindu ənənəsi)" },
        next_node: "terminal_impersonal_polytheist",
        tags: ["polytheist", "impersonal"],
      },
    ],
  },

  // ---- Pantheism branch ----
  pantheism_type: {
    node_id: "pantheism_type",
    question: {
      en: "How is God related to the universe?",
      ru: "Как Бог соотносится со вселенной?",
      az: "Tanrı kainatla necə bağlıdır?",
    },
    options: [
      {
        label: { en: "God IS the universe (Spinozan)", ru: "Бог — ЭТО вселенная (спинозизм)", az: "Tanrı KAINATIN ÖZÜDÜR (Spinoza)" },
        next_node: "terminal_spinozan",
        tags: ["spinozism", "pantheist"],
      },
      {
        label: { en: "God is the universe's unfolding reason (Hegelian)", ru: "Бог — развёртывающийся разум вселенной (гегельянство)", az: "Tanrı kainatın açılan ağlıdır (Hegelçilik)" },
        next_node: "terminal_hegelian",
        tags: ["hegelianism", "pantheist"],
      },
    ],
  },

  // ---- Theism drill-down ----
  historical_revelation: {
    node_id: "historical_revelation",
    question: {
      en: "Did God reveal himself in human history?",
      ru: "Бог открывал себя в человеческой истории?",
      az: "Tanrı insan tarixində özünü göstəribmi?",
    },
    hint: {
      en: "Scripture, prophets, incarnation — or just inner experience?",
      ru: "Писание, пророки, воплощение — или только внутренний опыт?",
      az: "Müqəddəs kitab, peyğəmbərlər, təcəssüm — yoxsa yalnız daxili təcrübə?",
    },
    options: [
      {
        label: { en: "Yes — through scripture & prophets", ru: "Да — через писание и пророков", az: "Bəli — kitab və peyğəmbərlər vasitəsilə" },
        next_node: "trinity_question",
        tags: ["historical", "revelation"],
      },
      {
        label: { en: "No — only through inner experience", ru: "Нет — только через внутренний опыт", az: "Xeyr — yalnız daxili təcrübə ilə" },
        next_node: "terminal_mystical_theist",
        tags: ["mystical"],
      },
    ],
  },

  trinity_question: {
    node_id: "trinity_question",
    question: {
      en: "Is God triune (Father, Son, Spirit)?",
      ru: "Бог троичен (Отец, Сын, Дух)?",
      az: "Tanrı üçlükdür (Ata, Oğul, Ruh)?",
    },
    hint: {
      en: "The Christian branch vs the broader Abrahamic path.",
      ru: "Христианская ветвь против более широкого авраамического пути.",
      az: "Xristian qolu və daha geniş İbrahimi yol.",
    },
    options: [
      {
        label: { en: "Yes — Triune (Christianity)", ru: "Да — Троица (христианство)", az: "Bəli — Üçlük (Xristianlıq)" },
        next_node: "christian_branch",
        tags: ["trinitarian", "christian"],
      },
      {
        label: { en: "No — strictly one (Judaism/Islam)", ru: "Нет — строго один (иудаизм/ислам)", az: "Xeyr — ciddi şəkildə bir (Yəhudilik/İslam)" },
        next_node: "terminal_abrahamic",
        tags: ["monotheist", "abrahamic"],
      },
    ],
  },

  christian_branch: {
    node_id: "christian_branch",
    question: {
      en: "Which Christian tradition resonates with you?",
      ru: "Какая христианская традиция вам ближе?",
      az: "Hansı xristian ənənəsi sizə yaxındır?",
    },
    options: [
      {
        label: { en: "Protestantism (grace, scripture alone)", ru: "Протестантизм (благодать, только Писание)", az: "Protestantlıq (lütf, yalnız Müqəddəs Kitab)" },
        next_node: "divine_action",
        tags: ["protestant", "christian"],
      },
      {
        label: { en: "Orthodoxy (mystery, tradition, icons)", ru: "Православие (тайна, традиция, иконы)", az: "Pravoslavlıq (müəmma, ənənə, ikonalar)" },
        next_node: "divine_action",
        tags: ["orthodox", "christian"],
      },
      {
        label: { en: "Catholicism (church, sacraments, reason)", ru: "Католицизм (церковь, таинства, разум)", az: "Katolisizm (kilsə, müqəddəs mərasimlər, ağıl)" },
        next_node: "divine_action",
        tags: ["catholic", "christian"],
      },
    ],
  },

  // ---- Abstract/impersonal drill-down ----
  abstract_type: {
    node_id: "abstract_type",
    question: {
      en: "What is this abstract force, exactly?",
      ru: "Что именно представляет собой эта абстрактная сила?",
      az: "Bu abstrakt qüvvə dəqiq nədir?",
    },
    options: [
      {
        label: { en: "The universe itself (Spinozan)", ru: "Сама вселенная (спинозизм)", az: "Kainatın özü (Spinoza)" },
        next_node: "terminal_spinozan",
        tags: ["spinozism", "impersonal"],
      },
      {
        label: { en: "An absolute that unfolds through history (Hegelian)", ru: "Абсолют, развёртывающийся в истории (гегельянство)", az: "Tarix boyu açılan mütləq (Hegelçilik)" },
        next_node: "terminal_hegelian",
        tags: ["hegelianism", "impersonal"],
      },
      {
        label: { en: "A rational first cause (Aristotelian/Thomistic)", ru: "Рациональная первопричина (аристотелизм/томизм)", az: "Rasional ilk səbəb (Aristotel/Toma)" },
        next_node: "terminal_classical_theist",
        tags: ["classical_theism", "impersonal"],
        tip: {
          en: "The Prime Mover: pure actuality, unmoved, the logic of existence.",
          ru: "Перводвигатель: чистая актуальность, неподвижный, логика бытия.",
          az: "İlk Hərəkətverən: saf aktuallıq, hərəkətsiz, varlığın məntiqi.",
        },
      },
    ],
  },

  // ============ NEW: ATTRIBUTE PHASE ============
  // After establishing God's nature, explore attributes

  // Attributes for Personal/Interventionist God
    divine_action: {
      node_id: "divine_action",
      question: {
        en: "How does God primarily act in the world?",
        ru: "Как Бог в основном действует в мире?",
        az: "Tanrı dünyada əsasən necə fəaliyyət göstərir?",
      },
      hint: {
        en: "Miracle vs Providence vs Natural Law.",
        ru: "Чудо vs Провидение vs Естественный закон.",
        az: "Mucizə vs Prövidens vs Təbii Qanun.",
      },
      options: [
        {
          label: { en: "Direct miracles — suspending natural law", ru: "Прямые чудеса — приостановка естественного закона", az: "Birbaşa mucizələr — təbii qanunun dayandırılması" },
          next_node: "divine_relationship",
          tags: ["miraculous", "interventionist"],
          tip: {
            en: "God intervenes supernaturally, overriding nature.",
            ru: "Бог вмешивается сверхъестественно, отменяя природу.",
            az: "Tanrı supra-tabii formada müdaxilə edir, tabiəti ləğv edir.",
          },
        },
        {
          label: { en: "Providence — working through natural law", ru: "Провидение — действуя через естественный закон", az: "Prövidens — təbii qanunlar vasitəsilə fəaliyyət göstərir" },
          next_node: "divine_relationship",
          tags: ["providential", "interventionist"],
          tip: {
            en: "God guides events through ordinary causality.",
            ru: "Бог управляет событиями через обычную причинность.",
            az: "Tanrı hadisələri adi səbəbiyyət vasitəsilə idarə edir.",
          },
        },
        {
          label: { en: "Natural law only — no special action", ru: "Только естественный закон — никакого особого действия", az: "Yalnız təbii qanun — heç bir xüsusi iş yox" },
          next_node: "terminal_deist",
          tags: ["deism", "non_interventionist"],
        },
      ],
    },

    // Attributes for Personal God - Relationship
    divine_relationship: {
      node_id: "divine_relationship",
      question: {
        en: "What is the core of your relationship with God?",
        ru: "В чём суть ваших отношений с Богом?",
        az: "Tanrı ilə münasibətinizin sudu nədir?",
      },
      options: [
        {
          label: { en: "Worship & obedience (servant)", ru: "Поклонение и послушание (слуга)", az: "İbadət və itaat (qul)" },
          next_node: "divine_knowledge",
          tags: ["servant", "worship"],
        },
        {
          label: { en: "Friendship & dialogue (companion)", ru: "Дружба и диалог (товарищ)", az: "Dostluq və dialoq (rəfiiq)" },
          next_node: "divine_knowledge",
          tags: ["companion", "dialogue"],
        },
        {
          label: { en: "Union & absorption (mystic)", ru: "Соединение и поглощение (мистик)", az: "Birləşmə və cəzib (mistik)" },
          next_node: "divine_knowledge",
          tags: ["mystical", "union"],
        },
      ],
    },

    // Knowledge/Epistemology
    divine_knowledge: {
      node_id: "divine_knowledge",
      question: {
        en: "How can we know God?",
        ru: "Как мы можем познать Бога?",
        az: "Biz Tanrıyı necə bilə bilərik?",
      },
      options: [
        {
          label: { en: "Reason & philosophy (rationalist)", ru: "Разум и философия (рационалист)", az: "Ağıll və fəlsəfə (rasionalist)" },
          next_node: "divine_evil",
          tags: ["rationalist", "intellectual"],
        },
        {
          label: { en: "Revelation & scripture (fideist)", ru: "Откровение и писание (фидейст)", az: "İlham və kitab (fideist)" },
          next_node: "divine_evil",
          tags: ["fideist", "revelation"],
        },
        {
          label: { en: "Experience & intuition (experiential)", ru: "Опыт и интуиция (эксперенциалист)", az: "Təcrübə və sezi (eksperensialist)" },
          next_node: "divine_evil",
          tags: ["experiential", "intuition"],
        },
      ],
    },

    // Problem of Evil
    divine_evil: {
      node_id: "divine_evil",
      question: {
        en: "Why does evil/suffering exist if God is good and powerful?",
        ru: "Почему существует зло/страдание, если Бог благ и всемогущ?",
        az: "Nə üçün xeyr/səbr mövcuddursa, Tanrı yaxşı və qüdrətli olarsa?",
      },
      options: [
        {
          label: { en: "Free will defence — God permits it for freedom", ru: "Защита свободы воли — Бог позволяет ради свободы", az: "Azad iradə müdafiəsi — Tanrı azadlıq üçün icazə verir" },
          next_node: "divine_afterlife",
          tags: ["free_will", "theodicy"],
        },
        {
          label: { en: "Soul-making — suffering develops character", ru: "Формирование души — страдание развивает характер", az: "Ruh formalaşması — səbr xassiyyəti formalaşdırır" },
          next_node: "divine_afterlife",
          tags: ["soul_making", "theodicy"],
        },
        {
          label: { en: "Mystery — we cannot comprehend God's reasons", ru: "Тайна — мы не можем постичь причины Бога", az: "Sirr — biz Tanrı səbəblərini başa düşə bilməyirik" },
          next_node: "divine_afterlife",
          tags: ["mystery", "theodicy"],
        },
        {
          label: { en: "God isn't all-powerful (Process theology)", ru: "Бог не всесилен (процессуальное богословие)", az: "Tanrı həsibə-qüdrətli deyil (Proses teologiyası)" },
          next_node: "divine_afterlife",
          tags: ["process", "limited_power"],
        },
      ],
    },

    // Afterlife/Eschatology
    divine_afterlife: {
      node_id: "divine_afterlife",
      question: {
        en: "What happens after death?",
        ru: "Что происходит после смерти?",
        az: "Ölümün sonrası nə baş verir?",
      },
      options: [
        {
          label: { en: "Heaven/Hell — eternal destinations", ru: "Рай/Ад — вечные пристанища", az: "Cənnət/Cəhənnəm — ebedi məkanlar" },
          next_node: "divine_practice",
          tags: ["eternal", "judgment"],
        },
        {
          label: { en: "Reincarnation — cycle of rebirth", ru: "Реинкарнация — цикл перерождений", az: "Reinkarnasiya — yenidən anma dövrü" },
          next_node: "divine_practice",
          tags: ["reincarnation", "cycle"],
        },
        {
          label: { en: "Annihilation — consciousness ends", ru: "Аннигиляция — сознание прекращается", az: "Anniqilyasiya — şüur sona çətir" },
          next_node: "divine_practice",
          tags: ["annihilation", "materialist"],
        },
        {
          label: { en: "Universal reconciliation — all are saved", ru: "Всеобщее примирение — все спасаются", az: "Ümumi sullahma — hər kəs xilas olur" },
          next_node: "divine_practice",
          tags: ["universalism", "inclusivist"],
        },
      ],
    },

    // Religious practice
    divine_practice: {
      node_id: "divine_practice",
      question: {
        en: "What is the primary religious practice?",
        ru: "Какова основная религиозная практика?",
        az: "Əsas dini praktika nədir?",
      },
      options: [
        {
          label: { en: "Ritual & liturgy (sacramental)", ru: "Ритуал и литургия (сакраментальная)", az: "Ritual və liquriya (sakramental)" },
          next_node: "terminal_sacramental",
          tags: ["sacramental", "ritual"],
        },
        {
          label: { en: "Meditation & contemplation (contemplative)", ru: "Медитация и контемпляция (контемплятивная)", az: "Meditasiya və konteqlasiya (konteqlaтив)" },
          next_node: "terminal_contemplative",
          tags: ["contemplative", "meditation"],
        },
        {
          label: { en: "Ethics & social action (prophetic)", ru: "Этика и социальное действие (пророческая)", az: "Etikə və sosial iş (peyğəmbərlik)" },
          next_node: "terminal_prophetic",
          tags: ["prophetic", "ethics"],
        },
        {
          label: { en: "Study & interpretation (scholastic)", ru: "Изучение и толкование (сколастическая)", az: "Tədqiq və təfsir (skolastik)" },
          next_node: "terminal_scholastic",
          tags: ["scholastic", "study"],
        },
      ],
    },
  };

// ------------------------------------------------------------
// TERMINALS — the Definition Cards
// ------------------------------------------------------------
export const TERMINALS: Record<string, Terminal> = {
  terminal_secular_humanist: {
    node_id: "terminal_secular_humanist",
    title: { en: "The Secular Humanist", ru: "Светский гуманист", az: "Dünyəvi humanist" },
    blueprint: {
      en: "You hold that no higher power exists. Meaning is not discovered from above — it is authored by human reason, ethics, and community from below. You are the sovereign of your own values.",
      ru: "Вы считаете, что высшей силы не существует. Смысл не открывается свыше — он создаётся человеческим разумом, этикой и обществом снизу. Вы — суверен собственных ценностей.",
      az: "Siz hesab edirsiniz ki, ali güc mövcud deyil. Məna yuxarıdan kəşf edilmir — o, insan ağlı, etikası və cəmiyyəti tərəfindən aşağıdan yaradılır. Siz öz dəyərlərinizin suverenisiniz.",
    },
    social_proof: 4821,
    percent_of_users: 14,
    similar_minds: [
      { en: "Richard Dawkins", ru: "Ричард Докинз", az: "Riçard Dokins" },
      { en: "Bertrand Russell", ru: "Бертран Рассел", az: "Bertran Rassel" },
      { en: "Christopher Hitchens", ru: "Кристофер Хитченс", az: "Kristofer Hitçens" },
    ],
    tags: ["atheist"],
  },
  terminal_deist: {
    node_id: "terminal_deist",
    title: { en: "The Clockmaker Deist", ru: "Деист-часовщик", az: "Saat ustası deist" },
    blueprint: {
      en: "You believe God is Real, acting as an Impersonal designer who set the cosmos in motion and then left it to run by natural law — a watchmaker who does not wind the watch again.",
      ru: "Вы верите, что Бог Реален, действует как Безличный проектировщик, запустивший космос и оставивший его жить по естественным законам — часовщик, который больше не заводит часы.",
      az: "Siz inanırsınız ki, Tanrı Realdır, kosmosu hərəkətə gətirən və onu təbii qanunlarla idarə olunmağa qoyan Şəxssiz dizayner kimi fəaliyyət göstərir — saatı bir daha qurmayan saat ustası.",
    },
    social_proof: 893,
    percent_of_users: 9,
    similar_minds: [
      { en: "Voltaire", ru: "Вольтер", az: "Volter" },
      { en: "Thomas Jefferson", ru: "Томас Джефферсон", az: "Tomas Cefferson" },
      { en: "Isaac Newton", ru: "Исаак Ньютон", az: "İsaak Nyuton" },
    ],
    tags: ["deist"],
  },
  terminal_durkheimian: {
    node_id: "terminal_durkheimian",
    title: { en: "The Durkheimian Constructivist", ru: "Дюркгеймианский конструктивист", az: "Dürkheymçi konstruktivist" },
    blueprint: {
      en: "You believe God is Abstract — a social construct that is nonetheless real in its effects. 'God' is society's self-image projected upward: the sacred is whatever binds us together.",
      ru: "Вы верите, что Бог Абстрактен — социальный конструкт, однако реальный в своих последствиях. «Бог» — это самообраз общества, проецируемый вверх: священное — это то, что связывает нас.",
      az: "Siz inanırsınız ki, Tanrı Abstraktdır — sosial konstruksiyadır, lakin təsirlərində realdır. «Tanrı» cəmiyyətin yuxarıya proyeksiya edilmiş öz obrazıdır: müqəddəs bizi birləşdirən şeydir.",
    },
    social_proof: 342,
    percent_of_users: 3,
    similar_minds: [
      { en: "Émile Durkheim", ru: "Эмиль Дюркгейм", az: "Emil Dürkheym" },
      { en: "Robert Bellah", ru: "Роберт Белла", az: "Robert Bellah" },
    ],
    tags: ["durkheimian"],
  },
  terminal_jungian: {
    node_id: "terminal_jungian",
    title: { en: "The Jungian Constructivist", ru: "Юнгианский конструктивист", az: "Yunqçu konstruktivist" },
    blueprint: {
      en: "You believe God is Abstract — a universal archetype living in the collective unconscious. The divine image is the psyche's oldest symbol: not a being 'out there', but the Self encountering its own depth.",
      ru: "Вы верите, что Бог Абстрактен — универсальный архетип, живущий в коллективном бессознательном. Божественный образ — древнейший символ психики: не существо «там вовне», а Самость, встречающая собственную глубину.",
      az: "Siz inanırsınız ki, Tanrı Abstraktdır — kollektiv şüursuzluqda yaşayan universal arxetip. İlahi obraz psixikanın ən qədim simvoludur: «orada» olan varlıq deyil, öz dərinliyi ilə qarşılaşan Öz.",
    },
    social_proof: 1056,
    percent_of_users: 5,
    similar_minds: [
      { en: "Carl Jung", ru: "Карл Юнг", az: "Karl Yunq" },
      { en: "Joseph Campbell", ru: "Джозеф Кэмпбелл", az: "Cozef Kempbell" },
      { en: "Mircea Eliade", ru: "Мирча Элиаде", az: "Mirça Eliade" },
    ],
    tags: ["jungian"],
  },
  terminal_olympian: {
    node_id: "terminal_olympian",
    title: { en: "The Olympian Polytheist", ru: "Олимпийский политеист", az: "Olimpiyalı politeist" },
    blueprint: {
      en: "You believe gods are Real and Personal — many beings, each with will, emotion, and domain. The cosmos is a society of powers: war, love, craft, and fate, each worthy of its own reverence.",
      ru: "Вы верите, что боги Реальны и Личностны — множество существ, каждое со своей волей, эмоциями и сферой. Космос — это общество сил: войны, любви, ремесла и судьбы, каждая достойна своего почитания.",
      az: "Siz inanırsınız ki, tanrılar Real və Şəxsiyyətlidir — hər birinin iradəsi, duyğusu və sahəsi olan çoxlu varlıqlar. Kosmos güclər cəmiyyətidir: müharibə, sevgi, sənət və tale — hər biri öz ehtiramına layiqdir.",
    },
    social_proof: 517,
    percent_of_users: 4,
    similar_minds: [
      { en: "Homer", ru: "Гомер", az: "Homer" },
      { en: "Proclus", ru: "Прокл", az: "Prokl" },
    ],
    tags: ["polytheist"],
  },
  terminal_impersonal_polytheist: {
    node_id: "terminal_impersonal_polytheist",
    title: { en: "The Cosmic-Aspect Polytheist", ru: "Политеист космических аспектов", az: "Kosmik-aspekt politeisti" },
    blueprint: {
      en: "You believe the divine is Real yet Abstract — expressed as many impersonal forces: creation, preservation, destruction. The many gods are faces of one underlying cosmic process.",
      ru: "Вы верите, что божественное Реально, но Абстрактно — выражено как множество безличных сил: творение, сохранение, разрушение. Многие боги — лики единого космического процесса.",
      az: "Siz inanırsınız ki, ilahi Real, lakin Abstraktdır — çoxlu şəxssiz qüvvələr kimi ifadə olunur: yaradılış, qorunma, məhv. Çoxlu tanrılar vahid kosmik prosesin üzləridir.",
    },
    social_proof: 289,
    percent_of_users: 3,
    similar_minds: [
      { en: "The Upanishads", ru: "Упанишады", az: "Upanişadlar" },
      { en: "Rāmānuja", ru: "Рамануджа", az: "Ramanuca" },
    ],
    tags: ["polytheist"],
  },
  terminal_spinozan: {
    node_id: "terminal_spinozan",
    title: { en: "The Spinozan Pantheist", ru: "Спинозанский пантеист", az: "Spinozist panteist" },
    blueprint: {
      en: "You believe God is Real and Abstract — the single substance of the universe, identical with nature itself. Deus sive Natura: no separate being, only one infinite reality of which you are a mode.",
      ru: "Вы верите, что Бог Реален и Абстрактен — единая субстанция вселенной, тождественная самой природе. Deus sive Natura: нет отдельного существа, есть лишь одна бесконечная реальность, модусом которой вы являетесь.",
      az: "Siz inanırsınız ki, Tanrı Real və Abstraktdır — kainatın vahid substansiyası, təbiətin özü ilə eyni. Deus sive Natura: ayrıca varlıq yoxdur, yalnız bir sonsuz reallıq var və siz onun modususunuz.",
    },
    social_proof: 1328,
    percent_of_users: 11,
    similar_minds: [
      { en: "Baruch Spinoza", ru: "Бенедикт Спиноза", az: "Barux Spinoza" },
      { en: "Albert Einstein", ru: "Альберт Эйнштейн", az: "Albert Eynşteyn" },
      { en: "Giordano Bruno", ru: "Джордано Бруно", az: "Cordano Bruno" },
    ],
    tags: ["spinozism"],
  },
  terminal_hegelian: {
    node_id: "terminal_hegelian",
    title: { en: "The Hegelian Absolutist", ru: "Гегельянский абсолютист", az: "Hegelçi mütləqiyyətçi" },
    blueprint: {
      en: "You believe God is Abstract — the Absolute, an all-encompassing reason that unfolds dialectically through history. The divine is not a being above time but the very process of spirit coming to know itself.",
      ru: "Вы верите, что Бог Абстрактен — Абсолют, всеобъемлющий разум, развёртывающийся диалектически в истории. Божественное — не существо над временем, а сам процесс духа, познающего себя.",
      az: "Siz inanırsınız ki, Tanrı Abstraktdır — Mütləq, tarix boyu dialektik şəkildə açılan hər şeyi əhatə edən ağıl. İlahi zaman üstündəki varlıq deyil, özünü tanıyan ruhun prosesinin özüdür.",
    },
    social_proof: 447,
    percent_of_users: 4,
    similar_minds: [
      { en: "G.W.F. Hegel", ru: "Г.В.Ф. Гегель", az: "Q.V.F. Hegel" },
      { en: "F.W.J. Schelling", ru: "Ф.В.Й. Шеллинг", az: "F.V.Y. Şellinq" },
    ],
    tags: ["hegelianism"],
  },
  terminal_classical_theist: {
    node_id: "terminal_classical_theist",
    title: { en: "The Classical Theist (Thomistic)", ru: "Классический теист (томистский)", az: "Klassik teist (Toma variantı)" },
    blueprint: {
      en: "You believe God is Real and Abstract — pure actuality, the Prime Mover, the logical ground of all existence. God is not one more thing in the world but the reason anything exists at all.",
      ru: "Вы верите, что Бог Реален и Абстрактен — чистая актуальность, Перводвигатель, логическое основание всего бытия. Бог — не ещё одна вещь в мире, а причина того, что вообще что-либо существует.",
      az: "Siz inanırsınız ki, Tanrı Real və Abstraktdır — saf aktuallıq, İlk Hərəkətverən, bütün varlığın məntiqi əsası. Tanrı dünyada əlavə bir şey deyil, hər şeyin mövcud olmasının səbəbidir.",
    },
    social_proof: 1974,
    percent_of_users: 12,
    similar_minds: [
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Aristotle", ru: "Аристотель", az: "Aristotel" },
      { en: "Gottfried Leibniz", ru: "Готфрид Лейбниц", az: "Qotfrid Leybnits" },
    ],
    tags: ["classical_theism"],
  },
  terminal_mystical_theist: {
    node_id: "terminal_mystical_theist",
    title: { en: "The Mystical Theist", ru: "Мистический теист", az: "Mistik teist" },
    blueprint: {
      en: "You believe God is Real and Personal, yet encountered only in inner experience — not in creeds or history. The relationship is direct, wordless, and beyond doctrine.",
      ru: "Вы верите, что Бог Реален и Личностен, но встречается только во внутреннем опыте — не в догмах и не в истории. Отношения прямые, безмолвные и вне доктрины.",
      az: "Siz inanırsınız ki, Tanrı Real və Şəxsidir, lakin yalnız daxili təcrübədə qarşılanır — dini ehkam və tarixdə deyil. Münasibət birbaşa, sözsüz və doktrinadan kənardır.",
    },
    social_proof: 763,
    percent_of_users: 7,
    similar_minds: [
      { en: "Meister Eckhart", ru: "Мейстер Экхарт", az: "Meyster Exhart" },
      { en: "Rumi", ru: "Руми", az: "Rumi" },
      { en: "Teresa of Ávila", ru: "Тереза Авильская", az: "Avilalı Tereza" },
    ],
    tags: ["mystical"],
  },
  terminal_abrahamic: {
    node_id: "terminal_abrahamic",
    title: { en: "The Strict Monotheist", ru: "Строгий монотеист", az: "Sərt monoteist" },
    blueprint: {
      en: "You believe God is Real, One, and Personal — a single sovereign will who revealed himself through prophets. No partners, no Trinity: the absolute unity of the divine is non-negotiable.",
      ru: "Вы верите, что Бог Реален, Один и Личностен — единая суверенная воля, открывшая себя через пророков. Никаких сотоварищей, никакой Троицы: абсолютное единство божественного нерушимо.",
      az: "Siz inanırsınız ki, Tanrı Real, Bir və Şəxsidir — peyğəmbərlər vasitəsilə özünü göstərən vahid suveren iradə. Heç bir şərik, heç bir Üçlük yoxdur: ilahinin mütləq birliyi danışılmazdır.",
    },
    social_proof: 1103,
    percent_of_users: 10,
    similar_minds: [
      { en: "Maimonides", ru: "Маймонид", az: "Maymonid" },
      { en: "Averroes", ru: "Аверроэс", az: "Averroes" },
      { en: "Ibn Sina", ru: "Ибн Сина", az: "İbn Sina" },
    ],
    tags: ["abrahamic"],
  },
  terminal_protestant: {
    node_id: "terminal_protestant",
    title: { en: "The Evangelical Protestant", ru: "Евангельский протестант", az: "Evangelik protestant" },
    blueprint: {
      en: "You believe God is Real, Personal, and Interventionist — a triune God who revealed himself in scripture and acts in history. Salvation is by grace through faith alone; the Bible is your final authority.",
      ru: "Вы верите, что Бог Реален, Личностен и Вмешивающийся — троичный Бог, открывший себя в Писании и действующий в истории. Спасение — благодатью через одну лишь веру; Библия — ваш высший авторитет.",
      az: "Siz inanırsınız ki, Tanrı Real, Şəxsi və Müdaxilə edəndir — Müqəddəs Kitabda özünü göstərən və tarixdə fəaliyyət göstərən üçlük Tanrı. Xilas yalnız imanla lütf vasitəsilədir; Müqəddəs Kitab sizin ali səlahiyyətinizdir.",
    },
    social_proof: 2156,
    percent_of_users: 13,
    similar_minds: [
      { en: "Martin Luther", ru: "Мартин Лютер", az: "Martin Lüter" },
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "C.S. Lewis", ru: "К.С. Льюис", az: "K.S. Luis" },
    ],
    tags: ["protestant"],
  },
  terminal_orthodox: {
    node_id: "terminal_orthodox",
    title: { en: "The Orthodox Christian", ru: "Православный христианин", az: "Pravoslav xristian" },
    blueprint: {
      en: "You believe God is Real, Personal, and Interventionist — a triune God encountered as mystery. Salvation is theosis: union with the divine energies, handed down through the living tradition and the icons.",
      ru: "Вы верите, что Бог Реален, Личностен и Вмешивающийся — троичный Бог, встречаемый как тайна. Спасение — это теозис: соединение с божественными энергиями, передаваемое через живую традицию и иконы.",
      az: "Siz inanırsınız ki, Tanrı Real, Şəxsi və Müdaxilə edəndir — sirr kimi qarşılanan üçlük Tanrı. Xilas teozisdir: canlı ənənə və ikonalar vasitəsilə ötürülən ilahi enerjilərlə birləşmə.",
    },
    social_proof: 1688,
    percent_of_users: 11,
    similar_minds: [
      { en: "Gregory Palamas", ru: "Григорий Палама", az: "Qriqori Palama" },
      { en: "Maximus the Confessor", ru: "Максим Исповедник", az: "Maksim Etirafçı" },
      { en: "Dostoevsky", ru: "Достоевский", az: "Dostoyevski" },
    ],
    tags: ["orthodox"],
  },
  terminal_catholic: {
    node_id: "terminal_catholic",
    title: { en: "The Catholic Christian", ru: "Католический христианин", az: "Katolik xristian" },
    blueprint: {
      en: "You believe God is Real, Personal, and Interventionist — a triune God who works through church, sacrament, and reason. Faith and philosophy meet: Aquinas and the magisterium guide the way.",
      ru: "Вы верите, что Бог Реален, Личностен и Вмешивающийся — троичный Бог, действующий через церковь, таинства и разум. Вера и философия встречаются: Фома Аквинский и магистериум указывают путь.",
      az: "Siz inanırsınız ki, Tanrı Real, Şəxsi və Müdaxilə edəndir — kilsə, müqəddəs mərasimlər və ağıl vasitəsilə fəaliyyət göstərən üçlük Tanrı. İman və fəlsəfə görüşür: Toma Akvinalı və maqisterium yolu göstərir.",
    },
    social_proof: 2340,
    percent_of_users: 14,
    similar_minds: [
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Augustine", ru: "Августин", az: "Avqustin" },
      { en: "Blaise Pascal", ru: "Блез Паскаль", az: "Blez Paskal" },
    ],
    tags: ["catholic"],
  },

  // ============ NEW TERMINALS FOR ATTRIBUTE PHASE ============
  
  terminal_miracle_theist: {
    node_id: "terminal_miracle_theist",
    title: { en: "The Miracle Theist", ru: "Теист чудес", az: "Mucizə teisti" },
    blueprint: {
      en: "You believe God acts directly through supernatural miracles — suspending natural law to intervene. The world is not a closed system; divine power breaks through when needed. Faith expects the impossible.",
      ru: "Вы верите, что Бог действует напрямую через сверхъестественные чудеса — приостанавливая естественный закон, чтобы вмешаться. Мир — не закрытая система; божественная сила прорывается, когда это необходимо. Вера ждёт невозможного.",
      az: "Siz inanırsınız ki, Tanrı supra-tabii mucizələr vasitəsilə birbaşa fəaliyyət göstərir — təbii qanunu dayandırıb müdaxilə edir. Dünya bağlı sistem deyil; ilahi qüvvə lazım olduqda qırılıb çıxır. İman qeyri-mümkünü gözləyir.",
    },
    social_proof: 1240,
    percent_of_users: 8,
    similar_minds: [
      { en: "John Wimber", ru: "Джон Уимбер", az: "Con Uimber" },
      { en: "Craig Keener", ru: "Крейг Кинер", az: "Kreyn Kiyner" },
      { en: "Aimee Semple McPherson", ru: "Эйми Сemple Макфэрсон", az: "Eymi Sempıl Makferson" },
    ],
    tags: ["miraculous", "interventionist"],
  },
  terminal_providence_theist: {
    node_id: "terminal_providence_theist",
    title: { en: "The Providence Theist", ru: "Провиденциальный теист", az: "Prövidens teisti" },
    blueprint: {
      en: "You believe God governs all things through ordinary causality — natural law is God's customary way of working. Miracles are rare; providence is constant. Every event, however small, falls within divine governance.",
      ru: "Вы верите, что Бог управляет всем через обычную причинность — естественный закон — это обычный способ действия Бога. Чудеса редки; провидение постоянно. Каждое событие, как бы ничтожное оно ни было, попадает под божественное управление.",
      az: "Siz inanırsınız ki, Tanrı hər şeyi adi səbəbiyyət vasitəsilə idarə edir — təbii qanun Tanrı işləmə üsulu. Mucizələr nadirdir; prövidens davamlıdır. Həmin hadisə neçə də kicik olsa, ilahi idarəə daxildir.",
    },
    social_proof: 1560,
    percent_of_users: 10,
    similar_minds: [
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "Jonathan Edwards", ru: "Джонатан Эдвардс", az: "Conatan Edvards" },
      { en: "D.A. Carson", ru: "Д.А. Карсон", az: "D.A. Karson" },
    ],
    tags: ["providential", "interventionist"],
  },
  terminal_servant_theist: {
    node_id: "terminal_servant_theist",
    title: { en: "The Servant Theist", ru: "Служитель теист", az: "Xadim teisti" },
    blueprint: {
      en: "Your relationship with God is defined by worship, obedience, and submission. You are the servant; God is the Master. Duty, reverence, and fear of the Lord are the beginning of wisdom. 'Not my will, but yours be done.'",
      ru: "Ваши отношения с Богом определяются поклонением, послушанием и подчинением. Вы — слуга; Бог — Господь. Долг, благоговение и страх Господень — начало мудрости. «Не воля моя, а Твоя да будет».",
      az: "Sizin Tanrı ilə münasibətiniz ibadət, itaat və boyun eymə ilə müəyyən edilir. Siz qulusunuz; Tanrı Ustadır. Vəzifə, hürmət və Rabbi qorxmaq hikmətin başlanğıcıdır. «Mənim iradəm deyil, sənin iradən olsun».",
    },
    social_proof: 2100,
    percent_of_users: 12,
    similar_minds: [
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "Jonathan Edwards", ru: "Джонатан Эдвардс", az: "Conatan Edvards" },
      { en: "A.W. Tozer", ru: "Э.У. Тозер", az: "A.V. Tozer" },
    ],
    tags: ["servant", "worship"],
  },
  terminal_companion_theist: {
    node_id: "terminal_companion_theist",
    title: { en: "The Companion Theist", ru: "Товарищ-теист", az: "Rəfiq teisti" },
    blueprint: {
      en: "You relate to God as a friend and dialogue partner. Prayer is conversation, not petition. The divine walks beside you — intimate, accessible, responsive. 'I no longer call you servants... I call you friends.'",
      ru: "Вы относитесь к Богу как к другу и партнёру по диалогу. Молитва — это беседа, а не просьба. Божественное идёт рядом с вами — близкое, доступное, отзывчивое. «Я более не называю вас рабами... Я называю вас друзьями».",
      az: "Siz Tanrıya dost və dialoq tərəfi kimi baxırsınız. Dua söhbətdir, deyil ərizə. İlahi yanınızdan keçir — dəri, müsait, cavabdeh. «Artıq sizi qullar deyil... Sizi dostlar adlandırıram».",
    },
    social_proof: 890,
    percent_of_users: 6,
    similar_minds: [
      { en: "C.S. Lewis", ru: "К.С. Льюис", az: "K.S. Luis" },
      { en: "Brennan Manning", ru: "Бреннан Маннинг", az: "Brennan Manninq" },
      { en: "Philip Yancey", ru: "Филип Янси", az: "Filip Yansı" },
    ],
    tags: ["companion", "dialogue"],
  },
  terminal_union_mystic: {
    node_id: "terminal_union_mystic",
    title: { en: "The Union Mystic", ru: "Мистик соединения", az: "Birləşmə mistiki" },
    blueprint: {
      en: "The goal of your spiritual life is union with God — not merely relationship, but participation in the divine nature. The boundary between self and God dissolves in love. 'God became man that man might become God.'",
      ru: "Цель вашей духовной жизни — соединение с Богом — не просто отношения, а участие в божественной природе. Грань между собой и Богом растворяется в любви. «Бог стал человеком, чтобы человек стал Богом».",
      az: "Sizin mənəvi həyatınızın məqsədi Tanrı ilə birləşmədır — sadəcə münasibət deyil, ilahi xassiyyətdə iştirak. Öz və Tanrı arası hədd sevgidə həll olur. «Tanrı insan oldu ki, insan Tanrı ola bilsin».",
    },
    social_proof: 680,
    percent_of_users: 5,
    similar_minds: [
      { en: "Meister Eckhart", ru: "Мейстер Экхарт", az: "Meyster Exhart" },
      { en: "St. John of the Cross", ru: "Иоанн Крестовый", az: "Yohanan Krestovi" },
      { en: "Symeon the New Theologian", ru: "Симеон Новый Богослов", az: "Simeon Yeni İlahi" },
    ],
    tags: ["mystical", "union"],
  },
  terminal_rationalist_theist: {
    node_id: "terminal_rationalist_theist",
    title: { en: "The Rationalist Theist", ru: "Рационалист-теист", az: "Rasionalist teisti" },
    blueprint: {
      en: "God is known through reason and philosophical argument. The cosmological, teleological, and ontological proofs demonstrate God's existence. Faith is not blind; it is rational assent to demonstrated truth. Philosophy is the handmaiden of theology.",
      ru: "Бог познаётся через разум и философские аргументы. Космологические, телеологические и онтологические доказательства показывают существование Бога. Вера не слепа; это разумное согласие с доказанной истиной. Философия — служанка теологии.",
      az: "Tanrı ağıll və fəlsəfi аргументlər vasitəsilə bilinir. Kosmologik, teleologik və ontologik isbatlar Tanrının mövcudluğunu göstərir. İman kör deyil; o, isbat edilmiş həqiqətə rasional razılıqdır. Fəlsəfə teologiyanın xidmətçisidir.",
    },
    social_proof: 720,
    percent_of_users: 5,
    similar_minds: [
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Gottfried Leibniz", ru: "Готфрид Лейбниц", az: "Qotfrid Leybnits" },
      { en: "William Lane Craig", ru: "Уильям Лэйн Крейг", az: "Uilyam Leyn Kreq" },
    ],
    tags: ["rationalist", "intellectual"],
  },
  terminal_fideist_theist: {
    node_id: "terminal_fideist_theist",
    title: { en: "The Fideist Theist", ru: "Фидейст-теист", az: "Fideist teisti" },
    blueprint: {
      en: "God is known through revelation and scripture alone — reason cannot reach the divine. Faith is a leap beyond evidence; it is trust in God's self-disclosure. 'Credo quia absurdum' — I believe because it is absurd (to reason).",
      ru: "Бог познаётся только через откровение и Писание — разум не может достичь божественного. Вера — это прыжок за пределы доказательств; это доверие к самозаявлению Бога. «Credo quia absurdum» — верую, ибо абсурдно (для разума).",
      az: "Tanrı yalnız ilham və kitab vasitəsilə bilinir — ağıll ilahiyə çat bilməz. İman dəllillərin ötesinə atılan zıplamaqdır; o, Tanrının özünü açmasıdır. «Credo quia absurdum» — inanıram, çünki bu (ağıll üçün) absurddur.",
    },
    social_proof: 540,
    percent_of_users: 4,
    similar_minds: [
      { en: "Søren Kierkegaard", ru: "Сёрен Кьеркегор", az: "Søren Kyerkeqor" },
      { en: "Karl Barth", ru: "Карл Барт", az: "Karl Bart" },
      { en: "Tertullian", ru: "Тертуллиан", az: "Tertullian" },
    ],
    tags: ["fideist", "revelation"],
  },
  terminal_experiential_theist: {
    node_id: "terminal_experiential_theist",
    title: { en: "The Experiential Theist", ru: "Эксперенциальный теист", az: "Eksperensial teisti" },
    blueprint: {
      en: "God is known through direct experience and intuition — not arguments or texts. The heart has reasons reason knows nothing of. Religious experience is self-authenticating; you know because you have encountered.",
      ru: "Бог познаётся через прямой опыт и интуицию — не через аргументы и тексты. Сердце имеет причины, которых не знает разум. Религиозный опыт самоудостаивающийся; вы знаете, потому что встречали.",
      az: "Tanrı birbaşa təcrübə və sezi vasitəsilə bilinir — аргуmentlər və matnlar deyil. Ürəyin səbəbləri var ki, ağıll onları bilmir. Dini təcrübə özünü özü isbat edir; siz bilirsiniz, çünki siz qarşılaşmışsınız.",
    },
    social_proof: 980,
    percent_of_users: 7,
    similar_minds: [
      { en: "Jonathan Edwards", ru: "Джонатан Эдвардс", az: "Conatan Edvards" },
      { en: "William James", ru: "Уильям Джеймс", az: "Uilyam Çeyms" },
      { en: "Alvin Plantinga", ru: "Элвин Плантинга", az: "Alvin Plantinqa" },
    ],
    tags: ["experiential", "intuition"],
  },
  terminal_free_will_theist: {
    node_id: "terminal_free_will_theist",
    title: { en: "The Free Will Theist", ru: "Теист свободы воли", az: "Azad iradə teisti" },
    blueprint: {
      en: "Evil exists because God values free will more than a world without suffering. Genuine love requires genuine choice; God permits evil so that love can be real. The cross is God's answer to suffering — not prevention, but participation.",
      ru: "Зло существует, потому что Бог ценит свободу воли выше мира без страданий. Настоящая любовь требует настоящего выбора; Бог допускает зло, чтобы любовь могла быть реальной. Крест — это ответ Бога на страдание — не предотвращение, а участие.",
      az: "Xeyr mövcuddursa, çünki Tanrı azad iradəyi dünyadan dəyərli hesab edir. Həqiqi sevgi həqiqi seçim tələb edir; Tanrı xeyri icazə verir ki, sevgi real ola bilsin. Qrest xeyrin cavabıdır — qarşısını almaq deyil, iştirak.",
    },
    social_proof: 1890,
    percent_of_users: 11,
    similar_minds: [
      { en: "Alvin Plantinga", ru: "Элвин Плантинга", az: "Alvin Plantinqa" },
      { en: "C.S. Lewis", ru: "К.С. Льюис", az: "K.S. Luis" },
      { en: "Richard Swinburne", ru: "Ричард Свинберн", az: "Riçard Svimburn" },
    ],
    tags: ["free_will", "theodicy"],
  },
  terminal_soul_making_theist: {
    node_id: "terminal_soul_making_theist",
    title: { en: "The Soul-Making Theist", ru: "Теист формирования души", az: "Ruh formalaşdıran teisti" },
    blueprint: {
      en: "Suffering is not a flaw in creation but its purpose — the forge where character is shaped. God allows pain so virtues like courage, compassion, and endurance can exist. This world is a 'vale of soul-making,' not a playground.",
      ru: "Страдание — не изъян творения, а его цель — горнило, где формируется характер. Бог допускает боль, чтобы могли существовать такие добродетели, как мужество, сострадание и терпение. Этот мир — «долина формирования души», а не игровая площадка.",
      az: "Səbr yaradılışda səhv deyil, hədifdir — xassiyyət formalaşan qaynağ. Tanrı ağrıya icazə verir ki, cəsarət, şəføqət və çətinlik kimi siftyarlar mövcud ola bilsin. Bu dünya «ruh formalaşdırıcı vadisidir», oyun meydanı deyil.",
    },
    social_proof: 1120,
    percent_of_users: 8,
    similar_minds: [
      { en: "John Hick", ru: "Джон Хик", az: "Con Hık" },
      { en: "Irenaeus", ru: "Иренай Лионский", az: "İrenay Lionski" },
      { en: "Marilyn McCord Adams", ru: "Мэрилин Маккорд Адамс", az: "Merilin Makkord Adams" },
    ],
    tags: ["soul_making", "theodicy"],
  },
  terminal_mystery_theist: {
    node_id: "terminal_mystery_theist",
    title: { en: "The Mystery Theist", ru: "Теист тайны", az: "Sirr teisti" },
    blueprint: {
      en: "We cannot comprehend God's reasons for allowing evil — our minds are too finite. The gap between divine wisdom and human understanding is unbridgeable. Trust is not understanding; it is resting in the character of God despite the darkness.",
      ru: "Мы не можем постичь причины Бога, допускающего зло — наши умы слишком ограничены. Бездна между божественной мудростью и человеческим пониманием непреодолима. Доверие — это не понимание; это покой в характере Бога вопреки тьме.",
      az: "Biz Tanrının xeyrə icazə verməsinin səbəblərini başa düşə bilməyirik — ağıllarımız çox məhduddur. İlahi hikmət və insan başa düşməsi arası boşluq qapala bilməz. Etimad başa düşmə deyil, qaranlıqdan asılı olmayaraq Tanrının xassiyyətində sakinləşmədür.",
    },
    social_proof: 1340,
    percent_of_users: 9,
    similar_minds: [
      { en: "D.A. Carson", ru: "Д.А. Карсон", az: "D.A. Karson" },
      { en: "John Piper", ru: "Джон Пайпер", az: "Con Payper" },
      { en: "Elisabeth Elliot", ru: "Элизабет Эллиот", az: "Elizabet Elliot" },
    ],
    tags: ["mystery", "theodicy"],
  },
  terminal_process_theist: {
    node_id: "terminal_process_theist",
    title: { en: "The Process Theist", ru: "Процессуальный теист", az: "Proses teisti" },
    blueprint: {
      en: "God is not all-powerful in the classical sense — God persuades but cannot coerce. The world has genuine freedom; God works with what is given, luring creation toward the good. Evil exists because God cannot unilaterally prevent it. God suffers with us.",
      ru: "Бог не всесилен в классическом смысле — Бог увещевает, но не может принуждать. Мир имеет истинную свободу; Бог работает с тем, что дано, притягивая творение к благу. Зло существует, потому что Бог не может односторонне его предотвратить. Бог страдает с нами.",
      az: "Tanrı klassik mənada həsibə-qüdrətli deyil — Tanrı ikna edir, lakin məcbur edə bilməz. Dünya həqiqi azadlığa malikdir; Tanrı verilmişlə işləyir, yaradılışı xeyr side cəlb edir. Xeyr mövcuddursa, çünki Tanrı onu birtərəfli qarşı ala bilməz. Tanrı bizimlə səbr edir.",
    },
    social_proof: 420,
    percent_of_users: 3,
    similar_minds: [
      { en: "Alfred North Whitehead", ru: "Альфред Норт Уайтхед", az: "Alfred Nort Uaythed" },
      { en: "Charles Hartshorne", ru: "Чарльз Хартшорн", az: "Çarlz Hartşorn" },
      { en: "John B. Cobb", ru: "Джон Б. Кобб", az: "Con B. Kob" },
    ],
    tags: ["process", "limited_power"],
  },
  terminal_eternal_destiny: {
    node_id: "terminal_eternal_destiny",
    title: { en: "The Eternal Destiny Theist", ru: "Теист вечного назначения", az: "Ebedi məsuliyyət teisti" },
    blueprint: {
      en: "Death leads to final judgment — heaven or hell, eternal conscious existence. Choices in this life determine an irreversible eternal state. The stakes are infinite; urgency defines the spiritual life. 'It is appointed for man to die once, and after that comes judgment.'",
      ru: "Смерть ведёт к окончательному суду — рай или ад, вечное сознательное существование. Выборы в этой жизни определяют необратимое вечное состояние. Ставки бесконечны; срочность определяет духовную жизнь. «Определено человекам умереть однажды, а после этого — суд».",
      az: "Ölüm son hükumata aparır — cənnət və ya cəhənnəm, ebedi şüurlu mövcudiyyət. Bu həyatdaki seçimlər qayıtarmaz ebedi vəziyyəti müəyyən edir. Mərclər Sonsuzdur; təhlükəsizlik mənəvi həyatı müəyyən edir. «İnsanlara bir dəfə ölmək yazılıb, sonra da hükumət gəlir».",
    },
    social_proof: 2450,
    percent_of_users: 14,
    similar_minds: [
      { en: "Jonathan Edwards", ru: "Джонатан Эдвардс", az: "Conatan Edvards" },
      { en: "Dante Alighieri", ru: "Данте Алигьери", az: "Dante Aliqyeri" },
      { en: "C.S. Lewis", ru: "К.С. Льюис", az: "K.S. Luis" },
    ],
    tags: ["eternal", "judgment"],
  },
  terminal_reincarnation: {
    node_id: "terminal_reincarnation",
    title: { en: "The Reincarnation Theist", ru: "Теист реинкарнации", az: "Reinkarnasiya teisti" },
    blueprint: {
      en: "Death is a transition, not an end — consciousness continues through cycles of rebirth. Karma shapes each incarnation; the soul learns across lifetimes. Liberation (moksha/nirvana) comes when all karma is resolved. You have lived before; you will live again.",
      ru: "Смерть — это переход, а не конец — сознание продолжается через циклы перерождений. Карма формирует каждое воплощение; душа учится через жизни. Освобождение (мокша/нирвана) наступает, когда вся карма исчерпана. Вы жили раньше; вы будете жить снова.",
      az: "Ölüm son deyil, keçiddir — şüur yenidən anma dövrləri ilə davam edir. Karma hər avatarı formalaşdırır; ruh ömürlər Boyu öyrənir. Azadlıq (mokşa/nirvana) həmə karma hall edildikdə gəlir. Siz əvvəl yaşayıbsınız; yenidən yaşayacaqsınız.",
    },
    social_proof: 1560,
    percent_of_users: 10,
    similar_minds: [
      { en: "The Upanishads", ru: "Упанишады", az: "Upanişadlar" },
      { en: "Bhagavad Gita", ru: "Бхагавад-гита", az: "Bhəqəvəd Qita" },
      { en: "Alan Watts", ru: "Алан Уоттс", az: "Alan Vots" },
    ],
    tags: ["reincarnation", "cycle"],
  },
  terminal_annihilation: {
    node_id: "terminal_annihilation",
    title: { en: "The Annihilationist", ru: "Аннигиляционист", az: "Anniqilyasionist" },
    blueprint: {
      en: "Consciousness ends at death — no afterlife, no judgment, no continuation. The universe is indifferent; meaning is created in this life only. This view may come from materialism or conditional immortality. 'Dust to dust.' Make this life count.",
      ru: "Сознание прекращается при смерти — никакой загробной жизни, суда, продолжения. Вселенная равнодушна; смысл создаётся только в этой жизни. Этот взгляд может исходить из материализма или условного бессмертия. «Прах в прах». Сделайте эту жизнь значимой.",
      az: "Şüur ölümə çətir — sonrakı həyat yoxdur, hükumət yoxdur, davam yoxdur. Kainat kifayətsizdir; məna yalnız bu həyatda yaradılır. Bu baxış materializm və ya şərtli bədiiyyətdən gəlir. «Toz toza qayıdır». Bu həyatı dəyərli edin.",
    },
    social_proof: 890,
    percent_of_users: 6,
    similar_minds: [
      { en: "Epicurus", ru: "Эпикур", az: "Epikur" },
      { en: "Lucretius", ru: "Лукреций", az: "Lukretsi" },
      { en: "Sam Harris", ru: "Сэм Харрис", az: "Sem Harrıs" },
    ],
    tags: ["annihilation", "materialist"],
  },
  terminal_universalism: {
    node_id: "terminal_universalism",
    title: { en: "The Universalist", ru: "Универсалист", az: "Universalist" },
    blueprint: {
      en: "All will ultimately be reconciled to God — no eternal hell, no final exclusion. Divine love is inexhaustible; justice serves mercy. Even the worst sinners will, in the end, be transformed by grace. 'God will be all in all.'",
      ru: "Все в конечном итоге примирятся с Богом — никакого вечного ада, никакого окончательного исключения. Божественная любовь неистощима; справедливость служит милости. Даже самые тяжкие грешники в конце будут преобразованы благодатью. «Бог будет во всём всем».",
      az: "Hər kəs o çörək Tanrı ilə sullahacaq — ebedi cəhənnəm yoxdur, son istisna yoxdur. İlahi sevgi sonsuzdur; ədalət məhəbbətə xidmət edir. Hətta ən pis günahkarlar da axırıncı axırda lütflə dönüşəcək. «Tanrı hər şeydə hər şey olacaq».",
    },
    social_proof: 670,
    percent_of_users: 5,
    similar_minds: [
      { en: "Origen", ru: "Ориген", az: "Origen" },
      { en: "Gregory of Nyssa", ru: "Григорий Нисский", az: "Qriqori Nissı" },
      { en: "George MacDonald", ru: "Джордж Макдональд", az: "Corc Makdonald" },
    ],
    tags: ["universalism", "inclusivist"],
  },
  terminal_sacramental: {
    node_id: "terminal_sacramental",
    title: { en: "The Sacramental Theist", ru: "Сакраментальный теист", az: "Sakramental teisti" },
    blueprint: {
      en: "God meets you in material signs — water, bread, wine, oil, laying on of hands. Grace is mediated through tangible rites. The physical world bears the divine; matter matters. Liturgy is the primary language of faith.",
      ru: "Бог встречает вас в материальных знаках — вода, хлеб, вино, масло, наложение рук. Благодать посредствуется через осязаемые риты. Физический мир несёт божественное; материя имеет значение. Литургия — главный язык веры.",
      az: "Tanrı sizi maddi işarələrlə qarşılaşır — su, çörək, şərab, yağ, əl qoynma. Lütf tokunur rituallar vasitəsilə keçirilir. Maddi dünya ilahiyi daşıyır; maddə vacibdir. Liquriya imanın əsas dilidir.",
    },
    social_proof: 1780,
    percent_of_users: 11,
    similar_minds: [
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Alexander Schmemann", ru: "Александр Шмеман", az: "Aleksandr Şmeman" },
      { en: "Louis Bouyer", ru: "Луи Буайе", az: "Luis Buaye" },
    ],
    tags: ["sacramental", "ritual"],
  },
  terminal_contemplative: {
    node_id: "terminal_contemplative",
    title: { en: "The Contemplative Theist", ru: "Контемплятивный теист", az: "Konteqlaтив teisti" },
    blueprint: {
      en: "The path to God is silence, stillness, and meditative attention. Words fall away; presence remains. Contemplative prayer seeks union beyond concepts. The cloud of unknowing conceals God — and reveals God. 'Be still, and know that I am God.'",
      ru: "Путь к Богу — в тишине, неподвижности и медитативном внимании. Слова отпадают; присутствие остаётся. Контемплятивная молитва ищет соединение за пределами понятий. Тучка незнания скрывает Бога — и открывает Бога. «Престаньте и познайте, что Я — Бог».",
      az: "Tanrıya yol sükut, sakinlik və meditativ diqqətdir. Sözlər düşür; mövcudluq qalır. Konteqlaтив dua anlayışların ötesində birleşmə axtarır. Bilməmə bülbüyi Tanrıyı qaplayır — və açar. «Sakin ol, mən Tanrı olduğunu bil».",
    },
    social_proof: 940,
    percent_of_users: 7,
    similar_minds: [
      { en: "Thomas Merton", ru: "Томас Мертон", az: "Tomas Merton" },
      { en: "John of the Cross", ru: "Иоанн Крестовый", az: "Yohanan Krestovi" },
      { en: "Teresa of Ávila", ru: "Тереза Авильская", az: "Avilalı Tereza" },
    ],
    tags: ["contemplative", "meditation"],
  },
  terminal_prophetic: {
    node_id: "terminal_prophetic",
    title: { en: "The Prophetic Theist", ru: "Пророческий теист", az: "Peyğəmbərlik teisti" },
    blueprint: {
      en: "True religion is justice, mercy, and humility — not ritual alone. God's heart beats for the oppressed, the poor, the stranger. Faith without works is dead. The prophetic voice calls power to account. 'Let justice roll down like waters.'",
      ru: "Истинная религия — это справедливость, милосердие и смирение — не только ритуал. Сердце Бога бьётся за угнетённых, бедных, чужаков. Вера без дел мертва. Пророческий голос зовёт власть к отчёту. «Да течёт правда, как вода».",
      az: "Həqiqi din ədalət, məhəbbət və alçalıqdır — yalnız ritual deyil. Tanrının ürəyibi məzlumin, fakirin, qayıbı üçün atır. İnsansız iman ölüdür. Peyğəmbərlik səsi iktidarı hesaba çağırır. «Ədalət su kimi axınsun».",
    },
    social_proof: 1230,
    percent_of_users: 9,
    similar_minds: [
      { en: "Martin Luther King Jr.", ru: "Мартин Лютер Кинг-младший", az: "Martin Lüter Kinç-ci" },
      { en: "Dorothy Day", ru: "Дороти Дэй", az: "Doroti Dey" },
      { en: "Abraham Joshua Heschel", ru: "Авраам Иошуа Гешел", az: "İbrahim Yoşua Heşel" },
    ],
    tags: ["prophetic", "ethics"],
  },
  terminal_scholastic: {
    node_id: "terminal_scholastic",
    title: { en: "The Scholastic Theist", ru: "Сколастический теист", az: "Skolastik teisti" },
    blueprint: {
      en: "Knowledge of God grows through study, disputation, and systematic theology. Faith seeks understanding (fides quaerens intellectum). The tradition is a treasury to be mined, not a museum piece. Precise distinctions clarify the mystery; they do not diminish it.",
      ru: "Познание Бога растёт через изучение, диспуты и системную теологию. Вера ищет понимание (fides quaerens intellectum). Традиция — это сокровищница, которую нужно разработка, а не музейный экспонат. Точные различия проясняют тайну; они не умаляют её.",
      az: "Tanrı bilikliyi tədqiq, mübahisə və sistemli teologiya ilə artır. İman anlayış axtarır (fides quaerens intellectum). Ənənə kəşf ediləcək xəzinedir, muzey nümayişi deyil. Dəqiq fərqlər sirri aydınlaşdırır; onlar onu zəifləndirmir.",
    },
    social_proof: 760,
    percent_of_users: 5,
    similar_minds: [
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Duns Scotus", ru: "Дунс Скот", az: "Duns Skot" },
      { en: "William of Ockham", ru: "Гуillaume Оккам", az: "Uilyam Okkam" },
    ],
    tags: ["scholastic", "study"],
  },
};

// ------------------------------------------------------------
// GRAPH HELPERS
// ------------------------------------------------------------

/** Terminal ids for quick checks */
export const TERMINAL_IDS = new Set(Object.keys(TERMINALS));

export function isTerminal(nodeId: string): boolean {
  return TERMINAL_IDS.has(nodeId);
}

export function getNode(nodeId: string): Node {
  const n = NODES[nodeId];
  if (!n) throw new Error(`Unknown node: ${nodeId}`);
  return n;
}

export function getTerminal(nodeId: string): Terminal {
  const t = TERMINALS[nodeId];
  if (!t) throw new Error(`Unknown terminal: ${nodeId}`);
  return t;
}

/** Max depth (in answer steps) reachable from a node — for the progress bar */
export function maxDepthFrom(nodeId: string, memo: Map<string, number> = new Map()): number {
  if (memo.has(nodeId)) return memo.get(nodeId)!;
  if (isTerminal(nodeId)) return 0;
  const node = getNode(nodeId);
  const depth = 1 + Math.max(...node.options.map((o) => maxDepthFrom(o.next_node, memo)));
  memo.set(nodeId, depth);
  return depth;
}

/** The DAG as a flat edge list for React Flow */
export function buildEdges(): { source: string; target: string }[] {
  const edges: { source: string; target: string }[] = [];
  for (const node of Object.values(NODES)) {
    for (const opt of node.options) {
      edges.push({ source: node.node_id, target: opt.next_node });
    }
  }
  return edges;
}
