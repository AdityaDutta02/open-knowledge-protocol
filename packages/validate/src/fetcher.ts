import type { ConceptDNA } from '@okp/schema';

export interface FetchedOKPData {
  /** ConceptDNA found in JSON-LD on the page, if any */
  conceptDNA: Partial<ConceptDNA> | null;
  /** Whether an MCP endpoint was detected at /api/mcp */
  hasMcpEndpoint: boolean;
  /** Whether a llms.txt was found at /llms.txt */
  hasLlmsTxt: boolean;
  /** Raw JSON-LD blocks found on the page */
  jsonLdBlocks: Record<string, unknown>[];
}

/**
 * Fetch OKP-relevant data from a site URL.
 * Checks the page for JSON-LD blocks, /api/mcp, and /llms.txt.
 */
export async function fetchOKPData(siteUrl: string): Promise<FetchedOKPData> {
  const base = siteUrl.replace(/\/$/, '');

  const [pageRes, mcpRes, llmsRes] = await Promise.allSettled([
    fetch(base, { headers: { Accept: 'text/html' } }),
    fetch(`${base}/api/mcp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'tools/list', id: 1 }),
    }),
    fetch(`${base}/llms.txt`),
  ]);

  const hasMcpEndpoint = mcpRes.status === 'fulfilled' && mcpRes.value.ok;
  const hasLlmsTxt = llmsRes.status === 'fulfilled' && llmsRes.value.ok;

  const jsonLdBlocks: Record<string, unknown>[] = [];
  let conceptDNA: Partial<ConceptDNA> | null = null;

  if (pageRes.status === 'fulfilled' && pageRes.value.ok) {
    const html = await pageRes.value.text();
    const jsonLdMatches = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];

    for (const match of jsonLdMatches) {
      try {
        const parsed = JSON.parse(match[1] ?? '') as Record<string, unknown>;
        jsonLdBlocks.push(parsed);
        if (typeof parsed['conceptId'] === 'string') {
          conceptDNA = parsed as Partial<ConceptDNA>;
        }
      } catch {
        // skip malformed JSON-LD
      }
    }
  }

  return { conceptDNA, hasMcpEndpoint, hasLlmsTxt, jsonLdBlocks };
}
