---
title: Showcase
description: The Context Window (TCW)  -  the OKP reference implementation.
---

# Showcase

## The Context Window (TCW)

The Context Window is the reference implementation for OKP. It is a production AI-native blog and knowledge platform  -  simultaneously a human-readable publication and a machine-queryable knowledge base for AI agents.

### What TCW Demonstrates

TCW implements every OKP compliance tier in production:

**Full ConceptDNA on every article.** Each published article carries a complete `ConceptDNA` object, including `conceptId`, `keyTerms`, `prerequisites`, `enables`, `relatedTo` edges, `confidence`, `articleType`, and `temporalValidity`. The ConceptDNA is embedded as a JSON-LD script tag on every article page, making it discoverable by any AI crawler that follows the OKP spec.

**Live MCP endpoint.** TCW exposes the five standard OKP tools  -  `search_articles`, `get_article`, `get_related`, `get_prerequisites`, `get_graph`  -  at a live MCP endpoint. AI agents and coding assistants can connect to this endpoint directly to query the TCW knowledge graph. The endpoint is powered by `@okp/mcp-server` with a Sanity adapter.

**llms.txt and llms-full.txt.** Both files are served dynamically and update automatically when new articles are published. The compact `/llms.txt` provides AI crawlers with a structured index of all published articles with summaries. The `/llms-full.txt` variant includes full article text with embedded ConceptDNA for each node.

**Prediction tracking.** Forward-looking articles on TCW include `predictions` arrays  -  structured claims with confidence scores, target dates, and resolution status. As predictions resolve, the ConceptDNA is updated to reflect outcomes, creating a living track record that AI agents can query.

**Topic cluster graph.** Articles on TCW are organized into topic clusters  -  `machine-learning`, `deployment`, `ai-agents`, `infrastructure`, and others. The graph topology (prerequisite chains, concept neighborhoods, contradictions between articles) is queryable through both the MCP and REST transport profiles.

### Architecture

TCW is built on Next.js 16 (App Router) with Sanity as the CMS. The knowledge graph is stored in Sanity's structured content, and OKP outputs (MCP server, JSON-LD, llms.txt) are generated server-side by the `@okp/*` package suite. ISR ensures that graph changes propagate within minutes of a Sanity webhook trigger.

The Sanity document schema for articles includes a `conceptDNA` object field that mirrors the full `ConceptDNA` TypeScript interface. Authors fill in the ConceptDNA fields in Sanity Studio alongside the article content. The `@okp/validate` package is embedded in the Sanity publishing hook to enforce a minimum Silver tier compliance score before an article goes live.

### TCW as a Development Target

Because TCW is OKP Gold tier in production, it serves as the primary test surface for the `@okp/validate` package. Every spec change is validated against TCW before it is merged to the specification. Developers implementing OKP in their own projects can compare their `npx okp validate` output against TCW's to understand what Gold tier looks like in practice.

The TCW MCP endpoint is publicly accessible. You can add it to Claude Code or any MCP-compatible AI assistant to see firsthand what an OKP-structured knowledge source looks like from the agent's perspective  -  and use that as a benchmark for your own implementation.

