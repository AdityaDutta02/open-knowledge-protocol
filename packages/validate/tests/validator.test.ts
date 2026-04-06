import { describe, it, expect, vi, beforeEach } from 'vitest';
import { validate } from '../src/validator.js';
import * as fetcher from '../src/fetcher.js';

vi.mock('../src/fetcher.js');

const mockFetchedData = {
  conceptDNA: {
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
  },
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

  it('assigns gold tier for a fully-compliant document', async () => {
    const report = await validate('https://example.com');
    expect(report.tier).toBe('gold');
  });

  it('reports extras (hasMcpEndpoint, hasLlmsTxt, jsonLdBlocksFound)', async () => {
    const report = await validate('https://example.com');
    expect(report.extras.hasMcpEndpoint).toBe(true);
    expect(report.extras.hasLlmsTxt).toBe(true);
    expect(report.extras.jsonLdBlocksFound).toBe(1);
  });
});
