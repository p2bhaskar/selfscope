// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Set base to your GitHub repo name, e.g. '/selfscope/'
// This is required for GitHub Pages to serve assets correctly.
// If you use a custom domain, set base: '/'
const BASE = process.env.GITHUB_ACTIONS ? '/selfscope/' : '/';

export default defineConfig({
  plugins: [react()],
  base: BASE,
})