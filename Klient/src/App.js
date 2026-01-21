import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import WizytaList from './WizytaList';
import WizytaForm from './WizytaForm';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  useEffect(() => {
    // Punkt 9: Interceptor żądań (Włącza loader)
    const requestInterceptor = axios.interceptors.request.use((config) => {
      setLoading(true);
      return config;
    });

    // Punkt 8 i 9: Interceptor odpowiedzi (Wyłącza loader i pokazuje Toasty)
    const responseInterceptor = axios.interceptors.response.use(
      (response) => {
        setLoading(false);
        // Jeśli to POST, PUT lub DELETE - sukces (Punkt 8a)
        if (['post', 'put', 'delete'].includes(response.config.method)) {
          addToast("Poprawnie zapisano zmiany", "success");
        }
        return response;
      },
      (error) => {
        setLoading(false);
        // Błąd 4xx lub 5xx (Punkt 8b)
        addToast("Wystąpił błąd", "error");
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  return (
    <Router>
      {/* Punkt 9: Globalny Loader */}
      {loading && (
        <div className="loader-overlay">
          <div className="spinner"></div>
          <div className="loader-text">WCZYTYWANIE...</div>
        </div>
      )}

      {/* Punkt 8: Kontener na Toasty */}
      <div className="toast-container">
        {toasts.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<WizytaList />} />
          <Route path="/add" element={<WizytaForm />} />
          <Route path="/edit/:id" element={<WizytaForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;