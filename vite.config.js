// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Set the base path for GitHub Pages deployment
  // Replace 'react-maze-runner-game' with your repository name!
  base: '/react-maze-runner-game/',
})