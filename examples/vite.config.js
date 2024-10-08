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
        colors: resolve(__dirname, 'colors/index.html'),
        mouse_inputs: resolve(__dirname, 'mouse-inputs/index.html'),
        update: resolve(__dirname, 'update/index.html'),
        keyboard_inputs: resolve(__dirname, 'keyboard-inputs/index.html'),
        delta_time: resolve(__dirname, 'delta-time/index.html'),
        line: resolve(__dirname, 'etc/line/index.html'),
        tennis: resolve(__dirname, 'etc/tennis-of-two/index.html'),
      },
    },
  },
  base: '/minipoint/',
});
