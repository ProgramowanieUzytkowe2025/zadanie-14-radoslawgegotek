import React from 'react';

function ConfirmationDialog({ show, onConfirm, onCancel, title }) {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Potwierdzenie</h3>
        <p>{title}</p>
        <div className="modal-actions">
          <button className="btn-confirm" onClick={onConfirm}>Tak, usuń</button>
          <button className="btn-cancel" onClick={onCancel}>Anuluj</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;