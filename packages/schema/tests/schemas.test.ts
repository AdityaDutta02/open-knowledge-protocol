import { describe, it, expect } from 'vitest';
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
