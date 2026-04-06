import { describe, it, expect, vi, beforeEach } from 'vitest';
import { SanityAdapter } from '../src/adapters/sanity.js';

vi.mock('@sanity/client', () => ({
  createClient: vi.fn(() => ({ fetch: vi.fn() })),
}));

const mockNode = {
  conceptId: 'test-concept',
  title: 'Test',
  url: 'https://example.com/test',
  conceptDNA: {
    conceptId: 'test-concept',
    title: 'Test',
    summary: 'Test summary.',
    keyTerms: ['test'],
    prerequisites: [],
    enables: [],
    relatedTo: [],
    category: 'test',
    confidence: 'current',
    temporalValidity: { publishedAt: '2024-01-01T00:00:00.000Z' },
    articleType: 'primer',
  },
};

describe('SanityAdapter', () => {
  let mockFetch: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    const { createClient } = await import('@sanity/client');
    mockFetch = vi.fn();
    vi.mocked(createClient).mockReturnValue({ fetch: mockFetch } as ReturnType<typeof createClient>);
  });

  it('searchArticles calls Sanity fetch', async () => {
    mockFetch.mockResolvedValue([mockNode]);
    const adapter = new SanityAdapter({
      projectId: 'test123',
      dataset: 'production',
      apiVersion: '2024-01-01',
      siteUrl: 'https://example.com',
    });
    const results = await adapter.searchArticles('transformers');
    expect(mockFetch).toHaveBeenCalledOnce();
    expect(results).toHaveLength(1);
  });

  it('getArticle returns null when Sanity returns nothing', async () => {
    mockFetch.mockResolvedValue(null);
    const adapter = new SanityAdapter({
      projectId: 'test123',
      dataset: 'production',
      apiVersion: '2024-01-01',
      siteUrl: 'https://example.com',
    });
    const result = await adapter.getArticle('missing-concept');
    expect(result).toBeNull();
  });
});
