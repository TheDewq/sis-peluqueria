// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import '../styles/styles.css'; // Asegúrate de tener los estilos

const Layout = ({ children, showSidebar = true }) => {
  return (
    <div className="layout">
      {showSidebar && <Sidebar />} {/* Mostrar sidebar solo si showSidebar es true */}
      <div className={`content ${showSidebar ? '' : 'full-width'}`}>
        {children}
      </div>
    </div>
  );
};

export default Layout;

