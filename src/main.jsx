import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';
import './i18n';
import { UserProvider } from "./context/UserContext";


createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>,
)
