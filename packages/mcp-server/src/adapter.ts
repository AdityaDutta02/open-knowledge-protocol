import type { ConceptGraph, KnowledgeNode } from '@okp/schema';

/**
 * CMSAdapter -- implement this interface for your CMS to plug into @okp/mcp-server.
 * The factory wires this into an MCP server with 5 standard OKP tools.
 */
export interface CMSAdapter {
  /**
   * Full-text or semantic search over articles.
   * Returns articles ranked by relevance to the query.
   */
  searchArticles(query: string): Promise<KnowledgeNode[]>;

  /**
   * Retrieve a specific article by its conceptId.
   * Returns null if not found.
   */
  getArticle(conceptId: string): Promise<KnowledgeNode | null>;

  /**
   * Get articles related to a concept (all edge types).
   */
  getRelated(conceptId: string): Promise<KnowledgeNode[]>;

  /**
   * Get the full prerequisite chain for a concept.
   * Should traverse transitively (prerequisite-of-prerequisite).
   */
  getPrerequisites(conceptId: string): Promise<KnowledgeNode[]>;

  /**
   * Return a subgraph rooted at conceptId, up to `depth` hops.
   * Default depth: 2.
   */
  getGraph(conceptId: string, depth?: number): Promise<ConceptGraph>;
}
