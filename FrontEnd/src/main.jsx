import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ToastContainer } from 'react-toastify';
import { BrowserRouter } from 'react-router-dom';
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
    <>
    <BrowserRouter>
    <App />
    <ToastContainer   style={{ 
    position: 'fixed', 
    top: '11%', 
    right: '1%', 
    zIndex: 9999 
  }}
  autoClose={2800}/>
  </BrowserRouter>
    </>
)
