import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // Enable automatic page refresh every 5 seconds
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: true,
      interval: 5000, // Check for file changes every 5 seconds
    },
  },
})
