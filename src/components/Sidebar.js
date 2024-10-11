import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/styles.css';
import { FaHome, FaCashRegister, FaBoxOpen, FaCut, FaChartBar, FaUser, FaMoneyBillAlt, FaExchangeAlt, FaCalendarAlt, FaClipboardList, FaSignOutAlt } from 'react-icons/fa';
import { auth } from '../services/firebase'; // Importamos Firebase Auth

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut(); // Firebase signOut
      navigate('/login'); // Redirigir al login después de cerrar sesión
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <nav className="sidebar">
      <h2>PELUQUERIA</h2>
      <ul>
        <li><Link to="/"><FaHome /> Inicio</Link></li>
        <li><Link to="/sales"><FaMoneyBillAlt /> Realizar Venta</Link></li>
        <li><Link to="/statistics"><FaChartBar /> Estadísticas</Link></li>
        <li><Link to="/addproduct"><FaBoxOpen /> Inventario</Link></li>
        <li><Link to="/addservice"><FaCut /> Servicios</Link></li>
        <li><Link to="/customermanagement"><FaUser /> Clientes</Link></li>
        <li><Link to="/caja"><FaCashRegister /> Caja</Link></li>
        <li><Link to="/movimientos"><FaExchangeAlt /> Movimientos</Link></li>
        <li><Link to="/appointments"><FaCalendarAlt /> Agendar Citas</Link></li>
        <li><Link to="/detallescliente"><FaClipboardList /> Detalles De Citas</Link></li>
        {/* Botón de Cerrar Sesión */}
        <li>
          <button className="logout-button" onClick={handleLogout}>
            <FaSignOutAlt /> Cerrar Sesión
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Sidebar;


