import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  base: '/fhir-runtime-playground/',
  plugins: [react()],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'node:fs/promises': fileURLToPath(new URL('./src/polyfills/fs-promises.ts', import.meta.url)),
      'node:fs': fileURLToPath(new URL('./src/polyfills/fs.ts', import.meta.url)),
      'node:path': fileURLToPath(new URL('./src/polyfills/path.ts', import.meta.url)),
      'node:url': fileURLToPath(new URL('./src/polyfills/url.ts', import.meta.url)),
    },
  },

  server: {
    port: 3000,
  },
});