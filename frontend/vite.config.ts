import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    hmr: {
      overlay: true
    },
    watch: {
      usePolling: true
    }
  },
  build: {
    sourcemap: true
  }
});
