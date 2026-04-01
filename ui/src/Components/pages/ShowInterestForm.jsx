import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  InputAdornment,
  MenuItem,
  Alert,
  CircularProgress,
  IconButton,
} from "@mui/material";
import {
  Close,
  Email,
  Phone,
  Home,
  Pets,
  Favorite,
  Send,
} from "@mui/icons-material";

const ShowInterestForm = ({ pet, onClose, onInterestSubmitted }) => {
  // Helper function to decode JWT token
  const decodeJWT = (token) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error("Error decoding JWT:", error);
      return null;
    }
  };

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    livingSituation: "",
    experience: "",
    otherPets: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Auto-fill email and phone from JWT token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setFormData((prev) => ({
          ...prev,
          email: decoded.email || "",
          phone: decoded.phone || "",
        }));
      }
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[\d\s\-+()]{10,}$/;

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.livingSituation) {
      newErrors.livingSituation = "Living situation is required";
    }

    if (!formData.experience) {
      newErrors.experience = "Pet experience is required";
    }

    if (!formData.otherPets) {
      newErrors.otherPets = "Please specify if you have other pets";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Log what we're about to send
    console.log("=== SHOW INTEREST FORM DEBUG ===");
    console.log("Pet object:", pet);
    console.log("Pet ID:", pet?.id, "Pet _id:", pet?._id);
    
    // Handle both id and _id from different data sources
    const petId = pet?._id || pet?.id;
    console.log("Selected petId:", petId);
    
    console.log("Form data:", JSON.stringify(formData, null, 2));
    console.log("Final payload:", JSON.stringify({ ...formData, petId }, null, 2));

    try {
      const response = await fetch("http://localhost:3000/show-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, petId, petName: pet?.name || "" }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus({ type: "success", message: "Application submitted successfully!" });
        setTimeout(() => {
          onInterestSubmitted(pet.id);
          onClose();
        }, 1500);
      } else {
        setSubmitStatus({ type: "error", message: data.message || "Failed to submit application" });
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitStatus({ type: "error", message: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={true}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
        },
      }}
    >
      {/* Header with gradient background */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          p: 3,
          position: "relative",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "white",
            "&:hover": {
              backgroundColor: "rgba(255,255,255,0.1)",
            },
          }}
        >
          <Close />
        </IconButton>
        <Box sx={{ textAlign: "center" }}>
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: "50%",
              backgroundColor: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
            }}
          >
            <Favorite sx={{ fontSize: 30, color: "#FFD700" }} />
          </Box>
          <Typography
            variant="h5"
            sx={{ fontWeight: 700, color: "white" }}
          >
            Pet Adoption Application
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "rgba(255,255,255,0.8)", mt: 1 }}
          >
            {pet?.name ? `For: ${pet.name}` : "Tell us about yourself"}
          </Typography>
        </Box>
      </Box>

      <DialogContent sx={{ p: 4 }}>
        {submitStatus && (
          <Alert
            severity={submitStatus.type}
            sx={{ mb: 3, borderRadius: "10px" }}
            onClose={() => setSubmitStatus(null)}
          >
            {submitStatus.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Typography
            variant="h6"
            sx={{ mb: 3, color: "#1a1a2e", fontWeight: 600 }}
          >
            📝 Your Information
          </Typography>

          <TextField
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={!!errors.phone}
            helperText={errors.phone}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField
            fullWidth
            select
            label="Living Situation"
            name="livingSituation"
            value={formData.livingSituation}
            onChange={handleChange}
            error={!!errors.livingSituation}
            helperText={errors.livingSituation}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Home sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem value="House with garden">🏠 House with garden</MenuItem>
            <MenuItem value="Apartment">🏢 Apartment</MenuItem>
            <MenuItem value="House without garden">🏚️ House without garden</MenuItem>
            <MenuItem value="Other">❓ Other</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Previous Pet Experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            error={!!errors.experience}
            helperText={errors.experience}
            required
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Pets sx={{ color: "#667eea" }} />
                </InputAdornment>
              ),
            }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem value="First time pet owner">🐾 First time pet owner</MenuItem>
            <MenuItem value="1-2 years">📅 1-2 years of experience</MenuItem>
            <MenuItem value="3-5 years">📅 3-5 years of experience</MenuItem>
            <MenuItem value="5+ years">📅 5+ years of experience</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Any Other Pets?"
            name="otherPets"
            value={formData.otherPets}
            onChange={handleChange}
            error={!!errors.otherPets}
            helperText={errors.otherPets}
            required
            sx={{ mb: 3 }}
            InputLabelProps={{
              shrink: true,
            }}
          >
            <MenuItem value="No other pets">🚫 No other pets</MenuItem>
            <MenuItem value="Dogs">🐕 Dogs</MenuItem>
            <MenuItem value="Cats">🐈 Cats</MenuItem>
            <MenuItem value="Birds">🐦 Birds</MenuItem>
            <MenuItem value="Other">❓ Other pets</MenuItem>
          </TextField>

          <DialogActions sx={{ px: 0, pt: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderColor: "#ccc",
                color: "#666",
                borderRadius: "25px",
                px: 4,
                "&:hover": {
                  borderColor: "#999",
                  backgroundColor: "#f5f5f5",
                },
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : <Send />}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                borderRadius: "25px",
                px: 4,
                fontWeight: 600,
                boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
                "&:hover": {
                  background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
                  boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
                },
                "&:disabled": {
                  background: "#ccc",
                  boxShadow: "none",
                },
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ShowInterestForm;
