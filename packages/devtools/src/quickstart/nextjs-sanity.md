# OKP Quickstart: Next.js + Sanity

## Prerequisites
- Next.js 14+ (App Router)
- Sanity Studio v3 with a `post` document type

## Step 1: Install packages

```bash
pnpm add @okp/schema @okp/mcp-server @okp/llms-txt
```

## Step 2: Add ConceptDNA to your Sanity schema

In `sanity/schemas/post.ts`, add this field to your post document:

```ts
import { defineField } from 'sanity'

export const conceptDNAField = defineField({
  name: 'conceptDNA',
  title: 'Concept DNA',
  type: 'object',
  fields: [
    defineField({ name: 'conceptId', type: 'slug', title: 'Concept ID', options: { source: 'title' } }),
    defineField({ name: 'summary', type: 'text', title: 'Summary (max 500 chars)', rows: 3 }),
    defineField({ name: 'keyTerms', type: 'array', of: [{ type: 'string' }], title: 'Key Terms' }),
    defineField({ name: 'prerequisites', type: 'array', of: [{ type: 'string' }], title: 'Prerequisite Concept IDs' }),
    defineField({ name: 'enables', type: 'array', of: [{ type: 'string' }], title: 'Enables Concept IDs' }),
    defineField({ name: 'relatedTo', type: 'array', of: [{ type: 'string' }], title: 'Related Concept IDs' }),
    defineField({ name: 'category', type: 'string', title: 'Topic Category' }),
    defineField({ name: 'confidence', type: 'string', options: { list: ['current', 'outdated', 'disputed', 'speculative'] } }),
    defineField({ name: 'articleType', type: 'string', options: { list: ['deep-dive', 'primer', 'prediction', 'analysis', 'news'] } }),
    defineField({
      name: 'temporalValidity',
      type: 'object',
      fields: [
        defineField({ name: 'publishedAt', type: 'datetime' }),
        defineField({ name: 'reviewBy', type: 'datetime' }),
      ],
    }),
  ],
})
```

## Step 3: Create the MCP server route

Create `app/api/mcp/route.ts`:

```ts
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
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: () => crypto.randomUUID() })
  await server.connect(transport)
  return transport.handleRequest(req)
}
```

## Step 4: Add JSON-LD to article pages

In `app/(blog)/[slug]/page.tsx`:

```tsx
import { buildJsonLd } from '@okp/schema'

// Inside your page component, after fetching article data:
// Note: buildJsonLd returns a plain object safe for JSON.stringify.
// The output is structured data from your CMS -- not from user input.
const jsonLd = buildJsonLd(
  article.conceptDNA,
  process.env.NEXT_PUBLIC_SITE_URL + '/blog/' + article.slug
)

// Render as a script tag -- use Next.js Script or a raw script element:
// <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

## Step 5: Generate llms.txt

Create `app/llms.txt/route.ts`:

```ts
import { generateLlmsTxt } from '@okp/llms-txt'
import { getAllArticles } from '@/lib/sanity/queries'

export async function GET() {
  const articles = await getAllArticles()
  const { llmsTxt } = generateLlmsTxt(articles, {
    siteTitle: 'My Blog',
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
    siteDescription: 'AI-native blog with OKP-structured content.',
  })
  return new Response(llmsTxt, { headers: { 'Content-Type': 'text/plain' } })
}
```

## Step 6: Add to your Claude Code MCP config

In `~/.claude/settings.json`:

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
