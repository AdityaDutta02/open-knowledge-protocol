import { defineConfig } from 'vitest/config';
import type { Plugin } from 'vite';

const mdPlugin: Plugin = {
  name: 'md-loader',
  transform(code: string, id: string) {
    if (id.endsWith('.md')) {
      return { code: `export default ${JSON.stringify(code)}` };
    }
  },
};

export default defineConfig({
  plugins: [mdPlugin],
});
