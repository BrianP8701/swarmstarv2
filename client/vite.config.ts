import { defineConfig, Plugin } from 'vite';
import path, { resolve } from 'path';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(),
    checker({
      overlay: { initialIsOpen: false },
      typescript: true,
      eslint: {
        lintCommand: './node_modules/.bin/eslint "./src/**/*.{ts,tsx}"',
      },
    }),
    viteTsconfigPaths(),
    svgrPlugin()
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
  server: {
    host: 'localhost',
    port: 3000,
  },
  build: {
    outDir: 'build',
  },
  define: {
    'process.env': {},
  },
  optimizeDeps: {
    exclude: ['js-big-decimal'],
  },
});
