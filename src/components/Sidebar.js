// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado
import '../styles/styles.css';

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>PELUQUERIA</h2>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/sales">Realizar Venta</Link></li>
        <li><Link to="/statistics">Estadísticas</Link></li>
        <li><Link to="/addproduct">Inventario</Link></li>
        <li><Link to="/addservice">Servicios</Link></li>
        <li><Link to="/customermanagement">Clientes</Link></li>
        <li><Link to="/caja">Caja</Link></li>
        <li><Link to="/movimientos">Movimientos</Link></li>
        <li><Link to="/appointments">Agendar Citas</Link></li>
        <li><Link to="/detallescliente">Detalles De Citas</Link></li>





      </ul>
    </nav>
  );
};

export default Sidebar;
