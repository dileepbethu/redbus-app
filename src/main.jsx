import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { HashRouter  } from 'react-router-dom'; // ✅ Add this
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  < HashRouter > 
    <AuthProvider>
      <App />
    </AuthProvider>
  </HashRouter>
);
