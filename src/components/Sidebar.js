// src/components/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Asegúrate de tener react-router-dom instalado

const Sidebar = () => {
  return (
    <nav className="sidebar">
      <h2>Peluquería</h2>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/sales">Realizar Venta</Link></li>
        <li><Link to="/statistics">Estadísticas</Link></li>
        <li><Link to="/addproduct">Inventario</Link></li>
        <li><Link to="/addservice">Servicios</Link></li>


      </ul>
    </nav>
  );
};

export default Sidebar;
