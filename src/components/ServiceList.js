// src/components/ServiceList.js
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';
const ServiceList = ({ onSelectService }) => {
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [customPrice, setCustomPrice] = useState('');  // Permite modificar el precio

  useEffect(() => {
    const fetchServices = async () => {
      const serviceCollection = collection(db, 'services');
      const serviceSnapshot = await getDocs(serviceCollection);
      const serviceList = serviceSnapshot.docs.map(doc => doc.data());
      setServices(serviceList);
    };

    fetchServices();
  }, []);

  const handleSelectService = (service) => {
    setSelectedService(service);
    onSelectService(service, customPrice ? parseFloat(customPrice) : service.servicePrice);
  };

  return (
    <div>
      <h2>Lista de Servicios</h2>
      <ul>
        {services.map((service, index) => (
          <li key={index}>
            {service.serviceName} - {service.servicePrice}$
            <input
              type="number"
              placeholder="Modificar Precio"
              value={customPrice}
              onChange={(e) => setCustomPrice(e.target.value)}
            />
            <button onClick={() => handleSelectService(service)}>Seleccionar Servicio</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ServiceList;
