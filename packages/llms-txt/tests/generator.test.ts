import { describe, it, expect } from 'vitest';
import { generateLlmsTxt } from '../src/generator.js';
import type { Article } from '@okp/schema';

const makeArticle = (overrides: Partial<Article> = {}): Article => ({
  id: 'article-1',
  title: 'Transformer Attention Explained',
  slug: 'transformer-attention',
  publishedAt: '2024-01-15T00:00:00.000Z',
  url: 'https://example.com/blog/transformer-attention',
  content: 'Full article content here...',
  conceptDNA: {
    conceptId: 'transformer-attention',
    title: 'Transformer Attention Explained',
    summary: 'How attention mechanisms work in transformer models.',
    keyTerms: ['attention', 'transformer', 'self-attention'],
    prerequisites: [],
    enables: ['llm-architecture'],
    relatedTo: [],
    category: 'ai-architecture',
    confidence: 'current',
    temporalValidity: { publishedAt: '2024-01-15T00:00:00.000Z' },
    articleType: 'deep-dive',
  },
  ...overrides,
});

describe('generateLlmsTxt', () => {
  it('returns both llmsTxt and llmsFullTxt', () => {
    const result = generateLlmsTxt([makeArticle()], { siteTitle: 'Test Blog', siteUrl: 'https://example.com' });
    expect(result).toHaveProperty('llmsTxt');
    expect(result).toHaveProperty('llmsFullTxt');
  });

  it('llmsTxt contains article URL and summary', () => {
    const result = generateLlmsTxt([makeArticle()], { siteTitle: 'Test Blog', siteUrl: 'https://example.com' });
    expect(result.llmsTxt).toContain('https://example.com/blog/transformer-attention');
    expect(result.llmsTxt).toContain('How attention mechanisms work in transformer models.');
  });

  it('llmsFullTxt includes full content', () => {
    const result = generateLlmsTxt([makeArticle()], { siteTitle: 'Test Blog', siteUrl: 'https://example.com' });
    expect(result.llmsFullTxt).toContain('Full article content here...');
  });

  it('sorts articles by publishedAt descending', () => {
    const older = makeArticle({ id: '1', slug: 'older', publishedAt: '2024-01-01T00:00:00.000Z', url: 'https://example.com/older' });
    const newer = makeArticle({ id: '2', slug: 'newer', publishedAt: '2024-06-01T00:00:00.000Z', url: 'https://example.com/newer' });
    const result = generateLlmsTxt([older, newer], { siteTitle: 'Test Blog', siteUrl: 'https://example.com' });
    const newerIdx = result.llmsTxt.indexOf('https://example.com/newer');
    const olderIdx = result.llmsTxt.indexOf('https://example.com/older');
    expect(newerIdx).toBeLessThan(olderIdx);
  });

  it('handles empty article array gracefully', () => {
    const result = generateLlmsTxt([], { siteTitle: 'Test Blog', siteUrl: 'https://example.com' });
    expect(result.llmsTxt).toContain('# Test Blog');
    expect(result.llmsFullTxt).toContain('# Test Blog');
  });
});
