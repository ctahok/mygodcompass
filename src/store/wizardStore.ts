// ============================================================
// WizardEngine — Zustand store (v2: multi-axis graph model)
// Tracks the path (history of choices), enables Back, and
// computes a multi-axis Profile from accumulated tags.
// ============================================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { NODES, type Choice, type Node, type Profile, type Lang, type LocalizedText } from "@/data/ontology";

export interface PathStep {
  nodeId: string;
  choiceIds: string[];        // supports multiple selections
  tags: string[];
  nextNodeIds: string[];      // can branch to multiple
  freeText?: string;          // for free-text responses
}

interface WizardState {
  /** History of steps; empty = at start node */
  path: PathStep[];
  /** Queue of upcoming nodes when a step branches to multiple */
  pendingNodes: string[];
  /** Whether the user has clicked "Begin the Journey" */
  begun: boolean;
  /** Whether the user explicitly finished (incomplete profile) */
  finished: boolean;
  /** Localization used for UI (mirrors i18next) */
  lang: Lang;
  /** Computed multi-axis profile */
  profile: Profile | null;
  /** Weighted candidate pathway scores */
  candidateScores: Record<string, number>;
  /** Reveal the first question */
  begin: () => void;
  /** Answer a question (supports multiple choices) */
  answer: (choiceIds: string[], freeText?: string) => void;
  /** Go back one step */
  back: () => void;
  /** Reset the whole journey */
  reset: () => void;
  /** Explicitly finish (marks profile incomplete if dimensions are missing) */
  finish: () => void;
  setLang: (l: Lang) => void;
}

const START_NODE = "start";

// ------------------------------------------------------------
// Coherence rules — tag pairs that reward or penalize
// Updated for new tag vocabulary
// ------------------------------------------------------------
const COHERENT_PAIRS: [string, string][] = [
  // Non-religious frame
  ["secular", "naturalist"],
  ["religious-naturalist", "spiritual-naturalist"],
  ["atheist", "secular-humanist"],
  // Ultimate reality
  ["affirms-ultimate", "one"],
  ["affirms-ultimate", "many"],
  ["affirms-ultimate", "nondual"],
  ["affirms-ultimate", "immanence"],
  ["non-theism", "secular"],
  // Agency
  ["personalism", "relational"],
  ["impersonalism", "apophatic"],
  ["transpersonal", "both"],
  ["beyond-categories", "apophatic"],
  // World relation
  ["creator", "origination"],
  ["sustainer", "providence"],
  ["interventionist", "revelation"],
  ["deism", "nonintervention"],
  ["karmic", "cosmic-order"],
  ["karmic", "ritual-order"],
  ["identity", "nondual"],
  ["identity", "immanence"],
  // Epistemic
  ["scripture", "revelation"],
  ["reason", "philosophy"],
  ["experience", "mystical"],
  ["ritual", "practice"],
  ["ancestry", "oral-tradition"],
  ["pluralistic", "multiple-sources"],
  // Practice-first
  ["practice-primary", "community-primary"],
  ["ancestry-primary", "tradition-primary"],
  // Tradition groupings
  ["jewish", "abrahamic"],
  ["christian", "abrahamic"],
  ["muslim", "abrahamic"],
  ["buddhist", "south-asian"],
  ["sikh", "south-asian"],
  ["jain", "south-asian"],
  ["daoist", "east-asian"],
  ["confucian", "east-asian"],
  ["shinto", "east-asian"],
  ["indigenous", "land-based"],
  ["heathen", "pagan"],
  ["druid", "pagan"],
  ["wiccan", "pagan"],
];

const CONFLICT_PAIRS: [string, string][] = [
  // Constructivist + Realist
  ["constructivist", "realist"],
  // Personal + Impersonal (unless both/beyond selected)
  ["personalism", "impersonalism"],
  // Non-theism vs affirms-ultimate
  ["non-theism", "affirms-ultimate"],
  // Deism vs interventionist
  ["deism", "interventionist"],
  // Single vs multiple (if both selected without both/beyond)
  ["monism", "plurality"],
];

/** Coherence score: positive = consistent, negative = conflicted */
export function computeCoherence(tags: string[]): number {
  let score = 0;
  for (const [a, b] of COHERENT_PAIRS) {
    if (tags.includes(a) && tags.includes(b)) score += 1;
  }
  for (const [a, b] of CONFLICT_PAIRS) {
    if (tags.includes(a) && tags.includes(b)) score -= 2;
  }
  return score;
}

export function coherenceState(tags: string[]): "neutral" | "coherent" | "conflict" {
  const s = computeCoherence(tags);
  if (s < 0) return "conflict";
  if (s > 0) return "coherent";
  return "neutral";
}

// ============================================================
// Candidate pathway scoring — transparent weighted system
// Each answer's tags adjust candidate scores (positive/negative).
// ============================================================
const CANDIDATE_WEIGHTS: Record<string, Record<string, number>> = {
  // Tag → candidate pathway score delta
  monotheism: { christianity: 2, islam: 2, judaism: 2, sikhism: 2, bahai: 2, deism: 1 },
  "affirms-ultimate": { christianity: 1, islam: 1, judaism: 1, sikhism: 1, bahai: 1, deism: 1, hindu: 1, pantheism: 1 },
  personalism: { christianity: 2, islam: 2, judaism: 2, sikhism: 2, bahai: 2, deism: 1, process_theism: 1 },
  impersonalism: { hindu: 2, buddhism: 1, pantheism: 1, secular: 1 },
  creator: { christianity: 1, islam: 1, judaism: 1, sikhism: 1, bahai: 1, deism: 2, classical_theism: 1 },
  interventionist: { christianity: 2, islam: 2, judaism: 2, sikhism: 1, bahai: 2 },
  deism: { deism: 3 },
  nonintervention: { deism: 2, pantheism: 1 },
  immanence: { pantheism: 2, hindu: 1, process_theism: 1 },
  pantheism: { pantheism: 3 },
  panentheism: { pantheism: 2, christianity: 1, hindu: 1, process_theism: 1 },
  nondual: { hindu: 2, buddhism: 2 },
  plurality: { polytheism: 3, pagan: 3, hindu: 1 },
  polytheism: { polytheism: 3, pagan: 3, hindu: 2 },
  revelation: { christianity: 2, islam: 2, judaism: 2, sikhism: 2, bahai: 2 },
  scripture: { christianity: 1, islam: 1, judaism: 1, sikhism: 1, bahai: 1 },
  prophetic: { christianity: 1, islam: 1, judaism: 1, sikhism: 1, bahai: 1 },
  reason: { deism: 1, secular: 1, process_theism: 1 },
  mystical: { hindu: 1, buddhism: 1, islam: 1, christianity: 1, sufism: 1 },
  experience: { hindu: 1, buddhism: 1 },
  ritual: { hindu: 1, buddhism: 1, pagan: 1 },
  practice: { hindu: 1, buddhism: 1, pagan: 1 },
  ancestry: { judaism: 1, indigenous: 2, pagan: 1 },
  secular: { secular: 3, atheism: 2, humanism: 2 },
  atheist: { atheism: 3, secular: 2 },
  "secular-humanist": { humanism: 3, secular: 2, atheism: 1 },
  naturalist: { secular: 2, naturalism: 2 },
  "religious-naturalist": { naturalism: 2, pantheism: 1, deism: 1 },
  "spiritual-naturalist": { naturalism: 2, pantheism: 1 },
  agnostic: { agnosticism: 3, secular: 1 },
  seeking: { agnosticism: 1, process_theism: 1 },
  "non-theism": { buddhism: 2, atheism: 2, secular: 1, jainism: 1 },
  karmic: { hindu: 2, buddhism: 2, jainism: 2, sikhism: 1 },
  "cosmic-order": { hindu: 1, buddhism: 1, daoism: 1 },
  "ritual-order": { hindu: 1, pagan: 1 },
  christian: { christianity: 3 },
  muslim: { islam: 3 },
  jewish: { judaism: 3 },
  sikh: { sikhism: 3 },
  bahai: { bahai: 3 },
  hindu: { hindu: 3 },
  buddhist: { buddhism: 3 },
  daoist: { daoism: 3 },
  shinto: { shinto: 2 },
  pagan: { pagan: 3, polytheism: 2 },
  indigenous: { indigenous: 3 },
  "one expressed through many": { hindu: 1, bahai: 1 },
  henotheism: { hindu: 2, polytheism: 1 },
  advaita: { hindu: 2 },
  vaishnava: { hindu: 1 },
  shaiva: { hindu: 1 },
  shakta: { hindu: 1 },
  smarta: { hindu: 1 },
  theravada: { buddhism: 1 },
  mahayana: { buddhism: 1 },
  vajrayana: { buddhism: 1 },
  sunni: { islam: 1 },
  shia: { islam: 1 },
  ibadi: { islam: 1 },
  sufi: { islam: 1, sufism: 2 },
  quranist: { islam: 1 },
  catholic: { christianity: 1 },
  orthodox: { christianity: 1 },
  protestant: { christianity: 1 },
  // Negative weights — explicit rejections
  "non-religious-frame": { christianity: -1, islam: -1, judaism: -1, sikhism: -1, bahai: -1 },
  "non-categorised": {},
};

export function computeCandidateScores(tags: string[]): Record<string, number> {
  const scores: Record<string, number> = {};
  for (const tag of tags) {
    const weights = CANDIDATE_WEIGHTS[tag];
    if (!weights) continue;
    for (const [candidate, delta] of Object.entries(weights)) {
      scores[candidate] = (scores[candidate] || 0) + delta;
    }
  }
  return scores;
}

export function topCandidates(scores: Record<string, number>, n = 6): { id: string; score: number }[] {
  return Object.entries(scores)
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([id, score]) => ({ id, score }));
}

/** Build a multi-axis Profile from accumulated tags */
function buildProfile(tags: string[], freeTexts: string[]): Profile {
  const profile: Profile = {
    selfDescription: freeTexts.filter(Boolean).join(" | ") || undefined,
    orientation: [],
    ultimateReality: [],
    numberUnity: [],
    agency: [],
    worldRelation: [],
    epistemicSources: [],
    traditions: [],
    practices: [],
    culturalHeritages: [],
    confidence: "tentative",
  };

  // Orientation frame
  if (tags.includes("non-religious-frame")) profile.orientation?.push("non-religious");
  if (tags.includes("open-to-categories")) profile.orientation?.push("categorical");
  if (tags.includes("practice-first")) profile.orientation?.push("practice-centred");

  // Ultimate reality
  if (tags.includes("non-theism")) profile.ultimateReality?.push("non-theistic");
  if (tags.includes("affirms-ultimate")) profile.ultimateReality?.push("affirms ultimate");
  if (tags.includes("agnostic") || tags.includes("seeking") || tags.includes("suspended-judgment")) {
    profile.ultimateReality?.push("agnostic/seeking");
  }
  if (tags.includes("religious-naturalist")) profile.ultimateReality?.push("religious naturalist");
  if (tags.includes("spiritual-naturalist")) profile.ultimateReality?.push("spiritual naturalist");

  // Number / Unity
  if (tags.includes("one")) profile.numberUnity?.push("one");
  if (tags.includes("many")) profile.numberUnity?.push("many");
  if (tags.includes("unity-plurality") || tags.includes("henotheism") || tags.includes("monolatry")) {
    profile.numberUnity?.push("one expressed through many");
  }
  if (tags.includes("non-dual") || tags.includes("advaita")) profile.numberUnity?.push("non-dual");
  if (tags.includes("immanence") || tags.includes("pantheism") || tags.includes("panentheism")) {
    profile.numberUnity?.push("cosmos-identical / immanent");
  }
  if (tags.includes("agnostic") && !profile.numberUnity?.length) profile.numberUnity?.push("unknown");

  // Agency
  if (tags.includes("personalism")) profile.agency?.push("personal/relational");
  if (tags.includes("impersonalism")) profile.agency?.push("impersonal");
  if (tags.includes("transpersonal") || tags.includes("both")) profile.agency?.push("personal & impersonal / transpersonal");
  if (tags.includes("apophatic") || tags.includes("beyond-categories")) profile.agency?.push("beyond categories");

  // World relation
  if (tags.includes("creator")) profile.worldRelation?.push("creator/originator");
  if (tags.includes("sustainer")) profile.worldRelation?.push("sustainer/orderer");
  if (tags.includes("interventionist")) profile.worldRelation?.push("active participant");
  if (tags.includes("deism")) profile.worldRelation?.push("non-interventionist (deist)");
  if (tags.includes("karmic") || tags.includes("ritual-order") || tags.includes("cosmic-order")) {
    profile.worldRelation?.push("karmic/ritual/cosmic order");
  }
  if (tags.includes("identity") || tags.includes("nondual") || tags.includes("immanence")) {
    profile.worldRelation?.push("non-separate (identity/immanence)");
  }
  if (tags.includes("mixed") || tags.includes("unsettled")) profile.worldRelation?.push("mixed/unsettled");

  // Epistemic sources
  if (tags.includes("scripture")) profile.epistemicSources?.push("scripture/prophetic revelation");
  if (tags.includes("reason")) profile.epistemicSources?.push("reason/philosophy");
  if (tags.includes("experience")) profile.epistemicSources?.push("mystical/contemplative experience");
  if (tags.includes("ritual")) profile.epistemicSources?.push("ritual/embodied practice");
  if (tags.includes("ancestry")) profile.epistemicSources?.push("ancestors/elders/land/oral tradition");
  if (tags.includes("pluralistic")) profile.epistemicSources?.push("pluralistic (multiple sources)");
  if (tags.includes("non-epistemic")) profile.epistemicSources?.push("no epistemic claim");

  // Traditions / Cultural heritages
  const traditionMap: Record<string, string> = {
    "jewish": "Jewish",
    "christian": "Christian",
    "muslim": "Muslim",
    "bahai": "Baháʼí",
    "samaritan": "Samaritan",
    "druze": "Druze",
    "mandaean": "Mandaean",
    "yazidi": "Yazidi",
    "rastafari": "Rastafari",
    "hindu": "Hindu",
    "vaishnava": "Vaishnava",
    "shaiva": "Shaiva",
    "shakta": "Shakta",
    "smarta": "Smarta/Advaita",
    "sikh": "Sikh",
    "jain": "Jain",
    "buddhist": "Buddhist",
    "daoist": "Daoist",
    "confucian": "Confucian",
    "chinese-folk": "Chinese folk",
    "shinto": "Shinto",
    "korean": "Korean traditional",
    "vietnamese": "Vietnamese traditional",
    "japanese-new": "Japanese new religions",
    "indigenous-self-described": "Indigenous/ancestral",
    "heathen": "Heathen/Germanic",
    "druid": "Druid/Celtic",
    "wiccan": "Wiccan",
    "reconstructionist": "Polytheist reconstructionist",
    "spiritualist": "Spiritualist",
    "theosophical": "Theosophical",
    "occult": "Occult/Hermetic",
    "new-thought": "New Thought",
    "new-age": "New Age",
    "nr-self-described": "New religious movement",
  };

  for (const [tag, label] of Object.entries(traditionMap)) {
    if (tags.includes(tag)) {
      profile.traditions?.push(label);
    }
  }

  // Practices
  if (tags.includes("practice-primary")) profile.practices?.push("practice-centred");
  if (tags.includes("community-primary")) profile.practices?.push("community/sangha");
  if (tags.includes("ancestry-primary")) profile.practices?.push("ancestral/land-based");
  if (tags.includes("tradition-primary")) profile.practices?.push("tradition/path");

  // Cultural heritages (broader groupings)
  if (tags.includes("abrahamic")) profile.culturalHeritages?.push("Abrahamic/West Asian");
  if (tags.includes("south-asian")) profile.culturalHeritages?.push("South Asian/Himalayan");
  if (tags.includes("east-asian")) profile.culturalHeritages?.push("East Asian");
  if (tags.includes("indigenous") || tags.includes("land-based") || tags.includes("ancestral")) {
    profile.culturalHeritages?.push("Indigenous/land-based/ancestral");
  }
  if (tags.includes("pagan")) profile.culturalHeritages?.push("Contemporary Pagan");
  if (tags.includes("esoteric")) profile.culturalHeritages?.push("Esoteric/Spiritualist");
  if (tags.includes("new-religious-movement")) profile.culturalHeritages?.push("New religious movement");

  // Confidence
  const conflict = coherenceState(tags) === "conflict";
  const hasMultiple = tags.filter(t => 
    ["one", "many", "non-dual", "immanence", "unity-plurality", "personalism", "impersonalism", 
     "transpersonal", "beyond-categories", "creator", "sustainer", "interventionist", "deism",
     "karmic", "identity", "mixed"].includes(t)
  ).length > 1;
  
  if (conflict) profile.confidence = "exploring";
  else if (hasMultiple) profile.confidence = "varies";
  else if (tags.includes("agnostic") || tags.includes("seeking") || tags.includes("suspended-judgment") || tags.includes("contextual")) {
    profile.confidence = "exploring";
  } else if (tags.includes("settled")) {
    profile.confidence = "settled";
  }

  // Deduplicate arrays
  const profileKeys = Object.keys(profile) as Array<keyof Profile>;
  for (const key of profileKeys) {
    const arr = profile[key];
    if (Array.isArray(arr)) {
      (profile[key] as string[]) = [...new Set(arr)];
    }
  }

  return profile;
}

export const useWizard = create<WizardState>()(
  persist(
    (set, get) => ({
      path: [],
      pendingNodes: [],
      begun: false,
      finished: false,
      lang: "en",
      profile: null,
      candidateScores: {},

      begin: () => set({ begun: true }),

      // For single-select nodes (or first choice in multi)
      answer: (choiceIds: string[], freeText?: string) => {
        const { path, pendingNodes } = get();
        const currentNodeId = path.length === 0 ? START_NODE : (path[path.length - 1].nextNodeIds[0] || pendingNodes[0] || START_NODE);
        const node = NODES[currentNodeId];
        if (!node) return;

        const choices = choiceIds.map(id => node.choices.find(c => c.id === id)).filter(Boolean) as Choice[];
        if (!choices.length) return;

        const allTags = choices.flatMap(c => c.tags || []);
        const allNext = choices.flatMap(c => c.next || []);

        // Merge: if a next node is already pending, don't duplicate; otherwise append new ones
        const mergedNext = [...new Set([...pendingNodes, ...allNext])];

        const step: PathStep = {
          nodeId: currentNodeId,
          choiceIds,
          tags: allTags,
          nextNodeIds: allNext.length > 0 ? allNext : (pendingNodes.length > 0 ? [pendingNodes[0]] : []),
          freeText,
        };

        set(state => {
          const newPath = [...state.path, step];
          // Accumulate all tags from path
          const accumulatedTags = newPath.flatMap(s => s.tags);
          const freeTexts = newPath.flatMap(s => s.freeText ? [s.freeText] : []);
          return {
            path: newPath,
            pendingNodes: mergedNext,
            profile: buildProfile(accumulatedTags, freeTexts),
            candidateScores: computeCandidateScores(accumulatedTags),
          };
        });
      },

      back: () => set((state) => {
        const newPath = state.path.slice(0, -1);
        const accumulatedTags = newPath.flatMap(s => s.tags);
        const freeTexts = newPath.flatMap(s => s.freeText ? [s.freeText] : []);
        return {
          path: newPath,
          profile: newPath.length > 0 ? buildProfile(accumulatedTags, freeTexts) : null,
          candidateScores: computeCandidateScores(accumulatedTags),
        };
      }),

      reset: () => set({ path: [], pendingNodes: [], begun: false, finished: false, profile: null, candidateScores: {} }),

      finish: () => set((state) => ({ finished: true, profile: state.profile })),

      setLang: (l: Lang) => set({ lang: l }),
    }),
    {
      name: "ontological-compass-wizard",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        path: state.path,
        pendingNodes: state.pendingNodes,
        begun: state.begun,
        finished: state.finished,
        lang: state.lang,
        profile: state.profile,
        candidateScores: state.candidateScores,
      }),
    }
  )
);

// ------------------------------------------------------------
// Selectors / derived helpers
// ------------------------------------------------------------

export function currentNodeId(state: { path: PathStep[]; pendingNodes?: string[] }): string {
  if (state.path.length === 0) return START_NODE;
  const last = state.path[state.path.length - 1];
  // If the last step declared next nodes, use the first (queue handles the rest)
  if (last.nextNodeIds.length > 0) return last.nextNodeIds[0];
  // Fall back to pending queue
  const pending = state.pendingNodes?.[0];
  if (pending) return pending;
  return START_NODE;
}

export function currentNode(state: { path: PathStep[]; pendingNodes?: string[] }): Node | null {
  const id = currentNodeId(state);
  return NODES[id] || null;
}

export function isAtTerminal(state: { path: PathStep[]; pendingNodes?: string[]; finished?: boolean }): boolean {
  // Explicit finish always counts as terminal
  if (state.finished) return true;
  const node = currentNode(state);
  // If the current node has no choices and no next, it's a genuine terminal
  if (!node) return true;
  // Genuine terminal: node has no choices at all (e.g., free-text leaf without exits)
  if (node.choices.length === 0) return true;
  // If any choice leads onward (has next), the journey is NOT over
  const anyOutgoing = node.choices.some(c => c.next && c.next.length > 0);
  if (anyOutgoing) return false;
  // If there are still pending nodes queued, keep going
  if (state.pendingNodes && state.pendingNodes.length > 0) return false;
  return true;
}

export function currentTerminal(state: { path: PathStep[]; profile: Profile | null; finished?: boolean; candidateScores?: Record<string, number> }): { title: LocalizedText; blueprint: LocalizedText; percent_of_users: number; social_proof: number; similar_minds: LocalizedText[] } | null {
  const profile = state.profile;
  if (!profile) return null;

  const orientation = profile.orientation?.join(", ") || "exploring";
  const ultimate = profile.ultimateReality?.join(", ") || "undetermined";
  const agency = profile.agency?.join(", ") || "unspecified";
  const relation = profile.worldRelation?.join(", ") || "unspecified";
  const epistemic = profile.epistemicSources?.join(", ") || "unspecified";
  const traditions = profile.traditions?.join(", ") || "none";
  const confidence = profile.confidence || "tentative";

  // Candidate pathway presentation
  const scores = state.candidateScores || computeCandidateScores(state.path.flatMap(s => s.tags));
  const candidates = topCandidates(scores, 5);
  const candidateNames: Record<string, string> = {
    christianity: "Christianity", islam: "Islam", judaism: "Judaism", sikhism: "Sikhism",
    bahai: "the Baháʼí Faith", hindu: "Hindu traditions", buddhism: "Buddhism",
    deism: "Deism", pantheism: "Pantheism / Panentheism", polytheism: "Polytheist paths",
    pagan: "Pagan paths", secular: "Secular / non-religious", atheism: "Atheism",
    agnosticism: "Agnosticism", humanism: "Humanism", naturalism: "Religious naturalism",
    daoism: "Daoism", shinto: "Shinto", jainism: "Jainism", indigenous: "Indigenous / ancestral paths",
    classical_theism: "Classical theism", process_theism: "Process / relational theism", sufism: "Sufi-oriented Islam",
  };
  const candidateList = candidates.map(c => candidateNames[c.id] || c.id).join(", ");

  const isIncomplete = !state.finished && candidates.length === 0;
  const statusLabel = isIncomplete ? "incomplete" : confidence;

  const title = {
    en: state.finished ? "Provisional Profile (Incomplete)" : candidates.length > 0
      ? "Most Compatible Pathways"
      : `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} Orientation (Incomplete)`,
    ru: state.finished ? "Предварительный профиль (неполный)" : candidates.length > 0
      ? "Наиболее совместимые пути"
      : `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} ориентация (неполная)`,
    az: state.finished ? "Müvəqqəti Profil (Natamam)" : candidates.length > 0
      ? "Ən uyğun yollar"
      : `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} yanaşma (Natamam)`,
  };

  let blueprint: LocalizedText;
  if (candidates.length > 0) {
    blueprint = {
      en: `Most compatible pathways so far: ${candidateList}. Your answers currently suggest ${ultimate}, ${agency}, ${relation}, and ${epistemic}. These answers do not determine your religion; they identify paths you may wish to explore next.`,
      ru: `Наиболее совместимые пути на данный момент: ${candidateList}. Ваши ответы указывают на ${ultimate}, ${agency}, ${relation} и ${epistemic}. Эти ответы не определяют вашу религию; они выявляют пути, которые вы можете исследовать дальше.`,
      az: `Hazırda ən uyğun yollar: ${candidateList}. Cavablarınız ${ultimate}, ${agency}, ${relation} və ${epistemic} olduğunu göstərir. Bu cavablar dininizi müəyyən etmir; onlar araşdıra biləcəyiniz yolları göstərir.`,
    };
  } else {
    blueprint = {
      en: `Your answers describe a ${statusLabel} ${orientation} orientation. You ${ultimate}, draw primarily on ${epistemic}, and identify connections with ${traditions}. This is a description, not an authoritative label.`,
      ru: `Ваши ответы описывают ${statusLabel} ${orientation} ориентацию. Вы ${ultimate}, опираетесь на ${epistemic} и идентифицируете связи с ${traditions}. Это описание, а не авторитетный ярлык.`,
      az: `Cavablarınız ${statusLabel} ${orientation} yanaşmasını təsvir edir. Siz ${ultimate}, əsasən ${epistemic} üzərinə dayanırsınız və ${traditions} ilə əlaqələri müəyyən edirsiniz. Bu təsvirdir, авторитетli etiket deyil.`,
    };
  }

  return {
    title,
    blueprint,
    percent_of_users: 0,
    social_proof: 0,
    similar_minds: [],
  };
}

export function collectedTags(state: { path: PathStep[] }): string[] {
  return state.path.flatMap((s) => s.tags);
}

export function progress(state: { path: PathStep[] }): number {
  // Progress based on path depth vs estimated total depth (~12 nodes)
  const depth = state.path.length;
  const estimatedTotal = 12;
  return Math.min(depth / estimatedTotal, 1);
}

export function pathNodeIds(state: { path: PathStep[] }): string[] {
  const ids = [START_NODE];
  for (const s of state.path) {
    ids.push(s.nodeId);
    ids.push(...s.nextNodeIds);
  }
  return [...new Set(ids)];
}

export function getAllNextNodes(state: { path: PathStep[] }): string[] {
  const last = state.path[state.path.length - 1];
  return last?.nextNodeIds || [];
}