// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Sales from './components/Sales';
import Statistics from './components/Statistics';
import ProductList from './components/ProductList';
import ServiceList from './components/ServiceList';
import AddProduct from './components/AddProduct';
import AddService from './components/AddService';
import Caja from './components/Caja';
import Movimientos from './components/Movimientos';
import Login from './views/Login';
import CustomerManagement from './components/CustomerManagement';
import Receipt from './components/Receipt';
import AppointmentCalendar from './components/AppointmentCalendar';
import DetallesCliente from './components/DetallesCliente';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Rutas principales de la aplicación */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addservice" element={<AddService />} />
          <Route path="/customermanagement" element={<CustomerManagement />} />
          <Route path="/caja" element={<Caja />} />
          <Route path="/movimientos" element={<Movimientos />} />
          <Route path="/receip" element={<Receipt />} />
          <Route path="/appointments" element={<AppointmentCalendar />} />
          <Route path="/detallescliente" element={<DetallesCliente />} />
          
          {/* Ruta de inicio de sesión */}
          <Route path="/login" element={<Login />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;


