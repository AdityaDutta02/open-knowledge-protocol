import type { ConceptDNA } from '@okp/schema';
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
 * Fetches the page, extracts ConceptDNA, and scores across 5 dimensions.
 */
export async function validate(url: string): Promise<ComplianceReport> {
  const data = await fetchOKPData(url);
  const full = data.conceptDNA as ConceptDNA;

  const dimensions: DimensionResult[] = data.conceptDNA
    ? [
        checkSemanticIdentity(full),
        checkRelationalContext(full),
        checkTemporalValidity(full),
        checkConfidenceMetadata(full),
        checkGraphConnectivity(full),
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
