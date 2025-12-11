import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AppProviders from './core/AppProviders.jsx';
import { AuthProvider } from './core/AuthContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppProviders>
      <AuthProvider>
        <App />
      </AuthProvider>
    </AppProviders>
  </React.StrictMode>
);
