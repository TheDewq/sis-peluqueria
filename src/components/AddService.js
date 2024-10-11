import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../services/firebase';
import '../styles/styles.css';

const AddService = () => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  const fetchServices = async () => {
    const serviceCollection = collection(db, 'services');
    const serviceSnapshot = await getDocs(serviceCollection);
    const serviceList = serviceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setServices(serviceList);
  };

  const handleAddService = async () => {
    // Validación para verificar que todos los campos estén llenos
    if (!serviceName || !servicePrice) {
      alert('Por favor completa todos los campos antes de añadir el servicio.');
      return; // Evita que se continúe si no están llenos los campos
    }

    try {
      if (isEditing) {
        const serviceRef = doc(db, 'services', editingServiceId);
        await updateDoc(serviceRef, {
          serviceName,
          servicePrice: parseFloat(servicePrice),
        });
        alert('Servicio actualizado exitosamente');
        setIsEditing(false);
        setEditingServiceId(null);
      } else {
        await addDoc(collection(db, 'services'), {
          serviceName,
          servicePrice: parseFloat(servicePrice),
        });
        alert('Servicio añadido exitosamente');
      }
      // Reinicia los campos después de añadir/actualizar
      setServiceName('');
      setServicePrice('');
      fetchServices();
    } catch (error) {
      console.error('Error al añadir/actualizar servicio: ', error);
    }
  };

  const handleDeleteService = async (id) => {
    try {
      const serviceRef = doc(db, 'services', id);
      await deleteDoc(serviceRef);
      alert('Servicio eliminado exitosamente');
      fetchServices();
    } catch (error) {
      console.error('Error al eliminar servicio: ', error);
    }
  };

  const handleEditService = (service) => {
    setServiceName(service.serviceName);
    setServicePrice(service.servicePrice);
    setIsEditing(true);
    setEditingServiceId(service.id);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="service-container">
      <h2>{isEditing ? 'Editar Servicio' : 'Añadir Servicio'}</h2>
      <input
        type="text"
        placeholder="Nombre del Servicio (ej. Corte de pelo)"
        value={serviceName}
        onChange={e => setServiceName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio del Servicio"
        value={servicePrice}
        onChange={e => setServicePrice(e.target.value)}
      />
      <button onClick={handleAddService}>
        {isEditing ? 'Actualizar Servicio' : 'Añadir Servicio'}
      </button>

      <h2>Lista de Servicios</h2>
      <ul className="service-list">
        {services.map(service => (
          <li key={service.id}>
            <div className="service-item">
              <div>
                <strong>Nombre:</strong>
                <p>{service.serviceName}</p>
              </div>
              <div>
                <strong>Precio:</strong>
                <p>{service.servicePrice}$</p>
              </div>
            </div>
            <div className="service-actions">
              <button onClick={() => handleEditService(service)}>Editar</button>
              <button className="delete-button" onClick={() => handleDeleteService(service.id)}>Eliminar</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddService;




