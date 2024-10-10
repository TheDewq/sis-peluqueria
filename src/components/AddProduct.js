import React, { useEffect, useState } from 'react';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Importa correctamente desde firebase.js
import EditProduct from './EditProduct'; // Asegúrate de importar el componente de edición
import AddProductModal from './AddProductModal'; // Importa el nuevo modal
import '../styles/styles.css';

const Inventory = () => {
  // Estado para la lista de productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // Estado para manejar la edición
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar el modal

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

  const handleDeleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));
      alert('Producto eliminado exitosamente');
      fetchProducts(); // Actualiza la lista después de eliminar
    } catch (error) {
      console.error('Error al eliminar producto:', error);
    }
  };

  useEffect(() => {
    fetchProducts(); // Cargar productos al montar el componente
  }, []);

  const handleEditProduct = (id) => {
    setEditingProductId(id); // Abre el modal de edición
  };

  const handleCloseEdit = () => {
    setEditingProductId(null); // Cierra el modal de edición
    fetchProducts(); // Actualiza la lista después de editar
  };

  const handleOpenModal = () => {
    setIsModalOpen(true); // Abre el modal para agregar productos
  };

  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal
  };

  const handleProductAdded = () => {
    fetchProducts(); // Actualiza la lista después de agregar un producto
  };

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="inventory-container">
      <button className="add-button" onClick={handleOpenModal}>Agregar Producto</button>
      <h2>Lista de Productos</h2>
      <ul className="product-list">
        {products.map((product, index) => (
          <li key={index} className="product-item">
            <span><strong>Nombre:</strong> {product.name}</span>, 
            <span><strong>Marca:</strong> {product.brand}</span>, 
            <span><strong>Cantidad:</strong> {product.quantity}</span>, 
            <span><strong>Precio de Compra:</strong> {product.purchasePrice}$</span>, 
            <span><strong>Precio de Venta:</strong> {product.salePrice}$</span>
            {product.quantity === 0 ? (
              <span className="out-of-stock"> (Agotado)</span>
            ) : null}
            <div className="product-actions">
              <button className="edit-button" onClick={() => handleEditProduct(product.id)}>Editar</button> 
              <button className="delete-button" onClick={() => handleDeleteProduct(product.id)}>Eliminar</button> 
            </div>
          </li>
        ))}
      </ul>
      {editingProductId && <EditProduct productId={editingProductId} onClose={handleCloseEdit} />}
      {isModalOpen && (
        <AddProductModal onClose={handleCloseModal} onProductAdded={handleProductAdded} />
      )}
    </div>
  );
};

export default Inventory;




