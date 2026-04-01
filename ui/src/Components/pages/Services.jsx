import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";

const Services = () => {
  const navigate = useNavigate();

  const handleFindPetClick = () => {
    navigate("/pet");
  };

  const handleImageUpload = async (file, setFieldValue) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "main-pre");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/de8ocr3or/image/upload",
        formData
      );
      setFieldValue("image", response.data.secure_url);
    } catch (error) {
      console.error("Image upload failed:", error);
    }
  };

  const handleSubmitPet = async (values, { setSubmitting, resetForm }) => {
    if (!values.image) {
      alert("Please wait for the image to finish uploading before submitting.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/donates",
        values,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      resetForm();
    } catch (error) {
      console.error("Error submitting pet:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-5 mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="p-4 border rounded shadow">
            <h2 className="text-primary fw-bold text-center">Adopt a Pet</h2>
            <div className="d-flex justify-content-center my-3">
              <img
                src="Adoptpet1.png"
                alt="Adopt a Pet"
                className="img-fluid mx-2"
                width="200"
              />
              <img
                src="Adoptpet2.png"
                alt="Adopt a Pet"
                className="img-fluid mx-2"
                width="200"
              />
            </div>
            <p className="text-center">
              Welcome to our pet adoption program! Adopting a pet brings joy and
              companionship into your life.
            </p>
            <div className="text-center">
              <button
                className="btn btn-primary text-white"
                onClick={handleFindPetClick}
              >
                Find Your Perfect Pet
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="p-4 border rounded shadow">
            <h2 className="text-primary fw-bold text-center">
              Post a Pet for Adoption
            </h2>
            <div className="d-flex justify-content-center my-3">
              <img
                src="Postpet1.png"
                alt="Post a Pet"
                className="img-fluid mx-2"
                width="300"
              />
            </div>

            <Formik
              initialValues={{
                name: "",
                age: "",
                location: "",
                type: "Dog",
                reason: "",
                email: "",
                phone: "",
                image: "",
              }}
              onSubmit={handleSubmitPet}
            >
              {({ setFieldValue, isSubmitting, values }) => (
                <Form>
                  <div className="mb-3">
                    <label className="form-label">Pet Name:</label>
                    <Field
                      name="name"
                      type="text"
                      className="form-control"
                      placeholder="Enter pet's name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Pet Age:</label>
                    <Field
                      name="age"
                      type="text"
                      className="form-control"
                      placeholder="Enter pet's age"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Location:</label>
                    <Field
                      name="location"
                      type="text"
                      className="form-control"
                      placeholder="Enter location"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Type:</label>
                    <Field as="select" name="type" className="form-select">
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Fish">Fish</option>
                      <option value="Other">Others</option>
                    </Field>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold text-primary">
                      Reason for Giving a Pet:
                    </label>
                    <Field
                      as="textarea"
                      name="reason"
                      rows="3"
                      className="form-control"
                      placeholder="Explain why you are giving this pet for adoption"
                    />
                  </div>

                  <h5 className="text-primary fw-bold">Contact Information</h5>

                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <Field
                      name="email"
                      type="email"
                      className="form-control"
                      placeholder="Enter your email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Phone Number:</label>
                    <Field
                      name="phone"
                      type="text"
                      className="form-control"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Upload Image:</label>
                    <input
                      name="image"
                      type="file"
                      className="form-control"
                      onChange={(event) => {
                        const file = event.currentTarget.files[0];
                        if (file) {
                          handleImageUpload(file, setFieldValue);
                        }
                      }}
                    />
                    {values.image && (
                      <div className="mt-2">
                        <img
                          src={values.image}
                          alt="Uploaded"
                          className="img-fluid rounded"
                          width="150"
                        />
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Your Pet"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
