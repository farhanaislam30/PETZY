import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const Contact = () => {
  return (
    <div className="container py-5" style={{ marginTop: "80px" }}>
      <div className="row justify-content-center align-items-center">
        <div className="col-md-6 text-center text-md-start">
          <h1 className="fw-bold mb-3" style={{ color: "rgb(63, 136, 238)" }}>Let’s Get in Touch</h1>
          <p className="fw-semibold text-muted mb-4" style={{ fontSize: "1.2rem" }}>
            Have any questions? Feel free to reach out. We’d love to hear from you!
          </p>
          <div className="mb-3">
            <i className="bi bi-envelope-fill text-primary me-2"></i>
            <a href="mailto:snehaaa120@gmail.com" className="text-dark fw-semibold text-decoration-none">
              snehaaa120@gmail.com
            </a>
          </div>
          <div className="mb-3">
            <i className="bi bi-telephone-fill text-success me-2"></i>
            <a href="tel:+8801749411698" className="text-dark fw-semibold text-decoration-none">
              +8801749411698
            </a>
          </div>

          <p className="fw-bold mt-4">Follow us on:</p>
          <div className="d-flex justify-content-center justify-content-md-start gap-3">
            <a href="https://www.linkedin.com/in/sadia-hossain-095090254?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-linkedin fs-5"></i>
            </a>
            <a href="https://github.com/hossain-sneha" className="text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-github fs-5"></i>
            </a>
            <a href="https://www.instagram.com/sadia_hossain_sneha?igsh=MXJod25mcGZjN2ttdw==" className="text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-instagram fs-5"></i>
            </a>
            <a href="https://wa.me/qr/HS6EFLFBBI7OA1" className="text-dark text-decoration-none" target="_blank" rel="noopener noreferrer">
              <i className="bi bi-whatsapp fs-5"></i>
            </a>
          </div>
        </div>

        <div className="col-md-6 text-center mt-4 mt-md-0">
          <img src="/contact.png" alt="Contact Us" className="img-fluid" style={{ maxWidth: "30%", borderRadius: "15px" }} />
        </div>
      </div>
    </div>
  );
};

export default Contact;