import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/three/src/') || id.includes('/three/build/')) return 'three';
        },
      },
    },
  },
});
