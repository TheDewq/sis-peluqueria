import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../services/firebase';

const EditProduct = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [inventory, setInventory] = useState([]); // Estado para almacenar los productos en inventario
  const [newQuantity, setNewQuantity] = useState(0); // Estado para la nueva cantidad de productos que se ingresan

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productRef = doc(db, 'products', productId);
        const productDoc = await getDoc(productRef);
        if (productDoc.exists()) {
          setProduct({ id: productDoc.id, ...productDoc.data() });
        } else {
          setError('Producto no encontrado.');
        }
      } catch (err) {
        setError('Error al cargar el producto: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchInventory = async () => {
      try {
        const productsSnapshot = await getDocs(collection(db, 'products'));
        const productList = productsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setInventory(productList);
      } catch (err) {
        setError('Error al cargar el inventario: ' + err.message);
      }
    };

    fetchProduct();
    fetchInventory();
  }, [productId]);

  const handleUpdateProduct = async () => {
    if (product) {
      try {
        const productRef = doc(db, 'products', product.id);
        await updateDoc(productRef, {
          name: product.name,
          brand: product.brand,
          purchasePrice: parseFloat(product.purchasePrice),
          salePrice: parseFloat(product.salePrice),
          quantity: parseInt(product.quantity) + parseInt(newQuantity), // Sumar nueva cantidad
        });
        alert('Producto actualizado exitosamente.');
        onClose(); // Cerrar el modal o componente
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>Editar Producto</h2>
      
      <input
        type="text"
        placeholder="Nombre del producto"
        value={product.name}
        onChange={(e) => setProduct({ ...product, name: e.target.value })}
      />
      <input
        type="text"
        placeholder="Marca"
        value={product.brand}
        onChange={(e) => setProduct({ ...product, brand: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio de compra"
        value={product.purchasePrice}
        onChange={(e) => setProduct({ ...product, purchasePrice: e.target.value })}
      />
      <input
        type="number"
        placeholder="Precio de venta"
        value={product.salePrice}
        onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
      />
      <input
        type="number"
        placeholder="Cantidad actual"
        value={product.quantity}
        readOnly // Este campo es de solo lectura
      />
      <input
        type="number"
        placeholder="Nueva cantidad a ingresar"
        value={newQuantity}
        onChange={(e) => setNewQuantity(e.target.value)}
      />
      <button onClick={handleUpdateProduct}>Actualizar Producto</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default EditProduct;

