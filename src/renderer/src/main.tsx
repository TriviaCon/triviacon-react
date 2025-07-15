import './assets/main.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import { initRendererIpc } from '../../data'

export const ipc = initRendererIpc(window.electron.ipcRenderer)

// Only import and attach devtools in development
if (import.meta.env.DEV) {
  import('./devtools').then(devtools => {
    (window as any).populateTT = devtools.populateTT;
    // Attach more helpers as needed
  });
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
