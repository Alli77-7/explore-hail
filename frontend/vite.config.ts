import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // طلبات /api تروح للباك إند وقت التطوير
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
