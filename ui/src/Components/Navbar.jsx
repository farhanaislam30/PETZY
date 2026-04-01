import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import {
  FaHome,
  FaPaw,
  FaStethoscope,
  FaBriefcaseMedical,
  FaBoxOpen,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
  FaUser,
  FaUserCog,
  FaHeart,
  FaShoppingCart,
  FaHandsHelping,
  FaClinicMedical,
} from "react-icons/fa";

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

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [userName, setUserName] = useState(null);
  const navigate = useNavigate();

  // Check if token exists and decode user info when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedRole = localStorage.getItem("userRole");
      const storedName = localStorage.getItem("userName");
      
      console.log('[Navbar Debug] Token exists:', !!token);
      console.log('[Navbar Debug] storedRole:', storedRole);
      console.log('[Navbar Debug] storedName:', storedName);
      
      if (token) {
        setIsAuthenticated(true);
        
        // Try to get role from stored or decode from token
        if (storedRole) {
          console.log('[Navbar Debug] Setting role from localStorage:', storedRole);
          setUserRole(storedRole);
        } else {
          const decoded = decodeJWT(token);
          console.log('[Navbar Debug] Decoded JWT:', decoded);
          if (decoded) {
            setUserRole(decoded.role);
            localStorage.setItem("userRole", decoded.role);
            console.log('[Navbar Debug] Set role from JWT:', decoded.role);
          }
        }
        
        // Get user name
        if (storedName) {
          setUserName(storedName);
        } else {
          const decoded = decodeJWT(token);
          if (decoded && decoded.name) {
            setUserName(decoded.name);
            localStorage.setItem("userName", decoded.name);
          }
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
        setUserName(null);
      }
    };
    
    // Check auth on mount
    checkAuth();
    
    // Listen for storage changes (e.g., when user logs in/out in another tab or component)
    const handleStorageChange = (e) => {
      if (e.key === 'token' || e.key === 'userRole' || e.key === 'userName') {
        console.log('[Navbar Debug] Storage changed:', e.key);
        checkAuth();
      }
    };
    
    // Listen for custom auth change event (dispatched when login/logout happens in same window)
    const handleAuthChange = () => {
      console.log('[Navbar Debug] Auth change event received');
      checkAuth();
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleAuthChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleAuthChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setIsAuthenticated(false);
    setUserRole(null);
    setUserName(null);
    
    // Dispatch auth change event to update navbar
    window.dispatchEvent(new Event('auth-change'));
    
    navigate("/login");
  };

  const isAdmin = userRole === 'admin';

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link to={isAdmin ? "/admin" : "/"} className="navbar-brand d-flex align-items-center">
          <img src="/logo.png" alt="Petzy Logo" className="logo me-2" />
          <span className="fw-bold fs-4">PETZY</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <FaBars />
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav mx-auto">
            {/* Admin Navigation */}
            {isAdmin ? (
              <>
                {/* Manage Pets - Only visible to admin */}
                <li className="nav-item">
                  <NavLink to="/admin/pets" className="nav-link">
                    <FaPaw className="me-1" /> Manage Pets
                  </NavLink>
                </li>

                {/* Manage Products - Only visible to admin */}
                <li className="nav-item">
                  <NavLink to="/admin/products" className="nav-link">
                    <FaBoxOpen className="me-1" /> Manage Products
                  </NavLink>
                </li>

                {/* Manage Doctors - Only visible to admin */}
                <li className="nav-item">
                  <NavLink to="/admin/doctors" className="nav-link">
                    <FaStethoscope className="me-1" /> Manage Doctors
                  </NavLink>
                </li>

                {/* View Orders - Only visible to admin */}
                <li className="nav-item">
                  <NavLink to="/admin" className="nav-link">
                    <FaShoppingCart className="me-1" /> View Orders
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                {/* Home - Visible to regular users */}
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    <FaHome className="me-1" /> Home
                  </NavLink>
                </li>

                {/* Pet Adoption - Only visible to regular users */}
                <li className="nav-item">
                  <NavLink to="/pet" className="nav-link">
                    <FaPaw className="me-1" /> Pet Adoption
                  </NavLink>
                </li>

                {/* Pet Store - Only visible to regular users */}
                <li className="nav-item">
                  <NavLink to="/pet_store" className="nav-link">
                    <FaBoxOpen className="me-1" /> Pet Store
                  </NavLink>
                </li>

                {/* Veterinary - Only visible to regular users */}
                <li className="nav-item">
                  <NavLink to="/Veterinary" className="nav-link">
                    <FaStethoscope className="me-1" /> Veterinary
                  </NavLink>
                </li>

                {/* Cart - Only visible to regular users */}
                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    <FaShoppingCart className="me-1" /> Cart
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-lg-flex d-block text-center">
            {localStorage.getItem("token") ? (
              // Show Profile and Logout when logged in
              <>
                {/* User Name Display */}
                <span className="btn btn-outline-secondary me-2 mb-2 mb-lg-0 d-inline-flex align-items-center user-name-badge">
                  <FaUser className="me-1" />
                  {userName || "User"}
                </span>

                {/* Profile Link - NOT shown for admins */}
                {!isAdmin && (
                  <NavLink
                    to="/profile"
                    className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                  >
                    <FaUser className="me-1" /> Profile
                  </NavLink>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn btn-danger me-2 mb-2 mb-lg-0"
                >
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </>
            ) : (
              // Show Login only when NOT logged in
              <>
                <NavLink
                  to="/login"
                  className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                >
                  <FaSignInAlt className="me-1" /> Login
                </NavLink>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
