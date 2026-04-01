import { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import Navbar from "./Components/Navbar";
import Home from "./Components/pages/Home";
import Veterinary from "./Components/pages/Veterinary";
import Pet from "./Components/pages/Pet";
import Pet_Store from "./Components/pages/Pet_Store";
import Donation from "./Components/pages/Donation";
import AddDoctor from "./Components/pages/AddDoctor";
import Donatepage from "./Components/pages/Donatepage";
import Contact from "./Components/pages/Contact";
import Services from "./Components/pages/Services";
import Cart from "./Components/pages/Cart";
import Logout from "./Components/Logout";
import AdminPanel from "./Components/pages/AdminPanel";
import ManagePets from "./Components/pages/ManagePets";
import ManageProducts from "./Components/pages/ManageProducts";
import ManageDoctors from "./Components/pages/ManageDoctors";
import Profile from "./Components/pages/Profile";
import Footer from "./Components/pages/Footer";
import FAQ from "./Components/pages/FAQ";

// Helper function to decode JWT token
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};

// Protected Route component for logged-in users
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// Admin Route component - only accessible to admins
const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  
  console.log('[AdminRoute Debug] Token exists:', !!token);
  console.log('[AdminRoute Debug] userRole from localStorage:', userRole);
  
  if (!token) {
    console.log('[AdminRoute Debug] No token - redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Check role from token if not in localStorage
  if (userRole !== 'admin') {
    const decoded = decodeJWT(token);
    console.log('[AdminRoute Debug] Decoded JWT role:', decoded?.role);
    if (!decoded || decoded.role !== 'admin') {
      console.log('[AdminRoute Debug] Not admin - showing access denied');
      return (
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column',
          justifyContent: 'center', 
          alignItems: 'center', 
          minHeight: '60vh',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h2 style={{ color: '#dc3545', marginBottom: '10px' }}>Access Denied</h2>
          <p style={{ color: '#666' }}>You do not have permission to access this page.</p>
          <p style={{ color: '#666' }}>Only administrators can access the Admin Panel.</p>
          <a href="/" style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#1976d2', 
            color: 'white', 
            textDecoration: 'none',
            borderRadius: '5px'
          }}>Go to Home</a>
        </div>
      );
    }
  }
  
  console.log('[AdminRoute Debug] Admin access granted - rendering children');
  return children;
};

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route index element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/pet" element={<Pet />}></Route>
          <Route path="/pet_store" element={<Pet_Store />}></Route>
          <Route path="/donation" element={<Donation />}></Route>
          <Route path="/donate" element={<Donatepage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/services" element={<Services />}></Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/Veterinary" element={<Veterinary />} />
          <Route path="/add-doctor" element={<AddDoctor />} />
          
          {/* Protected Profile Route - logged in users only */}
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes - separate pages - MUST come before /admin */}
          <Route 
            path="/admin/pets" 
            element={
              <AdminRoute>
                <ManagePets />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <AdminRoute>
                <ManageProducts />
              </AdminRoute>
            } 
          />
          <Route 
            path="/admin/doctors" 
            element={
              <AdminRoute>
                <ManageDoctors />
              </AdminRoute>
            } 
          />
          
          {/* Admin Route - admin only - MUST come after specific routes */}
          <Route 
            path="/admin" 
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            } 
          />
        </Routes>
        <Footer></Footer>
      </BrowserRouter>
    </>
  );
}

export default App;
