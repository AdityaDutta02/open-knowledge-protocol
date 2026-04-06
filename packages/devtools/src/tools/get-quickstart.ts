import nextjsSanityContent from '../quickstart/nextjs-sanity.md';
import nextjsContentfulContent from '../quickstart/nextjs-contentful.md';
import astroMdContent from '../quickstart/astro-md.md';

export type SupportedStack = 'nextjs-sanity' | 'nextjs-contentful' | 'astro-md';

const QUICKSTART_CONTENT: Record<SupportedStack, string> = {
  'nextjs-sanity': nextjsSanityContent,
  'nextjs-contentful': nextjsContentfulContent,
  'astro-md': astroMdContent,
};

/**
 * Returns the full quickstart guide for a given stack.
 * Content is inlined at build time via tsup loader so the MCP server works offline.
 */
export function getQuickstart(stack: SupportedStack): string {
  const content = QUICKSTART_CONTENT[stack];
  if (!content) throw new Error(`Unknown stack: ${stack}. Supported: ${Object.keys(QUICKSTART_CONTENT).join(', ')}`);
  return content;
}
