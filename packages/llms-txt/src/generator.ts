import type { Article } from '@okp/schema';

export interface LlmsTxtOptions {
  siteTitle: string;
  siteUrl: string;
  /** Brief description of the site (1-2 sentences) */
  siteDescription?: string;
}

export interface LlmsTxtResult {
  /** Contents for /llms.txt -- summaries and URLs, no full content */
  llmsTxt: string;
  /** Contents for /llms-full.txt -- full content included */
  llmsFullTxt: string;
}

function buildArticleHeader(article: Article): string[] {
  const date = article.publishedAt.slice(0, 10);
  return [
    `## [${article.title}](${article.url})`,
    ``,
    `- Published: ${date}`,
    `- Category: ${article.conceptDNA.category}`,
    `- Type: ${article.conceptDNA.articleType}`,
    `- Confidence: ${article.conceptDNA.confidence}`,
    `- Key terms: ${article.conceptDNA.keyTerms.join(', ')}`,
    ``,
    article.conceptDNA.summary,
    ``,
  ];
}

/**
 * Generate /llms.txt and /llms-full.txt from OKP-structured articles.
 * Follows the format proposed at https://llmstxt.org/.
 */
export function generateLlmsTxt(articles: Article[], options: LlmsTxtOptions): LlmsTxtResult {
  const sorted = [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

  const header = [
    `# ${options.siteTitle}`,
    ``,
    options.siteDescription ? `> ${options.siteDescription}` : `> ${options.siteUrl}`,
    ``,
  ].join('\n');

  const llmsTxtEntries = sorted.map((article) =>
    buildArticleHeader(article).join('\n'),
  );

  const llmsFullEntries = sorted.map((article) =>
    [
      ...buildArticleHeader(article),
      `### Full Content`,
      ``,
      article.content,
      ``,
      `---`,
      ``,
    ].join('\n'),
  );

  return {
    llmsTxt: header + llmsTxtEntries.join(''),
    llmsFullTxt: header + llmsFullEntries.join(''),
  };
}
