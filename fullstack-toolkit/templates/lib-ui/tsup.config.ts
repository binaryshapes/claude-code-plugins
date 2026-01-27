import { defineConfig } from 'tsup';

export default defineConfig([
  // Main entry (tokens + utils)
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: ['react', 'react-dom', 'react-native', 'nativewind'],
  },
  // Web components
  {
    entry: ['src/web/index.ts'],
    outDir: 'dist/web',
    format: ['esm', 'cjs'],
    dts: true,
    splitting: false,
    sourcemap: true,
    external: ['react', 'react-dom'],
    esbuildOptions(options) {
      options.jsx = 'automatic';
    },
  },
]);
