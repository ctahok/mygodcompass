import { type LocalizedText } from "@/data/ontology";

export const LOCALIZED_CANDIDATES: Record<string, { name: LocalizedText; nodeId: string }> = {
  christianity: {
    name: { en: "Christianity", ru: "Христианство", az: "Xristianlıq" },
    nodeId: "christian_detail",
  },
  islam: {
    name: { en: "Islam", ru: "Ислам", az: "İslam" },
    nodeId: "islam_detail",
  },
  judaism: {
    name: { en: "Judaism", ru: "Иудаизм", az: "Yəhudilik" },
    nodeId: "jewish_detail",
  },
  sikhism: {
    name: { en: "Sikhism", ru: "Сикхизм", az: "Siqhizm" },
    nodeId: "sikh_detail",
  },
  bahai: {
    name: { en: "the Baháʼí Faith", ru: "Вера Бахаи", az: "Bəhai inancı" },
    nodeId: "bahai_detail",
  },
  hindu: {
    name: { en: "Hindu traditions", ru: "Индуистские традиции", az: "Hindu ənənələri" },
    nodeId: "hindu_detail",
  },
  buddhism: {
    name: { en: "Buddhism", ru: "Буддизм", az: "Buddizm" },
    nodeId: "buddhist_detail",
  },
  deism: {
    name: { en: "Deism", ru: "Деизм", az: "Deizm" },
    nodeId: "deism_detail",
  },
  pantheism: {
    name: { en: "Pantheism / Panentheism", ru: "Пантеизм / Панентеизм", az: "Panteizm / Panenteizm" },
    nodeId: "pantheism_detail",
  },
  polytheism: {
    name: { en: "Polytheist paths", ru: "Политеистические пути", az: "Politeist yollar" },
    nodeId: "pagan_detail",
  },
  pagan: {
    name: { en: "Pagan paths", ru: "Языческие пути", az: "Paqan yollar" },
    nodeId: "pagan_detail",
  },
  secular: {
    name: { en: "Secular / non-religious", ru: "Светские / нерелигиозные пути", az: "Dünyəvi / qeyri-dini yollar" },
    nodeId: "secular_profile",
  },
  atheism: {
    name: { en: "Atheism", ru: "Атеизм", az: "Ateizm" },
    nodeId: "secular_profile",
  },
  agnosticism: {
    name: { en: "Agnosticism", ru: "Агностицизм", az: "Aqnostisizm" },
    nodeId: "agnostic",
  },
  humanism: {
    name: { en: "Humanism", ru: "Гуманизм", az: "Humanizm" },
    nodeId: "secular_profile",
  },
  naturalism: {
    name: { en: "Religious naturalism", ru: "Религиозный натурализм", az: "Dini naturalizm" },
    nodeId: "rnatural_profile",
  },
  daoism: {
    name: { en: "Daoism", ru: "Даосизм", az: "Daosizm" },
    nodeId: "eastasian_detail",
  },
  shinto: {
    name: { en: "Shinto", ru: "Синтоизм", az: "Şintoizm" },
    nodeId: "eastasian_detail",
  },
  jainism: {
    name: { en: "Jainism", ru: "Джайнизм", az: "Caynizm" },
    nodeId: "southasian_detail",
  },
  indigenous: {
    name: { en: "Indigenous / ancestral paths", ru: "Коренные / родовые пути", az: "Yerli / əcdad yolları" },
    nodeId: "indigenous_detail",
  },
  classical_theism: {
    name: { en: "Classical theism", ru: "Классический теизм", az: "Klassik teizm" },
    nodeId: "agency",
  },
  process_theism: {
    name: { en: "Process / relational theism", ru: "Процессный / реляционный теизм", az: "Proses / münasibət teizmi" },
    nodeId: "pantheism_detail",
  },
  sufism: {
    name: { en: "Sufi-oriented Islam", ru: "Суфийский ислам", az: "Sufi yönümlü İslam" },
    nodeId: "islam_detail",
  },
};

export const LOCALIZED_DESCRIPTOR_MAP: Record<string, LocalizedText> = {
  // Orientation
  "non-religious": { en: "non-religious", ru: "нерелигиозный", az: "qeyri-dini" },
  "categorical": { en: "open to spiritual categories", ru: "открытый к духовным категориям", az: "mənəvi anlayışlara açıq" },
  "practice-centred": { en: "practice-centred", ru: "ориентированный на практику", az: "əməli təcrübə mərkəzli" },

  // Ultimate reality
  "non-theistic": { en: "non-theistic", ru: "нетеистический", az: "qeyri-teist" },
  "affirms ultimate": { en: "affirm an ultimate reality", ru: "признание высшей реальности", az: "ali reallığın qəbulu" },
  "agnostic/seeking": { en: "agnostic / actively seeking", ru: "агностический / активный поиск", az: "aqnostik / fəal axtarış" },
  "religious naturalist": { en: "religious naturalism", ru: "религиозный натурализм", az: "dini naturalizm" },
  "spiritual naturalist": { en: "spiritual naturalism", ru: "духовный натурализм", az: "mənəvi naturalizm" },

  // Number / Unity
  "one": { en: "one ultimate reality", ru: "единая высшая реальность", az: "vahid ali reallıq" },
  "many": { en: "many divine beings/powers", ru: "множество божественных сил/существ", az: "çoxsaylı ilahi varlıqlar/qüvvələr" },
  "one expressed through many": { en: "one expressed through many forms", ru: "единое, выраженное во множестве форм", az: "çoxsaylı formalarda təcəssüm edən vahid reallıq" },
  "non-dual": { en: "non-dual", ru: "недуалистическая реальность", az: "qeyri-dual (vəhdət)" },
  "cosmos-identical / immanent": { en: "cosmos-identical / immanent", ru: "тождественная космосу / имманентная", az: "kainatla vəhdət / immanent" },
  "unknown": { en: "unknown / suspended", ru: "неизвестно / приостановлено", az: "naməlum / dayandırılmış" },

  // Agency
  "personal/relational": { en: "personal/relational", ru: "личная / реляционная", az: "şəxsi / münasibətə əsaslanan" },
  "impersonal": { en: "impersonal (law/principle)", ru: "безличная (закон/принцип)", az: "şəxsiyyətsiz (qanun/prinsip)" },
  "personal & impersonal / transpersonal": { en: "personal & impersonal / transpersonal", ru: "личная и безличная / трансперсональная", az: "şəxsi və şəxsiyyətsiz / transpersonal" },
  "beyond categories": { en: "beyond categories", ru: "за пределами категорий", az: "kateqoriyaların fövqündə" },

  // World relation
  "creator/originator": { en: "creator/originator", ru: "творец / первоисточник", az: "yaradıcı / ilk qaynaq" },
  "sustainer/orderer": { en: "sustainer/orderer", ru: "вседержитель / устроитель", az: "qoruyucu / nizamlayıcı" },
  "active participant": { en: "active participant in the world", ru: "активно действующая в мире", az: "dünyada fəal iştirak edən" },
  "non-interventionist (deist)": { en: "non-interventionist (deist)", ru: "невмешивающаяся (деизм)", az: "müdaxilə etməyən (deist)" },
  "karmic/ritual/cosmic order": { en: "karmic/ritual/cosmic order", ru: "кармический / ритуальный / космический порядок", az: "karmik / ritual / kosmik nizam" },
  "non-separate (identity/immanence)": { en: "non-separate from nature/self", ru: "неотделимая от природы/себя", az: "təbiətdən və ya insandan ayrı olmayan (vəhdət)" },
  "mixed/unsettled": { en: "mixed/unsettled", ru: "смешанная / неопределённая", az: "qarışıq / qərarsız" },

  // Epistemic sources
  "scripture/prophetic revelation": { en: "scripture / prophetic revelation", ru: "священное писание / пророческое откровение", az: "müqəddəs mətn / peyğəmbərlik vəhyi" },
  "reason/philosophy": { en: "reason / philosophy", ru: "разум / философия", az: "ağıl / fəlsəfə" },
  "mystical/contemplative experience": { en: "mystical / contemplative experience", ru: "мистический / созерцательный опыт", az: "mistik / kontemplativ təcrübə" },
  "ritual/embodied practice": { en: "ritual / embodied practice", ru: "ритуальная / телесная практика", az: "ritual / cismani təcrübə" },
  "ancestors/elders/land/oral tradition": { en: "ancestors / oral tradition / land", ru: "предки / устная традиция / земля", az: "əcdadlar / şifahi ənənə / torpaq" },
  "pluralistic (multiple sources)": { en: "pluralistic (multiple sources)", ru: "плюралистический (несколько источников)", az: "plüralist (bir neçə mənbə)" },
  "no epistemic claim": { en: "no epistemic claim", ru: "без претензии на знание", az: "idrak iddiasının olmaması" },

  // Confidence / Status
  "high": { en: "high", ru: "высокая", az: "yüksək" },
  "moderate": { en: "moderate", ru: "средняя", az: "orta" },
  "tentative": { en: "tentative", ru: "предварительная", az: "ilkin" },
  "settled": { en: "settled", ru: "устоявшаяся", az: "sabit" },
  "exploring": { en: "exploring", ru: "исследовательская", az: "axtarış" },
  "varies": { en: "context-dependent", ru: "зависит от контекста", az: "kontekstə bağlı" },
  "incomplete": { en: "incomplete", ru: "неполная", az: "natamam" },

  // Practices
  "community/sangha": { en: "community / sangha", ru: "община / сангха", az: "icma / sanqha" },
  "ancestral/land-based": { en: "ancestral / land-based", ru: "родовая / связанная с землёй", az: "əcdadi / torpağa bağlı" },
  "tradition/path": { en: "tradition / path", ru: "традиция / путь", az: "ənənə / mənəvi yol" },

  // Cultural heritages
  "Abrahamic/West Asian": { en: "Abrahamic / West Asian", ru: "Авраамическое / Западноазиатское", az: "İbrahimi / Qərbi Asiya" },
  "South Asian/Himalayan": { en: "South Asian / Himalayan", ru: "Южноазиатское / Гималайское", az: "Cənubi Asiya / Himalay" },
  "East Asian": { en: "East Asian", ru: "Восточноазиатское", az: "Şərqi Asiya" },
  "Indigenous/land-based/ancestral": { en: "Indigenous / land-based / ancestral", ru: "Коренное / связанное с землёй / родовое", az: "Yerli / torpağa bağlı / əcdad" },
  "Contemporary Pagan": { en: "Contemporary Pagan", ru: "Современное язычество", az: "Müasir Paqanizm" },
};
