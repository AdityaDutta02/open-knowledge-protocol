import { describe, it, expect } from 'vitest';
import { getQuickstart } from '../src/tools/get-quickstart.js';
import { scaffoldConceptDNA } from '../src/tools/scaffold-concept-dna.js';
import { getSchemaForEntity } from '../src/tools/get-schema.js';
import { generateMcpConfig } from '../src/tools/generate-mcp-config.js';

describe('getQuickstart', () => {
  it('returns quickstart content for nextjs-sanity', () => {
    const result = getQuickstart('nextjs-sanity');
    expect(result).toContain('OKP Quickstart');
    expect(result.length).toBeGreaterThan(200);
  });

  it('throws for unknown stack', () => {
    expect(() => getQuickstart('unknown-stack' as never)).toThrow();
  });
});

describe('scaffoldConceptDNA', () => {
  it('returns a template containing conceptId for deep-dive', () => {
    const result = scaffoldConceptDNA('deep-dive');
    expect(result).toContain('conceptId');
    expect(result).toContain('deep-dive');
  });

  it('returns a template with predictions field for prediction type', () => {
    const result = scaffoldConceptDNA('prediction');
    expect(result).toContain('predictions');
  });
});

describe('getSchemaForEntity', () => {
  it('returns schema docs for ConceptDNA', () => {
    const result = getSchemaForEntity('ConceptDNA');
    expect(result).toContain('conceptId');
    expect(result).toContain('Zod');
  });

  it('throws for unknown entity', () => {
    expect(() => getSchemaForEntity('UnknownEntity' as never)).toThrow();
  });
});

describe('generateMcpConfig', () => {
  it('generates valid JSON config for sanity', () => {
    const result = generateMcpConfig('sanity', 'https://example.com');
    const config = JSON.parse(result) as { mcpServers: { okp: { command: string } } };
    expect(config.mcpServers.okp.command).toBe('node');
  });
});
