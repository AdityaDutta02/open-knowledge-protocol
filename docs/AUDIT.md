# OKP Docs — Frontend Audit Report

**Date**: 2026-04-20  
**Scope**: Vite + React SPA (`docs/`) — `DocsPage.tsx`, `HomePage.tsx`, `homepage.css`, `index.css`  
**Standard**: WCAG 2.1 AA, frontend-design anti-pattern checklist

---

## Anti-Patterns Verdict

**FAIL — partially AI-generated look.**

Specific tells:
- **Inter font** throughout — the most overused "developer tool" font of 2023–2025
- **Hero metric layout** in the stats card (big number + small label + supporting stats) — textbook AI slop template
- **Centered hero** — left-aligned asymmetric layouts feel more designed; centering everything is a default, not a decision
- **Elastic/bounce easing** on `popIn` animation (`cubic-bezier(0.34, 1.56, 0.64, 1)`) — feels dated

The Playfair Display pairing, the warm orange/cream palette, and the editorial typography are genuinely distinctive and save this from a full fail.

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High     | 6 |
| Medium   | 7 |
| Low      | 5 |
| **Total**| **21** |

**Top 3 critical issues:**
1. Mobile navigation entirely absent — sidebar hidden with no replacement
2. `window.scrollTo(0, 0)` is a no-op — `.docs-body { overflow: hidden }` means the window never scrolls
3. Zero `:focus-visible` styles — keyboard navigation is completely invisible

**Overall score: 5.5 / 10**  
Strong aesthetic foundation undermined by functional regressions on mobile and keyboard navigation.

---

## Critical Issues

### C-1 — Mobile Navigation Absent
- **Location**: `index.css` — `@media (max-width: 768px) { .docs-sidebar { display: none; } }`
- **Category**: Responsive / Accessibility
- **Description**: The sidebar is hidden on mobile with no hamburger menu, drawer, or any replacement navigation.
- **Impact**: Mobile users cannot navigate between any docs pages. The entire docs site is non-functional on phones.
- **WCAG**: 1.3.4 Orientation, 2.4.1 Bypass Blocks
- **Fix**: Add a mobile nav drawer triggered by a hamburger button in `.docs-header`. At minimum, render a `<select>` with all nav links as a temporary solution.
- **Suggested command**: `/adapt`

---

### C-2 — `window.scrollTo(0, 0)` Is a No-Op
- **Location**: `DocsPage.tsx:253` — scroll-to-top `useEffect`
- **Category**: Functionality
- **Description**: `.docs-body` has `overflow: hidden` in `index.css:81`, which means `.docs-main` handles its own scroll internally. `window.scrollTo` operates on the window/document scroll container, which never moves. Navigating between docs pages does NOT scroll to top.
- **Impact**: Users land mid-page when clicking sidebar links. Reading flow broken entirely.
- **Fix**: Either remove `overflow: hidden` from `.docs-body` (preferred), or change scroll target to `contentRef.current?.scrollTo(0, 0)`.
- **Suggested command**: `/harden`

---

### C-3 — No Focus Styles
- **Location**: `index.css`, `homepage.css` — no `:focus-visible` rules anywhere
- **Category**: Accessibility
- **Description**: All interactive elements (links, sidebar items, TOC items) have zero visible focus indicator. The browser default is suppressed by `* { margin: 0; padding: 0 }` resets interacting with some browsers.
- **Impact**: Keyboard-only users and screen reader users cannot see where focus is. WCAG A violation.
- **WCAG**: 2.4.7 Focus Visible (AA), 2.4.11 Focus Appearance (AAA)
- **Fix**: Add globally: `:focus-visible { outline: 2px solid #e46b39; outline-offset: 2px; border-radius: 2px; }`
- **Suggested command**: `/harden`

---

## High-Severity Issues

### H-1 — Inter Font Anti-Pattern
- **Location**: `index.html:11` — Google Fonts import; `index.css:13` — `font-family: 'Inter'`
- **Category**: Anti-Pattern / Design
- **Description**: Inter is listed explicitly in the frontend-design skill DON'T list as an overused font.
- **Impact**: Contributes to the generic "developer tool" aesthetic. Undermines the editorial distinctiveness of the Playfair Display + warm palette direction.
- **Fix**: Replace Inter with a less ubiquitous grotesque — DM Sans, Plus Jakarta Sans, Outfit, or Instrument Sans would all harmonize with Playfair Display better.
- **Suggested command**: `/typeset`

---

### H-2 — `filter: blur()` in Keyframe Animation
- **Location**: `homepage.css` — `revealUp` keyframe: `filter: blur(8px)` → `filter: blur(0)`
- **Category**: Performance
- **Description**: `filter: blur()` triggers GPU compositing on every frame and forces layout recalculation in some browsers. It's significantly more expensive than animating `opacity` + `transform` alone.
- **Impact**: On lower-end devices, the homepage hero section will stutter. Battery drain on mobile.
- **Fix**: Remove `filter: blur()` from `revealUp`. The `opacity: 0 → 1` + `translateY` transition already gives a clean reveal without the blur cost.
- **Suggested command**: `/optimize`

---

### H-3 — `<a href>` Instead of `<Link>` in HomePage Nav
- **Location**: `HomePage.tsx` — nav links using `<a href="/why-okp">`, `<a href="/spec/v0">`
- **Category**: Functionality / Performance
- **Description**: Hard `<a href>` links cause full-page reloads in the SPA. React Router's `<Link>` performs client-side navigation with zero reload. This defeats the entire purpose of using React Router.
- **Impact**: Each nav click reloads all JS, CSS, and fonts. Perceived performance is significantly worse. Browser history behaves unexpectedly.
- **Fix**: `import { Link } from 'react-router-dom'` and replace `<a href="...">` with `<Link to="...">` in the nav.
- **Suggested command**: `/harden`

---

### H-4 — White Text on Lavender — Contrast Failure
- **Location**: `HomePage.tsx` — stats card: white numbers (`#ffffff`) on `#a7a7f5` (lavender)
- **Category**: Accessibility
- **Description**: Contrast ratio of white on `#a7a7f5` is approximately 2.4:1 — far below the 4.5:1 minimum for normal text (WCAG AA).
- **Impact**: Users with low vision or in bright sunlight cannot read the stats ("5 Packages", "3 Tiers", "v0 Spec").
- **WCAG**: 1.4.3 Contrast (Minimum) — Level AA
- **Fix**: Darken the lavender to at least `#6060c8` for white text, or use dark text (`#2a2060`) on the lighter lavender.
- **Suggested command**: `/colorize`

---

### H-5 — Static `<title>` — WCAG 2.4.2 Violation
- **Location**: `index.html:6` — `<title>Open Knowledge Protocol</title>` never updated
- **Category**: Accessibility
- **Description**: In the SPA, `document.title` is never changed on navigation. Every page — homepage, why-okp, spec/v0 — reports the same title to screen readers and browser tabs.
- **Impact**: Screen reader users cannot distinguish pages from tab titles alone. Also hurts SEO on deployed versions.
- **WCAG**: 2.4.2 Page Titled — Level A
- **Fix**: In `DocsPage.tsx`, add a `useEffect` that sets `document.title = \`${pageTitle} — OKP\`` whenever `content` changes.
- **Suggested command**: `/harden`

---

### H-6 — Hero Metric Layout Anti-Pattern (Stats Card)
- **Location**: `HomePage.tsx` — stats card section
- **Category**: Anti-Pattern / Design
- **Description**: Big numbers (5, 3, v0) + small labels below + supporting context = the exact "hero metric layout" called out as AI slop in the frontend-design skill DON'T list.
- **Impact**: Makes the homepage look templated and generic despite the otherwise distinctive design.
- **Fix**: Replace the grid of isolated numbers with a more editorial treatment — a sentence, a comparison, or a table that communicates the same facts with more personality.
- **Suggested command**: `/bolder`

---

## Medium-Severity Issues

### M-1 — `background-position` Animation
- **Location**: `homepage.css` — `gridDrift` keyframe animates `background-position`
- **Category**: Performance
- **Description**: `background-position` changes trigger paint (not just composite) on most browsers. The frontend-design skill explicitly prohibits animating layout properties.
- **Impact**: Subtle continuous jank on the hero grid background, especially on integrated graphics.
- **Fix**: Animate a pseudo-element's `transform: translate()` instead, which composites on the GPU.
- **Suggested command**: `/optimize`

---

### M-2 — Dead CSS: `dotPulse` and `.anim-dot-*`
- **Location**: `homepage.css` — `@keyframes dotPulse`, `.anim-dot-1` through `.anim-dot-4`
- **Category**: Code Quality
- **Description**: The ConceptDNA carousel dots were removed from the JSX but the CSS animations remain.
- **Impact**: Dead code adds bundle weight and maintenance confusion. Anyone reading the CSS will wonder where the dots are.
- **Fix**: Delete `@keyframes dotPulse` and all `.anim-dot-*` rules.
- **Suggested command**: `/distill`

---

### M-3 — Elastic/Bounce Easing on `popIn`
- **Location**: `homepage.css` — `popIn`: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- **Category**: Anti-Pattern / Motion
- **Description**: The frontend-design skill explicitly prohibits bounce/elastic easing: "they feel dated and tacky; real objects decelerate smoothly."
- **Impact**: The card entrance animation undermines the refined editorial tone.
- **Fix**: Replace with exponential ease-out: `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out-expo).
- **Suggested command**: `/animate`

---

### M-4 — No CSS Custom Properties
- **Location**: `index.css`, `homepage.css` — colors and spacing hardcoded throughout
- **Category**: Maintainability / Theming
- **Description**: Colors like `#e46b39`, `#1c1e21`, `#f5f0eb`, `#e8e3de` appear in dozens of rules across both stylesheets with no central source of truth.
- **Impact**: Changing the brand color requires a global find-and-replace across hundreds of lines. Dark mode is impossible to add. Design system drift guaranteed over time.
- **Fix**: Extract to `:root { --color-ink: #1c1e21; --color-accent: #e46b39; --color-surface: #fafaf8; ... }`.
- **Suggested command**: `/normalize`

---

### M-5 — TOC Heading ID Mismatch
- **Location**: `DocsPage.tsx:66-78` (`extractToc`) vs `DocsPage.tsx:91-93` (`makeComponents` h1/h2/h3)
- **Category**: Functionality / Bug
- **Description**: `extractToc` runs regex on raw markdown text. `makeComponents` calls `slugify(String(children))` on React node children. When headings contain inline code (e.g., `## The \`okp\` field`), `String(children)` produces `"The ,okp, field"` (comma-joined array), while the regex sees the raw `## The \`okp\` field` text. IDs won't match; TOC links will 404 in-page.
- **Impact**: TOC is non-functional for any heading containing inline code, bold, or links.
- **Fix**: Use `rehype-slug` to generate heading IDs, and parse the same rendered HTML for the TOC. Or write a recursive React children text extractor.
- **Suggested command**: `/harden`

---

### M-6 — Centered Hero Layout
- **Location**: `homepage.css` — hero section `text-align: center`
- **Category**: Anti-Pattern / Design
- **Description**: The frontend-design skill DON'T list: "Center everything — left-aligned text with asymmetric layouts feels more designed."
- **Impact**: Centering is the path of least resistance, not a deliberate design decision here.
- **Fix**: Consider a left-aligned hero with the title running to the left and supplementary text offset to the right.
- **Suggested command**: `/arrange`

---

### M-7 — Missing Skip Navigation Link
- **Location**: `DocsPage.tsx` — no skip link before header
- **Category**: Accessibility
- **Description**: No "Skip to main content" link at the top of the docs page. Screen reader and keyboard users must tab through the entire header and sidebar before reaching article content.
- **WCAG**: 2.4.1 Bypass Blocks — Level A
- **Fix**: Add `<a href="#main-content" class="skip-link">Skip to main content</a>` as the first child of `.docs-root`, with matching `id="main-content"` on `<main>`. Style it visually hidden until focused.
- **Suggested command**: `/harden`

---

## Low-Severity Issues

### L-1 — `will-change: background-position` No-Op
- **Location**: `homepage.css` — hero grid element
- **Description**: `will-change` on `background-position` provides no GPU promotion benefit (only `transform` and `opacity` promote to compositor layers). Wastes memory without benefit.
- **Fix**: Remove or change to `will-change: transform` if the grid element uses transforms.

---

### L-2 — Render-Blocking Google Fonts
- **Location**: `index.html:8-12` — synchronous font `<link>` tags
- **Description**: Google Fonts are loaded synchronously in `<head>`. Until fonts load, text rendering is blocked.
- **Fix**: Add `font-display: optional` or `font-display: swap` via the `&display=swap` parameter (already present but applies per-family). Consider self-hosting fonts via `fontsource` npm packages for full control.

---

### L-3 — Heading Hierarchy Skips H1 on HomePage
- **Location**: `HomePage.tsx` — hero section uses `<h2>` elements; no `<h1>` on the page
- **Description**: The page has no `<h1>`. Screen readers announce the page heading hierarchy from h1 down.
- **WCAG**: 1.3.1 Info and Relationships
- **Fix**: The main hero title should be an `<h1>`.

---

### L-4 — Cards Not Keyboard-Activatable
- **Location**: `HomePage.tsx` — cards use `<div onClick>` or `<a>` wrappers inconsistently
- **Description**: Cards that navigate to other routes should be `<Link>` components wrapping the entire card, not `<div>` elements with click handlers or nested `<a>` tags.
- **Fix**: Wrap each card in a `<Link to="...">` or ensure the CTA button inside is the only interactive element.

---

### L-5 — `.docs-body { overflow: hidden }` Code Smell
- **Location**: `index.css:81`
- **Description**: `overflow: hidden` on the body container is the root cause of C-2 and likely masks other layout bugs. It's an unusual pattern for a docs layout.
- **Fix**: Remove it. Sidebar and TOC are `position: sticky` and don't need the parent to clip overflow.

---

## Patterns & Systemic Issues

1. **Hard-coded colors in 40+ rules** across `index.css` and `homepage.css` — no design tokens at all (M-4)
2. **Zero accessibility infrastructure** — no focus styles anywhere, no skip link, no ARIA landmarks, no `<h1>` (C-3, M-7, L-3)
3. **SPA navigation not fully adopted** — `<a href>` still used in several places that should use `<Link>` (H-3)
4. **Performance-hostile animations** — two separate keyframes (`revealUp`, `gridDrift`) animate non-compositable properties (H-2, M-1)

---

## Positive Findings

- **Excellent markdown architecture**: `import.meta.glob` with `?raw` is the correct Vite pattern for this use case. Lazy-loaded per-file chunks are production-ready.
- **TOC scroll-spy**: `IntersectionObserver` with `rootMargin: '-10% 0px -80% 0px'` is a well-calibrated implementation.
- **Warm editorial palette**: The `#e46b39` orange + `#1c1e21` near-black + `#f5f0eb` cream combination is genuinely distinctive and non-AI-default.
- **Playfair Display**: A strong, confident choice for headings that pairs beautifully with the warm colors.
- **Frontmatter stripping**: `stripFrontmatter()` is clean and handles edge cases correctly.
- **Responsive card layout**: `flex: 1; min-width: 0; max-width: 520px` is the correct CSS pattern — avoids the fixed-width overflow bug from the prior implementation.
- **Framework choice**: Vite + React SPA was the right call. Zero SSR/hydration complexity. All Astro crashes were structural, not fixable.

---

## Recommendations by Priority

### Immediate (Blockers)

1. **Fix mobile navigation** (C-1) — add a hamburger drawer or at minimum a `<select>` fallback
2. **Fix scroll-to-top** (C-2) — remove `overflow: hidden` from `.docs-body` OR change `window.scrollTo` to `contentRef.current?.scrollTo`
3. **Add focus styles** (C-3) — one `:focus-visible` rule, globally applied
4. **Fix `<a href>` → `<Link>`** (H-3) — two-minute change with major UX impact
5. **Fix lavender contrast** (H-4) — darken the stats card lavender

### Short-Term (This Sprint)

6. **Update `document.title` on navigation** (H-5)
7. **Fix TOC heading ID mismatch** (M-5) — use `rehype-slug` or recursive text extractor
8. **Add skip navigation link** (M-7)
9. **Replace `filter: blur()` with opacity-only reveal** (H-2)
10. **Delete dead `dotPulse` CSS** (M-2)
11. **Fix `popIn` easing** (M-3)

### Medium-Term (Next Sprint)

12. **Extract CSS custom properties** (M-4) — enables dark mode, theming, design system
13. **Replace Inter** (H-1) — DM Sans or Plus Jakarta Sans
14. **Rethink stats card layout** (H-6) — move away from hero metric anti-pattern
15. **Self-host fonts** (L-2) — eliminate render-blocking Google Fonts request

### Long-Term (Nice to Have)

16. **Left-align hero** (M-6)
17. **Add `<h1>` to HomePage** (L-3)
18. **`will-change` cleanup** (L-1)
19. **Fix card link structure** (L-4)

---

## Suggested Commands

| Issue | Command |
|-------|---------|
| C-1 Mobile nav, C-2 scroll, C-3 focus, H-3 links, H-5 title, M-5 TOC IDs, M-7 skip link | `/harden` |
| H-2 blur animation, M-1 background-position, L-1 will-change | `/optimize` |
| H-4 lavender contrast | `/colorize` |
| H-1 Inter font, L-2 render-blocking fonts | `/typeset` |
| M-2 dead CSS, M-4 CSS tokens | `/normalize` |
| M-3 elastic easing | `/animate` |
| H-6 stats card, M-6 centered hero | `/bolder` |
| M-6 hero layout, L-4 card structure | `/arrange` |
