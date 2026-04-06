import { describe, it, expect } from 'vitest';
import {
  ConceptDNASchema,
  ArticleSchema,
  ConceptGraphSchema,
} from '../src/schemas.js';
import { buildJsonLd, OKP_CONTEXT } from '../src/context.js';
import type {
  ConceptDNA,
  KnowledgeNode,
  ConceptGraph,
} from '../src/types.js';

describe('TypeScript interfaces (type-level tests)', () => {
  it('ConceptDNA has required fields', () => {
    const dna: ConceptDNA = {
      conceptId: 'transformer-attention',
      title: 'How Transformer Attention Works',
      summary: 'Attention mechanisms allow transformers to weigh token relationships dynamically.',
      keyTerms: ['attention', 'self-attention', 'transformer'],
      prerequisites: [],
      enables: ['llm-architecture'],
      relatedTo: ['rnn-vs-transformer'],
      category: 'ai-architecture',
      confidence: 'current',
      temporalValidity: { publishedAt: '2024-01-15T00:00:00.000Z' },
      articleType: 'deep-dive',
    };
    expect(dna.conceptId).toBe('transformer-attention');
  });

  it('ConceptDNA accepts optional predictions field', () => {
    const dna: ConceptDNA = {
      conceptId: 'gpt-4-release',
      title: 'GPT-4 Capabilities',
      summary: 'GPT-4 multimodal release.',
      keyTerms: ['gpt-4', 'openai'],
      prerequisites: [],
      enables: [],
      relatedTo: [],
      category: 'ai-models',
      confidence: 'current',
      temporalValidity: {
        publishedAt: '2024-03-01T00:00:00.000Z',
        reviewBy: '2025-03-01T00:00:00.000Z',
      },
      articleType: 'analysis',
      predictions: [
        {
          claim: 'GPT-5 will outperform GPT-4 on MMLU by 10%',
          targetDate: '2025-12-01T00:00:00.000Z',
          confidence: 0.75,
          status: 'pending',
        },
      ],
    };
    expect(dna.predictions).toHaveLength(1);
  });

  it('KnowledgeNode contains a ConceptDNA', () => {
    const node: KnowledgeNode = {
      conceptId: 'test',
      title: 'Test',
      url: 'https://example.com/test',
      conceptDNA: {
        conceptId: 'test',
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
    expect(node.conceptId).toBe('test');
  });

  it('ConceptGraph holds nodes and typed edges', () => {
    const graph: ConceptGraph = {
      nodes: [],
      edges: [{ from: 'a', to: 'b', type: 'prerequisite' }],
    };
    expect(graph.edges[0]?.type).toBe('prerequisite');
  });
});

describe('ConceptDNASchema', () => {
  const validDNA = {
    conceptId: 'transformer-attention',
    title: 'How Transformer Attention Works',
    summary: 'Attention mechanisms allow transformers to weigh token relationships dynamically.',
    keyTerms: ['attention', 'transformer'],
    prerequisites: [],
    enables: ['llm-architecture'],
    relatedTo: [],
    category: 'ai-architecture',
    confidence: 'current',
    temporalValidity: { publishedAt: '2024-01-15T00:00:00.000Z' },
    articleType: 'deep-dive',
  };

  it('parses a valid ConceptDNA', () => {
    const result = ConceptDNASchema.safeParse(validDNA);
    expect(result.success).toBe(true);
  });

  it('rejects empty conceptId', () => {
    const result = ConceptDNASchema.safeParse({ ...validDNA, conceptId: '' });
    expect(result.success).toBe(false);
  });

  it('rejects summary longer than 500 chars', () => {
    const result = ConceptDNASchema.safeParse({ ...validDNA, summary: 'x'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('rejects invalid confidence level', () => {
    const result = ConceptDNASchema.safeParse({ ...validDNA, confidence: 'unknown' });
    expect(result.success).toBe(false);
  });

  it('rejects prediction confidence outside 0-1', () => {
    const result = ConceptDNASchema.safeParse({
      ...validDNA,
      predictions: [{ claim: 'x', targetDate: '2025-01-01T00:00:00.000Z', confidence: 1.5, status: 'pending' }],
    });
    expect(result.success).toBe(false);
  });
});

describe('ConceptGraphSchema', () => {
  it('parses a minimal graph', () => {
    const graph = { nodes: [], edges: [] };
    expect(ConceptGraphSchema.safeParse(graph).success).toBe(true);
  });

  it('rejects edge with invalid type', () => {
    const graph = {
      nodes: [],
      edges: [{ from: 'a', to: 'b', type: 'invalidEdge' }],
    };
    expect(ConceptGraphSchema.safeParse(graph).success).toBe(false);
  });
});

describe('buildJsonLd', () => {
  const testDNA: ConceptDNA = {
    conceptId: 'test',
    title: 'Test Article',
    summary: 'A test article.',
    keyTerms: ['test'],
    prerequisites: [],
    enables: [],
    relatedTo: [],
    category: 'test',
    confidence: 'current',
    temporalValidity: { publishedAt: '2024-01-01T00:00:00.000Z' },
    articleType: 'primer',
  };

  it('wraps ConceptDNA in a valid JSON-LD structure', () => {
    const result = buildJsonLd(testDNA, 'https://example.com/test');
    expect(result['@context']).toContain(OKP_CONTEXT);
    expect(result['@id']).toBe('https://example.com/test');
    expect((result['@type'] as string[]).includes('okp:KnowledgeDocument')).toBe(true);
  });

  it('spreads conceptDNA fields onto the root object', () => {
    const result = buildJsonLd(testDNA, 'https://example.com/test');
    expect(result['conceptId']).toBe('test');
  });
});
