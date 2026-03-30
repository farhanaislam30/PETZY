import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Footer = () => {
  return (
    <footer className="bg-light py-5">
      <div className="container text-center">
        <div className="mb-4">
          <img
            src="/logo.png"
            alt="PawFinds Logo"
            style={{ width: "50px", height: "50px" }}
            className="mb-2"
          />
          <h5 className="fw-bold mb-0">Petzy</h5>
          <p className="text-muted">Your Path to Pet Adoption</p>
        </div>

        <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
          <a
            href="mailto:farhananitu30@gmail.com"
            className="text-muted text-decoration-none"
          >
            <i className="bi bi-envelope fs-4"></i>
          </a>
          <a
            href="https://linkedin.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-decoration-none"
          >
            <i className="bi bi-linkedin fs-4"></i>
          </a>
          <a
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-decoration-none"
          >
            <i className="bi bi-github fs-4"></i>
          </a>
          <a
            href="https://instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-decoration-none"
          >
            <i className="bi bi-instagram fs-4"></i>
          </a>
          <a
            href="https://whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted text-decoration-none"
          >
            <i className="bi bi-whatsapp fs-4"></i>
          </a>
        </div>

        <p className="text-muted">
          You can reach me at{" "}
          <a
            href="mailto:farhananitu30@gmail.com"
            className="text-decoration-none"
          >
            farhananitu30@gmail.com
          </a>
        </p>

        {/* Copyright */}
        <div className="text-muted mt-4">
          © 2025 Petzy - Your Path to Pet Adoption
        </div>
      </div>
    </footer>
  );
};

export default Footer;
