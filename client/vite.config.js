// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: '127.0.0.1', // ✅ force Vite to bind to 127.0.0.1
    port: 5174,        // ✅ match the port you’re using
    strictPort: true,  // ✅ fail if port is taken (no auto-switch)
    cors: true,        // ✅ enable CORS for dev server assets
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
  },
})
