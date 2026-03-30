import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import ShowInterestForm from "./ShowInterestForm";

const petsData = [
  {
    id: 1,
    name: "Simba",
    type: "Cat",
    age: "2 weeks",
    location: "Dhanmondi,Dhaka",
    time: "about 1 hour ago",
    image: "./cat1.jpg",
  },
  {
    id: 2,
    name: "Max",
    type: "Dog",
    age: "2 years",
    location: "Tejgaon, Dhaka",
    time: "5 hours ago",
    image: "./dog1.jpg",
  },
  {
    id: 3,
    name: "Bella",
    type: "Dog",
    age: "2 months",
    location: "Mirpur 10, Dhaka",
    time: "11 hours ago",
    image: "./dog2.jpg",
  },
  {
    id: 4,
    name: "Oliver",
    type: "Cat",
    age: "1 year",
    location: "Lalmatia, Dhaka",
    time: "19 hours ago",
    image: "./cat2.jpg",
  },
  {
    id: 5,
    name: "Thumper",
    type: "Rabbit",
    age: "1 year",
    location: "Naogaon, Rajshahi",
    time: "1 day ago",
    image: "./rabbit1.jpg",
  },
  {
    id: 6,
    name: "Flopsy",
    type: "Rabbit",
    age: "1.5 years",
    location: "Srimangal, Sylhet",
    time: "1 day ago",
    image: "./rabbit2.jpg",
  },
  {
    id: 7,
    name: "Goldie",
    type: "Fish",
    age: "6 months",
    location: "Uttora, Dhaka",
    time: "1 day ago",
    image: "./fish.jpg",
  },
  {
    id: 8,
    name: "Polly",
    type: "Bird",
    age: "1 year",
    location: "Bandarban, CTG",
    time: "1 day ago",
    image: "./bird1.jpg",
  },
  {
    id: 9,
    name: "Tweety",
    type: "Bird",
    age: "8 months",
    location: "Gazipur, Dhaka",
    time: "2 days ago",
    image: "./bird2.jpg",
  },
  {
    id: 10,
    name: "Bubbles",
    type: "Ginipig",
    age: "1.5 years",
    location: "Sitakundo, CTG",
    time: "2 days ago",
    image: "./other1ginipig.jpg",
  },
  {
    id: 11,
    name: "Tufan",
    type: "Cat",
    age: "2 months",
    location: "Uttora, Dhaka",
    time: "2 days ago",
    image: "./cat3.jpg",
  },
  {
    id: 12,
    name: "Galaxy",
    type: "Dog",
    age: "11 months",
    location: "Mirpur 10, Dhaka",
    time: "2 days ago",
    image: "./dog4.jpg",
  },
  {
    id: 13,
    name: "Toffee",
    type: "Cat",
    age: "2 years",
    location: "Banasree, Dhaka",
    time: "3 days ago",
    image: "./cat4.jpg",
  },
];



const Pet = () => {
  const [filter, setFilter] = useState("All Pets");
  const [selectedPet, setSelectedPet] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [interestedPets, setInterestedPets] = useState(new Set()); // Track interested pets

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
    filter === "All Pets" ? petsData : petsData.filter((pet) => pet.type.toLowerCase() === filter.toLowerCase());

  return (
    <div className="container mt-5 pt-5">
      <h2 className="text-center" style={{ color: "rgb(63, 136, 238)" }}>Find Your New Friend 🐾</h2>
      <div className="d-flex justify-content-end mb-3">
        <select className="form-select w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option>All Pets</option>
          <option>Cat</option>
          <option>Dog</option>
          <option>Rabbit</option>
          <option>Fish</option>
          <option>Bird</option>
          <option>Other</option>
        </select>
      </div>
      <div className="row mt-4">
        {filteredPets.map((pet) => (
          <div key={pet.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className="card shadow-sm pet-card">
              <img src={pet.image} className="card-img-top" alt={pet.name} style={{ height: "200px", objectFit: "cover" }} />
              <div className="card-body text-center">
                <h5 className="fw-bold" style={{ color: "rgb(63, 136, 238)" }}>{pet.name}</h5>
                <p className="text-muted">
                  <strong>Type:</strong> {pet.type} <br />
                  <strong>Age:</strong> {pet.age} <br />
                  <strong>Location:</strong> {pet.location} <br />
                </p>
                <button className="btn btn-primary w-100" disabled={interestedPets.has(pet.id)}
                  onClick={() => handleShowInterest(pet)}>
                  {interestedPets.has(pet.id) ? "Interested" : "Show Interest 🐾"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {showModal && <ShowInterestForm pet={selectedPet} onClose={handleClose} onInterestSubmitted={handleInterestSubmitted} />}
    </div>
  );
};

export default Pet;
