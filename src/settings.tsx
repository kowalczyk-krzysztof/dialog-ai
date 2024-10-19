import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { SettingsContainer } from './components/settings/SettingsContainer'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SettingsContainer />
  </React.StrictMode>
)
