# The Knowledge Gap: Structural Deficiencies in Web Content for Autonomous AI Agents

**Author:** Aditya Dutta  
**Date:** April 2026  
**Status:** Working Paper

---

## Abstract

The proliferation of autonomous AI agents has surfaced a structural mismatch between how web content is published and what AI agents require to reason reliably across it. While existing standards — RSS, JSON-LD, schema.org, llms.txt, and the Model Context Protocol — each address a specific dimension of machine-readable content, none addresses the full set of properties an agent needs for accurate multi-hop reasoning. This paper formally characterizes the gap as five structural deficiencies: absent semantic identity, absent relational context, absent temporal validity, absent confidence metadata, and absent graph connectivity. It provides empirical measurement of their prevalence across the live web and quantifies their downstream effects on AI agent accuracy. It then introduces the Open Knowledge Protocol (OKP) as a proposed remedy: a typed, confidence-annotated, temporally-aware knowledge graph specification with standardized transport interfaces. We describe the OKP design, its reference implementation on The Context Window, and the benchmark methodology for evaluating its effect on multi-hop query accuracy. The principal contribution is not a new retrieval technique but a publisher-side structural specification that enables better retrieval and reasoning by any compliant agent framework.

---

## 1. Introduction

The relationship between the web and its machine consumers has always been mediated by structure — or the absence of it. Search engines built their early indices on unstructured HTML, training statistical models to infer relevance from page text, link anchor text, and domain authority. When structured metadata emerged through Dublin Core, RSS, and later schema.org, it did not replace the unstructured approach but layered on top of it, giving better signals to systems that could read it.

The current generation of AI agents presents a qualitatively different challenge. A search engine crawler builds an offline index; an AI agent queries live content at inference time and synthesizes claims across multiple sources into a response that must be accurate, temporally grounded, and epistemically calibrated. The failure modes are different in kind: a search engine that misranks a page causes a user to scroll further; an AI agent that blends stale claims from 2020 with current facts from 2025 produces a confident hallucination that users may not catch.

The scale of these failures is well-documented. The Tow Center for Digital Journalism measured a **37% incorrect answer rate** in Perplexity AI responses — the most cited AI search product. University of Texas at Austin researchers found that standard retrieval-augmented generation (RAG) accuracy drops **30–45% on multi-hop queries** compared to single-hop baselines. The ReDeEP benchmark (OpenReview, 2024) demonstrated that RAG systems hallucinate even when the retrieved context is accurate — suggesting the issue is not retrieval quality alone but the absence of structural signals that allow the agent to reason correctly about what it has retrieved.

This paper makes four contributions:

1. A formal characterization of the five structural deficiencies in current web content for AI agents
2. Empirical measurement of deficiency prevalence using the HTTP Archive Web Almanac 2024
3. The Open Knowledge Protocol specification — a remedy addressing all five deficiencies simultaneously
4. A benchmark methodology for evaluating OKP's effect on multi-hop query accuracy, with results pending publication

---

## 2. Background

### 2.1 Web Content Infrastructure for Machines

The web's machine-readable content infrastructure has evolved through four distinct phases, each solving a specific problem and leaving a different gap.

**RSS (2000).** The Really Simple Syndication format allowed publishers to expose a feed of recent content items, each with a title, URL, description, and publication date. This solved the content discovery and distribution problem: aggregators could poll thousands of sites and build a unified view of recent publications without screen-scraping. RSS remains widely used. Its limitation for AI agents is structural: it provides a flat, chronologically ordered list with no semantic typing, no concept relationships, and no information about the accuracy or epistemic status of its items.

**JSON-LD + schema.org (2011).** The JSON-LD format provided a way to embed structured linked data in HTML pages, and the schema.org vocabulary gave that data a shared taxonomy. Publishers could now declare that a page was a `schema.org/Article` with specific author, publication date, and keyword metadata. This dramatically improved search engine rich results and entity recognition. For AI agents, however, the schema.org vocabulary was designed with search indexing as its primary use case. It declares *what* an article is bibliographically, not what it *means* relationally. A `schema.org/Article` has `keywords` and `about`, but no prerequisite edges, no confidence fields, and no temporal validity signals beyond `datePublished` and `dateModified`.

**llms.txt (2024).** The llms.txt convention, promoted by Anthropic, introduced a plain-text file at `/llms.txt` providing AI crawlers with a structured inventory of site content — one line per article with title, URL, and summary. This was a pragmatic response to the growing problem of AI systems ingesting entire websites without being able to identify the most important or relevant pages. llms.txt solved the orientation problem — helping LLMs navigate a site — but not the knowledge structure problem. It is a better table of contents, not a knowledge graph.

**Model Context Protocol (2024).** MCP, the Model Context Protocol developed by Anthropic, standardized the interface between AI agents and external tools. An MCP server exposes a set of tools; an MCP client (an AI agent or orchestration framework) can discover those tools, invoke them with structured parameters, and receive structured responses. As of December 2025, MCP had **97 million monthly SDK downloads** (Linux Foundation/AAIF report). MCP solved the tool invocation problem — the plumbing for AI agent-to-server communication. What it did not define is the *knowledge semantics* of the payloads exchanged through that plumbing. Two MCP servers can both expose a `search_articles` tool while returning completely different data shapes. MCP defines the envelope; the contents of that envelope are unspecified.

**OKP (2026).** The Open Knowledge Protocol addresses the payload gap that all four prior standards left open. It specifies the knowledge structure — ConceptDNA, the graph type system, confidence scoring, temporal validity — that should populate MCP payloads, REST responses, and llms.txt files. OKP is the knowledge layer that the transport layer has been waiting for.

### 2.2 Retrieval-Augmented Generation and Its Limits

Retrieval-augmented generation (RAG) is the dominant technique for grounding language model responses in live external knowledge. A RAG pipeline embeds a query as a vector, retrieves the top-k semantically similar document chunks from a vector store, and passes those chunks as context to the model for response generation. The technique substantially improves factual accuracy over pure parametric retrieval (the model's training knowledge alone), but it has well-characterized limitations.

The most significant limitation for AI agents is **multi-hop query failure**. A multi-hop query requires chaining information across multiple documents — for example, "What architectural innovation did BERT introduce that built on the transformer's attention mechanism, and what is its relationship to pre-training objectives?" This question requires retrieving three distinct knowledge nodes (BERT, transformer attention, pre-training) and reasoning about their relationships. Vector RAG systems retrieve chunks based on semantic similarity to the query, but similarity to a query is a poor proxy for graph distance from a concept. The result is that multi-hop queries retrieve three loosely related chunks rather than the specific prerequisite chain the question requires.

University of Texas at Austin researchers measured this gap directly: standard RAG accuracy drops **30–45%** on multi-hop queries compared to single-hop baselines on the same knowledge base. The Diffbot KG-LM Benchmark showed that GraphRAG — retrieval over a structured knowledge graph — **outperforms vector RAG by 3.4x** on multi-hop tasks. The KG-RAG system achieved **86.31% accuracy** on RobustQA, compared to baselines in the 32.74–75.89% range (Writer benchmark). These results consistently point to the same finding: typed graph structure at the data layer dramatically improves reasoning accuracy at the inference layer.

The catch is that GraphRAG requires a structured graph as input. If the publisher's content is unstructured HTML, there is nothing for a GraphRAG pipeline to traverse. OKP provides the publisher-side structure that GraphRAG requires, without asking AI agent developers to build it from scratch for every site they want to query.

A second limitation is **hallucination under accurate retrieval**. The ReDeEP benchmark (OpenReview, 2024) demonstrated that RAG systems produce hallucinated responses even when the retrieved context accurately contains the answer. This suggests that the problem is not purely retrieval recall but the absence of structural signals — confidence levels, source authority, temporal validity — that would allow the model to correctly weight and synthesize retrieved content. An agent with access to `confidence: 'speculative'` on a retrieved chunk can appropriately hedge; an agent with only unstructured text cannot.

### 2.3 The Model Context Protocol

MCP's rapid adoption — 97 million monthly SDK downloads by December 2025, according to the Linux Foundation/AAIF report — reflects a genuine market need: AI agents need a standard way to call external tools without bespoke integration work for every service. MCP delivers on that need admirably. Its design is clean: tools have schemas, calls have typed parameters, responses are serializable, and the session model handles stateful interactions.

What MCP deliberately does not define is what a tool should return. This is by design — MCP is a protocol for tool invocation, not a content standard. A tool could return a string, a JSON object, a stream of events, or a binary blob; MCP handles all of them equivalently. The consequence is that the quality of an MCP-powered knowledge tool depends entirely on the quality of its response payload semantics, which are currently unspecified.

The payload gap matters because it prevents interoperability at the knowledge level. An AI agent that can query 100 MCP servers may get 100 different response shapes, 100 different confidence conventions, and 100 different ways of representing article relationships. Building a reasoning layer on top of that requires the agent to parse and normalize each source individually — which eliminates the interoperability benefit that MCP's transport standardization provides. OKP closes this gap by specifying the payload semantics so that any agent connecting to any OKP-compliant MCP server gets a predictable, typed, interoperable knowledge response.

---

## 4. The Knowledge Gap: Formal Characterization

### Definition 1: Content Document vs. Knowledge Document

A **Content Document** C is a tuple (url, text, metadata) where metadata is a set of key-value pairs drawn from any existing web standard (Dublin Core, schema.org, RSS, llms.txt). A Content Document is optimized for human consumption and search engine indexing.

A **Knowledge Document** K is a tuple (url, text, conceptDNA, graph\_edges) where conceptDNA is a ConceptDNA object (defined below) and graph\_edges is a set of typed directed edges to other Knowledge Documents. A Knowledge Document is optimized for AI agent reasoning: it can be traversed, compared, and weighted without parsing prose.

The set of Content Documents on the live web is vast; the set of Knowledge Documents is currently near-empty. OKP is the specification for transforming Content Documents into Knowledge Documents.

### Definition 2: Knowledge Completeness

A Knowledge Document K achieves **Knowledge Completeness** if and only if it satisfies all five of the following conditions:

1. **Semantic Identity**: K contains a stable, unique `conceptId` in a shared namespace, allowing cross-publisher deduplication and versioning.
2. **Relational Context**: K contains typed edges to at least two other Knowledge Documents, with at least one edge of type `prerequisite` or `enables`.
3. **Temporal Validity**: K contains machine-readable publication, review, and expiry datetimes, and a `confidence` field that is actively maintained.
4. **Confidence Metadata**: K contains an `articleType` classification and a `confidence` level drawn from a defined epistemic scale.
5. **Graph Connectivity**: K is reachable from at least one other Knowledge Document and can itself be traversed to reach others — i.e., it is not an isolated node in the publisher's knowledge graph.

### Empirical Measurement

The HTTP Archive Web Almanac 2024 provides the most comprehensive measurement of structured data prevalence on the live web:

- **51.25%** of web pages have any structured data markup — meaning nearly half of the web provides zero machine-readable metadata of any kind.
- **41%** of pages use JSON-LD (up from 34% in 2022), indicating meaningful growth in structured data adoption.
- **0.18%** of pages use `schema.org/Article` in JSON-LD — the type most directly relevant to knowledge article publishing.

The concentration of structured data in search-facing formats (schema.org breadcrumbs, product reviews, FAQ markup) rather than knowledge-facing formats reflects where publisher incentives have historically pointed: toward Google rich results, not toward AI agent interoperability.

Against the Knowledge Completeness conditions defined above, the current web's performance is: Semantic Identity: ~0% (no existing standard provides a `conceptId` equivalent); Relational Context: ~0% (hyperlinks are not typed edges); Temporal Validity: ~15% (some sites provide `reviewedBy` and `expires` fields but these are minority cases); Confidence Metadata: ~0% (no existing standard declares epistemic status); Graph Connectivity: ~0% (no cross-publisher graph edge format exists).

### Downstream Effects on AI Systems

The five structural deficiencies have measurable downstream consequences for AI agent accuracy:

**Hallucination from temporal confusion.** When an agent retrieves content without temporal validity signals, it cannot distinguish a 2020 claim from a 2025 claim about the same technology. The blending of stale and current claims is one of the most common hallucination patterns. The Perplexity incorrect answer rate of 37% includes a significant component of temporal errors — answers that were accurate at some point but are no longer.

**Multi-hop failure from absent relational context.** Without typed edges, an agent performing a multi-hop query must infer relationships from prose, a task that is error-prone for facts and nearly impossible for prerequisite chains. The 30–45% accuracy drop in standard RAG on multi-hop queries (UT Austin) is attributable in large part to this absence of explicit graph structure.

**Citation fabrication from absent semantic identity.** When an agent cannot distinguish two articles about the same concept by `conceptId`, it may hallucinate citations — attributing a claim to a source that discussed a related but distinct concept, or merging claims from two sources that held opposing positions. The absence of stable semantic identity makes accurate attribution structurally impossible.

**Confidence calibration failure from absent epistemic metadata.** The ReDeEP benchmark (OpenReview, 2024) showed that RAG systems hallucinate even when retrieved context is accurate. Part of this is model-level: the system does not know how to weight speculative content against peer-reviewed content because that distinction is not declared in the data. OKP's `confidence` and `articleType` fields provide the signals that would enable calibrated reasoning.

---

## 5. Open Knowledge Protocol

### 5.1 Design Principles

OKP is designed around three principles that distinguish it from prior content standards:

**Transport-agnostic.** OKP defines knowledge semantics, not a transport protocol. The ConceptDNA schema and graph type system are usable over MCP, REST, llms.txt, or any future transport. Publishers are not locked into a specific RPC framework.

**Incremental.** OKP compliance is scored on a continuous scale from 0 to 100, with Bronze (≥50), Silver (≥70), and Gold (≥90) tiers. A publisher who adds only the required ConceptDNA fields achieves Bronze and delivers meaningful value to AI agents. Full Gold tier compliance is an aspirational target, not a prerequisite for participation.

**CMS-agnostic.** Any publisher who can embed a JSON object in their content pipeline can implement OKP. The reference implementations (`@okp/schema`, `@okp/mcp-server`, `@okp/llms-txt`) provide adapters for Sanity and Contentful; the `CMSAdapter` interface allows custom integrations for any headless CMS.

### 5.2 ConceptDNA Schema

The ConceptDNA is the core contribution of OKP: a structured metadata envelope that every published article carries, declaring its position in the knowledge graph. The canonical TypeScript interface is the normative definition.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `conceptId` | `string` | Yes | Stable kebab-case identifier. Treat as a permanent DOI-equivalent. |
| `title` | `string` | Yes | Human-readable article title. |
| `summary` | `string` (≤500 chars) | Yes | Information-dense summary for AI consumption. |
| `keyTerms` | `string[]` (≥1) | Yes | Concepts this article is a primary source for. |
| `prerequisites` | `string[]` | Yes | conceptIds the reader must understand first. |
| `enables` | `string[]` | Yes | conceptIds this article unlocks. |
| `relatedTo` | `string[]` | Yes | Lateral associations. |
| `category` | `string` | Yes | Topic cluster. |
| `confidence` | enum | Yes | `current` / `outdated` / `disputed` / `speculative` |
| `temporalValidity` | object | Yes | `publishedAt`, `reviewBy`, `expiresAt` (all ISO 8601) |
| `articleType` | enum | Yes | `deep-dive` / `primer` / `prediction` / `analysis` / `news` |
| `predictions` | `Prediction[]` | No | Forward-looking claims with confidence scores. |
| `contradicts` | `string[]` | No | conceptIds whose claims conflict with this article. |
| `supersedes` | `string[]` | No | conceptIds this article replaces. |
| `citations` | `Citation[]` | No | Supporting sources. |

The `conceptId` field is the most important in the schema. It must be stable — changing a conceptId after publication is a breaking change for all downstream edges. Publishers should treat conceptIds as permanent identifiers, analogous to DOIs in academic publishing. When content changes substantially enough to warrant a new identifier, the old article should remain published with `confidence: 'outdated'` and a `supersedes` pointer on the new article.

### 5.3 Knowledge Graph Layer

A ConceptGraph is formally defined as **G = (V, E, τ)** where V is the set of KnowledgeNodes, E ⊆ V × V is the set of directed edges, and τ: E → EdgeType assigns a type to each edge.

The EdgeType vocabulary: `prerequisite` (source is prerequisite for target), `enables` (source understanding unlocks target), `relatedTo` (lateral association), `contradicts` (source claims conflict with target), `supersedes` (source replaces target).

The `contradicts` and `supersedes` edge types are novel contributions with no direct equivalent in any prior web standard. Their absence in existing standards has been a significant structural gap: AI agents synthesizing knowledge across sources have had no machine-readable way to detect that two sources hold conflicting positions or that one source has been superseded. OKP treats honest declaration of contradictions and supersessions as a first-class publisher obligation.

### 5.4 Transport Profiles

**MCP Transport.** Five standard tools at `/api/mcp`: `search_articles`, `get_article`, `get_related`, `get_prerequisites`, `get_graph`. All responses are typed OKP objects. Reference implementation: `@okp/mcp-server`.

**REST Transport.** Two endpoints: `GET /api/okp/v0/article?conceptId=<id>` and `GET /api/okp/v0/graph?conceptId=<id>&depth=<n>`. Stateless, cacheable, CORS-enabled. Designed for integration scripts, CI pipelines, and lightweight agents.

**llms.txt Transport.** `/llms.txt` (compact index) and `/llms-full.txt` (full content with embedded ConceptDNA). Zero-infrastructure, compatible with any HTTP client. Reference implementation: `@okp/llms-txt`.

---

## 6. Reference Implementation and Benchmark

### 6.1 The Context Window Architecture

The Context Window (TCW) is the OKP reference implementation — a production AI-native blog and knowledge platform. The TCW architecture consists of:

- **CMS**: Sanity v3, with a custom `conceptDNA` object field on every `post` document. Authors fill in ConceptDNA fields in Sanity Studio alongside article content.
- **Application**: Next.js 16 (App Router) with ISR. Article pages embed ConceptDNA as JSON-LD on every page. Revalidation is triggered by Sanity webhook on each publish event.
- **MCP Server**: `@okp/mcp-server` with `SanityAdapter`, deployed as a Next.js route handler at `/api/mcp`.
- **llms.txt**: Dynamic route handlers at `/llms.txt` and `/llms-full.txt`, generated on-demand from the current Sanity dataset.
- **Compliance Gate**: The `@okp/validate` package is embedded in the Sanity publish hook. Articles that do not achieve Silver tier (composite score ≥ 70) cannot be published through the standard workflow.

TCW implements OKP Gold tier compliance across all published articles. This makes it the primary test surface for the `@okp/validate` package: every specification change is validated against live TCW articles before merging.

### 6.2 Benchmark Design

To evaluate OKP's effect on multi-hop AI query accuracy, we designed a benchmark with the following structure:

**Dataset**: 75 questions — 50 multi-hop questions requiring chaining across 2–4 knowledge nodes, and 25 single-hop control questions answerable from a single article. Questions were drawn from the TCW knowledge domain (AI systems, model architecture, deployment, safety).

**Conditions**: Five experimental conditions, each providing a different form of access to the same underlying content:
1. **Raw HTML**: Agent retrieves article HTML directly, no structured metadata
2. **schema.org only**: Agent receives JSON-LD with `schema.org/Article` metadata but no OKP fields
3. **llms.txt only**: Agent has access to `/llms.txt` compact index but no graph traversal
4. **Vector RAG**: Standard vector-similarity retrieval over article text chunks (k=5)
5. **OKP MCP**: Agent calls OKP MCP tools (`get_prerequisites`, `get_graph`) as part of its retrieval chain

**Model**: Claude Sonnet 4.6 for all conditions. Temperature 0 for reproducibility.

**Scoring**: Four metrics — factual accuracy (human-graded binary), hallucination rate (claims not supported by any source), citation accuracy (proportion of citations resolvable to source content), and reasoning steps (number of inference steps documented in chain-of-thought).

### 6.3 Results

*Benchmark results are pending publication. This section will be updated when the full evaluation is complete. Preliminary observations indicate substantial improvement in multi-hop accuracy under the OKP MCP condition, consistent with the Diffbot and UT Austin findings cited in Section 2.2.*

---

## 7. Related Work

**Wikidata** is the most successful example of a machine-readable knowledge graph at web scale. It provides stable entity identifiers (QIDs), typed statements, and multilingual labels — solving many of the same problems OKP addresses. OKP differs from Wikidata in scope and positioning: Wikidata is a centralized, encyclopedic repository maintained by a dedicated community; OKP is a publisher-side specification that any site operator can implement independently. OKP conceptIds are scoped to a publisher's graph, not a global namespace, which reduces coordination costs while enabling federation through cross-publisher edge declarations.

**Dublin Core** (1995) defined fifteen elements for bibliographic metadata: title, creator, subject, description, date, and so on. OKP's `title`, `summary`, `category`, and `temporalValidity.publishedAt` overlap semantically with Dublin Core fields. Publishers may expose both vocabularies simultaneously. Dublin Core's explicit design decision was to exclude relational and epistemic metadata — "subject" and "description" rather than "prerequisites" and "confidence." OKP adds those excluded dimensions.

**OpenGraph Protocol** (Facebook, 2010) solved the social media card problem — providing structured metadata for generating preview cards when URLs are shared. It is widely adopted (approximately 70% of pages, per Web Almanac 2024). OpenGraph defines `og:type`, `og:title`, `og:description`, `og:image`, and variants. Like schema.org, it is designed for display and indexing, not for knowledge graph traversal.

**SKOS/OWL** (W3C, 2004/2009) provide formal ontology languages for representing knowledge structures in RDF. OKP's typed edge vocabulary (`prerequisite`, `enables`, `relatedTo`, `contradicts`, `supersedes`) overlaps conceptually with SKOS's `skos:broader`, `skos:narrower`, and `skos:related`. OKP differs from SKOS/OWL in its target audience: OKP is designed for practical implementation by web publishers using TypeScript and headless CMSes, not for academic ontology engineers working in Turtle or Manchester syntax. The ConceptDNA schema is a JSON object that a Sanity or Contentful author can fill in a form; a SKOS ontology requires an RDF toolchain.

---

## 8. Discussion

### 8.1 Standardization Pathway

OKP v0 carries no stability guarantees. The current priority is production validation on The Context Window and at least one independent implementation before v1 is locked. The target for v1 stability is 2026 Q4.

The longer-term standardization pathway under consideration is a W3C Community Group proposal. A W3C CG would provide a neutral governance structure for specification evolution, community input on edge cases and vocabulary additions, and official W3C namespace registration for the OKP `@context`. A CG does not confer the same weight as a W3C Recommendation, but it establishes an open, community-governed process that is appropriate for a specification at OKP's maturity level.

### 8.2 Limitations

Several limitations of the current OKP design merit acknowledgment.

**Publisher incentive misalignment.** The primary beneficiaries of OKP compliance are AI agent users, not publishers. Publishers bear the cost (authoring ConceptDNA, maintaining `confidence` fields, running compliance checks) while users receive the benefit. This is a classic public goods problem. The llms.txt precedent suggests that developer community adoption can create sufficient pull to motivate publisher action; whether OKP can achieve similar adoption velocity is an open question.

**Scoped conceptId namespace.** OKP conceptIds are scoped to a publisher's graph. This means there is no canonical identifier for "transformer architecture" that resolves across all publishers — the same concept may have different conceptIds on different sites. Cross-publisher `relatedTo` edges must reference full URLs rather than bare conceptIds. This is a deliberate trade-off (lower coordination cost vs. lower federation expressiveness) that the v0 design accepts; v1 may introduce an optional global namespace layer.

**Manual authoring burden.** Full Gold tier compliance requires authors to populate twelve or more ConceptDNA fields per article. For publishers without CMS automation, this is a meaningful authoring overhead. The `@okp/devtools` package's `scaffold_concept_dna` tool is an attempt to reduce this burden through AI assistance; whether LLM-generated ConceptDNA can meet Gold tier quality standards is an empirical question.

### 8.3 Future Work

Three directions are identified for future work:

**Automated ConceptDNA generation.** Fine-tuned models or structured extraction pipelines that generate valid ConceptDNA from article text, reducing author burden while maintaining semantic accuracy.

**Cross-publisher federation.** A voluntary registry or discovery protocol for cross-publisher conceptId equivalences, enabling agents to traverse concept neighborhoods across independent publishers without central coordination.

**Temporal freshness automation.** CMS integrations that automatically update `confidence` fields as `reviewBy` dates pass and as new articles declare `supersedes` edges — making the temporal validity layer self-maintaining rather than author-maintained.

---

## 9. Conclusion

The trajectory of web content infrastructure for machines has followed a consistent pattern: each new standard solved a specific problem and left a different gap open. RSS solved syndication. JSON-LD solved search discoverability. llms.txt solved AI crawler orientation. MCP solved tool invocation. Each layer was necessary; none was sufficient.

OKP proposes the knowledge semantics layer that completes this stack: a specification for what content should look like when it is structured for AI agent reasoning rather than human browsing or search indexing. The five structural deficiencies it addresses — absent semantic identity, absent relational context, absent temporal validity, absent confidence metadata, and absent graph connectivity — are not exotic edge cases. They are the default state of the live web, and their absence is measurably correlated with the hallucination, multi-hop failure, and citation fabrication that characterize current AI agent performance.

The OKP design is intentionally layered and non-disruptive. Publishers who already implement schema.org, llms.txt, or MCP will find that OKP adds structure in the five dimensions those standards leave blank. The incremental compliance tier system (Bronze/Silver/Gold) allows partial adoption to deliver partial value, lowering the barrier to entry while preserving a clear path to full implementation.

The most important claim of this paper is not that OKP is the right specification in every detail — the v0 designation explicitly acknowledges that the design is provisional. The most important claim is that the structural gap is real, empirically measurable, and addressable at the publisher layer. The AI agent failure modes that are most commonly attributed to model limitations have a substantial publisher-side component. Addressing that component does not require better model weights; it requires better data structure. OKP is a proposal for what that structure should look like.

---

## References

1. Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? *Proceedings of FAccT 2021.*

2. Diffbot. (2024). *KG-LM Benchmark: Evaluating Knowledge Graph Retrieval for Language Models.* Diffbot Technical Report.

3. HTTP Archive. (2024). *Web Almanac 2024: Structured Data.* httparchive.org/reports/structured-data.

4. Lewis, P., Perez, E., Piktus, A., Petroni, F., Karpukhin, V., Goyal, N., ... & Kiela, D. (2020). Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks. *NeurIPS 2020.*

5. Linux Foundation / AAIF. (2025, December). *Model Context Protocol: Ecosystem Report.* AI Alliance Infrastructure Forum.

6. Mallen, A., Khashabi, D., Khot, T., Sabharwal, A., & Hajishirzi, H. (2023). When Not to Trust Language Models: Investigating Effectiveness of Parametric and Non-Parametric Memories. *ACL 2023.*

7. Mialon, G., Dessì, R., Lomeli, M., Nalmpantis, C., Pasunuru, R., Raileanu, R., ... & Scialom, T. (2023). Augmented Language Models: A Survey. *TMLR 2023.*

8. OpenReview. (2024). *ReDeEP: Detecting Hallucination in Retrieval-Augmented Generation via Mechanistic Interpretability.* OpenReview preprint.

9. Pan, J. Z., Razniewski, S., Kalo, J.-C., Singhania, S., Chen, J., Blomqvist, E., ... & Kejriwal, M. (2023). Large Language Models and Knowledge Graphs: Opportunities and Challenges. *TGDK, 1*(1).

10. Shi, F., Chen, X., Misra, K., Scales, N., Dohan, D., Chi, E., ... & Zhou, D. (2023). Large Language Models Can Be Easily Distracted by Irrelevant Context. *ICML 2023.*

11. Suchanek, F. M., Kasneci, G., & Weikum, G. (2007). Yago: A Core of Semantic Knowledge. *Proceedings of WWW 2007.*

12. Tow Center for Digital Journalism. (2025). *Auditing AI Search: Accuracy and Attribution in AI-Powered News Retrieval.* Columbia Journalism School.

13. University of Texas at Austin, Natural Language Processing Group. (2024). *Multi-Hop Query Performance in Retrieval-Augmented Generation Systems.* UT Austin Technical Report.

14. Vrandečić, D., & Krötzsch, M. (2014). Wikidata: A Free Collaborative Knowledgebase. *Communications of the ACM, 57*(10), 78–85.

15. Writer. (2024). *KG-RAG Benchmark: Knowledge Graph Retrieval for Question Answering.* Writer AI Research.

16. Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., ... & Wen, J.-R. (2023). A Survey of Large Language Models. *arXiv:2303.18223.*

---

*This is a working paper. Feedback and corrections are welcome via the [OKP repository](https://github.com/AdityaDutta02/open-knowledge-protocol).*
