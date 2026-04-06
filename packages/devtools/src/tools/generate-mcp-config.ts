type CMSType = 'sanity' | 'contentful';

function buildSanityConfig(siteUrl: string): Record<string, unknown> {
  return {
    mcpServers: {
      okp: {
        command: 'node',
        args: ['node_modules/@okp/devtools/dist/cli.js'],
        env: {
          OKP_SITE_URL: siteUrl,
          OKP_CMS: 'sanity',
          SANITY_PROJECT_ID: '<your-project-id>',
          SANITY_DATASET: 'production',
          SANITY_API_VERSION: '2024-01-01',
        },
      },
    },
  };
}

function buildContentfulConfig(siteUrl: string): Record<string, unknown> {
  return {
    mcpServers: {
      okp: {
        command: 'node',
        args: ['node_modules/@okp/devtools/dist/cli.js'],
        env: {
          OKP_SITE_URL: siteUrl,
          OKP_CMS: 'contentful',
          CONTENTFUL_SPACE_ID: '<your-space-id>',
          CONTENTFUL_ACCESS_TOKEN: '<your-access-token>',
        },
      },
    },
  };
}

export function generateMcpConfig(cms: CMSType, siteUrl: string): string {
  if (cms === 'sanity') return JSON.stringify(buildSanityConfig(siteUrl), null, 2);
  if (cms === 'contentful') return JSON.stringify(buildContentfulConfig(siteUrl), null, 2);
  throw new Error(`Unknown CMS: ${cms}. Supported: sanity, contentful`);
}
