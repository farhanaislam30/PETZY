import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import {
  FaHome,
  FaPaw,
  FaStethoscope ,
  FaBriefcaseMedical ,
  FaBoxOpen,
  FaEnvelope,
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";

const Navbar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Check if token exists when component mounts
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center">
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
            <li className="nav-item">
              <NavLink to="/" className="nav-link">
                <FaHome className="me-1" /> Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/pet" className="nav-link">
                <FaPaw className="me-1" /> Pet
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/pet_store" className="nav-link">
                <FaBoxOpen className="me-1" /> Pet Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact" className="nav-link">
                <FaEnvelope className="me-1" /> Contact Us
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/Veterinary" className="nav-link">
                <FaStethoscope className="me-1" /> Veterinary
              </NavLink>
            </li> 
            <li className="nav-item">
              <NavLink to="/add-doctor" className="nav-link">
                <FaBriefcaseMedical className="me-1" /> Add Doctor
              </NavLink>
            </li> 
          </ul>

          <div className="d-lg-flex d-block text-center">  
            {localStorage.getItem("token") ? (
              // Show Logout button when logged in
              <button
                onClick={handleLogout}
                className="btn btn-danger me-2 mb-2 mb-lg-0"
              >
                <FaSignOutAlt className="me-1" /> Logout
              </button>
            ) : (
              // Show Login and Register when NOT logged in
              <>
                <NavLink
                  to="/login"
                  className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                >
                  <FaSignInAlt className="me-1" /> Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn btn-outline-primary me-2 mb-2 mb-lg-0"
                >
                  <FaUserPlus className="me-1" /> Register
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
