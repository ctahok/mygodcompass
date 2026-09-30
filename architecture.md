# Architecture & Engineering Knowledge Base: The Ontological Compass

> Comprehensive technical design, architectural patterns, historical post-mortems, and developer reference for future AI agents and engineers working on **The Ontological Compass** (`mygodcompass`).

---

## 1. High-Level System Overview & Purpose

The Ontological Compass is a static-exported Next.js 15 web application designed to help users articulate their philosophical and metaphysical concept of God / ultimate reality. Instead of categorizing users by fixed dogma or traditional religious polls, it models human theological thought as an interactive, multi-axis directed acyclic graph (DAG) consisting of 46 nodes.

The application also hosts a distinct secondary sub-application:
- **Primary Engine**: `/[locale]/` -> The interactive philosophical wizard traversal (`WizardEngine`) with real-time SVG decision mapping (`MermaidMap`), coherence analysis, and dynamic ontological profiling.
- **Secondary App**: `/[locale]/quiz/` -> "Who Wants to Become a Muslim?", a 20-question educational multiple-choice quiz grounded in classical Islamic sources.

---

## 2. Directory Structure & Key Artifacts

```text
mygodcompass/
├── public/                     # Static assets, fonts, icons, security policies
├── scripts/                    # Automation, compilation, & diagnostic tools
│   ├── repro/                  # Headless Chrome E2E and CDP diagnostic harnesses
│   │   ├── e2e.mjs             # Chrome DevTools Protocol (CDP) headless test runner
│   │   ├── serve-out.mjs       # Static server for verified Next.js export (`out/`)
│   │   ├── serve.mts           # Test server for isolated Mermaid rendering
│   │   └── repro.html          # Browser testbed for SVG string validation
│   └── generate-mermaid.py     # Script to generate static .mmd tree definitions
├── src/
│   ├── app/                    # Next.js 15 App Router
│   │   ├── [locale]/           # Dynamic localization root (`en`, `ru`, `az`)
│   │   │   ├── page.tsx        # Server component wrapper for root journey
│   │   │   ├── LocaleApp.tsx   # Client hydration layer hosting <WizardEngine />
│   │   │   └── quiz/           # Route hosting the Islamic educational quiz
│   │   ├── globals.css         # Tailwind base styles and light/dark theme CSS vars
│   │   └── layout.tsx          # Root HTML layout with anti-FOUC theme injector
│   ├── components/             # Core interactive UI components
│   │   ├── WizardEngine.tsx    # State coordinator, start screen, journey orchestrator
│   │   ├── QuestionCard.tsx    # Node question presenter, multi-choice, tooltips
│   │   ├── MermaidMap.tsx      # SVG decision graph renderer with zoom/pan/export
│   │   ├── ThemeToggle.tsx     # Theme switcher with local storage persistence
│   │   └── CandidateCard.tsx   # Theological orientation profile synthesis card
│   ├── data/
│   │   ├── ontology.ts         # The 46-node metaphysical DAG graph definitions
│   │   └── termDefinitions.ts  # 130+ term definitions for interactive tooltips
│   ├── lib/
│   │   ├── buildMermaidSource.ts # Extracted pure builder for Mermaid flowchart code
│   │   └── i18n.ts             # Internationalization setup (i18next)
│   └── store/
│       └── wizardStore.ts      # Zustand multi-axis state model with local persistence
└── tests/
    ├── navigation.test.ts      # Vitest suites for graph transitions & candidate scoring
    └── mermaid-source.test.ts  # Vitest suites for Mermaid grammar & character safety
```

---

## 3. Core Architectural Modules

### 3.1 The Metaphysical Graph Model (`src/data/ontology.ts`)
- **Structure**: An explicit directed graph defined as a dictionary of `Node` items indexed by `id`.
- **Properties**: Each node defines:
  - `prompt`: Localized strings (`en`, `ru`, `az`).
  - `choices`: Array of selectable edges. Each choice possesses `id`, localized `label`, tags for scoring (`tags`), and an array of pointer target node IDs (`next`).
- **Nodes**: 46 distinct philosophical inquiry points covering orientation (naturalist vs. spiritual), unity vs. multiplicity, agency, epistemology, and candidate convergence.

### 3.2 State Management (`src/store/wizardStore.ts`)
- **Library**: `zustand` with `persist` middleware (`localStorage`).
- **Core State (`WizardState`)**:
  - `path`: Array of `PathStep` representing historical traversal.
  - `pendingNodes`: Array of branch queues when decisions branch simultaneously.
  - `begun`: Boolean flag indicating if user passed the start screen.
  - `lang`: Current active language (`en` | `ru` | `az`).
- **Key Functions**:
  - `pathNodeIds({ path })`: Computes an array of all node IDs visited in history.
  - `computeCandidateScores(tags)`: Evaluates accumulated tags against candidate traditions (Deism, Pantheism, Monotheism, etc.).
  - `computeCoherence(tags)`: Evaluates philosophical compatibility versus internal contradictions between choices.

### 3.3 The Decision Map Renderer (`src/components/MermaidMap.tsx` & `src/lib/buildMermaidSource.ts`)
- **Pure Generator (`src/lib/buildMermaidSource.ts`)**:
  - Decoupled from React to enable headless CLI testing, Vitest assertions, and server verification.
  - Outputs a Mermaid `flowchart TD` text block.
  - **Pruned View vs. Full View**:
    - *Pruned (Focus)*: Renders only the active path taken plus immediate valid forward branches.
    - *Full DAG*: Renders all 46 nodes and connecting edges across the system.
  - **Label Sanitation (`mmd()`)**:
    - Replaces double quotes `"` with single quotes `'`.
    - Strips/replaces characters that disrupt Mermaid lexing: `;`, `\`, `|` (prevents premature edge truncation), `<`, `>`, `{`, `}`.
    - Normalizes multi-line whitespace.
- **Renderer Component (`src/components/MermaidMap.tsx`)**:
  - Dynamically imports `mermaid` on the client.
  - Generates unique incremental render tokens (`renderIdRef`) to avoid race conditions.
  - Renders inside an isolated host container (`.mermaid-svg-host`).
  - Implements mouse/touch pan, wheel zoom (clamped 0.2x to 3.0x), auto-fit, and HTML5 Canvas-based high-resolution JPG export.

### 3.4 Tooltip Portaling & Positioning (`src/components/QuestionCard.tsx`)
- Philosophical term tooltips are rendered via React `createPortal` directly to `document.body`.
- Eliminates clipping and overflow issues caused by parent card `overflow: hidden` or CSS transform stacking contexts.
- Dynamically calculates viewport boundaries with automatic vertical flipping (above/below) and horizontal clamping.

### 3.5 Light / Dark Theming Architecture
- **Tailwind Strategy**: `darkMode: "class"` in `tailwind.config.ts`.
- **Anti-FOUC (Flash of Unstyled Content)**: An inline script runs synchronously in `src/app/layout.tsx` before document body rendering, checking `localStorage.getItem('theme')` and `window.matchMedia('(prefers-color-scheme: dark)')`.
- **Persistence**: Synchronized via `localStorage.setItem('theme', ...)` within `src/components/ThemeToggle.tsx`.

---

## 4. Post-Mortem & Critical Bugs Fixed (v1.4.1 – v1.4.2)

### Bug 1: The Mermaid False-Positive "Syntax Error"
- **Symptom**: The UI rendered a fallback block reading:
  > *"Diagram rendering. Mermaid encountered a diagram syntax error."*
  Despite all nodes and edges being completely valid.
- **Root Cause**:
  `MermaidMap.tsx` contained a defensive heuristic:
  ```ts
  if (svg.includes("error-text") || svg.includes("Syntax error")) {
    setErrorMessage("Mermaid encountered a diagram syntax error.");
    return;
  }
  ```
  Mermaid's runtime theme styling engine *always* injects internal CSS class declarations into every rendered SVG, regardless of success:
  ```css
  #d .error-icon{fill:#a44141;}#d .error-text{fill:#ddd;stroke:#ddd;}
  ```
  Therefore, `svg.includes("error-text")` evaluated to `true` on 100% of successful diagram renders, discarding valid diagrams (14KB–136KB) and showing the error message.
- **Resolution**:
  - Removed the naive string-matching heuristic.
  - Mermaid errors throw exceptions natively during `mermaid.render()`. Real failures are captured cleanly in the `catch` block and display the true exception message.
  - Implemented an asynchronous render token guard (`if (renderIdRef.current !== runId) return;`) to prevent stale renders from overwriting newer ones.

### Bug 2: Missing Pipe (`|`) Sanitation in Edge Labels
- **Symptom**: Latent risk of syntax truncation in Mermaid edge label definitions.
- **Root Cause**: Mermaid flowchart syntax uses `-->|"label"|` to delimit edge text. A raw pipe character inside the label prematurely terminates the label block and causes parser failure.
- **Resolution**: Added `|` to the replacement regular expression in `mmd()`:
  ```ts
  .replace(/[;\\|]/g, " ")
  ```

### Bug 3: Node / Edge Reference Integrity
- **Protection**: Created automated Vitest suite `tests/mermaid-source.test.ts` executing 30 combinations across languages (`en`, `ru`, `az`), views (`pruned`, `full`), and seeds. Validates:
  - 100% of nodes referenced in edges exist as declared nodes.
  - Absence of unescaped quotes, pipes, and raw line breaks.
  - Graph node completeness (46 nodes in full view).

---

## 5. Verification & Testing Playbook

When developing or modifying features, always run the complete verification chain:

```bash
# 1. Typecheck the entire codebase
npx tsc --noEmit

# 2. Run unit and ontology integrity test suites
npx vitest run

# 3. Verify ESLint rules
npm run lint

# 4. Perform complete static Next.js production export
npm run build
```

### Headless Chrome End-to-End Verification
To verify Mermaid and client-side graph interaction without manual browser clicking:
```bash
# 1. Serve the production output
node scripts/repro/serve-out.mjs

# 2. In a separate terminal, run the Chrome DevTools Protocol driver
node scripts/repro/e2e.mjs
```
The test launches headless Chrome, navigates to the app, simulates clicking the start button, waits for dynamic Mermaid import, and validates that an SVG with valid `.node` and `.edgePath` elements is attached to `.mermaid-svg-host`.

---

## 6. Deployment & Hosting Architecture

### Vercel Configuration
- **Canonical Production Domain**: `https://ontological-compass.vercel.app`
- **Canonical Alias**: `https://mygodcompass.vercel.app`
- **Project Name**: `ontological-compass` (Team: `ijs-projects-3352ddef`)
- **Build Mode**: Static export (`next build` outputs to `out/`).
- **Security Headers (`vercel.json`)**:
  - `Content-Security-Policy`: Disallows unsafe object embeds, protects scripts, and permits inline script execution required for dynamic themes and SVG rendering.
  - `X-Frame-Options: DENY`
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`

### Known Vercel Configuration Notes
1. **Deployment Protection**: If anonymous visitors encounter a Vercel login screen, toggle Deployment Protection off in:
   *Vercel Dashboard -> Project `ontological-compass` -> Settings -> Deployment Protection*.
2. **Git Auto-Deploy**: Connecting automatic builds upon git push requires authorizing the Vercel GitHub App for repository `ctahok/mygodcompass` via:
   ```bash
   npx vercel git connect
   ```
