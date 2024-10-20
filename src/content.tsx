import React from 'react'
import ReactDOM from 'react-dom/client'
import { ContentContainer } from './components/content/ContentContainer'
import './index.css'

function injectReactApp() {
  const root = document.createElement('div')
  root.id = 'popupai-content-root'
  document.body.appendChild(root)

  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <ContentContainer />
    </React.StrictMode>
  )
}

// Ensure the DOM is fully loaded before appending the element
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectReactApp)
} else {
  injectReactApp()
}
