import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';

const Statistics = () => {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalProductSales, setTotalProductSales] = useState(0);
  const [totalServiceSales, setTotalServiceSales] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [productsMap, setProductsMap] = useState({}); // Para almacenar los productos y sus nombres

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

      // Crear un mapa para los productos
      const productsCollection = collection(db, 'products');
      const productsSnapshot = await getDocs(productsCollection);
      const productsList = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const productMap = productsList.reduce((acc, product) => {
        acc[product.id] = product.name; // Asigna el nombre al ID del producto
        return acc;
      }, {});
      setProductsMap(productMap); // Almacena el mapa de productos

      salesList.forEach(sale => {
        totalSalesAmount += sale.totalAmount || 0;

        if (Array.isArray(sale.items)) {
          sale.items.forEach(item => {
            const itemTotal = item.salePrice * item.quantity || 0; 
            totalProductAmount += itemTotal;
            const itemPurchasePrice = item.purchasePrice * item.quantity || 0; 
            totalProfitAmount += (itemTotal - itemPurchasePrice); 
          });
        }

        if (Array.isArray(sale.services)) {
          sale.services.forEach(service => {
            const servicePrice = service.price || 0; 
            totalServiceAmount += servicePrice;
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
    setSales(sales.filter(sale => sale.id !== saleId)); // Actualizar el estado local
    alert('Venta eliminada con éxito.');
  };

  return (
    <div>
      <h2>Estadísticas</h2>
      <p>Total de Ventas: {totalSales}$</p>
      <p>Total de Ventas de Productos: {totalProductSales}$</p>
      <p>Total de Ventas de Servicios: {totalServiceSales}$</p>
      <p>Ganancia Total de Productos: {totalProfit}$</p>

      <h3>Resumen de Ventas</h3>
      <ul>
        {sales.map((sale, index) => {
          const productCount = sale.items ? sale.items.length : 0;
          const serviceCount = sale.services ? sale.services.length : 0;

          const saleProfit = sale.items ? 
            sale.items.reduce((acc, item) => {
              const itemTotal = item.salePrice * item.quantity || 0;
              const itemPurchasePrice = item.purchasePrice * item.quantity || 0;
              return acc + (itemTotal - itemPurchasePrice);
            }, 0) : 0;

          return (
            <li key={index}>
              <p>
                {productCount} productos, {serviceCount} servicios, Ganancia: {saleProfit}$
                <ul>
                  {sale.items.map((item) => (
                    <li key={item.id}>{productsMap[item.id]} - {item.quantity} unidades</li>
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














