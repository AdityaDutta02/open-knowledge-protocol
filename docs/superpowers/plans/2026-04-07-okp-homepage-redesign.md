# OKP Homepage Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic Starlight landing page with a fly.io-inspired custom homepage — deep purple palette, Newsreader serif headings, animated with Framer Motion.

**Architecture:** Custom `src/pages/index.astro` bypasses Starlight chrome entirely. A single React island (`HomePage.tsx`) contains all sections with Framer Motion animations. Starlight continues to serve all inner doc pages unchanged. Google Fonts (Newsreader + Inter) loaded in the Astro page `<head>`.

**Tech Stack:** Astro 4, `@astrojs/react`, React 18, `framer-motion`, Google Fonts CDN (Newsreader, Inter), inline styles (no Tailwind dependency in the custom page)

---

## File Map

| Action | File | Purpose |
|---|---|---|
| Create | `docs/src/pages/index.astro` | Custom homepage shell — owns `<html>`, loads fonts, mounts React island |
| Create | `docs/src/components/HomePage.tsx` | Single React island with all animated sections (NavBar, Hero, CodeSnippet, Cards, Footer) |
| Modify | `docs/astro.config.mjs` | Add `@astrojs/react` integration |
| Modify | `docs/package.json` | Add `@astrojs/react`, `react`, `react-dom`, `framer-motion` |

`src/content/docs/index.mdx` is **not deleted** — Astro's `src/pages/index.astro` takes routing priority over Starlight content pages at `/`, so the old file becomes unreachable at `/` but harmlessly remains for reference.

---

### Task 1: Install dependencies

**Files:**
- Modify: `docs/package.json`
- Modify: `docs/astro.config.mjs`

- [ ] **Step 1: Add packages**

```bash
cd docs
pnpm add @astrojs/react react react-dom framer-motion
pnpm add -D @types/react @types/react-dom
```

- [ ] **Step 2: Verify install succeeded**

```bash
pnpm list @astrojs/react framer-motion react
```

Expected output: all three packages listed with versions, no errors.

- [ ] **Step 3: Add React integration to astro.config.mjs**

Replace the full file contents:

```js
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://okp.theadityadutta.com',
  integrations: [
    react(),
    starlight({
      title: 'Open Knowledge Protocol',
      description: 'Open standard for structuring web content as a queryable knowledge source for AI agents.',
      social: {
        github: 'https://github.com/AdityaDutta02/open-knowledge-protocol',
      },
      sidebar: [
        { label: 'Why OKP', link: '/why-okp' },
        {
          label: 'Quickstart',
          items: [
            { label: 'Next.js + Sanity', link: '/quickstart/nextjs-sanity' },
            { label: 'Next.js + Contentful', link: '/quickstart/nextjs-contentful' },
            { label: 'Astro + Markdown', link: '/quickstart/astro-md' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { label: '@okp/schema', link: '/packages/schema' },
            { label: '@okp/mcp-server', link: '/packages/mcp-server' },
            { label: '@okp/llms-txt', link: '/packages/llms-txt' },
            { label: '@okp/devtools', link: '/packages/devtools' },
            { label: '@okp/validate', link: '/packages/validate' },
          ],
        },
        { label: 'Spec (v0)', link: '/spec/v0' },
        { label: 'Showcase', link: '/showcase' },
        { label: 'Paper', link: '/paper' },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
```

- [ ] **Step 4: Verify Astro starts without errors**

```bash
pnpm dev
```

Expected: `astro ready in Xms` with no TypeScript/import errors. Kill with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
cd ..
git add docs/package.json docs/pnpm-lock.yaml docs/astro.config.mjs
git commit -m "feat(docs): add @astrojs/react + framer-motion for homepage"
```

---

### Task 2: Create the React island — NavBar + Hero

**Files:**
- Create: `docs/src/components/HomePage.tsx`
- Create: `docs/src/pages/index.astro`

- [ ] **Step 1: Create HomePage.tsx with NavBar and Hero**

Create `docs/src/components/HomePage.tsx`:

```tsx
import { motion } from 'framer-motion';

// ─── Design tokens ────────────────────────────────────────────────────────────
const BG = '#191034';
const BG_CARD = '#22183c';
const BG_DARKER = '#0d0920';
const TEXT = '#ffffff';
const TEXT_MUTED = '#9698b6';
const ACCENT = '#702cdd';
const BORDER = 'rgba(91,33,182,0.125)';
const SHADOW = '0 10px 30px rgba(91,33,182,0.12), 0 0 0 1px rgba(91,33,182,0.125)';

const SERIF = 'Newsreader, Georgia, "Times New Roman", serif';
const SANS = 'Inter, ui-sans-serif, system-ui, sans-serif';
const MONO = '"Geist Mono", "Fira Code", monospace';

// ─── Animation variants ────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const stagger = (delayChildren = 0) => ({
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren } },
});

// ─── NavBar ────────────────────────────────────────────────────────────────────
function NavBar() {
  const links: [string, string][] = [
    ['Why OKP', '/why-okp'],
    ['Quickstart', '/quickstart/nextjs-sanity'],
    ['Spec', '/spec/v0'],
  ];

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: `1px solid ${BORDER}`,
        background: 'rgba(25,16,52,0.85)',
        padding: '0 32px',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <a
        href="/"
        style={{
          fontFamily: SERIF,
          fontStyle: 'italic',
          fontSize: 20,
          color: TEXT,
          textDecoration: 'none',
          letterSpacing: '-0.3px',
          fontWeight: 500,
        }}
      >
        okp
      </a>

      <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
        {links.map(([label, href]) => (
          <a
            key={href}
            href={href}
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: TEXT_MUTED,
              textDecoration: 'none',
              fontWeight: 400,
              transition: 'color 0.15s',
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT)}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
          >
            {label}
          </a>
        ))}
        <a
          href="https://github.com/AdityaDutta02/open-knowledge-protocol"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            fontFamily: SANS,
            fontSize: 14.5,
            color: TEXT,
            textDecoration: 'none',
            fontWeight: 500,
          }}
        >
          GitHub →
        </a>
      </div>
    </motion.nav>
  );
}

// ─── Hero ──────────────────────────────────────────────────────────────────────
function Hero() {
  const lines = ['The web knows things.', "AI agents can't read it yet."];

  return (
    <section
      style={{
        maxWidth: 680,
        margin: '0 auto',
        padding: '120px 24px 80px',
        textAlign: 'center',
      }}
    >
      <motion.div variants={stagger(0)} initial="hidden" animate="visible">
        {lines.map((line) => (
          <motion.h1
            key={line}
            variants={fadeUp}
            style={{
              fontFamily: SERIF,
              fontSize: 'clamp(32px, 5vw, 52px)',
              fontWeight: 500,
              letterSpacing: '-0.45px',
              lineHeight: 1.2,
              color: TEXT,
              margin: '0 0 4px',
            }}
          >
            {line}
          </motion.h1>
        ))}

        <motion.p
          variants={fadeUp}
          style={{
            fontFamily: SANS,
            fontSize: 18,
            color: TEXT_MUTED,
            lineHeight: 1.75,
            margin: '32px 0 40px',
            fontWeight: 400,
          }}
        >
          OKP is an open standard that structures your content into a graph AI
          agents can query, traverse, and reason about — without scraping,
          hallucinating, or guessing.
        </motion.p>

        <motion.div
          variants={fadeUp}
          style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="/spec/v0"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 500,
              color: TEXT,
              background: ACCENT,
              padding: '11px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
              boxShadow: '0 4px 14px rgba(112,44,221,0.4)',
            }}
          >
            Read the spec →
          </motion.a>
          <motion.a
            href="/quickstart/nextjs-sanity"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            style={{
              fontFamily: SANS,
              fontSize: 15,
              fontWeight: 400,
              color: TEXT_MUTED,
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              padding: '11px 24px',
              borderRadius: 8,
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Get started in 15 min →
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Placeholders (replaced in subsequent tasks) ───────────────────────────────
function CodeSnippet(): JSX.Element | null { return null; }
function Cards(): JSX.Element | null { return null; }
function Footer(): JSX.Element | null { return null; }

export default function HomePage() {
  return (
    <div style={{ background: BG, minHeight: '100vh', color: TEXT }}>
      <NavBar />
      <Hero />
      <CodeSnippet />
      <Cards />
      <Footer />
    </div>
  );
}
```

- [ ] **Step 2: Create docs/src/pages/index.astro**

```astro
---
import HomePage from '../components/HomePage';
---
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Open Knowledge Protocol</title>
    <meta
      name="description"
      content="Open standard for structuring web content as a queryable knowledge source for AI agents."
    />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,500;1,6..72,400;1,6..72,500&family=Inter:wght@400;500&display=swap"
      rel="stylesheet"
    />
    <style>
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
      html, body { background: #191034; }
      a { cursor: pointer; }
      @media (max-width: 640px) {
        /* Keep only GitHub link on mobile */
        nav > div > a:not(:last-child) { display: none; }
      }
    </style>
  </head>
  <body>
    <HomePage client:load />
  </body>
</html>
```

- [ ] **Step 3: Start dev server and visually verify NavBar + Hero**

```bash
cd docs && pnpm dev
```

Open `http://localhost:4321/`. Confirm:
- Deep purple background fills the page
- Nav slides down from top on load (Framer Motion)
- Italic "okp" wordmark top-left; nav links + GitHub right
- Hero headline in Newsreader serif, two lines stagger-fade in
- Muted prose paragraph fades in after headline
- Two CTA buttons: purple filled + ghost; scale on hover/tap

- [ ] **Step 4: Commit**

```bash
cd ..
git add docs/src/pages/index.astro docs/src/components/HomePage.tsx
git commit -m "feat(docs): homepage NavBar + Hero with Framer Motion"
```

---

### Task 3: Add CodeSnippet section

**Files:**
- Modify: `docs/src/components/HomePage.tsx` — replace `CodeSnippet` placeholder

- [ ] **Step 1: Replace the CodeSnippet placeholder**

In `docs/src/components/HomePage.tsx`, find `function CodeSnippet(): JSX.Element | null { return null; }` and replace it with:

```tsx
// Code is a hardcoded constant — plain text render, no user input, no XSS risk.
const CONCEPT_DNA_LINES = [
  '<script type="application/ld+json">',
  '{',
  '  "@context": "https://okp.theadityadutta.com/schema/v0#",',
  '  "@type": "ConceptDNA",',
  '  "conceptId": "transformer-attention",',
  '  "title": "How Transformer Attention Works",',
  '  "summary": "Self-attention allows each token to attend to all others…",',
  '  "keyTerms": ["attention", "softmax", "query", "key", "value"],',
  '  "enables": ["fine-tuning", "rag-retrieval"],',
  '  "confidence": "current",',
  '  "temporalValidity": { "publishedAt": "2024-01-15" }',
  '}',
  '</script>',
];

function CodeSnippet(): JSX.Element {
  const trafficLights = ['#ff5f57', '#febc2e', '#28c840'];

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      style={{ maxWidth: 680, margin: '0 auto 96px', padding: '0 24px' }}
    >
      <p
        style={{
          fontFamily: SANS,
          fontSize: 12,
          fontWeight: 500,
          color: TEXT_MUTED,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          marginBottom: 16,
          textAlign: 'center',
        }}
      >
        Drop this in any page
      </p>

      <div
        style={{
          background: BG_DARKER,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          overflow: 'hidden',
          boxShadow: SHADOW,
        }}
      >
        {/* macOS-style window chrome */}
        <div
          style={{
            borderBottom: `1px solid ${BORDER}`,
            padding: '10px 16px',
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {trafficLights.map((c) => (
            <div key={c} style={{ width: 12, height: 12, borderRadius: '50%', background: c }} />
          ))}
          <span
            style={{
              fontFamily: MONO,
              fontSize: 12,
              color: TEXT_MUTED,
              marginLeft: 8,
              opacity: 0.7,
            }}
          >
            _layout.astro
          </span>
        </div>

        {/* Code — rendered as safe plain-text lines */}
        <pre
          style={{
            fontFamily: MONO,
            fontSize: 13,
            lineHeight: 1.75,
            padding: '20px 24px',
            margin: 0,
            overflowX: 'auto',
          }}
        >
          {CONCEPT_DNA_LINES.map((line, i) => (
            <span
              key={i}
              style={{
                display: 'block',
                color: line.startsWith('<') ? '#f9a8d4' : line.trimStart().startsWith('"@') ? '#86efac' : '#c4b5fd',
              }}
            >
              {line}
            </span>
          ))}
        </pre>
      </div>
    </motion.section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll down past the Hero. Confirm:
- "Drop this in any page" label in small caps
- Dark window card with macOS dots + `_layout.astro` tab
- JSON-LD lines render in three accent colors: pink for tags, green for `@context`/`@type` keys, lavender for all other lines
- Card fades + slides up as it enters viewport (only once)

- [ ] **Step 3: Commit**

```bash
git add docs/src/components/HomePage.tsx
git commit -m "feat(docs): homepage CodeSnippet with whileInView animation"
```

---

### Task 4: Add Cards grid section

**Files:**
- Modify: `docs/src/components/HomePage.tsx` — replace `Cards` placeholder

- [ ] **Step 1: Replace the Cards placeholder**

Find `function Cards(): JSX.Element | null { return null; }` and replace with:

```tsx
const CARDS: { title: string; body: string; href: string; label: string }[] = [
  {
    title: 'Why OKP',
    body: 'The web has been retrofitted for machine consumption three times. Each time, a different gap went unclosed.',
    href: '/why-okp',
    label: 'Read the story →',
  },
  {
    title: 'Quickstart',
    body: 'Add OKP to a Next.js + Sanity site in about 15 minutes. No new infrastructure required.',
    href: '/quickstart/nextjs-sanity',
    label: 'Start building →',
  },
  {
    title: 'Packages',
    body: 'Five npm packages. Install what you need — schema, MCP server, validator, devtools, llms.txt.',
    href: '/packages/schema',
    label: 'Browse packages →',
  },
  {
    title: 'Spec v0',
    body: 'The protocol RFC. ConceptDNA schema, graph semantics, compliance tiers, and extension points.',
    href: '/spec/v0',
    label: 'Read the spec →',
  },
];

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.05 } },
};

const cardItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

function Cards(): JSX.Element {
  return (
    <motion.section
      variants={cardContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
      style={{
        maxWidth: 800,
        margin: '0 auto 96px',
        padding: '0 24px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24,
      }}
    >
      {CARDS.map((card) => (
        <motion.a
          key={card.title}
          href={card.href}
          variants={cardItem}
          whileHover={{
            y: -3,
            boxShadow: '0 20px 48px rgba(91,33,182,0.22), 0 0 0 1px rgba(112,44,221,0.3)',
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            background: BG_CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: '24px',
            textDecoration: 'none',
            display: 'block',
            boxShadow: SHADOW,
          }}
        >
          <h3
            style={{
              fontFamily: SERIF,
              fontSize: 20,
              fontWeight: 500,
              color: TEXT,
              margin: '0 0 10px',
              letterSpacing: '-0.2px',
            }}
          >
            {card.title}
          </h3>
          <p
            style={{
              fontFamily: SANS,
              fontSize: 14.5,
              color: TEXT_MUTED,
              lineHeight: 1.65,
              margin: '0 0 20px',
              fontWeight: 400,
            }}
          >
            {card.body}
          </p>
          <span style={{ fontFamily: SANS, fontSize: 14, color: ACCENT, fontWeight: 500 }}>
            {card.label}
          </span>
        </motion.a>
      ))}
    </motion.section>
  );
}
```

- [ ] **Step 2: Verify in browser**

Scroll below CodeSnippet. Confirm:
- 2×2 card grid (collapses to 1-column on narrow viewports)
- Cards stagger-fade up as they enter viewport
- Hover lifts card 3px with deeper purple glow shadow
- Serif title, muted body, accent label on each card

- [ ] **Step 3: Commit**

```bash
git add docs/src/components/HomePage.tsx
git commit -m "feat(docs): homepage Cards grid with stagger whileInView"
```

---

### Task 5: Add Footer, build verification, push

**Files:**
- Modify: `docs/src/components/HomePage.tsx` — replace `Footer` placeholder

- [ ] **Step 1: Replace the Footer placeholder**

Find `function Footer(): JSX.Element | null { return null; }` and replace with:

```tsx
function Footer(): JSX.Element {
  return (
    <footer
      style={{
        borderTop: `1px solid ${BORDER}`,
        padding: '24px 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <span style={{ fontFamily: SANS, fontSize: 14, color: TEXT_MUTED, fontWeight: 400 }}>
        OKP is open source. MIT license.
      </span>
      <a
        href="https://github.com/AdityaDutta02/open-knowledge-protocol"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          fontFamily: SANS,
          fontSize: 14,
          color: TEXT_MUTED,
          textDecoration: 'none',
          transition: 'color 0.15s',
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT)}
        onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = TEXT_MUTED)}
      >
        GitHub →
      </a>
    </footer>
  );
}
```

- [ ] **Step 2: Run production build**

```bash
cd docs && pnpm build
```

Expected: `✓ Built in Xs` — no TypeScript, no SSR errors.
`dist/index.html` should exist.

- [ ] **Step 3: Preview production build end-to-end**

```bash
pnpm preview
```

Open `http://localhost:4321/` and walk through:
1. Nav slides in from top
2. Hero serif headline staggers (two lines)
3. Prose paragraph fades in
4. CTAs scale on hover + tap
5. CodeSnippet slides up on scroll
6. Cards stagger in, hover lifts with glow
7. Footer at bottom with border-top

Navigate to `http://localhost:4321/why-okp` — Starlight sidebar + header must be fully intact.

- [ ] **Step 4: Commit and push**

```bash
cd ..
git add docs/src/components/HomePage.tsx
git commit -m "feat(docs): homepage Footer + production build verified"
git push origin main
```
