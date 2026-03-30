import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Veterinary.css";

const Veterinary = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all doctors from API
    const fetchDoctors = async () => {
      try {
        const response = await axios.get("http://localhost:3000/doctors"); // replace with your API URL
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors([]); // fallback to empty
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <div className="container container-vet">
      {/* Header */}
      <div className="vet-header">
        <h1>Meet Our Veterinarians</h1>
        <p>
          Our experienced veterinary team is here to ensure the health and happiness of your pets.
        </p>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center mt-5">
          <h4 style={{ color: "rgb(63, 136, 238)" }}>Loading veterinarians...</h4>
        </div>
      ) : doctors.length === 0 ? (
        <div className="text-center mt-5">
          <h4 style={{ color: "rgb(63, 136, 238)" }}>🐾 No veterinarians available right now</h4>
          <p className="text-muted">
            Please check back later or contact us for more information.
          </p>
        </div>
      ) : (
        <div className="row g-4 mt-3">
          {doctors.map((doc, index) => (
            <div key={index} className="col-md-6 col-lg-4">
              <div className="card vet-card h-100 shadow-sm">
                <img
                  src={doc.image || "/default-doctor.png"} // fallback image
                  className="card-img-top"
                  alt={doc.name}
                />
                <div className="card-body text-center">
                  <h5 className="card-title">{doc.name}</h5>
                  <p className="card-text">{doc.specialization}</p>
                  <p className="mb-1">
                    <i className="bi bi-envelope-fill me-2"></i>
                    <a href={`mailto:${doc.email}`} className="text-dark text-decoration-none">
                      {doc.email}
                    </a>
                  </p>
                  <p>
                    <i className="bi bi-telephone-fill me-2"></i>
                    <a href={`tel:${doc.phone}`} className="text-dark text-decoration-none">
                      {doc.phone}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Veterinary;