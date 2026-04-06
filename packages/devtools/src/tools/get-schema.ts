type SchemaEntity = 'ConceptDNA' | 'Article' | 'Prediction' | 'KnowledgeNode' | 'ConceptGraph';

const SCHEMA_DOCS: Record<SchemaEntity, string> = {
  ConceptDNA: `## ConceptDNA -- Zod Schema (@okp/schema)

\`\`\`ts
import { ConceptDNASchema, type ConceptDNA } from '@okp/schema';

const ConceptDNASchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1).max(500),
  keyTerms: z.array(z.string().min(1)).min(1),
  prerequisites: z.array(z.string()),
  enables: z.array(z.string()),
  relatedTo: z.array(z.string()),
  category: z.string().min(1),
  confidence: z.enum(['current', 'outdated', 'disputed', 'speculative']),
  temporalValidity: z.object({
    publishedAt: z.string().datetime(),
    reviewBy: z.string().datetime().optional(),
    expiresAt: z.string().datetime().optional(),
  }),
  articleType: z.enum(['deep-dive', 'primer', 'prediction', 'analysis', 'news']),
  predictions: z.array(PredictionSchema).optional(),
  contradicts: z.array(z.string()).optional(),
  supersedes: z.array(z.string()).optional(),
  citations: z.array(CitationSchema).optional(),
});
\`\`\``,

  Article: `## Article -- Zod Schema (@okp/schema)

\`\`\`ts
const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  publishedAt: z.string().datetime(),
  url: z.string().url(),
  conceptDNA: ConceptDNASchema,
  content: z.string(),
});
\`\`\``,

  Prediction: `## Prediction -- Zod Schema (@okp/schema)

\`\`\`ts
const PredictionSchema = z.object({
  claim: z.string().min(1),
  targetDate: z.string().datetime(),
  confidence: z.number().min(0).max(1),
  status: z.enum(['pending', 'correct', 'incorrect', 'retracted']),
  resolvedAt: z.string().datetime().optional(),
});
\`\`\``,

  KnowledgeNode: `## KnowledgeNode -- Zod Schema (@okp/schema)

\`\`\`ts
const KnowledgeNodeSchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  conceptDNA: ConceptDNASchema,
});
\`\`\``,

  ConceptGraph: `## ConceptGraph -- Zod Schema (@okp/schema)

\`\`\`ts
const ConceptGraphSchema = z.object({
  nodes: z.array(KnowledgeNodeSchema),
  edges: z.array(z.object({
    from: z.string().min(1),
    to: z.string().min(1),
    type: z.enum(['prerequisite', 'enables', 'relatedTo', 'contradicts', 'supersedes']),
    weight: z.number().min(0).max(1).optional(),
  })),
});
\`\`\``,
};

export function getSchemaForEntity(entity: SchemaEntity): string {
  const doc = SCHEMA_DOCS[entity];
  if (!doc) throw new Error(`Unknown entity: ${entity}. Supported: ${Object.keys(SCHEMA_DOCS).join(', ')}`);
  return doc;
}
