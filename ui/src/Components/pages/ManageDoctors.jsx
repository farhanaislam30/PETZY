import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Divider,
  Avatar,
} from "@mui/material";
import { Delete, Edit, Add, MedicalServices, Close, Email, Phone, Work } from "@mui/icons-material";

const API_BASE = "http://localhost:3000";

// PETZY brand colors
const theme = {
  primary: "#1976d2",
  secondary: "#ed6c02",
  background: "#f5f5f5",
  white: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#666666",
};

const ManageDoctors = () => {
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form state
  const [doctorForm, setDoctorForm] = useState({
    name: "",
    email: "",
    specialization: "",
    experience: "",
    image: "",
    phone: "",
  });

  // Fetch doctors on mount
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/doctors`);
      setDoctors(response.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      setError("Failed to fetch doctors");
    }
    setLoading(false);
  };

  const handleAddDoctor = () => {
    setDialogMode("add");
    setDoctorForm({
      name: "",
      email: "",
      specialization: "",
      experience: "",
      image: "",
      phone: "",
    });
    setOpenDialog(true);
  };

  const handleEditDoctor = (doctor) => {
    setDialogMode("edit");
    setCurrentItem(doctor);
    setDoctorForm({
      name: doctor.name || "",
      email: doctor.email || "",
      specialization: doctor.specialization || "",
      experience: doctor.experience || "",
      image: doctor.image || "",
      phone: doctor.phone || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteDoctor = async (email) => {
    if (!window.confirm("Are you sure you want to delete this doctor?")) return;
    try {
      await axios.delete(`${API_BASE}/doctors/${email}`);
      setDoctors(doctors.filter((d) => d.email !== email));
      setSuccess("Doctor deleted successfully");
    } catch (err) {
      setError("Failed to delete doctor");
    }
  };

  const handleSaveDoctor = async () => {
    try {
      const doctorData = {
        ...doctorForm,
        experience: parseInt(doctorForm.experience),
      };
      
      if (dialogMode === "add") {
        await axios.post(`${API_BASE}/doctors`, doctorData);
        setSuccess("Doctor added successfully");
      } else {
        await axios.put(`${API_BASE}/doctors/${currentItem.email}`, doctorData);
        setSuccess("Doctor updated successfully");
      }
      setOpenDialog(false);
      fetchDoctors();
    } catch (err) {
      setError("Failed to save doctor");
    }
  };

  return (
    <Box sx={{ width: "100%", mt: 8, px: { xs: 1, md: 3 }, py: 3, minHeight: "100vh", bgcolor: theme.background }}>
      {/* Page Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 3, 
          borderRadius: 2,
          background: `linear-gradient(135deg, ${theme.primary} 0%, #1565c0 100%)`,
          color: theme.white,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ 
            p: 1.5, 
            borderRadius: 2, 
            bgcolor: "rgba(255,255,255,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <MedicalServices sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Manage Doctors
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage veterinary doctors and specialists
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
          Doctors ({doctors.length})
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAddDoctor}
          sx={{ 
            bgcolor: theme.primary,
            "&:hover": { bgcolor: "#1565c0" },
            px: 3,
            borderRadius: 2,
          }}
        >
          Add New Doctor
        </Button>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : doctors.length > 0 ? (
        <Grid container spacing={3}>
          {doctors.map((doctor) => (
            <Grid item xs={12} sm={6} md={4} key={doctor.email}>
              <Card 
                sx={{ 
                  height: "100%", 
                  borderRadius: 2,
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": { 
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                  },
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                    <Avatar 
                      src={doctor.image || "/logo.png"}
                      alt={doctor.name}
                      sx={{ 
                        width: 72, 
                        height: 72, 
                        border: `2px solid ${theme.primary}`,
                        bgcolor: "#e3f2fd"
                      }}
                    >
                      {doctor.name?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
                        {doctor.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {doctor.specialization}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Email sx={{ fontSize: 18, color: theme.textSecondary }} />
                      <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        {doctor.email}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Work sx={{ fontSize: 18, color: theme.textSecondary }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.experience} years experience
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Phone sx={{ fontSize: 18, color: theme.textSecondary }} />
                      <Typography variant="body2" color="text.secondary">
                        {doctor.phone}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      onClick={() => handleEditDoctor(doctor)}
                      sx={{ 
                        color: theme.primary,
                        "&:hover": { bgcolor: "rgba(25, 118, 210, 0.08)" }
                      }}
                    >
                      Edit
                    </Button>
                    <Button 
                      size="small" 
                      startIcon={<Delete />}
                      onClick={() => handleDeleteDoctor(doctor.email)}
                      sx={{ 
                        color: "#d32f2f",
                        "&:hover": { bgcolor: "rgba(211, 47, 47, 0.08)" }
                      }}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Paper sx={{ p: 6, borderRadius: 2, textAlign: "center" }}>
          <MedicalServices sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No doctors found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by adding your first doctor
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleAddDoctor}
          >
            Add First Doctor
          </Button>
        </Paper>
      )}

      {/* Dialog for Add/Edit */}
      <Dialog 
        open={openDialog} 
        onClose={() => setOpenDialog(false)} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: { borderRadius: 2 }
        }}
      >
        <DialogTitle sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          borderBottom: "1px solid #eee",
          pb: 2
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {dialogMode === "add" ? "Add New Doctor" : "Edit Doctor"}
          </Typography>
          <IconButton onClick={() => setOpenDialog(false)} size="small">
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={2.5}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Doctor Name"
                value={doctorForm.name}
                onChange={(e) => setDoctorForm({ ...doctorForm, name: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={doctorForm.email}
                onChange={(e) => setDoctorForm({ ...doctorForm, email: e.target.value })}
                required
                disabled={dialogMode === "edit"}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Specialization"
                value={doctorForm.specialization}
                onChange={(e) => setDoctorForm({ ...doctorForm, specialization: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Experience (years)"
                type="number"
                value={doctorForm.experience}
                onChange={(e) => setDoctorForm({ ...doctorForm, experience: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone"
                value={doctorForm.phone}
                onChange={(e) => setDoctorForm({ ...doctorForm, phone: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Image URL"
                value={doctorForm.image}
                onChange={(e) => setDoctorForm({ ...doctorForm, image: e.target.value })}
                placeholder="https://example.com/doctor-photo.jpg"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5, pt: 0 }}>
          <Button 
            onClick={() => setOpenDialog(false)}
            sx={{ color: theme.textSecondary }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSaveDoctor} 
            variant="contained"
            sx={{ 
              bgcolor: theme.primary,
              "&:hover": { bgcolor: "#1565c0" },
              px: 3,
            }}
          >
            {dialogMode === "add" ? "Add Doctor" : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 2 }}>{success}</Alert>
      </Snackbar>
    </Box>
  );
};

export default ManageDoctors;