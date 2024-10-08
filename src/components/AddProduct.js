import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Importa correctamente desde firebase.js
import EditProduct from './EditProduct'; // Asegúrate de importar el componente de edición
import '../styles/styles.css';

const Inventory = () => {
  // Estado para agregar productos
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  
  // Estado para la lista de productos
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null); // Estado para manejar la edición

  const handleAddProduct = async () => {
    try {
      await addDoc(collection(db, 'products'), {
        name: productName,
        brand: brand,
        purchasePrice: parseFloat(purchasePrice),
        salePrice: parseFloat(salePrice),
        quantity: parseInt(quantity),
        createdAt: new Date(),
      });
      alert('Producto agregado exitosamente');
      // Reinicia los campos después de agregar
      setProductName('');
      setBrand('');
      setPurchasePrice(0);
      setSalePrice(0);
      setQuantity(0);
      fetchProducts(); // Actualiza la lista después de agregar
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

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

  if (loading) return <div>Cargando productos...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="inventory-container">
      <h2>Agregar Producto</h2>
      <input
        type="text"
        className="input-field"
        placeholder="Nombre del producto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        className="input-field"
        placeholder="Marca"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <input
        type="number"
        className="input-field"
        placeholder="Precio de compra"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
      />
      <input
        type="number"
        className="input-field"
        placeholder="Precio de venta"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />
      <input
        type="number"
        className="input-field"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button className="add-button" onClick={handleAddProduct}>Agregar Producto</button>

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
    </div>
  );
};

export default Inventory;


