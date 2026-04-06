import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    loader: { '.md': 'text' },
    external: ['@okp/schema', '@okp/validate'],
  },
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    sourcemap: true,
    loader: { '.md': 'text' },
    external: ['@okp/schema', '@okp/validate'],
  },
]);
