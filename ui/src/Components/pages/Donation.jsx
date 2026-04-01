import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
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
  Favorite,
  Email,
  Person,
  AttachMoney,
  Message,
  CreditCard,
  CheckCircle,
} from "@mui/icons-material";

const API_BASE = "http://localhost:3000";

const Donation = () => {
  const [formData, setFormData] = useState({
    donorName: "",
    donorEmail: "",
    amount: "",
    message: "",
    paymentMethod: "Credit Card",
  });
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const response = await axios.post(`${API_BASE}/donations`, formData, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.data.success) {
        setSuccessMsg(
          "Thank you for your generous donation! Your support helps us care for pets in need."
        );
        // Notify other components (admin panel) about the new donation
        window.dispatchEvent(new Event('donation-made'));
        setFormData({
          donorName: "",
          donorEmail: "",
          amount: "",
          message: "",
          paymentMethod: "Credit Card",
        });
      }
    } catch (error) {
      console.error("Donation error:", error);
      setErrorMsg("Failed to process donation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const donationAmounts = [100, 250, 500, 1000, 2000, 5000];
  const paymentMethods = ["Credit Card", "Debit Card", "bKash", "Nagad", "Bank Transfer"];

  return (
    <Container maxWidth="md" sx={{ py: 5, mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Favorite sx={{ fontSize: 60, color: "#e91e63", mb: 2 }} />
          <Typography variant="h4" fontWeight="bold" color="primary">
            Support Our Pet Shelter
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Your generous donation helps us provide food, medicine, and care for pets in
            need. Every contribution makes a difference!
          </Typography>
        </Box>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Your Name"
                name="donorName"
                value={formData.donorName}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="donorEmail"
                type="email"
                value={formData.donorEmail}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Typography
            variant="subtitle1"
            fontWeight="bold"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Select Donation Amount
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {donationAmounts.map((amount) => (
              <Grid item xs={4} sm={2} key={amount}>
                <Button
                  variant={
                    formData.amount === amount.toString() ? "contained" : "outlined"
                  }
                  fullWidth
                  onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                  sx={{ py: 2, fontWeight: "bold" }}
                >
                  ৳{amount}
                </Button>
              </Grid>
            ))}
            <Grid item xs={4} sm={2}>
              <TextField
                fullWidth
                label="Custom"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                variant="outlined"
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoney fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Payment Method"
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CreditCard fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              >
                {paymentMethods.map((method) => (
                  <MenuItem key={method} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Message (Optional)"
                name="message"
                value={formData.message}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={1}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Message fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>

          {errorMsg && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {errorMsg}
            </Alert>
          )}

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !formData.amount}
              startIcon={<Favorite />}
              sx={{
                borderRadius: 3,
                px: 5,
                py: 1.5,
                fontWeight: "bold",
                fontSize: "1.1rem",
              }}
            >
              {isSubmitting ? "Processing..." : "Donate Now"}
            </Button>
          </Box>
        </form>

        <Snackbar
          open={!!successMsg}
          autoHideDuration={6000}
          onClose={() => setSuccessMsg("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="success" sx={{ width: "100%" }}>
            {successMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default Donation;
