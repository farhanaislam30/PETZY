import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-light py-5">
      <div className="container">
        <div className="row">
          {/* Brand Section */}
          <div className="col-md-4 mb-4 mb-md-0">
            <div className="d-flex align-items-center mb-3">
              <img
                src="/logo.png"
                alt="Petzy Logo"
                style={{ width: "40px", height: "40px" }}
                className="me-2"
              />
              <h5 className="fw-bold mb-0">Petzy</h5>
            </div>
            <p className="text-light opacity-75">
              Your trusted companion in pet adoption and care. We connect loving families with pets in need of homes.
            </p>
            <div className="d-flex gap-3">
              <a
                href="mailto:ridwannafi@gmail.com"
                className="text-light opacity-75"
              >
                <i className="bi bi-envelope fs-5"></i>
              </a>
              <a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light opacity-75"
              >
                <i className="bi bi-linkedin fs-5"></i>
              </a>
              <a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light opacity-75"
              >
                <i className="bi bi-github fs-5"></i>
              </a>
              <a
                href="https://instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light opacity-75"
              >
                <i className="bi bi-instagram fs-5"></i>
              </a>
              <a
                href="https://whatsapp.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light opacity-75"
              >
                <i className="bi bi-whatsapp fs-5"></i>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-4 mb-md-0">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/" className="text-light opacity-75 text-decoration-none">
                  Home
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/pet" className="text-light opacity-75 text-decoration-none">
                  Pet Adoption
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/pet_store" className="text-light opacity-75 text-decoration-none">
                  Pet Store
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/Veterinary" className="text-light opacity-75 text-decoration-none">
                  Veterinary Services
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/services" className="text-light opacity-75 text-decoration-none">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className="col-md-4">
            <h5 className="fw-bold mb-3">Contact & Support</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <Link to="/contact" className="text-light opacity-75 text-decoration-none">
                  Contact Us
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/donation" className="text-light opacity-75 text-decoration-none">
                  Donations
                </Link>
              </li>
              <li className="mb-2">
                <Link to="/faq" className="text-light opacity-75 text-decoration-none">
                  FAQ
                </Link>
              </li>
              <li className="mb-2">
                <a href="mailto:ridwannafi@gmail.com" className="text-light opacity-75 text-decoration-none">
                  Support: ridwannafi@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <p className="mb-0 opacity-75">
            © 2025 Petzy - Your Path to Pet Adoption. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
