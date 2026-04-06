import { describe, it, expect, vi } from 'vitest';
import type { CMSAdapter } from '../src/adapter.js';
import type { KnowledgeNode, ConceptGraph } from '@okp/schema';
import { createOKPServer } from '../src/factory.js';

const mockNode: KnowledgeNode = {
  conceptId: 'test',
  title: 'Test Node',
  url: 'https://example.com/test',
  conceptDNA: {
    conceptId: 'test',
    title: 'Test Node',
    summary: 'A test concept.',
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

describe('CMSAdapter interface', () => {
  it('mock adapter satisfies the interface', async () => {
    const adapter: CMSAdapter = {
      searchArticles: vi.fn().mockResolvedValue([mockNode]),
      getArticle: vi.fn().mockResolvedValue(mockNode),
      getRelated: vi.fn().mockResolvedValue([]),
      getPrerequisites: vi.fn().mockResolvedValue([]),
      getGraph: vi.fn().mockResolvedValue({ nodes: [mockNode], edges: [] } satisfies ConceptGraph),
    };

    const results = await adapter.searchArticles('test');
    expect(results).toHaveLength(1);
    expect(results[0]?.conceptId).toBe('test');
  });
});

describe('createOKPServer', () => {
  it('returns a Server instance', () => {
    const adapter: CMSAdapter = {
      searchArticles: vi.fn().mockResolvedValue([]),
      getArticle: vi.fn().mockResolvedValue(null),
      getRelated: vi.fn().mockResolvedValue([]),
      getPrerequisites: vi.fn().mockResolvedValue([]),
      getGraph: vi.fn().mockResolvedValue({ nodes: [], edges: [] }),
    };

    const server = createOKPServer({ adapter });
    expect(server).toBeDefined();
  });
});
