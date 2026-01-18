import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { apiClient } from './utils/api';

// Restore stored access token (if any) so api client includes Authorization header on page load
try {
  const token = localStorage.getItem('accessToken');
  if (token) apiClient.setAuthToken(token);
} catch {
  // ignore
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);