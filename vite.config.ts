import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5173,
    host: true
    // If you prefer proxy over CORS, uncomment below:
    // proxy: {
    //   '/api': { target: 'http://localhost:8006', changeOrigin: true },
    //   '/auth': { target: 'http://localhost:8006', changeOrigin: true },
    // }
  }
})
