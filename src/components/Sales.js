import React, { useState, useEffect, useRef } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';
import Receipt from '../components/Receipt'; // Importar el componente de recibo

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const printRef = useRef();

  useEffect(() => {
    const fetchItems = async () => {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const servicesSnapshot = await getDocs(collection(db, 'services'));
      const customersSnapshot = await getDocs(collection(db, 'customers'));

      const productList = productsSnapshot.docs.map(doc => ({ id: doc.id, type: 'product', ...doc.data() }));
      const serviceList = servicesSnapshot.docs.map(doc => ({ id: doc.id, type: 'service', ...doc.data() }));
      const customerList = customersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setProducts(productList);
      setServices(serviceList);
      setCustomers(customerList);
      setFilteredItems([...productList, ...serviceList]);
    };

    fetchItems();
  }, []);

  const handleAddItem = (item, quantity) => {
    if (quantity <= 0) return;

    const existingItemIndex = selectedItems.findIndex(selected => selected.id === item.id);
    const itemToAdd = { ...item, quantity };

    if (existingItemIndex > -1) {
      const updatedItems = [...selectedItems];
      updatedItems[existingItemIndex].quantity += quantity;
      setSelectedItems(updatedItems);
    } else {
      setSelectedItems([...selectedItems, itemToAdd]);
    }

    const itemPrice = item.salePrice || item.servicePrice || item.price;
    setTotal(prevTotal => prevTotal + itemPrice * quantity);
  };

  const handleEditItemQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = selectedItems.map(item => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });

    const newTotal = updatedItems.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    setSelectedItems(updatedItems);
    setTotal(newTotal);
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = selectedItems.filter(item => item.id !== itemId);
    const newTotal = updatedItems.reduce((sum, item) => sum + (item.salePrice || item.price) * item.quantity, 0);
    setSelectedItems(updatedItems);
    setTotal(newTotal);
  };

  const handlePaymentChange = (e) => {
    const payment = parseFloat(e.target.value) || 0;
    setCustomerPayment(payment);
    setChange(payment - total);
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const printWindow = window.open('', '', 'width=800,height=600');
    printWindow.document.write('<html><head><title>Recibo</title></head><body>');
    printWindow.document.write(printContent.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleGenerateSale = async () => {
    if (!selectedCustomer) {
      alert('Debe seleccionar un cliente para generar la venta.');
      return;
    }

    if (customerPayment < total) {
      alert('El pago es insuficiente.');
      return;
    }

    await addDoc(collection(db, 'sales'), {
      items: selectedItems,
      totalAmount: total,
      payment: customerPayment,
      change: change,
      customer: selectedCustomer,
      date: new Date(),
    });

    for (const item of selectedItems) {
      if (item.salePrice) {
        const productRef = doc(db, 'products', item.id);
        const currentProductDoc = await getDoc(productRef);
        const currentQuantity = currentProductDoc.data().quantity;
        await updateDoc(productRef, {
          quantity: currentQuantity - item.quantity
        });
      } else {
        const serviceRef = doc(db, 'services', item.id);
        const currentServiceDoc = await getDoc(serviceRef);
        const currentServiceStats = currentServiceDoc.data().stats || { totalSales: 0 };
        await updateDoc(serviceRef, {
          stats: {
            totalSales: currentServiceStats.totalSales + item.quantity
          }
        });
      }
    }

    alert('Venta generada con éxito.');
    handlePrint();

    setSelectedItems([]);
    setTotal(0);
    setCustomerPayment(0);
    setChange(0);
    setSearchTerm('');
    setSelectedCustomer(null);
  };

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchTerm(searchTerm);

    const filtered = [...products, ...services].filter(item =>
      (item.name?.toLowerCase().includes(searchTerm) || item.serviceName?.toLowerCase().includes(searchTerm))
    );

    setFilteredItems(filtered);
  };

  const handleCustomerSelect = (e) => {
    const customerId = e.target.value;
    const customer = customers.find(c => c.id === customerId);
    setSelectedCustomer(customer);
  };

  return (
    <div className="container">
      <h2>Generar Venta</h2>

      {/* Barra de búsqueda */}
      <div className="search-section">
        <h3>Buscar Productos o Servicios</h3>
        <input
          type="text"
          placeholder="Buscar productos o servicios"
          value={searchTerm}
          onChange={handleSearch}
        />
        {searchTerm && filteredItems.length > 0 && (
          <div className="item-list">
            {filteredItems.map(item => (
              <div key={item.id}>
                <p>{item.serviceName || item.name} - {item.servicePrice || item.salePrice || item.price}$</p>
                <button onClick={() => {
                  handleAddItem(item, 1);
                  setSearchTerm('');
                  setFilteredItems([...products, ...services]);
                }}>Agregar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="sales-section">
        {/* Sección izquierda: Lista de items seleccionados */}
        <div className="left-section">
          <h3>Items Seleccionados</h3>
          <div className="selected-items">
            {selectedItems.map(item => (
              <div key={item.id}>
                <p>
                  {item.serviceName || item.name} - {item.quantity} x {item.servicePrice || item.salePrice || item.price}$
                </p>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => handleEditItemQuantity(item.id, parseInt(e.target.value))}
                />
                <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
              </div>
            ))}
          </div>
        </div>

        {/* Sección derecha: Total, cliente, pago y generar venta */}
        <div className="right-section">
          <div className="customer-section">
            <h3>Seleccionar Cliente</h3>
            <select onChange={handleCustomerSelect} value={selectedCustomer ? selectedCustomer.id : ''}>
              <option value="" disabled>Seleccione un cliente</option>
              {customers.map(customer => (
                <option key={customer.id} value={customer.id}>
                  {customer.name} - {customer.email}
                </option>
              ))}
            </select>
          </div>

          <div className="payment-section">
            <h3>Total: {total}$</h3>
            <input
              type="number"
              placeholder="Dinero entregado"
              value={customerPayment}
              onChange={handlePaymentChange}
            />
            <h3>Cambio: {change}$</h3>
            <button onClick={handleGenerateSale}>Generar Venta</button>
          </div>
        </div>
      </div>

      {/* Componente de recibo para imprimir */}
      <div style={{ display: 'none' }}>
        <div ref={printRef}>
          <Receipt
            items={selectedItems}
            total={total}
            payment={customerPayment}
            change={change}
            customer={selectedCustomer}
          />
        </div>
      </div>
    </div>
  );
};

export default Sales;















