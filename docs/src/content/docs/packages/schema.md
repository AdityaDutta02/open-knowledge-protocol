---
title: "@okp/schema"
description: TypeScript interfaces, Zod schemas, and JSON-LD @context for the Open Knowledge Protocol.
---

# @okp/schema

The foundational package for OKP. Provides TypeScript type definitions, Zod validation schemas, JSON-LD context, and the `buildJsonLd` utility. Every other OKP package depends on `@okp/schema`.

## Installation

```bash
pnpm add @okp/schema
# or
npm install @okp/schema
```

## What This Package Provides

- **TypeScript interfaces** — `ConceptDNA`, `KnowledgeNode`, `ConceptGraph`, `ConceptEdge`, `Prediction`, `Citation`, and all supporting types, fully typed with no `any`
- **Zod schemas** — `ConceptDNASchema`, `ArticleSchema`, `ConceptGraphSchema`, and per-field schemas for runtime validation of incoming data
- **JSON-LD context** — `OKP_CONTEXT` defining the `@context` namespace for embedding ConceptDNA as structured linked data
- **`buildJsonLd` utility** — transforms a `ConceptDNA` + URL into a valid JSON-LD object ready for embedding in a `<script type="application/ld+json">` tag

## Key Exports

| Export | Kind | Description |
|--------|------|-------------|
| `ConceptDNA` | Type | Core metadata envelope — the semantic identity of a knowledge article |
| `KnowledgeNode` | Type | A `ConceptDNA` bound to a canonical URL — the atom of the OKP graph |
| `ConceptGraph` | Type | Multi-node subgraph with typed edges for traversal responses |
| `ConceptEdge` | Type | Typed directed edge between two `conceptId` values |
| `Prediction` | Type | Forward-looking claim with confidence score and resolution status |
| `Citation` | Type | Source reference with title, URL, date, and author |
| `ConceptDNASchema` | Zod schema | Full validation schema for `ConceptDNA` objects |
| `ArticleSchema` | Zod schema | Validation schema for REST API article responses |
| `ConceptGraphSchema` | Zod schema | Validation schema for graph traversal responses |
| `OKP_CONTEXT` | Object | JSON-LD `@context` for the OKP vocabulary namespace |
| `buildJsonLd` | Function | Builds a JSON-LD object from `ConceptDNA` + canonical URL |

## Usage Examples

### Validating incoming ConceptDNA

Use `ConceptDNASchema.safeParse` to validate any object before using it as ConceptDNA — for example, when reading from a CMS API or parsing from a fetched page:

```typescript
import { ConceptDNASchema } from '@okp/schema';

const rawData = await fetchFromCMS(articleId);

const result = ConceptDNASchema.safeParse(rawData.conceptDNA);

if (!result.success) {
  logger.warn({ issues: result.error.issues }, 'ConceptDNA validation failed');
  return null;
}

const conceptDNA = result.data;
// conceptDNA is now fully typed as ConceptDNA
```

### Embedding JSON-LD in a Next.js page

Use `buildJsonLd` to produce a structured data object for your article pages. The output contains only the data you authored in your CMS and is safe to serialize.

```tsx
import { buildJsonLd } from '@okp/schema';

// In your Next.js App Router page component:
export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  const canonicalUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`;

  const jsonLd = buildJsonLd(article.conceptDNA, canonicalUrl);
  const jsonLdString = JSON.stringify(jsonLd);

  return (
    <>
      {/* Embed structured data — content is from your own CMS, not user input */}
      <script type="application/ld+json" suppressHydrationWarning>
        {jsonLdString}
      </script>
      {/* rest of your article layout */}
    </>
  );
}
```

### Building a ConceptGraph for the REST API

```typescript
import type { ConceptGraph, KnowledgeNode } from '@okp/schema';

function buildSubgraph(rootId: string, depth: number): ConceptGraph {
  const nodes: KnowledgeNode[] = fetchNodesUpToDepth(rootId, depth);
  const edges = nodes.flatMap(node =>
    node.conceptDNA.prerequisites.map(prereqId => ({
      from: prereqId,
      to: node.conceptId,
      type: 'prerequisite' as const,
    }))
  );

  return { nodes, edges };
}
```

## ConceptDNA Field Reference

See the [Spec v0](/spec/v0) for the full normative field definitions. The `ConceptDNASchema` Zod schema enforces all required fields and their types at runtime.

Required fields: `conceptId`, `title`, `summary`, `keyTerms`, `prerequisites`, `enables`, `relatedTo`, `category`, `confidence`, `temporalValidity`, `articleType`.

Optional fields: `predictions`, `contradicts`, `supersedes`, `citations`.
