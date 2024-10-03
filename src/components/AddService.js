import React, { useState, useEffect } from 'react';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from '../services/firebase';

const AddService = () => {
  const [serviceName, setServiceName] = useState('');
  const [servicePrice, setServicePrice] = useState('');
  const [services, setServices] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState(null);

  // Función para cargar los servicios existentes
  const fetchServices = async () => {
    const serviceCollection = collection(db, 'services');
    const serviceSnapshot = await getDocs(serviceCollection);
    const serviceList = serviceSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setServices(serviceList);
  };

  // Función para añadir un nuevo servicio
  const handleAddService = async () => {
    try {
      if (isEditing) {
        // Si está editando, actualiza el servicio existente
        const serviceRef = doc(db, 'services', editingServiceId);
        await updateDoc(serviceRef, {
          serviceName,
          servicePrice: parseFloat(servicePrice),
        });
        alert('Servicio actualizado exitosamente');
        setIsEditing(false);
        setEditingServiceId(null);
      } else {
        // Si no está editando, añade un nuevo servicio
        await addDoc(collection(db, 'services'), {
          serviceName,
          servicePrice: parseFloat(servicePrice),
        });
        alert('Servicio añadido exitosamente');
      }
      // Limpia los campos
      setServiceName('');
      setServicePrice('');
      // Recarga la lista de servicios
      fetchServices();
    } catch (error) {
      console.error('Error al añadir/actualizar servicio: ', error);
    }
  };

  // Función para eliminar un servicio
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

  // Función para preparar la edición de un servicio
  const handleEditService = (service) => {
    setServiceName(service.serviceName);
    setServicePrice(service.servicePrice);
    setIsEditing(true);
    setEditingServiceId(service.id);
  };

  // Cargar los servicios al montar el componente
  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div>
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
      <ul>
        {services.map(service => (
          <li key={service.id}>
            Nombre: {service.serviceName}, Precio: {service.servicePrice}$
            <button onClick={() => handleEditService(service)}>Editar</button>
            <button onClick={() => handleDeleteService(service.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AddService;

