---
title: "@okp/mcp-server"
description: Plug-in MCP server factory for exposing OKP-structured content to AI agents.
---

# @okp/mcp-server

A plug-and-play MCP server factory that turns any OKP-structured content source into a fully compliant MCP endpoint. Wire in a `CMSAdapter` for your content platform and get five standard OKP tools instantly.

## Installation

```bash
pnpm add @okp/mcp-server
# or
npm install @okp/mcp-server
```

## What This Package Provides

`@okp/mcp-server` implements the five standard OKP tools defined in the [Spec v0](/spec/v0) MCP transport profile:

| Tool | Signature | Description |
|------|-----------|-------------|
| `search_articles` | `(query: string, limit?: number)` | Full-text and semantic search across the corpus. Returns `KnowledgeNode[]` sorted by relevance. |
| `get_article` | `(conceptId: string)` | Retrieve a single `KnowledgeNode` by `conceptId`, including full `ConceptDNA`. |
| `get_related` | `(conceptId: string, limit?: number)` | Retrieve nodes connected by `relatedTo` edges, sorted by edge weight. |
| `get_prerequisites` | `(conceptId: string)` | Retrieve prerequisite nodes recursively, topologically sorted. |
| `get_graph` | `(conceptId: string, depth?: number)` | Retrieve a `ConceptGraph` centered on the given node up to `depth` hops (default: 2). |

## CMSAdapter Interface

To use `@okp/mcp-server` with your CMS, implement the `CMSAdapter` interface:

```typescript
import type { CMSAdapter } from '@okp/mcp-server';
import type { KnowledgeNode, ConceptGraph } from '@okp/schema';

interface CMSAdapter {
  searchArticles(query: string, limit: number): Promise<KnowledgeNode[]>;
  getArticle(conceptId: string): Promise<KnowledgeNode | null>;
  getRelated(conceptId: string, limit: number): Promise<KnowledgeNode[]>;
  getPrerequisites(conceptId: string): Promise<KnowledgeNode[]>;
  getGraph(conceptId: string, depth: number): Promise<ConceptGraph>;
}
```

## Built-in: SanityAdapter

For Sanity-backed sites, use the built-in `SanityAdapter`:

```typescript
import { SanityAdapter } from '@okp/mcp-server';

const adapter = new SanityAdapter({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
});
```

`SanityAdapter` uses GROQ queries to fetch `KnowledgeNode` objects from your Sanity dataset. It expects your documents to have a `conceptDNA` object field following the OKP schema — see the [Next.js + Sanity quickstart](/quickstart/nextjs-sanity) for the Sanity schema definition.

## Usage: Next.js Route Handler

Create `app/api/mcp/route.ts` in your Next.js application:

```typescript
import { createOKPServer, SanityAdapter } from '@okp/mcp-server';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { type NextRequest } from 'next/server';

const adapter = new SanityAdapter({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-01-01',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL!,
});

const server = createOKPServer({ adapter });

export async function POST(req: NextRequest) {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: () => crypto.randomUUID(),
  });
  await server.connect(transport);
  return transport.handleRequest(req);
}
```

## Usage: Custom Adapter

Implementing `CMSAdapter` for a custom data source:

```typescript
import { createOKPServer, type CMSAdapter } from '@okp/mcp-server';
import type { KnowledgeNode, ConceptGraph } from '@okp/schema';

class MyAdapter implements CMSAdapter {
  async searchArticles(query: string, limit: number): Promise<KnowledgeNode[]> {
    return myDatabase.search({ query, limit });
  }

  async getArticle(conceptId: string): Promise<KnowledgeNode | null> {
    return myDatabase.findOne({ conceptId });
  }

  async getRelated(conceptId: string, limit: number): Promise<KnowledgeNode[]> {
    return myDatabase.related({ conceptId, limit });
  }

  async getPrerequisites(conceptId: string): Promise<KnowledgeNode[]> {
    return myDatabase.prerequisites({ conceptId });
  }

  async getGraph(conceptId: string, depth: number): Promise<ConceptGraph> {
    return myDatabase.subgraph({ conceptId, depth });
  }
}

const server = createOKPServer({ adapter: new MyAdapter() });
```

## Adding to an AI Agent

Once deployed, add your MCP endpoint to Claude Code or any MCP-compatible agent:

```json
{
  "mcpServers": {
    "my-site-okp": {
      "type": "http",
      "url": "https://your-site.com/api/mcp"
    }
  }
}
```

See the [devtools package](/packages/devtools) for a faster way to generate this configuration.
