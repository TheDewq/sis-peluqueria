import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css'; // Asegúrate de que este archivo CSS contenga los nuevos estilos

const CashRegister = () => {
  const [totalSales, setTotalSales] = useState(0); // Total de ventas
  const [cashInBox, setCashInBox] = useState(0); // Dinero en caja
  const [amount, setAmount] = useState(''); // Cantidad de entrada/salida
  const [movementType, setMovementType] = useState('entrada'); // Tipo de movimiento (entrada/salida)
  const [reason, setReason] = useState(''); // Motivo de entrada o salida de dinero
  const [movements, setMovements] = useState([]); // Lista de movimientos

  // Función para obtener las ventas realizadas y calcular el total de ventas
  const fetchSales = async () => {
    try {
      const salesSnapshot = await getDocs(collection(db, 'sales'));
      const salesList = salesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalSalesAmount = salesList.reduce((acc, sale) => acc + (parseFloat(sale.totalAmount) || 0), 0); // Asegúrate de que totalAmount sea numérico
      setTotalSales(totalSalesAmount);
      setCashInBox(totalSalesAmount); // Inicializa el dinero en caja con las ventas totales
    } catch (error) {
      console.error('Error fetching sales:', error);
    }
  };

  // Función para obtener los movimientos de caja (entradas/salidas)
  const fetchMovements = async () => {
    try {
      const movementsSnapshot = await getDocs(collection(db, 'movements'));
      const movementList = movementsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const totalCashInBox = movementList.reduce((acc, movement) => {
        return acc + (movement.type === 'entrada' ? parseFloat(movement.amount) : -parseFloat(movement.amount));
      }, totalSales); // Comienza con el total de ventas

      setMovements(movementList);
      setCashInBox(totalCashInBox); // Actualiza el dinero en caja
    } catch (error) {
      console.error('Error fetching movements:', error);
    }
  };

  useEffect(() => {
    fetchSales(); // Cargar las ventas al cargar el componente
    fetchMovements(); // Cargar movimientos al cargar el componente

    // Escuchar ventas en tiempo real
    const unsubscribeSales = onSnapshot(collection(db, 'sales'), (snapshot) => {
      let newSalesTotal = 0;
      snapshot.forEach(doc => {
        newSalesTotal += parseFloat(doc.data().totalAmount) || 0; // Asegúrate de que totalAmount sea numérico
      });
      setTotalSales(newSalesTotal);
      // Actualiza el dinero en caja sumando el total de movimientos
      const updatedCashInBox = newSalesTotal + movements.reduce((acc, movement) => acc + (movement.type === 'entrada' ? parseFloat(movement.amount) : -parseFloat(movement.amount)), 0);
      setCashInBox(updatedCashInBox); 
    });

    // Escuchar movimientos en tiempo real
    const unsubscribeMovements = onSnapshot(collection(db, 'movements'), (snapshot) => {
      let movementList = [];
      let totalCash = 0;

      snapshot.forEach(doc => {
        const movementData = doc.data();
        movementList.push({
          id: doc.id,
          ...movementData,
        });
        totalCash += (movementData.type === 'entrada' ? parseFloat(movementData.amount) : -parseFloat(movementData.amount)); // Asegúrate de que amount sea numérico
      });

      setMovements(movementList);
      // Actualiza el dinero en caja sumando ventas y movimientos
      setCashInBox(totalSales + totalCash); 
    });

    return () => {
      unsubscribeSales();
      unsubscribeMovements();
    }; // Limpiar la suscripción al desmontar el componente
  }, [movements, totalSales]); // Dependencias para que se actualice correctamente

  // Función para registrar entradas y salidas de dinero
  const handleAddMovement = async () => {
    if (!amount || isNaN(amount)) {
      alert('Por favor, ingresa una cantidad válida.');
      return;
    }

    if (!reason) {
      alert('Por favor, ingresa un motivo para el movimiento.');
      return;
    }

    try {
      const newMovement = {
        type: movementType,
        amount: parseFloat(amount),
        reason: reason,
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'movements'), newMovement);

      // Actualiza el dinero en caja inmediatamente
      const newTotalCashInBox = movementType === 'entrada'
        ? cashInBox + parseFloat(amount)
        : cashInBox - parseFloat(amount);

      setCashInBox(newTotalCashInBox);
      setAmount('');
      setReason('');
    } catch (error) {
      console.error('Error al agregar movimiento:', error);
    }
  };

  return (
    <div className="cash-register-container">
      <h2>Caja</h2>
      <div className="total-info">
        <p>Total de ventas: {totalSales.toFixed(2)} $</p>
        <p>Dinero actual en caja: {cashInBox.toFixed(2)} $</p>
      </div>

      <div className="register-movement">
        <h3>Registrar Movimiento</h3>
        <select value={movementType} onChange={(e) => setMovementType(e.target.value)}>
          <option value="entrada">Entrada</option>
          <option value="salida">Salida</option>
        </select>
        <input
          type="number"
          placeholder="Cantidad"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="text"
          placeholder="Motivo del movimiento"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
        <button onClick={handleAddMovement}>Registrar</button>
      </div>

      <div className="movements-list">
        <h3>Movimientos</h3>
        <ul>
          {movements.map(movement => (
            <li key={movement.id}>
              <span>{movement.type === 'entrada' ? 'Entrada' : 'Salida'}</span>
              <span>{movement.amount.toFixed(2)} $</span>
              <span>(Motivo: {movement.reason})</span>
              <span>{movement.createdAt ? new Date(movement.createdAt.seconds * 1000).toLocaleDateString() : 'Fecha no disponible'}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CashRegister;









