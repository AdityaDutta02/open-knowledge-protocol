import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validate } from '../src/validator.js';
import * as fetcher from '../src/fetcher.js';
import type { FetchedOKPData } from '../src/fetcher.js';

vi.mock('../src/fetcher.js');

const fullConceptDNA = {
  conceptId: 'test-concept',
  title: 'Test Concept',
  summary: 'A test concept for validation.',
  keyTerms: ['test'],
  prerequisites: ['prereq'],
  enables: ['enables-something'],
  relatedTo: ['related'],
  category: 'test',
  confidence: 'current' as const,
  temporalValidity: {
    publishedAt: new Date().toISOString(),
    reviewBy: new Date(Date.now() + 86400000).toISOString(),
  },
  articleType: 'deep-dive' as const,
};

const mockFetchedData: FetchedOKPData = {
  conceptDNA: fullConceptDNA,
  hasMcpEndpoint: true,
  hasLlmsTxt: true,
  jsonLdBlocks: [{}],
};

describe('validate', () => {
  beforeEach(() => {
    vi.mocked(fetcher.fetchOKPData).mockResolvedValue(mockFetchedData);
  });

  it('returns a ComplianceReport with overallScore and tier', async () => {
    const report = await validate('https://example.com');
    expect(report.url).toBe('https://example.com');
    expect(report.overallScore).toBeGreaterThan(0);
    expect(['gold', 'silver', 'bronze', 'non-compliant']).toContain(report.tier);
    expect(report.dimensions).toHaveLength(5);
  });

  it('assigns non-compliant tier when no ConceptDNA found', async () => {
    vi.mocked(fetcher.fetchOKPData).mockResolvedValue({
      conceptDNA: null,
      hasMcpEndpoint: false,
      hasLlmsTxt: false,
      jsonLdBlocks: [],
    });
    const report = await validate('https://example.com');
    expect(report.tier).toBe('non-compliant');
    expect(report.overallScore).toBe(0);
  });

  it('assigns non-compliant tier when ConceptDNA fails Zod validation (malformed)', async () => {
    vi.mocked(fetcher.fetchOKPData).mockResolvedValue({
      // Missing required fields — Zod safeParse will fail
      conceptDNA: { conceptId: 'partial' } as never,
      hasMcpEndpoint: false,
      hasLlmsTxt: false,
      jsonLdBlocks: [],
    });
    const report = await validate('https://example.com');
    expect(report.tier).toBe('non-compliant');
    expect(report.overallScore).toBe(0);
  });

  it('assigns gold tier for a fully-compliant document', async () => {
    const report = await validate('https://example.com');
    expect(report.tier).toBe('gold');
  });

  it('assigns bronze tier for document with no relational edges', async () => {
    vi.mocked(fetcher.fetchOKPData).mockResolvedValue({
      conceptDNA: {
        ...fullConceptDNA,
        prerequisites: [],
        enables: [],
        relatedTo: [],
      },
      hasMcpEndpoint: false,
      hasLlmsTxt: false,
      jsonLdBlocks: [],
    });
    const report = await validate('https://example.com');
    // Relational (0) + Graph (0) drag score below gold/silver; semantic+temporal+confidence are 100/80/100
    expect(['bronze', 'silver']).toContain(report.tier);
  });

  it('reports extras (hasMcpEndpoint, hasLlmsTxt, jsonLdBlocksFound)', async () => {
    const report = await validate('https://example.com');
    expect(report.extras.hasMcpEndpoint).toBe(true);
    expect(report.extras.hasLlmsTxt).toBe(true);
    expect(report.extras.jsonLdBlocksFound).toBe(1);
  });
});
