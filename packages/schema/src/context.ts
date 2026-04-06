import type { ConceptDNA } from './types.js';

/**
 * JSON-LD @context for Open Knowledge Protocol.
 * Embed this in any JSON-LD block alongside schema.org/Article to add OKP semantics.
 */
export const OKP_CONTEXT = {
  '@vocab': 'https://okp.theadityadutta.com/schema/v0#',
  okp: 'https://okp.theadityadutta.com/schema/v0#',
  schema: 'https://schema.org/',
  xsd: 'http://www.w3.org/2001/XMLSchema#',
  conceptId: 'okp:conceptId',
  summary: 'okp:summary',
  keyTerms: { '@id': 'okp:keyTerms', '@container': '@set' },
  prerequisites: { '@id': 'okp:prerequisite', '@type': '@id' },
  enables: { '@id': 'okp:enables', '@type': '@id' },
  relatedTo: { '@id': 'okp:relatedTo', '@type': '@id' },
  contradicts: { '@id': 'okp:contradicts', '@type': '@id' },
  supersedes: { '@id': 'okp:supersedes', '@type': '@id' },
  confidence: 'okp:confidence',
  temporalValidity: 'okp:temporalValidity',
  articleType: 'okp:articleType',
  title: 'schema:name',
  category: 'okp:category',
  publishedAt: { '@id': 'schema:datePublished', '@type': 'xsd:dateTime' },
  reviewBy: { '@id': 'okp:reviewBy', '@type': 'xsd:dateTime' },
  expiresAt: { '@id': 'okp:expiresAt', '@type': 'xsd:dateTime' },
} as const;

export type OKPContext = typeof OKP_CONTEXT;

/**
 * Build a JSON-LD object for embedding in a <script type="application/ld+json"> tag.
 * The returned object is safe to pass to JSON.stringify -- conceptDNA comes from
 * trusted server-side CMS data, not user input.
 */
export function buildJsonLd(
  conceptDNA: ConceptDNA,
  articleUrl: string,
): Record<string, unknown> {
  return {
    '@context': [
      'https://schema.org',
      OKP_CONTEXT,
    ],
    '@type': ['Article', 'okp:KnowledgeDocument'],
    '@id': articleUrl,
    ...conceptDNA,
  };
}
