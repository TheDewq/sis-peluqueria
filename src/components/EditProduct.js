import React, { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';

const EditProduct = ({ productId, onClose }) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
          quantity: parseInt(product.quantity),
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
        placeholder="Cantidad"
        value={product.quantity}
        onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
      />
      <button onClick={handleUpdateProduct}>Actualizar Producto</button>
      <button onClick={onClose}>Cancelar</button>
    </div>
  );
};

export default EditProduct;
