# PRD — The Ontological Compass

**Product:** Ontological Compass (`ontological-compass`)
**Version:** 1.4.1
**Status:** Approved for implementation
**Last updated:** 2026-09-30

---

## 1. Overview

The Ontological Compass is a trilingual (EN / RU / AZ), gamified web application that helps users articulate their concept of God and ultimate reality by traversing an interactive 46-node ontology graph. It replaces rigid religious labels with weighted, transparent compatibility scoring across philosophical and spiritual traditions.

The app is a static Next.js 15 application (`output: "export"`) deployable to Vercel or GitHub Pages with no backend.

---

## 2. Goals

| # | Goal | Success signal |
|---|------|----------------|
| G1 | Let a user define their metaphysical position without dogmatic framing | User completes all 6 wizard sections |
| G2 | Make the reasoning transparent | Every score traces back to answered nodes |
| G3 | Be usable in EN, RU, and AZ | Full parity of copy across all 3 locales |
| G4 | Be visually usable day or night | Persistent, instant Light/Dark theme switch |
| G5 | Explain terminology in context | One-click `i` pop-ups for terms and options |
| G6 | Visualize the decision path | Mermaid Theogony Decision Map always renders |

---

## 3. Personas

- **Seeker** — exploring belief systems, wants non-judgmental self-description.
- **Student** — comparing traditions for study; needs the full DAG view and sources.
- **Educator** — uses the quiz sub-app (`/{locale}/quiz`) for teaching basics of Islam.

---

## 4. Functional Requirements

### FR-1: Wizard Navigation (6 sections)
- **FR-1.1** Sections: Orientation, Core Metaphysics, Agency & Relationship, Epistemic Sources, Candidate Pathways, Blueprint.
- **FR-1.2** Input modes: single choice, multiple choice, free text, 1–5 scale.
- **FR-1.3** Universal escape hatches on every question: *Unsure*, *Not how I frame it*, *More than one*.
- **FR-1.4** Progress and answers persisted across reloads (`localStorage` via Zustand).

### FR-2: Theogony Decision Map (Mermaid)
- **FR-2.1** The map **must** render visibly on the results/wizard view; failures must show an error message with a Retry action — never a blank panel.
- **FR-2.2** Two view modes: **Focus View** (active path + immediate next steps) and **Full Diagram** (all 46 nodes), toggled by the user.
- **FR-2.3** Sanitization of node/edge labels must not corrupt text (quotes, semicolons, parentheses must survive).
- **FR-2.4** Controls: pan (drag), zoom in/out, reset (1:1), fit-to-screen, fullscreen (ESC to exit), JPG export at 2× scale.
- **FR-2.5** Active path node highlighted amber; visited nodes styled distinctly from unvisited.
- **FR-2.6** Diagram re-renders when language or theme changes.

### FR-3: Theme System (Light / Dark)
- **FR-3.1** A persistent toggle switches the **entire** site between Light and Dark — no surfaces, cards, borders, or text may remain in the opposite theme.
- **FR-3.2** Preference persists across reloads (`localStorage` key `theme`).
- **FR-3.3** First visit honors `prefers-color-scheme`; no flash of wrong theme (FOUC) on load.
- **FR-3.4** Tailwind operates in `darkMode: "class"` mode driven by the `dark`/`light` class on `<html>`.
- **FR-3.5** `meta[name="theme-color"]` updates with the theme.

### FR-4: Term Info Pop-ups (`i` buttons)
- **FR-4.1** Clicking an `i` button opens an informational pop-up anchored to that button, fully inside the viewport (flips above/below as needed).
- **FR-4.2** Only **one** pop-up may be open at a time — clicking another `i` closes the previous one.
- **FR-4.3** Pop-ups must render above all other content (no clipping by card overflow) — portaled to `document.body`.
- **FR-4.4** Pop-up stays anchored on scroll and resize, and closes appropriately when its context unmounts.

### FR-5: Localization
- **FR-5.1** Locales: `en`, `ru`, `az` with localized routes (`/{locale}`).
- **FR-5.2** Browser language detection on first visit; user switchable thereafter.
- **FR-5.3** All user-facing copy, including map labels and term definitions, localized.

### FR-6: Quiz Sub-app
- **FR-6.1** 20-question multiple-choice quiz at `/{locale}/quiz` sourced from `public/quiz-questions` data.
- **FR-6.2** Answers cite classical Islamic sources (Bukhari, Muslim, Tabari, Ibn Kathir).

### FR-7: Blueprint Output
- **FR-7.1** Generate a shareable synthesis profile with weighted candidate scores.

---

## 5. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| NFR-1 | Static export only — no server runtime, no API calls required at runtime |
| NFR-2 | Lighthouse performance ≥ 90 on mobile for the landing route |
| NFR-3 | Theme and locale changes apply without full page reload |
| NFR-4 | No hydration mismatches (`suppressHydrationWarning` where theme class is injected) |
| NFR-5 | `npm run lint` → 0 errors; `npx vitest run` → all tests pass; `npm run build` → exit 0 |
| NFR-6 | Strict security headers via `vercel.json` CSP |

---

## 6. Out of Scope (v1.4.x)

- User accounts / server-side persistence
- Additional locales beyond EN/RU/AZ
- Native mobile applications
- Content authoring CMS

---

## 7. Acceptance Criteria for v1.4.1 Release

- [ ] `npm run lint` passes with 0 errors/warnings
- [ ] `npx vitest run` passes (9/9 navigation tests)
- [ ] `npm run build` completes static export
- [ ] Map panel visibly renders in both Focus and Full modes in EN/RU/AZ
- [ ] Theme toggle flips all surfaces; preference survives reload; no FOUC
- [ ] `i` pop-ups open adjacent to their button, single-instance, viewport-clamped
- [ ] README reflects actual app behavior and scripts
- [ ] Production deployment live on Vercel
