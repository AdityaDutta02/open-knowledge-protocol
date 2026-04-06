---
title: "Astro + Markdown"
description: Implement OKP in an Astro static site using Markdown or MDX content collections.
---

# OKP Quickstart: Astro + Markdown

This guide walks through OKP implementation in an Astro project using file-based Markdown or MDX content collections. Since Astro generates static HTML, this approach uses build-time generation for all OKP outputs.

**Estimated time:** 15–20 minutes.

## Prerequisites

- Astro 4+ with content collections configured
- A `blog` collection with Markdown or MDX posts

## Step 1: Install packages

```bash
pnpm add @okp/schema @okp/llms-txt
pnpm add -D @okp/validate
```

Note: `@okp/mcp-server` requires a server runtime. For static Astro sites, use an Astro server endpoint (SSR mode) or a separate Vercel/Netlify function if you want live MCP support.

## Step 2: Add ConceptDNA to your content collection schema

In `src/content/config.ts`, extend your blog collection schema with the ConceptDNA fields using Zod:

```typescript
import { defineCollection, z } from 'astro:content'
import { ConceptDNASchema } from '@okp/schema'

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    // Embed the full ConceptDNA schema — all fields are validated at build time
    conceptDNA: ConceptDNASchema,
  }),
})

export const collections = { blog }
```

## Step 3: Add ConceptDNA frontmatter to your articles

In each Markdown file (`src/content/blog/transformer-architecture.md`):

```markdown
---
title: "Transformer Architecture"
description: "Core neural network architecture using self-attention."
pubDate: 2026-04-01
conceptDNA:
  conceptId: transformer-architecture
  title: Transformer Architecture
  summary: >
    The transformer architecture is the dominant neural network design for
    sequence modeling tasks. It replaces recurrence with self-attention,
    enabling parallel training on long sequences.
  keyTerms:
    - transformer
    - self-attention
    - encoder-decoder
  prerequisites:
    - attention-mechanism
    - neural-networks-fundamentals
  enables:
    - gpt-architecture
    - bert-architecture
    - vision-transformers
  relatedTo:
    - rnn-architecture
    - positional-encoding
  category: machine-learning
  confidence: current
  articleType: deep-dive
  temporalValidity:
    publishedAt: "2026-04-01T00:00:00Z"
    reviewBy: "2026-10-01T00:00:00Z"
---

Article content starts here...
```

## Step 4: Embed JSON-LD in article pages

In `src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content'
import { buildJsonLd } from '@okp/schema'

const { slug } = Astro.params
const posts = await getCollection('blog')
const post = posts.find(p => p.slug === slug)

if (!post) return Astro.redirect('/404')

const canonicalUrl = new URL(`/blog/${slug}`, Astro.site).toString()
const jsonLd = buildJsonLd(post.data.conceptDNA, canonicalUrl)
const { Content } = await post.render()
---

<html lang="en">
  <head>
    <title>{post.data.title}</title>
    <!-- Structured data from CMS-authored ConceptDNA -->
    <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
  </head>
  <body>
    <main>
      <Content />
    </main>
  </body>
</html>
```

## Step 5: Generate llms.txt at build time

Create `src/pages/llms.txt.ts` as a static endpoint:

```typescript
import type { APIRoute } from 'astro'
import { getCollection } from 'astro:content'
import { generateLlmsTxt } from '@okp/llms-txt'

export const GET: APIRoute = async ({ site }) => {
  const posts = await getCollection('blog')

  const articles = posts.map(post => ({
    conceptDNA: post.data.conceptDNA,
    slug: post.slug,
    body: post.body,
  }))

  const { llmsTxt } = generateLlmsTxt(articles, {
    siteTitle: 'My Knowledge Site',
    siteUrl: site?.toString().replace(/\/$/, '') ?? '',
    siteDescription: 'Technical writing with OKP-structured content.',
  })

  return new Response(llmsTxt, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
```

Create the same file for `llms-full.txt.ts` using `llmsFullTxt`.

## Step 6: MCP endpoint (optional, requires SSR)

If you want a live MCP endpoint, enable SSR in `astro.config.mjs` and create `src/pages/api/mcp.ts`:

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config'
import node from '@astrojs/node'

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
})
```

```typescript
// src/pages/api/mcp.ts
import type { APIRoute } from 'astro'
import { createOKPServer } from '@okp/mcp-server'
import { AstroMarkdownAdapter } from './lib/astro-adapter'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'

const server = createOKPServer({ adapter: new AstroMarkdownAdapter() })

export const POST: APIRoute = async ({ request }) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  })
  await server.connect(transport)
  return transport.handleRequest(request)
}
```

`AstroMarkdownAdapter` reads from your content collection's JSON exports at runtime and implements the `CMSAdapter` interface.

## Step 7: Verify compliance

```bash
# Run the dev server first
npx astro dev

# Validate in another terminal
npx okp validate http://localhost:4321/blog/transformer-architecture
```

