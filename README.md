# Open Knowledge Protocol

**MCP is the transport layer. OKP is the knowledge layer.**

---

## The Problem

AI agents read the web as raw HTML. They can't tell what a page means, whether it's still accurate, or how one concept connects to another. Every RAG pipeline and AI assistant has to guess. OKP adds a structured metadata layer - a JSON-LD block on each page - that any agent can parse without scraping.

---

## Get Started

Add the schema package and drop a `ConceptDNA` block into any page:

```bash
npm add @okp/schema
```

For a full setup with an MCP server that lets AI agents query your site directly, follow the [Next.js + Sanity quickstart](https://okp.theadityadutta.com/quickstart/nextjs-sanity). Takes about 15 minutes. No new infrastructure required.

---

## The Stack

| Layer | Technology | Role |
|-------|-----------|------|
| Discovery | JSON-LD | Search engine and crawler discovery |
| Invocation | MCP | Tool calls and agent-to-site communication |
| Semantics | **OKP** | Knowledge structure, concept graphs, temporal validity |

These three layers are complementary, not competing. OKP adds the *what does this mean* layer on top of the *how do we find it* and *how do we call it* layers.

---

## Packages

| Package | Description | Install |
|---------|-------------|---------|
| `@okp/schema` | TypeScript interfaces + Zod schemas + JSON-LD `@context` | `npm add @okp/schema` |
| `@okp/mcp-server` | Plug-in MCP server factory with CMS adapters | `npm add @okp/mcp-server` |
| `@okp/llms-txt` | `/llms.txt` + `/llms-full.txt` generator | `npm add @okp/llms-txt` |
| `@okp/devtools` | MCP server for AI coders (Claude Code / Cursor) | `npx okp-devtools` |
| `@okp/validate` | Compliance validator with tier scoring | `npx okp validate <url>` |

---

## Quick Start: Next.js + Sanity

### Prerequisites

- Next.js 14+ (App Router)
- Sanity Studio v3 with a `post` document type

### Step 1: Install packages

```bash
pnpm add @okp/schema @okp/mcp-server @okp/llms-txt
```

### Step 2: Add ConceptDNA to your Sanity schema

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

### Step 3: Create the MCP server route

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

### Step 4: Add JSON-LD to article pages

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

// Render as a script tag:
// <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
```

### Step 5: Generate llms.txt

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

### Step 6: Validate compliance

```bash
npx okp validate https://your-site.com
```

---

## Add to Your AI Coder

Point Claude Code or Cursor at your site's OKP MCP endpoint. In `~/.claude/settings.json`:

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

Your AI coder can now query your site's knowledge graph directly  -  asking which articles cover a topic, what prerequisites a concept has, or which posts are flagged for review.

---

## Compliance Tiers

OKP compliance is scored 0 - 100 based on how completely a site implements the protocol. Run `npx okp validate <url>` to check any site.

| Tier | Score | What it means |
|------|-------|---------------|
| Bronze | ≥ 50 | ConceptDNA present on articles, basic JSON-LD emitted |
| Silver | ≥ 70 | Full concept graph, temporal validity, `/llms.txt` endpoint |
| Gold | ≥ 90 | MCP server live, all schema fields populated, embeddings indexed |

---

## Reference Implementation

**The Context Window (TCW)** is the canonical OKP Gold-tier implementation. It is an AI-native blog about AI and technology, simultaneously readable by humans and queryable by AI agents. TCW serves its full ConceptGraph over MCP, publishes a `/llms.txt` index of all articles with semantic metadata, and embeds OKP JSON-LD on every article page. It is built on Next.js 16, Sanity, and Vercel, and serves as the living proof-of-concept that OKP works at production scale.

---

## Links

- **Docs**: [okp.theadityadutta.com](https://okp.theadityadutta.com)
- **Spec v0**: [`spec/v0.md`](./spec/v0.md)
- **Whitepaper**: [`paper/`](./paper/)
- **License**: MIT
