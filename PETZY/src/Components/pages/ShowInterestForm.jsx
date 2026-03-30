import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ShowInterestForm = ({ pet, onClose, onInterestSubmitted }) => {
  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    livingSituation: "",
    experience: "",
    otherPets: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting interest for pet:", pet.id);


    try {
      const response = await fetch("http://localhost:3000/show-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, petId: pet.id }),
      });
      console.log("Response Status:", response.status);
      
      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        alert("Your request is pending.");
        onInterestSubmitted(pet.id); // Update UI
        onClose();
      } else {
        alert("Failed to submit interest: " + data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred: " + error.message);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" style={{ color: "rgb(63, 136, 238)" }}>
              Pet Adoption Application
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-2">
                <label className="form-label">Email:</label>
                <input type="email" name="email" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Phone No.:</label>
                <input type="text" name="phone" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Pet Living Situation:</label>
                <input type="text" name="livingSituation" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-2">
                <label className="form-label">Previous Pet Experience:</label>
                <input type="text" name="experience" className="form-control" onChange={handleChange} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Any Other Pets?</label>
                <input type="text" name="otherPets" className="form-control" onChange={handleChange} required />
              </div>
              <button type="submit" className="btn w-100" style={{ backgroundColor: "rgb(63, 136, 238)" }}>
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowInterestForm;
