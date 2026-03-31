import { defineConfig } from 'vite';

export default defineConfig({
  base: '/algo-art-klint-kandinsky/',
  build: { target: 'esnext' },
  server: { port: 3000 },
  test: {
    environment: 'node',
    include: ['test/**/*.test.js'],
    setupFiles: ['test/helpers/p5mock.js'],
  },
});
