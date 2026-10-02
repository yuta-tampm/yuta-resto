import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

const sourceDirectory = fileURLToPath(new URL('./src/', import.meta.url));

export default defineConfig({
  resolve: {
    // Mirrors the `@/*` path in tsconfig.json; Vitest does not read tsconfig paths.
    alias: [{ find: /^@\//, replacement: sourceDirectory }],
  },
});
