// src/components/Modal.js
import React from 'react';
import '../styles/styles.css'; // Puedes agregar estilos para el modal aquí

const Modal = ({ isOpen, onClose, onSave, nuevaCita, setNuevaCita }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h4>Editar Cita</h4>
        
        <input 
          type="text"
          placeholder="Nombre"
          value={nuevaCita.title}
          onChange={(e) => setNuevaCita({ ...nuevaCita, title: e.target.value })}
        />
        
        <input 
          type="tel" 
          placeholder="Teléfono"
          value={nuevaCita.telefono}
          onChange={(e) => setNuevaCita({ ...nuevaCita, telefono: e.target.value })}
        />
        
        <label htmlFor="start">Hora de Inicio:</label>
        <input 
          type="datetime-local" 
          id="start" 
          value={nuevaCita.start} 
          onChange={(e) => setNuevaCita({ ...nuevaCita, start: e.target.value })} 
        />
        
        <label htmlFor="end">Hora de Fin:</label>
        <input 
          type="datetime-local" 
          id="end" 
          value={nuevaCita.end} 
          onChange={(e) => setNuevaCita({ ...nuevaCita, end: e.target.value })} 
        />
        
        <div className="modal-actions">
          <button onClick={onSave} className="btn btn-save">Guardar Cambios</button>
          <button onClick={onClose} className="btn btn-cancel">Cancelar</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
