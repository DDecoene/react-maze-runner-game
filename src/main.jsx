// src/main.jsx
import React from 'react' // Changed from { StrictMode }
import ReactDOM from 'react-dom/client' // Changed from { createRoot }
import './index.css'
import App from './App.jsx'

// StrictMode removed for cleaner logs, can be added back if needed for dev checks
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>  {/* Re-added StrictMode as it's generally good practice for dev */}
    <App />
  </React.StrictMode>,
)