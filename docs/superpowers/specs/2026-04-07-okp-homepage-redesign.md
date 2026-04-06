# OKP Homepage Redesign

**Goal:** Replace the default Starlight landing page with a custom, fly.io-inspired homepage using Framer Motion micro-animations.

**Architecture:** Custom `src/pages/index.astro` page that bypasses Starlight chrome entirely. React islands (`client:load`) power all animated elements via Framer Motion. Starlight continues to handle all inner doc pages unchanged.

**Tech Stack:** Astro 4, `@astrojs/react`, Framer Motion, Inter + Newsreader (Google Fonts), Geist Mono (code), Tailwind via inline styles or scoped CSS

---

## Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#191034` | Page background |
| `--bg-card` | `#22183c` | Card surfaces |
| `--bg-mid` | `#4c4e67` | Dividers, secondary surfaces |
| `--text` | `#ffffff` | Primary text |
| `--text-muted` | `#9698b6` | Secondary text, nav labels |
| `--accent` | `#702cdd` | Links, active states |
| `--border` | `rgba(91,33,182,0.125)` | Card and button borders |
| `--shadow` | `rgba(91,33,182,0.075)` | Box shadows |

---

## Typography

- **Hero headline** — `Newsreader` (Google Fonts serif, open-source Mackinac substitute), weight 500, letter-spacing `-0.45px`, 48px desktop / 32px mobile
- **Body / nav / UI** — `Inter` (Google Fonts), weight 325–500, line-height 1.6
- **Code** — `Geist Mono` (already in monorepo via Next.js font, loaded via CSS `@font-face` or CDN)
- **Section labels** — Inter 13px, weight 500, uppercase, `--text-muted`, letter-spacing 0.08em

---

## Page Structure

The page is a single `src/pages/index.astro` file. It renders its own `<html>` — no Starlight layout wrapping it.

### 1. Nav

Full-width bar, `position: sticky top-0`, backdrop-blur.

- Left: OKP wordmark (text, not image) in Newsreader italic
- Center: `Why OKP · Quickstart · Spec` links in Inter 14.5px
- Right: `GitHub →` external link

### 2. Hero

Centered, `max-width: 680px`, `padding: 120px 24px 80px`.

**Headline (two lines):**
```
The web knows things.
AI agents can't read it yet.
```
Newsreader serif, 48px, weight 500, tight tracking.

**Body (one paragraph):**
```
OKP is an open standard that structures your content into a graph
AI agents can query, traverse, and reason about — without scraping,
hallucinating, or guessing.
```
Inter 18px, `--text-muted`, line-height 1.7.

**CTAs (two buttons, inline):**
- Primary: `Read the spec →` — filled `#702cdd` bg, white text
- Secondary: `Get started in 15 min →` — transparent bg, `--border` border

### 3. Code Block

Dark card (`#0d0920`, border `--border`, border-radius 10px) centered with max-width 680px.

Shows a real ConceptDNA JSON-LD block:
```html
<script type="application/ld+json">
{
  "@context": "https://okp.theadityadutta.com/schema/v0#",
  "@type": "ConceptDNA",
  "conceptId": "transformer-attention",
  "title": "How Transformer Attention Works",
  "summary": "Self-attention allows tokens to attend to all other tokens…",
  "keyTerms": ["attention", "softmax", "query", "key", "value"],
  "enables": ["fine-tuning", "rag-retrieval"],
  "confidence": "current",
  "temporalValidity": { "publishedAt": "2024-01-15" }
}
</script>
```

Syntax highlighted with Shiki (Astro built-in). File tab label: `_layout.astro`.

### 4. Cards Grid

2×2 grid, `gap: 24px`, `max-width: 800px`, centered.

| Card | Title | Body | Link |
|---|---|---|---|
| 1 | Why OKP | "The web has always had structure. HTML, links, metadata. AI agents still can't navigate it." | `/why-okp` |
| 2 | Quickstart | "Add OKP to a Next.js + Sanity site in about 15 minutes. No infrastructure required." | `/quickstart/nextjs-sanity` |
| 3 | Packages | "Five npm packages. Install what you need — schema, MCP server, validator, devtools, llms.txt." | `/packages/schema` |
| 4 | Spec v0 | "The protocol RFC. ConceptDNA schema, graph semantics, compliance tiers, and extension points." | `/spec/v0` |

Each card: `--bg-card` bg, `--border` border, 8px radius, 24px padding, hover lifts `y: -3px`.

### 5. Footer

Single line. `border-top: 1px solid --border`, padding 24px.

```
OKP is open source. MIT license.    [GitHub →]
```

---

## Framer Motion Animation Spec

All animations are in React components mounted with `client:load`.

| Component | Trigger | Animation |
|---|---|---|
| `<NavBar>` | mount | `y: -20 → 0`, opacity `0 → 1`, duration 0.4s |
| `<HeroHeadline>` | mount | Each line: stagger 80ms, `y: 30 → 0`, opacity `0 → 1` |
| `<HeroBody>` | mount | Fade in, delay 0.35s after first line |
| `<HeroCTAs>` | mount | `scale: 0.95 → 1` + fade, delay 0.5s |
| `<CodeBlock>` | `whileInView` | `y: 20 → 0` + opacity, once |
| `<CardGrid>` | `whileInView` | Stagger 60ms, `y: 24 → 0` + opacity, once |
| Card hover | hover | `y: -3`, shadow deepens |
| Primary CTA hover | hover | `scale: 1.02` |
| Primary CTA tap | tap | `scale: 0.97` |

Spring config for hover/tap: `{ stiffness: 400, damping: 30 }`.

---

## Files to Create / Modify

| Action | File |
|---|---|
| Create | `docs/src/pages/index.astro` |
| Create | `docs/src/components/HomePage.tsx` (single React island containing all animated sections) |
| Modify | `docs/astro.config.mjs` — add `@astrojs/react` integration |
| Modify | `docs/package.json` — add `@astrojs/react`, `react`, `react-dom`, `framer-motion` |
| Modify | `docs/src/styles/custom.css` — add font imports, CSS tokens |
| Delete/redirect | `docs/src/content/docs/index.mdx` → keep but add `template: splash` override or simply let `pages/index.astro` take priority |

> Note: In Astro, `src/pages/index.astro` takes priority over `src/content/docs/index.mdx` for the `/` route when using Starlight, so no redirect logic is needed.

---

## Copy Voice Guidelines

Write like a senior engineer talking to another senior engineer. Earn every sentence.

- No "revolutionary", "next-generation", "seamless", "powerful"
- Dry specificity over vague enthusiasm
- Present tense, active voice
- OK to be short. A 12-word sentence is better than a 30-word one that says the same thing.
