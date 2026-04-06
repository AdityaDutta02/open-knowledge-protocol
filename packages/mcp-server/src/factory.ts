import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import type { CMSAdapter } from './adapter.js';
import { OKP_TOOLS } from './tools.js';

export interface OKPServerConfig {
  adapter: CMSAdapter;
  /** Server name reported to MCP clients. Default: 'okp-mcp-server' */
  name?: string;
  /** Server version. Default: '0.0.1' */
  version?: string;
}

const SearchInputSchema = z.object({ query: z.string().min(1) });
const ConceptIdInputSchema = z.object({ conceptId: z.string().min(1) });
const GraphInputSchema = z.object({
  conceptId: z.string().min(1),
  depth: z.number().int().min(1).max(4).default(2),
});

function handleSearchArticles(adapter: CMSAdapter, args: unknown) {
  const { query } = SearchInputSchema.parse(args);
  return adapter.searchArticles(query);
}

function handleGetArticle(adapter: CMSAdapter, args: unknown) {
  const { conceptId } = ConceptIdInputSchema.parse(args);
  return adapter.getArticle(conceptId);
}

function handleGetRelated(adapter: CMSAdapter, args: unknown) {
  const { conceptId } = ConceptIdInputSchema.parse(args);
  return adapter.getRelated(conceptId);
}

function handleGetPrerequisites(adapter: CMSAdapter, args: unknown) {
  const { conceptId } = ConceptIdInputSchema.parse(args);
  return adapter.getPrerequisites(conceptId);
}

function handleGetGraph(adapter: CMSAdapter, args: unknown) {
  const { conceptId, depth } = GraphInputSchema.parse(args);
  return adapter.getGraph(conceptId, depth);
}

/**
 * Create a fully-wired OKP MCP server from a CMSAdapter.
 *
 * @example
 * const server = createOKPServer({ adapter: new SanityAdapter(config) });
 * const transport = new StdioServerTransport();
 * await server.connect(transport);
 */
export function createOKPServer(config: OKPServerConfig): Server {
  const server = new Server(
    {
      name: config.name ?? 'okp-mcp-server',
      version: config.version ?? '0.0.1',
    },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: OKP_TOOLS,
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    try {
      switch (name) {
        case 'search_articles': {
          const nodes = await handleSearchArticles(config.adapter, args);
          return { content: [{ type: 'text', text: JSON.stringify(nodes, null, 2) }] };
        }
        case 'get_article': {
          const { conceptId } = ConceptIdInputSchema.parse(args);
          const node = await config.adapter.getArticle(conceptId);
          if (!node) {
            return {
              content: [{ type: 'text', text: `No article found with conceptId: ${conceptId}` }],
              isError: true,
            };
          }
          return { content: [{ type: 'text', text: JSON.stringify(node, null, 2) }] };
        }
        case 'get_related': {
          const nodes = await handleGetRelated(config.adapter, args);
          return { content: [{ type: 'text', text: JSON.stringify(nodes, null, 2) }] };
        }
        case 'get_prerequisites': {
          const chain = await handleGetPrerequisites(config.adapter, args);
          return { content: [{ type: 'text', text: JSON.stringify(chain, null, 2) }] };
        }
        case 'get_graph': {
          const graph = await handleGetGraph(config.adapter, args);
          return { content: [{ type: 'text', text: JSON.stringify(graph, null, 2) }] };
        }
        default:
          return {
            content: [{ type: 'text', text: `Unknown tool: ${name}` }],
            isError: true,
          };
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        content: [{ type: 'text', text: `Tool error: ${message}` }],
        isError: true,
      };
    }
  });

  return server;
}
