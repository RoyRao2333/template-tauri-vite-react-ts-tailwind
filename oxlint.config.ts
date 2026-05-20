import { defineConfig } from 'oxlint';

export default defineConfig({
  categories: {
    correctness: 'warn',
    perf: 'warn',
  },
  plugins: ['react', 'react-perf', 'jsdoc', 'vitest', 'typescript'],
});
