import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ConfirmationDialog from './ConfirmationDialog';

function WizytaList() {
  const [wizyty, setWizyty] = useState([]);
  const [filter, setFilter] = useState('all');
  const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();

  const fetchWizyty = () => {
    let url = 'http://127.0.0.1:8000/wizyty/';
    if (filter === 'true') url += '?pilne=true';
    if (filter === 'false') url += '?pilne=false';

    axios.get(url).then(res => setWizyty(res.data));
  };

  useEffect(() => {
    fetchWizyty();
  }, [filter]);

  const handleDelete = () => {
    axios.delete(`http://127.0.0.1:8000/wizyty/${deleteId}`)
      .then(() => {
        setDeleteId(null);
        fetchWizyty();
      })
      .catch(err => {
        alert("Błąd: " + (err.response?.data?.detail || "Nie można usunąć."));
        setDeleteId(null);
      });
  };

  return (
    <div>
      <header className="list-header">
        <h1>Wizyty Lekarskie</h1>
        <div className="controls">
          {/* Punkt 7: Filtrowanie */}
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Wszystkie</option>
            <option value="true">Tylko Pilne</option>
            <option value="false">Tylko Zwykłe</option>
          </select>
          {/* Punkt 5: Przycisk Dodaj */}
          <button className="btn-add" onClick={() => navigate('/add')}>+ Dodaj Nową</button>
        </div>
      </header>

      <div className="tile-grid">
        {wizyty.map(w => (
          <div key={w.id} className="tile">
            <h3>Wizyta #{w.id}</h3>
            <p><span className="info-label">Opis:</span> {w.opis}</p>
            <p><span className="info-label">Koszt:</span> {w.koszt} PLN</p>
            <p><span className="info-label">Pilne:</span> {w.czy_pilne ? "Tak" : "Nie"}</p>
            <div className="tile-btns">
              <button className="btn-edit" onClick={() => navigate(`/edit/${w.id}`)}>Edytuj</button>
              <button className="btn-delete" onClick={() => setDeleteId(w.id)}>Usuń</button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmationDialog 
        show={!!deleteId}
        title="Czy na pewno chcesz usunąć ten rekord?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

export default WizytaList;