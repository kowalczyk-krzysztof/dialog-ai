import React from 'react'
import ReactDOM from 'react-dom/client'
import { ContentContainer } from './components/content/ContentContainer'
import './index.css'

const injectReactApp = () => {
  const root = document.createElement('div')
  root.id = 'popover-content-root'
  document.body.appendChild(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ContentContainer />
    </React.StrictMode>
  )
}

const load = () => {
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
