# OKP Benchmark: Multi-Hop Knowledge Retrieval

## Purpose

This benchmark is a first-class OKP deliverable. Its goal is to produce empirical evidence for the claim that structured knowledge graphs with typed semantic relationships outperform unstructured retrieval methods for AI agents performing multi-hop reasoning over a knowledge corpus.

Multi-hop retrieval — where answering a question requires traversing two or more conceptual edges — is where the gap between flat vector search and structured graph traversal is most pronounced. This benchmark is designed to quantify that gap across five retrieval conditions on a real-world knowledge corpus.

Results from this benchmark will be cited in the OKP white paper and submitted for comparison against published GraphRAG benchmarks from Diffbot and Microsoft.

---

## Dataset

The test corpus is The Context Window (TCW) — a production AI/ML knowledge blog with ConceptDNA-populated articles. Each article carries:

- A `conceptId` and `summary`
- Typed graph edges: `prerequisites`, `enables`, `relatedTo`
- `confidence` level (`current`, `emerging`, `historical`)
- `temporalValidity` block with `publishedAt` and `reviewBy` dates

The benchmark dataset comprises **50 multi-hop questions** (requiring 2–3 graph traversal steps) and **25 single-hop control questions** (requiring 1 step). Questions are authored against the live TCW corpus and validated to ensure each has a deterministic ground-truth answer traceable to one or more published articles.

Questions are stored in:
- `benchmark/questions/multi-hop.json` — 50 questions, `requires_hops: 2` or `3`
- `benchmark/questions/single-hop.json` — 25 control questions, `requires_hops: 1`

---

## Task

For each question, the agent must retrieve relevant knowledge from the TCW corpus and produce a natural-language answer. Multi-hop questions are intentionally designed to require the agent to follow conceptual chains — for example, resolving "what enables X, given Y is a prerequisite for Z?" requires the agent to traverse at least two edges in the concept graph.

Single-hop controls confirm that retrieval quality is not degraded by the structured conditions on simpler lookups.

---

## Five Retrieval Conditions

| Condition | Description |
|-----------|-------------|
| `raw-html` | Fetch article HTML, strip tags, pass raw text to LLM |
| `schema-org` | Extract JSON-LD `Article` blocks from HTML, pass to LLM |
| `llms-txt` | Fetch `/llms.txt`, extract relevant one-line summaries, pass to LLM |
| `vector-rag` | Embed query, cosine similarity search via Sanity embeddings, pass top-k chunks to LLM |
| `okp` | Call `/api/mcp` `get_graph` tool, traverse ConceptGraph edges, pass structured context to LLM |

Each condition uses the same LLM, system prompt, and question set. Only the retrieval mechanism differs. This controls for model capability and isolates the effect of knowledge structure on answer quality.

---

## LLM

All conditions use **Claude Sonnet 4.6** with identical system prompts and temperature settings. This ensures that performance differences are attributable to the retrieval condition, not the generative model.

---

## Scoring Metrics

Four metrics are measured per condition:

1. **Answer Accuracy** — evaluated by an LLM judge (Claude Sonnet 4.6 with a grading rubric) using the `ground_truth` field. 20% of answers are additionally spot-checked by a human reviewer to calibrate judge reliability.

2. **Hallucination Rate** — percentage of answers containing claims that cannot be verified against source articles. Detected by cross-referencing answer content against the cited articles in the TCW corpus.

3. **Citation Correctness** — whether the agent cites the conceptually correct articles. Evaluated by comparing cited `conceptId`s against `expected_concept_path` in the question dataset.

4. **Reasoning Steps (Tool Calls)** — number of retrieval calls the agent made to answer the question. Lower is better for conditions with structured context; OKP is expected to require fewer calls due to pre-traversed graph context.

---

## Reproducibility

All benchmark artifacts are committed to this repository:

- Question datasets (`benchmark/questions/`)
- Scoring scripts (`benchmark/scripts/`)
- Run scripts (`benchmark/scripts/run-condition.ts`)
- Prompt templates (to be added at `benchmark/prompts/` per condition)
- Result snapshots (`benchmark/results/`)

The TCW public API serves as the live data source. The corpus snapshot used for a given benchmark run is recorded in the results file via the `site` field. Future runs against an updated corpus must be tagged with a new date to ensure comparability.

---

## How to Run

Install dependencies and run a condition against the live TCW site:

```bash
# Run OKP condition
tsx benchmark/scripts/run-condition.ts --condition okp --site https://theadityadutta.com

# Run vector-rag condition
tsx benchmark/scripts/run-condition.ts --condition vector-rag --site https://theadityadutta.com

# Run all five conditions sequentially
for condition in raw-html schema-org llms-txt vector-rag okp; do
  tsx benchmark/scripts/run-condition.ts --condition $condition --site https://theadityadutta.com
done
```

Score a results file:

```bash
tsx benchmark/scripts/score.ts benchmark/results/okp-2026-04-07.json
```

The score script outputs a JSON report with aggregate metrics. Accuracy and hallucination rate fields are marked as placeholders until the LLM judge pipeline is implemented.

---

## Validation Against Published Benchmarks

Results will be reviewed against:

- **Microsoft GraphRAG** (arXiv:2404.16130) — multi-hop QA accuracy on community-summarized knowledge graphs
- **Diffbot NLP Benchmark** — entity and relationship extraction accuracy

OKP's structured ConceptGraph is expected to match or exceed GraphRAG accuracy on the multi-hop subset while requiring fewer total tokens due to the pre-computed prerequisite chains in ConceptDNA.

---

## Status

- [x] Question dataset seeded (5 multi-hop, 3 single-hop — expand to 50/25 before paper submission)
- [x] Run and score scripts scaffolded
- [ ] Retrieval logic implemented per condition (blocked on OKP package publish + TCW deployment)
- [ ] LLM judge pipeline implemented
- [ ] Human spot-check protocol documented
- [ ] Results published
