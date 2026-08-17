// ============================================================
// TERM DEFINITIONS — short authoritative glosses for choice labels
// Keyed by choice id / tag. Each entry: localized gloss + sources.
// ============================================================

import type { LocalizedText } from "./ontology";

export interface TermSource {
  title: LocalizedText;
  url: string;
}

export interface TermDefinition {
  gloss: LocalizedText;
  sources: TermSource[];
}

const wiki = (en: string, ru: string, az: string, url: string): TermSource => ({
  title: { en, ru, az },
  url,
});

export const TERM_DEFINITIONS: Record<string, TermDefinition> = {
  // ============ NON-RELIGIOUS FRAME ============
  atheist: {
    gloss: {
      en: "A person who does not believe in the existence of God or gods, or who rejects the claim that any god exists.",
      ru: "Человек, который не верит в существование Бога или богов, либо отвергает утверждение о существовании какого-либо бога.",
      az: "Tanrının və ya tanrıların mövcudluğuna inanmayan və ya hər hansı tanrının mövcudluğu iddiasını rədd edən şəxs.",
    },
    sources: [
      wiki("Atheism (Stanford Encyclopedia of Philosophy)", "Атеизм (Стэнфордская энциклопедия)", "Ateizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/atheism-agnosticism/"),
      wiki("Atheism (Wikipedia)", "Атеизм (Википедия)", "Ateizm (Vikipediya)", "https://en.wikipedia.org/wiki/Atheism"),
    ],
  },
  secular_humanist: {
    gloss: {
      en: "A worldview that grounds ethics in human reason and experience rather than religious doctrine, emphasizing human rights and flourishing.",
      ru: "Мировоззрение, основанное на этике человеческого разума и опыта, а не религиозной доктрины; подчёркивает права человека и процветание.",
      az: "Etikanı dini doktrina deyil, insan ağlı və təcrübəsinə əsaslandıran; insan hüquqlarını və rifahını vurğulayan dünyagörüşü.",
    },
    sources: [
      wiki("Secular Humanism (Stanford Encyclopedia of Philosophy)", "Светский гуманизм (Стэнфордская энциклопедия)", "Dünyəvi humanizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/secular-humanism/"),
      wiki("Humanism (Wikipedia)", "Гуманизм (Википедия)", "Humanizm (Vikipediya)", "https://en.wikipedia.org/wiki/Humanism"),
    ],
  },
  naturalist: {
    gloss: {
      en: "The view that nature is all there is; everything arises from natural causes and laws, with no supernatural realm.",
      ru: "Взгляд, согласно которому природа — это всё; всё возникает из естественных причин и законов, сверхъестественной сферы нет.",
      az: "Təbiətin hamısı olduğu görüşü; hər şey təbii səbəb və qanunlardan yaranır, fövqəltəbii sfera yoxdur.",
    },
    sources: [
      wiki("Naturalism (Stanford Encyclopedia of Philosophy)", "Натурализм (Стэнфордская энциклопедия)", "Naturalizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/naturalism/"),
      wiki("Naturalism (Wikipedia)", "Натурализм (Википедия)", "Naturalizm (Vikipediya)", "https://en.wikipedia.org/wiki/Naturalism_(philosophy)"),
    ],
  },
  apatheist: {
    gloss: {
      en: "Someone indifferent to the question of God's existence — it makes no practical difference to their life or values.",
      ru: "Человек, безразличный к вопросу существования Бога — это не влияет на его жизнь или ценности.",
      az: "Tanrının mövcudluğu sualına biganə olan şəxs — bu, onun həyatına və dəyərlərinə praktiki təsir göstərmir.",
    },
    sources: [
      wiki("Apatheism (Wikipedia)", "Апатеизм (Википедия)", "Apatizm (Vikipediya)", "https://en.wikipedia.org/wiki/Apatheism"),
    ],
  },
  anti_theist: {
    gloss: {
      en: "Active opposition to theism — the view that belief in God is harmful and should be opposed or eliminated.",
      ru: "Активное противодействие теизму — взгляд, что вера в Бога вредна и должна встречать сопротивление.",
      az: "Teizmə fəal müxalifət — Tanrıya inamın zərərli olduğu və ona qarşı çıxılmalı olduğu görüşü.",
    },
    sources: [
      wiki("Antitheism (Wikipedia)", "Антитеизм (Википедия)", "Antiteizm (Vikipediya)", "https://en.wikipedia.org/wiki/Antitheism"),
    ],
  },
  religious_naturalist: {
    gloss: {
      en: "Naturalism combined with religious feelings or practices: nature itself is experienced as sacred or worthy of reverence.",
      ru: "Натурализм в сочетании с религиозными чувствами: сама природа переживается как священная и достойная почитания.",
      az: "Təbiətin özünün müqəddəs və ya ehtiramla yanaşılan kimi yaşandığı: dini hisslərlə birləşmiş naturalizm.",
    },
    sources: [
      wiki("Religious naturalism (Wikipedia)", "Религиозный натурализм (Википедия)", "Dini naturalizm (Vikipediya)", "https://en.wikipedia.org/wiki/Religious_naturalism"),
    ],
  },
  spiritual_naturalist: {
    gloss: {
      en: "A naturalistic stance that cultivates spiritual practices and experiences without supernatural beliefs.",
      ru: "Натуралистическая позиция, развивающая духовные практики и переживания без сверхъестественных верований.",
      az: "Fövqəltəbii inanclar olmadan mənəvi praktika və təcrübələri inkişaf etdirən naturalistik mövqe.",
    },
    sources: [
      wiki("Spiritual naturalism (Wikipedia)", "Духовный натурализм (Википедия)", "Mənəvi naturalizm (Vikipediya)", "https://en.wikipedia.org/wiki/Spiritual_naturalism"),
    ],
  },
  agnostic: {
    gloss: {
      en: "The view that the existence of God is unknown or unknowable; often combined with suspended judgment.",
      ru: "Взгляд, что существование Бога неизвестно или непознаваемо; часто сочетается с приостановкой суждения.",
      az: "Tanrının mövcudluğunun naməlum və ya bilinməz olduğu görüşü; çox vaxt hökmün dayandırılması ilə birləşir.",
    },
    sources: [
      wiki("Agnosticism (Stanford Encyclopedia of Philosophy)", "Агностицизм (Стэнфордская энциклопедия)", "Aqnostisizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/agnosticism/"),
      wiki("Agnosticism (Wikipedia)", "Агностицизм (Википедия)", "Aqnostisizm (Vikipediya)", "https://en.wikipedia.org/wiki/Agnosticism"),
    ],
  },
  monism: {
    gloss: {
      en: "The view that reality is ultimately one — a single substance, principle, or kind of being.",
      ru: "Взгляд, что реальность в конечном счёте едина — одна субстанция, принцип или род бытия.",
      az: "Reallığın son nəticədə vahid olduğu görüşü — bir substansiya, prinsip və ya varlıq növü.",
    },
    sources: [
      wiki("Monism (Stanford Encyclopedia of Philosophy)", "Монизм (Стэнфордская энциклопедия)", "Monizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/monism/"),
    ],
  },
  monotheism: {
    gloss: {
      en: "Belief in a single supreme God, typically personal and creator of the world.",
      ru: "Вера в единого верховного Бога, обычно личного и творца мира.",
      az: "Adətən şəxsi və dünyanın yaradıcısı olan vahid ali Tanrıya inam.",
    },
    sources: [
      wiki("Monotheism (Stanford Encyclopedia of Philosophy)", "Монотеизм (Стэнфордская энциклопедия)", "Monoteizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/monotheism/"),
    ],
  },
  polytheism: {
    gloss: {
      en: "Belief in or worship of multiple gods, spirits, or divine beings with distinct domains.",
      ru: "Вера во множество богов, духов или божественных существ с разными сферами.",
      az: "Fərqli sahələri olan çoxlu tanrılara, ruhlara və ya ilahi varlıqlara inam.",
    },
    sources: [
      wiki("Polytheism (Wikipedia)", "Политеизм (Википедия)", "Politeizm (Vikipediya)", "https://en.wikipedia.org/wiki/Polytheism"),
    ],
  },
  henotheism: {
    gloss: {
      en: "Worship of one god while acknowledging that other gods may exist.",
      ru: "Почитание одного бога при признании возможного существования других богов.",
      az: "Digər tanrıların mövcud ola biləcəyini qəbul edərkən bir tanrıya ibadət.",
    },
    sources: [
      wiki("Henotheism (Wikipedia)", "Генотеизм (Википедия)", "Henoteizm (Vikipediya)", "https://en.wikipedia.org/wiki/Henotheism"),
    ],
  },
  monolatry: {
    gloss: {
      en: "Worship of one god exclusively while believing other gods exist.",
      ru: "Исключительное почитание одного бога при вере в существование других.",
      az: "Digər tanrıların mövcudluğuna inanaraq yalnız bir tanrıya ibadət.",
    },
    sources: [
      wiki("Monolatry (Wikipedia)", "Монолатрия (Википедия)", "Monolatriya (Vikipediya)", "https://en.wikipedia.org/wiki/Monolatry"),
    ],
  },
  nondual: {
    gloss: {
      en: "The view that reality is not ultimately two — distinctions like self/world or God/world are transcended (e.g., Advaita Vedanta).",
      ru: "Взгляд, что реальность не двойственна — различия «я/мир» или «Бог/мир» преодолеваются (например, адвайта-веданта).",
      az: "Reallığın ikili olmadığı görüşü — öz/dünya və ya Tanrı/dünya kimi fərqlər aşılır (məs., Advayta Vedanta).",
    },
    sources: [
      wiki("Nondualism (Wikipedia)", "Недуализм (Википедия)", "Qeyri-dualizm (Vikipediya)", "https://en.wikipedia.org/wiki/Nondualism"),
      wiki("Advaita Vedanta (Stanford Encyclopedia of Philosophy)", "Адвайта-веданта (Стэнфордская энциклопедия)", "Advayta Vedanta (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/vedanta/"),
    ],
  },
  pantheism: {
    gloss: {
      en: "The view that God and the universe are identical — the divine is immanent in all of nature.",
      ru: "Взгляд, что Бог и вселенная тождественны — божественное имманентно всей природе.",
      az: "Tanrı və kainatın eyni olduğu görüşü — ilahi bütün təbiətə immanentdir.",
    },
    sources: [
      wiki("Pantheism (Stanford Encyclopedia of Philosophy)", "Пантеизм (Стэнфордская энциклопедия)", "Panteizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/pantheism/"),
    ],
  },
  panentheism: {
    gloss: {
      en: "The view that the universe is within God, while God also transcends or exceeds the universe.",
      ru: "Взгляд, что вселенная находится в Боге, при этом Бог также превосходит вселенную.",
      az: "Kainatın Tanrının daxilində olduğu, Tanrının isə kainatı aşdığı görüşü.",
    },
    sources: [
      wiki("Panentheism (Stanford Encyclopedia of Philosophy)", "Панентеизм (Стэнфордская энциклопедия)", "Panenteizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/panentheism/"),
    ],
  },
  deism: {
    gloss: {
      en: "The view that God created the universe but does not intervene in it afterward.",
      ru: "Взгляд, что Бог создал вселенную, но впоследствии не вмешивается в неё.",
      az: "Tanrının kainatı yaratdığı, lakin sonra ona müdaxilə etmədiyi görüşü.",
    },
    sources: [
      wiki("Deism (Stanford Encyclopedia of Philosophy)", "Деизм (Стэнфордская энциклопедия)", "Deizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/deism/"),
    ],
  },
  pandeism: {
    gloss: {
      en: "A combination of deism and pantheism: God became the universe, so the creator no longer exists as a separate being.",
      ru: "Сочетание деизма и пантеизма: Бог стал вселенной, поэтому творец больше не существует как отдельное существо.",
      az: "Deizm və panteizmin birləşməsi: Tanrı kainata çevrildi, yaradıcı artıq ayrıca varlıq kimi mövcud deyil.",
    },
    sources: [
      wiki("Pandeism (Wikipedia)", "Пандеизм (Википедия)", "Pandeizm (Vikipediya)", "https://en.wikipedia.org/wiki/Pandeism"),
    ],
  },
  process_theism: {
    gloss: {
      en: "A theism influenced by process philosophy: God is relational, changes with the world, and influences without coercing.",
      ru: "Теизм под влиянием процессуальной философии: Бог реляционен, изменяется вместе с миром и влияет без принуждения.",
      az: "Proses fəlsəfəsinin təsiri altında olan teizm: Tanrı əlaqəlidir, dünya ilə birlikdə dəyişir və məcbur etmədən təsir edir.",
    },
    sources: [
      wiki("Process theism (Wikipedia)", "Процессуальный теизм (Википедия)", "Proses teizmi (Vikipediya)", "https://en.wikipedia.org/wiki/Process_theism"),
    ],
  },
  personalism: {
    gloss: {
      en: "The view that ultimate reality is personal — having will, intention, or relational character.",
      ru: "Взгляд, что высшая реальность лична — обладает волей, намерением или реляционным характером.",
      az: "Ali reallığın şəxsi olması görüşü — iradəsi, niyyəti və ya əlaqəli xarakteri var.",
    },
    sources: [
      wiki("Personalism (Wikipedia)", "Персонализм (Википедия)", "Personalizm (Vikipediya)", "https://en.wikipedia.org/wiki/Personalism"),
    ],
  },
  impersonalism: {
    gloss: {
      en: "The view that ultimate reality is impersonal — a law, principle, ground, or being beyond personality.",
      ru: "Взгляд, что высшая реальность безлична — закон, принцип, основание или бытие за пределами личности.",
      az: "Ali reallığın şəxsiyyətsiz olması görüşü — qanun, prinsip, əsas və ya şəxsiyyətdən kənar varlıq.",
    },
    sources: [
      wiki("Impersonal (Wikipedia)", "Безличное (Википедия)", "Şəxsiyyətsiz (Vikipediya)", "https://en.wikipedia.org/wiki/Impersonality"),
    ],
  },
  transpersonal: {
    gloss: {
      en: "Beyond the personal: ultimate reality exceeds or includes both personal and impersonal dimensions.",
      ru: "За пределами личного: высшая реальность превосходит или включает как личные, так и безличные измерения.",
      az: "Şəxsi səviyyədən kənar: ali reallıq həm şəxsi, həm də şəxsiyyətsiz ölçüləri aşır və ya ehtiva edir.",
    },
    sources: [
      wiki("Transpersonal (Wikipedia)", "Трансперсональное (Википедия)", "Transpersonal (Vikipediya)", "https://en.wikipedia.org/wiki/Transpersonal"),
    ],
  },
  apophatic: {
    gloss: {
      en: "A way of describing the divine by negation — stating what God is not, because God exceeds all human concepts.",
      ru: "Способ описания божественного через отрицание — что Бог не есть, так как Он превосходит человеческие понятия.",
      az: "İlahini inkar yolu ilə təsvir etmə üsulu — Tanrının insan anlayışlarını aşdığı üçün nə olmadığını bildirmək.",
    },
    sources: [
      wiki("Apophatic theology (Wikipedia)", "Апофатическое богословие (Википедия)", "Apofatik ilahiyyat (Vikipediya)", "https://en.wikipedia.org/wiki/Apophatic_theology"),
    ],
  },
  karmic: {
    gloss: {
      en: "A moral-causal cosmic order where actions shape future outcomes across lives (karma), central to South Asian traditions.",
      ru: "Морально-причинный космический порядок, где действия формируют будущие результаты между жизнями (карма).",
      az: "Hərəkətlərin gələcək nəticələri formalaşdırdığı əxlaqi-səbəbli kosmik nizam (karma), Cənubi Asiya ənənələrində mərkəzi.",
    },
    sources: [
      wiki("Karma (Stanford Encyclopedia of Philosophy)", "Карма (Стэнфордская энциклопедия)", "Karma (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/karma/"),
    ],
  },
  natural_theology: {
    gloss: {
      en: "The project of demonstrating God's existence and attributes using reason and observation alone, without revelation.",
      ru: "Проект доказательства существования и атрибутов Бога только разумом и наблюдением, без откровения.",
      az: "Tanrının mövcudluğunu və atributlarını vəhy olmadan yalnız ağıl və müşahidə ilə sübut etmə layihəsi.",
    },
    sources: [
      wiki("Natural theology (Stanford Encyclopedia of Philosophy)", "Естественное богословие (Стэнфордская энциклопедия)", "Təbii ilahiyyat (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/natural-theology/"),
    ],
  },
  mystical: {
    gloss: {
      en: "Direct, unmediated experience of the divine or ultimate reality, often beyond conceptual thought.",
      ru: "Непосредственное, неопосредованное переживание божественного, часто за пределами понятийного мышления.",
      az: "İlahinin və ya ali reallığın birbaşa, vasitəsiz təcrübəsi, çox vaxt konseptual düşüncədən kənar.",
    },
    sources: [
      wiki("Mysticism (Stanford Encyclopedia of Philosophy)", "Мистицизм (Стэнфордская энциклопедия)", "Mistikizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/mysticism/"),
    ],
  },
  contemplative: {
    gloss: {
      en: "Practices of sustained attention or meditation aimed at spiritual insight or union with the divine.",
      ru: "Практики устойчивого внимания или медитации, направленные на духовное прозрение или единение с божественным.",
      az: "Mənəvi dərrakə və ya ilahi ilə birlik məqsədilə davamlı diqqət və ya meditasiya praktikaları.",
    },
    sources: [
      wiki("Christian contemplation (Wikipedia)", "Христианское созерцание (Википедия)", "Xristian kontemplasiyası (Vikipediya)", "https://en.wikipedia.org/wiki/Christian_contemplation"),
    ],
  },
  divination: {
    gloss: {
      en: "Practices of seeking knowledge of the future or hidden matters through signs, omens, or rituals.",
      ru: "Практики получения знания о будущем или скрытых вещах через знаки, предзнаменования или ритуалы.",
      az: "İşarələr, əlamətlər və ya rituallar vasitəsilə gələcək və ya gizli məsələlər haqqında bilik axtarma praktikaları.",
    },
    sources: [
      wiki("Divination (Wikipedia)", "Гадание (Википедия)", "Falçılıq (Vikipediya)", "https://en.wikipedia.org/wiki/Divination"),
    ],
  },
  abrahamic: {
    gloss: {
      en: "Religions tracing their origin to Abraham: Judaism, Christianity, Islam, and related traditions (Bahá'í, Druze, etc.).",
      ru: "Религии, восходящие к Аврааму: иудаизм, христианство, ислам и родственные традиции (бахаи, друзы и др.).",
      az: "Mənşəyi İbrahimə gedib çıxan dinlər: yəhudilik, xristianlıq, islam və əlaqəli ənənələr (Bəhai, Druz və s.).",
    },
    sources: [
      wiki("Abrahamic religions (Wikipedia)", "Авраамические религии (Википедия)", "İbrahimi dinlər (Vikipediya)", "https://en.wikipedia.org/wiki/Abrahamic_religions"),
    ],
  },
  // ============ BUDDHIST SCHOOLS ============
  theravada: {
    gloss: {
      en: "The oldest surviving Buddhist school, dominant in Sri Lanka and Southeast Asia; emphasizes monastic discipline and the Pali Canon.",
      ru: "Древнейшая сохранившаяся буддийская школа, доминирующая в Шри-Ланке и Юго-Восточной Азии; подчёркивает монашескую дисциплину и Палийский канон.",
      az: "Şri-Lanka və Cənub-Şərqi Asiyada üstünlük təşkil edən ən qədim buddist məktəbi; monastır nizam-intizamını və Pali kanonunu vurğulayır.",
    },
    sources: [
      wiki("Theravada (Wikipedia)", "Тхеравада (Википедия)", "Teravada (Vikipediya)", "https://en.wikipedia.org/wiki/Theravada"),
    ],
  },
  mahayana: {
    gloss: {
      en: "The 'Great Vehicle' — the dominant Buddhist tradition in East Asia (Zen, Pure Land, Nichiren), emphasizing compassion and the bodhisattva ideal.",
      ru: "«Великая колесница» — доминирующая буддийская традиция в Восточной Азии (дзен, Чистая земля, Нитирэн).",
      az: "«Böyük vasitə» — Şərqi Asiyada üstünlük təşkil edən buddist ənənəsi (Zen, Saf Torpaq, Niçiren); şəfqət və bodhisattva idealını vurğulayır.",
    },
    sources: [
      wiki("Mahayana (Wikipedia)", "Махаяна (Википедия)", "Mahayana (Vikipediya)", "https://en.wikipedia.org/wiki/Mahayana"),
    ],
  },
  vajrayana: {
    gloss: {
      en: "The 'Diamond Vehicle' — Tantric Buddhism of Tibet and the Himalayas, using ritual, visualization, and esoteric practice.",
      ru: "«Алмазная колесница» — тантрический буддизм Тибета и Гималаев, использующий ритуал, визуализацию и эзотерическую практику.",
      az: "«Almas vasitə» — Tibet və Himalayın tantrik buddizmi; ritual, vizuallaşdırma və ezoterik praktikadan istifadə edir.",
    },
    sources: [
      wiki("Vajrayana (Wikipedia)", "Ваджраяна (Википедия)", "Vajrayana (Vikipediya)", "https://en.wikipedia.org/wiki/Vajrayana"),
    ],
  },
  // ============ ISLAM ============
  sunni: {
    gloss: {
      en: "The largest branch of Islam (roughly 85-90%), following the sunna (practice) of the Prophet and recognizing the first four caliphs.",
      ru: "Крупнейшая ветвь ислама (около 85-90%), следующая сунне (практике) Пророка и признающая первых четырёх халифов.",
      az: "İslamın ən böyük qolu (təxminən 85-90%); Peyğəmbərin sünnəsinə (təcrübəsinə) əməl edir və ilk dörd xəlifəni tanıyır.",
    },
    sources: [
      wiki("Sunni Islam (Wikipedia)", "Суннизм (Википедия)", "Sünni İslam (Vikipediya)", "https://en.wikipedia.org/wiki/Sunni_Islam"),
    ],
  },
  shia: {
    gloss: {
      en: "The second-largest branch of Islam, holding that leadership belongs to Ali and his descendants, the Imams.",
      ru: "Вторая по величине ветвь ислама, считающая, что руководство принадлежит Али и его потомкам — имамам.",
      az: "İslamın ikinci ən böyük qolu; rəhbərliyin Əliyə və onun nəslinə — imamlara məxsus olduğunu müdafiə edir.",
    },
    sources: [
      wiki("Shia Islam (Wikipedia)", "Шиизм (Википедия)", "Şiə İslam (Vikipediya)", "https://en.wikipedia.org/wiki/Shia_Islam"),
    ],
  },
  sufi: {
    gloss: {
      en: "The mystical dimension of Islam, emphasizing inner purification, love of God, and practices like dhikr (remembrance).",
      ru: "Мистическое измерение ислама, подчёркивающее внутреннее очищение, любовь к Богу и практики вроде зикра.",
      az: "İslamın mistik ölçüsü; daxili təmizlənməni, Allaha məhəbbəti və zikr kimi praktikaları vurğulayır.",
    },
    sources: [
      wiki("Sufism (Wikipedia)", "Суфизм (Википедия)", "Sufizm (Vikipediya)", "https://en.wikipedia.org/wiki/Sufism"),
    ],
  },
  quranist: {
    gloss: {
      en: "Muslims who base their faith primarily or solely on the Quran, often minimizing or rejecting hadith as a source of law.",
      ru: "Мусульмане, основывающие веру в первую очередь на Коране, часто минимизируя хадисы как источник права.",
      az: "İnamını əsasən və ya yalnız Qurana əsaslandıran, hadisləri hüquq mənbəyi kimi çox vaxt rədd edən müsəlmanlar.",
    },
    sources: [
      wiki("Quranism (Wikipedia)", "Коранизм (Википедия)", "Quranizm (Vikipediya)", "https://en.wikipedia.org/wiki/Quranism"),
    ],
  },
  // ============ JUDAISM ============
  orthodox_jewish: {
    gloss: {
      en: "The most traditional stream of Judaism, holding that both the written and oral Torah are divinely revealed and binding.",
      ru: "Наиболее традиционное течение иудаизма, считающее письменную и устную Тору богооткровенной и обязательной.",
      az: "Yəhudiliyin ən ənənəvi qolu; yazılı və şifahi Toranın ilahi vəhy olduğunu və məcburi olduğunu müdafiə edir.",
    },
    sources: [
      wiki("Orthodox Judaism (Wikipedia)", "Ортодоксальный иудаизм (Википедия)", "Pravoslav yəhudilik (Vikipediya)", "https://en.wikipedia.org/wiki/Orthodox_Judaism"),
    ],
  },
  reform_jewish: {
    gloss: {
      en: "A liberal Jewish movement that adapts Jewish practice to modern life, emphasizing ethics over strict observance.",
      ru: "Либеральное еврейское движение, адаптирующее еврейскую практику к современной жизни, подчёркивая этику.",
      az: "Yəhudi praktikasını müasir həyata uyğunlaşdıran, etikanı ciddi əməl etməkdən üstün tutan liberal yəhudi hərəkatı.",
    },
    sources: [
      wiki("Reform Judaism (Wikipedia)", "Реформистский иудаизм (Википедия)", "Reform yəhudiliyi (Vikipediya)", "https://en.wikipedia.org/wiki/Reform_Judaism"),
    ],
  },
  conservative_jewish: {
    gloss: {
      en: "A middle path in Judaism: holds that Jewish law is binding but can evolve with the times through rabbinic interpretation.",
      ru: "Срединный путь в иудаизме: закон обязателен, но может развиваться через раввинистическую интерпретацию.",
      az: "Yəhudilikdə orta yol: yəhudi qanunu məcburidir, lakin ravvin təfsiri ilə zamanla inkişaf edə bilər.",
    },
    sources: [
      wiki("Conservative Judaism (Wikipedia)", "Консервативный иудаизм (Википедия)", "Konservativ yəhudilik (Vikipediya)", "https://en.wikipedia.org/wiki/Conservative_Judaism"),
    ],
  },
  reconstructionist_jewish: {
    gloss: {
      en: "A modern American Jewish movement viewing Judaism as an evolving civilization, with tradition having a vote but not a veto.",
      ru: "Современное американское движение, видящее иудаизм как развивающуюся цивилизацию, где традиция имеет голос, но не вето.",
      az: "Yəhudiliyi inkişaf edən sivilizasiya kimi görən müasir Amerika hərəkatı; ənənənin səsi var, amma vetosu yox.",
    },
    sources: [
      wiki("Reconstructionist Judaism (Wikipedia)", "Реконструкционистский иудаизм (Википедия)", "Rekonstruksionist yəhudilik (Vikipediya)", "https://en.wikipedia.org/wiki/Reconstructionist_Judaism"),
    ],
  },
  // ============ HINDU TRADITIONS ============
  vaishnava: {
    gloss: {
      en: "A Hindu tradition devoted to Vishnu (and his avatars, especially Krishna and Rama) as the supreme God.",
      ru: "Индуистская традиция, почитающая Вишну (и его аватары, особенно Кришну и Раму) как верховного Бога.",
      az: "Vişnunu (və onun avataralarını, xüsusilə Krişna və Ramanı) ali Tanrı kimi ehtiram edən Hindu ənənəsi.",
    },
    sources: [
      wiki("Vaishnavism (Wikipedia)", "Ваишнавизм (Википедия)", "Vaişnavizm (Vikipediya)", "https://en.wikipedia.org/wiki/Vaishnavism"),
    ],
  },
  shaiva: {
    gloss: {
      en: "A Hindu tradition devoted to Shiva as the supreme God, prominent in South India and the Himalayas.",
      ru: "Индуистская традиция, почитающая Шиву как верховного Бога; распространена в Южной Индии и Гималаях.",
      az: "Şivanı ali Tanrı kimi ehtiram edən Hindu ənənəsi; Cənubi Hindistan və Himalayda geniş yayılmışdır.",
    },
    sources: [
      wiki("Shaivism (Wikipedia)", "Шиваизм (Википедия)", "Şaivizm (Vikipediya)", "https://en.wikipedia.org/wiki/Shaivism"),
    ],
  },
  shakta: {
    gloss: {
      en: "A Hindu tradition centered on the Goddess (Devi) as the supreme divine power.",
      ru: "Индуистская традиция, в центре которой Богиня (Деви) как верховная божественная сила.",
      az: "Mərkəzində İlahə (Devi) ali ilahi qüvvə kimi dayanan Hindu ənənəsi.",
    },
    sources: [
      wiki("Shaktism (Wikipedia)", "Шактизм (Википедия)", "Şaktizm (Vikipediya)", "https://en.wikipedia.org/wiki/Shaktism"),
    ],
  },
  smarta: {
    gloss: {
      en: "A liberal Hindu tradition that worships multiple deities as forms of one reality, often associated with Advaita Vedanta.",
      ru: "Либеральная индуистская традиция, почитающая множество божеств как формы одной реальности; связана с адвайтой.",
      az: "Çoxlu tanrıları bir reallığın formaları kimi ehtiram edən liberal Hindu ənənəsi; çox vaxt Advayta ilə əlaqələndirilir.",
    },
    sources: [
      wiki("Smarta tradition (Wikipedia)", "Смарта (Википедия)", "Smarta ənənəsi (Vikipediya)", "https://en.wikipedia.org/wiki/Smarta_tradition"),
    ],
  },
  // ============ EAST ASIAN ============
  daoist: {
    gloss: {
      en: "A Chinese tradition centered on the Dao ('the Way') — harmony with the natural order through wu-wei (non-forcing action).",
      ru: "Китайская традиция, в центре которой Дао («Путь») — гармония с естественным порядком через у-вэй.",
      az: "Mərkəzində Dao («Yol») dayanan Çin ənənəsi — u-vey (məcbur etməyən hərəkət) ilə təbii nizamla harmoniya.",
    },
    sources: [
      wiki("Taoism (Stanford Encyclopedia of Philosophy)", "Даосизм (Стэнфордская энциклопедия)", "Daoizm (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/taoism/"),
    ],
  },
  confucian: {
    gloss: {
      en: "A Chinese ethical-philosophical tradition focused on social harmony, filial piety, ritual propriety, and self-cultivation.",
      ru: "Китайская этико-философская традиция, сосредоточенная на социальной гармонии, сыновней почтительности и ритуале.",
      az: "Sosial harmoniyaya, valideynə ehtirama, ritual ədəbə və özünü inkişafa yönəlmiş Çin etik-fəlsəfi ənənəsi.",
    },
    sources: [
      wiki("Confucius (Stanford Encyclopedia of Philosophy)", "Конфуций (Стэнфордская энциклопедия)", "Konfutsi (Stanford ensiklopediyası)", "https://plato.stanford.edu/entries/confucius/"),
    ],
  },
  shinto: {
    gloss: {
      en: "The indigenous religious tradition of Japan, centered on kami (spirits or deities) and purification rituals.",
      ru: "Исконная религиозная традиция Японии, в центре которой ками (духи или божества) и ритуалы очищения.",
      az: "Yaponiyanın yerli dini ənənəsi; mərkəzində kami (ruhlar və ya tanrılar) və təmizlənmə ritualları dayanır.",
    },
    sources: [
      wiki("Shinto (Wikipedia)", "Синто (Википедия)", "Şinto (Vikipediya)", "https://en.wikipedia.org/wiki/Shinto"),
    ],
  },
  // ============ PAGAN / ESOTERIC ============
  heathen: {
    gloss: {
      en: "A modern reconstruction of pre-Christian Germanic/Norse religion, venerating gods like Odin and Thor and ancestral traditions.",
      ru: "Современная реконструкция дохристианской германо-скандинавской религии, почитающей Одина, Тора и родовые традиции.",
      az: "Xristianlıqdan əvvəlki Alman/İskandinav dininin müasir rekonstruksiyası; Odin, Tor kimi tanrılara və əcdad ənənələrinə ehtiram.",
    },
    sources: [
      wiki("Heathenry (Wikipedia)", "Хейтни (Википедия)", "Heathenry (Vikipediya)", "https://en.wikipedia.org/wiki/Heathenry_(new_religious_movement)"),
    ],
  },
  druid: {
    gloss: {
      en: "A modern Celtic spiritual path inspired by the ancient druids — nature reverence, poetry, and seasonal ritual.",
      ru: "Современный кельтский духовный путь, вдохновлённый древними друидами — почитание природы, поэзия, сезонные ритуалы.",
      az: "Qədim druidlərdən ilhamlanan müasir Kelt mənəvi yolu — təbiətə ehtiram, poeziya, mövsümi ritual.",
    },
    sources: [
      wiki("Neo-Druidism (Wikipedia)", "Неодруидизм (Википедия)", "Neo-Druidizm (Vikipediya)", "https://en.wikipedia.org/wiki/Neo-Druidism"),
    ],
  },
  wiccan: {
    gloss: {
      en: "A modern Pagan religion founded in the mid-20th century, featuring nature worship, deity polarity, and ritual magic.",
      ru: "Современная языческая религия, основанная в середине XX века; включает почитание природы, полярность божеств и ритуальную магию.",
      az: "XX əsrin ortalarında yaranmış müasir bütpərəst din; təbiətə pərəstiş, ilahi qütblülük və ritual sehr.",
    },
    sources: [
      wiki("Wicca (Wikipedia)", "Викка (Википедия)", "Vikkan (Vikipediya)", "https://en.wikipedia.org/wiki/Wicca"),
    ],
  },
  spiritualist: {
    gloss: {
      en: "A movement centered on communication with spirits of the dead and evidence of an afterlife through mediums.",
      ru: "Движение, в центре которого общение с духами умерших и доказательство загробной жизни через медиумов.",
      az: "Mərkəzində ölülərin ruhları ilə ünsiyyət və mediumlar vasitəsilə axirət həyatının sübutu dayanan hərəkat.",
    },
    sources: [
      wiki("Spiritualism (Wikipedia)", "Спиритуализм (Википедия)", "Spiritualizm (Vikipediya)", "https://en.wikipedia.org/wiki/Spiritualism_(movement)"),
    ],
  },
  theosophical: {
    gloss: {
      en: "An esoteric movement founded in 1875 blending Eastern religion, Western occultism, and claims of universal wisdom.",
      ru: "Эзотерическое движение, основанное в 1875 году, сочетающее восточную религию, западный оккультизм и идею универсальной мудрости.",
      az: "1875-ci ildə yaradılmış; Şərq dinini, Qərb okkultizmini və universal hikmət iddialarını birləşdirən ezoterik hərəkat.",
    },
    sources: [
      wiki("Theosophy (Wikipedia)", "Теософия (Википедия)", "Teosofiya (Vikipediya)", "https://en.wikipedia.org/wiki/Theosophy"),
    ],
  },
  occult: {
    gloss: {
      en: "Knowledge and practices of hidden or supernatural realities — ceremonial magic, hermeticism, alchemy, and similar traditions.",
      ru: "Знание и практики скрытых или сверхъестественных реальностей — церемониальная магия, герметизм, алхимия.",
      az: "Gizli və ya fövqəltəbii reallıqlar haqqında bilik və praktikalar — ceremoniya magiyası, hermetizm, kimyagərlik.",
    },
    sources: [
      wiki("Occult (Wikipedia)", "Оккультизм (Википедия)", "Okkultizm (Vikipediya)", "https://en.wikipedia.org/wiki/Occult"),
    ],
  },
  new_thought: {
    gloss: {
      en: "A 19th-century American movement teaching that mental states, especially positive thinking, shape physical reality.",
      ru: "Американское движение XIX века, учащее, что психические состояния, особенно позитивное мышление, формируют физическую реальность.",
      az: "XIX əsr Amerika hərəkatı; psixi vəziyyətlərin, xüsusilə müsbət düşüncənin fiziki reallığı formalaşdırdığını öyrədir.",
    },
    sources: [
      wiki("New Thought (Wikipedia)", "Новая мысль (Википедия)", "Yeni Fikir (Vikipediya)", "https://en.wikipedia.org/wiki/New_Thought"),
    ],
  },
  new_age: {
    gloss: {
      en: "A broad spiritual movement (from the 1970s) blending Eastern and Western ideas, holistic healing, and personal transformation.",
      ru: "Широкое духовное движение (с 1970-х), сочетающее восточные и западные идеи, целостное исцеление и личностную трансформацию.",
      az: "Şərq və Qərb ideyalarını, holistik müalicəni və şəxsi transformasiyanı birləşdirən geniş mənəvi hərəkat (1970-ci illərdən).",
    },
    sources: [
      wiki("New Age (Wikipedia)", "Нью-эйдж (Википедия)", "Yeni Dövr (Vikipediya)", "https://en.wikipedia.org/wiki/New_Age"),
    ],
  },
  // ============ MISCELLANEOUS TRADITIONS ============
  bahai: {
    gloss: {
      en: "A monotheistic religion founded by Bahá'u'lláh (19th century) teaching the unity of God, religion, and humanity.",
      ru: "Монотеистическая религия, основанная Бахауллой (XIX век); учит единству Бога, религии и человечества.",
      az: "Bəhaullah tərəfindən (XIX əsr) qurulan monoteist din; Tanrının, dinin və bəşəriyyətin birliyini öyrədir.",
    },
    sources: [
      wiki("Bahá'í Faith (Wikipedia)", "Бахаи (Википедия)", "Bəhai dini (Vikipediya)", "https://en.wikipedia.org/wiki/Bah%C3%A1%27%C3%AD_Faith"),
    ],
  },
  samaritan: {
    gloss: {
      en: "An ancient religious community descended from the Israelites, worshiping on Mount Gerizim and following the Samaritan Torah.",
      ru: "Древняя религиозная община, происходящая от израильтян; поклоняется на горе Гаризим и следует Самаритянскому Пятикнижию.",
      az: "İsraillilərdən törəyən qədim dini icma; Gerizim dağında ibadət edir və Samariya Tövratına əməl edir.",
    },
    sources: [
      wiki("Samaritans (Wikipedia)", "Самаритяне (Википедия)", "Samariyalılar (Vikipediya)", "https://en.wikipedia.org/wiki/Samaritans"),
    ],
  },
  druze: {
    gloss: {
      en: "An esoteric, monotheistic ethnoreligious group from the Levant, influenced by Ismaili Islam, Greek philosophy, and gnosticism.",
      ru: "Эзотерическая монотеистическая этнорелигиозная группа с Ближнего Востока, испытавшая влияние исмаилизма, греческой философии и гностицизма.",
      az: "Şərqdən (Levant) olan ezoterik, monoteist etno-dini qrup; İsmaili İslamı, Yunan fəlsəfəsi və qnostisizmin təsiri altında.",
    },
    sources: [
      wiki("Druze (Wikipedia)", "Друзы (Википедия)", "Druzlar (Vikipediya)", "https://en.wikipedia.org/wiki/Druze"),
    ],
  },
  mandaean: {
    gloss: {
      en: "A Gnostic religion from Mesopotamia revering John the Baptist, with baptism as its central rite.",
      ru: "Гностическая религия из Месопотамии, почитающая Иоанна Крестителя; крещение — центральный обряд.",
      az: "Vəftizçi Yəhyanı ehtiram edən Mesopotamiya qnostik dini; vəftiz mərkəzi ayindir.",
    },
    sources: [
      wiki("Mandaeism (Wikipedia)", "Мандеизм (Википедия)", "Mandeyizm (Vikipediya)", "https://en.wikipedia.org/wiki/Mandaeism"),
    ],
  },
  yazidi: {
    gloss: {
      en: "A Kurdish ethno-religious tradition with a single God and seven holy beings, chief among them the Peacock Angel (Tawûsî Melek).",
      ru: "Курдская этнорелигиозная традиция с единым Богом и семью святыми существами, главный из которых — Ангел-Павлин.",
      az: "Vahid Tanrı və yeddi müqəddəs varlığa malik kürd etno-dini ənənəsi; ən başlıcası Tovus Mələkdir.",
    },
    sources: [
      wiki("Yazidism (Wikipedia)", "Езидизм (Википедия)", "Yezidizm (Vikipediya)", "https://en.wikipedia.org/wiki/Yazidism"),
    ],
  },
  rastafari: {
    gloss: {
      en: "A 20th-century religious movement from Jamaica venerating Haile Selassie I as divine, emphasizing African identity and liberation.",
      ru: "Религиозное движение XX века с Ямайки, почитающее Хайле Селассие I как божественного; подчёркивает африканскую идентичность.",
      az: "XX əsr Yamayka dini hərəkatı; Heyle Selassieni ilahi kimi ehtiram edir, Afrika kimliyini və azadlığını vurğulayır.",
    },
    sources: [
      wiki("Rastafari (Wikipedia)", "Растафари (Википедия)", "Rastafari (Vikipediya)", "https://en.wikipedia.org/wiki/Rastafari"),
    ],
  },
  khalsa: {
    gloss: {
      en: "The initiated community of Sikhism, bound by a formal baptism (Amrit) and a code of conduct (Rehat).",
      ru: "Посвящённая община сикхизма, связанная формальным крещением (Амрит) и кодексом поведения (Рехат).",
      az: "Sikxizmin rəsmi vəftiz (Amrit) və davranış kodeksi (Rehat) ilə bağlı təşəbbüslü icması.",
    },
    sources: [
      wiki("Khalsa (Wikipedia)", "Хальса (Википедия)", "Khalsa (Vikipediya)", "https://en.wikipedia.org/wiki/Khalsa"),
    ],
  },
  sehajdhari: {
    gloss: {
      en: "A Sikh who has not undergone Amrit initiation but identifies with Sikh beliefs and practices.",
      ru: "Сикх, не прошедший обряд Амрит, но разделяющий сикхские верования и практики.",
      az: "Amrit mərasimini keçməmiş, lakin Sikh inanclarını və praktikalarını qəbul edən Sikh.",
    },
    sources: [
      wiki("Sehajdhari (Wikipedia)", "Сехадждхари (Википедия)", "Sehajdhari (Vikipediya)", "https://en.wikipedia.org/wiki/Sehajdhari"),
    ],
  },
  // ============ CHRISTIAN TRADITIONS ============
  catholic: {
    gloss: {
      en: "The largest Christian communion, united under the Pope, with sacramental worship and apostolic tradition.",
      ru: "Крупнейшая христианская община, объединённая под началом Папы, с сакраментальным богослужением и апостольской традицией.",
      az: "Papanın rəhbərliyi altında birləşən ən böyük Xristian birliyi; sakramental ibadət və həvari ənənəsi ilə.",
    },
    sources: [
      wiki("Catholic Church (Wikipedia)", "Католическая церковь (Википедия)", "Katolik kilsəsi (Vikipediya)", "https://en.wikipedia.org/wiki/Catholic_Church"),
    ],
  },
  orthodox: {
    gloss: {
      en: "Eastern Orthodox Christianity — the second-largest Christian communion, centered on the ecumenical councils and iconography.",
      ru: "Восточное православие — вторая по величине христианская община, опирающаяся на вселенские соборы и иконопочитание.",
      az: "Şərqi Pravoslav Xristianlıq — ikinci ən böyük Xristian birliyi; ümumdünya məclisləri və ikonoqrafiyaya əsaslanır.",
    },
    sources: [
      wiki("Eastern Orthodox Church (Wikipedia)", "Православная церковь (Википедия)", "Şərqi Pravoslav kilsəsi (Vikipediya)", "https://en.wikipedia.org/wiki/Eastern_Orthodox_Church"),
    ],
  },
  protestant: {
    gloss: {
      en: "Christian traditions emerging from the 16th-century Reformation, emphasizing scripture, faith, and the priesthood of all believers.",
      ru: "Христианские традиции, возникшие из Реформации XVI века; подчёркивают Писание, веру и священство всех верующих.",
      az: "XVI əsr Reformasiyasından yaranan Xristian ənənələri; müqəddəs kitabı, imanı və bütün möminlərin kahinliyini vurğulayır.",
    },
    sources: [
      wiki("Protestantism (Wikipedia)", "Протестантизм (Википедия)", "Protestantizm (Vikipediya)", "https://en.wikipedia.org/wiki/Protestantism"),
    ],
  },
};

/**
 * ALIASES — maps wizard choice ids (and some tag keys) to definition keys
 * so that QuestionCard can look up a definition by choice id directly.
 */
const TERM_ALIASES: Record<string, string> = {
  // non-religious frame
  no_sacred: "naturalist",
  yes_sacred: "religious_naturalist",
  // secular profile
  agnostic_skeptical: "agnostic",
  // reality structure
  one: "monotheism",
  many: "polytheism",
  one_many: "henotheism",
  nondual: "nondual",
  cosmic: "pantheism",
  // agency
  personal: "personalism",
  impersonal: "impersonalism",
  both_agency: "transpersonal",
  beyond_agency: "apophatic",
  // relation
  karmic: "karmic",
  nonintervention: "deism",
  // knowing
  reason: "natural_theology",
  experience: "mystical",
  ritual: "contemplative",
  // candidate traditions
  explore_deism: "deism",
  explore_pantheism: "panentheism",
  explore_polytheism: "polytheism",
  explore_secular: "secular_humanist",
  // deism detail
  classical_deism: "deism",
  // pantheism detail
  pantheism: "pantheism",
  panentheism: "panentheism",
  // belonging
  southasian: "karmic",
  eastasian: "daoist",
  pagan: "wiccan",
  esoteric: "theosophical",
  // abrahamic detail
  jewish: "orthodox_jewish",
  christian: "catholic",
  muslim: "sunni",
  // south asian detail
  hindu: "vaishnava",
  jain: "karmic",
  buddhist_sa: "theravada",
  // east asian detail
  shinto: "shinto",
  // pagan detail
  reconstructionist: "heathen",
  // esoteric detail
  spiritualist: "spiritualist",
  theosophical: "theosophical",
  new_thought: "new_thought",
  new_age: "new_age",
  // hindu detail
  smarta: "smarta",
  // sikh detail
  sikh_khalsa: "khalsa",
  sikh_sehajdhari: "sehajdhari",
  // islam detail
  muslim_unsure: "sunni",
  // christian detail
  christian_unsure: "catholic",
  // jewish detail
  jewish_unsure: "orthodox_jewish",
  // bahai detail
  bahai_manifestation: "bahai",
};

/** Lookup helper: returns the definition for a choice id/tag, or undefined. */
export function getTermDefinition(id: string): TermDefinition | undefined {
  return TERM_DEFINITIONS[id] ?? TERM_DEFINITIONS[TERM_ALIASES[id]];
}
