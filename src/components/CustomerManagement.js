import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';

const CustomerManagement = ({ onCustomerSelect }) => {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingCustomerId, setEditingCustomerId] = useState(null); // Estado para editar cliente
  const [showErrorAlert, setShowErrorAlert] = useState(false); // Controlar la visibilidad de la alerta de error

  // Fetch customers from Firestore
  useEffect(() => {
    fetchCustomers();
  }, []);

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

  const handleAddOrUpdateCustomer = async () => {
    if (!name || !idNumber || !phone) {
      setError('Por favor, completa todos los campos.');
      setShowErrorAlert(true); // Muestra la alerta flotante
      setTimeout(() => {
        setShowErrorAlert(false); // Oculta la alerta después de 3 segundos
      }, 3000);
      return;
    }

    setError(null); // Limpia el mensaje de error si se completan los campos
    setShowErrorAlert(false); // Oculta la alerta en caso de éxito

    try {
      if (editingCustomerId) {
        // Actualizar cliente existente
        const customerRef = doc(db, 'customers', editingCustomerId);
        await updateDoc(customerRef, {
          name,
          idNumber,
          phone,
        });
        alert('Cliente actualizado exitosamente.');
      } else {
        // Agregar nuevo cliente
        await addDoc(collection(db, 'customers'), {
          name,
          idNumber,
          phone,
        });
        alert('Cliente agregado exitosamente.');
      }
      resetForm();
      fetchCustomers(); // Vuelve a cargar la lista de clientes
    } catch (err) {
      console.error('Error al agregar/actualizar el cliente:', err);
      setError('Error al agregar/actualizar el cliente. Inténtalo de nuevo.');
    }
  };

  const handleEditCustomer = (customer) => {
    setName(customer.name);
    setIdNumber(customer.idNumber);
    setPhone(customer.phone);
    setEditingCustomerId(customer.id);
  };

  const handleDeleteCustomer = async (customerId) => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar este cliente?');
    if (confirmDelete) {
      try {
        await deleteDoc(doc(db, 'customers', customerId));
        alert('Cliente eliminado exitosamente.');
        fetchCustomers(); // Vuelve a cargar la lista de clientes
      } catch (err) {
        console.error('Error al eliminar el cliente:', err);
        setError('Error al eliminar el cliente. Inténtalo de nuevo.');
      }
    }
  };

  const resetForm = () => {
    setName('');
    setIdNumber('');
    setPhone('');
    setEditingCustomerId(null);
    setError(null);
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="customer-container">
      <h2>Gestión de Clientes</h2>

      {/* Alerta flotante */}
      {showErrorAlert && (
        <div className="error-alert">
          <span>{error}</span>
          <button onClick={() => setShowErrorAlert(false)}>✖</button>
        </div>
      )}

      <div className="customer-form">
        <h3>{editingCustomerId ? 'Editar Cliente' : 'Agregar Cliente'}</h3>
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
        <button onClick={handleAddOrUpdateCustomer}>
          {editingCustomerId ? 'Actualizar Cliente' : 'Agregar Cliente'}
        </button>
        {editingCustomerId && <button onClick={resetForm}>Cancelar</button>}
      </div>
      
      <div className="customer-list">
        <h3>Lista de Clientes</h3>
        <ul>
          {customers.map((customer) => (
            <li key={customer.id}>
              <div className="customer-item">
                <div>
                  <strong>Nombre:</strong>
                  <p>{customer.name}</p>
                </div>
                <div>
                  <strong>Cédula:</strong>
                  <p>{customer.idNumber}</p>
                </div>
                <div>
                  <strong>Teléfono:</strong>
                  <p>{customer.phone}</p>
                </div>
                <button className="edit" onClick={() => handleEditCustomer(customer)}>Editar</button>
                <button onClick={() => handleDeleteCustomer(customer.id)}>Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CustomerManagement;


