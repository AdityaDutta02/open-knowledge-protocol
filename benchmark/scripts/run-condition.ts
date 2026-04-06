#!/usr/bin/env node
/**
 * Run benchmark questions against one retrieval condition.
 * Usage: tsx benchmark/scripts/run-condition.ts --condition okp --site https://theadityadutta.com
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';

type Condition = 'raw-html' | 'schema-org' | 'llms-txt' | 'vector-rag' | 'okp';

const conditionIdx = process.argv.indexOf('--condition');
const siteIdx = process.argv.indexOf('--site');

const CONDITION = (conditionIdx >= 0 ? process.argv[conditionIdx + 1] : 'okp') as Condition;
const SITE_URL = siteIdx >= 0 ? process.argv[siteIdx + 1] : undefined;

if (!SITE_URL) throw new Error('--site is required');

interface Question {
  id: string;
  question: string;
  ground_truth: string;
  requires_hops: number;
  expected_concept_path: string[];
}

interface AnswerResult {
  id: string;
  condition: Condition;
  question: string;
  answer: string;
  tool_calls: number;
  latency_ms: number;
  error: string | null;
}

const questions = JSON.parse(readFileSync('benchmark/questions/multi-hop.json', 'utf-8')) as Question[];

// TODO: Implement retrieval per condition after packages are published and TCW is OKP-enabled.
// Each condition:
//   raw-html: fetch page HTML, strip tags, pass to LLM
//   schema-org: extract JSON-LD blocks, pass to LLM
//   llms-txt: fetch /llms.txt, extract relevant entry, pass to LLM
//   vector-rag: embed query, cosine similarity search via Sanity embeddings, pass top-k to LLM
//   okp: call /api/mcp get_graph tool, traverse ConceptGraph, pass structured context to LLM
async function runQuestion(q: Question): Promise<AnswerResult> {
  const start = Date.now();
  return {
    id: q.id,
    condition: CONDITION,
    question: q.question,
    answer: 'PLACEHOLDER — implement retrieval per condition',
    tool_calls: 0,
    latency_ms: Date.now() - start,
    error: null,
  };
}

const results = await Promise.all(questions.map(runQuestion));
mkdirSync('benchmark/results', { recursive: true });
const outPath = `benchmark/results/${CONDITION}-${new Date().toISOString().slice(0, 10)}.json`;
writeFileSync(outPath, JSON.stringify(results, null, 2));
process.stdout.write(`Results written to ${outPath}\n`);
