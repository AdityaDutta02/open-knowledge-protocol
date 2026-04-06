---
title: Why OKP
description: The problem OKP solves — the knowledge gap between web content and AI agent requirements.
---

# Why OKP

## The Stack That Got Us Here

The web has been retrofitted for machine consumption three times. Each retrofit solved a real problem, and each left a different gap unclosed.

**RSS (2000)** solved content syndication. It let aggregators pull headlines from thousands of sites without screen-scraping. The format was flat and timely — a feed of recent items with titles, links, and publication dates. RSS told machines *what was new*. It said nothing about what anything *meant*, how concepts related to each other, or how trustworthy any given item was. It was a river of titles, not a graph of knowledge.

**JSON-LD + schema.org (2011)** solved search-engine discoverability. By embedding structured markup in HTML, publishers could tell Google that a page was a `schema.org/Article` with a specific `author`, `datePublished`, and set of `keywords`. This unlocked rich search snippets, entity recognition, and knowledge-panel entries. It was a significant leap — machines could now read *metadata about* content without parsing prose. But the vocabulary was designed for search indexing, not for reasoning. The relationships it expressed were bibliographic (who wrote it, when, about what) not semantic (what this article presupposes, what it enables, whether its claims are current).

**llms.txt (2024)** solved AI crawler orientation. The proposal — originally promoted by Anthropic — gave site owners a plain-text file at `/llms.txt` listing their content with one-line summaries. It was lightweight, zero-infrastructure, and immediately useful: a language model ingesting a site could now find the most important pages and get a quick summary of each. But it was still a flat inventory — a better table of contents, not a knowledge graph. There were no typed edges, no confidence levels, no temporal validity signals.

**MCP (Model Context Protocol, 2024)** solved tool invocation. Anthropic's open protocol defined a standard way for AI agents to call functions exposed by external servers. Any developer could build an MCP server; any MCP-compatible AI could discover and invoke its tools. This was the missing integration layer that let AI agents act on external systems, not just read them. But MCP is a transport specification — it defines the envelope, not the letter. It tells agents *how to call* a tool. It says nothing about what knowledge the tool should return, how that knowledge should be structured, or how the agent should reason about it.

**OKP (Open Knowledge Protocol, 2026)** addresses the knowledge payload gap that RSS, JSON-LD, llms.txt, and MCP each left open. It defines what the letter should contain.

---

## The Five Structural Deficiencies

When AI agents query web content — whether through RAG pipelines, MCP tools, or direct crawls — they encounter five structural gaps that degrade their reliability. These are not implementation problems; they are specification gaps. No existing standard addresses all five simultaneously.

### 1. No Semantic Identity

An article about "transformer architecture" is a blob of HTML at a URL. Nothing in that URL, its `<title>` tag, its `meta` description, or even its schema.org markup places the article into a shared conceptual namespace. A second article on a different domain, covering the same concept, is equally opaque. An agent cannot tell whether the two articles are about the same "transformer" (the neural network architecture) or different ones (the electrical device, the film franchise, the software design pattern). Without a stable `conceptId` — a persistent, kebab-case identifier in a shared graph — knowledge cannot be deduplicated, versioned, or linked across publishers.

### 2. No Relational Context

Web pages contain hyperlinks, but hyperlinks are untyped. A link from "attention mechanism" to "transformer" could mean: this is a prerequisite, this is an example, this is historical context, this is a contradiction, or this is a tangential association. Human readers infer the relationship from prose. AI agents cannot build reliable reasoning chains from untyped links. Without explicit `prerequisite`, `enables`, and `relatedTo` edges, an agent cannot determine reading order, cannot identify knowledge gaps, and cannot distinguish foundational from peripheral material.

### 3. No Temporal Validity

A page about "GPT-3 capabilities" published in 2020 looks structurally identical to one published in 2025. Both have a `datePublished` in their schema.org markup — but that date tells the agent when the article was written, not whether it is still accurate. There is no machine-readable `reviewBy` date, no `expiresAt` signal, no `confidence` field that could be set to `outdated` by a CMS automation. Agents synthesizing information across documents have no principled basis for temporal ranking, which is one of the mechanisms behind hallucination: the agent blends a stale claim from 2020 with a current one from 2025 and presents the hybrid as fact.

### 4. No Confidence Metadata

Web content exists on a spectrum from peer-reviewed fact to informed analysis to early speculation to fabrication — and that spectrum is not declared anywhere in standard markup. Dublin Core and schema.org provide bibliographic fields (author, date, subject) but no epistemic fields. An AI agent weighing claims from a "deep technical analysis" and from a "quick prediction" is flying blind. Without declared `articleType` and `confidence` levels, the agent cannot calibrate how much weight to give each source before synthesizing them into a response.

### 5. No Graph Connectivity

Even when publishers implement structured markup, each site's knowledge is a closed silo. There is no cross-publisher edge format, no protocol for traversing from a concept on one domain to a related concept on another, and no standard API for exposing graph topology. An AI agent cannot programmatically explore concept neighborhoods, trace prerequisite chains across publishers, or identify contradictions between sources. The enormous latent knowledge structure of the web is invisible to systematic traversal.

---

## What MCP Leaves Undefined

MCP is a well-designed transport protocol. It specifies session management, tool discovery, parameter schemas, error codes, and streaming. What it does not specify is the *knowledge semantics* of tool payloads. Two MCP servers can both implement a `search_articles` tool — one returning unstructured text snippets, one returning OKP-typed `KnowledgeNode` objects with full `ConceptDNA` — and both are equally valid from the MCP specification's perspective.

This is the payload gap. MCP defines the envelope. OKP defines what goes in it.

An AI agent calling a well-typed OKP tool gets back:
- A stable `conceptId` for the result
- Typed `prerequisites` and `enables` edges for graph traversal
- A `temporalValidity` block with `reviewBy` and `expiresAt` signals
- A `confidence` field (`current`, `outdated`, `disputed`, `speculative`)
- An `articleType` classification for source weighting

An agent calling an untyped tool gets back a blob of text that it must parse, interpret, and reason about with no structural guarantees. The difference in downstream reliability is not marginal.

---

## The Empirical Baseline

The scale of the problem is measurable. According to the HTTP Archive Web Almanac 2024:

- **51.25%** of web pages have *any* structured data at all — meaning nearly half of the web is entirely opaque to structured machine consumption.
- **41%** of pages use JSON-LD markup (up from 34% in 2022, a positive trend).
- **0.18%** of pages use `schema.org/Article` in their JSON-LD — the type most directly relevant to knowledge articles.

The practical implication: the vast majority of structured data on the web targets Google's rich-results system, not semantic reasoning by AI agents. Publishers have optimized for search ranking, not knowledge graph construction.

The downstream effects on AI systems are quantifiable:

- Standard RAG (retrieval-augmented generation) accuracy drops **30–45%** on multi-hop queries compared to single-hop queries (University of Texas at Austin study). Multi-hop queries are exactly the queries that benefit most from explicit graph structure — the kind OKP provides.
- The Perplexity AI incorrect answer rate is **37%** as measured by the Tow Center for Digital Journalism. A significant fraction of those errors trace to the absence of temporal validity and confidence metadata: the model has no way to distinguish current from stale, authoritative from speculative.

OKP does not claim to eliminate these failure modes. It claims to provide the structural substrate that makes principled mitigation possible. An agent that has access to `temporalValidity`, `confidence`, typed edges, and stable `conceptId` references can implement calibrated reasoning, temporal filtering, and multi-hop traversal. An agent working with raw HTML cannot, regardless of how sophisticated its model weights are.

---

## Where OKP Fits in the Stack

OKP is additive, not disruptive. Publishers who already implement schema.org markup, RSS, llms.txt, or MCP will find that OKP adds structure in the five dimensions those standards leave blank. The stack is layered, not competing:

- **RSS** handles syndication — content distribution and discovery
- **JSON-LD + schema.org** handles search discoverability — metadata for ranking systems
- **llms.txt** handles AI crawler orientation — site inventory for LLM ingestion
- **MCP** handles tool invocation — the protocol for agent-to-server communication
- **OKP** handles knowledge semantics — what knowledge tools expose and how it is structured

A publisher who implements OKP is not abandoning their existing metadata. They are extending it into the five dimensions that AI agents need and that no prior standard addresses. The `@okp/schema` package provides TypeScript types and Zod validators for every OKP field; the `@okp/validate` package scores any published URL against the five-dimensional compliance model; the `@okp/mcp-server` package wraps any OKP-compliant data source as a ready-to-deploy MCP server.

The goal is a web where the latent knowledge structure — the prerequisites, the relationships, the temporal validity, the epistemic confidence — is explicit, machine-readable, and traversable. Not because it serves search engines, but because it enables AI agents to reason accurately across it.
