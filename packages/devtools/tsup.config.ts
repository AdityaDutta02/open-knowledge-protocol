import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    sourcemap: true,
    clean: true,
    loader: { '.md': 'copy' },
    external: ['@okp/schema', '@okp/validate'],
  },
  {
    entry: ['src/cli.ts'],
    format: ['esm'],
    dts: true,
    sourcemap: true,
    loader: { '.md': 'copy' },
    external: ['@okp/schema', '@okp/validate'],
  },
]);
