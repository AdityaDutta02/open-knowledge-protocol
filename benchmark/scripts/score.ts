#!/usr/bin/env node
/**
 * Score benchmark results.
 * Usage: tsx benchmark/scripts/score.ts benchmark/results/okp-2026-04-06.json
 */
import { readFileSync } from 'node:fs';

interface AnswerResult {
  id: string;
  condition: string;
  question: string;
  answer: string;
  tool_calls: number;
  latency_ms: number;
  error: string | null;
}

interface ScoreReport {
  condition: string;
  total: number;
  answered: number;
  errors: number;
  avg_tool_calls: number;
  avg_latency_ms: number;
  // Populated after manual spot-check or LLM judge
  accuracy_placeholder: string;
  hallucination_rate_placeholder: string;
}

const resultsPath = process.argv[2];
if (!resultsPath) throw new Error('Usage: tsx score.ts <results-file.json>');

const results = JSON.parse(readFileSync(resultsPath, 'utf-8')) as AnswerResult[];
const answered = results.filter((r) => r.error === null);

const report: ScoreReport = {
  condition: results[0]?.condition ?? 'unknown',
  total: results.length,
  answered: answered.length,
  errors: results.filter((r) => r.error !== null).length,
  avg_tool_calls: answered.reduce((s, r) => s + r.tool_calls, 0) / (answered.length || 1),
  avg_latency_ms: answered.reduce((s, r) => s + r.latency_ms, 0) / (answered.length || 1),
  accuracy_placeholder: 'TODO: run LLM judge or manual spot-check',
  hallucination_rate_placeholder: 'TODO: verify claims against source articles',
};

process.stdout.write(JSON.stringify(report, null, 2) + '\n');
