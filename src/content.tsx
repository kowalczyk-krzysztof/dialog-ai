import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { ContentContainer } from './components/content/ContentContainer'

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
document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', injectReactApp) : injectReactApp()
