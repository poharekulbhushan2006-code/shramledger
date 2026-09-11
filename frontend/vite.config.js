import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  },
  define: {
    // Makes VITE_API_URL available as import.meta.env.VITE_API_URL
    // Set this to your Railway backend URL in Vercel environment variables
    __APP_VERSION__: JSON.stringify('1.0.0'),
  }
})

