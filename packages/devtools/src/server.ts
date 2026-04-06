import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { getToolDefinitions } from './tool-definitions.js';
import { getQuickstart } from './tools/get-quickstart.js';
import { scaffoldConceptDNA } from './tools/scaffold-concept-dna.js';
import { getSchemaForEntity } from './tools/get-schema.js';
import { generateMcpConfig } from './tools/generate-mcp-config.js';
import { validateImplementation } from './tools/validate-impl.js';

async function dispatchTool(name: string, a: Record<string, unknown>): Promise<string> {
  switch (name) {
    case 'get_quickstart':
      return getQuickstart(z.string().parse(a['stack']) as never);
    case 'scaffold_concept_dna':
      return scaffoldConceptDNA(z.string().parse(a['articleType']) as never);
    case 'get_schema':
      return getSchemaForEntity(z.string().parse(a['entity']) as never);
    case 'validate_implementation':
      return validateImplementation(z.string().url().parse(a['url']));
    case 'generate_mcp_config':
      return generateMcpConfig(z.string().parse(a['cms']) as never, z.string().url().parse(a['siteUrl']));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export function createDevtoolsServer(): Server {
  const server = new Server(
    { name: 'okp-devtools', version: '0.0.1' },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: getToolDefinitions(),
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const a = args as Record<string, unknown>;
    try {
      const text = await dispatchTool(name, a);
      return { content: [{ type: 'text', text }] };
    } catch (err) {
      return { content: [{ type: 'text', text: String(err) }], isError: true };
    }
  });

  return server;
}
