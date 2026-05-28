import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './pages/Homepage';
import Shop from './pages/Shop';
import Checkout from './pages/Checkout';
import Cart from './pages/Cart.tsx';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import AdminOrders from './pages/AdminOrders';
import AdminMenuEditor from './pages/AdminMenuEditor';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Homepage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />

        {/* Customer Protected Routes */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <Checkout />
            </ProtectedRoute>
          } 
        />

        {/* Admin Protected Routes */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/orders" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminOrders />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/menu" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMenuEditor />
            </ProtectedRoute>
          } 
        />

        {/* Fallback */}
        <Route path="*" element={<Homepage />} />
      </Routes>
    </Router>
  );
}
