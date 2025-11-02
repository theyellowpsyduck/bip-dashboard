import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// Base path should match your GitHub Pages deployment
// For repo: username/repo-name deployed from /frontend, use: '/repo-name/frontend/'
// For root deployment, use: '/'
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_PATH || '/',
  build: {
    outDir: 'dist',
  },
})

