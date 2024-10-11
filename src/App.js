import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Sales from './components/Sales';
import Statistics from './components/Statistics';
import AddProduct from './components/AddProduct';
import AddService from './components/AddService';
import Caja from './components/Caja';
import Movimientos from './components/Movimientos';
import Login from './views/Login';
import CustomerManagement from './components/CustomerManagement';
import Receipt from './components/Receipt';
import AppointmentCalendar from './components/AppointmentCalendar';
import DetallesCliente from './components/DetallesCliente';
import PrivateRoute from './components/PrivateRoute';
import { auth } from './services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Estado para manejar la carga inicial

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false); // Deja de cargar cuando el estado de autenticación se resuelve
    });

    return () => unsubscribe(); // Limpiar el listener al desmontar
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Puedes agregar un spinner aquí
  }

  return (
    <Router>
      <Routes>
        {/* Ruta raíz que redirige según autenticación */}
        <Route 
          path="/" 
          element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
        />

        {/* Ruta de inicio de sesión */}
        <Route 
          path="/login" 
          element={
            <Layout showSidebar={false}> {/* Ocultar el sidebar en la vista de inicio de sesión */}
              <Login />
            </Layout>
          } 
        />

        {/* Rutas protegidas */}
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <PrivateRoute><Dashboard /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/sales" 
          element={
            <Layout>
              <PrivateRoute><Sales /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/statistics" 
          element={
            <Layout>
              <PrivateRoute><Statistics /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/addproduct" 
          element={
            <Layout>
              <PrivateRoute><AddProduct /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/addservice" 
          element={
            <Layout>
              <PrivateRoute><AddService /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/customermanagement" 
          element={
            <Layout>
              <PrivateRoute><CustomerManagement /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/caja" 
          element={
            <Layout>
              <PrivateRoute><Caja /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/movimientos" 
          element={
            <Layout>
              <PrivateRoute><Movimientos /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/receipt"  // Corregido de "/receip" a "/receipt"
          element={
            <Layout>
              <PrivateRoute><Receipt /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/appointments" 
          element={
            <Layout>
              <PrivateRoute><AppointmentCalendar /></PrivateRoute>
            </Layout>
          } 
        />
        <Route 
          path="/detallescliente" 
          element={
            <Layout>
              <PrivateRoute><DetallesCliente /></PrivateRoute>
            </Layout>
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;






