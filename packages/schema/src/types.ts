export type ConfidenceLevel = 'current' | 'outdated' | 'disputed' | 'speculative';

export type ArticleType =
  | 'deep-dive'
  | 'primer'
  | 'prediction'
  | 'analysis'
  | 'news';

export type EdgeType =
  | 'prerequisite'
  | 'enables'
  | 'relatedTo'
  | 'contradicts'
  | 'supersedes';

export interface TemporalValidity {
  /** ISO 8601 datetime -- when this content was published */
  publishedAt: string;
  /** ISO 8601 datetime -- when the content should be reviewed for accuracy */
  reviewBy?: string;
  /** ISO 8601 datetime -- when the content is definitively outdated */
  expiresAt?: string;
}

export interface Prediction {
  /** The forward-looking claim made in the article */
  claim: string;
  /** ISO 8601 datetime -- target resolution date */
  targetDate: string;
  /** Author's confidence in this prediction. Must be in range [0, 1]. Enforced at runtime by ConceptDNASchema (Zod). */
  confidence: number;
  status: 'pending' | 'correct' | 'incorrect' | 'retracted';
  /** ISO 8601 datetime -- when the prediction was resolved */
  resolvedAt?: string;
}

export interface Citation {
  title: string;
  url?: string;
  publishedAt?: string;
  author?: string;
}

/**
 * ConceptDNA -- semantic identity metadata for a knowledge article.
 * This is the core schema of the Open Knowledge Protocol.
 */
export interface ConceptDNA {
  /** Unique identifier for this concept. Kebab-case, globally unique within a publisher's graph. */
  conceptId: string;
  /** Human-readable title of the article */
  title: string;
  /** 1-2 sentence summary for AI agent consumption. Max 500 characters. */
  summary: string;
  /** Primary concepts this article defines or explains */
  keyTerms: string[];
  /** conceptIds the reader must understand before this article */
  prerequisites: string[];
  /** conceptIds that this article's understanding unlocks */
  enables: string[];
  /** Laterally related conceptIds -- neither prerequisite nor dependent */
  relatedTo: string[];
  /** Topic cluster this article belongs to */
  category: string;
  /** Reliability of the content at time of publication */
  confidence: ConfidenceLevel;
  temporalValidity: TemporalValidity;
  articleType: ArticleType;
  /** Forward-looking claims made in this article */
  predictions?: Prediction[];
  /** conceptIds whose claims conflict with this article */
  contradicts?: string[];
  /** conceptIds that this article replaces or updates */
  supersedes?: string[];
  citations?: Citation[];
}

export interface KnowledgeNode {
  conceptId: string;
  title: string;
  url: string;
  conceptDNA: ConceptDNA;
}

export interface ConceptEdge {
  /** The source conceptId */
  from: string;
  /** The target conceptId */
  to: string;
  type: EdgeType;
  /** Strength of relationship, 0-1. Defaults to 1 if omitted. */
  weight?: number;
}

export interface ConceptGraph {
  nodes: KnowledgeNode[];
  edges: ConceptEdge[];
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  publishedAt: string;
  url: string;
  conceptDNA: ConceptDNA;
  /** Plain-text content for full-text retrieval */
  content: string;
}
