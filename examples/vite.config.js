// vite.config.js
import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        point: resolve(__dirname, 'point/index.html'),
        drawing: resolve(__dirname, 'drawing/index.html'),
      },
    },
  },
});
