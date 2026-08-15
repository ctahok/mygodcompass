// ============================================================
// WizardEngine — Zustand store (v2: multi-axis graph model)
// Tracks the path (history of choices), enables Back, and
// computes a multi-axis Profile from accumulated tags.
// ============================================================

import { create } from "zustand";
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
  /** Whether the user has clicked "Begin the Journey" */
  begun: boolean;
  /** Localization used for UI (mirrors i18next) */
  lang: Lang;
  /** Computed multi-axis profile */
  profile: Profile | null;
  /** Reveal the first question */
  begin: () => void;
  /** Answer a question (supports multiple choices) */
  answer: (choiceIds: string[], freeText?: string) => void;
  /** Toggle a single choice (for multi-select) */
  toggleChoice: (choiceId: string) => void;
  /** Submit current multi-select and advance */
  submitMulti: () => void;
  /** Go back one step */
  back: () => void;
  /** Reset the whole journey */
  reset: () => void;
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

export const useWizard = create<WizardState>((set, get) => ({
  path: [],
  begun: false,
  lang: "en",
  profile: null,

  begin: () => set({ begun: true }),

  // For single-select nodes (or first choice in multi)
  answer: (choiceIds: string[], freeText?: string) => {
    const { path } = get();
    const currentNodeId = path.length === 0 ? START_NODE : path[path.length - 1].nextNodeIds[0];
    const node = NODES[currentNodeId];
    if (!node) return;

    const choices = choiceIds.map(id => node.choices.find(c => c.id === id)).filter(Boolean) as Choice[];
    if (!choices.length) return;

    const allTags = choices.flatMap(c => c.tags || []);
    const allNext = choices.flatMap(c => c.next || []);

    const step: PathStep = {
      nodeId: currentNodeId,
      choiceIds,
      tags: allTags,
      nextNodeIds: allNext.length > 0 ? allNext : [],
      freeText,
    };

    set(state => {
      const newPath = [...state.path, step];
      // Accumulate all tags from path
      const accumulatedTags = newPath.flatMap(s => s.tags);
      const freeTexts = newPath.flatMap(s => s.freeText ? [s.freeText] : []);
      return {
        path: newPath,
        profile: buildProfile(accumulatedTags, freeTexts),
      };
    });
  },

  // Toggle a choice in current multi-select node (doesn't advance)
  toggleChoice: (_choiceId: string) => {
    // This is handled locally in QuestionCard via local state
    // Store only gets updated on submitMulti
  },

  // Submit current multi-select and advance
  submitMulti: () => {
    // The actual choices are collected in QuestionCard local state
    // and passed to answer(). This is a no-op here; kept for API compat.
  },

  back: () => set((state) => {
    const newPath = state.path.slice(0, -1);
    const accumulatedTags = newPath.flatMap(s => s.tags);
    const freeTexts = newPath.flatMap(s => s.freeText ? [s.freeText] : []);
    return {
      path: newPath,
      profile: newPath.length > 0 ? buildProfile(accumulatedTags, freeTexts) : null,
    };
  }),

  reset: () => set({ path: [], begun: false, profile: null }),

  setLang: (l: Lang) => set({ lang: l }),
}));

// ------------------------------------------------------------
// Selectors / derived helpers
// ------------------------------------------------------------

export function currentNodeId(state: { path: PathStep[] }): string {
  if (state.path.length === 0) return START_NODE;
  const last = state.path[state.path.length - 1];
  // If multiple next nodes, pick first (UI handles branching)
  return last.nextNodeIds[0] || START_NODE;
}

export function currentNode(state: { path: PathStep[] }): Node | null {
  const id = currentNodeId(state);
  return NODES[id] || null;
}

export function isAtTerminal(state: { path: PathStep[] }): boolean {
  const node = currentNode(state);
  // Terminal if no outgoing edges (no choices or all choices have no next)
  if (!node) return true;
  return node.choices.length === 0 || node.choices.every(c => !c.next || c.next.length === 0);
}

export function currentTerminal(state: { path: PathStep[]; profile: Profile | null }): { title: LocalizedText; blueprint: LocalizedText; percent_of_users: number; social_proof: number; similar_minds: LocalizedText[] } | null {
  // Build a terminal-like object from the multi-axis profile for backward compat
  const profile = state.profile;
  if (!profile) return null;
  
  const orientation = profile.orientation?.join(", ") || "exploring";
  const ultimate = profile.ultimateReality?.join(", ") || "undetermined";
  const agency = profile.agency?.join(", ") || "unspecified";
  const relation = profile.worldRelation?.join(", ") || "unspecified";
  const epistemic = profile.epistemicSources?.join(", ") || "unspecified";
  const traditions = profile.traditions?.join(", ") || "none";
  const confidence = profile.confidence || "tentative";
  
  const title = {
    en: `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} ${orientation} orientation`,
    ru: `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} ${orientation} ориентация`,
    az: `${confidence.charAt(0).toUpperCase() + confidence.slice(1)} ${orientation} yanaşması`,
  };
  
  const blueprint = {
    en: `Your answers describe a ${confidence} ${orientation} orientation. You ${ultimate}, draw primarily on ${epistemic}, and identify connections with ${traditions}. This is a description, not an authoritative label.`,
    ru: `Ваши ответы описывают ${confidence} ${orientation} ориентацию. Вы ${ultimate}, опираетесь на ${epistemic} и идентифицируете связи с ${traditions}. Это описание, а не авторитетный ярлык.`,
    az: `Cavablarınız ${confidence} ${orientation} yanaşmasını təsvir edir. Siz ${ultimate}, əsasən ${epistemic} üzərinə dayanırsınız və ${traditions} ilə əlaqələri müəyyən edirsiniz. Bu təsvirdir, авторитетli etiket deyil.`,
  };
  
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