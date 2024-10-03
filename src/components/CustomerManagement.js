import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const CustomerManagement = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch customers from Firestore
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const customersSnapshot = await getDocs(collection(db, 'customers'));
        const customersList = customersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCustomers(customersList);
      } catch (err) {
        setError('Error al cargar los clientes: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleAddCustomer = async () => {
    if (!name || !idNumber || !phone) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      await addDoc(collection(db, 'customers'), {
        name,
        idNumber,
        phone,
      });
      alert('Cliente agregado exitosamente.');
      setName('');
      setIdNumber('');
      setPhone('');
    } catch (err) {
      console.error('Error al agregar el cliente:', err);
      setError('Error al agregar el cliente. Inténtalo de nuevo.');
    }
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Gestión de Clientes</h2>
      <div>
        <h3>Agregar Cliente</h3>
        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Cédula"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button onClick={handleAddCustomer}>Agregar Cliente</button>
      </div>
      <div>
        <h3>Lista de Clientes</h3>
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>
              {customer.name} - Cédula: {customer.idNumber} - Teléfono: {customer.phone}
              <button onClick={() => onCustomerSelect(customer)}>Seleccionar para venta</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerManagement;
