# The Ontological Compass

> A gamified journey to define your exact concept of God and ultimate reality — mapped through the history of philosophy and theology.

The Ontological Compass is a trilingual (English, Russian, Azerbaijani) interactive Next.js application that helps users articulate and explore their metaphysical convictions without imposing dogmatic labels.

---

## What the App Does

Rather than forcing users into rigid religious boxes, **The Ontological Compass** traverses an interactive 46-node graph exploring foundational questions of existence, unity, agency, knowledge, and belonging:

1. **Orientation Framework**: Identifies your starting point — non-religious, naturalistic, philosophical, or spiritual.
2. **Core Metaphysics & Reality**: Evaluates views on unity versus multiplicity (monotheism, polytheism, henotheism, non-duality, pantheism, deism).
3. **Agency & Relationship**: Discovers whether you perceive ultimate reality as personal, impersonal, transpersonal, or beyond human language.
4. **Epistemic Sources**: Pinpoints how truth is known for you — scripture, reason, mystical experience, ancestral tradition, or practice.
5. **Candidate Pathways**: Computes weighted compatibility scores against world traditions (Christianity, Islam, Judaism, Sikhism, Baháʼí, Hindu paths, Buddhism, Deism, Pantheism, Contemporary Paganism, Secular Humanism, Daoism, etc.).
6. **The Blueprint**: Generates a shareable, comprehensive synthesis profile of your philosophical orientation.

### Sub-Applications

- **"Who Wants to Become a Muslim?" Quiz** (`/{locale}/quiz`): A 20-question educational multiple-choice quiz grounded in classical Islamic sources (Sahih al-Bukhari, Sahih Muslim, Tabari, Ibn Kathir).

---

## Key Features

- **Multi-Axis Graph Model**: 46 interconnected nodes with single, multiple, free-text, and scale input modes. Includes universal escape hatches (*Unsure*, *Not how I frame it*, *More than one*).
- **Dynamic Theogony Decision Map**: Built with Mermaid.js featuring interactive pan, zoom, focus vs. full DAG toggle, and high-resolution JPG export.
- **Interactive Term Glossary**: Clickable `i` pop-ups on question concepts and response options, linking to authoritative definitions (Stanford Encyclopedia of Philosophy, Wikipedia).
- **Light & Dark Theme Switcher**: Full-site dark/light theme support with persisted preference and system match.
- **Trilingual (EN / RU / AZ)**: Built using `i18next` with automatic browser language detection and localized URLs (`/en`, `/ru`, `/az`).
- **Coherence Tracking & Companion**: Emotional progress indicator reacting to consistent versus conflicting philosophical premises.

---

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Static Export `output: "export"`)
- **UI Library**: React 18, [Tailwind CSS 3](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/)
- **Visualizations**: [Mermaid.js](https://mermaid.js.org/) & [React Flow](https://reactflow.dev/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) with `localStorage` persistence
- **Localization**: `i18next`, `react-i18next`, `i18next-browser-languagedetector`
- **Testing**: [Vitest](https://vitest.dev/)

---

## Project Structure

```text
mygodcompass/
├── public/                 # Static assets, quiz question data, security.txt
├── scripts/                # Mermaid generation & validation tooling
├── src/
│   ├── app/                # Next.js App Router (layout, globals, [locale])
│   ├── components/         # UI components (Wizard, QuestionCard, MermaidMap, etc.)
│   ├── data/
│   │   ├── ontology.ts     # 46-node graph schema & relationship definitions
│   │   └── termDefinitions.ts # 130+ philosophical term definitions
│   ├── lib/                # i18n configuration and tree layout algorithms
│   └── store/              # Zustand wizard state & profile scoring logic
└── tests/                  # Navigation & ontology integrity test suites
```

---

## Getting Started

### Prerequisites

- **Node.js**: v18+ (verified with v24)
- **npm** v11+ (verified with 11.19.1)

### Installation & Development

```bash
# Install dependencies
npm install

# Run the local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The app will automatically redirect to your preferred locale (e.g. `/en`).

### Testing & Verification

```bash
# Run unit tests
npx vitest run

# Lint check
npm run lint

# Static export build
npm run build
```

---

## Deployment

The application is configured as a static export (`output: "export"` in `next.config.mjs`) compatible with:
- **Vercel** (`vercel.json` provides strict Content Security Policy, X-Frame-Options, and security headers).
- **GitHub Pages** (supports `NEXT_PUBLIC_BASE_PATH`).

---

## Documentation

- **[PRD.md](./PRD.md)** — Product Requirements Document: functional/non-functional requirements, acceptance criteria for the current release.
- **[english_translations.md](./english_translations.md)** — English copy review notes.
- **[AZ_translation_review.md](./AZ_translation_review.md)** — Azerbaijani translation review notes.

**Theme behavior:** the Light/Dark preference is stored under the `localStorage` key `theme` (`dark` | `light`), applied as a `dark`/`light` class on `<html>` before hydration to avoid a flash of the wrong theme, and defaults to `prefers-color-scheme` on first visit.

---

## Contact & Credits

- **Author / Maintenance**: [www.klaud.uk](https://www.klaud.uk)
- **Contact**: `ij@klaud.uk`
- *Built with philosophical rigor, not dogma.*
