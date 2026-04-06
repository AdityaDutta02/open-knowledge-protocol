---
title: "@okp/validate"
description: CLI and programmatic OKP compliance validator. npx okp validate <url>.
---

# @okp/validate

The OKP compliance validator. Fetch any live URL and get a five-dimensional compliance score with per-field remediation suggestions. Use it in CI, in the terminal during development, or programmatically in your publishing pipeline.

## Installation

```bash
pnpm add @okp/validate
# or
npm install @okp/validate

# For global CLI access:
npm install -g @okp/validate
```

## CLI Usage

```bash
# Validate a live URL
npx okp validate https://your-site.com/blog/transformer-architecture

# Validate with JSON output (for CI pipelines)
npx okp validate https://your-site.com/blog/transformer-architecture --json

# Fail with exit code 1 if score is below a threshold
npx okp validate https://your-site.com/blog/transformer-architecture --min-score 70
```

**Example output:**

```
OKP Compliance Report
URL: https://your-site.com/blog/transformer-architecture

Composite Score: 74 / 100  [Silver]

  semantic-identity     92  PASS
  relational-context    80  PASS
  temporal-validity     68  WARN  — missing expiresAt
  confidence-metadata   85  PASS
  graph-connectivity    45  WARN  — low edge degree (2 edges), no cross-publisher edges

Failing checks:
  - temporalValidity.expiresAt: field absent. Add an expiry date to complete temporal validity.
  - graph-connectivity: node has only 2 edges. Aim for 5+ edges for Silver tier graph connectivity.
```

## Programmatic API

### `validate(url)`

```typescript
import { validate, type ComplianceReport } from '@okp/validate';

const report: ComplianceReport = await validate('https://your-site.com/blog/transformer-architecture');

console.log(report.compositeScore);  // 74
console.log(report.tier);            // 'silver'
console.log(report.dimensions);      // { semanticIdentity: 92, relationalContext: 80, ... }
console.log(report.failingChecks);   // [{ field: 'temporalValidity.expiresAt', message: '...' }]
```

### `ComplianceReport` Type

```typescript
interface ComplianceReport {
  url: string;
  compositeScore: number;        // 0–100 arithmetic mean of five dimensions
  tier: 'none' | 'bronze' | 'silver' | 'gold';
  dimensions: {
    semanticIdentity: number;    // 0–100
    relationalContext: number;   // 0–100
    temporalValidity: number;    // 0–100
    confidenceMetadata: number;  // 0–100
    graphConnectivity: number;   // 0–100
  };
  failingChecks: Array<{
    dimension: string;
    field: string;
    message: string;
    remediation: string;
  }>;
  warnings: string[];
  fetchedAt: string;             // ISO 8601
}
```

## The Five Compliance Dimensions

| Dimension | What it measures | Key fields |
|-----------|-----------------|------------|
| `semantic-identity` | Presence and quality of core identity fields | `conceptId`, `title`, `summary`, `keyTerms` |
| `relational-context` | Coverage of typed relationship edges | `prerequisites`, `enables`, `relatedTo` |
| `temporal-validity` | Completeness of temporal metadata | `temporalValidity.publishedAt`, `reviewBy`, `expiresAt`, `confidence` freshness |
| `confidence-metadata` | Epistemic classification | `articleType`, `confidence`, `predictions` |
| `graph-connectivity` | Edge degree and cross-publisher connectivity | Total edge count, presence of `contradicts`/`supersedes` edges |

## Compliance Tiers

| Tier | Required composite score | What it typically means |
|------|--------------------------|------------------------|
| Bronze | ≥ 50 | All required ConceptDNA fields present, at least one edge type populated |
| Silver | ≥ 70 | Required fields present, temporal validity complete, multiple edge types |
| Gold | ≥ 90 | All required and most optional fields, rich graph connectivity, regular `confidence` updates |

A missing `conceptId` is a categorical failure — it prevents graph traversal entirely and will score the `semantic-identity` dimension at 0 regardless of other fields. The composite score is a summary metric; review dimension-level scores for a complete picture.

## CI Integration

Add to your CI pipeline to gate deployments on compliance:

```yaml
# .github/workflows/validate.yml
- name: Validate OKP compliance
  run: npx okp validate ${{ env.SITE_URL }}/blog/${{ env.ARTICLE_SLUG }} --min-score 70
```

Or use the programmatic API in a Sanity webhook or CMS publishing hook to enforce compliance before articles go live.

