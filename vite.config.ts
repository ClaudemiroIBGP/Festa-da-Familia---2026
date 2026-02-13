import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/Festa-da-Familia---2026/',
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  },
})