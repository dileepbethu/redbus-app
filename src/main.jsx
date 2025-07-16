import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter } from 'react-router-dom'; // ✅ Add this
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename={import.meta.env.BASE_URL}> {/* ✅ Wrap everything */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);
