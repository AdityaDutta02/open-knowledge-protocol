# Contributing to Open Knowledge Protocol

Thank you for contributing. OKP is an open standard — its quality depends on contributors who care about the semantics of knowledge, not just the mechanics of code.

---

## Prerequisites

- Node.js >= 20
- pnpm >= 9

---

## Setup

```bash
git clone https://github.com/AdityaDutta02/open-knowledge-protocol
cd open-knowledge-protocol
pnpm install
pnpm build
pnpm test
```

---

## Repo Structure

```
open-knowledge-protocol/
  packages/
    schema/        # TypeScript interfaces, Zod schemas, JSON-LD @context definitions
    mcp-server/    # MCP server factory + CMS adapter interface + built-in adapters
    llms-txt/      # /llms.txt and /llms-full.txt generator
    devtools/      # MCP server for AI coders; quickstart guides for common stacks
    validate/      # Compliance validator — scores a URL 0–100 against the OKP spec
  spec/
    v0.md          # The canonical OKP specification (source of truth for all packages)
  docs/            # Astro-based documentation site (okp.theadityadutta.com)
  paper/           # OKP whitepaper source
  benchmark/       # Compliance benchmark suite against real-world sites
```

---

## Development Workflow

1. Make changes in the relevant package under `packages/<name>/`.
2. Run that package's tests in isolation:
   ```bash
   cd packages/<name>
   pnpm test
   ```
3. Rebuild all packages from the repo root to catch cross-package breakage:
   ```bash
   pnpm build
   ```
4. Check types across the entire monorepo:
   ```bash
   pnpm typecheck
   ```
5. Changes to `@okp/schema` types almost always require updates to `@okp/validate` scoring logic — check both.

---

## Commit Conventions

This repo uses [Conventional Commits](https://www.conventionalcommits.org/). Scope to the affected package or area:

| Type | When to use |
|------|-------------|
| `feat(schema): ...` | New field, type, or exported symbol in `@okp/schema` |
| `feat(mcp-server): ...` | New tool, adapter, or capability in `@okp/mcp-server` |
| `fix(validate): ...` | Bug fix in scoring logic or CLI |
| `fix(llms-txt): ...` | Bug fix in the generator |
| `docs(spec): ...` | Changes to `spec/v0.md` or the whitepaper |
| `docs(devtools): ...` | Changes to quickstart guides |
| `test(<package>): ...` | New or updated tests |
| `refactor(<package>): ...` | Internal restructure with no behavior change |
| `chore: ...` | Tooling, deps, CI |

Each commit should represent one logical change. Do not bundle spec changes with implementation changes in the same commit.

---

## Adding a CMS Adapter

The `@okp/mcp-server` package ships a `CMSAdapter` interface that you can implement for any CMS. Built-in adapters exist for Sanity. To add a new one:

1. Create `packages/mcp-server/src/adapters/<your-cms>.ts`.
2. Implement the `CMSAdapter` interface exported from `@okp/mcp-server`:

```ts
import type { CMSAdapter, KnowledgeNode, ConceptGraph } from '@okp/mcp-server'

export class MyCMSAdapter implements CMSAdapter {
  async getNode(conceptId: string): Promise<KnowledgeNode | null> {
    // fetch a single article/concept by its OKP concept ID
  }

  async getGraph(options?: { category?: string }): Promise<ConceptGraph> {
    // return the full or filtered concept graph for this site
  }

  async search(query: string): Promise<KnowledgeNode[]> {
    // semantic or keyword search over your CMS content
  }
}
```

3. Export the adapter from `packages/mcp-server/src/index.ts`.
4. Add an integration test in `packages/mcp-server/src/adapters/<your-cms>.test.ts` using `vi.mock()` to stub the CMS client.
5. Document the adapter in `docs/src/content/adapters/<your-cms>.mdx`.

---

## PR Guidelines

- Tests are required. Every new exported function or adapter method needs a corresponding test in a co-located `.test.ts` file.
- No `console.log` in production code. Use the structured `logger` from `@okp/schema` (`logger.info`, `logger.warn`, `logger.error`).
- No `any` types without a comment explaining why the type cannot be narrowed.
- TypeScript strict mode is enabled across all packages. `pnpm typecheck` must pass cleanly.
- PRs that change `spec/v0.md` require a corresponding update to `@okp/schema` types and `@okp/validate` scoring in the same PR.
- Keep PRs focused. One feature or fix per PR makes review faster and keeps the git history meaningful.

---

## Questions

Open a [GitHub Discussion](https://github.com/AdityaDutta02/open-knowledge-protocol/discussions) for design questions or spec proposals. Use issues for bugs and concrete feature requests.
