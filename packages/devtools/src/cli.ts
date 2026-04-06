#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createDevtoolsServer } from './server.js';

const server = createDevtoolsServer();
const transport = new StdioServerTransport();

await server.connect(transport);
