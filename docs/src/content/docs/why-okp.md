---
title: Why OKP
description: What OKP is, why it matters, and how to add it to your site in 5 minutes.
---

# Why OKP

## The one-sentence version

OKP is a small JSON-LD tag you add to any web page so AI agents can understand what the page is about, how it connects to other content, and whether it is still current — without scraping or guessing.

---

## The problem

AI assistants pull information from the web every time they answer a question. But web pages give them almost nothing to work with structurally. An AI reading your page has no way to know:

- **What concept** the page is actually about (vs. other pages with similar titles)
- **How it relates** to other concepts — is this a prerequisite? An example? A contradiction?
- **Whether it is still accurate** — a 2020 article looks identical to a 2025 one
- **How confident** the author is — peer-reviewed fact or early speculation?

The result is AI answers that blend stale claims with current ones, confuse related concepts, and have no reliable basis for deciding what to trust.

OKP fills that gap. It works like Open Graph tags (the `og:title`, `og:image` tags that power Twitter/LinkedIn cards) — but instead of telling social media platforms about your page, it tells AI agents how to reason about it.

---

## Add it in 5 minutes

### Step 1 — Install the package

```bash
npm i @okp/schema
```

### Step 2 — Add the JSON-LD block to your page's `<head>`

```html
<script type="application/ld+json">
{
  "@context": "https://okp.theadityadutta.com/schema/v0#",
  "@type": "ConceptDNA",
  "conceptId": "your-concept-id",
  "title": "Your Page Title",
  "summary": "One sentence describing what this page is about.",
  "keyTerms": ["term1", "term2"],
  "confidence": "current"
}
</script>
```

That's the minimum. Stop here if you want — it already helps.

### Step 3 (optional) — Add richer metadata

```json
{
  "@context": "https://okp.theadityadutta.com/schema/v0#",
  "@type": "ConceptDNA",
  "conceptId": "transformer-attention",
  "title": "How Transformer Attention Works",
  "summary": "Self-attention allows each token to attend to all others in a sequence.",
  "keyTerms": ["attention", "softmax", "query", "key", "value"],
  "prerequisiteOf": ["fine-tuning", "rag-retrieval"],
  "confidence": "current",
  "temporalValidity": {
    "publishedAt": "2024-01-15",
    "reviewBy": "2025-01-15"
  }
}
```

---

## What each field does

| Field | What it tells AI agents |
|---|---|
| `conceptId` | A stable ID so two pages about the same topic can be linked |
| `summary` | A plain-English description (better than hoping the AI infers it) |
| `keyTerms` | The core vocabulary — helps with search and disambiguation |
| `confidence` | `current`, `outdated`, `speculative`, or `disputed` |
| `prerequisiteOf` | What concepts this one unlocks |
| `temporalValidity` | When to re-check whether the content is still accurate |

---

## Validate your page

```bash
npx @okp/validate https://yoursite.com/your-page
```

This scores your page against all five OKP dimensions and tells you exactly what is missing.

---

## Why not just use schema.org?

Schema.org is built for search engine indexing. It tells Google *about* your page — author, date, keywords. OKP is built for AI agent reasoning — it tells agents *how to use* your page: what concepts it covers, how they relate, whether the content is still valid, how much to trust it.

They are complementary. OKP does not replace schema.org; it adds five dimensions that schema.org intentionally left out.
