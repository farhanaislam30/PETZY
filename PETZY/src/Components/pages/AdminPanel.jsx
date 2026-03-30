import React, { useState, useEffect } from "react";
import "./AdminPanel.css";

const AdminPanel = ({ pets, setPets }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    setRequests(pets);
  }, [pets]);

 
  const handleApprove = (id) => {
    const updatedRequests = requests.filter((pet) => pet.id !== id);
    setRequests(updatedRequests);

    setPets((prevPets) => prevPets.filter((pet) => pet.id !== id)); 
  };


  const handleReject = (id) => {
    setRequests((prevRequests) => prevRequests.filter((pet) => pet.id !== id));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="pet-requests">
        {requests.length > 0 ? (
          requests.map((pet) => (
            <div key={pet.id} className="pet-card">
              <img src={pet.image} alt={pet.name} style={{ width: "100px", height: "100px" }} />
              <h3>{pet.name}</h3>
              <p><strong>Type:</strong> {pet.type}</p>
              <p><strong>Age:</strong> {pet.age} months</p>
              <p><strong>Location:</strong> {pet.location}</p>
              <p><strong>Owner Email:</strong> {pet.ownerEmail}</p>
              <p><strong>Justification:</strong> {pet.justification}</p>
              <button className="reject-btn" onClick={() => handleReject(pet.id)}>Reject</button>
              <button className="approve-btn" onClick={() => handleApprove(pet.id)}>Approve</button>
            </div>
          ))
        ) : (
          <p>No adoption requests available.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
