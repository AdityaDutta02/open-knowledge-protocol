import { describe, it, expect } from 'vitest';
import {
  checkSemanticIdentity,
  checkRelationalContext,
  checkTemporalValidity,
  checkConfidenceMetadata,
  checkGraphConnectivity,
} from '../src/dimensions.js';
import type { ConceptDNA } from '@okp/schema';

const fullDNA: ConceptDNA = {
  conceptId: 'transformer-attention',
  title: 'Transformer Attention',
  summary: 'How attention mechanisms work.',
  keyTerms: ['attention', 'transformer'],
  prerequisites: ['matrix-multiplication'],
  enables: ['llm-architecture'],
  relatedTo: ['rnn'],
  category: 'ai-architecture',
  confidence: 'current',
  temporalValidity: {
    publishedAt: new Date().toISOString(),
    reviewBy: new Date(Date.now() + 365 * 86400000).toISOString(),
  },
  articleType: 'deep-dive',
};

describe('checkSemanticIdentity', () => {
  it('scores 100 for a fully populated ConceptDNA', () => {
    const result = checkSemanticIdentity(fullDNA);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });

  it('fails if conceptId is empty', () => {
    const result = checkSemanticIdentity({ ...fullDNA, conceptId: '' });
    expect(result.score).toBeLessThan(100);
    expect(result.passed).toBe(false);
  });
});

describe('checkRelationalContext', () => {
  it('scores 100 when all relation arrays have entries', () => {
    expect(checkRelationalContext(fullDNA).score).toBe(100);
  });

  it('scores lower when all arrays are empty', () => {
    const result = checkRelationalContext({ ...fullDNA, prerequisites: [], enables: [], relatedTo: [] });
    expect(result.score).toBeLessThan(100);
  });
});

describe('checkTemporalValidity', () => {
  it('scores higher with reviewBy set', () => {
    const withReview = checkTemporalValidity(fullDNA).score;
    const noReview = checkTemporalValidity({ ...fullDNA, temporalValidity: { publishedAt: new Date().toISOString() } }).score;
    expect(withReview).toBeGreaterThan(noReview);
  });
});

describe('checkConfidenceMetadata', () => {
  it('scores 100 when confidence and articleType are set', () => {
    const result = checkConfidenceMetadata(fullDNA);
    expect(result.score).toBe(100);
    expect(result.passed).toBe(true);
  });
});

describe('checkGraphConnectivity', () => {
  it('scores 100 when at least one edge exists', () => {
    expect(checkGraphConnectivity(fullDNA).score).toBe(100);
  });

  it('scores 0 when no edges at all', () => {
    const result = checkGraphConnectivity({ ...fullDNA, prerequisites: [], enables: [], relatedTo: [] });
    expect(result.score).toBe(0);
    expect(result.passed).toBe(false);
  });
});
