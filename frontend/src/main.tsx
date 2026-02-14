import './styles/theme.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { HeroUIProvider } from '@heroui/react';
import { AuthProvider } from './context/AuthContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HeroUIProvider>
          <App />
        </HeroUIProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
