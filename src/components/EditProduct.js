import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';

const EditProduct = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newQuantity, setNewQuantity] = useState(0);

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

    fetchProduct();
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
          quantity: parseInt(product.quantity) + parseInt(newQuantity),
        });
        alert('Producto actualizado exitosamente.');
        onClose();
      } catch (error) {
        console.error('Error al actualizar el producto:', error);
      }
    }
  };

  if (loading) return <div>Cargando producto...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close-button" onClick={onClose}>✖</button>
        <h2>Editar Producto</h2>
        <label>Nombre del producto:</label>
        <input
          type="text"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
        />
        <label>Marca:</label>
        <input
          type="text"
          value={product.brand}
          onChange={(e) => setProduct({ ...product, brand: e.target.value })}
        />
        <label>Precio de compra:</label>
        <input
          type="number"
          value={product.purchasePrice}
          onChange={(e) => setProduct({ ...product, purchasePrice: e.target.value })}
        />
        <label>Precio de venta:</label>
        <input
          type="number"
          value={product.salePrice}
          onChange={(e) => setProduct({ ...product, salePrice: e.target.value })}
        />
        <label>Cantidad actual:</label>
        <input
          type="number"
          value={product.quantity}
          readOnly
        />
        <label>Nueva cantidad a ingresar:</label>
        <input
          type="number"
          value={newQuantity}
          onChange={(e) => setNewQuantity(e.target.value)}
        />
        <button onClick={handleUpdateProduct}>Actualizar Producto</button>
        <button className="cancel-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default EditProduct;




