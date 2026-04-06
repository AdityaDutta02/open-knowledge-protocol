import type { ConceptDNA } from '@okp/schema';

export interface DimensionResult {
  dimension: string;
  score: number;     // 0-100
  passed: boolean;   // score >= 60
  issues: string[];
}

/**
 * Dimension 1: Semantic Identity
 * Does the content have a unique conceptId, meaningful title, and agent-optimized summary?
 */
export function checkSemanticIdentity(dna: ConceptDNA): DimensionResult {
  const issues: string[] = [];
  let score = 100;

  if (!dna.conceptId || dna.conceptId.length === 0) { issues.push('conceptId is empty'); score -= 50; }
  if (!dna.title || dna.title.length === 0) { issues.push('title is empty'); score -= 20; }
  if (!dna.summary || dna.summary.length < 20) { issues.push('summary is too short (< 20 chars)'); score -= 30; }
  if (!dna.keyTerms || dna.keyTerms.length === 0) { issues.push('keyTerms is empty'); score -= 10; }

  const final = Math.max(0, score);
  return { dimension: 'semantic-identity', score: final, passed: final >= 60, issues };
}

/**
 * Dimension 2: Relational Context
 * Does the content define its relationships to other concepts?
 */
export function checkRelationalContext(dna: ConceptDNA): DimensionResult {
  const issues: string[] = [];
  let score = 0;

  if (dna.prerequisites.length > 0) score += 34;
  else issues.push('prerequisites is empty -- no inbound prerequisite edges');

  if (dna.enables.length > 0) score += 33;
  else issues.push('enables is empty -- no outbound enables edges');

  if (dna.relatedTo.length > 0) score += 33;
  else issues.push('relatedTo is empty -- no lateral relatedTo edges');

  return { dimension: 'relational-context', score, passed: score >= 60, issues };
}

/**
 * Dimension 3: Temporal Validity
 * Does the content declare when it expires or needs review?
 */
export function checkTemporalValidity(dna: ConceptDNA): DimensionResult {
  const issues: string[] = [];
  let score = 40; // base score for having publishedAt (always required)

  if (dna.temporalValidity.reviewBy) score += 40;
  else issues.push('reviewBy is not set -- no review schedule declared');

  if (dna.temporalValidity.expiresAt) score += 20;

  return { dimension: 'temporal-validity', score, passed: score >= 60, issues };
}

/**
 * Dimension 4: Confidence Metadata
 * Does the content declare its reliability and type?
 */
export function checkConfidenceMetadata(dna: ConceptDNA): DimensionResult {
  const issues: string[] = [];
  let score = 100;

  if (!dna.confidence) { issues.push('confidence level not set'); score -= 50; }
  if (!dna.articleType) { issues.push('articleType not set'); score -= 50; }

  const final = Math.max(0, score);
  return { dimension: 'confidence-metadata', score: final, passed: final >= 60, issues };
}

/**
 * Dimension 5: Graph Connectivity
 * Is the content connected to the broader knowledge graph via at least one edge?
 */
export function checkGraphConnectivity(dna: ConceptDNA): DimensionResult {
  const issues: string[] = [];
  const totalEdges = dna.prerequisites.length + dna.enables.length + dna.relatedTo.length;
  const score = totalEdges > 0 ? 100 : 0;

  if (score === 0) issues.push('no graph edges defined (prerequisites + enables + relatedTo all empty)');

  return { dimension: 'graph-connectivity', score, passed: score >= 60, issues };
}
