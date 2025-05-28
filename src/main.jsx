import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'rsuite/dist/rsuite.min.css';
import './i18n';
import { UserProvider } from "./context/UserContext"; // ✅ استيراد السياق
createRoot(document.getElementById('root')).render(
  <UserProvider>
    <App />
  </UserProvider>,
)
