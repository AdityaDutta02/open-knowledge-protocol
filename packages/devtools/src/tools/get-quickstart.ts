import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export type SupportedStack = 'nextjs-sanity' | 'nextjs-contentful' | 'astro-md';

const QUICKSTART_FILES: Record<SupportedStack, string> = {
  'nextjs-sanity': join(__dirname, '../quickstart/nextjs-sanity.md'),
  'nextjs-contentful': join(__dirname, '../quickstart/nextjs-contentful.md'),
  'astro-md': join(__dirname, '../quickstart/astro-md.md'),
};

/**
 * Returns the full quickstart guide for a given stack.
 * Loaded from embedded markdown files so the MCP server works offline.
 */
export function getQuickstart(stack: SupportedStack): string {
  const filePath = QUICKSTART_FILES[stack];
  if (!filePath) throw new Error(`Unknown stack: ${stack}. Supported: ${Object.keys(QUICKSTART_FILES).join(', ')}`);
  return readFileSync(filePath, 'utf-8');
}
