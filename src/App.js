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

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sales" element={<Sales />} />
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/addproduct" element={<AddProduct />} />
          <Route path="/addservice" element={<AddService />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;

