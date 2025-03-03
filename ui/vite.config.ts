import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import checker from 'vite-plugin-checker'

export default defineConfig(() => {
  return {
    build: {
      outDir: 'build',
      chunkSizeWarningLimit: 1024,
    },
    plugins: [
      react(),
      checker({
        typescript: true,
        biome: {
          command: 'check',
        },
      }),
    ],
  }
})
