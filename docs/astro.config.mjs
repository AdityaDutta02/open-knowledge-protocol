import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  site: 'https://okp.theadityadutta.com',
  integrations: [
    starlight({
      title: 'Open Knowledge Protocol',
      description: 'Open standard for structuring web content as a queryable knowledge source for AI agents.',
      social: {
        github: 'https://github.com/AdityaDutta02/open-knowledge-protocol',
      },
      sidebar: [
        { label: 'Why OKP', link: '/why-okp' },
        {
          label: 'Quickstart',
          items: [
            { label: 'Next.js + Sanity', link: '/quickstart/nextjs-sanity' },
            { label: 'Next.js + Contentful', link: '/quickstart/nextjs-contentful' },
            { label: 'Astro + Markdown', link: '/quickstart/astro-md' },
          ],
        },
        {
          label: 'Packages',
          items: [
            { label: '@okp/schema', link: '/packages/schema' },
            { label: '@okp/mcp-server', link: '/packages/mcp-server' },
            { label: '@okp/llms-txt', link: '/packages/llms-txt' },
            { label: '@okp/devtools', link: '/packages/devtools' },
            { label: '@okp/validate', link: '/packages/validate' },
          ],
        },
        { label: 'Spec (v0)', link: '/spec/v0' },
        { label: 'Showcase', link: '/showcase' },
        { label: 'Paper', link: '/paper' },
      ],
      customCss: ['./src/styles/custom.css'],
    }),
  ],
});
