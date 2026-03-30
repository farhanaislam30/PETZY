import React, { useState } from "react";
import axios from "axios";
import "./Veterinary.css"; // reuse same CSS for colors & spacing

const AddDoctor = () => {
  const [doctor, setDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
    phone: "",
    image: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    setDoctor({ ...doctor, [e.target.name]: e.target.value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Simple validation
    if (!doctor.name || !doctor.specialization || !doctor.email || !doctor.phone) {
      setMessage("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      // Replace with your API endpoint
      const response = await axios.post("http://localhost:3000/doctors", doctor);

      if (response.status === 201 || response.status === 200) {
        setMessage("Doctor added successfully ✅");
        setDoctor({
          name: "",
          specialization: "",
          email: "",
          phone: "",
          image: "",
        });
      } else {
        setMessage("Something went wrong. Try again.");
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to add doctor. Check your API.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container container-vet">
      <div className="vet-header">
        <h1>Add New Veterinarian</h1>
        <p>Fill in the details to add a new veterinarian to the list.</p>
      </div>

      <form className="row g-3" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label className="form-label">Name*</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={doctor.name}
            onChange={handleChange}
            placeholder="Dr. John Doe"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Specialization*</label>
          <input
            type="text"
            className="form-control"
            name="specialization"
            value={doctor.specialization}
            onChange={handleChange}
            placeholder="Small Animals, Cats, Dogs..."
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Email*</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={doctor.email}
            onChange={handleChange}
            placeholder="email@example.com"
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Phone*</label>
          <input
            type="tel"
            className="form-control"
            name="phone"
            value={doctor.phone}
            onChange={handleChange}
            placeholder="+8801XXXXXXXXX"
          />
        </div>

        <div className="col-md-12">
          <label className="form-label">Image URL</label>
          <input
            type="text"
            className="form-control"
            name="image"
            value={doctor.image}
            onChange={handleChange}
            placeholder="https://example.com/image.png"
          />
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{
              background: "linear-gradient(135deg,#f6d365,#fda085)",
              border: "none",
            }}
          >
            {loading ? "Adding..." : "Add Doctor"}
          </button>
        </div>

        {message && (
          <div className="col-12 mt-3">
            <p className="fw-bold" style={{ color: "rgb(63, 136, 238)" }}>
              {message}
            </p>
          </div>
        )}
      </form>
    </div>
  );
};

export default AddDoctor;