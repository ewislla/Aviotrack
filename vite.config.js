import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove this in Vercel – only needed in Replit
  server: process.env.REPL_ID
    ? {
        host: '0.0.0.0',
        allowedHosts: ['.replit.dev', '.repl.co'],
      }
    : undefined,
})
