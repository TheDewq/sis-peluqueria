import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';
import Modal from './Modal'; // Importar el componente Modal

const DetallesCliente = () => {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [citasFiltradas, setCitasFiltradas] = useState([]);

  // Estado para manejar la edición
  const [editarCita, setEditarCita] = useState(null);
  const [nuevaCita, setNuevaCita] = useState({
    title: '',
    telefono: '',
    start: '',
    end: '',
  });
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para manejar el modal

  useEffect(() => {
    const obtenerCitas = async () => {
      setLoading(true);
      try {
        const coleccionCitas = collection(db, 'citas');
        const citasSnapshot = await getDocs(coleccionCitas);
        const listaCitas = citasSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            title: data.title,
            telefono: data.telefono,
            start: data.start.toDate(),
            end: data.end.toDate(),
          };
        });
        setCitas(listaCitas);
        setCitasFiltradas(listaCitas);
      } catch (error) {
        console.error('Error al obtener citas: ', error);
        setCitas([]);
      } finally {
        setLoading(false);
      }
    };

    obtenerCitas();
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
      const fecha = new Date(fechaSeleccionada).setHours(0, 0, 0, 0);
      const citasFiltradas = citas.filter(cita => 
        new Date(cita.start).setHours(0, 0, 0, 0) === fecha
      );
      setCitasFiltradas(citasFiltradas);
    } else {
      setCitasFiltradas(citas);
    }
  }, [fechaSeleccionada, citas]);

  const eliminarCita = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta cita?')) {
      await deleteDoc(doc(db, 'citas', id));
      setCitas(citas.filter(cita => cita.id !== id));
      setCitasFiltradas(citasFiltradas.filter(cita => cita.id !== id));
    }
  };

  const editarCitaHandler = (cita) => {
    setEditarCita(cita.id);
    setNuevaCita({
      title: cita.title,
      telefono: cita.telefono,
      start: new Date(cita.start).toISOString().slice(0, 16),
      end: new Date(cita.end).toISOString().slice(0, 16),
    });
    setIsModalOpen(true); // Abrir el modal
  };

  const guardarEdicion = async () => {
    const citaRef = doc(db, 'citas', editarCita);
    await updateDoc(citaRef, {
      title: nuevaCita.title,
      telefono: nuevaCita.telefono,
      start: new Date(nuevaCita.start),
      end: new Date(nuevaCita.end),
    });
    
    const citasActualizadas = citas.map(cita =>
      cita.id === editarCita ? { ...cita, ...nuevaCita } : cita
    );
    setCitas(citasActualizadas);
    setCitasFiltradas(citasFiltradas.map(cita =>
      cita.id === editarCita ? { ...cita, ...nuevaCita } : cita
    ));

    setEditarCita(null);
    setNuevaCita({ title: '', telefono: '', start: '', end: '' });
    setIsModalOpen(false); // Cerrar el modal
  };

  if (loading) {
    return <div>Cargando citas...</div>;
  }

  return (
    <div className="detalles-cliente">
      <h3>Detalles de las Citas</h3>
      <div className="filtro-fecha">
        <label htmlFor="fecha">Selecciona una fecha: </label>
        <input 
          type="date" 
          id="fecha" 
          value={fechaSeleccionada} 
          onChange={(e) => setFechaSeleccionada(e.target.value)} 
        />
      </div>
      
      {citasFiltradas.length === 0 ? (
        <div>No hay citas agendadas para esta fecha.</div>
      ) : (
        citasFiltradas.map((cita) => (
          <div key={cita.id} className="cita-card">
            <p><strong>Nombre:</strong> {cita.title}</p>
            <p><strong>Teléfono:</strong> {cita.telefono}</p>
            <p><strong>Fecha de Cita:</strong> {new Date(cita.start).toLocaleString()}</p>
            <p><strong>Hora de Inicio:</strong> {new Date(cita.start).toLocaleTimeString()}</p>
            <p><strong>Hora de Fin:</strong> {new Date(cita.end).toLocaleTimeString()}</p>
            <div className="cita-actions">
              <button onClick={() => editarCitaHandler(cita)} className="btn btn-edit">Editar</button>
              <button onClick={() => eliminarCita(cita.id)} className="btn btn-delete">Eliminar</button>
            </div>
            <hr />
          </div>
        ))
      )}

      {/* Modal para editar cita */}
      <Modal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={guardarEdicion}
        nuevaCita={nuevaCita}
        setNuevaCita={setNuevaCita}
      />
    </div>
  );
};

export default DetallesCliente;










