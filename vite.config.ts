import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from 'vite-plugin-web-extension'
import { CSS_STYLESHEET } from './constants'

export default defineConfig({
  plugins: [react(), webExtension()],
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          if (assetInfo?.names?.some(name => name.endsWith('.css'))) {
            return CSS_STYLESHEET
          }
          return 'assets/[name]-[hash][extname]' // default value
        },
      },
    },
  },
})
