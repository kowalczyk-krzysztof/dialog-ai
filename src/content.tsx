import React from 'react'
import ReactDOM from 'react-dom/client'
import { ContentContainer } from './content/ContentContainer'
import { CONTENT_ROOT_ID, CSS_STYLESHEET, DIALOG_Z_INDEX } from '../constants'
import { suppressInvalidRadixUiTitleError } from './content/utils/content'
import './index.css'

/*
  To scope styles to the Chrome extension dialog, shadow DOM is used.
  For Tailwind to work in shadow DOM, the generated index.css content needs to be added as a link.
  To get the index.css file, the chrome.runtime.getURL method is used. The file needs to be defined under web_accessible_resources in the manifest.json file.
  For styles to work in development, the index.css file needs to be imported directly here. This also requires changing rollup options in the vite.config.ts file as otherwise the CSS file name could be different.

  manifest.json:
  "web_accessible_resources": [
    {
      "resources": [
        "index.css"
      ],
      "matches": [
        "<all_urls>"
      ]
    }
  ]

  vite.config.ts:
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
*/
const injectReactApp = () => {
  const root = document.createElement('div')
  root.id = CONTENT_ROOT_ID
  root.style.zIndex = DIALOG_Z_INDEX.toString()
  const shadowRoot = root.attachShadow({ mode: 'open' })
  document.body.appendChild(root)

  const stylesheet = document.createElement('link')
  stylesheet.rel = 'stylesheet'
  stylesheet.href = chrome.runtime.getURL(CSS_STYLESHEET)
  shadowRoot.appendChild(stylesheet)

  ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <ContentContainer />
    </React.StrictMode>
  )
}

const load = () => {
  suppressInvalidRadixUiTitleError()
  if (document.readyState === 'loading') {
    const domContentLoadedHandler = () => {
      injectReactApp()
      document.removeEventListener('DOMContentLoaded', domContentLoadedHandler)
    }

    document.addEventListener('DOMContentLoaded', domContentLoadedHandler)
  } else {
    injectReactApp()
  }
}

load()
