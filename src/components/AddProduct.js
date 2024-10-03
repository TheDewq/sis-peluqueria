import React, { useEffect, useState } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase'; // Importa correctamente desde firebase.js
import EditProduct from './EditProduct'; // Asegúrate de importar el componente de edición

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
    <div>
      <h2>Agregar Producto</h2>
      <input
        type="text"
        placeholder="Nombre del producto"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Marca"
        value={brand}
        onChange={(e) => setBrand(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio de compra"
        value={purchasePrice}
        onChange={(e) => setPurchasePrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Precio de venta"
        value={salePrice}
        onChange={(e) => setSalePrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Cantidad"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />
      <button onClick={handleAddProduct}>Agregar Producto</button>

      <h2>Lista de Productos</h2>
      <ul>
        {products.map((product, index) => (
          <li key={index}>
            Nombre: {product.name}, Marca: {product.brand}, Cantidad: {product.quantity}, 
            Precio de Compra: {product.purchasePrice}$, Precio de Venta: {product.salePrice}$
            {product.quantity === 0 ? (
              <span> (Agotado)</span>
            ) : null}
            <button onClick={() => handleEditProduct(product.id)}>Editar</button> {/* Botón para editar */}
            <button onClick={() => handleDeleteProduct(product.id)}>Eliminar</button> {/* Botón para eliminar */}
          </li>
        ))}
      </ul>
      {editingProductId && <EditProduct productId={editingProductId} onClose={handleCloseEdit} />} {/* Modal de edición */}
    </div>
  );
};

export default Inventory;

