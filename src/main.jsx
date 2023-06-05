import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { AuthenticationContextProvider } from './context/AuthenticationContext.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthenticationContextProvider>
      < App />
  </AuthenticationContextProvider>,
)
