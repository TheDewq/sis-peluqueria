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

        if (Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            const itemTotal = (item.salePrice || 0) * (item.quantity || 0); 
            totalProductAmount += itemTotal;

            const itemPurchasePrice = (item.purchasePrice || 0) * (item.quantity || 0); 
            totalProfitAmount += (itemTotal - itemPurchasePrice); 
          });
        }

        if (Array.isArray(sale.services)) {
          sale.services.forEach(service => {
            const serviceTotal = (service.price || 0) * (service.quantity || 1);
            totalServiceAmount += serviceTotal;
            totalProfitAmount += serviceTotal - (service.purchasePrice || 0) * (service.quantity || 1);
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
          <p>Ganancia Total de Productos</p>
          <span>{totalProfit}$</span>
        </div>
      </div>

      <h3>Resumen de Ventas</h3>
      <ul className="sales-list">
        {sales.map((sale, index) => {
          const productCount = sale.items ? sale.items.length : 0;
          const serviceCount = sale.services ? sale.services.length : 0;

          const saleProfit = (sale.items ? 
            sale.items.reduce((acc, item) => {
              const itemTotal = (item.salePrice || 0) * (item.quantity || 0);
              const itemPurchasePrice = (item.purchasePrice || 0) * (item.quantity || 0);
              return acc + (itemTotal - itemPurchasePrice);
            }, 0) : 0) + (sale.services ? 
            sale.services.reduce((acc, service) => {
              const serviceTotal = (service.price || 0) * (service.quantity || 1);
              const servicePurchasePrice = (service.purchasePrice || 0) * (service.quantity || 1);
              return acc + (serviceTotal - servicePurchasePrice);
            }, 0) : 0);

          return (
            <li key={index}>
              <p>
                {productCount} productos, {serviceCount} servicios, Ganancia: {saleProfit}$
                <ul>
                  {sale.items.map((item) => (
                    <li key={item.id}>{productsMap[item.id]} - {item.quantity} unidades</li>
                  ))}
                  {sale.services && sale.services.map((service) => (
                    <li key={service.id}>{service.name} - {service.quantity} unidades</li>
                  ))}
                </ul>
                <button onClick={() => handleDeleteSale(sale.id)}>Eliminar</button>
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Statistics;
