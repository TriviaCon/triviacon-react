import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

if (import.meta.env.DEV) {
  import('./devtools').then((devtools) => {
    ;(window as any).populateTT = devtools.populateTT
  })
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
