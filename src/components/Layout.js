// src/components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import '../styles/styles.css'; // Asegúrate de tener los estilos

const Layout = ({ children }) => {
  return (
    <div className="layout">
      <Sidebar />
      <div className="content">
        {children}
      </div>
    </div>
  );
};

export default Layout;
