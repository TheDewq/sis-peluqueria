import React, { useState } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import '../styles/styles.css';

const AddProductModal = ({ onClose, onProductAdded }) => {
  const [productName, setProductName] = useState('');
  const [brand, setBrand] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [salePrice, setSalePrice] = useState(0);
  const [quantity, setQuantity] = useState(0);

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
      onProductAdded(); // Llama a la función para actualizar la lista
      onClose(); // Cierra el modal
    } catch (error) {
      console.error('Error al agregar producto:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Agregar Producto</h2>
        <label className="input-label">
          Nombre del producto
          <input
            type="text"
            className="input-field"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>
        <label className="input-label">
          Marca
          <input
            type="text"
            className="input-field"
            value={brand}
            onChange={(e) => setBrand(e.target.value)}
          />
        </label>
        <label className="input-label">
          Precio de compra
          <input
            type="number"
            className="input-field"
            value={purchasePrice}
            onChange={(e) => setPurchasePrice(e.target.value)}
          />
        </label>
        <label className="input-label">
          Precio de venta
          <input
            type="number"
            className="input-field"
            value={salePrice}
            onChange={(e) => setSalePrice(e.target.value)}
          />
        </label>
        <label className="input-label">
          Cantidad
          <input
            type="number"
            className="input-field"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </label>
        <button className="add-button" onClick={handleAddProduct}>Agregar Producto</button>
        <button className="cancel-button" onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default AddProductModal;
