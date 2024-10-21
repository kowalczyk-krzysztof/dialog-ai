import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'

export default defineConfig({
  plugins: [react(), webExtension()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo?.names?.some(name => name.endsWith('.css'))) {
            return 'index.css'
          }
          return 'assets/[name]-[hash][extname]' // default value
        },
      },
    },
  },
})
