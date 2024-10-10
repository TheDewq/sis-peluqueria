import React, { useEffect, useState } from 'react'; 
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';

const Statistics = () => {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProductSales, setTotalProductSales] = useState(0);
  const [totalServiceSales, setTotalServiceSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [productsMap, setProductsMap] = useState({});

  useEffect(() => {
    const fetchSales = async () => {
      const salesCollection = collection(db, 'sales');
      const salesSnapshot = await getDocs(salesCollection);
      const salesList = salesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSales(salesList);

      let totalSalesAmount = 0;
      let totalProductAmount = 0;
      let totalServiceAmount = 0;
      let totalProfitAmount = 0;

      // Obtención de productos
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const productMap = productsList.reduce((acc, product) => {
        acc[product.id] = product.name;
        return acc;
      }, {});
      setProductsMap(productMap);

      salesList.forEach(sale => {
        totalSalesAmount += sale.totalAmount || 0;

        // Calcular total de ventas de productos
        if (Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            if (item.type === 'product') {
              const itemTotal = (item.salePrice || 0) * (item.quantity || 0);
              totalProductAmount += itemTotal;

              const itemPurchasePrice = (item.purchasePrice || 0) * (item.quantity || 0);
              totalProfitAmount += (itemTotal - itemPurchasePrice);
            } else if (item.type === 'service') {
              // Calcular total de ventas de servicios
              const serviceTotal = (item.servicePrice || 0) * (item.quantity || 0);
              totalServiceAmount += serviceTotal;

              // Suponiendo que el precio de compra para servicios es conocido
              const servicePurchasePrice = 0; // Cambia esto si tienes un precio de compra para servicios
              totalProfitAmount += serviceTotal; // Solo suma el total de servicios
            }
          });
        }
      });

      setTotalSales(totalSalesAmount);
      setTotalProductSales(totalProductAmount);
      setTotalServiceSales(totalServiceAmount);
      setTotalProfit(totalProfitAmount);
    };

    fetchSales();
  }, []);

  const handleDeleteSale = async (saleId) => {
    const saleDoc = doc(db, 'sales', saleId);
    await deleteDoc(saleDoc);
    setSales(sales.filter(sale => sale.id !== saleId));
    alert('Venta eliminada con éxito.');
  };

  return (
    <div className="statistics-container">
      <h2>Estadísticas</h2>

      <div className="statistics-summary">
        <div className="statistics-card">
          <p>Total de Ventas</p>
          <span>{totalSales}$</span>
        </div>
        <div className="statistics-card">
          <p>Total de Ventas de Productos</p>
          <span>{totalProductSales}$</span>
        </div>
        <div className="statistics-card">
          <p>Total de Ventas de Servicios</p>
          <span>{totalServiceSales}$</span>
        </div>
        <div className="statistics-card">
          <p>Ganancia Total</p>
          <span>{totalProfit}$</span>
        </div>
      </div>

      <h3>Resumen de Ventas</h3>
      <ul className="sales-list">
        {sales.map((sale, index) => {
          const productCount = sale.items ? sale.items.filter(item => item.type === 'product').length : 0;
          const serviceCount = sale.items ? sale.items.filter(item => item.type === 'service').length : 0;

          const saleProfit = (sale.items ? 
            sale.items.reduce((acc, item) => {
              const itemTotal = (item.salePrice || 0) * (item.quantity || 0);
              const itemPurchasePrice = (item.purchasePrice || 0) * (item.quantity || 0);

              // Sumar ganancias de productos y total de servicios
              if (item.type === 'service') {
                const serviceTotal = (item.servicePrice || 0) * (item.quantity || 0); // Total del servicio vendido
                return acc + serviceTotal; // Solo sumar el total de servicios
              }

              return acc + (itemTotal - itemPurchasePrice);
            }, 0) : 0);

          return (
            <li key={index} className="sale-item">
              <div className="sale-details">
                <p className="customer-name">Cliente: <strong>{sale.customer.name}</strong></p>
                <p className="sale-summary">
                  <span className="summary-text">{productCount} productos</span> | 
                  <span className="summary-text">{serviceCount} servicios</span> | 
                  <span className="summary-text">Ganancia: <strong>{saleProfit}$</strong></span>
                </p>
              </div>
              <ul className="item-list">
                {sale.items.map((item) => (
                  <li key={item.id} className="item">
                    {item.type === 'product' ? item.name : item.serviceName} - {item.quantity} unidades
                  </li>
                ))}
                <div className="delete-button-container">
                  <button className="delete-button" onClick={() => handleDeleteSale(sale.id)}>Eliminar</button>
                </div>
              </ul>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Statistics;


