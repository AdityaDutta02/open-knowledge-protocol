import type { Tool } from '@modelcontextprotocol/sdk/types.js';

/** The 5 standard OKP MCP tool definitions. */
export const OKP_TOOLS: Tool[] = [
  {
    name: 'search_articles',
    description:
      'Search OKP-structured articles by semantic similarity. Returns ranked KnowledgeNodes with full ConceptDNA.',
    inputSchema: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Natural language search query' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_article',
    description:
      'Retrieve a specific article by conceptId, including full ConceptDNA metadata.',
    inputSchema: {
      type: 'object',
      properties: {
        conceptId: {
          type: 'string',
          description: 'The conceptId of the article to retrieve',
        },
      },
      required: ['conceptId'],
    },
  },
  {
    name: 'get_related',
    description:
      'Get articles related to a concept via all edge types (enables, relatedTo, contradicts).',
    inputSchema: {
      type: 'object',
      properties: {
        conceptId: {
          type: 'string',
          description: 'The conceptId to find related articles for',
        },
      },
      required: ['conceptId'],
    },
  },
  {
    name: 'get_prerequisites',
    description: 'Get the full prerequisite chain for a concept. Traverses transitively.',
    inputSchema: {
      type: 'object',
      properties: {
        conceptId: {
          type: 'string',
          description: 'The conceptId to get prerequisites for',
        },
      },
      required: ['conceptId'],
    },
  },
  {
    name: 'get_graph',
    description:
      'Traverse the OKP knowledge graph from a concept. Returns nodes and typed edges up to a given depth.',
    inputSchema: {
      type: 'object',
      properties: {
        conceptId: { type: 'string', description: 'Root concept to traverse from' },
        depth: {
          type: 'number',
          description: 'Hops to traverse. Default: 2. Max: 4.',
          default: 2,
        },
      },
      required: ['conceptId'],
    },
  },
];
