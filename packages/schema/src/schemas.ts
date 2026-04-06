import { z } from 'zod';

export const ConfidenceLevelSchema = z.enum(['current', 'outdated', 'disputed', 'speculative']);
export const ArticleTypeSchema = z.enum(['deep-dive', 'primer', 'prediction', 'analysis', 'news']);
export const EdgeTypeSchema = z.enum(['prerequisite', 'enables', 'relatedTo', 'contradicts', 'supersedes']);

export const TemporalValiditySchema = z.object({
  publishedAt: z.string().datetime(),
  reviewBy: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const PredictionSchema = z.object({
  claim: z.string().min(1),
  targetDate: z.string().datetime(),
  confidence: z.number().min(0).max(1),
  status: z.enum(['pending', 'correct', 'incorrect', 'retracted']),
  resolvedAt: z.string().datetime().optional(),
});

export const CitationSchema = z.object({
  title: z.string().min(1),
  url: z.string().url().optional(),
  publishedAt: z.string().datetime().optional(),
  author: z.string().optional(),
});

export const ConceptDNASchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1).max(500),
  keyTerms: z.array(z.string().min(1)).min(1),
  prerequisites: z.array(z.string()),
  enables: z.array(z.string()),
  relatedTo: z.array(z.string()),
  category: z.string().min(1),
  confidence: ConfidenceLevelSchema,
  temporalValidity: TemporalValiditySchema,
  articleType: ArticleTypeSchema,
  predictions: z.array(PredictionSchema).optional(),
  contradicts: z.array(z.string()).optional(),
  supersedes: z.array(z.string()).optional(),
  citations: z.array(CitationSchema).optional(),
});

export const KnowledgeNodeSchema = z.object({
  conceptId: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url(),
  conceptDNA: ConceptDNASchema,
});

export const ConceptEdgeSchema = z.object({
  from: z.string().min(1),
  to: z.string().min(1),
  type: EdgeTypeSchema,
  weight: z.number().min(0).max(1).optional(),
});

export const ConceptGraphSchema = z.object({
  nodes: z.array(KnowledgeNodeSchema),
  edges: z.array(ConceptEdgeSchema),
});

export const ArticleSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  slug: z.string().min(1),
  publishedAt: z.string().datetime(),
  url: z.string().url(),
  conceptDNA: ConceptDNASchema,
  content: z.string(),
});

// Inferred types from Zod (for consumers who want Zod's parsed output type)
export type ConceptDNAInput = z.input<typeof ConceptDNASchema>;
export type ConceptDNAParsed = z.output<typeof ConceptDNASchema>;
export type ArticleInput = z.input<typeof ArticleSchema>;
export type KnowledgeNodeInput = z.input<typeof KnowledgeNodeSchema>;
export type ConceptGraphInput = z.input<typeof ConceptGraphSchema>;
