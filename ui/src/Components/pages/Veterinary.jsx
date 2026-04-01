import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  CircularProgress,
} from "@mui/material";
import { CalendarMonth, AccessTime, Person, Email, Phone } from "@mui/icons-material";
import "./Veterinary.css";

const API_BASE = "http://localhost:3000";

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

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "02:00 PM", "02:30 PM", "03:00 PM", "03:30 PM",
  "04:00 PM", "04:30 PM", "05:00 PM"
];

const Veterinary = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    notes: "",
  });
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(`${API_BASE}/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Failed to fetch doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();

    // Load user info from token
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded) {
        setUserInfo({
          name: decoded.name || "",
          email: decoded.email || "",
          phone: decoded.phone || "",
        });
      }
    }
  }, []);

  const handleBookAppointment = (doctor) => {
    // Check if user is logged in BEFORE opening the booking dialog
    const isLoggedIn = localStorage.getItem("token") || localStorage.getItem("user");
    if (!isLoggedIn) {
      alert("Please login first");
      window.location.href = "/login";
      return;
    }

    setSelectedDoctor(doctor);
    setBookingOpen(true);
    setBookingSuccess(false);
    setError("");
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async () => {
    if (!bookingData.date || !bookingData.time) {
      setError("Please select both date and time");
      return;
    }

    try {
      // DEBUG: Log what we're about to send
      console.log("=== VETERINARY BOOKING DEBUG ===");
      console.log("selectedDoctor object:", selectedDoctor);
      console.log("selectedDoctor._id:", selectedDoctor?._id, "- Type:", typeof selectedDoctor?._id);
      console.log("selectedDoctor.id:", selectedDoctor?.id, "- Type:", typeof selectedDoctor?.id);
      
      const appointmentData = {
        doctorId: selectedDoctor._id,
        doctorName: selectedDoctor.name,
        date: bookingData.date,
        time: bookingData.time,
        notes: bookingData.notes,
        customerName: userInfo.name,
        customerEmail: userInfo.email,
        customerPhone: userInfo.phone,
      };
      
      console.log("Final appointmentData:", JSON.stringify(appointmentData, null, 2));

      const response = await axios.post(
        `${API_BASE}/api/appointments`,
        appointmentData
      );

      if (response.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setBookingOpen(false);
          setBookingData({ date: "", time: "", notes: "" });
        }, 2000);
      }
    } catch (err) {
      console.error("Error booking appointment:", err);
      setError("Failed to book appointment. Please try again.");
    }
  };

  const handleCloseBooking = () => {
    setBookingOpen(false);
    setSelectedDoctor(null);
    setBookingData({ date: "", time: "", notes: "" });
    setBookingSuccess(false);
    setError("");
  };

  // Get today's date for min date picker
  const today = new Date().toISOString().split('T')[0];

  return (
    <Box sx={{ width: "100%", pt: 8, px: { xs: 2, md: 4 }, py: 4, minHeight: "100vh", bgcolor: "#f5f5f5" }}>
      {/* Header */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: "#1976d2", mb: 2 }}>
          Meet Our Veterinarians
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Our experienced veterinary team is here to ensure the health and happiness of your pets.
        </Typography>
      </Box>

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : doctors.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 8 }}>
          <Typography variant="h5" sx={{ color: "#1976d2" }}>
            🐾 No veterinarians available right now
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Please check back later or contact us for more information.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {doctors.map((doctor, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column", borderRadius: 2, boxShadow: 3 }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={doctor.image || "/default-doctor.png"}
                  alt={doctor.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {doctor.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {doctor.specialization}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <Email sx={{ fontSize: 18, mr: 1, color: "#666" }} />
                    <Typography variant="body2">{doctor.email}</Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Phone sx={{ fontSize: 18, mr: 1, color: "#666" }} />
                    <Typography variant="body2">{doctor.phone}</Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    startIcon={<CalendarMonth />}
                    onClick={() => handleBookAppointment(doctor)}
                    sx={{
                      bgcolor: "#1976d2",
                      "&:hover": { bgcolor: "#1565c0" },
                    }}
                  >
                    Book Appointment
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Booking Dialog */}
      <Dialog open={bookingOpen} onClose={handleCloseBooking} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: "#1976d2", color: "white" }}>
          Book Appointment with {selectedDoctor?.name}
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          {bookingSuccess ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              Appointment booked successfully! We'll contact you shortly.
            </Alert>
          ) : (
            <>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Select your preferred date and time for the appointment.
              </Typography>

              <TextField
                fullWidth
                label="Date"
                type="date"
                name="date"
                value={bookingData.date}
                onChange={handleBookingChange}
                inputProps={{ min: today }}
                sx={{ mb: 2 }}
                InputLabelProps={{ shrink: true }}
              />

              <TextField
                fullWidth
                select
                label="Time"
                name="time"
                value={bookingData.time}
                onChange={handleBookingChange}
                sx={{ mb: 2 }}
              >
                {timeSlots.map((slot) => (
                  <MenuItem key={slot} value={slot}>
                    {slot}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                fullWidth
                label="Notes (optional)"
                name="notes"
                value={bookingData.notes}
                onChange={handleBookingChange}
                multiline
                rows={3}
                placeholder="Describe your pet's condition or reason for visit"
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}
            </>
          )}
        </DialogContent>
        {!bookingSuccess && (
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={handleCloseBooking} color="inherit">
              Cancel
            </Button>
            <Button
              onClick={handleBookingSubmit}
              variant="contained"
              sx={{ bgcolor: "#1976d2", "&:hover": { bgcolor: "#1565c0" } }}
            >
              Confirm Booking
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </Box>
  );
};

export default Veterinary;
