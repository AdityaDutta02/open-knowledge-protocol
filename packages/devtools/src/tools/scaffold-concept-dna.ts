import type { ArticleType } from '@okp/schema';

function buildBase(articleType: ArticleType, now: string, oneYear: string): string {
  return [
    '{',
    '  "conceptId": "your-concept-id",',
    '  "title": "Article Title",',
    '  "summary": "1-2 sentence summary for AI agent consumption. Max 500 chars.",',
    '  "keyTerms": ["primary-term", "secondary-term"],',
    '  "prerequisites": [],',
    '  "enables": [],',
    '  "relatedTo": [],',
    '  "category": "topic-cluster",',
    `  "articleType": "${articleType}",`,
    '  "temporalValidity": {',
    `    "publishedAt": "${now}",`,
    `    "reviewBy": "${oneYear}"`,
    '  }',
  ].join('\n');
}

function buildPredictionExtra(twoYears: string): string {
  return [
    ',',
    '  "confidence": "speculative",',
    '  "predictions": [',
    '    {',
    '      "claim": "Specific falsifiable claim",',
    `      "targetDate": "${twoYears}",`,
    '      "confidence": 0.7,',
    '      "status": "pending"',
    '    }',
    '  ]',
    '}',
  ].join('\n');
}

function buildStandardExtra(): string {
  return '\n  "confidence": "current"\n}';
}

function getExtra(articleType: ArticleType, twoYears: string): string {
  if (articleType === 'prediction') return buildPredictionExtra(twoYears);
  const standard: ArticleType[] = ['deep-dive', 'primer', 'analysis', 'news'];
  if (standard.includes(articleType)) return buildStandardExtra();
  throw new Error(`Unknown articleType: ${articleType}`);
}

export function scaffoldConceptDNA(articleType: ArticleType): string {
  const now = new Date().toISOString();
  const oneYear = new Date(Date.now() + 365 * 86400000).toISOString();
  const twoYears = new Date(Date.now() + 2 * 365 * 86400000).toISOString();
  return buildBase(articleType, now, oneYear) + getExtra(articleType, twoYears);
}
