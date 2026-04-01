import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Formik, Form, Field } from "formik";
import {
  Box,
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  MenuItem,
  InputAdornment,
  Alert,
  Snackbar,
} from "@mui/material";
import {
  Pets,
  Email,
  Phone,
  LocationOn,
  Upload,
  Send,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";

const Services = () => {
  const navigate = useNavigate();
  const [successMsg, setSuccessMsg] = React.useState("");

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
      setSuccessMsg("Pet submitted for adoption successfully! We will contact you soon.");
      resetForm();
    } catch (error) {
      console.error("Error submitting pet:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setSuccessMsg("");
  };

  // Pet types for select
  const petTypes = ["Dog", "Cat", "Bird", "Rabbit", "Fish", "Hamster", "Other"];

  return (
    <Container maxWidth="lg" sx={{ py: 5, mt: 4 }}>
      <Grid container spacing={4}>
        {/* Left Side - Adopt a Pet */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              borderRadius: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <Pets sx={{ fontSize: 60, color: "#1976d2", mb: 2 }} />
              <Typography variant="h4" fontWeight="bold" color="primary">
                Adopt a Pet
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 2,
                mb: 3,
              }}
            >
              <img
                src="Adoptpet1.png"
                alt="Adopt a Pet"
                className="img-fluid"
                style={{ width: 150, borderRadius: 12 }}
              />
              <img
                src="Adoptpet2.png"
                alt="Adopt a Pet"
                className="img-fluid"
                style={{ width: 150, borderRadius: 12 }}
              />
            </Box>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 3, textAlign: "center" }}
            >
              Welcome to our pet adoption program! Adopting a pet brings joy and
              companionship into your life. Find your perfect furry friend today.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={handleFindPetClick}
              startIcon={<Pets />}
              sx={{
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: "bold",
              }}
            >
              Find Your Perfect Pet
            </Button>
          </Paper>
        </Grid>

        {/* Right Side - Post a Pet for Adoption */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Box sx={{ textAlign: "center", mb: 3 }}>
              <CloudUpload sx={{ fontSize: 50, color: "#1976d2", mb: 1 }} />
              <Typography variant="h5" fontWeight="bold" color="primary">
                Post a Pet for Adoption
              </Typography>
            </Box>

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
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    sx={{ mb: 2, mt: 1 }}
                  >
                    Pet Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pet Name"
                        name="name"
                        variant="outlined"
                        placeholder="Enter pet's name"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Pets fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Pet Age"
                        name="age"
                        variant="outlined"
                        placeholder="e.g., 2 years"
                      />
                    </Grid>
                  </Grid>

                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Location"
                        name="location"
                        variant="outlined"
                        placeholder="Enter location"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LocationOn fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        select
                        label="Pet Type"
                        name="type"
                        defaultValue="Dog"
                        variant="outlined"
                      >
                        {petTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Reason for Giving a Pet"
                    name="reason"
                    variant="outlined"
                    multiline
                    rows={3}
                    placeholder="Explain why you are giving this pet for adoption"
                    sx={{ mt: 2 }}
                  />

                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="primary"
                    sx={{ mb: 2, mt: 3 }}
                  >
                    Contact Information
                  </Typography>

                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        variant="outlined"
                        placeholder="Enter your email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        variant="outlined"
                        placeholder="Enter your phone"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <Phone fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                  </Grid>

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Upload Pet Image:
                    </Typography>
                    <Button
                      variant="outlined"
                      component="label"
                      startIcon={<Upload />}
                      fullWidth
                      sx={{
                        py: 2,
                        borderStyle: "dashed",
                        borderRadius: 2,
                      }}
                    >
                      Choose Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(event) => {
                          const file = event.currentTarget.files[0];
                          if (file) {
                            handleImageUpload(file, setFieldValue);
                          }
                        }}
                      />
                    </Button>
                    {values.image && (
                      <Box sx={{ mt: 2, textAlign: "center" }}>
                        <img
                          src={values.image}
                          alt="Uploaded Preview"
                          style={{
                            width: 150,
                            height: 150,
                            objectFit: "cover",
                            borderRadius: 12,
                            border: "2px solid #1976d2",
                          }}
                        />
                      </Box>
                    )}
                  </Box>

                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      disabled={isSubmitting}
                      startIcon={<Send />}
                      sx={{
                        borderRadius: 3,
                        px: 5,
                        py: 1.5,
                        fontWeight: "bold",
                      }}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Your Pet"}
                    </Button>
                  </Box>
                  <Snackbar
                    open={!!successMsg}
                    autoHideDuration={6000}
                    onClose={handleCloseSuccess}
                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                  >
                    <Alert
                      onClose={handleCloseSuccess}
                      severity="success"
                      sx={{ width: "100%" }}
                      icon={<CheckCircle fontSize="inherit" />}
                    >
                      {successMsg}
                    </Alert>
                  </Snackbar>
                </Form>
              )}
            </Formik>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Services;
