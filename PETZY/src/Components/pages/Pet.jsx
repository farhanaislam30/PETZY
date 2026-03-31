import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import ShowInterestForm from "./ShowInterestForm";

const Pet = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All Pets");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interestedPets, setInterestedPets] = useState(new Set());

  // Fetch pets from backend API
  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/pets");
        setPets(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching pets:", err);
        setError("Failed to load pets. Please try again later.");
        setLoading(false);
      }
    };

    fetchPets();
  }, []);

  const handleShowInterest = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleInterestSubmitted = (petId) => {
    setInterestedPets((prev) => new Set([...prev, petId]));
  };

  const handleClose = () => {
    setShowModal(false);
    setSelectedPet(null);
  };

  const filteredPets =
    filter === "All Pets"
      ? pets
      : pets.filter((pet) => pet.type?.toLowerCase() === filter.toLowerCase());

  if (loading) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Loading pets...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5 pt-5 text-center">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center" style={{ color: "rgb(63, 136, 238)" }}>
        Find Your New Friend 🐾
      </h2>
      <div className="d-flex justify-content-end mb-3">
        <select
          className="form-select w-auto"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option>All Pets</option>
          <option>Cat</option>
          <option>Dog</option>
          <option>Rabbit</option>
          <option>Fish</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
      </div>

      {filteredPets.length === 0 ? (
        <div className="text-center mt-5">
          <h4 style={{ color: "rgb(63, 136, 238)" }}>🐾 No pets available</h4>
          <p className="text-muted">Check back later for new pets!</p>
        </div>
      ) : (
        <div className="row mt-4">
          {filteredPets.map((pet) => (
            <div key={pet._id || pet.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div className="card shadow-sm pet-card h-100">
                <img
                  src={pet.image || "/placeholder-pet.jpg"}
                  className="card-img-top"
                  alt={pet.name}
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/homepet.png";
                  }}
                />
                <div className="card-body text-center">
                  <h5 className="fw-bold" style={{ color: "rgb(63, 136, 238)" }}>
                    {pet.name}
                  </h5>
                  <p className="text-muted">
                    <strong>Type:</strong> {pet.type || "N/A"} <br />
                    <strong>Age:</strong> {pet.age || "N/A"} <br />
                    <strong>Location:</strong> {pet.location || "N/A"} <br />
                  </p>
                  <button
                    className="btn btn-primary w-100"
                    disabled={interestedPets.has(pet._id || pet.id)}
                    onClick={() => handleShowInterest(pet)}
                  >
                    {interestedPets.has(pet._id || pet.id)
                      ? "Interested"
                      : "Show Interest 🐾"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {showModal && (
        <ShowInterestForm
          pet={selectedPet}
          onClose={handleClose}
          onInterestSubmitted={handleInterestSubmitted}
        />
      )}
    </div>
  );
};

export default Pet;
