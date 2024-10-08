import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase';
import EditProduct from './EditProduct'; // Asegúrate de importar el componente de edición
import '../styles/styles.css';
const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // Estado para manejar la edición

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productCollection = collection(db, 'products');
        const productSnapshot = await getDocs(productCollection);
        const productList = productSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProducts(productList);
      } catch (err) {
        setError("Error al cargar los productos: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleEditProduct = (id) => {
    setEditingProductId(id); // Abre el modal de edición
  };

  const handleCloseEdit = () => {
    setEditingProductId(null); // Cierra el modal de edición
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            Nombre: {product.name}, Marca: {product.brand}, Cantidad: {product.quantity} {product.measure}, 
            Precio de Compra: {product.purchasePrice}$, Precio de Venta: {product.salePrice}$
            {product.quantity === 0 ? (
              <span> (Agotado)</span>
            ) : null}
            <button onClick={() => handleEditProduct(product.id)}>Editar</button> {/* Botón para editar */}
          </li>
        ))}
      </ul>
      {editingProductId && <EditProduct productId={editingProductId} onClose={handleCloseEdit} />} {/* Modal de edición */}
    </div>
  );
};

export default ProductList;



