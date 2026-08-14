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
  /** Reputable online references for further reading */
  references?: Reference[];
}

export interface Reference {
  title: LocalizedText;
  url: string;
  type: "wikipedia" | "sep" | "official" | "academic" | "other";
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
        next_node: "historical_revelation",
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
        next_node: "hindu_tradition",
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
        next_node: "christian_major_branch",
        tags: ["trinitarian", "christian"],
      },
      {
        label: { en: "No — strictly one (Judaism/Islam)", ru: "Нет — строго один (иудаизм/ислам)", az: "Xeyr — ciddi şəkildə bir (Yəhudilik/İslam)" },
        next_node: "abrahamic_unitarian_branch",
        tags: ["monotheist", "abrahamic"],
      },
    ],
  },

  // ============ CHRISTIANITY DEEP DIVE ============
  christian_major_branch: {
    node_id: "christian_major_branch",
    question: {
      en: "Which major Christian communion?",
      ru: "Какое главное христианское общение?",
      az: "Hansı böyük xristian ittifaqı?",
    },
    hint: {
      en: "The three ancient patriarchates + Reformation.",
      ru: "Три древних патриархата + Реформация.",
      az: "Üç qədim patriarxat + Reformasiya.",
    },
    options: [
      {
        label: { en: "Roman Catholic (Papal authority)", ru: "Римско-католическая (папская власть)", az: "Roma Katolik (Papal hakimiyyəti)" },
        next_node: "catholic_rites",
        tags: ["catholic", "christian"],
      },
      {
        label: { en: "Eastern Orthodox (Autocephalous churches)", ru: "Восточно-православная (автокефальные церкви)", az: "Şərqi Pravoslav (Avtokefal kilsələr)" },
        next_node: "orthodox_jurisdiction",
        tags: ["orthodox", "christian"],
      },
      {
        label: { en: "Oriental Orthodox (Non-Chalcedonian)", ru: "Древневосточная православная (нехалкидонская)", az: "Qədim Şərqi Pravoslav (Non-Xalqedon)" },
        next_node: "oriental_orthodox_church",
        tags: ["oriental_orthodox", "christian"],
      },
      {
        label: { en: "Protestant / Evangelical (Reformation heritage)", ru: "Протестантская / Евангельская (наследие Реформации)", az: "Protestant / Evangelik (Reformasiya irsi)" },
        next_node: "protestant_tradition",
        tags: ["protestant", "christian"],
      },
      {
        label: { en: "Restorationist / Other (LDS, JW, etc.)", ru: "Реставрационистские / Другие (СПД, СИ и др.)", az: "Restavrasionist / Digər (LDS, JW və s.)" },
        next_node: "restorationist_branch",
        tags: ["restorationist", "christian"],
      },
    ],
  },

  // ---- Catholic Rites & Orders ----
  catholic_rites: {
    node_id: "catholic_rites",
    question: {
      en: "Which Catholic rite or spiritual family?",
      ru: "Какой католический обряд или духовная семья?",
      az: "Hansı katolik ayini və ya mənəvi ailə?",
    },
    options: [
      {
        label: { en: "Latin (Roman) Rite — mainstream Western", ru: "Латинский (римский) обряд — основное западное", az: "Latın (Roma) ayini — əsas qərb" },
        next_node: "catholic_latin_spirituality",
        tags: ["latin_rite", "catholic"],
      },
      {
        label: { en: "Eastern Catholic Churches — Eastern liturgy, papal communion", ru: "Восточно-католические церкви — восточная литургия, общение с папой", az: "Şərqi Katolik Kilsələri — şərq liturgiyası, papa ilə birlik" },
        next_node: "eastern_catholic_church",
        tags: ["eastern_catholic", "catholic"],
      },
      {
        label: { en: "Religious Orders (Jesuit, Franciscan, Dominican, etc.)", ru: "Монашеские ордена (иезуиты, францисканцы, доминиканцы и др.)", az: "Dini ordenlər (İezuit, Fransiskan, Dominikan və s.)" },
        next_node: "catholic_religious_order",
        tags: ["religious_order", "catholic"],
      },
    ],
  },

  catholic_latin_spirituality: {
    node_id: "catholic_latin_spirituality",
    question: {
      en: "Which spiritual tradition within the Latin Rite?",
      ru: "Какая духовная традиция в латинском обряде?",
      az: "Latın ayinində hansı mənəvi ənənə?",
    },
    options: [
      {
        label: { en: "Thomistic / Scholastic (Aquinas, reason & faith)", ru: "Фомистская / Схоластическая (Аквинат, разум и вера)", az: "Tomist / Sxolastik (Akvinalı, ağıl və iman)" },
        next_node: "terminal_catholic_scholastic",
        tags: ["scholastic", "catholic"],
      },
      {
        label: { en: "Augustinian / Mystical (interior prayer, grace)", ru: "Августинская / Мистическая (внутренняя молитва, благодать)", az: "Avqustin / Mistik (daxili dua, lütf)" },
        next_node: "terminal_catholic_mystical",
        tags: ["mystical", "catholic"],
      },
      {
        label: { en: "Charismatic Renewal (Holy Spirit gifts, praise)", ru: "Харизматическое обновление (дары Святого Духа, хвала)", az: "Xarizmatik Yenilənmə (Müqəddəs Ruh hədiyyələri, həmd)" },
        next_node: "terminal_catholic_charismatic",
        tags: ["charismatic", "catholic"],
      },
      {
        label: { en: "Traditionalist / Tridentine Mass (pre-Vatican II)", ru: "Традиционалистская / Тридентская месса (до Второго Ватикана)", az: "Tradisionalist / Trident Missası (II Vatikandan əvvəl)" },
        next_node: "terminal_catholic_traditionalist",
        tags: ["traditionalist", "catholic"],
      },
      {
        label: { en: "Liberation Theology (option for the poor)", ru: "Теология освобождения (преференция бедным)", az: "Azadlıq Teologiyası (kasıblara üstünlük)" },
        next_node: "terminal_catholic_liberation",
        tags: ["liberation", "catholic"],
      },
    ],
  },

  eastern_catholic_church: {
    node_id: "eastern_catholic_church",
    question: {
      en: "Which Eastern Catholic Church?",
      ru: "Какая восточно-католическая церковь?",
      az: "Hansı Şərqi Katolik Kilsəsi?",
    },
    options: [
      {
        label: { en: "Maronite (Lebanon, Antiochene rite)", ru: "Маронитская (Ливан, антиохийский обряд)", az: "Maronit (Livan, Antioxiya ayini)" },
        next_node: "terminal_catholic_maronite",
        tags: ["maronite", "catholic"],
      },
      {
        label: { en: "Melkite Greek Catholic (Byzantine rite)", ru: "Мелькитская греко-католическая (византийский обряд)", az: "Melkit Yunan-Katolik (Bizans ayini)" },
        next_node: "terminal_catholic_melkite",
        tags: ["melkite", "catholic"],
      },
      {
        label: { en: "Ukrainian Greek Catholic (largest Eastern Catholic)", ru: "Украинская греко-католическая (крупнейшая восточно-католическая)", az: "Ukrayna Yunan-Katolik (ən böyük Şərqi Katolik)" },
        next_node: "terminal_catholic_ukrainian",
        tags: ["ukrainian_catholic", "catholic"],
      },
      {
        label: { en: "Chaldean Catholic (Iraq, East Syriac rite)", ru: "Халдейская католическая (Ирак, восточно-сирийский обряд)", az: "Xaldey Katolik (İraq, Şərqi Suriya ayini)" },
        next_node: "terminal_catholic_chaldean",
        tags: ["chaldean", "catholic"],
      },
      {
        label: { en: "Syro-Malabar / Syro-Malankara (India)", ru: "Сиро-малабарская / Сиро-маланкарская (Индия)", az: "Siro-Malabar / Siro-Malankara (Hindistan)" },
        next_node: "terminal_catholic_syro",
        tags: ["syro_malabar", "catholic"],
      },
      {
        label: { en: "Other Eastern Catholic (Coptic, Armenian, Romanian, etc.)", ru: "Другие восточно-католические (коптская, армянская, румынская и др.)", az: "Digər Şərqi Katolik (Kopt, Erməni, Rumın və s.)" },
        next_node: "terminal_catholic_other_eastern",
        tags: ["other_eastern_catholic", "catholic"],
      },
    ],
  },

  catholic_religious_order: {
    node_id: "catholic_religious_order",
    question: {
      en: "Which religious order spirituality?",
      ru: "Духовность какого монашеского ордена?",
      az: "Hansı dini ordenin mənəviyyatı?",
    },
    options: [
      {
        label: { en: "Jesuit (Ignatian spirituality, discernment, education)", ru: "Иезуитская (игнатианская духовность, различение, образование)", az: "İezuit (İqnati mənəviyyatı, ayırdetmə, təhsil)" },
        next_node: "terminal_catholic_jesuit",
        tags: ["jesuit", "catholic"],
      },
      {
        label: { en: "Franciscan (poverty, nature, Christ-centered)", ru: "Францисканская (бедность, природа, христоцентричность)", az: "Fransiskan (yoxsulluq, təbiət, Məsih-mərkəzli)" },
        next_node: "terminal_catholic_franciscan",
        tags: ["franciscan", "catholic"],
      },
      {
        label: { en: "Dominican (veritas, preaching, study)", ru: "Доминиканская (истина, проповедь, изучение)", az: "Dominikan (həqiqət, təbliğ, tədqiqat)" },
        next_node: "terminal_catholic_dominican",
        tags: ["dominican", "catholic"],
      },
      {
        label: { en: "Carmelite (contemplative: Teresa of Ávila, John of the Cross)", ru: "Кармелитская (созерцательная: Тереза Авильская, Иоанн Креста)", az: "Karmelit (kontemplativ: Avilalı Tereza, Xaçlı Yəhya)" },
        next_node: "terminal_catholic_carmelite",
        tags: ["carmelite", "catholic"],
      },
      {
        label: { en: "Benedictine / Trappist (ora et labora, stability)", ru: "Бенедиктинская / Траппистская (молись и работай, стабильность)", az: "Benediktin / Trappist (dua et və işlə, sabitlik)" },
        next_node: "terminal_catholic_benedictine",
        tags: ["benedictine", "catholic"],
      },
      {
        label: { en: "Salesian / Opus Dei / Focolare / Other", ru: "Салезианская / Опус Деи / Фоколаре / Другие", az: "Salesian / Opus Dei / Fokolare / Digər" },
        next_node: "terminal_catholic_other_order",
        tags: ["other_order", "catholic"],
      },
    ],
  },

  // ---- Orthodox Jurisdictions ----
  orthodox_jurisdiction: {
    node_id: "orthodox_jurisdiction",
    question: {
      en: "Which Orthodox jurisdiction or tradition?",
      ru: "Какая православная юрисдикция или традиция?",
      az: "Hansı Pravoslav yurisdiksiyası və ya ənənəsi?",
    },
    options: [
      {
        label: { en: "Greek / Constantinople (Ecumenical Patriarchate)", ru: "Греческая / Константинопольская (Вселенский патриархат)", az: "Yunan / Konstantinopol (Ümumdünya Patriarxlığı)" },
        next_node: "terminal_orthodox_greek",
        tags: ["greek_orthodox", "orthodox"],
      },
      {
        label: { en: "Russian Orthodox (Moscow Patriarchate)", ru: "Русская православная (Московский патриархат)", az: "Rus Pravoslav (Moskva Patriarxlığı)" },
        next_node: "russian_orthodox_branch",
        tags: ["russian_orthodox", "orthodox"],
      },
      {
        label: { en: "Antiochian / Arab Orthodox", ru: "Антиохийская / Арабская православная", az: "Antioxiya / Ərəb Pravoslav" },
        next_node: "terminal_orthodox_antiochian",
        tags: ["antiochian", "orthodox"],
      },
      {
        label: { en: "Serbian / Bulgarian / Romanian / Georgian / Other Slavic", ru: "Сербская / Болгарская / Румынская / Грузинская / Другие славянские", az: "Serb / Bolqar / Rumın / Gürcü / Digər Slavyan" },
        next_node: "terminal_orthodox_other_slavic",
        tags: ["other_slavic_orthodox", "orthodox"],
      },
      {
        label: { en: "Old Believers (pre-Nikonian rites, split 1666)", ru: "Старообрядцы (дониконианские обряды, раскол 1666)", az: "Köhnə İnananlar (Nikondan əvvəl ayinlər, 1666 bölünməsi)" },
        next_node: "terminal_orthodox_old_believer",
        tags: ["old_believer", "orthodox"],
      },
      {
        label: { en: "True Orthodoxy / Genuine Orthodox (anti-ecumenist)", ru: "Истинное православие (антиэкуменистское)", az: "Həqiqi Pravoslavlıq (anti-ekumenist)" },
        next_node: "terminal_orthodox_true",
        tags: ["true_orthodox", "orthodox"],
      },
    ],
  },

  russian_orthodox_branch: {
    node_id: "russian_orthodox_branch",
    question: {
      en: "Which stream within Russian Orthodoxy?",
      ru: "Какое течение в русском православии?",
      az: "Rus Pravoslavlığında hansı cərəyan?",
    },
    options: [
      {
        label: { en: "Mainstream Moscow Patriarchate (official)", ru: "Основной Московский патриархат (официальный)", az: "Əsas Moskva Patriarxlığı (rəsmi)" },
        next_node: "terminal_orthodox_russian_mainstream",
        tags: ["russian_mainstream", "orthodox"],
      },
      {
        label: { en: "ROCOR (Russian Orthodox Church Outside Russia)", ru: "РПЦЗ (Русская православная церковь заграницей)", az: "RPÇX (Rus Pravoslav Kilsəsi Xaricdə)" },
        next_node: "terminal_orthodox_rocor",
        tags: ["rocor", "orthodox"],
      },
      {
        label: { en: "Old Ritualists / Edinovertsy (reconciled Old Believers)", ru: "Старообрядцы / Единоверцы (примирённые старообрядцы)", az: "Köhnə Ayinçilər / Edinovertsi (barışdırılmış köhnə inananlar)" },
        next_node: "terminal_orthodox_edinovertsy",
        tags: ["edinovertsy", "orthodox"],
      },
    ],
  },

  // ---- Oriental Orthodox ----
  oriental_orthodox_church: {
    node_id: "oriental_orthodox_church",
    question: {
      en: "Which Oriental Orthodox (Non-Chalcedonian) church?",
      ru: "Какая древневосточная (нехалкидонская) церковь?",
      az: "Hansı Qədim Şərqi (Non-Xalqedon) kilsəsi?",
    },
    options: [
      {
        label: { en: "Coptic Orthodox (Egypt, Pope of Alexandria)", ru: "Коптская православная (Египет, папа Александрийский)", az: "Kopt Pravoslav (Misir, İsgəndəriyyə Papası)" },
        next_node: "terminal_oriental_coptic",
        tags: ["coptic", "oriental_orthodox"],
      },
      {
        label: { en: "Armenian Apostolic (Etchmiadzin, Armenia)", ru: "Армянская апостольская (Эчмиадзин, Армения)", az: "Erməni Apostolik (Eçmiədzin, Ermənistan)" },
        next_node: "terminal_oriental_armenian",
        tags: ["armenian", "oriental_orthodox"],
      },
      {
        label: { en: "Ethiopian Orthodox Tewahedo (Addis Ababa)", ru: "Эфиопская православная Тевахедо (Аддис-Абеба)", az: "Efiopiya Pravoslav Tevahedo (Əddis-Əbəbə)" },
        next_node: "terminal_oriental_ethiopian",
        tags: ["ethiopian", "oriental_orthodox"],
      },
      {
        label: { en: "Eritrean Orthodox Tewahedo (Asmara)", ru: "Эритрейская православная Тевахедо (Асмэра)", az: "Eritreya Pravoslav Tevahedo (Əsməra)" },
        next_node: "terminal_oriental_eritrean",
        tags: ["eritrean", "oriental_orthodox"],
      },
      {
        label: { en: "Syriac Orthodox (Antioch, West Syriac rite)", ru: "Сирийская православная (Антиохия, западно-сирийский обряд)", az: "Suriya Pravoslav (Antioxiya, Qərbi Suriya ayini)" },
        next_node: "terminal_oriental_syriac",
        tags: ["syriac", "oriental_orthodox"],
      },
      {
        label: { en: "Malankara Orthodox Syrian (India)", ru: "Маланкарская православная сирийская (Индия)", az: "Malankara Pravoslav Suriya (Hindistan)" },
        next_node: "terminal_oriental_malankara",
        tags: ["malankara", "oriental_orthodox"],
      },
    ],
  },

  // ---- Protestant Tradition ----
  protestant_tradition: {
    node_id: "protestant_tradition",
    question: {
      en: "Which Protestant / Evangelical family?",
      ru: "Какое протестантское / евангельское семейство?",
      az: "Hansı Protestant / Evangelik ailə?",
    },
    hint: {
      en: "Major Reformation branches and their descendants.",
      ru: "Основные ветви Реформации и их наследники.",
      az: "Reformasiyanın əsas qolları və varisləri.",
    },
    options: [
      {
        label: { en: "Lutheran (Book of Concord, justification by faith)", ru: "Лютеранская (Книга Согласия, оправдание верой)", az: "Lüteran (Razılıq Kitabı, imanla bəraət)" },
        next_node: "lutheran_branch",
        tags: ["lutheran", "protestant"],
      },
      {
        label: { en: "Reformed / Calvinist (TULIP, covenant theology)", ru: "Реформатская / Кальвинистская (TULIP, теология завета)", az: "Reformasiya / Kalvinist (TULIP, əhd teologiyası)" },
        next_node: "reformed_branch",
        tags: ["reformed", "protestant"],
      },
      {
        label: { en: "Anglican / Episcopalian (Via Media, Book of Common Prayer)", ru: "Англиканская / Епископальная (Via Media, Книга общих молитв)", az: "Anglikan / Episkopal (Via Media, Ümumi Dua Kitabı)" },
        next_node: "anglican_branch",
        tags: ["anglican", "protestant"],
      },
      {
        label: { en: "Anabaptist (believer's baptism, pacifism, discipleship)", ru: "Анабаптистская (крещение верующих, пацифизм, ученичество)", az: "Anabaptist (imanlı vəftizi, pasifizm, şagirdlik)" },
        next_node: "anabaptist_branch",
        tags: ["anabaptist", "protestant"],
      },
      {
        label: { en: "Baptist (believer's baptism, congregationalism)", ru: "Баптистская (крещение верующих, конгрегационализм)", az: "Baptist (imanlı vəftizi, konqreqasionalizm)" },
        next_node: "baptist_branch",
        tags: ["baptist", "protestant"],
      },
      {
        label: { en: "Methodist / Wesleyan (Arminian, holiness, social gospel)", ru: "Методистская / Уэслианская (арминианство, святость, социальное евангелие)", az: "Metodist / Uesliyan (Arminian, müqəddəslik, sosial incil)" },
        next_node: "methodist_branch",
        tags: ["methodist", "protestant"],
      },
      {
        label: { en: "Pentecostal / Charismatic (Spirit baptism, gifts, healing)", ru: "Пятидесятническая / Харизматическая (крещение Духом, дары, исцеление)", az: "Pentekostal / Xarizmatik (Ruh vəftizi, hədiyyələr, şəfa)" },
        next_node: "pentecostal_branch",
        tags: ["pentecostal", "protestant"],
      },
      {
        label: { en: "Non-Denominational / Evangelical (Bible churches, megachurches)", ru: "Независимая / Евангельская (библейские церкви, мегацеркви)", az: "Qeyri-Konfessional / Evangelik (Bibliya kilsələri, meqa-kilsələr)" },
        next_node: "nondenom_branch",
        tags: ["nondenominational", "protestant"],
      },
      {
        label: { en: "Adventist / Restorationist (Sabbath, investigative judgment)", ru: "Адвентистская / Реставрационистская (суббота, следственный суд)", az: "Adventist / Restavrasionist (Şənbə, araşdırıcı mühakimə)" },
        next_node: "adventist_branch",
        tags: ["adventist", "protestant"],
      },
      {
        label: { en: "Quaker / Friends (Inner Light, silent worship)", ru: "Квакерская / Друзья (Внутренний Свет, молчаливое богослужение)", az: "Kveker / Dostlar (Daxili İşıq, səssiz ibadət)" },
        next_node: "terminal_protestant_quaker",
        tags: ["quaker", "protestant"],
      },
    ],
  },

  // ---- Lutheran ----
  lutheran_branch: {
    node_id: "lutheran_branch",
    question: {
      en: "Which Lutheran expression?",
      ru: "Какое лютеранское выражение?",
      az: "Hansı Lüteran ifadəsi?",
    },
    options: [
      {
        label: { en: "Confessional Lutheran (LCMS, WELS, ELS)", ru: "Конфессиональная лютеранская (LCMS, WELS, ELS)", az: "Konfessional Lüteran (LCMS, WELS, ELS)" },
        next_node: "terminal_lutheran_confessional",
        tags: ["confessional_lutheran", "protestant"],
      },
      {
        label: { en: "Mainline / ELCA (ecumenical, progressive)", ru: "Мейнстримная / ELCA (экуменическая, прогрессивная)", az: "Meynstrim / ELCA (ekumenik, progressiv)" },
        next_node: "terminal_lutheran_mainline",
        tags: ["mainline_lutheran", "protestant"],
      },
      {
        label: { en: "Nordic Folk Churches (Sweden, Denmark, Norway, Finland)", ru: "Скандинавские народные церкви (Швеция, Дания, Норвегия, Финляндия)", az: "Skandinav xalq kilsələri (İsveç, Danimarka, Norveç, Finlandiya)" },
        next_node: "terminal_lutheran_nordic",
        tags: ["nordic_lutheran", "protestant"],
      },
      {
        label: { en: "Laestadianism (conservative pietist revival)", ru: "Лестадианство (консервативное пиетистское возрождение)", az: "Lestadianizm (mühafizəkar pietist dirçəliş)" },
        next_node: "terminal_lutheran_laestadian",
        tags: ["laestadian", "protestant"],
      },
    ],
  },

  // ---- Reformed ----
  reformed_branch: {
    node_id: "reformed_branch",
    question: {
      en: "Which Reformed / Presbyterian tradition?",
      ru: "Какая реформатская / пресвитерианская традиция?",
      az: "Hansı Reformasiya / Presviterian ənənəsi?",
    },
    options: [
      {
        label: { en: "Presbyterian (PCUSA — mainline, progressive)", ru: "Пресвитерианская (PCUSA — мейнстримная, прогрессивная)", az: "Presviterian (PCUSA — meynstrim, progressiv)" },
        next_node: "terminal_reformed_pcusa",
        tags: ["pcusa", "reformed"],
      },
      {
        label: { en: "Presbyterian (PCA, OPC, EPC — conservative)", ru: "Пресвитерианская (PCA, OPC, EPC — консервативная)", az: "Presviterian (PCA, OPC, EPC — mühafizəkar)" },
        next_node: "terminal_reformed_conservative",
        tags: ["conservative_presbyterian", "reformed"],
      },
      {
        label: { en: "Continental Reformed (Dutch Reformed, CRCNA)", ru: "Континентальная реформатская (голландская, CRCNA)", az: "Kontinental Reformasiya (Holland, CRCNA)" },
        next_node: "terminal_reformed_continental",
        tags: ["continental_reformed", "reformed"],
      },
      {
        label: { en: "Sovereign Grace / New Calvinism (Acts 29, TGC)", ru: "Суверенная благодать / Новый кальвинизм (Acts 29, TGC)", az: "Suveren Lütf / Yeni Kalvinizm (Acts 29, TGC)" },
        next_node: "terminal_reformed_new_calvinism",
        tags: ["new_calvinism", "reformed"],
      },
      {
        label: { en: "Christian Reconstructionism / Theonomy", ru: "Христианский реконструкционизм / Теономия", az: "Xristian Rekonstruksionizm / Teonomiya" },
        next_node: "terminal_reformed_theonomy",
        tags: ["theonomy", "reformed"],
      },
    ],
  },

  // ---- Anglican ----
  anglican_branch: {
    node_id: "anglican_branch",
    question: {
      en: "Which Anglican / Episcopal expression?",
      ru: "Какое англиканское / епископальное выражение?",
      az: "Hansı Anglikan / Episkopal ifadəsi?",
    },
    options: [
      {
        label: { en: "Anglo-Catholic / High Church (ritual, apostolic succession)", ru: "Англо-католическая / Высокая церковь (ритуал, апостольское преемство)", az: "Anglo-Katolik / Yüksək Kilsə (ayin, apostolik varislik)" },
        next_node: "terminal_anglican_anglocatholic",
        tags: ["anglocatholic", "anglican"],
      },
      {
        label: { en: "Broad Church / Central (via media, moderate)", ru: "Широкая церковь / Центральная (via media, умеренная)", az: "Geniş Kilsə / Mərkəzi (via media, mülayim)" },
        next_node: "terminal_anglican_broad",
        tags: ["broad_church", "anglican"],
      },
      {
        label: { en: "Low Church / Evangelical Anglican (scripture, preaching)", ru: "Низкая церковь / Евангельская англиканская (Писание, проповедь)", az: "Aşağı Kilsə / Evangelik Anglikan (Müqəddəs Kitab, təbliğ)" },
        next_node: "terminal_anglican_low",
        tags: ["low_church", "anglican"],
      },
      {
        label: { en: "ACNA / GAFCON (Global South, conservative)", ru: "ACNA / GAFCON (Глобальный Юг, консервативная)", az: "ACNA / GAFCON (Qlobal Cənub, mühafizəkar)" },
        next_node: "terminal_anglican_acna",
        tags: ["acna", "anglican"],
      },
      {
        label: { en: "Continuing Anglican (traditional BCP 1928)", ru: "Продолжающаяся англиканская (традиционная BCP 1928)", az: "Davamedən Anglikan (ənənəvi BCP 1928)" },
        next_node: "terminal_anglican_continuing",
        tags: ["continuing_anglican", "anglican"],
      },
    ],
  },

  // ---- Anabaptist ----
  anabaptist_branch: {
    node_id: "anabaptist_branch",
    question: {
      en: "Which Anabaptist tradition?",
      ru: "Какая анабаптистская традиция?",
      az: "Hansı Anabaptist ənənəsi?",
    },
    options: [
      {
        label: { en: "Old Order Amish (horse & buggy, plain dress)", ru: "Старообрядческие амиши (конь и повозка, простая одежда)", az: "Köhnə Tərtibli Amiş (at və araba, sadə geyim)" },
        next_node: "terminal_anabaptist_amish",
        tags: ["amish", "anabaptist"],
      },
      {
        label: { en: "Conservative Mennonites (plain, nonresistant)", ru: "Консервативные меннониты (простые, ненасильственные)", az: "Mühafizəkar Menonitlər (sadə, müqavimətsiz)" },
        next_node: "terminal_anabaptist_conservative_mennonite",
        tags: ["conservative_mennonite", "anabaptist"],
      },
      {
        label: { en: "Mennonite Church USA / Canada (peace theology)", ru: "Меннонитская церковь США / Канады (теология мира)", az: "Menonit Kilsəsi ABŞ / Kanada (sülh teologiyası)" },
        next_node: "terminal_anabaptist_mennonite_mainline",
        tags: ["mainline_mennonite", "anabaptist"],
      },
      {
        label: { en: "Hutterites (communal living, colonies)", ru: "Гуттериты (общинная жизнь, колонии)", az: "Hutteritlər (kommunal həyat, koloniyalar)" },
        next_node: "terminal_anabaptist_hutterite",
        tags: ["hutterite", "anabaptist"],
      },
      {
        label: { en: "Brethren / Church of the Brethren (Dunkers)", ru: "Братья / Церковь братьев (данкеры)", az: "Qardaşlar / Qardaşlar Kilsəsi (Dankerlar)" },
        next_node: "terminal_anabaptist_brethren",
        tags: ["brethren", "anabaptist"],
      },
    ],
  },

  // ---- Baptist ----
  baptist_branch: {
    node_id: "baptist_branch",
    question: {
      en: "Which Baptist tradition?",
      ru: "Какая баптистская традиция?",
      az: "Hansı Baptist ənənəsi?",
    },
    options: [
      {
        label: { en: "Southern Baptist Convention (SBC — conservative)", ru: "Южная баптистская конвенция (SBC — консервативная)", az: "Cənubi Baptist Konvensiyası (SBC — mühafizəkar)" },
        next_node: "terminal_baptist_sbc",
        tags: ["sbc", "baptist"],
      },
      {
        label: { en: "American Baptist (ABCUSA — mainline, progressive)", ru: "Американская баптистская (ABCUSA — мейнстримная)", az: "Amerika Baptist (ABCUSA — meynstrim)" },
        next_node: "terminal_baptist_abcusa",
        tags: ["abcusa", "baptist"],
      },
      {
        label: { en: "Independent Fundamentalist (KJV-only, separatist)", ru: "Независимая фундаменталистская (только KJV, сепаратистская)", az: "Müstəqil Fundamentalist (yalnız KJV, separatist)" },
        next_node: "terminal_baptist_independent_fundamentalist",
        tags: ["independent_fundamentalist", "baptist"],
      },
      {
        label: { en: "Reformed Baptist (1689 Confession, Calvinistic)", ru: "Реформатская баптистская (Исповедание 1689, кальвинистская)", az: "Reformasiya Baptist (1689 Etirafı, Kalvinist)" },
        next_node: "terminal_baptist_reformed",
        tags: ["reformed_baptist", "baptist"],
      },
      {
        label: { en: "General Baptist (Arminian, free will)", ru: "Общие баптисты (арминианские, свободная воля)", az: "Ümumi Baptist (Arminian, azad iradə)" },
        next_node: "terminal_baptist_general",
        tags: ["general_baptist", "baptist"],
      },
      {
        label: { en: "Primitive Baptist (hyper-Calvinist, no missions)", ru: "Примитивные баптисты (гиперкальвинистские, без миссий)", az: "Primitiv Baptist (hiper-Kalvinist, missiyasız)" },
        next_node: "terminal_baptist_primitive",
        tags: ["primitive_baptist", "baptist"],
      },
    ],
  },

  // ---- Methodist ----
  methodist_branch: {
    node_id: "methodist_branch",
    question: {
      en: "Which Methodist / Wesleyan-Holiness tradition?",
      ru: "Какая методистская / уэслианско-святостная традиция?",
      az: "Hansı Metodist / Uesliyan-Müqəddəslik ənənəsi?",
    },
    options: [
      {
        label: { en: "United Methodist / Global Methodist (mainline Wesleyan)", ru: "Объединённая методистская / Глобальная методистская (мейнстримная)", az: "Birləşmiş Metodist / Qlobal Metodist (meynstrim)" },
        next_node: "terminal_methodist_umc",
        tags: ["umc", "methodist"],
      },
      {
        label: { en: "African Methodist Episcopal (AME / AME Zion)", ru: "Африканская методистская епископальная (AME / AME Zion)", az: "Afrika Metodist Episkopal (AME / AME Zion)" },
        next_node: "terminal_methodist_ame",
        tags: ["ame", "methodist"],
      },
      {
        label: { en: "Wesleyan Church / Church of the Nazarene (Holiness)", ru: "Уэслианская церковь / Церковь Назарянина (святость)", az: "Uesliyan Kilsəsi / Nazaren Kilsəsi (müqəddəslik)" },
        next_node: "terminal_methodist_wesleyan_holiness",
        tags: ["wesleyan_holiness", "methodist"],
      },
      {
        label: { en: "Salvation Army (sacramental theology, social work)", ru: "Армия спасения (сакраментальная теология, соцработа)", az: "Xilasetmə Ordusu (sakramental teologiya, sosial iş)" },
        next_node: "terminal_methodist_salvation_army",
        tags: ["salvation_army", "methodist"],
      },
    ],
  },

  // ---- Pentecostal ----
  pentecostal_branch: {
    node_id: "pentecostal_branch",
    question: {
      en: "Which Pentecostal / Charismatic family?",
      ru: "Какая пятидесятническая / харизматическая семья?",
      az: "Hansı Pentekostal / Xarizmatik ailə?",
    },
    options: [
      {
        label: { en: "Classical Pentecostal (Assemblies of God, Church of God)", ru: "Классическая пятидесятническая (Ассамблеи Бога, Церковь Бога)", az: "Klassik Pentekostal (Allah Məclisləri, Allah Kilsəsi)" },
        next_node: "terminal_pentecostal_classical",
        tags: ["classical_pentecostal", "pentecostal"],
      },
      {
        label: { en: "Oneness / Apostolic (Acts 2:38, Jesus-only baptism)", ru: "Единственническая / Апостольская (Деян 2:38, крещение во имя Иисуса)", az: "Birlik / Apostolik (Həvarilər 2:38, İsa adına vəftiz)" },
        next_node: "terminal_pentecostal_oneness",
        tags: ["oneness", "pentecostal"],
      },
      {
        label: { en: "Charismatic Movement (within mainline churches)", ru: "Харизматическое движение (в мейнстримных церквях)", az: "Xarizmatik Hərəkat (meynstrim kilsələrdə)" },
        next_node: "terminal_pentecostal_charismatic",
        tags: ["charismatic", "pentecostal"],
      },
      {
        label: { en: "Word of Faith / Prosperity (Kenneth Hagin, Copeland)", ru: "Слово веры / Процветание (Кеннет Хейгин, Коупленд)", az: "İman Sözü / Bərəkət (Kennet Heygin, Kouplend)" },
        next_node: "terminal_pentecostal_word_faith",
        tags: ["word_of_faith", "pentecostal"],
      },
      {
        label: { en: "New Apostolic Reformation (NAR, apostles & prophets)", ru: "Новая апостольская реформация (NAR, апостолы и пророки)", az: "Yeni Apostolik Reformasiya (NAR, həvarilər və peyğəmbərlər)" },
        next_node: "terminal_pentecostal_nar",
        tags: ["nar", "pentecostal"],
      },
    ],
  },

  // ---- Non-Denominational ----
  nondenom_branch: {
    node_id: "nondenom_branch",
    question: {
      en: "Which non-denominational / Evangelical expression?",
      ru: "Какое независимое / евангельское выражение?",
      az: "Hansı qeyri-konfessional / Evangelik ifadə?",
    },
    options: [
      {
        label: { en: "Evangelical Bible Church (expository preaching)", ru: "Евангельская библейская церковь (экспозиционная проповедь)", az: "Evangelik Bibliya Kilsəsi (ekspozisiya təbliği)" },
        next_node: "terminal_nondenom_bible_church",
        tags: ["bible_church", "evangelical"],
      },
      {
        label: { en: "Megachurch attendee (Hillsong, Life.Church, Saddleback)", ru: "Прихожанин мегацеркви (Hillsong, Life.Church, Saddleback)", az: "Meqa-kilsə üzvü (Hillsong, Life.Church, Saddleback)" },
        next_node: "terminal_nondenom_megachurch",
        tags: ["megachurch", "evangelical"],
      },
      {
        label: { en: "Neo-Calvinist Evangelical (Mark Driscoll, Tim Keller)", ru: "Неокальвинистская евангельская (Марк Дрисколл, Тим Келлер)", az: "Neo-Kalvinist Evangelik (Mark Driskoll, Tim Keller)" },
        next_node: "terminal_nondenom_neo_calvinist",
        tags: ["neo_calvinist", "evangelical"],
      },
      {
        label: { en: "Open/Progressive Evangelical (affirming, inclusive)", ru: "Открытая / Прогрессивная евангельская (инклюзивная)", az: "Açıq / Proqressiv Evangelik (inklüziv)" },
        next_node: "terminal_nondenom_progressive",
        tags: ["progressive_evangelical", "evangelical"],
      },
    ],
  },

  // ---- Adventist ----
  adventist_branch: {
    node_id: "adventist_branch",
    question: {
      en: "Which Adventist / Restorationist tradition?",
      ru: "Какая адвентистская / реставрационистская традиция?",
      az: "Hansı Adventist / Restavrasionist ənənəsi?",
    },
    options: [
      {
        label: { en: "Seventh-day Adventist (Sabbath, prophetic gift, health)", ru: "Адвентисты седьмого дня (суббота, пророческий дар, здоровье)", az: "Yeddinci Gün Adventistləri (Şənbə, peyğəmbərlik hədiyyəsi, sağlamlıq)" },
        next_node: "terminal_adventist_sda",
        tags: ["sda", "adventist"],
      },
      {
        label: { en: "Church of God (Seventh Day) / Other Sabbath-keeping", ru: "Церковь Бога (седьмого дня) / Другие субботники", az: "Allah Kilsəsi (Yeddinci Gün) / Digər şənbəçilər" },
        next_node: "terminal_adventist_cog7",
        tags: ["cog7", "adventist"],
      },
      {
        label: { en: "Jehovah's Witnesses (Watchtower, 144,000)", ru: "Свидетели Иеговы (Сторожевая башня, 144 000)", az: "Yehova Şahidləri (Gözətçi Qülləsi, 144 000)" },
        next_node: "terminal_adventist_jw",
        tags: ["jehovah_witness", "adventist"],
      },
      {
        label: { en: "Christadelphians / Church of God International", ru: "Христадельфиане / Международная церковь Бога", az: "Kristadelfiyanlar / Beynəlxalq Allah Kilsəsi" },
        next_node: "terminal_adventist_other",
        tags: ["christadelphian", "adventist"],
      },
    ],
  },

  // ---- Restorationist ----
  restorationist_branch: {
    node_id: "restorationist_branch",
    question: {
      en: "Which Restorationist movement?",
      ru: "Какое реставрационистское движение?",
      az: "Hansı Restavrasionist hərəkat?",
    },
    options: [
      {
        label: { en: "Latter-day Saints (Mormon: LDS Church)", ru: "Святые последних дней (мормоны: Церковь СПД)", az: "Axırıncı Gün Müqəddəsləri (Mormon: LDS Kilsəsi)" },
        next_node: "lds_branch",
        tags: ["lds", "restorationist"],
      },
      {
        label: { en: "Community of Christ (formerly RLDS)", ru: "Община Христа (ранее RLDS)", az: "Məsih İcması (əvvəllər RLDS)" },
        next_node: "terminal_restorationist_community_christ",
        tags: ["community_of_christ", "restorationist"],
      },
      {
        label: { en: "Fundamentalist LDS (polygamous FLDS, AUB)", ru: "Фундаменталистская СПД (многожёнство, FLDS, AUB)", az: "Fundamentalist LDS (çoxarvadlı FLDS, AUB)" },
        next_node: "terminal_restorationist_flds",
        tags: ["flds", "restorationist"],
      },
      {
        label: { en: "Unitarian / Universalist (Unitarian-Universalism)", ru: "Унитарианская / Универсалистская (унитарианский универсализм)", az: "Unitarian / Universalist (Unitarian-Universalizm)" },
        next_node: "terminal_restorationist_unitarian",
        tags: ["unitarian", "restorationist"],
      },
      {
        label: { en: "Christian Science / New Thought (Mary Baker Eddy)", ru: "Христианская наука / Новое мышление (Мэри Бейкер Эдди)", az: "Xristian Elm / Yeni Düşüncə (Meri Beyker Eddi)" },
        next_node: "terminal_restorationist_christian_science",
        tags: ["christian_science", "restorationist"],
      },
    ],
  },

  lds_branch: {
    node_id: "lds_branch",
    question: {
      en: "Which Latter-day Saint tradition?",
      ru: "Какая традиция святых последних дней?",
      az: "Hansı Axırıncı Gün Müqəddəsləri ənənəsi?",
    },
    options: [
      {
        label: { en: "The Church of Jesus Christ of Latter-day Saints (main)", ru: "Церковь Иисуса Христа святых последних дней (основная)", az: "İsa Məsihin Axırıncı Gün Müqəddəsləri Kilsəsi (əsas)" },
        next_node: "terminal_lds_main",
        tags: ["lds_main", "restorationist"],
      },
      {
        label: { en: "Community of Christ (RLDS, ecumenical direction)", ru: "Община Христа (RLDS, экуменическое направление)", az: "Məsih İcması (RLDS, ekumenik istiqamət)" },
        next_node: "terminal_lds_coc",
        tags: ["community_of_christ", "restorationist"],
      },
      {
        label: { en: "Other Latter Day Saint denominations (Strangite, Bickertonite)", ru: "Другие деноминации (странгиты, бикертониты)", az: "Digər Müqəddəslər təriqətləri (Strangit, Bikertonit)" },
        next_node: "terminal_lds_other",
        tags: ["other_lds", "restorationist"],
      },
    ],
  },

  // ============ ABRAHAMIC UNITARIAN: ISLAM & JUDAISM ============
  abrahamic_unitarian_branch: {
    node_id: "abrahamic_unitarian_branch",
    question: {
      en: "Which strictly-unitarian Abrahamic tradition?",
      ru: "Какая строго-унитарианская авраамическая традиция?",
      az: "Hansı ciddi-unitarian İbrahimi ənənə?",
    },
    hint: {
      en: "Islam (final prophet Muhammad) vs Judaism (covenant with Israel).",
      ru: "Ислам (последний пророк Мухаммад) vs иудаизм (завет с Израилем).",
      az: "İslam (son peyğəmbər Məhəmməd) vs Yəhudilik (İsraillə əhd).",
    },
    options: [
      {
        label: { en: "Islam (Quran, Muhammad)", ru: "Ислам (Коран, Мухаммад)", az: "İslam (Quran, Məhəmməd)" },
        next_node: "islam_major_branch",
        tags: ["islam", "abrahamic"],
      },
      {
        label: { en: "Judaism (Torah, covenant)", ru: "Иудаизм (Тора, завет)", az: "Yəhudilik (Tövrat, əhd)" },
        next_node: "judaism_major_branch",
        tags: ["judaism", "abrahamic"],
      },
      {
        label: { en: "Neither — I affirm one God outside these (e.g. Baha'i, Samaritan, Druze)", ru: "Ни то, ни другое — я утверждаю единого Бога вне этих традиций (например, бахаи, самаритяне, друзы)", az: "Heç biri — bu ənənələrdən kənarda bir Tanrı (məs. Bəhai, Samariyalı, Druz)" },
        next_node: "other_unitarian_branch",
        tags: ["other_unitarian", "abrahamic"],
      },
    ],
  },

  // ============ ISLAM DEEP DIVE ============
  islam_major_branch: {
    node_id: "islam_major_branch",
    question: {
      en: "Which major Islamic division?",
      ru: "Какое главное исламское разделение?",
      az: "Hansı əsas İslam bölgüsü?",
    },
    hint: {
      en: "Sunni (majority), Shia (party of Ali), or Ibadi (Kharijite descendant).",
      ru: "Сунниты (большинство), шииты (партия Али) или ибадиты (потомки хариджитов).",
      az: "Sünni (əksəriyyət), Şiə (Əli partiyası) və ya İbadi (Xaricilərin varisi).",
    },
    options: [
      {
        label: { en: "Sunni (followers of the Sunnah)", ru: "Сунниты (следующие Сунне)", az: "Sünni (Sünnəyə tabe olanlar)" },
        next_node: "sunni_madhhab",
        tags: ["sunni", "islam"],
      },
      {
        label: { en: "Shia (Party of Ali — Imams)", ru: "Шииты (Партия Али — имамы)", az: "Şiə (Əli Partiyası — İmamlar)" },
        next_node: "shia_branch",
        tags: ["shia", "islam"],
      },
      {
        label: { en: "Ibadi (Oman, Kharijite heritage)", ru: "Ибадиты (Оман, хариджитское наследие)", az: "İbadi (Oman, Xaricilik irsi)" },
        next_node: "terminal_islam_ibadi",
        tags: ["ibadi", "islam"],
      },
      {
        label: { en: "Sufi / Tariqa-focused (mystical path across divisions)", ru: "Суфии / Тарика (мистический путь вне разделений)", az: "Sufi / Təriqət yönümlü (bölgülərarası mistik yol)" },
        next_node: "sufi_tariqa",
        tags: ["sufi", "islam"],
      },
    ],
  },

  // ---- Sunni Madhhabs ----
  sunni_madhhab: {
    node_id: "sunni_madhhab",
    question: {
      en: "Which Sunni legal school (Madhhab)?",
      ru: "Какая суннитская правовая школа (мазхаб)?",
      az: "Hansı Sünni məzhəbi?",
    },
    hint: {
      en: "Four schools of jurisprudence, plus the Athari/Salafi creedal path.",
      ru: "Четыре школы фикха плюс асарский/салафитский вероучительный путь.",
      az: "Dörd fiqh məktəbi, üstəlik Əsəri/Sələfi əqidə yolu.",
    },
    options: [
      {
        label: { en: "Hanafi (Turkey, Central Asia, South Asia)", ru: "Ханафитский (Турция, Центральная Азия, Южная Азия)", az: "Hənəfi (Türkiyə, Orta Asiya, Cənubi Asiya)" },
        next_node: "hanafi_branch",
        tags: ["hanafi", "sunni"],
      },
      {
        label: { en: "Maliki (North & West Africa)", ru: "Маликитский (Северная и Западная Африка)", az: "Maliki (Şimali və Qərbi Afrika)" },
        next_node: "maliki_branch",
        tags: ["maliki", "sunni"],
      },
      {
        label: { en: "Shafi'i (East Africa, Southeast Asia)", ru: "Шафиитский (Восточная Африка, Юго-Восточная Азия)", az: "Şafii (Şərqi Afrika, Cənub-Şərqi Asiya)" },
        next_node: "shafii_branch",
        tags: ["shafii", "sunni"],
      },
      {
        label: { en: "Hanbali (Saudi Arabia, conservative)", ru: "Ханбалитский (Саудовская Аравия, консервативный)", az: "Hənbəli (Səudiyyə Ərəbistanı, mühafizəkar)" },
        next_node: "hanbali_branch",
        tags: ["hanbali", "sunni"],
      },
      {
        label: { en: "Athari / Salafi creed (no madhhab, textualist)", ru: "Асарский / Салафитский вероучительный путь (без мазхаба, текстуализм)", az: "Əsəri / Sələfi əqidə (məzhəbsiz, mətnçi)" },
        next_node: "salafi_branch",
        tags: ["salafi", "sunni"],
      },
      {
        label: { en: "I don't follow a school / Just Muslim", ru: "Я не следую школе / Просто мусульманин", az: "Məzhəbə tabe deyiləm / Sadəcə müsəlman" },
        next_node: "terminal_islam_just_muslim",
        tags: ["non_madhhab", "sunni"],
      },
    ],
  },

  hanafi_branch: {
    node_id: "hanafi_branch",
    question: {
      en: "Which Hanafi theological / revivalist movement?",
      ru: "Какое ханафитское богословское / возрожденческое движение?",
      az: "Hansı Hənəfi teoloji / dirçəliş hərəkatı?",
    },
    options: [
      {
        label: { en: "Maturidi mainstream (Turkey, Central Asia)", ru: "Матуридитский мейнстрим (Турция, Центральная Азия)", az: "Maturidi meynstrim (Türkiyə, Orta Asiya)" },
        next_node: "terminal_islam_maturidi",
        tags: ["maturidi", "hanafi"],
      },
      {
        label: { en: "Deobandi (South Asia, Darul Uloom)", ru: "Деобанди (Южная Азия, Дар-уль-Улюм)", az: "Deobandi (Cənubi Asiya, Darul Ulum)" },
        next_node: "deobandi_branch",
        tags: ["deobandi", "hanafi"],
      },
      {
        label: { en: "Barelvi (South Asia, Sufi veneration)", ru: "Барельви (Южная Азия, суфийское почитание)", az: "Bareylvi (Cənubi Asiya, Sufi ehtiramı)" },
        next_node: "terminal_islam_barelvi",
        tags: ["barelvi", "hanafi"],
      },
      {
        label: { en: "Tablighi Jamaat (missionary movement)", ru: "Таблиг Джамаат (миссионерское движение)", az: "Təbliğ Camaatı (missioner hərəkat)" },
        next_node: "terminal_islam_tablighi",
        tags: ["tablighi", "deobandi"],
      },
      {
        label: { en: "Gülen / Hizmet movement (Turkey-based)", ru: "Движение Гюлена / Хизмет (на базе Турции)", az: "Gülən / Hizmet hərəkatı (Türkiyə əsaslı)" },
        next_node: "terminal_islam_gulen",
        tags: ["gulen", "hanafi"],
      },
    ],
  },

  deobandi_branch: {
    node_id: "deobandi_branch",
    question: {
      en: "Which Deobandi-aligned stream?",
      ru: "Какое деобанди-ориентированное течение?",
      az: "Hansı Deobandi yönümlü cərəyan?",
    },
    options: [
      {
        label: { en: "Mainstream Deobandi (Darul Uloom Deoband)", ru: "Основное деобанди (Дар-уль-Улюм Деобанд)", az: "Əsas Deobandi (Darul Ulum Deoband)" },
        next_node: "terminal_islam_deobandi_main",
        tags: ["deobandi_main", "sunni"],
      },
      {
        label: { en: "Tablighi Jamaat (global missionary da'wah)", ru: "Таблиг Джамаат (глобальная миссионерская да'ва)", az: "Təbliğ Camaatı (qlobal missioner dəvəti)" },
        next_node: "terminal_islam_tablighi",
        tags: ["tablighi", "sunni"],
      },
      {
        label: { en: "Taliban-aligned (Pakistani Deobandi seminaries)", ru: "Талибан-ориентированное (пакистанские деобанди-семинарии)", az: "Taliban yönümlü (Pakistan Deobandi seminariyaları)" },
        next_node: "terminal_islam_taliban",
        tags: ["taliban", "sunni"],
      },
      {
        label: { en: "Jamiat Ulema-e-Islam (political Deobandi)", ru: "Джамиат Улема-и-Ислам (политическое деобанди)", az: "Cəmiyyət Üləma-i-İslam (siyasi Deobandi)" },
        next_node: "terminal_islam_jamiat_ulema",
        tags: ["jamiat_ulema", "sunni"],
      },
    ],
  },

  maliki_branch: {
    node_id: "maliki_branch",
    question: {
      en: "Which Maliki-region spiritual path?",
      ru: "Какой духовный путь маликитского региона?",
      az: "Hansı Maliki region mənəvi yolu?",
    },
    options: [
      {
        label: { en: "Tijaniyyah Sufi order (West Africa)", ru: "Суфийский орден Тиджанийя (Западная Африка)", az: "Ticaniyyə Sufi ordeni (Qərbi Afrika)" },
        next_node: "terminal_islam_tijaniyyah",
        tags: ["tijaniyyah", "sufi"],
      },
      {
        label: { en: "Qadiriyya Sufi order (North & West Africa)", ru: "Суфийский орден Кадирийя (Северная и Западная Африка)", az: "Qadiriyyə Sufi ordeni (Şimali və Qərbi Afrika)" },
        next_node: "terminal_islam_qadiriyya",
        tags: ["qadiriyya", "sufi"],
      },
      {
        label: { en: "Muridiyya (Senegal, Amadou Bamba)", ru: "Муридийя (Сенегал, Амаду Бамба)", az: "Muridiyyə (Seneqal, Amadu Bamba)" },
        next_node: "terminal_islam_muridiyya",
        tags: ["muridiyya", "sufi"],
      },
      {
        label: { en: "Maliki without Sufi order (orthodox fiqh path)", ru: "Маликит без суфийского ордена (ортодоксальный фикх)", az: "Sufi ordeni olmadan Maliki (ortodoks fiqh yolu)" },
        next_node: "terminal_islam_maliki_orthodox",
        tags: ["maliki_orthodox", "sunni"],
      },
    ],
  },

  shafii_branch: {
    node_id: "shafii_branch",
    question: {
      en: "Which Shafi'i spiritual path?",
      ru: "Какой шафиитский духовный путь?",
      az: "Hansı Şafii mənəvi yolu?",
    },
    options: [
      {
        label: { en: "Ba 'Alawi / Alawi Sufi (Yemen, Indonesia)", ru: "Суфизм Ба 'Алави (Йемен, Индонезия)", az: "Ba 'Alavi Sufi (Yəmən, İndoneziya)" },
        next_node: "terminal_islam_ba_alawi",
        tags: ["ba_alawi", "sufi"],
      },
      {
        label: { en: "Shadhiliyya Sufi order (Egypt, Levant)", ru: "Суфийский орден Шазилийя (Египет, Левант)", az: "Şaziliyyə Sufi ordeni (Misir, Levant)" },
        next_node: "terminal_islam_shadhiliyya",
        tags: ["shadhiliyya", "sufi"],
      },
      {
        label: { en: "Ash'ari creed Shafi'i (Southeast Asia mainstream)", ru: "Шафиит-ашарит (мейнстрим Юго-Восточной Азии)", az: "Əşəri əqidəli Şafii (Cənub-Şərqi Asiya meynstrimi)" },
        next_node: "terminal_islam_shafii_ashari",
        tags: ["ashari", "shafii"],
      },
      {
        label: { en: "Shafi'i without Sufi order", ru: "Шафиит без суфийского ордена", az: "Sufi ordeni olmadan Şafii" },
        next_node: "terminal_islam_shafii_orthodox",
        tags: ["shafii_orthodox", "sunni"],
      },
    ],
  },

  hanbali_branch: {
    node_id: "hanbali_branch",
    question: {
      en: "Which Hanbali theological path?",
      ru: "Какой ханбалитский богословский путь?",
      az: "Hansı Hənbəli teoloji yolu?",
    },
    options: [
      {
        label: { en: "Athari / Traditionalist Hanbali (textual literalism)", ru: "Асарский / Традиционалистский ханбализм (текстуальный буквализм)", az: "Əsəri / Tradisionalist Hənbəli (mətn literalizmi)" },
        next_node: "terminal_islam_athari_hanbali",
        tags: ["athari", "hanbali"],
      },
      {
        label: { en: "Wahhabi / Saudi Salafism (Muhammad ibn Abd al-Wahhab)", ru: "Ваххабизм / Саудовский салафизм (Мухаммад ибн Абд аль-Ваххаб)", az: "Vəhhabizm / Səudiyyə Sələfiliyi (Məhəmməd ibn Əbdül-Vəhhab)" },
        next_node: "wahhabi_branch",
        tags: ["wahhabi", "hanbali"],
      },
      {
        label: { en: "Salafi-Jihadism (rejects all madhhabs)", ru: "Салафитский джихадизм (отвергает все мазхабы)", az: "Sələfi-Cihadizm (bütün məzhəbləri rədd edir)" },
        next_node: "salafi_jihadist_branch",
        tags: ["salafi_jihadist", "hanbali"],
      },
    ],
  },

  wahhabi_branch: {
    node_id: "wahhabi_branch",
    question: {
      en: "Which Wahhabi / Salafi-aligned expression?",
      ru: "Какое ваххабитское / салафитское выражение?",
      az: "Hansı Vəhhabi / Sələfi yönümlü ifadə?",
    },
    options: [
      {
        label: { en: "Official Saudi Wahhabism (state-sponsored)", ru: "Официальный саудовский ваххабизм (государственный)", az: "Rəsmi Səudiyyə Vəhhabizmi (dövlət tərəfindən)" },
        next_node: "terminal_islam_saudi_wahhabi",
        tags: ["saudi_wahhabi", "sunni"],
      },
      {
        label: { en: "Quietist Salafi (Madkhali, politically neutral)", ru: "Тихий салафизм (мадхалиты, политически нейтральный)", az: "Sakit Sələfi (Mədxali, siyasi neytral)" },
        next_node: "terminal_islam_quietist_salafi",
        tags: ["quietist_salafi", "sunni"],
      },
      {
        label: { en: "Haraki / Activist Salafi (political engagement)", ru: "Хараки / Активистский салафизм (политическое участие)", az: "Hərəki / Aktivist Sələfi (siyasi iştirak)" },
        next_node: "terminal_islam_activist_salafi",
        tags: ["activist_salafi", "sunni"],
      },
      {
        label: { en: "Takfiri / Excommunicating Salafi (declares Muslims apostates)", ru: "Такфиристский салафизм (объявляет мусульман отступниками)", az: "Təqfirçi Sələfi (müsəlmanları mürtəd elan edir)" },
        next_node: "salafi_jihadist_branch",
        tags: ["takfiri", "sunni"],
      },
    ],
  },

  salafi_jihadist_branch: {
    node_id: "salafi_jihadist_branch",
    question: {
      en: "Which militant Salafi-Jihadist movement?",
      ru: "Какое воинственное салафитско-джихадистское движение?",
      az: "Hansı döyüşkən Sələfi-Cihadist hərəkat?",
    },
    hint: {
      en: "The violent fringe that rejects the four legal schools and mainstream scholars.",
      ru: "Насильственная периферия, отвергающая четыре правовые школы и мейнстримных учёных.",
      az: "Dörd məzhəbi və meynstrim alimləri rədd edən zorakı kənar.",
    },
    options: [
      {
        label: { en: "Al-Qaeda (global jihad network)", ru: "Аль-Каида (глобальная сеть джихада)", az: "Əl-Qaidə (qlobal cihad şəbəkəsi)" },
        next_node: "terminal_islam_alqaeda",
        tags: ["alqaeda", "salafi_jihadist"],
      },
      {
        label: { en: "ISIS / ISIL / Daesh (self-styled caliphate)", ru: "ИГИЛ / ИГ / Даиш (самопровозглашённый халифат)", az: "İŞİD / İŞİL / Daesh (özünü xilafət elan edən)" },
        next_node: "terminal_islam_isis",
        tags: ["isis", "salafi_jihadist"],
      },
      {
        label: { en: "Boko Haram (West Africa)", ru: "Боко Харам (Западная Африка)", az: "Boko Haram (Qərbi Afrika)" },
        next_node: "terminal_islam_boko_haram",
        tags: ["boko_haram", "salafi_jihadist"],
      },
      {
        label: { en: "Al-Shabaab (East Africa)", ru: "Аш-Шабаб (Восточная Африка)", az: "Əş-Şəbab (Şərqi Afrika)" },
        next_node: "terminal_islam_al_shabaab",
        tags: ["al_shabaab", "salafi_jihadist"],
      },
      {
        label: { en: "Jabhat al-Nusra / HTS (Syria)", ru: "Джабхат ан-Нусра / ХТШ (Сирия)", az: "Cəbhət ən-Nüsrə / HTS (Suriya)" },
        next_node: "terminal_islam_hts",
        tags: ["hts", "salafi_jihadist"],
      },
      {
        label: { en: "Other / not affiliated", ru: "Другое / без аффилиации", az: "Digər / əlaqəsiz" },
        next_node: "terminal_islam_jihadist_other",
        tags: ["jihadist_other", "salafi_jihadist"],
      },
    ],
  },

  salafi_branch: {
    node_id: "salafi_branch",
    question: {
      en: "Which Salafi expression?",
      ru: "Какое салафитское выражение?",
      az: "Hansı Sələfi ifadəsi?",
    },
    options: [
      {
        label: { en: "Pure Salafiyya (revival of the Salaf, non-political)", ru: "Чистая салафия (возрождение салафов, аполитичная)", az: "Saf Sələfiyyə (Sələflərin dirçəlişi, qeyri-siyasi)" },
        next_node: "terminal_islam_pure_salafi",
        tags: ["pure_salafi", "sunni"],
      },
      {
        label: { en: "Quietist / Madkhali Salafi", ru: "Тихий / мадхалитский салафизм", az: "Sakit / Mədxali Sələfi" },
        next_node: "terminal_islam_quietist_salafi",
        tags: ["quietist_salafi", "sunni"],
      },
      {
        label: { en: "Haraki / Activist Salafi (Sahwa, political)", ru: "Хараки / Активистский салафизм (Сахва, политический)", az: "Hərəki / Aktivist Sələfi (Səhva, siyasi)" },
        next_node: "terminal_islam_activist_salafi",
        tags: ["activist_salafi", "sunni"],
      },
      {
        label: { en: "Salafi-Jihadism (violent fringe)", ru: "Салафитский джихадизм (насильственная периферия)", az: "Sələfi-Cihadizm (zorakı kənar)" },
        next_node: "salafi_jihadist_branch",
        tags: ["salafi_jihadist", "sunni"],
      },
    ],
  },

  // ---- Shia Branches ----
  shia_branch: {
    node_id: "shia_branch",
    question: {
      en: "Which Shia succession path (Imam line)?",
      ru: "Какой шиитский путь преемства (линия имамов)?",
      az: "Hansı Şiə varislik yolu (İmam xətti)?",
    },
    hint: {
      en: "Shia split by the number and identity of the Imams.",
      ru: "Шииты разделились по числу и личности имамов.",
      az: "Şiələr İmamların sayına və şəxsiyyətinə görə bölündü.",
    },
    options: [
      {
        label: { en: "Twelver / Imamiyyah (12 Imams, hidden Mahdi)", ru: "Двунадесятники / Имамиты (12 имамов, скрытый Махди)", az: "İsnəƏşəri / İmamiyyə (12 İmam, gizli Məhdi)" },
        next_node: "twelver_branch",
        tags: ["twelver", "shia"],
      },
      {
        label: { en: "Ismaili / Seveners (Aga Khan, esoteric)", ru: "Исмаилиты / Семеричники (Ага Хан, эзотерика)", az: "İsmaili / Yeddilər (Ağa Xan, ezoterik)" },
        next_node: "ismaili_branch",
        tags: ["ismaili", "shia"],
      },
      {
        label: { en: "Zaidi / Fivers (Yemen, closest to Sunni)", ru: "Зейдиты / Пятеричники (Йемен, ближе к суннитам)", az: "Zeydi / Beşlər (Yəmən, Sünniyə ən yaxın)" },
        next_node: "zaidi_branch",
        tags: ["zaidi", "shia"],
      },
      {
        label: { en: "Alawite / Nusayri (Syria, distinct theology)", ru: "Алавиты / Нусайриты (Сирия, особая теология)", az: "Ələvi / Nüsəyri (Suriya, xüsusi teologiya)" },
        next_node: "terminal_islam_alawite",
        tags: ["alawite", "shia"],
      },
      {
        label: { en: "Alevi (Turkey, Anatolian folk Shia)", ru: "Алевиты (Турция, анатолийский народный шиизм)", az: "Ələvi (Türkiyə, Anadolu xalq şiəliyi)" },
        next_node: "terminal_islam_alevi",
        tags: ["alevi", "shia"],
      },
    ],
  },

  twelver_branch: {
    node_id: "twelver_branch",
    question: {
      en: "Which Twelver legal/methodological school?",
      ru: "Какая двунадесятническая правовая школа?",
      az: "Hansı İsnəƏşəri hüquq məktəbi?",
    },
    options: [
      {
        label: { en: "Usuli (dominant ~95%, ijtihad, Marjas)", ru: "Усулиты (доминирующие ~95%, иджтихад, марджи)", az: "Usuli (dominant ~95%, ijtihad, Mərcələr)" },
        next_node: "usuli_branch",
        tags: ["usuli", "twelver"],
      },
      {
        label: { en: "Akhbari (rejects ijtihad, traditions only)", ru: "Ахбариты (отвергают иджтихад, только предания)", az: "Əxbari (ijtihadı rədd edir, yalnız rəvayətlər)" },
        next_node: "terminal_islam_akhbari",
        tags: ["akhbari", "twelver"],
      },
      {
        label: { en: "Shaykhism (19th-c. esoteric, Mahdi anticipation)", ru: "Шейхизм (эзотерика XIX в., ожидание Махди)", az: "Şeyxilik (XIX əsr ezoterikası, Məhdi gözləntisi)" },
        next_node: "terminal_islam_shaykhi",
        tags: ["shaykhi", "twelver"],
      },
    ],
  },

  usuli_branch: {
    node_id: "usuli_branch",
    question: {
      en: "Which Usuli-aligned expression?",
      ru: "Какое усулитское выражение?",
      az: "Hansı Usuli yönümlü ifadə?",
    },
    options: [
      {
        label: { en: "Iranian establishment (Islamic Republic)", ru: "Иранский истеблишмент (Исламская республика)", az: "İran rəhbərliyi (İslam Respublikası)" },
        next_node: "terminal_islam_iranian_establishment",
        tags: ["iranian_establishment", "twelver"],
      },
      {
        label: { en: "Hezbollah-aligned (Lebanon)", ru: "Хезболла-ориентированное (Ливан)", az: "Hizbullah yönümlü (Livan)" },
        next_node: "terminal_islam_hezbollah",
        tags: ["hezbollah", "twelver"],
      },
      {
        label: { en: "Al-Da'wa party (Iraq)", ru: "Партия Да'ва (Ирак)", az: "Dəvət Partiyası (İraq)" },
        next_node: "terminal_islam_al_dawa",
        tags: ["al_dawa", "twelver"],
      },
      {
        label: { en: "Quietist Najaf school (Sistani, apolitical)", ru: "Тихая наджафская школа (Систани, аполитичная)", az: "Sakit Nəcəf məktəbi (Sistani, qeyri-siyasi)" },
        next_node: "terminal_islam_najaf_quietist",
        tags: ["najaf_quietist", "twelver"],
      },
      {
        label: { en: "Azerbaijani / Caspian Twelver (regional)", ru: "Азербайджанский / Каспийский шиизм (региональный)", az: "Azərbaycan / Xəzər İsnəƏşəri (regional)" },
        next_node: "terminal_islam_azerbaijani_twelver",
        tags: ["azerbaijani_twelver", "twelver"],
      },
    ],
  },

  ismaili_branch: {
    node_id: "ismaili_branch",
    question: {
      en: "Which Ismaili (Sevener) lineage?",
      ru: "Какая исмаилитская (семеричная) линия?",
      az: "Hansı İsmaili (yeddi) nəsli?",
    },
    options: [
      {
        label: { en: "Nizari Ismaili (living Imam — Aga Khan)", ru: "Низаритские исмаилиты (живой имам — Ага Хан)", az: "Nizari İsmaili (canlı İmam — Ağa Xan)" },
        next_node: "nizari_branch",
        tags: ["nizari", "ismaili"],
      },
      {
        label: { en: "Musta'li Ismaili (hidden Imam, Bohras)", ru: "Мусталитские исмаилиты (скрытый имам, бохра)", az: "Müstəli İsmaili (gizli İmam, Bohralar)" },
        next_node: "mustali_branch",
        tags: ["mustali", "ismaili"],
      },
      {
        label: { en: "Other Ismaili / not affiliated", ru: "Другие исмаилиты / без аффилиации", az: "Digər İsmaili / əlaqəsiz" },
        next_node: "terminal_islam_ismaili_other",
        tags: ["ismaili_other", "ismaili"],
      },
    ],
  },

  nizari_branch: {
    node_id: "nizari_branch",
    question: {
      en: "Which Nizari expression?",
      ru: "Какое низаритское выражение?",
      az: "Hansı Nizari ifadəsi?",
    },
    options: [
      {
        label: { en: "Modern Nizari Ismaili (Aga Khan IV, pluralism)", ru: "Современные низариты (Ага Хан IV, плюрализм)", az: "Müasir Nizari İsmaili (Ağa Xan IV, plüralizm)" },
        next_node: "terminal_islam_nizari_modern",
        tags: ["nizari_modern", "ismaili"],
      },
      {
        label: { en: "Nizari historical / Hashashin heritage (Alamut)", ru: "Историческое наследие низаритов / ассасинов (Аламут)", az: "Nizari tarixi / Haşşaşin irsi (Alamut)" },
        next_node: "terminal_islam_hashashin",
        tags: ["hashashin", "ismaili"],
      },
    ],
  },

  mustali_branch: {
    node_id: "mustali_branch",
    question: {
      en: "Which Musta'li Bohra community?",
      ru: "Какая мусталитская община бохра?",
      az: "Hansı Müstəli Bohra icması?",
    },
    options: [
      {
        label: { en: "Dawoodi Bohras (Mumbai/Gujarat, Da'i al-Mutlaq)", ru: "Давуди бохра (Мумбаи/Гуджарат, да'и аль-мутлак)", az: "Davudi Bohralar (Mumbay/Qucarat, Dai əl-Mütləq)" },
        next_node: "terminal_islam_dawoodi_bohra",
        tags: ["dawoodi_bohra", "ismaili"],
      },
      {
        label: { en: "Sulaymani Bohras (Yemen)", ru: "Сулеймани бохра (Йемен)", az: "Süleymani Bohralar (Yəmən)" },
        next_node: "terminal_islam_sulaymani_bohra",
        tags: ["sulaymani_bohra", "ismaili"],
      },
      {
        label: { en: "Alavi Bohras (India)", ru: "Алави бохра (Индия)", az: "Əlavi Bohralar (Hindistan)" },
        next_node: "terminal_islam_alavi_bohra",
        tags: ["alavi_bohra", "ismaili"],
      },
    ],
  },

  zaidi_branch: {
    node_id: "zaidi_branch",
    question: {
      en: "Which Zaidi (Fiver) expression?",
      ru: "Какое зейдитское (пятеричное) выражение?",
      az: "Hansı Zeydi (beşli) ifadəsi?",
    },
    options: [
      {
        label: { en: "Traditional Zaidi (Yemen, hadawi school)", ru: "Традиционные зейдиты (Йемен, хадавитская школа)", az: "Ənənəvi Zeydi (Yəmən, Hədəvi məktəbi)" },
        next_node: "terminal_islam_zaidi_traditional",
        tags: ["zaidi_traditional", "shia"],
      },
      {
        label: { en: "Houthi / Ansar Allah-aligned (Yemen, political-militant)", ru: "Хуситы / Ансар Аллах (Йемен, политико-воинственное)", az: "Husi / Ənsar Allah yönümlü (Yəmən, siyasi-hərbi)" },
        next_node: "terminal_islam_houthi",
        tags: ["houthi", "zaidi"],
      },
    ],
  },

  // ---- Sufi Tariqas ----
  sufi_tariqa: {
    node_id: "sufi_tariqa",
    question: {
      en: "Which Sufi order (Tariqa)?",
      ru: "Какой суфийский орден (тарика)?",
      az: "Hansı Sufi təriqəti?",
    },
    options: [
      {
        label: { en: "Qadiriyya (Abdul-Qadir Gilani)", ru: "Кадирийя (Абдул-Кадир Гилани)", az: "Qadiriyyə (Əbdülqadir Gilani)" },
        next_node: "terminal_islam_qadiriyya",
        tags: ["qadiriyya", "sufi"],
      },
      {
        label: { en: "Naqshbandi (Central Asia, Turkey)", ru: "Накшбанди (Центральная Азия, Турция)", az: "Nəqşibəndi (Orta Asiya, Türkiyə)" },
        next_node: "terminal_islam_naqshbandi",
        tags: ["naqshbandi", "sufi"],
      },
      {
        label: { en: "Mevlevi (Rumi, whirling dervishes)", ru: "Мевлеви (Руми, кружащиеся дервиши)", az: "Mövləvi (Rumi, fırlanan dərvişlər)" },
        next_node: "terminal_islam_mevlevi",
        tags: ["mevlevi", "sufi"],
      },
      {
        label: { en: "Chishti (Indian subcontinent)", ru: "Чишти (Индийский субконтинент)", az: "Çişti (Hindistan yarımadası)" },
        next_node: "terminal_islam_chishti",
        tags: ["chishti", "sufi"],
      },
      {
        label: { en: "Shadhili / Tijani / Rifa'i (Africa, Middle East)", ru: "Шазили / Тижани / Рифаи (Африка, Ближний Восток)", az: "Şazili / Ticani / Rəfai (Afrika, Yaxın Şərq)" },
        next_node: "terminal_islam_shadhiliyya",
        tags: ["shadhili", "sufi"],
      },
      {
        label: { en: "Non-affiliated Sufi / Islamic mysticism", ru: "Неаффилированный суфизм / исламский мистицизм", az: "Əlaqəsiz Sufi / İslam mistisizmi" },
        next_node: "terminal_islam_sufi_other",
        tags: ["sufi_other", "sufi"],
      },
    ],
  },

  // ============ JUDAISM DEEP DIVE ============
  judaism_major_branch: {
    node_id: "judaism_major_branch",
    question: {
      en: "Which Jewish movement?",
      ru: "Какое еврейское движение?",
      az: "Hansı Yəhudi hərəkatı?",
    },
    hint: {
      en: "Modern Judaism categorized by adherence to Halakha (Jewish law).",
      ru: "Современный иудаизм по приверженности Галахе (еврейскому закону).",
      az: "Müasir Yəhudilik Halaxaya (Yəhudi qanunu) sadiqlik üzrə.",
    },
    options: [
      {
        label: { en: "Orthodox Judaism (Torah is binding)", ru: "Ортодоксальный иудаизм (Тора обязательна)", az: "Ortodoks Yəhudilik (Tövrat məcburidir)" },
        next_node: "orthodox_judaism_branch",
        tags: ["orthodox_jewish", "judaism"],
      },
      {
        label: { en: "Conservative Judaism (Halakha evolves)", ru: "Консервативный иудаизм (Галаха развивается)", az: "Konservativ Yəhudilik (Halaxa inkişaf edir)" },
        next_node: "terminal_judaism_conservative",
        tags: ["conservative_jewish", "judaism"],
      },
      {
        label: { en: "Reform / Progressive Judaism (ethics over law)", ru: "Реформистский / Прогрессивный иудаизм (этика над законом)", az: "Reform / Proqressiv Yəhudilik (qanun üzərində etika)" },
        next_node: "terminal_judaism_reform",
        tags: ["reform_jewish", "judaism"],
      },
      {
        label: { en: "Reconstructionist Judaism (Judaism as civilization)", ru: "Реконструктивистский иудаизм (иудаизм как цивилизация)", az: "Rekonstruksionist Yəhudilik (Yəhudilik sivilizasiya kimi)" },
        next_node: "terminal_judaism_reconstructionist",
        tags: ["reconstructionist", "judaism"],
      },
      {
        label: { en: "Karaite Judaism (Torah only, no Talmud)", ru: "Караимский иудаизм (только Тора, без Талмуда)", az: "Karaim Yəhudiliyi (yalnız Tövrat, Talmudsuz)" },
        next_node: "terminal_judaism_karaites",
        tags: ["karaite", "judaism"],
      },
      {
        label: { en: "Samaritans (Mount Gerizim, own Torah)", ru: "Самаритяне (гора Гаризим, своя Тора)", az: "Samariyalılar (Gerizim dağı, öz Tövratı)" },
        next_node: "terminal_judaism_samaritan",
        tags: ["samaritan", "judaism"],
      },
    ],
  },

  orthodox_judaism_branch: {
    node_id: "orthodox_judaism_branch",
    question: {
      en: "Which Orthodox Jewish path?",
      ru: "Какой ортодоксально-еврейский путь?",
      az: "Hansı Ortodoks Yəhudi yolu?",
    },
    options: [
      {
        label: { en: "Haredi / Ultra-Orthodox (separation from secular)", ru: "Хареди / Ультра-ортодоксальный (отделение от светского)", az: "Haredi / Ultra-Ortodoks (dünyəvidən ayrılma)" },
        next_node: "haredi_branch",
        tags: ["haredi", "orthodox_jewish"],
      },
      {
        label: { en: "Modern Orthodox (Halakha + modern life)", ru: "Современный ортодоксальный (Галаха + современная жизнь)", az: "Müasir Ortodoks (Halaxa + müasir həyat)" },
        next_node: "modern_orthodox_branch",
        tags: ["modern_orthodox", "orthodox_jewish"],
      },
      {
        label: { en: "Centrist Orthodoxy (Yeshiva University)", ru: "Центристская ортодоксия (Университет Ешивы)", az: "Mərkəzçi Ortodoksiya (Yeşiva Universiteti)" },
        next_node: "terminal_judaism_centrist",
        tags: ["centrist_orthodox", "orthodox_jewish"],
      },
      {
        label: { en: "Hardal / Nationalist Haredi (Torah + Zionism)", ru: "Хардаль / Националистический хареди (Тора + сионизм)", az: "Hardal / Millətçi Haredi (Tövrat + Sionizm)" },
        next_node: "terminal_judaism_hardal",
        tags: ["hardal", "orthodox_jewish"],
      },
    ],
  },

  haredi_branch: {
    node_id: "haredi_branch",
    question: {
      en: "Which Haredi community?",
      ru: "Какая хареди-община?",
      az: "Hansı Haredi icması?",
    },
    options: [
      {
        label: { en: "Hasidic (mystical joy, Rebbes)", ru: "Хасидская (мистическая радость, ребе)", az: "Xasidik (mistik sevinc, Rebbelər)" },
        next_node: "hasidic_branch",
        tags: ["hasidic", "haredi"],
      },
      {
        label: { en: "Misnagdim / Litvish (Talmudic intellect)", ru: "Миснагдим / Литваки (талмудический интеллект)", az: "Misnaqdim / Litvaş (Talmud intellekti)" },
        next_node: "terminal_judaism_litvish",
        tags: ["litvish", "haredi"],
      },
      {
        label: { en: "Sephardic Haredi (Shas, Mizrahi tradition)", ru: "Сефардские хареди (ШАС, мизрахи-традиция)", az: "Sefarad Haredi (ŞAS, Mizraxi ənənəsi)" },
        next_node: "terminal_judaism_sephardic_haredi",
        tags: ["sephardic_haredi", "haredi"],
      },
    ],
  },

  hasidic_branch: {
    node_id: "hasidic_branch",
    question: {
      en: "Which Hasidic dynasty?",
      ru: "Какая хасидская династия?",
      az: "Hansı Xasidik sülaləsi?",
    },
    options: [
      {
        label: { en: "Chabad-Lubavitch (global outreach)", ru: "Хабад-Любавич (глобальная миссия)", az: "Xabad-Lubaviç (qlobal missiya)" },
        next_node: "terminal_judaism_chabad",
        tags: ["chabad", "hasidic"],
      },
      {
        label: { en: "Satmar (insulated, anti-Zionist)", ru: "Сатмар (изолированный, антисионистский)", az: "Satmar (təcrid olunmuş, anti-Sionist)" },
        next_node: "terminal_judaism_satmar",
        tags: ["satmar", "hasidic"],
      },
      {
        label: { en: "Bobov / Ger / Belz / Vizhnitz (Polish-Hungarian dynasties)", ru: "Бобов / Гер / Белз / Вижниц (польско-венгерские династии)", az: "Bobov / Ger / Belz / Vişnits (Polşa-Macar sülalələri)" },
        next_node: "terminal_judaism_other_hasidic",
        tags: ["other_hasidic", "hasidic"],
      },
    ],
  },

  modern_orthodox_branch: {
    node_id: "modern_orthodox_branch",
    question: {
      en: "Which Modern Orthodox expression?",
      ru: "Какое современное ортодоксальное выражение?",
      az: "Hansı Müasir Ortodoks ifadəsi?",
    },
    options: [
      {
        label: { en: "Religious Zionism (Mizrachi, Bnei Akiva)", ru: "Религиозный сионизм (Мизрахи, Бней-Акива)", az: "Dini Sionizm (Mizraxi, Bney-Akiva)" },
        next_node: "terminal_judaism_religious_zionist",
        tags: ["religious_zionist", "modern_orthodox"],
      },
      {
        label: { en: "Open Orthodoxy (progressive within Orthodoxy)", ru: "Открытая ортодоксия (прогрессивная внутри ортодоксии)", az: "Açıq Ortodoksiya (Ortodoksiya daxilində progressiv)" },
        next_node: "terminal_judaism_open_orthodox",
        tags: ["open_orthodox", "modern_orthodox"],
      },
      {
        label: { en: "Torah Umadda (Yeshiva University philosophy)", ru: "Тора у-Мадда (философия Университета Ешивы)", az: "Tövra u-Madda (Yeşiva Universiteti fəlsəfəsi)" },
        next_node: "terminal_judaism_torah_umadda",
        tags: ["torah_umadda", "modern_orthodox"],
      },
    ],
  },

  // ============ OTHER UNITARIAN / ABRAHAMIC-ADJACENT ============
  other_unitarian_branch: {
    node_id: "other_unitarian_branch",
    question: {
      en: "Which other unitarian tradition?",
      ru: "Какая другая унитарианская традиция?",
      az: "Hansı digər unitarian ənənə?",
    },
    options: [
      {
        label: { en: "Baha'i Faith (Bahá'u'lláh, unity of religions)", ru: "Вера Бахаи (Бахаулла, единство религий)", az: "Bəhai Dini (Bəhaullah, dinlərin birliyi)" },
        next_node: "terminal_bahai",
        tags: ["bahai", "unitarian"],
      },
      {
        label: { en: "Druze (esoteric offshoot of Ismailism)", ru: "Друзы (эзотерическая ветвь исмаилизма)", az: "Druzlar (İsmailizmin ezoterik qolu)" },
        next_node: "terminal_druze",
        tags: ["druze", "unitarian"],
      },
      {
        label: { en: "Samaritan / Karaite (early Israelite divisions)", ru: "Самаритяне / Караимы (ранние израильские разделения)", az: "Samariyalı / Karaim (erkən İsrail bölgüləri)" },
        next_node: "terminal_judaism_samaritan",
        tags: ["samaritan", "unitarian"],
      },
      {
        label: { en: "Unitarian Universalism (non-creedal)", ru: "Унитарианский универсализм (некредовый)", az: "Unitarian Universalizm (kredosuz)" },
        next_node: "terminal_restorationist_unitarian",
        tags: ["unitarian_universalism", "unitarian"],
      },
    ],
  },

  // ============ HINDUISM DEEP DIVE ============
  hindu_tradition: {
    node_id: "hindu_tradition",
    question: {
      en: "Which Hindu tradition (sampradaya)?",
      ru: "Какая индуистская традиция (сампрадая)?",
      az: "Hansı Hindu ənənəsi (sampradaya)?",
    },
    hint: {
      en: "The four major denominations of Sanatana Dharma.",
      ru: "Четыре основные деноминации санатана-дхармы.",
      az: "Sanatana Dxarmanın dörd əsas məzhəbi.",
    },
    options: [
      {
        label: { en: "Vaishnavism (Vishnu/Krishna as Supreme)", ru: "Вайшнавизм (Вишну/Кришна как Верховный)", az: "Vaişnavizm (Vişnu/Krişna Ali kimi)" },
        next_node: "vaishnava_branch",
        tags: ["vaishnava", "hindu"],
      },
      {
        label: { en: "Shaivism (Shiva as Supreme)", ru: "Шиваизм (Шива как Верховный)", az: "Şaivizm (Şiva Ali kimi)" },
        next_node: "shaiva_branch",
        tags: ["shaiva", "hindu"],
      },
      {
        label: { en: "Shaktism (Goddess/Devi as Supreme)", ru: "Шактизм (Богиня/Деви как Верховная)", az: "Şaktizm (İlahə/Devi Ali kimi)" },
        next_node: "shakta_branch",
        tags: ["shakta", "hindu"],
      },
      {
        label: { en: "Smartism (five deities, Advaita Vedanta)", ru: "Смартизм (пять божеств, адвайта-веданта)", az: "Smartizm (beş tanrı, Advaita Vedanta)" },
        next_node: "smartism_branch",
        tags: ["smartism", "hindu"],
      },
      {
        label: { en: "Ayyavazhi / Other new Hindu movements", ru: "Айяважи / Другие новые индуистские движения", az: "Ayyavaji / Digər yeni Hindu hərəkatları" },
        next_node: "terminal_hindu_other",
        tags: ["other_hindu", "hindu"],
      },
    ],
  },

  vaishnava_branch: {
    node_id: "vaishnava_branch",
    question: {
      en: "Which Vaishnava lineage?",
      ru: "Какая вайшнавская линия?",
      az: "Hansı Vaişnava nəsli?",
    },
    options: [
      {
        label: { en: "ISKCON / Hare Krishna (Gaudiya Vaishnavism)", ru: "ИСККОН / Харе Кришна (гаудия-вайшнавизм)", az: "ISKCON / Hare Krişna (Qaudiya Vaişnavizm)" },
        next_node: "terminal_hindu_iskcon",
        tags: ["iskcon", "vaishnava"],
      },
      {
        label: { en: "Swaminarayan (BAPS, Akshar-Purushottam)", ru: "Сваминараян (BAPS, Акшар-Пурушоттам)", az: "Svaminarayan (BAPS, Akşar-Puruşottam)" },
        next_node: "terminal_hindu_swaminarayan",
        tags: ["swaminarayan", "vaishnava"],
      },
      {
        label: { en: "Sri Vaishnava (Ramanuja, Vishishtadvaita)", ru: "Шри-вайшнава (Рамануджа, вишиштадвайта)", az: "Şri Vaişnava (Ramanuca, Vişiştadvaita)" },
        next_node: "terminal_hindu_sri_vaishnava",
        tags: ["sri_vaishnava", "vaishnava"],
      },
      {
        label: { en: "Madhva Vaishnava (Dvaita, dualism)", ru: "Мадхва-вайшнава (двайта, дуализм)", az: "Madhva Vaişnava (Dvayta, dualizm)" },
        next_node: "terminal_hindu_madhva",
        tags: ["madhva", "vaishnava"],
      },
      {
        label: { en: "Ramanandi / North Indian bhakti (Tulsidas)", ru: "Рамананди / Североиндийский бхакти (Тулсидас)", az: "Ramanandi / Şimali Hindistan bhakti (Tulsidas)" },
        next_node: "terminal_hindu_ramandi",
        tags: ["ramanandi", "vaishnava"],
      },
    ],
  },

  shaiva_branch: {
    node_id: "shaiva_branch",
    question: {
      en: "Which Shaiva lineage?",
      ru: "Какая шиваитская линия?",
      az: "Hansı Şaiva nəsli?",
    },
    options: [
      {
        label: { en: "Shaiva Siddhanta (Tamil Nadu, dualist)", ru: "Шайва-сиддханта (Тамил-Наду, дуалистическая)", az: "Şaiva Siddhanta (Tamil Nadu, dualist)" },
        next_node: "terminal_hindu_shaiva_siddhanta",
        tags: ["shaiva_siddhanta", "shaiva"],
      },
      {
        label: { en: "Kashmir Shaivism (Trika, monistic)", ru: "Кашмирский шиваизм (Трика, монистический)", az: "Kəşmir Şaivizmi (Trika, monistik)" },
        next_node: "terminal_hindu_kashmir_shaiva",
        tags: ["kashmir_shaiva", "shaiva"],
      },
      {
        label: { en: "Lingayat / Virashaiva (Basava, no Vedic rituals)", ru: "Лингаяты / Вирашайвы (Басава, без ведических ритуалов)", az: "Linqayat / Virasaiva (Basava, Veda ritualları olmadan)" },
        next_node: "terminal_hindu_lingayat",
        tags: ["lingayat", "shaiva"],
      },
      {
        label: { en: "Nath / Hatha Yoga tradition (Gorakhnath)", ru: "Натх / Хатха-йога (Горакхнатх)", az: "Nat / Hatha Yoqa ənənəsi (Qorakhnat)" },
        next_node: "terminal_hindu_nath",
        tags: ["nath", "shaiva"],
      },
    ],
  },

  shakta_branch: {
    node_id: "shakta_branch",
    question: {
      en: "Which Shakta tradition?",
      ru: "Какая шактистская традиция?",
      az: "Hansı Şakta ənənəsi?",
    },
    options: [
      {
        label: { en: "Kali worship (Bengal, Ramakrishna)", ru: "Поклонение Кали (Бенгалия, Рамакришна)", az: "Kali ibadəti (Benqal, Ramakrişna)" },
        next_node: "terminal_hindu_kali",
        tags: ["kali", "shakta"],
      },
      {
        label: { en: "Sri Vidya / Lalita (Tantric goddess worship)", ru: "Шри-видья / Лалита (тантрическое почитание богини)", az: "Şri Vidya / Lalita (tantrik ilahə ibadəti)" },
        next_node: "terminal_hindu_sri_vidya",
        tags: ["sri_vidya", "shakta"],
      },
      {
        label: { en: "Durga / Navaratri devotional (mainstream Shakta)", ru: "Дурга / Наваратри (мейнстримный шактизм)", az: "Durqa / Navaratri ibadəti (meynstrim Şakta)" },
        next_node: "terminal_hindu_durga",
        tags: ["durga", "shakta"],
      },
    ],
  },

  smartism_branch: {
    node_id: "smartism_branch",
    question: {
      en: "Which Smartist / Advaita expression?",
      ru: "Какое смартистское / адвайтистское выражение?",
      az: "Hansı Smartist / Advaita ifadəsi?",
    },
    options: [
      {
        label: { en: "Advaita Vedanta (Shankara, non-dualism)", ru: "Адвайта-веданта (Шанкара, недуализм)", az: "Advaita Vedanta (Şankara, qeyri-dualizm)" },
        next_node: "terminal_hindu_advaita",
        tags: ["advaita", "smartism"],
      },
      {
        label: { en: "Neo-Vedanta / Integral Yoga (Vivekananda, Aurobindo)", ru: "Нео-веданта / Интегральная йога (Вивекананда, Ауробиндо)", az: "Neo-Vedanta / İnteqral Yoqa (Vivekananda, Aurobindo)" },
        next_node: "terminal_hindu_neo_vedanta",
        tags: ["neo_vedanta", "smartism"],
      },
      {
        label: { en: "Arsha / Vedic orthopraxy (ritual Smarta)", ru: "Арша / Ведическая ортопраксия (ритуальный смартизм)", az: "Arşa / Veda ortopraksiyası (ritual Smarta)" },
        next_node: "terminal_hindu_arsha",
        tags: ["arsha", "smartism"],
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
  terminal_bahai: {
    node_id: "terminal_bahai",
    title: { en: "The Bahá'í", ru: "Бахаи", az: "Bəhai" },
    blueprint: {
      en: "You follow the Bahá'í Faith — the unity of God, the unity of religion, and the unity of humanity. Bahá'u'lláh is the latest Messenger in a line that includes Abraham, Moses, Buddha, Jesus, and Muhammad.",
      ru: "Вы следуете вере Бахаи — единство Бога, единство религии и единство человечества. Бахаулла — последний Посланник в линии, включающей Авраама, Моисея, Будду, Иисуса и Мухаммада.",
      az: "Siz Bəhai dininə — Tanrının, dinin və bəşəriyyətin birliyinə inanırsınız. Bəhaullah İbrahim, Musa, Buddha, İsa və Məhəmmədi əhatə edən xəttin son Elçisidir.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Bahá'u'lláh", ru: "Бахаулла", az: "Bəhaullah" },
      { en: "Abdul-Baha", ru: "Абдул-Баха", az: "Əbdül-Bəha" },
      { en: "Shoghi Effendi", ru: "Шоги Эффенди", az: "Şoqi Əffəndi" },
    ],
    tags: ["bahai"],
  },
  terminal_druze: {
    node_id: "terminal_druze",
    title: { en: "The Druze", ru: "Друз", az: "Druz" },
    blueprint: {
      en: "You belong to the Druze tradition — an esoteric offshoot of Ismaili Shia, centered on the divine call of al-Hakim bi-Amr Allah, with belief in reincarnation and a hidden inner doctrine (batin).",
      ru: "Вы принадлежите к традиции друзов — эзотерической ветви исмаилитского шиизма, сосредоточенной на божественном призыве аль-Хакима би-Амриллаха, с верой в реинкарнацию и скрытым внутренним учением (батин).",
      az: "Siz Druz ənənəsinə aidsiniz — İsmaili şiəliyinin ezoterik qolu, əl-Hakim bi-Əmr Allahın ilahi çağırışına əsaslanan, reinkarnasiyaya inam və gizli daxili təlim (batin) ilə.",
    },
    social_proof: 170,
    percent_of_users: 1,
    similar_minds: [
      { en: "Al-Hakim bi-Amr Allah", ru: "Аль-Хаким би-Амриллах", az: "əl-Hakim bi-Əmr Allah" },
      { en: "Hamza ibn Ali", ru: "Хамза ибн Али", az: "Həmzə ibn Əli" },
    ],
    tags: ["druze"],
  },
  terminal_catholic_scholastic: {
    node_id: "terminal_catholic_scholastic",
    title: { en: "The Scholastic Catholic", ru: "Схоластический католик", az: "Sxolastik katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Thomistic — reason and faith in harmony tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Thomistic — reason and faith in harmony spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Thomistic — reason and faith in harmony. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Thomistic — reason and faith in harmony внутри вселенской католической веры.",
      az: "Siz Thomistic — reason and faith in harmony ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Thomistic — reason and faith in harmony mənəviyyatıdır.",
    },
    social_proof: 1890,
    percent_of_users: 9,
    similar_minds: [
      { en: "Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Augustine", ru: "Августин", az: "Avqustin" },
      { en: "Blaise Pascal", ru: "Блез Паскаль", az: "Blez Paskal" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_mystical: {
    node_id: "terminal_catholic_mystical",
    title: { en: "The Augustinian Mystic", ru: "Августинский мистик", az: "Avqustin mistiki" },
    blueprint: {
      en: "You are a Catholic Christian of the Augustinian — grace, interiority, and divine love tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Augustinian — grace, interiority, and divine love spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Augustinian — grace, interiority, and divine love. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Augustinian — grace, interiority, and divine love внутри вселенской католической веры.",
      az: "Siz Augustinian — grace, interiority, and divine love ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Augustinian — grace, interiority, and divine love mənəviyyatıdır.",
    },
    social_proof: 1120,
    percent_of_users: 6,
    similar_minds: [
      { en: "Augustine", ru: "Августин", az: "Avqustin" },
      { en: "Thomas Merton", ru: "Томас Мертон", az: "Tomas Merton" },
      { en: "Julian of Norwich", ru: "Юлиана Норвичская", az: "Norviçli Yuliana" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_charismatic: {
    node_id: "terminal_catholic_charismatic",
    title: { en: "The Charismatic Catholic", ru: "Харизматический католик", az: "Xarizmatik katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Charismatic Renewal — baptism of the Holy Spirit tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Charismatic Renewal — baptism of the Holy Spirit spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Charismatic Renewal — baptism of the Holy Spirit. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Charismatic Renewal — baptism of the Holy Spirit внутри вселенской католической веры.",
      az: "Siz Charismatic Renewal — baptism of the Holy Spirit ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Charismatic Renewal — baptism of the Holy Spirit mənəviyyatıdır.",
    },
    social_proof: 880,
    percent_of_users: 4,
    similar_minds: [
      { en: "Francis", ru: "Франциск", az: "Fransisk" },
      { en: "Pope John Paul II", ru: "Папа Иоанн Павел II", az: "Papa İohann Pavel II" },
      { en: "Raniero Cantalamessa", ru: "Раниеро Канталамесса", az: "Raniero Kantalamezza" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_traditionalist: {
    node_id: "terminal_catholic_traditionalist",
    title: { en: "The Traditionalist Catholic", ru: "Традиционалистский католик", az: "Tradisionalist katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Tridentine — pre-Vatican II Latin Mass and reverence tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Tridentine — pre-Vatican II Latin Mass and reverence spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Tridentine — pre-Vatican II Latin Mass and reverence. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Tridentine — pre-Vatican II Latin Mass and reverence внутри вселенской католической веры.",
      az: "Siz Tridentine — pre-Vatican II Latin Mass and reverence ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Tridentine — pre-Vatican II Latin Mass and reverence mənəviyyatıdır.",
    },
    social_proof: 740,
    percent_of_users: 4,
    similar_minds: [
      { en: "Marcel Lefebvre", ru: "Марсель Лефевр", az: "Marsel Lefevr" },
      { en: "G.K. Chesterton", ru: "Г.К. Честертон", az: "Q.K. Çesterton" },
      { en: "Bishop Athanasius Schneider", ru: "Епископ Афанасий Шнайдер", az: "Yepiskop Afanasius Şnayder" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_liberation: {
    node_id: "terminal_catholic_liberation",
    title: { en: "The Liberation Theologian", ru: "Теолог освобождения", az: "Azadlıq ilahiyyatçısı" },
    blueprint: {
      en: "You are a Catholic Christian of the Liberation Theology — God's option for the poor tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Liberation Theology — God's option for the poor spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Liberation Theology — God's option for the poor. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Liberation Theology — God's option for the poor внутри вселенской католической веры.",
      az: "Siz Liberation Theology — God's option for the poor ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Liberation Theology — God's option for the poor mənəviyyatıdır.",
    },
    social_proof: 990,
    percent_of_users: 5,
    similar_minds: [
      { en: "Gustavo Gutiérrez", ru: "Густаво Гутьеррес", az: "Qustavo Qutyerrez" },
      { en: "Óscar Romero", ru: "Оскар Ромеро", az: "Oskar Romero" },
      { en: "Jon Sobrino", ru: "Хон Собрино", az: "Con Sobrino" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_maronite: {
    node_id: "terminal_catholic_maronite",
    title: { en: "The Maronite Catholic", ru: "Маронитский католик", az: "Maronit katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy внутри вселенской католической веры.",
      az: "Siz Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Maronite Church of Lebanon — Antiochene rite, Aramaic liturgy mənəviyyatıdır.",
    },
    social_proof: 450,
    percent_of_users: 2,
    similar_minds: [
      { en: "Saint Maron", ru: "Святой Марон", az: "Müqəddəs Maron" },
      { en: "Charbel Makhlouf", ru: "Шарбель Махлуф", az: "Şarbel Maxluf" },
      { en: "Gibran Khalil Gibran", ru: "Джебран Халиль Джебран", az: "Cübran Xəlil Cübran" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_melkite: {
    node_id: "terminal_catholic_melkite",
    title: { en: "The Melkite Catholic", ru: "Мелькитский католик", az: "Melkit katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Melkite Greek Catholic — Byzantine rite in communion with Rome tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Melkite Greek Catholic — Byzantine rite in communion with Rome spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Melkite Greek Catholic — Byzantine rite in communion with Rome. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Melkite Greek Catholic — Byzantine rite in communion with Rome внутри вселенской католической веры.",
      az: "Siz Melkite Greek Catholic — Byzantine rite in communion with Rome ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Melkite Greek Catholic — Byzantine rite in communion with Rome mənəviyyatıdır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Maximos IV Sayegh", ru: "Максим IV Сайег", az: "Maksimos IV Sayeğ" },
      { en: "Saint John of Damascus", ru: "Иоанн Дамаскин", az: "Dəməşqli Yəhya" },
      { en: "The Eastern Fathers", ru: "Восточные отцы", az: "Şərq ataları" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_ukrainian: {
    node_id: "terminal_catholic_ukrainian",
    title: { en: "The Ukrainian Greek Catholic", ru: "Украинский греко-католик", az: "Ukrayna yunan-katoliki" },
    blueprint: {
      en: "You are a Catholic Christian of the Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite внутри вселенской католической веры.",
      az: "Siz Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Ukrainian Greek Catholic — largest Eastern Catholic Church, Byzantine rite mənəviyyatıdır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Andrey Sheptytsky", ru: "Андрей Шептицкий", az: "Andrey Şeptitski" },
      { en: "Josyf Slipyj", ru: "Иосиф Слипый", az: "Yosıf Slıpıy" },
      { en: "The Eastern Fathers", ru: "Восточные отцы", az: "Şərq ataları" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_chaldean: {
    node_id: "terminal_catholic_chaldean",
    title: { en: "The Chaldean Catholic", ru: "Халдейский католик", az: "Xaldey katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Chaldean Catholic Church of Iraq — East Syriac rite tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Chaldean Catholic Church of Iraq — East Syriac rite spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Chaldean Catholic Church of Iraq — East Syriac rite. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Chaldean Catholic Church of Iraq — East Syriac rite внутри вселенской католической веры.",
      az: "Siz Chaldean Catholic Church of Iraq — East Syriac rite ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Chaldean Catholic Church of Iraq — East Syriac rite mənəviyyatıdır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Saint Thomas the Apostle", ru: "Апостол Фома", az: "Həvari Tomas" },
      { en: "Patriarch Louis Raphaël I Sako", ru: "Патриарх Луи Рафаэль I Сако", az: "Patriarx Lui Rafael I Sako" },
      { en: "The Eastern Fathers", ru: "Восточные отцы", az: "Şərq ataları" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_syro: {
    node_id: "terminal_catholic_syro",
    title: { en: "The Syro-Malabar Catholic", ru: "Сиро-малабарский католик", az: "Siro-malabar katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians внутри вселенской католической веры.",
      az: "Siz Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Syro-Malabar / Syro-Malankara Church of India — Saint Thomas Christians mənəviyyatıdır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Saint Thomas the Apostle", ru: "Апостол Фома", az: "Həvari Tomas" },
      { en: "Kuriakose Elias Chavara", ru: "Куриакос Элиас Чавара", az: "Kuriakose Elias Çavara" },
      { en: "The Eastern Fathers", ru: "Восточные отцы", az: "Şərq ataları" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_other_eastern: {
    node_id: "terminal_catholic_other_eastern",
    title: { en: "The Other Eastern Catholic", ru: "Другой восточный католик", az: "Digər şərqi katolik" },
    blueprint: {
      en: "You are a Catholic Christian of the Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome внутри вселенской католической веры.",
      az: "Siz Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Other Eastern Catholic Church — Coptic, Armenian, Romanian, Ruthenian, or Ethiopian rites in union with Rome mənəviyyatıdır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Pope Francis", ru: "Папа Франциск", az: "Papa Fransisk" },
      { en: "Various Eastern patriarchs", ru: "Различные восточные патриархи", az: "Müxtəlif şərq patriarxları" },
      { en: "The Eastern Fathers", ru: "Восточные отцы", az: "Şərq ataları" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_jesuit: {
    node_id: "terminal_catholic_jesuit",
    title: { en: "The Jesuit", ru: "Иезуит", az: "İezuit" },
    blueprint: {
      en: "You are a Catholic Christian of the Jesuit — Ignatian discernment, education, and 'finding God in all things' tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Jesuit — Ignatian discernment, education, and 'finding God in all things' spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Jesuit — Ignatian discernment, education, and 'finding God in all things'. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Jesuit — Ignatian discernment, education, and 'finding God in all things' внутри вселенской католической веры.",
      az: "Siz Jesuit — Ignatian discernment, education, and 'finding God in all things' ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Jesuit — Ignatian discernment, education, and 'finding God in all things' mənəviyyatıdır.",
    },
    social_proof: 1340,
    percent_of_users: 7,
    similar_minds: [
      { en: "Ignatius of Loyola", ru: "Игнатий Лойола", az: "İqnati Loyola" },
      { en: "Francis Xavier", ru: "Франциск Ксаверий", az: "Fransisk Ksaveri" },
      { en: "Pope Francis", ru: "Папа Франциск", az: "Papa Fransisk" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_franciscan: {
    node_id: "terminal_catholic_franciscan",
    title: { en: "The Franciscan", ru: "Францисканец", az: "Fransiskan" },
    blueprint: {
      en: "You are a Catholic Christian of the Franciscan — poverty, love of creation, and the crucified Christ tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Franciscan — poverty, love of creation, and the crucified Christ spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Franciscan — poverty, love of creation, and the crucified Christ. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Franciscan — poverty, love of creation, and the crucified Christ внутри вселенской католической веры.",
      az: "Siz Franciscan — poverty, love of creation, and the crucified Christ ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Franciscan — poverty, love of creation, and the crucified Christ mənəviyyatıdır.",
    },
    social_proof: 1120,
    percent_of_users: 6,
    similar_minds: [
      { en: "Francis of Assisi", ru: "Франциск Ассизский", az: "Assizi Fransisk" },
      { en: "Clare of Assisi", ru: "Клара Ассизская", az: "Assizi Klara" },
      { en: "Bonaventure", ru: "Бонавентура", az: "Bonaventura" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_dominican: {
    node_id: "terminal_catholic_dominican",
    title: { en: "The Dominican", ru: "Доминиканец", az: "Dominikan" },
    blueprint: {
      en: "You are a Catholic Christian of the Dominican — veritas, preaching, and rigorous study tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Dominican — veritas, preaching, and rigorous study spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Dominican — veritas, preaching, and rigorous study. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Dominican — veritas, preaching, and rigorous study внутри вселенской католической веры.",
      az: "Siz Dominican — veritas, preaching, and rigorous study ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Dominican — veritas, preaching, and rigorous study mənəviyyatıdır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "Dominic de Guzmán", ru: "Доминик де Гусман", az: "Dominik de Qusman" },
      { en: "Thomas Aquinas", ru: "Фома Аквинский", az: "Toma Akvinalı" },
      { en: "Catherine of Siena", ru: "Екатерина Сиенская", az: "Sienalı Yekaterina" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_carmelite: {
    node_id: "terminal_catholic_carmelite",
    title: { en: "The Carmelite", ru: "Кармелит", az: "Karmelit" },
    blueprint: {
      en: "You are a Catholic Christian of the Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross внутри вселенской католической веры.",
      az: "Siz Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Carmelite — contemplative prayer, Teresa of Ávila, John of the Cross mənəviyyatıdır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "Teresa of Ávila", ru: "Тереза Авильская", az: "Avilalı Tereza" },
      { en: "John of the Cross", ru: "Иоанн Креста", az: "Xaçlı Yəhya" },
      { en: "Thérèse of Lisieux", ru: "Тереза из Лизьё", az: "Lizye Terezası" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_benedictine: {
    node_id: "terminal_catholic_benedictine",
    title: { en: "The Benedictine", ru: "Бенедиктинец", az: "Benediktin" },
    blueprint: {
      en: "You are a Catholic Christian of the Benedictine / Trappist — ora et labora, stability, and liturgy tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Benedictine / Trappist — ora et labora, stability, and liturgy spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Benedictine / Trappist — ora et labora, stability, and liturgy. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Benedictine / Trappist — ora et labora, stability, and liturgy внутри вселенской католической веры.",
      az: "Siz Benedictine / Trappist — ora et labora, stability, and liturgy ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Benedictine / Trappist — ora et labora, stability, and liturgy mənəviyyatıdır.",
    },
    social_proof: 660,
    percent_of_users: 3,
    similar_minds: [
      { en: "Benedict of Nursia", ru: "Бенедикт Нурсийский", az: "Nursiyalı Benedikt" },
      { en: "Bernard of Clairvaux", ru: "Бернар Клервоский", az: "Klervolu Bernard" },
      { en: "Thomas Merton", ru: "Томас Мертон", az: "Tomas Merton" },
    ],
    tags: ["catholic"],
  },
  terminal_catholic_other_order: {
    node_id: "terminal_catholic_other_order",
    title: { en: "The Religious Life Catholic", ru: "Католик монашеской жизни", az: "Dini həyat katoliki" },
    blueprint: {
      en: "You are a Catholic Christian of the Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church tradition. God is Real, Personal, and Triune — encountered through the Church, the sacraments, and the communion of saints. Your path is one of Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church spirituality within the universal Catholic faith.",
      ru: "Вы — католический христианин традиции Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church. Бог Реален, Личностен и Троичен — встречается через Церковь, таинства и общение святых. Ваш путь — духовность Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church внутри вселенской католической веры.",
      az: "Siz Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church ənənəsindən olan Katolik xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — Kilsə, müqəddəs mərasimlər və müqəddəslər birliyi vasitəsilə qarşılanır. Sizin yolunuz universal Katolik inancı daxilində Other religious order — Salesian, Opus Dei, Focolare, Redemptorist, or another charism within the Church mənəviyyatıdır.",
    },
    social_proof: 450,
    percent_of_users: 2,
    similar_minds: [
      { en: "Don Bosco", ru: "Дон Боско", az: "Don Bosko" },
      { en: "Josemaría Escrivá", ru: "Хосемария Эскрива", az: "Xosemariya Eskriva" },
      { en: "Chiara Lubich", ru: "Кьяра Любич", az: "Kiara Lubiç" },
    ],
    tags: ["catholic"],
  },
  terminal_orthodox_greek: {
    node_id: "terminal_orthodox_greek",
    title: { en: "The Greek Orthodox", ru: "Греческий православный", az: "Yunan pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Greek / Ecumenical Patriarchate tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Greek / Ecumenical Patriarchate. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Greek / Ecumenical Patriarchate ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 980,
    percent_of_users: 5,
    similar_minds: [
      { en: "Gregory Palamas", ru: "Григорий Палама", az: "Qriqori Palama" },
      { en: "Nikos Kazantzakis", ru: "Никос Казандзакис", az: "Nikos Kazancakis" },
      { en: "Elder Paisios", ru: "Старец Паисий", az: "Ağsaqqal Paisios" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_antiochian: {
    node_id: "terminal_orthodox_antiochian",
    title: { en: "The Antiochian Orthodox", ru: "Антиохийский православный", az: "Antioxiya pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Antiochian / Arab Orthodox tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Antiochian / Arab Orthodox. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Antiochian / Arab Orthodox ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Saint John Chrysostom", ru: "Иоанн Златоуст", az: "Xrisostom Yəhya" },
      { en: "Apostle Peter", ru: "Апостол Пётр", az: "Həvari Pyotr" },
      { en: "Ignatius of Antioch", ru: "Игнатий Антиохийский", az: "Antioxiyalı İqnati" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_other_slavic: {
    node_id: "terminal_orthodox_other_slavic",
    title: { en: "The Slavic Orthodox", ru: "Славянский православный", az: "Slavyan pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Serbian, Bulgarian, Romanian, or Georgian Orthodox tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Serbian, Bulgarian, Romanian, or Georgian Orthodox. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Serbian, Bulgarian, Romanian, or Georgian Orthodox ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Saint Sava", ru: "Святой Савва", az: "Müqəddəs Sava" },
      { en: "Paisius of Hilandar", ru: "Паисий Хилендарский", az: "Xilendarlı Paisius" },
      { en: "Justinian", ru: "Юстиниан", az: "Yustinian" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_old_believer: {
    node_id: "terminal_orthodox_old_believer",
    title: { en: "The Old Believer", ru: "Старообрядец", az: "Köhnə inanan" },
    blueprint: {
      en: "You are an Orthodox Christian of the Old Believers — pre-Nikonian rites, split of 1666, preservation of ancient piety tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Old Believers — pre-Nikonian rites, split of 1666, preservation of ancient piety. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Old Believers — pre-Nikonian rites, split of 1666, preservation of ancient piety ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 230,
    percent_of_users: 1,
    similar_minds: [
      { en: "Avvakum", ru: "Аввакум", az: "Avvakum" },
      { en: "Archpriest Avvakum's followers", ru: "Последователи протопопа Аввакума", az: "Protokoh Avvakumun ardıcılları" },
      { en: "The Church Fathers", ru: "Отцы Церкви", az: "Kilsə ataları" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_true: {
    node_id: "terminal_orthodox_true",
    title: { en: "The True Orthodox", ru: "Истинно православный", az: "Həqiqi pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the True / Genuine Orthodoxy — anti-ecumenist, preserving the old calendar tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции True / Genuine Orthodoxy — anti-ecumenist, preserving the old calendar. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz True / Genuine Orthodoxy — anti-ecumenist, preserving the old calendar ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Metropolitan Philaret", ru: "Митрополит Филарет", az: "Mitropolit Filaret" },
      { en: "John of Shanghai", ru: "Иоанн Шанхайский", az: "Şanxaylı İohann" },
      { en: "The Church Fathers", ru: "Отцы Церкви", az: "Kilsə ataları" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_russian_mainstream: {
    node_id: "terminal_orthodox_russian_mainstream",
    title: { en: "The Russian Orthodox", ru: "Русский православный", az: "Rus pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Russian Orthodox — Moscow Patriarchate tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Russian Orthodox — Moscow Patriarchate. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Russian Orthodox — Moscow Patriarchate ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 1230,
    percent_of_users: 7,
    similar_minds: [
      { en: "Seraphim of Sarov", ru: "Серафим Саровский", az: "Sarovlu Serafim" },
      { en: "Dostoevsky", ru: "Достоевский", az: "Dostoyevski" },
      { en: "Patriarch Kirill", ru: "Патриарх Кирилл", az: "Patriarx Kirill" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_rocor: {
    node_id: "terminal_orthodox_rocor",
    title: { en: "The ROCOR Orthodox", ru: "Православный РПЦЗ", az: "RPÇX pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the ROCOR — Russian Orthodox Church Outside Russia tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции ROCOR — Russian Orthodox Church Outside Russia. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz ROCOR — Russian Orthodox Church Outside Russia ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 390,
    percent_of_users: 2,
    similar_minds: [
      { en: "John of Shanghai", ru: "Иоанн Шанхайский", az: "Şanxaylı İohann" },
      { en: "Vitaly Ustinov", ru: "Виталий Устинов", az: "Vitali Ustinov" },
      { en: "The Church Fathers", ru: "Отцы Церкви", az: "Kilsə ataları" },
    ],
    tags: ["orthodox"],
  },
  terminal_orthodox_edinovertsy: {
    node_id: "terminal_orthodox_edinovertsy",
    title: { en: "The Edinoverets", ru: "Единоверец", az: "Edinoverets" },
    blueprint: {
      en: "You are an Orthodox Christian of the Edinovertsy — Old Ritualists in communion with the Moscow Patriarchate tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Edinovertsy — Old Ritualists in communion with the Moscow Patriarchate. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Edinovertsy — Old Ritualists in communion with the Moscow Patriarchate ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 180,
    percent_of_users: 1,
    similar_minds: [
      { en: "Saint Ambrose of Optina", ru: "Амвросий Оптинский", az: "Optinalı Amvrosi" },
      { en: "Saint Seraphim", ru: "Серафим", az: "Serafim" },
      { en: "Patriarch Nikon", ru: "Патриарх Никон", az: "Patriarx Nikon" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_coptic: {
    node_id: "terminal_oriental_coptic",
    title: { en: "The Coptic Orthodox", ru: "Коптский православный", az: "Kopt pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Coptic Orthodox Church of Egypt tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Coptic Orthodox Church of Egypt. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Coptic Orthodox Church of Egypt ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Saint Mark", ru: "Святой Марк", az: "Müqəddəs Mark" },
      { en: "Pope Shenouda III", ru: "Папа Шенуда III", az: "Papa Şenuda III" },
      { en: "Anthony the Great", ru: "Антоний Великий", az: "Böyük Antoni" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_armenian: {
    node_id: "terminal_oriental_armenian",
    title: { en: "The Armenian Apostolic", ru: "Армянский апостольский", az: "Erməni apostolik" },
    blueprint: {
      en: "You are an Orthodox Christian of the Armenian Apostolic Church of Etchmiadzin tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Armenian Apostolic Church of Etchmiadzin. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Armenian Apostolic Church of Etchmiadzin ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 450,
    percent_of_users: 2,
    similar_minds: [
      { en: "Gregory the Illuminator", ru: "Григорий Просветитель", az: "İşıqlandıran Qriqori" },
      { en: "Mesrop Mashtots", ru: "Месроп Маштоц", az: "Mesrop Maşdots" },
      { en: "Sayat-Nova", ru: "Саят-Нова", az: "Sayat-Nova" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_ethiopian: {
    node_id: "terminal_oriental_ethiopian",
    title: { en: "The Ethiopian Orthodox", ru: "Эфиопский православный", az: "Efiopiya pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Ethiopian Orthodox Tewahedo Church tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Ethiopian Orthodox Tewahedo Church. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Ethiopian Orthodox Tewahedo Church ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Saint Tekle Haymanot", ru: "Текле Хайманот", az: "Tekle Haymanot" },
      { en: "Abba Gebre Menfes Kidus", ru: "Абба Гебре Менфес Кидус", az: "Abba Gebre Menfes Kidus" },
      { en: "Saint Yared", ru: "Святой Яред", az: "Müqəddəs Yared" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_eritrean: {
    node_id: "terminal_oriental_eritrean",
    title: { en: "The Eritrean Orthodox", ru: "Эритрейский православный", az: "Eritreya pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Eritrean Orthodox Tewahedo Church tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Eritrean Orthodox Tewahedo Church. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Eritrean Orthodox Tewahedo Church ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 150,
    percent_of_users: 1,
    similar_minds: [
      { en: "Abba Phillipos", ru: "Абба Филиппос", az: "Abba Filippos" },
      { en: "Saint Yonas", ru: "Святой Йонас", az: "Müqəddəs Yonas" },
      { en: "Abba Luqas", ru: "Абба Лукас", az: "Abba Luqas" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_syriac: {
    node_id: "terminal_oriental_syriac",
    title: { en: "The Syriac Orthodox", ru: "Сирийский православный", az: "Suriya pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Syriac Orthodox Church of Antioch tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Syriac Orthodox Church of Antioch. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Syriac Orthodox Church of Antioch ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Jacob Baradaeus", ru: "Иаков Барадей", az: "Yaqub Baradey" },
      { en: "Ephrem the Syrian", ru: "Ефрем Сирин", az: "Suriyalı Efrem" },
      { en: "Saint Severus", ru: "Святой Север", az: "Müqəddəs Sever" },
    ],
    tags: ["orthodox"],
  },
  terminal_oriental_malankara: {
    node_id: "terminal_oriental_malankara",
    title: { en: "The Malankara Orthodox", ru: "Маланкарский православный", az: "Malankara pravoslav" },
    blueprint: {
      en: "You are an Orthodox Christian of the Malankara Orthodox Syrian Church of India tradition. God is Real, Personal, and Triune — known as mystery through theosis, the living tradition, and the holy icons. The Church is the hospital of souls.",
      ru: "Вы — православный христианин традиции Malankara Orthodox Syrian Church of India. Бог Реален, Личностен и Троичен — познаётся как тайна через теозис, живую традицию и святые иконы. Церковь — это лечебница душ.",
      az: "Siz Malankara Orthodox Syrian Church of India ənənəsindən olan Pravoslav xristiansınız. Tanrı Real, Şəxsi və Üçlükdür — teozis, canlı ənənə və müqəddəs ikonalar vasitəsilə sirr kimi tanınır. Kilsə ruhların xəstəxanasıdır.",
    },
    social_proof: 290,
    percent_of_users: 1,
    similar_minds: [
      { en: "Saint Thomas", ru: "Апостол Фома", az: "Həvari Tomas" },
      { en: "Geevarghese Mar Gregorios", ru: "Геваргезе Мар Грегориос", az: "Geevarghese Mar Qriqorios" },
      { en: "Mar Dionysius", ru: "Мар Дионисий", az: "Mar Dionisius" },
    ],
    tags: ["orthodox"],
  },
  terminal_protestant_quaker: {
    node_id: "terminal_protestant_quaker",
    title: { en: "The Quaker", ru: "Квакер", az: "Kveker" },
    blueprint: {
      en: "You are a Protestant Christian of the Quaker — the Inner Light and silent waiting worship tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Quaker — the Inner Light and silent waiting worship.",
      ru: "Вы — протестантский христианин традиции Quaker — the Inner Light and silent waiting worship. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Quaker — the Inner Light and silent waiting worship.",
      az: "Siz Quaker — the Inner Light and silent waiting worship ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Quaker — the Inner Light and silent waiting worship vurğulayır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "George Fox", ru: "Джордж Фокс", az: "Corc Foks" },
      { en: "William Penn", ru: "Уильям Пенн", az: "Uilyam Penn" },
      { en: "John Woolman", ru: "Джон Вулман", az: "Con Vulman" },
    ],
    tags: ["protestant"],
  },
  terminal_lutheran_confessional: {
    node_id: "terminal_lutheran_confessional",
    title: { en: "The Confessional Lutheran", ru: "Конфессиональный лютеран", az: "Konfessional lüteran" },
    blueprint: {
      en: "You are a Protestant Christian of the Confessional Lutheran — Book of Concord, Law and Gospel tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Confessional Lutheran — Book of Concord, Law and Gospel.",
      ru: "Вы — протестантский христианин традиции Confessional Lutheran — Book of Concord, Law and Gospel. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Confessional Lutheran — Book of Concord, Law and Gospel.",
      az: "Siz Confessional Lutheran — Book of Concord, Law and Gospel ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Confessional Lutheran — Book of Concord, Law and Gospel vurğulayır.",
    },
    social_proof: 480,
    percent_of_users: 2,
    similar_minds: [
      { en: "Martin Luther", ru: "Мартин Лютер", az: "Martin Lüter" },
      { en: "C.F.W. Walther", ru: "К.Ф.В. Вальтер", az: "K.F.V. Valter" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_lutheran_mainline: {
    node_id: "terminal_lutheran_mainline",
    title: { en: "The Mainline Lutheran", ru: "Мейнстримный лютеран", az: "Meynstrim lüteran" },
    blueprint: {
      en: "You are a Protestant Christian of the Mainline Lutheran (ELCA) — ecumenical and progressive tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Mainline Lutheran (ELCA) — ecumenical and progressive.",
      ru: "Вы — протестантский христианин традиции Mainline Lutheran (ELCA) — ecumenical and progressive. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Mainline Lutheran (ELCA) — ecumenical and progressive.",
      az: "Siz Mainline Lutheran (ELCA) — ecumenical and progressive ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Mainline Lutheran (ELCA) — ecumenical and progressive vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Martin Luther", ru: "Мартин Лютер", az: "Martin Lüter" },
      { en: "Dietrich Bonhoeffer", ru: "Дитрих Бонхёффер", az: "Ditrix Bonhoeffer" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_lutheran_nordic: {
    node_id: "terminal_lutheran_nordic",
    title: { en: "The Nordic Lutheran", ru: "Скандинавский лютеран", az: "Skandinav lüteran" },
    blueprint: {
      en: "You are a Protestant Christian of the Nordic Folk Church Lutheran — cultural Christianity of Scandinavia tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Nordic Folk Church Lutheran — cultural Christianity of Scandinavia.",
      ru: "Вы — протестантский христианин традиции Nordic Folk Church Lutheran — cultural Christianity of Scandinavia. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Nordic Folk Church Lutheran — cultural Christianity of Scandinavia.",
      az: "Siz Nordic Folk Church Lutheran — cultural Christianity of Scandinavia ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Nordic Folk Church Lutheran — cultural Christianity of Scandinavia vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Nathan Söderblom", ru: "Натан Сёдерблом", az: "Natan Söderblom" },
      { en: "Kierkegaard", ru: "Кьеркегор", az: "Kyerkeqor" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_lutheran_laestadian: {
    node_id: "terminal_lutheran_laestadian",
    title: { en: "The Laestadian", ru: "Лестадианец", az: "Lestadian" },
    blueprint: {
      en: "You are a Protestant Christian of the Laestadianism — conservative pietist revival of Northern Finland tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Laestadianism — conservative pietist revival of Northern Finland.",
      ru: "Вы — протестантский христианин традиции Laestadianism — conservative pietist revival of Northern Finland. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Laestadianism — conservative pietist revival of Northern Finland.",
      az: "Siz Laestadianism — conservative pietist revival of Northern Finland ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Laestadianism — conservative pietist revival of Northern Finland vurğulayır.",
    },
    social_proof: 160,
    percent_of_users: 1,
    similar_minds: [
      { en: "Lars Levi Laestadius", ru: "Ларс Леви Лестадиус", az: "Lars Levi Lestadius" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_reformed_pcusa: {
    node_id: "terminal_reformed_pcusa",
    title: { en: "The Mainline Presbyterian", ru: "Мейнстримный пресвитерианин", az: "Meynstrim presviterian" },
    blueprint: {
      en: "You are a Protestant Christian of the Presbyterian (PCUSA) — Reformed heritage, progressive witness tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Presbyterian (PCUSA) — Reformed heritage, progressive witness.",
      ru: "Вы — протестантский христианин традиции Presbyterian (PCUSA) — Reformed heritage, progressive witness. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Presbyterian (PCUSA) — Reformed heritage, progressive witness.",
      az: "Siz Presbyterian (PCUSA) — Reformed heritage, progressive witness ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Presbyterian (PCUSA) — Reformed heritage, progressive witness vurğulayır.",
    },
    social_proof: 620,
    percent_of_users: 3,
    similar_minds: [
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "Karl Barth", ru: "Карл Барт", az: "Karl Bart" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_reformed_conservative: {
    node_id: "terminal_reformed_conservative",
    title: { en: "The Confessional Presbyterian", ru: "Конфессиональный пресвитерианин", az: "Konfessional presviterian" },
    blueprint: {
      en: "You are a Protestant Christian of the Presbyterian (PCA/OPC) — Westminster Standards, covenant theology tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Presbyterian (PCA/OPC) — Westminster Standards, covenant theology.",
      ru: "Вы — протестантский христианин традиции Presbyterian (PCA/OPC) — Westminster Standards, covenant theology. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Presbyterian (PCA/OPC) — Westminster Standards, covenant theology.",
      az: "Siz Presbyterian (PCA/OPC) — Westminster Standards, covenant theology ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Presbyterian (PCA/OPC) — Westminster Standards, covenant theology vurğulayır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "J. Gresham Machen", ru: "Дж. Грешам Мейчен", az: "C. Qreşam Meyçen" },
      { en: "B.B. Warfield", ru: "Б.Б. Уорфилд", az: "B.B. Uorfild" },
    ],
    tags: ["protestant"],
  },
  terminal_reformed_continental: {
    node_id: "terminal_reformed_continental",
    title: { en: "The Continental Reformed", ru: "Континентальный реформат", az: "Kontinental reformat" },
    blueprint: {
      en: "You are a Protestant Christian of the Continental Reformed — Heidelberg Catechism, Dutch Calvinism tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Continental Reformed — Heidelberg Catechism, Dutch Calvinism.",
      ru: "Вы — протестантский христианин традиции Continental Reformed — Heidelberg Catechism, Dutch Calvinism. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Continental Reformed — Heidelberg Catechism, Dutch Calvinism.",
      az: "Siz Continental Reformed — Heidelberg Catechism, Dutch Calvinism ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Continental Reformed — Heidelberg Catechism, Dutch Calvinism vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "John Calvin", ru: "Жан Кальвин", az: "Con Kalvin" },
      { en: "Abraham Kuyper", ru: "Абрахам Койпер", az: "Abraham Kayper" },
      { en: "Herman Bavinck", ru: "Герман Бавинк", az: "Herman Bavink" },
    ],
    tags: ["protestant"],
  },
  terminal_reformed_new_calvinism: {
    node_id: "terminal_reformed_new_calvinism",
    title: { en: "The New Calvinist", ru: "Новый кальвинист", az: "Yeni kalvinist" },
    blueprint: {
      en: "You are a Protestant Christian of the New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition.",
      ru: "Вы — протестантский христианин традиции New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition.",
      az: "Siz New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz New Calvinism — Sovereign Grace, Acts 29, Gospel Coalition vurğulayır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "John Piper", ru: "Джон Пайпер", az: "Con Payper" },
      { en: "Timothy Keller", ru: "Тим Келлер", az: "Tim Keller" },
      { en: "Kevin DeYoung", ru: "Кевин ДеЯнг", az: "Kevin DeYanq" },
    ],
    tags: ["protestant"],
  },
  terminal_reformed_theonomy: {
    node_id: "terminal_reformed_theonomy",
    title: { en: "The Theonomist", ru: "Теономист", az: "Teonomist" },
    blueprint: {
      en: "You are a Protestant Christian of the Christian Reconstructionism — theonomy, God's law for civil society tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Christian Reconstructionism — theonomy, God's law for civil society.",
      ru: "Вы — протестантский христианин традиции Christian Reconstructionism — theonomy, God's law for civil society. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Christian Reconstructionism — theonomy, God's law for civil society.",
      az: "Siz Christian Reconstructionism — theonomy, God's law for civil society ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Christian Reconstructionism — theonomy, God's law for civil society vurğulayır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "R.J. Rushdoony", ru: "Р.Дж. Рашдуни", az: "R.C. Ruşduni" },
      { en: "Greg Bahnsen", ru: "Грег Бахсен", az: "Qreq Bahnsen" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anglican_anglocatholic: {
    node_id: "terminal_anglican_anglocatholic",
    title: { en: "The Anglo-Catholic", ru: "Англо-католик", az: "Anglo-katolik" },
    blueprint: {
      en: "You are a Protestant Christian of the Anglo-Catholic — High Church ritual and apostolic succession tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Anglo-Catholic — High Church ritual and apostolic succession.",
      ru: "Вы — протестантский христианин традиции Anglo-Catholic — High Church ritual and apostolic succession. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Anglo-Catholic — High Church ritual and apostolic succession.",
      az: "Siz Anglo-Catholic — High Church ritual and apostolic succession ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Anglo-Catholic — High Church ritual and apostolic succession vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 3,
    similar_minds: [
      { en: "John Henry Newman", ru: "Джон Генри Ньюмен", az: "Con Henri Nyumen" },
      { en: "T.S. Eliot", ru: "Т.С. Элиот", az: "T.S. Eliot" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anglican_broad: {
    node_id: "terminal_anglican_broad",
    title: { en: "The Broad Church Anglican", ru: "Англиканин широкой церкви", az: "Geniş kilsə anqlikanı" },
    blueprint: {
      en: "You are a Protestant Christian of the Broad Church Anglican — via media, reasoned faith tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Broad Church Anglican — via media, reasoned faith.",
      ru: "Вы — протестантский христианин традиции Broad Church Anglican — via media, reasoned faith. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Broad Church Anglican — via media, reasoned faith.",
      az: "Siz Broad Church Anglican — via media, reasoned faith ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Broad Church Anglican — via media, reasoned faith vurğulayır.",
    },
    social_proof: 450,
    percent_of_users: 2,
    similar_minds: [
      { en: "Richard Hooker", ru: "Ричард Хукер", az: "Riçard Huker" },
      { en: "William Temple", ru: "Уильям Темпл", az: "Uilyam Templ" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anglican_low: {
    node_id: "terminal_anglican_low",
    title: { en: "The Evangelical Anglican", ru: "Евангельский англиканин", az: "Evangelik anqlikan" },
    blueprint: {
      en: "You are a Protestant Christian of the Low Church Evangelical Anglican — scripture and preaching tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Low Church Evangelical Anglican — scripture and preaching.",
      ru: "Вы — протестантский христианин традиции Low Church Evangelical Anglican — scripture and preaching. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Low Church Evangelical Anglican — scripture and preaching.",
      az: "Siz Low Church Evangelical Anglican — scripture and preaching ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Low Church Evangelical Anglican — scripture and preaching vurğulayır.",
    },
    social_proof: 580,
    percent_of_users: 3,
    similar_minds: [
      { en: "John Stott", ru: "Джон Стотт", az: "Con Stott" },
      { en: "J.I. Packer", ru: "Дж.И. Пакер", az: "C.İ. Paker" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anglican_acna: {
    node_id: "terminal_anglican_acna",
    title: { en: "The ACNA Anglican", ru: "Англиканин ACNA", az: "ACNA anqlikanı" },
    blueprint: {
      en: "You are a Protestant Christian of the ACNA / GAFCON — Global South conservative Anglicanism tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes ACNA / GAFCON — Global South conservative Anglicanism.",
      ru: "Вы — протестантский христианин традиции ACNA / GAFCON — Global South conservative Anglicanism. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает ACNA / GAFCON — Global South conservative Anglicanism.",
      az: "Siz ACNA / GAFCON — Global South conservative Anglicanism ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz ACNA / GAFCON — Global South conservative Anglicanism vurğulayır.",
    },
    social_proof: 390,
    percent_of_users: 2,
    similar_minds: [
      { en: "Justin Welby's critics", ru: "Критики Джастина Уэлби", az: "Castin Uelbinin tənqidçiləri" },
      { en: "Archbishop Foley Beach", ru: "Архиепископ Фоули Бич", az: "Arxiyepiskop Fouli Biç" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anglican_continuing: {
    node_id: "terminal_anglican_continuing",
    title: { en: "The Continuing Anglican", ru: "Продолжающийся англиканин", az: "Davamedən anqlikan" },
    blueprint: {
      en: "You are a Protestant Christian of the Continuing Anglican — traditional BCP 1928, orthodox protest tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Continuing Anglican — traditional BCP 1928, orthodox protest.",
      ru: "Вы — протестантский христианин традиции Continuing Anglican — traditional BCP 1928, orthodox protest. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Continuing Anglican — traditional BCP 1928, orthodox protest.",
      az: "Siz Continuing Anglican — traditional BCP 1928, orthodox protest ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Continuing Anglican — traditional BCP 1928, orthodox protest vurğulayır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "Bishop Walter Grundorf", ru: "Епископ Вальтер Грундорф", az: "Yepiskop Valter Qrundorf" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anabaptist_amish: {
    node_id: "terminal_anabaptist_amish",
    title: { en: "The Old Order Amish", ru: "Амиш старого порядка", az: "Köhnə tərtibli amiş" },
    blueprint: {
      en: "You are a Protestant Christian of the Old Order Amish — separation, simplicity, and Gelassenheit tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Old Order Amish — separation, simplicity, and Gelassenheit.",
      ru: "Вы — протестантский христианин традиции Old Order Amish — separation, simplicity, and Gelassenheit. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Old Order Amish — separation, simplicity, and Gelassenheit.",
      az: "Siz Old Order Amish — separation, simplicity, and Gelassenheit ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Old Order Amish — separation, simplicity, and Gelassenheit vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Jakob Ammann", ru: "Якоб Амман", az: "Yakob Amman" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anabaptist_conservative_mennonite: {
    node_id: "terminal_anabaptist_conservative_mennonite",
    title: { en: "The Conservative Mennonite", ru: "Консервативный меннонит", az: "Mühafizəkar menonit" },
    blueprint: {
      en: "You are a Protestant Christian of the Conservative Mennonite — plain living and nonresistance tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Conservative Mennonite — plain living and nonresistance.",
      ru: "Вы — протестантский христианин традиции Conservative Mennonite — plain living and nonresistance. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Conservative Mennonite — plain living and nonresistance.",
      az: "Siz Conservative Mennonite — plain living and nonresistance ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Conservative Mennonite — plain living and nonresistance vurğulayır.",
    },
    social_proof: 280,
    percent_of_users: 1,
    similar_minds: [
      { en: "Menno Simons", ru: "Менно Симонс", az: "Menno Simons" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anabaptist_mennonite_mainline: {
    node_id: "terminal_anabaptist_mennonite_mainline",
    title: { en: "The Mennonite", ru: "Меннонит", az: "Menonit" },
    blueprint: {
      en: "You are a Protestant Christian of the Mennonite Church USA/Canada — peace theology and service tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Mennonite Church USA/Canada — peace theology and service.",
      ru: "Вы — протестантский христианин традиции Mennonite Church USA/Canada — peace theology and service. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Mennonite Church USA/Canada — peace theology and service.",
      az: "Siz Mennonite Church USA/Canada — peace theology and service ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Mennonite Church USA/Canada — peace theology and service vurğulayır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "Menno Simons", ru: "Менно Симонс", az: "Menno Simons" },
      { en: "Dorothy Day", ru: "Дороти Дэй", az: "Doroti Dey" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anabaptist_hutterite: {
    node_id: "terminal_anabaptist_hutterite",
    title: { en: "The Hutterite", ru: "Гуттерит", az: "Hutterit" },
    blueprint: {
      en: "You are a Protestant Christian of the Hutterite — communal living and shared goods tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Hutterite — communal living and shared goods.",
      ru: "Вы — протестантский христианин традиции Hutterite — communal living and shared goods. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Hutterite — communal living and shared goods.",
      az: "Siz Hutterite — communal living and shared goods ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Hutterite — communal living and shared goods vurğulayır.",
    },
    social_proof: 170,
    percent_of_users: 1,
    similar_minds: [
      { en: "Jakob Hutter", ru: "Якоб Гуттер", az: "Yakob Hutter" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_anabaptist_brethren: {
    node_id: "terminal_anabaptist_brethren",
    title: { en: "The Brethren", ru: "Брат", az: "Qardaş" },
    blueprint: {
      en: "You are a Protestant Christian of the Church of the Brethren — love feast and simple biblical faith tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Church of the Brethren — love feast and simple biblical faith.",
      ru: "Вы — протестантский христианин традиции Church of the Brethren — love feast and simple biblical faith. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Church of the Brethren — love feast and simple biblical faith.",
      az: "Siz Church of the Brethren — love feast and simple biblical faith ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Church of the Brethren — love feast and simple biblical faith vurğulayır.",
    },
    social_proof: 260,
    percent_of_users: 1,
    similar_minds: [
      { en: "Alexander Mack", ru: "Александр Мак", az: "Aleksandr Mak" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
      { en: "The Reformers", ru: "Реформаторы", az: "İslahatçılar" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_sbc: {
    node_id: "terminal_baptist_sbc",
    title: { en: "The Southern Baptist", ru: "Южный баптист", az: "Cənubi baptist" },
    blueprint: {
      en: "You are a Protestant Christian of the Southern Baptist Convention — conservative evangelical congregationalism tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Southern Baptist Convention — conservative evangelical congregationalism.",
      ru: "Вы — протестантский христианин традиции Southern Baptist Convention — conservative evangelical congregationalism. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Southern Baptist Convention — conservative evangelical congregationalism.",
      az: "Siz Southern Baptist Convention — conservative evangelical congregationalism ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Southern Baptist Convention — conservative evangelical congregationalism vurğulayır.",
    },
    social_proof: 1240,
    percent_of_users: 7,
    similar_minds: [
      { en: "Charles Spurgeon", ru: "Чарльз Сперджен", az: "Çarlz Spurcon" },
      { en: "Billy Graham", ru: "Билли Грэм", az: "Billi Qrem" },
      { en: "Albert Mohler", ru: "Альберт Молер", az: "Albert Mohler" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_abcusa: {
    node_id: "terminal_baptist_abcusa",
    title: { en: "The American Baptist", ru: "Американский баптист", az: "Amerika baptisti" },
    blueprint: {
      en: "You are a Protestant Christian of the American Baptist (ABCUSA) — mainline, progressive Baptist witness tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes American Baptist (ABCUSA) — mainline, progressive Baptist witness.",
      ru: "Вы — протестантский христианин традиции American Baptist (ABCUSA) — mainline, progressive Baptist witness. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает American Baptist (ABCUSA) — mainline, progressive Baptist witness.",
      az: "Siz American Baptist (ABCUSA) — mainline, progressive Baptist witness ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz American Baptist (ABCUSA) — mainline, progressive Baptist witness vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Martin Luther King Jr.", ru: "Мартин Лютер Кинг-младший", az: "Martin Lüter Kinq" },
      { en: "Walter Rauschenbusch", ru: "Вальтер Раушенбуш", az: "Valter Rauşenbuş" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_independent_fundamentalist: {
    node_id: "terminal_baptist_independent_fundamentalist",
    title: { en: "The Independent Fundamentalist Baptist", ru: "Независимый фундаменталист-баптист", az: "Müstəqil fundamentalist baptist" },
    blueprint: {
      en: "You are a Protestant Christian of the Independent Fundamentalist Baptist — KJV-only separatism tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Independent Fundamentalist Baptist — KJV-only separatism.",
      ru: "Вы — протестантский христианин традиции Independent Fundamentalist Baptist — KJV-only separatism. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Independent Fundamentalist Baptist — KJV-only separatism.",
      az: "Siz Independent Fundamentalist Baptist — KJV-only separatism ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Independent Fundamentalist Baptist — KJV-only separatism vurğulayır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Jack Hyles", ru: "Джек Хайлс", az: "Cek Hayls" },
      { en: "John R. Rice", ru: "Джон Р. Райс", az: "Con R. Rays" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_reformed: {
    node_id: "terminal_baptist_reformed",
    title: { en: "The Reformed Baptist", ru: "Реформатский баптист", az: "Reformasiya baptisti" },
    blueprint: {
      en: "You are a Protestant Christian of the Reformed Baptist — 1689 Confession, Calvinistic soteriology tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Reformed Baptist — 1689 Confession, Calvinistic soteriology.",
      ru: "Вы — протестантский христианин традиции Reformed Baptist — 1689 Confession, Calvinistic soteriology. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Reformed Baptist — 1689 Confession, Calvinistic soteriology.",
      az: "Siz Reformed Baptist — 1689 Confession, Calvinistic soteriology ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Reformed Baptist — 1689 Confession, Calvinistic soteriology vurğulayır.",
    },
    social_proof: 690,
    percent_of_users: 4,
    similar_minds: [
      { en: "Charles Spurgeon", ru: "Чарльз Сперджен", az: "Çarlz Spurcon" },
      { en: "John Bunyan", ru: "Джон Буньян", az: "Con Bunyan" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_general: {
    node_id: "terminal_baptist_general",
    title: { en: "The General Baptist", ru: "Общий баптист", az: "Ümumi baptist" },
    blueprint: {
      en: "You are a Protestant Christian of the General Baptist — Arminian free-will theology tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes General Baptist — Arminian free-will theology.",
      ru: "Вы — протестантский христианин традиции General Baptist — Arminian free-will theology. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает General Baptist — Arminian free-will theology.",
      az: "Siz General Baptist — Arminian free-will theology ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz General Baptist — Arminian free-will theology vurğulayır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Thomas Helwys", ru: "Томас Хелвис", az: "Tomas Helvis" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_baptist_primitive: {
    node_id: "terminal_baptist_primitive",
    title: { en: "The Primitive Baptist", ru: "Примитивный баптист", az: "Primitiv baptist" },
    blueprint: {
      en: "You are a Protestant Christian of the Primitive Baptist — hyper-Calvinist, no missions or societies tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Primitive Baptist — hyper-Calvinist, no missions or societies.",
      ru: "Вы — протестантский христианин традиции Primitive Baptist — hyper-Calvinist, no missions or societies. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Primitive Baptist — hyper-Calvinist, no missions or societies.",
      az: "Siz Primitive Baptist — hyper-Calvinist, no missions or societies ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Primitive Baptist — hyper-Calvinist, no missions or societies vurğulayır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "John Gill", ru: "Джон Гилл", az: "Con Gill" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
      { en: "The Baptist Fathers", ru: "Баптистские отцы", az: "Baptist ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_methodist_umc: {
    node_id: "terminal_methodist_umc",
    title: { en: "The Wesleyan Methodist", ru: "Уэслианский методист", az: "Uesliyan metodist" },
    blueprint: {
      en: "You are a Protestant Christian of the United / Global Methodist — Wesleyan grace and social holiness tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes United / Global Methodist — Wesleyan grace and social holiness.",
      ru: "Вы — протестантский христианин традиции United / Global Methodist — Wesleyan grace and social holiness. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает United / Global Methodist — Wesleyan grace and social holiness.",
      az: "Siz United / Global Methodist — Wesleyan grace and social holiness ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz United / Global Methodist — Wesleyan grace and social holiness vurğulayır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "John Wesley", ru: "Джон Уэсли", az: "Con Uesli" },
      { en: "Charles Wesley", ru: "Чарльз Уэсли", az: "Çarlz Uesli" },
      { en: "The Wesleyan Fathers", ru: "Уэслианские отцы", az: "Uesliyan ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_methodist_ame: {
    node_id: "terminal_methodist_ame",
    title: { en: "The AME Methodist", ru: "Методист AME", az: "AME metodisti" },
    blueprint: {
      en: "You are a Protestant Christian of the African Methodist Episcopal — Black church tradition of liberation tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes African Methodist Episcopal — Black church tradition of liberation.",
      ru: "Вы — протестантский христианин традиции African Methodist Episcopal — Black church tradition of liberation. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает African Methodist Episcopal — Black church tradition of liberation.",
      az: "Siz African Methodist Episcopal — Black church tradition of liberation ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz African Methodist Episcopal — Black church tradition of liberation vurğulayır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Richard Allen", ru: "Ричард Аллен", az: "Riçard Allen" },
      { en: "Absalom Jones", ru: "Абсалом Джонс", az: "Absalom Cons" },
      { en: "The Wesleyan Fathers", ru: "Уэслианские отцы", az: "Uesliyan ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_methodist_wesleyan_holiness: {
    node_id: "terminal_methodist_wesleyan_holiness",
    title: { en: "The Holiness Methodist", ru: "Святостный методист", az: "Müqəddəslik metodisti" },
    blueprint: {
      en: "You are a Protestant Christian of the Wesleyan Church / Nazarene — entire sanctification tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Wesleyan Church / Nazarene — entire sanctification.",
      ru: "Вы — протестантский христианин традиции Wesleyan Church / Nazarene — entire sanctification. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Wesleyan Church / Nazarene — entire sanctification.",
      az: "Siz Wesleyan Church / Nazarene — entire sanctification ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Wesleyan Church / Nazarene — entire sanctification vurğulayır.",
    },
    social_proof: 460,
    percent_of_users: 2,
    similar_minds: [
      { en: "Phineas Bresee", ru: "Финеас Бризи", az: "Finees Brizi" },
      { en: "A.B. Simpson", ru: "А.Б. Симпсон", az: "A.B. Simpson" },
      { en: "The Wesleyan Fathers", ru: "Уэслианские отцы", az: "Uesliyan ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_methodist_salvation_army: {
    node_id: "terminal_methodist_salvation_army",
    title: { en: "The Salvationist", ru: "Спаситель", az: "Xilasedici" },
    blueprint: {
      en: "You are a Protestant Christian of the Salvation Army — sacramental theology and social action tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Salvation Army — sacramental theology and social action.",
      ru: "Вы — протестантский христианин традиции Salvation Army — sacramental theology and social action. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Salvation Army — sacramental theology and social action.",
      az: "Siz Salvation Army — sacramental theology and social action ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Salvation Army — sacramental theology and social action vurğulayır.",
    },
    social_proof: 390,
    percent_of_users: 2,
    similar_minds: [
      { en: "William Booth", ru: "Уильям Бут", az: "Uilyam But" },
      { en: "Catherine Booth", ru: "Кэтрин Бут", az: "Ketrin But" },
      { en: "The Wesleyan Fathers", ru: "Уэслианские отцы", az: "Uesliyan ataları" },
    ],
    tags: ["protestant"],
  },
  terminal_pentecostal_classical: {
    node_id: "terminal_pentecostal_classical",
    title: { en: "The Classical Pentecostal", ru: "Классический пятидесятник", az: "Klassik pentekostal" },
    blueprint: {
      en: "You are a Protestant Christian of the Classical Pentecostal — Spirit baptism with speaking in tongues tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Classical Pentecostal — Spirit baptism with speaking in tongues.",
      ru: "Вы — протестантский христианин традиции Classical Pentecostal — Spirit baptism with speaking in tongues. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Classical Pentecostal — Spirit baptism with speaking in tongues.",
      az: "Siz Classical Pentecostal — Spirit baptism with speaking in tongues ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Classical Pentecostal — Spirit baptism with speaking in tongues vurğulayır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "William Seymour", ru: "Уильям Сеймур", az: "Uilyam Seymur" },
      { en: "Aimee Semple McPherson", ru: "Эйми Семпл Макферсон", az: "Eymi Sempıl Makferson" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_pentecostal_oneness: {
    node_id: "terminal_pentecostal_oneness",
    title: { en: "The Oneness Pentecostal", ru: "Единственнический пятидесятник", az: "Birlik pentekostalı" },
    blueprint: {
      en: "You are a Protestant Christian of the Oneness Pentecostal — Acts 2:38, Jesus-name baptism tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Oneness Pentecostal — Acts 2:38, Jesus-name baptism.",
      ru: "Вы — протестантский христианин традиции Oneness Pentecostal — Acts 2:38, Jesus-name baptism. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Oneness Pentecostal — Acts 2:38, Jesus-name baptism.",
      az: "Siz Oneness Pentecostal — Acts 2:38, Jesus-name baptism ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Oneness Pentecostal — Acts 2:38, Jesus-name baptism vurğulayır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Frank Ewart", ru: "Фрэнк Юарт", az: "Frenk Yuart" },
      { en: "David Bernard", ru: "Дэвид Бернард", az: "David Bernard" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_pentecostal_charismatic: {
    node_id: "terminal_pentecostal_charismatic",
    title: { en: "The Charismatic", ru: "Харизмат", az: "Xarizmatik" },
    blueprint: {
      en: "You are a Protestant Christian of the Charismatic Movement — Spirit gifts within mainline churches tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Charismatic Movement — Spirit gifts within mainline churches.",
      ru: "Вы — протестантский христианин традиции Charismatic Movement — Spirit gifts within mainline churches. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Charismatic Movement — Spirit gifts within mainline churches.",
      az: "Siz Charismatic Movement — Spirit gifts within mainline churches ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Charismatic Movement — Spirit gifts within mainline churches vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Dennis Bennett", ru: "Деннис Беннетт", az: "Dennis Bennett" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_pentecostal_word_faith: {
    node_id: "terminal_pentecostal_word_faith",
    title: { en: "The Word of Faith", ru: "Слово веры", az: "İman sözü" },
    blueprint: {
      en: "You are a Protestant Christian of the Word of Faith — faith confession and prosperity teaching tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Word of Faith — faith confession and prosperity teaching.",
      ru: "Вы — протестантский христианин традиции Word of Faith — faith confession and prosperity teaching. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Word of Faith — faith confession and prosperity teaching.",
      az: "Siz Word of Faith — faith confession and prosperity teaching ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Word of Faith — faith confession and prosperity teaching vurğulayır.",
    },
    social_proof: 680,
    percent_of_users: 4,
    similar_minds: [
      { en: "Kenneth Hagin", ru: "Кеннет Хейгин", az: "Kennet Heygin" },
      { en: "Kenneth Copeland", ru: "Кеннет Коупленд", az: "Kennet Kouplend" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_pentecostal_nar: {
    node_id: "terminal_pentecostal_nar",
    title: { en: "The New Apostolic Reformer", ru: "Новый апостольский реформатор", az: "Yeni apostolik islahatçı" },
    blueprint: {
      en: "You are a Protestant Christian of the New Apostolic Reformation — modern apostles and prophets tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes New Apostolic Reformation — modern apostles and prophets.",
      ru: "Вы — протестантский христианин традиции New Apostolic Reformation — modern apostles and prophets. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает New Apostolic Reformation — modern apostles and prophets.",
      az: "Siz New Apostolic Reformation — modern apostles and prophets ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz New Apostolic Reformation — modern apostles and prophets vurğulayır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "C. Peter Wagner", ru: "К. Питер Вагнер", az: "C. Piter Vaqner" },
      { en: "Bill Johnson", ru: "Билл Джонсон", az: "Bil Conson" },
      { en: "The Pentecostal Pioneers", ru: "Пятидесятнические пионеры", az: "Pentekostal qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_nondenom_bible_church: {
    node_id: "terminal_nondenom_bible_church",
    title: { en: "The Bible Church Evangelical", ru: "Евангельская библейская церковь", az: "Bibliya kilsəsi evangeliki" },
    blueprint: {
      en: "You are a Protestant Christian of the Bible Church — expository preaching, verse-by-verse tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Bible Church — expository preaching, verse-by-verse.",
      ru: "Вы — протестантский христианин традиции Bible Church — expository preaching, verse-by-verse. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Bible Church — expository preaching, verse-by-verse.",
      az: "Siz Bible Church — expository preaching, verse-by-verse ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Bible Church — expository preaching, verse-by-verse vurğulayır.",
    },
    social_proof: 760,
    percent_of_users: 4,
    similar_minds: [
      { en: "John MacArthur", ru: "Джон Макартур", az: "Con Makartur" },
      { en: "John Piper", ru: "Джон Пайпер", az: "Con Payper" },
      { en: "The Evangelical Teachers", ru: "Евангельские учителя", az: "Evangelik müəllimlər" },
    ],
    tags: ["protestant"],
  },
  terminal_nondenom_megachurch: {
    node_id: "terminal_nondenom_megachurch",
    title: { en: "The Megachurch Attender", ru: "Прихожанин мегацеркви", az: "Meqa-kilsə üzvü" },
    blueprint: {
      en: "You are a Protestant Christian of the Megachurch — modern worship, Hillsong / Life.Church culture tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Megachurch — modern worship, Hillsong / Life.Church culture.",
      ru: "Вы — протестантский христианин традиции Megachurch — modern worship, Hillsong / Life.Church culture. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Megachurch — modern worship, Hillsong / Life.Church culture.",
      az: "Siz Megachurch — modern worship, Hillsong / Life.Church culture ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Megachurch — modern worship, Hillsong / Life.Church culture vurğulayır.",
    },
    social_proof: 1120,
    percent_of_users: 6,
    similar_minds: [
      { en: "Brian Houston", ru: "Брайан Хьюстон", az: "Brayan Hyuston" },
      { en: "Craig Groeschel", ru: "Крейг Грошель", az: "Kreq Qroşel" },
      { en: "Steven Furtick", ru: "Стивен Фертик", az: "Stiven Furtik" },
    ],
    tags: ["protestant"],
  },
  terminal_nondenom_neo_calvinist: {
    node_id: "terminal_nondenom_neo_calvinist",
    title: { en: "The Neo-Calvinist Evangelical", ru: "Неокальвинистский евангелик", az: "Neo-kalvinist evangelik" },
    blueprint: {
      en: "You are a Protestant Christian of the Neo-Calvinist Evangelical — cross-centered preaching tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Neo-Calvinist Evangelical — cross-centered preaching.",
      ru: "Вы — протестантский христианин традиции Neo-Calvinist Evangelical — cross-centered preaching. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Neo-Calvinist Evangelical — cross-centered preaching.",
      az: "Siz Neo-Calvinist Evangelical — cross-centered preaching ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Neo-Calvinist Evangelical — cross-centered preaching vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 3,
    similar_minds: [
      { en: "Timothy Keller", ru: "Тим Келлер", az: "Tim Keller" },
      { en: "Mark Driscoll", ru: "Марк Дрисколл", az: "Mark Driskoll" },
      { en: "The Evangelical Teachers", ru: "Евангельские учителя", az: "Evangelik müəllimlər" },
    ],
    tags: ["protestant"],
  },
  terminal_nondenom_progressive: {
    node_id: "terminal_nondenom_progressive",
    title: { en: "The Progressive Evangelical", ru: "Прогрессивный евангелик", az: "Proqressiv evangelik" },
    blueprint: {
      en: "You are a Protestant Christian of the Open / Progressive Evangelical — inclusive and questioning tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Open / Progressive Evangelical — inclusive and questioning.",
      ru: "Вы — протестантский христианин традиции Open / Progressive Evangelical — inclusive and questioning. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Open / Progressive Evangelical — inclusive and questioning.",
      az: "Siz Open / Progressive Evangelical — inclusive and questioning ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Open / Progressive Evangelical — inclusive and questioning vurğulayır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Rachel Held Evans", ru: "Рэйчел Хелд Эванс", az: "Reyçel Held Evans" },
      { en: "Rob Bell", ru: "Роб Белл", az: "Rob Bell" },
      { en: "The Evangelical Teachers", ru: "Евангельские учителя", az: "Evangelik müəllimlər" },
    ],
    tags: ["protestant"],
  },
  terminal_adventist_sda: {
    node_id: "terminal_adventist_sda",
    title: { en: "The Seventh-day Adventist", ru: "Адвентист седьмого дня", az: "Yeddinci gün adventisti" },
    blueprint: {
      en: "You are a Protestant Christian of the Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health.",
      ru: "Вы — протестантский христианин традиции Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health.",
      az: "Siz Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Seventh-day Adventist — Sabbath rest, prophetic gift, holistic health vurğulayır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "Ellen G. White", ru: "Эллен Уайт", az: "Ellen Uayt" },
      { en: "Joseph Bates", ru: "Джозеф Бейтс", az: "Cozef Beyts" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_adventist_cog7: {
    node_id: "terminal_adventist_cog7",
    title: { en: "The Church of God (7th Day)", ru: "Церковь Бога (7-го дня)", az: "Allah Kilsəsi (7-ci gün)" },
    blueprint: {
      en: "You are a Protestant Christian of the Church of God (Seventh Day) — Sabbath-keeping Adventist tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Church of God (Seventh Day) — Sabbath-keeping Adventist.",
      ru: "Вы — протестантский христианин традиции Church of God (Seventh Day) — Sabbath-keeping Adventist. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Church of God (Seventh Day) — Sabbath-keeping Adventist.",
      az: "Siz Church of God (Seventh Day) — Sabbath-keeping Adventist ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Church of God (Seventh Day) — Sabbath-keeping Adventist vurğulayır.",
    },
    social_proof: 190,
    percent_of_users: 1,
    similar_minds: [
      { en: "Gilbert Cranmer", ru: "Гилберт Крэнмер", az: "Gilbert Kranmer" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_adventist_jw: {
    node_id: "terminal_adventist_jw",
    title: { en: "The Jehovah's Witness", ru: "Свидетель Иеговы", az: "Yehova şahidi" },
    blueprint: {
      en: "You are a Protestant Christian of the Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching.",
      ru: "Вы — протестантский христианин традиции Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching.",
      az: "Siz Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Jehovah's Witnesses — Watchtower, 144,000, kingdom preaching vurğulayır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "Charles Taze Russell", ru: "Чарльз Тейз Рассел", az: "Çarlz Teyz Rassel" },
      { en: "Joseph Rutherford", ru: "Джозеф Рутерфорд", az: "Cozef Ruterford" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_adventist_other: {
    node_id: "terminal_adventist_other",
    title: { en: "The Christadelphian", ru: "Христадельфианин", az: "Kristadelfiyan" },
    blueprint: {
      en: "You are a Protestant Christian of the Christadelphians / Church of God International — Bible-only restoration tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Christadelphians / Church of God International — Bible-only restoration.",
      ru: "Вы — протестантский христианин традиции Christadelphians / Church of God International — Bible-only restoration. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Christadelphians / Church of God International — Bible-only restoration.",
      az: "Siz Christadelphians / Church of God International — Bible-only restoration ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Christadelphians / Church of God International — Bible-only restoration vurğulayır.",
    },
    social_proof: 160,
    percent_of_users: 1,
    similar_minds: [
      { en: "John Thomas", ru: "Джон Томас", az: "Con Tomas" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
      { en: "The Adventist Pioneers", ru: "Адвентистские пионеры", az: "Adventist qabaqcıllar" },
    ],
    tags: ["protestant"],
  },
  terminal_restorationist_community_christ: {
    node_id: "terminal_restorationist_community_christ",
    title: { en: "The Community of Christ", ru: "Община Христа", az: "Məsih icması" },
    blueprint: {
      en: "You are a Protestant Christian of the Community of Christ — Latter Day Saint heritage with ecumenical direction tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Community of Christ — Latter Day Saint heritage with ecumenical direction.",
      ru: "Вы — протестантский христианин традиции Community of Christ — Latter Day Saint heritage with ecumenical direction. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Community of Christ — Latter Day Saint heritage with ecumenical direction.",
      az: "Siz Community of Christ — Latter Day Saint heritage with ecumenical direction ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Community of Christ — Latter Day Saint heritage with ecumenical direction vurğulayır.",
    },
    social_proof: 180,
    percent_of_users: 1,
    similar_minds: [
      { en: "Joseph Smith III", ru: "Джозеф Смит III", az: "Cozef Smit III" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_restorationist_flds: {
    node_id: "terminal_restorationist_flds",
    title: { en: "The Fundamentalist LDS", ru: "Фундаменталист СПД", az: "Fundamentalist LDS" },
    blueprint: {
      en: "You are a Protestant Christian of the Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration.",
      ru: "Вы — протестантский христианин традиции Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration.",
      az: "Siz Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Fundamentalist LDS (FLDS) — plural marriage, patriarchic restoration vurğulayır.",
    },
    social_proof: 90,
    percent_of_users: 0,
    similar_minds: [
      { en: "Warren Jeffs", ru: "Уоррен Джеффс", az: "Uorren Ceffs" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_restorationist_unitarian: {
    node_id: "terminal_restorationist_unitarian",
    title: { en: "The Unitarian Universalist", ru: "Унитарианский универсалист", az: "Unitarian universalist" },
    blueprint: {
      en: "You are a Protestant Christian of the Unitarian Universalism — free faith, no creed, lived values tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Unitarian Universalism — free faith, no creed, lived values.",
      ru: "Вы — протестантский христианин традиции Unitarian Universalism — free faith, no creed, lived values. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Unitarian Universalism — free faith, no creed, lived values.",
      az: "Siz Unitarian Universalism — free faith, no creed, lived values ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Unitarian Universalism — free faith, no creed, lived values vurğulayır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Ralph Waldo Emerson", ru: "Ральф Уолдо Эмерсон", az: "Ralf Uoldo Emerson" },
      { en: "William Ellery Channing", ru: "Уильям Эллери Чаннинг", az: "Uilyam Elleri Çanninq" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_restorationist_christian_science: {
    node_id: "terminal_restorationist_christian_science",
    title: { en: "The Christian Scientist", ru: "Христианский учёный", az: "Xristian elm" },
    blueprint: {
      en: "You are a Protestant Christian of the Christian Science — metaphysical healing, Mary Baker Eddy tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Christian Science — metaphysical healing, Mary Baker Eddy.",
      ru: "Вы — протестантский христианин традиции Christian Science — metaphysical healing, Mary Baker Eddy. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Christian Science — metaphysical healing, Mary Baker Eddy.",
      az: "Siz Christian Science — metaphysical healing, Mary Baker Eddy ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Christian Science — metaphysical healing, Mary Baker Eddy vurğulayır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "Mary Baker Eddy", ru: "Мэри Бейкер Эдди", az: "Meri Beyker Eddi" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_lds_main: {
    node_id: "terminal_lds_main",
    title: { en: "The Latter-day Saint", ru: "Святой последних дней", az: "Axırıncı gün müqəddəsi" },
    blueprint: {
      en: "You are a Protestant Christian of the The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet.",
      ru: "Вы — протестантский христианин традиции The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet.",
      az: "Siz The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz The Church of Jesus Christ of Latter-day Saints — restored gospel, modern prophet vurğulayır.",
    },
    social_proof: 1340,
    percent_of_users: 7,
    similar_minds: [
      { en: "Joseph Smith", ru: "Джозеф Смит", az: "Cozef Smit" },
      { en: "Brigham Young", ru: "Бригам Янг", az: "Briqam Yanq" },
      { en: "Russell M. Nelson", ru: "Рассел М. Нельсон", az: "Rassel M. Nelson" },
    ],
    tags: ["protestant"],
  },
  terminal_lds_coc: {
    node_id: "terminal_lds_coc",
    title: { en: "The Community of Christ (LDS)", ru: "Община Христа (СПД)", az: "Məsih icması (LDS)" },
    blueprint: {
      en: "You are a Protestant Christian of the Community of Christ — Latter Day Saint, ecumenical and progressive tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Community of Christ — Latter Day Saint, ecumenical and progressive.",
      ru: "Вы — протестантский христианин традиции Community of Christ — Latter Day Saint, ecumenical and progressive. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Community of Christ — Latter Day Saint, ecumenical and progressive.",
      az: "Siz Community of Christ — Latter Day Saint, ecumenical and progressive ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Community of Christ — Latter Day Saint, ecumenical and progressive vurğulayır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "Joseph Smith III", ru: "Джозеф Смит III", az: "Cozef Smit III" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_lds_other: {
    node_id: "terminal_lds_other",
    title: { en: "The Other Latter Day Saint", ru: "Другой святой последних дней", az: "Digər axırıncı gün müqəddəsi" },
    blueprint: {
      en: "You are a Protestant Christian of the Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite tradition. Sola Scriptura, sola fide — salvation by grace through faith alone, and the Bible as final authority. Your path emphasizes Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite.",
      ru: "Вы — протестантский христианин традиции Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite. Sola Scriptura, sola fide — спасение благодатью через одну веру, и Библия как высший авторитет. Ваш путь подчёркивает Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite.",
      az: "Siz Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite ənənəsindən olan Protestant xristiansınız. Sola Scriptura, sola fide — yalnız imanla lütf vasitəsilə xilas və Müqəddəs Kitab ali səlahiyyət kimi. Sizin yolunuz Other Latter Day Saint movement — Strangite, Bickertonite, or Hedrickite vurğulayır.",
    },
    social_proof: 120,
    percent_of_users: 1,
    similar_minds: [
      { en: "James Strang", ru: "Джеймс Стрэнг", az: "Ceyms Streynq" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
      { en: "The Restorationists", ru: "Реставрационисты", az: "Restavrasionistlər" },
    ],
    tags: ["protestant"],
  },
  terminal_islam_ibadi: {
    node_id: "terminal_islam_ibadi",
    title: { en: "The Ibadi Muslim", ru: "Ибадит", az: "İbadi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Ibadi Islam of Oman — moderate Kharijite heritage. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Ibadi Islam of Oman — moderate Kharijite heritage within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Ibadi Islam of Oman — moderate Kharijite heritage. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Ibadi Islam of Oman — moderate Kharijite heritage в единстве ислама (таухид).",
      az: "Siz Ibadi Islam of Oman — moderate Kharijite heritage İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Ibadi Islam of Oman — moderate Kharijite heritage vurğulayır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Jābir ibn Zayd", ru: "Джабир ибн Зайд", az: "Cabir ibn Zeyd" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_just_muslim: {
    node_id: "terminal_islam_just_muslim",
    title: { en: "The Non-Madhhab Muslim", ru: "Мусульманин без мазхаба", az: "Məzhəbsiz müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of non-denominational — simply Muslim. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes non-denominational — simply Muslim within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути non-denominational — simply Muslim. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает non-denominational — simply Muslim в единстве ислама (таухид).",
      az: "Siz non-denominational — simply Muslim İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) non-denominational — simply Muslim vurğulayır.",
    },
    social_proof: 690,
    percent_of_users: 4,
    similar_minds: [
      { en: "Malcolm X", ru: "Малькольм Икс", az: "Malkolm X" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_maturidi: {
    node_id: "terminal_islam_maturidi",
    title: { en: "The Maturidi Hanafi", ru: "Матуридит-ханафит", az: "Maturidi hənəfi" },
    blueprint: {
      en: "You follow the Islamic path of Maturidi creed within Hanafi jurisprudence — reason and revelation. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Maturidi creed within Hanafi jurisprudence — reason and revelation within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Maturidi creed within Hanafi jurisprudence — reason and revelation. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Maturidi creed within Hanafi jurisprudence — reason and revelation в единстве ислама (таухид).",
      az: "Siz Maturidi creed within Hanafi jurisprudence — reason and revelation İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Maturidi creed within Hanafi jurisprudence — reason and revelation vurğulayır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "Abu Mansur al-Maturidi", ru: "Абу Мансур аль-Матуриди", az: "Əbu Mənsur əl-Maturidi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_barelvi: {
    node_id: "terminal_islam_barelvi",
    title: { en: "The Barelvi Muslim", ru: "Барельви", az: "Bareylvi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Barelvi tradition — Sufi veneration and love of the Prophet. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Barelvi tradition — Sufi veneration and love of the Prophet within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Barelvi tradition — Sufi veneration and love of the Prophet. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Barelvi tradition — Sufi veneration and love of the Prophet в единстве ислама (таухид).",
      az: "Siz Barelvi tradition — Sufi veneration and love of the Prophet İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Barelvi tradition — Sufi veneration and love of the Prophet vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 4,
    similar_minds: [
      { en: "Ahmed Raza Khan", ru: "Ахмед Раза Хан", az: "Əhməd Rza Xan" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_tablighi: {
    node_id: "terminal_islam_tablighi",
    title: { en: "The Tablighi Muslim", ru: "Таблиг", az: "Təbliğçi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Tablighi Jamaat — the six principles of missionary da'wah. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Tablighi Jamaat — the six principles of missionary da'wah within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Tablighi Jamaat — the six principles of missionary da'wah. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Tablighi Jamaat — the six principles of missionary da'wah в единстве ислама (таухид).",
      az: "Siz Tablighi Jamaat — the six principles of missionary da'wah İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Tablighi Jamaat — the six principles of missionary da'wah vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Muhammad Ilyas Kandhlawi", ru: "Мухаммад Ильяс Кандхлави", az: "Məhəmməd İlyas Kandhlavi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_gulen: {
    node_id: "terminal_islam_gulen",
    title: { en: "The Hizmet Follower", ru: "Последователь Хизмет", az: "Hizmet davamçısı" },
    blueprint: {
      en: "You follow the Islamic path of Gülen / Hizmet movement — education and interfaith service. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Gülen / Hizmet movement — education and interfaith service within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Gülen / Hizmet movement — education and interfaith service. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Gülen / Hizmet movement — education and interfaith service в единстве ислама (таухид).",
      az: "Siz Gülen / Hizmet movement — education and interfaith service İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Gülen / Hizmet movement — education and interfaith service vurğulayır.",
    },
    social_proof: 290,
    percent_of_users: 2,
    similar_minds: [
      { en: "Fethullah Gülen", ru: "Фетхуллах Гюлен", az: "Fətullah Gülən" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_deobandi_main: {
    node_id: "terminal_islam_deobandi_main",
    title: { en: "The Deobandi Muslim", ru: "Деобанди", az: "Deobandi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Deobandi tradition — Darul Uloom, traditionalist reform. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Deobandi tradition — Darul Uloom, traditionalist reform within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Deobandi tradition — Darul Uloom, traditionalist reform. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Deobandi tradition — Darul Uloom, traditionalist reform в единстве ислама (таухид).",
      az: "Siz Deobandi tradition — Darul Uloom, traditionalist reform İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Deobandi tradition — Darul Uloom, traditionalist reform vurğulayır.",
    },
    social_proof: 720,
    percent_of_users: 4,
    similar_minds: [
      { en: "Muhammad Qasim Nanautavi", ru: "Мухаммад Касим Нанаутави", az: "Məhəmməd Qasim Nanautavi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_taliban: {
    node_id: "terminal_islam_taliban",
    title: { en: "The Taliban-aligned", ru: "Талибан-ориентированный", az: "Taliban yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Taliban-aligned Deobandism — Afghan student movement. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Taliban-aligned Deobandism — Afghan student movement within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Taliban-aligned Deobandism — Afghan student movement. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Taliban-aligned Deobandism — Afghan student movement в единстве ислама (таухид).",
      az: "Siz Taliban-aligned Deobandism — Afghan student movement İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Taliban-aligned Deobandism — Afghan student movement vurğulayır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "Mullah Omar", ru: "Мулла Омар", az: "Molla Ömər" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_jamiat_ulema: {
    node_id: "terminal_islam_jamiat_ulema",
    title: { en: "The Jamiat Ulema", ru: "Джамиат Улема", az: "Cəmiyyət üləma" },
    blueprint: {
      en: "You follow the Islamic path of Jamiat Ulema-e-Islam — political Deobandi party. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Jamiat Ulema-e-Islam — political Deobandi party within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Jamiat Ulema-e-Islam — political Deobandi party. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Jamiat Ulema-e-Islam — political Deobandi party в единстве ислама (таухид).",
      az: "Siz Jamiat Ulema-e-Islam — political Deobandi party İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Jamiat Ulema-e-Islam — political Deobandi party vurğulayır.",
    },
    social_proof: 190,
    percent_of_users: 1,
    similar_minds: [
      { en: "Maulana Shabbir Ahmad Usmani", ru: "Маулана Шаббир Ахмад Усмани", az: "Mövlana Şəbbir Əhməd Usmani" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_tijaniyyah: {
    node_id: "terminal_islam_tijaniyyah",
    title: { en: "The Tijani", ru: "Тиджани", az: "Ticani" },
    blueprint: {
      en: "You follow the Islamic path of Tijaniyyah Sufi order — West African devotion. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Tijaniyyah Sufi order — West African devotion within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Tijaniyyah Sufi order — West African devotion. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Tijaniyyah Sufi order — West African devotion в единстве ислама (таухид).",
      az: "Siz Tijaniyyah Sufi order — West African devotion İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Tijaniyyah Sufi order — West African devotion vurğulayır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Ahmad al-Tijani", ru: "Ахмад ат-Тиджани", az: "Əhməd ət-Ticani" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_qadiriyya: {
    node_id: "terminal_islam_qadiriyya",
    title: { en: "The Qadiri Sufi", ru: "Кадирийский суфий", az: "Qadiri sufi" },
    blueprint: {
      en: "You follow the Islamic path of Qadiriyya Sufi order — the oldest tariqa. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Qadiriyya Sufi order — the oldest tariqa within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Qadiriyya Sufi order — the oldest tariqa. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Qadiriyya Sufi order — the oldest tariqa в единстве ислама (таухид).",
      az: "Siz Qadiriyya Sufi order — the oldest tariqa İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Qadiriyya Sufi order — the oldest tariqa vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Abdul-Qadir Gilani", ru: "Абдул-Кадир Гилани", az: "Əbdülqadir Gilani" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_muridiyya: {
    node_id: "terminal_islam_muridiyya",
    title: { en: "The Murid", ru: "Мурид", az: "Murid" },
    blueprint: {
      en: "You follow the Islamic path of Muridiyya of Senegal — Amadou Bamba's path of work and prayer. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Muridiyya of Senegal — Amadou Bamba's path of work and prayer within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Muridiyya of Senegal — Amadou Bamba's path of work and prayer. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Muridiyya of Senegal — Amadou Bamba's path of work and prayer в единстве ислама (таухид).",
      az: "Siz Muridiyya of Senegal — Amadou Bamba's path of work and prayer İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Muridiyya of Senegal — Amadou Bamba's path of work and prayer vurğulayır.",
    },
    social_proof: 390,
    percent_of_users: 2,
    similar_minds: [
      { en: "Amadou Bamba", ru: "Амаду Бамба", az: "Amadu Bamba" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_maliki_orthodox: {
    node_id: "terminal_islam_maliki_orthodox",
    title: { en: "The Maliki Muslim", ru: "Маликит", az: "Maliki müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Maliki fiqh without Sufi affiliation. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Maliki fiqh without Sufi affiliation within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Maliki fiqh without Sufi affiliation. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Maliki fiqh without Sufi affiliation в единстве ислама (таухид).",
      az: "Siz Maliki fiqh without Sufi affiliation İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Maliki fiqh without Sufi affiliation vurğulayır.",
    },
    social_proof: 720,
    percent_of_users: 4,
    similar_minds: [
      { en: "Malik ibn Anas", ru: "Малик ибн Анас", az: "Malik ibn Ənəs" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_ba_alawi: {
    node_id: "terminal_islam_ba_alawi",
    title: { en: "The Ba 'Alawi Sufi", ru: "Суфий Ба 'Алави", az: "Ba 'Alavi sufi" },
    blueprint: {
      en: "You follow the Islamic path of Ba 'Alawi Sufi tradition of Yemen and Indonesia. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Ba 'Alawi Sufi tradition of Yemen and Indonesia within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Ba 'Alawi Sufi tradition of Yemen and Indonesia. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Ba 'Alawi Sufi tradition of Yemen and Indonesia в единстве ислама (таухид).",
      az: "Siz Ba 'Alawi Sufi tradition of Yemen and Indonesia İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Ba 'Alawi Sufi tradition of Yemen and Indonesia vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Habib Umar bin Hafiz", ru: "Хабиб Умар бин Хафиз", az: "Həbib Ömər bin Hafiz" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_shadhiliyya: {
    node_id: "terminal_islam_shadhiliyya",
    title: { en: "The Shadhili Sufi", ru: "Шазилийский суфий", az: "Şazili sufi" },
    blueprint: {
      en: "You follow the Islamic path of Shadhiliyya Sufi order — Egypt and the Levant. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Shadhiliyya Sufi order — Egypt and the Levant within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Shadhiliyya Sufi order — Egypt and the Levant. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Shadhiliyya Sufi order — Egypt and the Levant в единстве ислама (таухид).",
      az: "Siz Shadhiliyya Sufi order — Egypt and the Levant İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Shadhiliyya Sufi order — Egypt and the Levant vurğulayır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Abu al-Hasan al-Shadhili", ru: "Абу аль-Хасан аш-Шазили", az: "Əbu əl-Həsən əş-Şazili" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_shafii_ashari: {
    node_id: "terminal_islam_shafii_ashari",
    title: { en: "The Ash'ari Shafi'i", ru: "Ашарит-шафиит", az: "Əşəri şafii" },
    blueprint: {
      en: "You follow the Islamic path of Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream в единстве ислама (таухид).",
      az: "Siz Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Ash'ari creed with Shafi'i fiqh — Southeast Asian mainstream vurğulayır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "Abu al-Hasan al-Ash'ari", ru: "Абу аль-Хасан аль-Ашари", az: "Əbu əl-Həsən əl-Əşəri" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_shafii_orthodox: {
    node_id: "terminal_islam_shafii_orthodox",
    title: { en: "The Shafi'i Muslim", ru: "Шафиит", az: "Şafii müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Shafi'i fiqh path. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Shafi'i fiqh path within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Shafi'i fiqh path. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Shafi'i fiqh path в единстве ислама (таухид).",
      az: "Siz Shafi'i fiqh path İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Shafi'i fiqh path vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 4,
    similar_minds: [
      { en: "Al-Shafi'i", ru: "Аш-Шафии", az: "əş-Şafii" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_athari_hanbali: {
    node_id: "terminal_islam_athari_hanbali",
    title: { en: "The Athari Hanbali", ru: "Асарский ханбалит", az: "Əsəri hənbəli" },
    blueprint: {
      en: "You follow the Islamic path of Athari Hanbali — textual literalism of the Salaf. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Athari Hanbali — textual literalism of the Salaf within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Athari Hanbali — textual literalism of the Salaf. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Athari Hanbali — textual literalism of the Salaf в единстве ислама (таухид).",
      az: "Siz Athari Hanbali — textual literalism of the Salaf İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Athari Hanbali — textual literalism of the Salaf vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Ibn Taymiyyah", ru: "Ибн Таймия", az: "İbn Teymiyyə" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_saudi_wahhabi: {
    node_id: "terminal_islam_saudi_wahhabi",
    title: { en: "The Saudi Wahhabi", ru: "Саудовский ваххабит", az: "Səudiyyə vəhhabi" },
    blueprint: {
      en: "You follow the Islamic path of Official Wahhabism — state-sponsored purification of Saudi Arabia. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Official Wahhabism — state-sponsored purification of Saudi Arabia within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Official Wahhabism — state-sponsored purification of Saudi Arabia. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Official Wahhabism — state-sponsored purification of Saudi Arabia в единстве ислама (таухид).",
      az: "Siz Official Wahhabism — state-sponsored purification of Saudi Arabia İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Official Wahhabism — state-sponsored purification of Saudi Arabia vurğulayır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "Muhammad ibn Abd al-Wahhab", ru: "Мухаммад ибн Абд аль-Ваххаб", az: "Məhəmməd ibn Əbdül-Vəhhab" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_quietist_salafi: {
    node_id: "terminal_islam_quietist_salafi",
    title: { en: "The Quietist Salafi", ru: "Тихий салафит", az: "Sakit sələfi" },
    blueprint: {
      en: "You follow the Islamic path of Quietist Salafism — obedience to rulers, no politics. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Quietist Salafism — obedience to rulers, no politics within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Quietist Salafism — obedience to rulers, no politics. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Quietist Salafism — obedience to rulers, no politics в единстве ислама (таухид).",
      az: "Siz Quietist Salafism — obedience to rulers, no politics İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Quietist Salafism — obedience to rulers, no politics vurğulayır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Rabee al-Madkhali", ru: "Раби аль-Мадхали", az: "Rəbi əl-Mədxali" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_activist_salafi: {
    node_id: "terminal_islam_activist_salafi",
    title: { en: "The Activist Salafi", ru: "Активистский салафит", az: "Aktivist sələfi" },
    blueprint: {
      en: "You follow the Islamic path of Haraki / Sahwa Salafism — political engagement. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Haraki / Sahwa Salafism — political engagement within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Haraki / Sahwa Salafism — political engagement. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Haraki / Sahwa Salafism — political engagement в единстве ислама (таухид).",
      az: "Siz Haraki / Sahwa Salafism — political engagement İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Haraki / Sahwa Salafism — political engagement vurğulayır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Safar al-Hawali", ru: "Сафар аль-Хавали", az: "Səfər əl-Havali" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_pure_salafi: {
    node_id: "terminal_islam_pure_salafi",
    title: { en: "The Salafi Muslim", ru: "Салафит", az: "Sələfi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Salafiyya — revival of the first generations. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Salafiyya — revival of the first generations within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Salafiyya — revival of the first generations. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Salafiyya — revival of the first generations в единстве ислама (таухид).",
      az: "Siz Salafiyya — revival of the first generations İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Salafiyya — revival of the first generations vurğulayır.",
    },
    social_proof: 690,
    percent_of_users: 4,
    similar_minds: [
      { en: "Ibn Baz", ru: "Ибн Баз", az: "İbn Baz" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_alqaeda: {
    node_id: "terminal_islam_alqaeda",
    title: { en: "The Al-Qaeda Aligned", ru: "Аль-Каида-ориентированный", az: "Əl-Qaidə yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Al-Qaeda — global jihad network of Osama bin Laden. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Al-Qaeda — global jihad network of Osama bin Laden within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Al-Qaeda — global jihad network of Osama bin Laden. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Al-Qaeda — global jihad network of Osama bin Laden в единстве ислама (таухид).",
      az: "Siz Al-Qaeda — global jihad network of Osama bin Laden İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Al-Qaeda — global jihad network of Osama bin Laden vurğulayır.",
    },
    social_proof: 150,
    percent_of_users: 1,
    similar_minds: [
      { en: "Osama bin Laden", ru: "Усама бен Ладен", az: "Usamə bin Laden" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_isis: {
    node_id: "terminal_islam_isis",
    title: { en: "The ISIS Aligned", ru: "ИГИЛ-ориентированный", az: "İŞİD yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi в единстве ислама (таухид).",
      az: "Siz ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) ISIS / ISIL / Daesh — self-styled caliphate of Abu Bakr al-Baghdadi vurğulayır.",
    },
    social_proof: 120,
    percent_of_users: 1,
    similar_minds: [
      { en: "Abu Bakr al-Baghdadi", ru: "Абу Бакр аль-Багдади", az: "Əbu Bəkr əl-Bağdadi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_boko_haram: {
    node_id: "terminal_islam_boko_haram",
    title: { en: "The Boko Haram Aligned", ru: "Боко Харам-ориентированный", az: "Boko Haram yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Boko Haram — West African takfiri jihadism. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Boko Haram — West African takfiri jihadism within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Boko Haram — West African takfiri jihadism. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Boko Haram — West African takfiri jihadism в единстве ислама (таухид).",
      az: "Siz Boko Haram — West African takfiri jihadism İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Boko Haram — West African takfiri jihadism vurğulayır.",
    },
    social_proof: 80,
    percent_of_users: 0,
    similar_minds: [
      { en: "Abubakar Shekau", ru: "Абубакар Шекау", az: "Abubakar Şekau" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_al_shabaab: {
    node_id: "terminal_islam_al_shabaab",
    title: { en: "The Al-Shabaab Aligned", ru: "Аш-Шабаб-ориентированный", az: "Əş-Şəbab yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Al-Shabaab — East African jihadist movement. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Al-Shabaab — East African jihadist movement within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Al-Shabaab — East African jihadist movement. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Al-Shabaab — East African jihadist movement в единстве ислама (таухид).",
      az: "Siz Al-Shabaab — East African jihadist movement İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Al-Shabaab — East African jihadist movement vurğulayır.",
    },
    social_proof: 70,
    percent_of_users: 0,
    similar_minds: [
      { en: "Ahmed Godane", ru: "Ахмед Годане", az: "Əhməd Godane" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_hts: {
    node_id: "terminal_islam_hts",
    title: { en: "The HTS Aligned", ru: "ХТШ-ориентированный", az: "HTS yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Hay'at Tahrir al-Sham — Syrian jihadist coalition. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Hay'at Tahrir al-Sham — Syrian jihadist coalition within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Hay'at Tahrir al-Sham — Syrian jihadist coalition. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Hay'at Tahrir al-Sham — Syrian jihadist coalition в единстве ислама (таухид).",
      az: "Siz Hay'at Tahrir al-Sham — Syrian jihadist coalition İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Hay'at Tahrir al-Sham — Syrian jihadist coalition vurğulayır.",
    },
    social_proof: 90,
    percent_of_users: 0,
    similar_minds: [
      { en: "Abu Mohammad al-Julani", ru: "Абу Мухаммад аль-Джулани", az: "Əbu Məhəmməd əl-Culani" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_jihadist_other: {
    node_id: "terminal_islam_jihadist_other",
    title: { en: "The Jihadist", ru: "Джихадист", az: "Cihadist" },
    blueprint: {
      en: "You follow the Islamic path of other Salafi-Jihadist affiliation. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes other Salafi-Jihadist affiliation within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути other Salafi-Jihadist affiliation. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает other Salafi-Jihadist affiliation в единстве ислама (таухид).",
      az: "Siz other Salafi-Jihadist affiliation İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) other Salafi-Jihadist affiliation vurğulayır.",
    },
    social_proof: 100,
    percent_of_users: 1,
    similar_minds: [
      { en: "Abdullah Azzam", ru: "Абдулла Аззам", az: "Abdulla Əzzam" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_alawite: {
    node_id: "terminal_islam_alawite",
    title: { en: "The Alawite", ru: "Алавит", az: "Ələvi" },
    blueprint: {
      en: "You follow the Islamic path of Alawite (Nusayri) — Syria's distinct Shia theology. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Alawite (Nusayri) — Syria's distinct Shia theology within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Alawite (Nusayri) — Syria's distinct Shia theology. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Alawite (Nusayri) — Syria's distinct Shia theology в единстве ислама (таухид).",
      az: "Siz Alawite (Nusayri) — Syria's distinct Shia theology İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Alawite (Nusayri) — Syria's distinct Shia theology vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Ibn Nusayr", ru: "Ибн Нусайр", az: "İbn Nüsəyr" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_alevi: {
    node_id: "terminal_islam_alevi",
    title: { en: "The Alevi", ru: "Алевит", az: "Ələvi" },
    blueprint: {
      en: "You follow the Islamic path of Alevism of Turkey — Anatolian folk Shia with Sufi elements. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Alevism of Turkey — Anatolian folk Shia with Sufi elements within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Alevism of Turkey — Anatolian folk Shia with Sufi elements. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Alevism of Turkey — Anatolian folk Shia with Sufi elements в единстве ислама (таухид).",
      az: "Siz Alevism of Turkey — Anatolian folk Shia with Sufi elements İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Alevism of Turkey — Anatolian folk Shia with Sufi elements vurğulayır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Haji Bektash Veli", ru: "Хаджи Бекташ Вели", az: "Hacı Bəktaş Vəli" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_akhbari: {
    node_id: "terminal_islam_akhbari",
    title: { en: "The Akhbari Shia", ru: "Ахбарит", az: "Əxbari şiə" },
    blueprint: {
      en: "You follow the Islamic path of Akhbari Twelver — tradition only, no ijtihad. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Akhbari Twelver — tradition only, no ijtihad within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Akhbari Twelver — tradition only, no ijtihad. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Akhbari Twelver — tradition only, no ijtihad в единстве ислама (таухид).",
      az: "Siz Akhbari Twelver — tradition only, no ijtihad İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Akhbari Twelver — tradition only, no ijtihad vurğulayır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "Muhammad Amin al-Astarabadi", ru: "Мухаммад Амин аль-Астарабади", az: "Məhəmməd Əmin əl-Əstərabadi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_shaykhi: {
    node_id: "terminal_islam_shaykhi",
    title: { en: "The Shaykhi Shia", ru: "Шейхит", az: "Şeyxi şiə" },
    blueprint: {
      en: "You follow the Islamic path of Shaykhism — 19th-century esoteric Twelver school. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Shaykhism — 19th-century esoteric Twelver school within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Shaykhism — 19th-century esoteric Twelver school. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Shaykhism — 19th-century esoteric Twelver school в единстве ислама (таухид).",
      az: "Siz Shaykhism — 19th-century esoteric Twelver school İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Shaykhism — 19th-century esoteric Twelver school vurğulayır.",
    },
    social_proof: 190,
    percent_of_users: 1,
    similar_minds: [
      { en: "Ahmad al-Ahsa'i", ru: "Ахмад аль-Ахсаи", az: "Əhməd əl-Əhsai" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_iranian_establishment: {
    node_id: "terminal_islam_iranian_establishment",
    title: { en: "The Iranian Establishment Shia", ru: "Шиит иранского истеблишмента", az: "İran rəhbərliyi şiəsi" },
    blueprint: {
      en: "You follow the Islamic path of Iranian establishment — Velayat-e Faqih, Islamic Republic. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Iranian establishment — Velayat-e Faqih, Islamic Republic within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Iranian establishment — Velayat-e Faqih, Islamic Republic. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Iranian establishment — Velayat-e Faqih, Islamic Republic в единстве ислама (таухид).",
      az: "Siz Iranian establishment — Velayat-e Faqih, Islamic Republic İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Iranian establishment — Velayat-e Faqih, Islamic Republic vurğulayır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "Ruhollah Khomeini", ru: "Рухолла Хомейни", az: "Ruhullah Xomeyni" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_hezbollah: {
    node_id: "terminal_islam_hezbollah",
    title: { en: "The Hezbollah-aligned", ru: "Хезболла-ориентированный", az: "Hizbullah yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Hezbollah — Lebanese resistance movement. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Hezbollah — Lebanese resistance movement within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Hezbollah — Lebanese resistance movement. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Hezbollah — Lebanese resistance movement в единстве ислама (таухид).",
      az: "Siz Hezbollah — Lebanese resistance movement İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Hezbollah — Lebanese resistance movement vurğulayır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Hassan Nasrallah", ru: "Хасан Насралла", az: "Həsən Nəsrullah" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_al_dawa: {
    node_id: "terminal_islam_al_dawa",
    title: { en: "The Al-Da'wa Shia", ru: "Шиит партии Да'ва", az: "Dəvət partiyası şiəsi" },
    blueprint: {
      en: "You follow the Islamic path of Al-Da'wa Party — Iraqi Twelver political Islam. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Al-Da'wa Party — Iraqi Twelver political Islam within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Al-Da'wa Party — Iraqi Twelver political Islam. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Al-Da'wa Party — Iraqi Twelver political Islam в единстве ислама (таухид).",
      az: "Siz Al-Da'wa Party — Iraqi Twelver political Islam İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Al-Da'wa Party — Iraqi Twelver political Islam vurğulayır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Muhammad Baqir al-Sadr", ru: "Мухаммад Бакир ас-Садр", az: "Məhəmməd Baqir əs-Sədr" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_najaf_quietist: {
    node_id: "terminal_islam_najaf_quietist",
    title: { en: "The Najaf Quietist Shia", ru: "Тихий шиит Наджафа", az: "Nəcəf sakit şiəsi" },
    blueprint: {
      en: "You follow the Islamic path of Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship в единстве ислама (таухид).",
      az: "Siz Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Najaf quietism — Grand Ayatollah Sistani's apolitical scholarship vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Ali al-Sistani", ru: "Али ас-Систани", az: "Əli əs-Sistani" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_azerbaijani_twelver: {
    node_id: "terminal_islam_azerbaijani_twelver",
    title: { en: "The Azerbaijani Twelver", ru: "Азербайджанский шиит", az: "Azərbaycan şiəsi" },
    blueprint: {
      en: "You follow the Islamic path of Azerbaijani / Caspian Twelver Shi'ism — regional religious identity. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Azerbaijani / Caspian Twelver Shi'ism — regional religious identity within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Azerbaijani / Caspian Twelver Shi'ism — regional religious identity. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Azerbaijani / Caspian Twelver Shi'ism — regional religious identity в единстве ислама (таухид).",
      az: "Siz Azerbaijani / Caspian Twelver Shi'ism — regional religious identity İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Azerbaijani / Caspian Twelver Shi'ism — regional religious identity vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 4,
    similar_minds: [
      { en: "Nasimi", ru: "Насими", az: "Nəsimi" },
      { en: "Shah Ismail Khatai", ru: "Шах Исмаил Хатаи", az: "Şah İsmayıl Xətai" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_ismaili_other: {
    node_id: "terminal_islam_ismaili_other",
    title: { en: "The Ismaili Muslim", ru: "Исмаилит", az: "İsmaili müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Ismaili tradition without specific lineage. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Ismaili tradition without specific lineage within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Ismaili tradition without specific lineage. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Ismaili tradition without specific lineage в единстве ислама (таухид).",
      az: "Siz Ismaili tradition without specific lineage İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Ismaili tradition without specific lineage vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Nasir Khusraw", ru: "Насир Хосров", az: "Nasir Xosrov" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_nizari_modern: {
    node_id: "terminal_islam_nizari_modern",
    title: { en: "The Nizari Ismaili", ru: "Низарит-исмаилит", az: "Nizari ismaili" },
    blueprint: {
      en: "You follow the Islamic path of Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism в единстве ислама (таухид).",
      az: "Siz Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Nizari Ismailism — the living Imam, Aga Khan IV, and pluralism vurğulayır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Aga Khan IV", ru: "Ага Хан IV", az: "Ağa Xan IV" },
      { en: "Rumi", ru: "Руми", az: "Rumi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_hashashin: {
    node_id: "terminal_islam_hashashin",
    title: { en: "The Hashashin Heritage", ru: "Наследие ассасинов", az: "Haşşaşin irsi" },
    blueprint: {
      en: "You follow the Islamic path of Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah в единстве ислама (таухид).",
      az: "Siz Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Hashashins — the Nizari Ismaili order of Alamut, fortress-state of Hassan-i Sabbah vurğulayır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "Hassan-i Sabbah", ru: "Хасан ибн Саббах", az: "Həsən ibn Sabbah" },
      { en: "Rashid al-Din Sinan", ru: "Рашид ад-Дин Синан", az: "Rəşid əd-Din Sinan" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_dawoodi_bohra: {
    node_id: "terminal_islam_dawoodi_bohra",
    title: { en: "The Dawoodi Bohra", ru: "Давуди-бохра", az: "Davudi bohra" },
    blueprint: {
      en: "You follow the Islamic path of Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq в единстве ислама (таухид).",
      az: "Siz Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Dawoodi Bohras — Mumbai merchant community, the Da'i al-Mutlaq vurğulayır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Syedna Mohammed Burhanuddin", ru: "Сайедна Мохаммед Бурхануддин", az: "Seydna Məhəmməd Burhanuddin" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_sulaymani_bohra: {
    node_id: "terminal_islam_sulaymani_bohra",
    title: { en: "The Sulaymani Bohra", ru: "Сулеймани-бохра", az: "Süleymani bohra" },
    blueprint: {
      en: "You follow the Islamic path of Sulaymani Bohras of Yemen. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Sulaymani Bohras of Yemen within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Sulaymani Bohras of Yemen. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Sulaymani Bohras of Yemen в единстве ислама (таухид).",
      az: "Siz Sulaymani Bohras of Yemen İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Sulaymani Bohras of Yemen vurğulayır.",
    },
    social_proof: 110,
    percent_of_users: 1,
    similar_minds: [
      { en: "Sulayman ibn Hassan", ru: "Сулейман ибн Хассан", az: "Süleyman ibn Həsən" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_alavi_bohra: {
    node_id: "terminal_islam_alavi_bohra",
    title: { en: "The Alavi Bohra", ru: "Алави-бохра", az: "Əlavi bohra" },
    blueprint: {
      en: "You follow the Islamic path of Alavi Bohras of India. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Alavi Bohras of India within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Alavi Bohras of India. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Alavi Bohras of India в единстве ислама (таухид).",
      az: "Siz Alavi Bohras of India İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Alavi Bohras of India vurğulayır.",
    },
    social_proof: 90,
    percent_of_users: 0,
    similar_minds: [
      { en: "Syedna Khuzaima Qutbuddin", ru: "Сайедна Хузайма Кутбуддин", az: "Seydna Xuzayma Qutbuddin" },
      { en: "Ali ibn Abi Talib", ru: "Али ибн Аби Талиб", az: "Əli ibn Əbi Talib" },
      { en: "The Fatimid Imams", ru: "Фатимидские имамы", az: "Fatimi imamları" },
    ],
    tags: ["islam"],
  },
  terminal_islam_zaidi_traditional: {
    node_id: "terminal_islam_zaidi_traditional",
    title: { en: "The Zaidi Muslim", ru: "Зейдит", az: "Zeydi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of Traditional Zaidism — Yemen's Hadawi school, closest to Sunni. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Traditional Zaidism — Yemen's Hadawi school, closest to Sunni within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Traditional Zaidism — Yemen's Hadawi school, closest to Sunni. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Traditional Zaidism — Yemen's Hadawi school, closest to Sunni в единстве ислама (таухид).",
      az: "Siz Traditional Zaidism — Yemen's Hadawi school, closest to Sunni İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Traditional Zaidism — Yemen's Hadawi school, closest to Sunni vurğulayır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Zayd ibn Ali", ru: "Зейд ибн Али", az: "Zeyd ibn Əli" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_houthi: {
    node_id: "terminal_islam_houthi",
    title: { en: "The Houthi-aligned", ru: "Хусит-ориентированный", az: "Husi yönümlü" },
    blueprint: {
      en: "You follow the Islamic path of Houthi / Ansar Allah — Zaidi revivalist movement of Yemen. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Houthi / Ansar Allah — Zaidi revivalist movement of Yemen within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Houthi / Ansar Allah — Zaidi revivalist movement of Yemen. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Houthi / Ansar Allah — Zaidi revivalist movement of Yemen в единстве ислама (таухид).",
      az: "Siz Houthi / Ansar Allah — Zaidi revivalist movement of Yemen İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Houthi / Ansar Allah — Zaidi revivalist movement of Yemen vurğulayır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "Abdul-Malik al-Houthi", ru: "Абдул-Малик аль-Хуси", az: "Əbdül-Malik əl-Husi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_naqshbandi: {
    node_id: "terminal_islam_naqshbandi",
    title: { en: "The Naqshbandi Sufi", ru: "Накшбандийский суфий", az: "Nəqşibəndi sufi" },
    blueprint: {
      en: "You follow the Islamic path of Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey в единстве ислама (таухид).",
      az: "Siz Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Naqshbandi Sufi order — silent dhikr of Central Asia and Turkey vurğulayır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "Baha-ud-Din Naqshband", ru: "Бахауддин Накшбанд", az: "Bəhaəddin Nəqşibənd" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_mevlevi: {
    node_id: "terminal_islam_mevlevi",
    title: { en: "The Mevlevi", ru: "Мевлеви", az: "Mövləvi" },
    blueprint: {
      en: "You follow the Islamic path of Mevlevi order — the whirling dervishes of Rumi. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Mevlevi order — the whirling dervishes of Rumi within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Mevlevi order — the whirling dervishes of Rumi. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Mevlevi order — the whirling dervishes of Rumi в единстве ислама (таухид).",
      az: "Siz Mevlevi order — the whirling dervishes of Rumi İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Mevlevi order — the whirling dervishes of Rumi vurğulayır.",
    },
    social_proof: 640,
    percent_of_users: 4,
    similar_minds: [
      { en: "Rumi", ru: "Руми", az: "Rumi" },
      { en: "Sultan Walad", ru: "Султан Валад", az: "Sultan Vələd" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_chishti: {
    node_id: "terminal_islam_chishti",
    title: { en: "The Chishti Sufi", ru: "Чиштийский суфий", az: "Çişti sufi" },
    blueprint: {
      en: "You follow the Islamic path of Chishti order — the love-centered Sufism of the Indian subcontinent. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes Chishti order — the love-centered Sufism of the Indian subcontinent within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути Chishti order — the love-centered Sufism of the Indian subcontinent. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает Chishti order — the love-centered Sufism of the Indian subcontinent в единстве ислама (таухид).",
      az: "Siz Chishti order — the love-centered Sufism of the Indian subcontinent İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) Chishti order — the love-centered Sufism of the Indian subcontinent vurğulayır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "Moinuddin Chishti", ru: "Муинуддин Чишти", az: "Moinuddin Çişti" },
      { en: "Nizamuddin Auliya", ru: "Низамуддин Аулия", az: "Nizamuddin Övliya" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_islam_sufi_other: {
    node_id: "terminal_islam_sufi_other",
    title: { en: "The Sufi Muslim", ru: "Суфий", az: "Sufi müsəlman" },
    blueprint: {
      en: "You follow the Islamic path of non-affiliated Islamic mysticism. Allah is One, without partner, and Muhammad is His final messenger. Your tradition emphasizes non-affiliated Islamic mysticism within the unity of Islam (tawhid).",
      ru: "Вы следуете исламскому пути non-affiliated Islamic mysticism. Аллах Един, без сотоварищей, и Мухаммад — Его последний посланник. Ваша традиция подчёркивает non-affiliated Islamic mysticism в единстве ислама (таухид).",
      az: "Siz non-affiliated Islamic mysticism İslam yolunu izləyirsiniz. Allah Birdir, şəriksizdir və Məhəmməd Onun son elçisidir. Sizin ənənəniz İslam birliyində (tövhid) non-affiliated Islamic mysticism vurğulayır.",
    },
    social_proof: 690,
    percent_of_users: 4,
    similar_minds: [
      { en: "Al-Ghazali", ru: "Аль-Газали", az: "əl-Qəzali" },
      { en: "Ibn Arabi", ru: "Ибн Араби", az: "İbn Ərəbi" },
      { en: "The Ulema", ru: "Улемы", az: "Üləma" },
    ],
    tags: ["islam"],
  },
  terminal_judaism_conservative: {
    node_id: "terminal_judaism_conservative",
    title: { en: "The Conservative Jew", ru: "Консервативный иудей", az: "Konservativ yəhudi" },
    blueprint: {
      en: "You are Jewish within the Conservative Judaism — Halakha as evolving tradition tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Conservative Judaism — Halakha as evolving tradition.",
      ru: "Вы — иудей в традиции Conservative Judaism — Halakha as evolving tradition. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Conservative Judaism — Halakha as evolving tradition.",
      az: "Siz Conservative Judaism — Halakha as evolving tradition ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Conservative Judaism — Halakha as evolving tradition yolunuzu formalaşdırır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Abraham Joshua Heschel", ru: "Авраам Иошуа Хешель", az: "İbrahim Yoşua Heşel" },
      { en: "Solomon Schechter", ru: "Соломон Шехтер", az: "Solomon Şexter" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_reform: {
    node_id: "terminal_judaism_reform",
    title: { en: "The Reform Jew", ru: "Реформистский иудей", az: "Reform yəhudisi" },
    blueprint: {
      en: "You are Jewish within the Reform Judaism — ethics over law, Tikkun Olam tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Reform Judaism — ethics over law, Tikkun Olam.",
      ru: "Вы — иудей в традиции Reform Judaism — ethics over law, Tikkun Olam. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Reform Judaism — ethics over law, Tikkun Olam.",
      az: "Siz Reform Judaism — ethics over law, Tikkun Olam ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Reform Judaism — ethics over law, Tikkun Olam yolunuzu formalaşdırır.",
    },
    social_proof: 690,
    percent_of_users: 4,
    similar_minds: [
      { en: "Abraham Geiger", ru: "Авраам Гейгер", az: "İbrahim Qeyqer" },
      { en: "Stephen S. Wise", ru: "Стивен С. Вайз", az: "Stiven S. Vayz" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_reconstructionist: {
    node_id: "terminal_judaism_reconstructionist",
    title: { en: "The Reconstructionist Jew", ru: "Реконструктивистский иудей", az: "Rekonstruksionist yəhudi" },
    blueprint: {
      en: "You are Jewish within the Reconstructionist Judaism — Judaism as evolving civilization tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Reconstructionist Judaism — Judaism as evolving civilization.",
      ru: "Вы — иудей в традиции Reconstructionist Judaism — Judaism as evolving civilization. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Reconstructionist Judaism — Judaism as evolving civilization.",
      az: "Siz Reconstructionist Judaism — Judaism as evolving civilization ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Reconstructionist Judaism — Judaism as evolving civilization yolunuzu formalaşdırır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Mordecai Kaplan", ru: "Мордекай Каплан", az: "Mordekay Kaplan" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_karaites: {
    node_id: "terminal_judaism_karaites",
    title: { en: "The Karaite Jew", ru: "Караим", az: "Karaim yəhudisi" },
    blueprint: {
      en: "You are Jewish within the Karaite Judaism — Torah alone, rejecting the Talmud tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Karaite Judaism — Torah alone, rejecting the Talmud.",
      ru: "Вы — иудей в традиции Karaite Judaism — Torah alone, rejecting the Talmud. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Karaite Judaism — Torah alone, rejecting the Talmud.",
      az: "Siz Karaite Judaism — Torah alone, rejecting the Talmud ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Karaite Judaism — Torah alone, rejecting the Talmud yolunuzu formalaşdırır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "Anan ben David", ru: "Анан бен Давид", az: "Anan ben David" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_samaritan: {
    node_id: "terminal_judaism_samaritan",
    title: { en: "The Samaritan", ru: "Самаритянин", az: "Samariyalı" },
    blueprint: {
      en: "You are Jewish within the Samaritan community — Mount Gerizim, the Samaritan Torah tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Samaritan community — Mount Gerizim, the Samaritan Torah.",
      ru: "Вы — иудей в традиции Samaritan community — Mount Gerizim, the Samaritan Torah. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Samaritan community — Mount Gerizim, the Samaritan Torah.",
      az: "Siz Samaritan community — Mount Gerizim, the Samaritan Torah ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Samaritan community — Mount Gerizim, the Samaritan Torah yolunuzu formalaşdırır.",
    },
    social_proof: 90,
    percent_of_users: 0,
    similar_minds: [
      { en: "Baba Rabba", ru: "Баба Рабба", az: "Baba Rabba" },
      { en: "Eleazar ben Tsedaka", ru: "Элеазар бен Цедака", az: "Eleazar ben Tsedaka" },
      { en: "The Abisha Scroll", ru: "Свиток Абиши", az: "Abişa Tumarı" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_centrist: {
    node_id: "terminal_judaism_centrist",
    title: { en: "The Centrist Orthodox Jew", ru: "Центристский ортодоксальный иудей", az: "Mərkəzçi ortodoks yəhudi" },
    blueprint: {
      en: "You are Jewish within the Centrist Orthodoxy — Torah u-Madda, Yeshiva University tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Centrist Orthodoxy — Torah u-Madda, Yeshiva University.",
      ru: "Вы — иудей в традиции Centrist Orthodoxy — Torah u-Madda, Yeshiva University. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Centrist Orthodoxy — Torah u-Madda, Yeshiva University.",
      az: "Siz Centrist Orthodoxy — Torah u-Madda, Yeshiva University ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Centrist Orthodoxy — Torah u-Madda, Yeshiva University yolunuzu formalaşdırır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Norman Lamm", ru: "Норман Ламм", az: "Norman Lamm" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_hardal: {
    node_id: "terminal_judaism_hardal",
    title: { en: "The Hardal Jew", ru: "Хардаль", az: "Hardal yəhudisi" },
    blueprint: {
      en: "You are Jewish within the Hardal — Nationalist Haredi, Torah and Zionism combined tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Hardal — Nationalist Haredi, Torah and Zionism combined.",
      ru: "Вы — иудей в традиции Hardal — Nationalist Haredi, Torah and Zionism combined. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Hardal — Nationalist Haredi, Torah and Zionism combined.",
      az: "Siz Hardal — Nationalist Haredi, Torah and Zionism combined ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Hardal — Nationalist Haredi, Torah and Zionism combined yolunuzu formalaşdırır.",
    },
    social_proof: 240,
    percent_of_users: 1,
    similar_minds: [
      { en: "Zvi Yehuda Kook", ru: "Цви Иегуда Кук", az: "Zvi Yehuda Kuk" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_litvish: {
    node_id: "terminal_judaism_litvish",
    title: { en: "The Litvak", ru: "Литвак", az: "Litvaş" },
    blueprint: {
      en: "You are Jewish within the Litvish / Misnagdim — Talmudic excellence and yeshiva culture tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Litvish / Misnagdim — Talmudic excellence and yeshiva culture.",
      ru: "Вы — иудей в традиции Litvish / Misnagdim — Talmudic excellence and yeshiva culture. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Litvish / Misnagdim — Talmudic excellence and yeshiva culture.",
      az: "Siz Litvish / Misnagdim — Talmudic excellence and yeshiva culture ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Litvish / Misnagdim — Talmudic excellence and yeshiva culture yolunuzu formalaşdırır.",
    },
    social_proof: 380,
    percent_of_users: 2,
    similar_minds: [
      { en: "Elijah of Vilna (Vilna Gaon)", ru: "Элиягу из Вильны (Виленский Гаон)", az: "Vilna Qaonu Eliyahu" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_sephardic_haredi: {
    node_id: "terminal_judaism_sephardic_haredi",
    title: { en: "The Sephardic Haredi", ru: "Сефардский хареди", az: "Sefarad haredi" },
    blueprint: {
      en: "You are Jewish within the Sephardic Haredi (Shas) — Mizrahi Torah tradition tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Sephardic Haredi (Shas) — Mizrahi Torah tradition.",
      ru: "Вы — иудей в традиции Sephardic Haredi (Shas) — Mizrahi Torah tradition. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Sephardic Haredi (Shas) — Mizrahi Torah tradition.",
      az: "Siz Sephardic Haredi (Shas) — Mizrahi Torah tradition ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Sephardic Haredi (Shas) — Mizrahi Torah tradition yolunuzu formalaşdırır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Ovadia Yosef", ru: "Овадия Йосеф", az: "Ovadiya Yosef" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_chabad: {
    node_id: "terminal_judaism_chabad",
    title: { en: "The Chabad Hasid", ru: "Хабадский хасид", az: "Xabad xasidi" },
    blueprint: {
      en: "You are Jewish within the Chabad-Lubavitch — outreach and the Rebbe's message tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Chabad-Lubavitch — outreach and the Rebbe's message.",
      ru: "Вы — иудей в традиции Chabad-Lubavitch — outreach and the Rebbe's message. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Chabad-Lubavitch — outreach and the Rebbe's message.",
      az: "Siz Chabad-Lubavitch — outreach and the Rebbe's message ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Chabad-Lubavitch — outreach and the Rebbe's message yolunuzu formalaşdırır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "Menachem Mendel Schneerson", ru: "Менахем Мендель Шнеерсон", az: "Menahem Mendl Şneerson" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_satmar: {
    node_id: "terminal_judaism_satmar",
    title: { en: "The Satmar Hasid", ru: "Сатмарский хасид", az: "Satmar xasidi" },
    blueprint: {
      en: "You are Jewish within the Satmar — insulated, fiercely anti-Zionist Hasidism tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Satmar — insulated, fiercely anti-Zionist Hasidism.",
      ru: "Вы — иудей в традиции Satmar — insulated, fiercely anti-Zionist Hasidism. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Satmar — insulated, fiercely anti-Zionist Hasidism.",
      az: "Siz Satmar — insulated, fiercely anti-Zionist Hasidism ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Satmar — insulated, fiercely anti-Zionist Hasidism yolunuzu formalaşdırır.",
    },
    social_proof: 290,
    percent_of_users: 2,
    similar_minds: [
      { en: "Joel Teitelbaum", ru: "Йоэль Тейтельбаум", az: "Yoel Teytelbaum" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_other_hasidic: {
    node_id: "terminal_judaism_other_hasidic",
    title: { en: "The Hasidic Jew", ru: "Хасид", az: "Xasid yəhudi" },
    blueprint: {
      en: "You are Jewish within the Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz.",
      ru: "Вы — иудей в традиции Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz.",
      az: "Siz Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Hasidic dynasty of Bobov, Ger, Belz, or Vizhnitz yolunuzu formalaşdırır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Baal Shem Tov", ru: "Баал-Шем-Тов", az: "Baal Şem Tov" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_religious_zionist: {
    node_id: "terminal_judaism_religious_zionist",
    title: { en: "The Religious Zionist", ru: "Религиозный сионист", az: "Dini sionist" },
    blueprint: {
      en: "You are Jewish within the Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel.",
      ru: "Вы — иудей в традиции Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel.",
      az: "Siz Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Religious Zionism — Mizrachi, Bnei Akiva, and the return to Israel yolunuzu formalaşdırır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Abraham Isaac Kook", ru: "Авраам Ицхак Кук", az: "İbrahim İshaq Kuk" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_open_orthodox: {
    node_id: "terminal_judaism_open_orthodox",
    title: { en: "The Open Orthodox Jew", ru: "Иудей открытой ортодоксии", az: "Açıq ortodoks yəhudi" },
    blueprint: {
      en: "You are Jewish within the Open Orthodoxy — progressive change within halakhic commitment tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Open Orthodoxy — progressive change within halakhic commitment.",
      ru: "Вы — иудей в традиции Open Orthodoxy — progressive change within halakhic commitment. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Open Orthodoxy — progressive change within halakhic commitment.",
      az: "Siz Open Orthodoxy — progressive change within halakhic commitment ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Open Orthodoxy — progressive change within halakhic commitment yolunuzu formalaşdırır.",
    },
    social_proof: 210,
    percent_of_users: 1,
    similar_minds: [
      { en: "Avi Weiss", ru: "Ави Вайс", az: "Avi Vays" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_judaism_torah_umadda: {
    node_id: "terminal_judaism_torah_umadda",
    title: { en: "The Torah u-Madda Jew", ru: "Иудей Тора у-Мадда", az: "Tövra u-Madda yəhudisi" },
    blueprint: {
      en: "You are Jewish within the Torah u-Madda — Yeshiva University's synthesis of Torah and science tradition. The covenant with God and the observance of Halakha (Jewish law) shape your path of Torah u-Madda — Yeshiva University's synthesis of Torah and science.",
      ru: "Вы — иудей в традиции Torah u-Madda — Yeshiva University's synthesis of Torah and science. Завет с Богом и соблюдение Галахи (еврейского закона) формируют ваш путь Torah u-Madda — Yeshiva University's synthesis of Torah and science.",
      az: "Siz Torah u-Madda — Yeshiva University's synthesis of Torah and science ənənəsində yəhudisiniz. Tanrı ilə əhd və Halaxa (Yəhudi qanunu) sizin Torah u-Madda — Yeshiva University's synthesis of Torah and science yolunuzu formalaşdırır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Joseph B. Soloveitchik", ru: "Йосеф Б. Соловейчик", az: "Yosef B. Soloveychik" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
      { en: "The Sages", ru: "Мудрецы", az: "Müdriklər" },
    ],
    tags: ["judaism"],
  },
  terminal_hindu_other: {
    node_id: "terminal_hindu_other",
    title: { en: "The New Hindu Movement", ru: "Новое индуистское движение", az: "Yeni hindu hərəkatı" },
    blueprint: {
      en: "You follow the Hindu path of Ayyavazhi or another new Hindu movement. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Ayyavazhi or another new Hindu movement. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Ayyavazhi or another new Hindu movement Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 290,
    percent_of_users: 2,
    similar_minds: [
      { en: "Ayya Vaikundar", ru: "Айя Вайкундар", az: "Ayya Vaykundar" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_iskcon: {
    node_id: "terminal_hindu_iskcon",
    title: { en: "The ISKCON Devotee", ru: "Преданный ИСККОН", az: "ISKCON davamçısı" },
    blueprint: {
      en: "You follow the Hindu path of ISKCON / Hare Krishna — Gaudiya Vaishnavism and sankirtan. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути ISKCON / Hare Krishna — Gaudiya Vaishnavism and sankirtan. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz ISKCON / Hare Krishna — Gaudiya Vaishnavism and sankirtan Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 780,
    percent_of_users: 4,
    similar_minds: [
      { en: "A.C. Bhaktivedanta Swami Prabhupada", ru: "А.Ч. Бхактиведанта Свами Прабхупада", az: "A.Ç. Bhaktivedanta Svami Prabhupada" },
      { en: "Chaitanya Mahaprabhu", ru: "Чайтанья Махапрабху", az: "Çaytanya Mahaprabhu" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_swaminarayan: {
    node_id: "terminal_hindu_swaminarayan",
    title: { en: "The Swaminarayan Devotee", ru: "Преданный Сваминараяна", az: "Svaminarayan davamçısı" },
    blueprint: {
      en: "You follow the Hindu path of Swaminarayan (BAPS) — Akshar-Purushottam devotion. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Swaminarayan (BAPS) — Akshar-Purushottam devotion. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Swaminarayan (BAPS) — Akshar-Purushottam devotion Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 480,
    percent_of_users: 3,
    similar_minds: [
      { en: "Bhagwan Swaminarayan", ru: "Бхагаван Сваминараян", az: "Bhagvan Svaminarayan" },
      { en: "Pramukh Swami Maharaj", ru: "Прамукх Свами Махарадж", az: "Pramux Svami Maharac" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_sri_vaishnava: {
    node_id: "terminal_hindu_sri_vaishnava",
    title: { en: "The Sri Vaishnava", ru: "Шри-вайшнав", az: "Şri vaişnava" },
    blueprint: {
      en: "You follow the Hindu path of Sri Vaishnava — Ramanuja's qualified non-dualism. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Sri Vaishnava — Ramanuja's qualified non-dualism. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Sri Vaishnava — Ramanuja's qualified non-dualism Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 420,
    percent_of_users: 2,
    similar_minds: [
      { en: "Ramanuja", ru: "Рамануджа", az: "Ramanuca" },
      { en: "Vedanta Desika", ru: "Веданта Десика", az: "Vedanta Desika" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_madhva: {
    node_id: "terminal_hindu_madhva",
    title: { en: "The Madhva Vaishnava", ru: "Мадхва-вайшнав", az: "Madhva vaişnava" },
    blueprint: {
      en: "You follow the Hindu path of Madhva Vaishnava — dualistic devotion to Vishnu. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Madhva Vaishnava — dualistic devotion to Vishnu. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Madhva Vaishnava — dualistic devotion to Vishnu Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Madhvacharya", ru: "Мадхвачарья", az: "Madhvaçarya" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_ramandi: {
    node_id: "terminal_hindu_ramandi",
    title: { en: "The Ramanandi Bhakta", ru: "Рамананди-бхакт", az: "Ramanandi bhakt" },
    blueprint: {
      en: "You follow the Hindu path of Ramanandi / North Indian bhakti — devotion to Lord Rama. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Ramanandi / North Indian bhakti — devotion to Lord Rama. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Ramanandi / North Indian bhakti — devotion to Lord Rama Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 390,
    percent_of_users: 2,
    similar_minds: [
      { en: "Tulsidas", ru: "Тулсидас", az: "Tulsidas" },
      { en: "Hanuman", ru: "Хануман", az: "Hanuman" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_shaiva_siddhanta: {
    node_id: "terminal_hindu_shaiva_siddhanta",
    title: { en: "The Shaiva Siddhanta", ru: "Шайва-сиддханта", az: "Şaiva siddhanta" },
    blueprint: {
      en: "You follow the Hindu path of Shaiva Siddhanta of Tamil Nadu — dualistic Shiva devotion. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Shaiva Siddhanta of Tamil Nadu — dualistic Shiva devotion. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Shaiva Siddhanta of Tamil Nadu — dualistic Shiva devotion Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Tirumular", ru: "Тирумулар", az: "Tirumular" },
      { en: "Meykandar", ru: "Мейкандар", az: "Meykandar" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_kashmir_shaiva: {
    node_id: "terminal_hindu_kashmir_shaiva",
    title: { en: "The Kashmir Shaiva", ru: "Кашмирский шайва", az: "Kəşmir şaivası" },
    blueprint: {
      en: "You follow the Hindu path of Kashmir Shaivism (Trika) — monistic recognition of Shiva. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Kashmir Shaivism (Trika) — monistic recognition of Shiva. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Kashmir Shaivism (Trika) — monistic recognition of Shiva Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 280,
    percent_of_users: 2,
    similar_minds: [
      { en: "Abhinavagupta", ru: "Абхинавагупта", az: "Abhinavaqupta" },
      { en: "Utpaladeva", ru: "Утпаладева", az: "Utpaladeva" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_lingayat: {
    node_id: "terminal_hindu_lingayat",
    title: { en: "The Lingayat", ru: "Лингаят", az: "Linqayat" },
    blueprint: {
      en: "You follow the Hindu path of Lingayat / Virashaiva — Basava's reform without Vedic ritual. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Lingayat / Virashaiva — Basava's reform without Vedic ritual. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Lingayat / Virashaiva — Basava's reform without Vedic ritual Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 290,
    percent_of_users: 2,
    similar_minds: [
      { en: "Basava", ru: "Басава", az: "Basava" },
      { en: "Allama Prabhu", ru: "Аллама Прабху", az: "Allama Prabhu" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_nath: {
    node_id: "terminal_hindu_nath",
    title: { en: "The Nath Yogi", ru: "Натх-йог", az: "Nat yoqi" },
    blueprint: {
      en: "You follow the Hindu path of Nath / Hatha Yoga tradition of Gorakhnath. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Nath / Hatha Yoga tradition of Gorakhnath. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Nath / Hatha Yoga tradition of Gorakhnath Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Gorakhnath", ru: "Горакхнатх", az: "Qorakhnat" },
      { en: "Matsyendranath", ru: "Мацьендранатх", az: "Matsyendranat" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_kali: {
    node_id: "terminal_hindu_kali",
    title: { en: "The Kali Bhakta", ru: "Бхакт Кали", az: "Kali bhaktı" },
    blueprint: {
      en: "You follow the Hindu path of Kali worship of Bengal — the divine mother. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Kali worship of Bengal — the divine mother. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Kali worship of Bengal — the divine mother Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 520,
    percent_of_users: 3,
    similar_minds: [
      { en: "Ramakrishna", ru: "Рамакришна", az: "Ramakrişna" },
      { en: "Swami Vivekananda", ru: "Свами Вивекананда", az: "Svami Vivekananda" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_sri_vidya: {
    node_id: "terminal_hindu_sri_vidya",
    title: { en: "The Sri Vidya Sadhaka", ru: "Сахаджака Шри-видьи", az: "Şri Vidya sadhaka" },
    blueprint: {
      en: "You follow the Hindu path of Sri Vidya / Lalita — tantric goddess worship. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Sri Vidya / Lalita — tantric goddess worship. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Sri Vidya / Lalita — tantric goddess worship Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 260,
    percent_of_users: 2,
    similar_minds: [
      { en: "Adi Shankara", ru: "Ади Шанкара", az: "Adi Şankara" },
      { en: "Bhaskararaya", ru: "Бхаскарарайя", az: "Bhaskararaya" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_durga: {
    node_id: "terminal_hindu_durga",
    title: { en: "The Durga Devotee", ru: "Преданный Дурги", az: "Durqa davamçısı" },
    blueprint: {
      en: "You follow the Hindu path of Durga / Navaratri devotional Shaktism. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Durga / Navaratri devotional Shaktism. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Durga / Navaratri devotional Shaktism Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 310,
    percent_of_users: 2,
    similar_minds: [
      { en: "Ramprasad Sen", ru: "Рампрасад Сен", az: "Ramprasad Sen" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_advaita: {
    node_id: "terminal_hindu_advaita",
    title: { en: "The Advaitin", ru: "Адвайтин", az: "Advaitin" },
    blueprint: {
      en: "You follow the Hindu path of Advaita Vedanta — Shankara's non-dualism, Brahman alone is real. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Advaita Vedanta — Shankara's non-dualism, Brahman alone is real. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Advaita Vedanta — Shankara's non-dualism, Brahman alone is real Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 890,
    percent_of_users: 5,
    similar_minds: [
      { en: "Adi Shankara", ru: "Ади Шанкара", az: "Adi Şankara" },
      { en: "Swami Vivekananda", ru: "Свами Вивекананда", az: "Svami Vivekananda" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_neo_vedanta: {
    node_id: "terminal_hindu_neo_vedanta",
    title: { en: "The Neo-Vedantin", ru: "Нео-ведантин", az: "Neo-vedantin" },
    blueprint: {
      en: "You follow the Hindu path of Neo-Vedanta / Integral Yoga — modern universalized Vedanta. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Neo-Vedanta / Integral Yoga — modern universalized Vedanta. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Neo-Vedanta / Integral Yoga — modern universalized Vedanta Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 560,
    percent_of_users: 3,
    similar_minds: [
      { en: "Swami Vivekananda", ru: "Свами Вивекананда", az: "Svami Vivekananda" },
      { en: "Sri Aurobindo", ru: "Шри Ауробиндо", az: "Şri Aurobindo" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
  },
  terminal_hindu_arsha: {
    node_id: "terminal_hindu_arsha",
    title: { en: "The Smarta Hindu", ru: "Смарта-индуист", az: "Smarta hindu" },
    blueprint: {
      en: "You follow the Hindu path of Arsha / Smarta orthopraxy — the six-sect Vedic householder path. The eternal dharma (Sanatana Dharma) leads you through devotion, knowledge, and practice toward moksha — liberation from the cycle of rebirth.",
      ru: "Вы следуете индуистскому пути Arsha / Smarta orthopraxy — the six-sect Vedic householder path. Вечная дхарма (санатана-дхарма) ведёт вас через преданность, знание и практику к мокше — освобождению из цикла перерождений.",
      az: "Siz Arsha / Smarta orthopraxy — the six-sect Vedic householder path Hindu yolunu izləyirsiniz. Əbədi dharma (Sanatana Dharma) sizi bəxşiş, bilik və praktika vasitəsilə mokşaya — yenidən doğum dövründən azadlığa aparır.",
    },
    social_proof: 340,
    percent_of_users: 2,
    similar_minds: [
      { en: "Adi Shankara", ru: "Ади Шанкара", az: "Adi Şankara" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
      { en: "The Rishis", ru: "Риши", az: "Rişilər" },
    ],
    tags: ["hindu"],
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
