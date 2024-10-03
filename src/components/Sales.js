import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css'; // Asegúrate de importar el CSS

const Sales = () => {
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [customerPayment, setCustomerPayment] = useState(0);
  const [total, setTotal] = useState(0);
  const [change, setChange] = useState(0);
  const [productSearchTerm, setProductSearchTerm] = useState('');
  const [serviceSearchTerm, setServiceSearchTerm] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const servicesSnapshot = await getDocs(collection(db, 'services'));

      const productList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const serviceList = servicesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      setProducts(productList);
      setServices(serviceList);
      setFilteredProducts(productList);
      setFilteredServices(serviceList);
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

    const itemPrice = item.salePrice || item.price;
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

  const handleGenerateSale = async () => {
    if (customerPayment < total) {
      alert('El pago es insuficiente.');
      return;
    }

    await addDoc(collection(db, 'sales'), {
      items: selectedItems,
      totalAmount: total,
      payment: customerPayment,
      change: change,
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

    // Reiniciar el estado después de la venta
    setSelectedItems([]);
    setTotal(0);
    setCustomerPayment(0); // Reiniciar la barra de dinero entregado
    setChange(0);
    setProductSearchTerm(''); // Reiniciar búsqueda de productos
    setServiceSearchTerm(''); // Reiniciar búsqueda de servicios
  };

  const handleProductSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setProductSearchTerm(searchTerm);
    const filtered = products.filter(product => product.name?.toLowerCase().includes(searchTerm));
    setFilteredProducts(filtered);
  };

  const handleServiceSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setServiceSearchTerm(searchTerm);
    const filtered = services.filter(service => service.name?.toLowerCase().includes(searchTerm));
    setFilteredServices(filtered);
  };

  return (
    <div className="container">
      <h2>Generar Venta</h2>

      {/* Búsqueda y listado de productos */}
      <div className="search-section">
        <h3>Buscar Productos</h3>
        <input
          type="text"
          placeholder="Buscar productos"
          value={productSearchTerm} // Añadido para vincular valor de entrada
          onChange={handleProductSearch}
        />
        {productSearchTerm && filteredProducts.length > 0 && (
          <div className="item-list">
            {filteredProducts.map(product => (
              <div key={product.id}>
                <p>{product.name} - {product.salePrice}$</p>
                <input
                  type="number"
                  min="1"
                  placeholder="Cantidad"
                  onChange={(e) => {
                    const quantity = parseInt(e.target.value) || 1;
                    handleAddItem(product, quantity);
                    setProductSearchTerm(''); // Reiniciar barra de búsqueda de productos
                    setFilteredProducts(products); // Reiniciar la lista de productos filtrados
                  }}
                />
                <button onClick={() => {
                  handleAddItem(product, 1);
                  setProductSearchTerm(''); // Reiniciar barra de búsqueda de productos
                  setFilteredProducts(products); // Reiniciar la lista de productos filtrados
                }}>Agregar Producto</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Búsqueda y listado de servicios */}
      <div className="search-section">
        <h3>Buscar Servicios</h3>
        <input
          type="text"
          placeholder="Buscar servicios"
          value={serviceSearchTerm} // Añadido para vincular valor de entrada
          onChange={handleServiceSearch}
        />
        {serviceSearchTerm && filteredServices.length > 0 && (
          <div className="item-list">
            {filteredServices.map(service => (
              <div key={service.id}>
                <p>{service.name} - {service.price}$</p>
                <button onClick={() => {
                  handleAddItem(service, 1);
                  setServiceSearchTerm(''); // Reiniciar barra de búsqueda de servicios
                  setFilteredServices(services); // Reiniciar la lista de servicios filtrados
                }}>Agregar Servicio</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resumen de venta */}
      <div className="summary">
        <h3>Resumen de Venta</h3>
        <ul>
          {selectedItems.map((item) => (
            <li key={item.id}>
              {item.name} - {item.salePrice || item.price}$ x {item.quantity}
              <input
                type="number"
                className="quantity-input"
                value={item.quantity}
                onChange={(e) => handleEditItemQuantity(item.id, parseInt(e.target.value) || 1)}
              />
              <button onClick={() => handleRemoveItem(item.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
        <h4>Total: {total}$</h4>
        <input
          type="number"
          placeholder="Dinero entregado"
          value={customerPayment} // Vincular el valor del input al estado
          onChange={handlePaymentChange}
        />
        <h4>Cambio: {change}$</h4>
        <button onClick={handleGenerateSale}>Generar Venta</button>
      </div>
    </div>
  );
};

export default Sales;










