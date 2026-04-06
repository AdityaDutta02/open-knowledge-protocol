---
title: "@okp/llms-txt"
description: Generate /llms.txt and /llms-full.txt from OKP-structured articles.
---

# @okp/llms-txt

Generate `/llms.txt` and `/llms-full.txt` files from your OKP-structured content. These files make your site discoverable and fully readable by AI crawlers and LLM-based tooling that follow the llms.txt convention.

## Installation

```bash
pnpm add @okp/llms-txt
# or
npm install @okp/llms-txt
```

## What This Package Provides

`generateLlmsTxt` takes an array of OKP articles and site metadata, and returns both the compact and full-text variants of the llms.txt format.

- **`/llms.txt`** — A compact index: one line per article with title, URL, and summary. Fast to ingest for AI crawlers discovering your site.
- **`/llms-full.txt`** — The full-content variant: complete article text with embedded ConceptDNA for each node, collocating structured metadata and prose in a single file.

## API Reference

### `generateLlmsTxt(articles, options)`

```typescript
import { generateLlmsTxt, type LlmsTxtResult } from '@okp/llms-txt';

const result: LlmsTxtResult = generateLlmsTxt(articles, {
  siteTitle: string;       // Site name used as the top-level heading
  siteUrl: string;         // Base URL for constructing canonical article links
  siteDescription: string; // One-paragraph site description
});
```

**Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `articles` | `Article[]` | Array of OKP articles — each must have `conceptDNA`, `slug`, and `body` fields |
| `options.siteTitle` | `string` | Site name — used as `# Heading` in the output files |
| `options.siteUrl` | `string` | Base URL (no trailing slash) for building article URLs |
| `options.siteDescription` | `string` | Site description — used as the `> description` block |

**Returns:** `LlmsTxtResult`

```typescript
interface LlmsTxtResult {
  llmsTxt: string;      // Content for /llms.txt
  llmsFullTxt: string;  // Content for /llms-full.txt
}
```

## Usage: Next.js Route Handlers

Create two route handlers to serve both files dynamically. The handlers run at request time, so `/llms.txt` always reflects your current published articles.

**`app/llms.txt/route.ts`:**

```typescript
import { generateLlmsTxt } from '@okp/llms-txt';
import { getAllArticles } from '@/lib/sanity/queries';

export async function GET() {
  const articles = await getAllArticles();
  const { llmsTxt } = generateLlmsTxt(articles, {
    siteTitle: 'My Knowledge Site',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
    siteDescription: 'AI-native technical writing with OKP-structured content.',
  });

  return new Response(llmsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

**`app/llms-full.txt/route.ts`:**

```typescript
import { generateLlmsTxt } from '@okp/llms-txt';
import { getAllArticles } from '@/lib/sanity/queries';

export async function GET() {
  const articles = await getAllArticles();
  const { llmsFullTxt } = generateLlmsTxt(articles, {
    siteTitle: 'My Knowledge Site',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
    siteDescription: 'AI-native technical writing with OKP-structured content.',
  });

  return new Response(llmsFullTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
```

## Output Format

The compact `/llms.txt` follows the llms.txt spec format:

```
# My Knowledge Site

> AI-native technical writing with OKP-structured content.

## Articles

- [Transformer Architecture](https://site.com/blog/transformer-architecture): Core neural network architecture using self-attention mechanisms for sequence modeling tasks.
- [Attention Mechanism](https://site.com/blog/attention-mechanism): The query-key-value computation that enables transformers to selectively focus on input tokens.
```

The full `/llms-full.txt` includes embedded ConceptDNA and full article text for each node, formatted as Markdown sections.

## Static Generation (Astro or Next.js Static Export)

For static sites, generate both files at build time instead of using route handlers:

```typescript
// scripts/generate-llms-txt.ts
import { generateLlmsTxt } from '@okp/llms-txt';
import { writeFileSync } from 'node:fs';
import { getAllArticlesFromFilesystem } from './lib/articles';

const articles = getAllArticlesFromFilesystem();
const { llmsTxt, llmsFullTxt } = generateLlmsTxt(articles, {
  siteTitle: 'My Site',
  siteUrl: 'https://my-site.com',
  siteDescription: 'Technical writing with OKP structure.',
});

writeFileSync('public/llms.txt', llmsTxt);
writeFileSync('public/llms-full.txt', llmsFullTxt);
```
