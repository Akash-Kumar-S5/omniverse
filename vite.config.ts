import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Builder worktrees live inside the repo; never let the main dev server watch them.
    watch: { ignored: ['**/.worktrees/**'] },
  },
})
