import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './App.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import State from './context/State.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <State>
        <App/>
      </State>
    </BrowserRouter>
  </StrictMode>
)
