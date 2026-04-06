import { createClient, type SanityClient } from '@sanity/client';
import type { CMSAdapter } from '../adapter.js';
import type { ConceptGraph, KnowledgeNode } from '@okp/schema';

export interface SanityAdapterConfig {
  projectId: string;
  dataset: string;
  apiVersion: string;
  /** Base URL of the site -- used to build article URLs in GROQ projections */
  siteUrl: string;
  token?: string;
}

function nodeProjection(): string {
  return `{
  "conceptId": conceptDNA.conceptId,
  "title": title,
  "url": $siteUrl + "/blog/" + slug.current,
  "conceptDNA": conceptDNA {
    conceptId, title, summary, keyTerms,
    prerequisites, enables, relatedTo,
    category, confidence, temporalValidity, articleType,
    predictions, contradicts, supersedes, citations
  }
}`;
}

function buildSearchGroq(): string {
  return (
    `*[_type == "post" && defined(conceptDNA) && (` +
    `title match $query + "*" || ` +
    `conceptDNA.summary match $query + "*" || ` +
    `$query in conceptDNA.keyTerms` +
    `)] | order(publishedAt desc) [0...10] ${nodeProjection()}`
  );
}

function buildGetArticleGroq(): string {
  return `*[_type == "post" && conceptDNA.conceptId == $conceptId][0] ${nodeProjection()}`;
}

function buildGetRelatedGroq(): string {
  return (
    `*[_type == "post" && defined(conceptDNA) && (` +
    `$conceptId in conceptDNA.prerequisites || ` +
    `$conceptId in conceptDNA.enables || ` +
    `$conceptId in conceptDNA.relatedTo` +
    `)] [0...10] ${nodeProjection()}`
  );
}

function buildGetPrerequisitesGroq(): string {
  return `*[_type == "post" && conceptDNA.conceptId in $prereqIds] ${nodeProjection()}`;
}

type EdgeType = ConceptGraph['edges'][number]['type'];

function collectEdges(
  fromId: string,
  dna: KnowledgeNode['conceptDNA'],
  visited: Set<string>,
  queue: Array<{ id: string; level: number }>,
  nextLevel: number,
): ConceptGraph['edges'] {
  const edges: ConceptGraph['edges'] = [];

  const addEdges = (ids: string[], type: EdgeType): void => {
    for (const id of ids) {
      edges.push({ from: fromId, to: id, type });
      if (!visited.has(id)) {
        visited.add(id);
        queue.push({ id, level: nextLevel });
      }
    }
  };

  addEdges(dna.prerequisites, 'prerequisite');
  addEdges(dna.enables, 'enables');
  addEdges(dna.relatedTo, 'relatedTo');
  if (dna.contradicts) addEdges(dna.contradicts, 'contradicts');
  if (dna.supersedes) addEdges(dna.supersedes, 'supersedes');

  return edges;
}

export class SanityAdapter implements CMSAdapter {
  private readonly client: SanityClient;
  private readonly siteUrl: string;

  constructor(config: SanityAdapterConfig) {
    this.client = createClient({
      projectId: config.projectId,
      dataset: config.dataset,
      apiVersion: config.apiVersion,
      useCdn: true,
      // Spread token only when defined to satisfy exactOptionalPropertyTypes
      ...(config.token !== undefined ? { token: config.token } : {}),
    });
    this.siteUrl = config.siteUrl;
  }

  // Wrap fetch to avoid @sanity/client QueryParams overload resolution issues
  // under exactOptionalPropertyTypes. Cast to unknown first, then to the
  // expected return type — safe because GROQ projection shapes match KnowledgeNode.
  private async sanityFetch<T>(groq: string, params: Record<string, unknown>): Promise<T> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- bridge between strict QueryParams and plain record
    return this.client.fetch<T>(groq, params as any);
  }

  async searchArticles(query: string): Promise<KnowledgeNode[]> {
    return this.sanityFetch<KnowledgeNode[]>(buildSearchGroq(), {
      query,
      siteUrl: this.siteUrl,
    });
  }

  async getArticle(conceptId: string): Promise<KnowledgeNode | null> {
    const result = await this.sanityFetch<KnowledgeNode | null>(buildGetArticleGroq(), {
      conceptId,
      siteUrl: this.siteUrl,
    });
    return result ?? null;
  }

  async getRelated(conceptId: string): Promise<KnowledgeNode[]> {
    return this.sanityFetch<KnowledgeNode[]>(buildGetRelatedGroq(), {
      conceptId,
      siteUrl: this.siteUrl,
    });
  }

  async getPrerequisites(conceptId: string): Promise<KnowledgeNode[]> {
    const article = await this.getArticle(conceptId);
    if (!article || article.conceptDNA.prerequisites.length === 0) return [];

    return this.sanityFetch<KnowledgeNode[]>(buildGetPrerequisitesGroq(), {
      prereqIds: article.conceptDNA.prerequisites,
      siteUrl: this.siteUrl,
    });
  }

  async getGraph(conceptId: string, depth = 2): Promise<ConceptGraph> {
    const visited = new Set<string>([conceptId]);
    const queue: Array<{ id: string; level: number }> = [{ id: conceptId, level: 0 }];
    const nodes: KnowledgeNode[] = [];
    const edges: ConceptGraph['edges'] = [];

    while (queue.length > 0) {
      const current = queue.shift();
      if (!current) break;

      const node = await this.getArticle(current.id);
      if (!node) continue;

      nodes.push(node);
      if (current.level >= depth) continue;

      const newEdges = collectEdges(
        current.id,
        node.conceptDNA,
        visited,
        queue,
        current.level + 1,
      );
      edges.push(...newEdges);
    }

    return { nodes, edges };
  }
}
