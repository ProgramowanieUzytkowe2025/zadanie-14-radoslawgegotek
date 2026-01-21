import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function WizytaForm() {
  const { id } = useParams(); // Pobiera ID tylko jeśli jesteśmy na /edit/:id
  const navigate = useNavigate();
  const isEditMode = Boolean(id); // Jeśli id istnieje, to edytujemy

  const [formData, setFormData] = useState({
    opis: '',
    koszt: 0,
    czy_pilne: false
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    // Pobieramy dane TYLKO w trybie edycji
    if (isEditMode) {
      axios.get(`http://127.0.0.1:8000/wizyty/${id}`)
        .then(res => setFormData(res.data))
        .catch(err => setError("Błąd: Nie znaleziono rekordu o tym ID."));
    }
  }, [id, isEditMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    // Wybór metody: PUT dla edycji, POST dla dodawania (Punkt 5)
    const apiCall = isEditMode 
      ? axios.put(`http://127.0.0.1:8000/wizyty/${id}`, formData)
      : axios.post(`http://127.0.0.1:8000/wizyty/`, formData);

    apiCall
      .then(() => {
        // Punkt 4: Poprawny zapis przekierowuje do strony głównej
        navigate('/');
      })
      .catch(err => {
        // Punkt 4: Błąd wyświetlany przy formularzu
        const serverMsg = err.response?.data?.detail;
        setError(typeof serverMsg === 'string' ? serverMsg : "Wystąpił błąd podczas zapisu.");
      });
  };

  return (
    <div className="form-card">
      <h2>{isEditMode ? `Edycja rekordu #${id}` : "Dodaj nową wizytę"}</h2>
      
      {error && <div className="error-msg">{error}</div>}

      <form onSubmit={handleSubmit} className="styled-form">
        <label>Opis wizyty:</label>
        <input 
          type="text" 
          value={formData.opis} 
          onChange={e => setFormData({...formData, opis: e.target.value})} 
          required 
        />

        <label>Koszt (PLN):</label>
        <input 
          type="number" 
          value={formData.koszt} 
          onChange={e => setFormData({...formData, koszt: parseInt(e.target.value) || 0})} 
          required 
        />

        <div className="checkbox-group">
          <input 
            type="checkbox" 
            id="czy_pilne"
            checked={formData.czy_pilne} 
            onChange={e => setFormData({...formData, czy_pilne: e.target.checked})} 
          />
          <label htmlFor="czy_pilne">Czy wizyta jest pilna?</label>
        </div>

        <div className="form-buttons">
          <button type="submit" className="btn-save">Zapisz</button>
          <button type="button" className="btn-back" onClick={() => navigate('/')}>Anuluj</button>
        </div>
      </form>
    </div>
  );
}

export default WizytaForm;