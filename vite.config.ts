import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api/places': {
        target: 'https://places.googleapis.com',
        changeOrigin: true,
        rewrite: (path) => {
          // Remove '/api/places' prefix and keep the rest of the path
          return path.replace(/^\/api\/places/, '');
        },
      },
    },
  },
});