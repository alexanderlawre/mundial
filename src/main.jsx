import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { initTheme } from './lib/theme'
import 'flag-icons/css/flag-icons.min.css'
import './index.css'

// Applied before first render so dark-mode users don't see a light-mode flash.
initTheme()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
