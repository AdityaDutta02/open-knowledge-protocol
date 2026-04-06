import { ConceptDNASchema } from '@okp/schema';
import {
  checkSemanticIdentity,
  checkRelationalContext,
  checkTemporalValidity,
  checkConfidenceMetadata,
  checkGraphConnectivity,
  type DimensionResult,
} from './dimensions.js';
import { fetchOKPData } from './fetcher.js';

export interface ComplianceReport {
  url: string;
  checkedAt: string;
  overallScore: number;
  tier: 'gold' | 'silver' | 'bronze' | 'non-compliant';
  dimensions: DimensionResult[];
  extras: {
    hasMcpEndpoint: boolean;
    hasLlmsTxt: boolean;
    jsonLdBlocksFound: number;
  };
}

function scoreToTier(score: number): ComplianceReport['tier'] {
  if (score >= 90) return 'gold';
  if (score >= 70) return 'silver';
  if (score >= 50) return 'bronze';
  return 'non-compliant';
}

const NO_DNA_DIMENSIONS: DimensionResult[] = [
  { dimension: 'semantic-identity', score: 0, passed: false, issues: ['No ConceptDNA found in JSON-LD'] },
  { dimension: 'relational-context', score: 0, passed: false, issues: ['No ConceptDNA found'] },
  { dimension: 'temporal-validity', score: 0, passed: false, issues: ['No ConceptDNA found'] },
  { dimension: 'confidence-metadata', score: 0, passed: false, issues: ['No ConceptDNA found'] },
  { dimension: 'graph-connectivity', score: 0, passed: false, issues: ['No ConceptDNA found'] },
];

/**
 * Validate OKP compliance of a site URL.
 * Fetches the page, extracts ConceptDNA from JSON-LD, and scores across 5 dimensions.
 */
export async function validate(url: string): Promise<ComplianceReport> {
  const data = await fetchOKPData(url);

  // Validate the partial via Zod to ensure all required fields are present before
  // passing to dimension checkers. The cast to ConceptDNA is safe here because
  // safeParse guarantees structural validity; the cast resolves the exactOptionalPropertyTypes
  // mismatch between Zod's inferred type (string | undefined) and the ConceptDNA interface.
  const parsed = ConceptDNASchema.safeParse(data.conceptDNA);
  const dimensions: DimensionResult[] = parsed.success
    ? [
        checkSemanticIdentity(parsed.data as import('@okp/schema').ConceptDNA),
        checkRelationalContext(parsed.data as import('@okp/schema').ConceptDNA),
        checkTemporalValidity(parsed.data as import('@okp/schema').ConceptDNA),
        checkConfidenceMetadata(parsed.data as import('@okp/schema').ConceptDNA),
        checkGraphConnectivity(parsed.data as import('@okp/schema').ConceptDNA),
      ]
    : NO_DNA_DIMENSIONS;

  const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);

  return {
    url,
    checkedAt: new Date().toISOString(),
    overallScore,
    tier: scoreToTier(overallScore),
    dimensions,
    extras: {
      hasMcpEndpoint: data.hasMcpEndpoint,
      hasLlmsTxt: data.hasLlmsTxt,
      jsonLdBlocksFound: data.jsonLdBlocks.length,
    },
  };
}
