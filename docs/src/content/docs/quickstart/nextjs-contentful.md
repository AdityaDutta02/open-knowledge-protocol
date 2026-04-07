---
title: "Next.js + Contentful"
description: Implement OKP in a Next.js App Router project backed by Contentful in 15 minutes.
---

# OKP Quickstart: Next.js + Contentful

This guide walks through a complete OKP implementation in a Next.js 14+ App Router project using Contentful as the CMS.

**Estimated time:** 15 - 20 minutes.

## Prerequisites

- Next.js 14+ with App Router
- A Contentful space with a `blogPost` (or equivalent) content type
- Environment variables: `CONTENTFUL_SPACE_ID`, `CONTENTFUL_ACCESS_TOKEN`, `NEXT_PUBLIC_SITE_URL`

## Step 1: Install packages

```bash
pnpm add @okp/schema @okp/mcp-server @okp/llms-txt
```

## Step 2: Add ConceptDNA fields to Contentful

In your Contentful content model, add a new **JSON object** field named `conceptDna` to your blog post content type. Contentful's JSON field type accepts arbitrary nested objects, so the entire `ConceptDNA` structure can be stored in a single field.

In the Contentful web app:
1. Open your content type (e.g. `blogPost`)
2. Add a new field → type: **JSON object**
3. Name it `conceptDna` (camelCase to match Contentful's field naming convention)
4. Save and publish the content model

Alternatively, use the Contentful Management API to add the field programmatically:

```typescript
// scripts/add-concept-dna-field.ts
import { createClient } from 'contentful-management'

const client = createClient({ accessToken: process.env.CONTENTFUL_MANAGEMENT_TOKEN! })
const space = await client.getSpace(process.env.CONTENTFUL_SPACE_ID!)
const env = await space.getEnvironment('master')
const contentType = await env.getContentType('blogPost')

contentType.fields.push({
  id: 'conceptDna',
  name: 'Concept DNA',
  type: 'Object',
  required: false,
  localized: false,
})

await contentType.update()
await contentType.publish()
```

## Step 3: Create a CMSAdapter for Contentful

`@okp/mcp-server` ships with `SanityAdapter` built-in. For Contentful, implement the `CMSAdapter` interface:

```typescript
// lib/okp/contentful-adapter.ts
import { createClient } from 'contentful'
import type { CMSAdapter } from '@okp/mcp-server'
import type { KnowledgeNode, ConceptGraph } from '@okp/schema'
import { ConceptDNASchema } from '@okp/schema'

const contentfulClient = createClient({
  space: process.env.CONTENTFUL_SPACE_ID!,
  accessToken: process.env.CONTENTFUL_ACCESS_TOKEN!,
})

export class ContentfulAdapter implements CMSAdapter {
  async searchArticles(query: string, limit: number): Promise<KnowledgeNode[]> {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      query,
      limit,
      select: ['fields.title', 'fields.slug', 'fields.conceptDna'],
    })
    return entries.items
      .map(entry => this.toKnowledgeNode(entry))
      .filter((node): node is KnowledgeNode => node !== null)
  }

  async getArticle(conceptId: string): Promise<KnowledgeNode | null> {
    const entries = await contentfulClient.getEntries({
      content_type: 'blogPost',
      'fields.conceptDna.conceptId': conceptId,
      limit: 1,
    })
    if (entries.items.length === 0) return null
    return this.toKnowledgeNode(entries.items[0])
  }

  async getRelated(conceptId: string, limit: number): Promise<KnowledgeNode[]> {
    const node = await this.getArticle(conceptId)
    if (!node) return []
    const relatedIds = node.conceptDNA.relatedTo.slice(0, limit)
    const results = await Promise.all(relatedIds.map(id => this.getArticle(id)))
    return results.filter((n): n is KnowledgeNode => n !== null)
  }

  async getPrerequisites(conceptId: string): Promise<KnowledgeNode[]> {
    const node = await this.getArticle(conceptId)
    if (!node) return []
    const results = await Promise.all(
      node.conceptDNA.prerequisites.map(id => this.getArticle(id))
    )
    return results.filter((n): n is KnowledgeNode => n !== null)
  }

  async getGraph(conceptId: string, depth: number): Promise<ConceptGraph> {
    // Simplified: fetch root node and immediate neighbors
    const root = await this.getArticle(conceptId)
    if (!root) return { nodes: [], edges: [] }

    const neighborIds = [
      ...root.conceptDNA.prerequisites,
      ...root.conceptDNA.enables,
      ...root.conceptDNA.relatedTo,
    ]
    const neighbors = (await Promise.all(neighborIds.map(id => this.getArticle(id))))
      .filter((n): n is KnowledgeNode => n !== null)

    const nodes = [root, ...neighbors]
    const edges = [
      ...root.conceptDNA.prerequisites.map(id => ({ from: id, to: conceptId, type: 'prerequisite' as const })),
      ...root.conceptDNA.enables.map(id => ({ from: conceptId, to: id, type: 'enables' as const })),
      ...root.conceptDNA.relatedTo.map(id => ({ from: conceptId, to: id, type: 'relatedTo' as const })),
    ]

    return { nodes, edges }
  }

  private toKnowledgeNode(entry: Record<string, unknown>): KnowledgeNode | null {
    const fields = entry.fields as Record<string, unknown>
    const parsed = ConceptDNASchema.safeParse(fields.conceptDna)
    if (!parsed.success) return null
    return {
      conceptId: parsed.data.conceptId,
      title: parsed.data.title,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${fields.slug}`,
      conceptDNA: parsed.data,
    }
  }
}
```

## Step 4: Create the MCP server route

Create `app/api/mcp/route.ts`:

```typescript
import { createOKPServer } from '@okp/mcp-server'
import { ContentfulAdapter } from '@/lib/okp/contentful-adapter'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { type NextRequest } from 'next/server'

const server = createOKPServer({ adapter: new ContentfulAdapter() })

export async function POST(req: NextRequest) {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  })
  await server.connect(transport)
  return transport.handleRequest(req)
}
```

## Steps 5 - 7

Steps 5 through 7 (JSON-LD embedding, llms.txt generation, and AI assistant configuration) are identical to the Next.js + Sanity quickstart. See the [Next.js + Sanity guide](/quickstart/nextjs-sanity) for those steps  -  the `@okp/schema` and `@okp/llms-txt` packages are CMS-agnostic.

## Verify compliance

```bash
npx okp validate https://your-site.com/blog/your-first-article
```

