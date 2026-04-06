---
title: "Next.js + Sanity"
description: Implement OKP in a Next.js App Router project backed by Sanity CMS in 15 minutes.
---

# OKP Quickstart: Next.js + Sanity

This guide walks through a complete OKP implementation in a Next.js 14+ App Router project using Sanity v3 as the CMS. By the end you will have:

- ConceptDNA embedded in your Sanity document schema
- A live MCP endpoint at `/api/mcp`
- JSON-LD structured data on every article page
- `/llms.txt` and `/llms-full.txt` served dynamically

**Estimated time:** 15–20 minutes.

## Prerequisites

- Next.js 14+ with App Router
- Sanity Studio v3 with a `post` (or equivalent) document type
- Environment variables: `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `NEXT_PUBLIC_SITE_URL`

## Step 1: Install packages

```bash
pnpm add @okp/schema @okp/mcp-server @okp/llms-txt
```

## Step 2: Add ConceptDNA to your Sanity schema

In `sanity/schemas/post.ts`, add the `conceptDNA` object field to your post document. All fields mirror the OKP `ConceptDNA` type directly.

```typescript
import { defineField } from 'sanity'

export const conceptDNAField = defineField({
  name: 'conceptDNA',
  title: 'Concept DNA',
  type: 'object',
  fields: [
    defineField({
      name: 'conceptId',
      type: 'slug',
      title: 'Concept ID',
      description: 'Stable kebab-case identifier. Never change this after publishing.',
      options: { source: 'title' },
    }),
    defineField({
      name: 'summary',
      type: 'text',
      title: 'Summary (max 500 chars)',
      description: 'One-to-two sentence summary for AI agents. Be information-dense.',
      rows: 3,
    }),
    defineField({
      name: 'keyTerms',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Key Terms',
      description: 'Concepts this article defines or explains in depth.',
    }),
    defineField({
      name: 'prerequisites',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Prerequisite Concept IDs',
      description: 'conceptIds the reader must understand first.',
    }),
    defineField({
      name: 'enables',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Enables Concept IDs',
      description: 'conceptIds whose understanding this article unlocks.',
    }),
    defineField({
      name: 'relatedTo',
      type: 'array',
      of: [{ type: 'string' }],
      title: 'Related Concept IDs',
      description: 'Laterally related concepts — neither prerequisite nor dependent.',
    }),
    defineField({
      name: 'category',
      type: 'string',
      title: 'Topic Category',
      description: 'Topic cluster (e.g. machine-learning, deployment, security).',
    }),
    defineField({
      name: 'confidence',
      type: 'string',
      title: 'Confidence',
      options: { list: ['current', 'outdated', 'disputed', 'speculative'] },
    }),
    defineField({
      name: 'articleType',
      type: 'string',
      title: 'Article Type',
      options: { list: ['deep-dive', 'primer', 'prediction', 'analysis', 'news'] },
    }),
    defineField({
      name: 'temporalValidity',
      type: 'object',
      title: 'Temporal Validity',
      fields: [
        defineField({ name: 'publishedAt', type: 'datetime', title: 'Published At' }),
        defineField({ name: 'reviewBy', type: 'datetime', title: 'Review By' }),
        defineField({ name: 'expiresAt', type: 'datetime', title: 'Expires At' }),
      ],
    }),
  ],
})
```

Then add `conceptDNAField` to your post document schema's `fields` array.

## Step 3: Create the MCP server route

Create `app/api/mcp/route.ts`. This exposes the five standard OKP tools (`search_articles`, `get_article`, `get_related`, `get_prerequisites`, `get_graph`) over MCP.

```typescript
import { createOKPServer, SanityAdapter } from '@okp/mcp-server'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { type NextRequest } from 'next/server'

const adapter = new SanityAdapter({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
})

const server = createOKPServer({ adapter })

export async function POST(req: NextRequest) {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  })
  await server.connect(transport)
  return transport.handleRequest(req)
}
```

## Step 4: Embed JSON-LD on article pages

In `app/(blog)/[slug]/page.tsx`, use `buildJsonLd` from `@okp/schema` to emit structured data on every article page. This is what OKP validators and AI crawlers use to detect your ConceptDNA.

```typescript
import { buildJsonLd } from '@okp/schema'

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug)
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`

  // buildJsonLd produces a JSON-LD object from your CMS-authored ConceptDNA
  const jsonLd = buildJsonLd(article.conceptDNA, canonicalUrl)

  return (
    <>
      <script
        type="application/ld+json"
        suppressHydrationWarning
      >
        {JSON.stringify(jsonLd)}
      </script>
      {/* article content */}
    </>
  )
}
```

## Step 5: Generate llms.txt

Create `app/llms.txt/route.ts` to serve the compact AI crawler index:

```typescript
import { generateLlmsTxt } from '@okp/llms-txt'
import { getAllArticles } from '@/lib/sanity/queries'

export async function GET() {
  const articles = await getAllArticles()
  const { llmsTxt } = generateLlmsTxt(articles, {
    siteTitle: 'My Blog',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
    siteDescription: 'AI-native blog with OKP-structured content.',
  })
  return new Response(llmsTxt, {
    headers: { 'Content-Type': 'text/plain' },
  })
}
```

Optionally, create `app/llms-full.txt/route.ts` using the same pattern with `llmsFullTxt` instead of `llmsTxt`.

## Step 6: Add to your AI coding assistant

Once deployed, add your MCP endpoint to Claude Code at `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "my-blog-okp": {
      "type": "http",
      "url": "https://your-site.com/api/mcp"
    }
  }
}
```

For Cursor, add the equivalent block to `.cursor/mcp.json`.

## Step 7: Verify compliance

```bash
npx okp validate https://your-site.com/blog/your-first-okp-article
```

Aim for a Silver tier score (≥ 70) before launch. See [`@okp/validate`](/packages/validate) for the full scoring breakdown.

## Next Steps

- Fill in `reviewBy` and `expiresAt` in `temporalValidity` for all articles — this is the most common gap between Bronze and Silver tier
- Add `predictions` arrays to forward-looking articles
- Set up a Sanity webhook to auto-set `confidence: 'outdated'` when `reviewBy` passes
- Deploy `@okp/devtools` to your Claude Code MCP config for in-editor OKP assistance

