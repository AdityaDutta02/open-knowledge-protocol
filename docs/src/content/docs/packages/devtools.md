---
title: "@okp/devtools"
description: MCP server for AI coding assistants implementing OKP. Add to Claude Code or Cursor once.
---

# @okp/devtools

An MCP server designed for developers implementing OKP. Add it to Claude Code, Cursor, or any MCP-compatible AI coding assistant once, and your AI assistant gains full knowledge of the OKP specification, schemas, and quickstart guides  -  without having to re-explain context in every session.

## Installation

```bash
pnpm add -D @okp/devtools
# or
npm install --save-dev @okp/devtools
```

## What This Package Provides

`@okp/devtools` exposes five tools through its MCP server:

| Tool | Description |
|------|-------------|
| `get_quickstart` | Returns the step-by-step quickstart guide for a given stack (`nextjs-sanity`, `nextjs-contentful`, `astro-md`) |
| `scaffold_concept_dna` | Generates a starter `ConceptDNA` object for a given article title and topic category |
| `get_schema` | Returns the full TypeScript interface for any OKP type (`ConceptDNA`, `KnowledgeNode`, `ConceptGraph`, etc.) |
| `validate_implementation` | Validates a `ConceptDNA` object against the Zod schema and returns field-level errors with remediation hints |
| `generate_mcp_config` | Generates the MCP config block for adding an OKP endpoint to Claude Code or Cursor settings |

## Adding to Claude Code

Add `@okp/devtools` to your Claude Code MCP server configuration at `~/.claude/settings.json`:

```json
{
  "mcpServers": {
    "okp-devtools": {
      "type": "stdio",
      "command": "npx",
      "args": ["@okp/devtools"]
    }
  }
}
```

After saving, Claude Code will automatically discover the five tools the next time it starts. You can then ask Claude Code things like:

- "Show me the Next.js + Sanity quickstart"
- "Generate a ConceptDNA scaffold for my article about RAG pipelines"
- "Validate this ConceptDNA object"
- "Generate my MCP config for deploying to Vercel"

## Adding to Cursor

In Cursor's MCP settings (`.cursor/mcp.json`):

```json
{
  "mcpServers": {
    "okp-devtools": {
      "command": "npx",
      "args": ["@okp/devtools"]
    }
  }
}
```

## Tool Details

### `get_quickstart`

Returns the full step-by-step implementation guide for a stack:

```
get_quickstart({ stack: "nextjs-sanity" })
get_quickstart({ stack: "nextjs-contentful" })
get_quickstart({ stack: "astro-md" })
```

### `scaffold_concept_dna`

Generates a starter `ConceptDNA` with all required fields pre-populated based on the article title and category you provide:

```
scaffold_concept_dna({
  title: "Introduction to Transformer Architecture",
  category: "machine-learning"
})
```

Returns a JSON object ready to paste into your CMS or source file.

### `get_schema`

Returns the TypeScript interface definition for any OKP type:

```
get_schema({ type: "ConceptDNA" })
get_schema({ type: "KnowledgeNode" })
get_schema({ type: "ConceptGraph" })
```

### `validate_implementation`

Validates a `ConceptDNA` object and returns structured validation results:

```
validate_implementation({
  conceptDNA: {
    conceptId: "transformer-architecture",
    title: "Transformer Architecture",
    // ...
  }
})
```

Returns `{ valid: boolean, errors: FieldError[], warnings: string[] }`.

### `generate_mcp_config`

Generates the MCP configuration block for a deployed OKP endpoint:

```
generate_mcp_config({
  siteUrl: "https://your-site.com",
  serverName: "my-blog-okp"
})
```

Returns the JSON snippet to paste into Claude Code or Cursor settings.

