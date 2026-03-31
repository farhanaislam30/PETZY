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
  Card,
  CardContent,
  CardMedia,
  Grid,
  Divider,
} from "@mui/material";
import { Delete, Edit, Add, Pets, Close } from "@mui/icons-material";

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

const ManagePets = () => {
  const [loading, setLoading] = useState(false);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form state
  const [petForm, setPetForm] = useState({
    name: "",
    type: "",
    age: "",
    image: "",
    location: "",
    description: "",
    price: "",
  });

  // Fetch pets on mount
  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/pets`);
      setPets(response.data);
    } catch (err) {
      console.error("Error fetching pets:", err);
      setError("Failed to fetch pets");
    }
    setLoading(false);
  };

  const handleAddPet = () => {
    setDialogMode("add");
    setPetForm({
      name: "",
      type: "",
      age: "",
      image: "",
      location: "",
      description: "",
      price: "",
    });
    setOpenDialog(true);
  };

  const handleEditPet = (pet) => {
    setDialogMode("edit");
    setCurrentItem(pet);
    setPetForm({
      name: pet.name || "",
      type: pet.type || "",
      age: pet.age || "",
      image: pet.image || "",
      address: pet.address || "",
      description: pet.description || "",
      price: pet.price || "",
    });
    setOpenDialog(true);
  };

  const handleDeletePet = async (id) => {
    if (!window.confirm("Are you sure you want to delete this pet?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPets(pets.filter((p) => p._id !== id));
      setSuccess("Pet deleted successfully");
    } catch (err) {
      setError("Failed to delete pet");
    }
  };

  const handleSavePet = async () => {
    try {
      const token = localStorage.getItem("token");
      if (dialogMode === "add") {
        await axios.post(`${API_BASE}/api/pets`, petForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Pet added successfully");
      } else {
        await axios.put(`${API_BASE}/api/pets/${currentItem._id}`, petForm, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Pet updated successfully");
      }
      setOpenDialog(false);
      fetchPets();
    } catch (err) {
      setError("Failed to save pet");
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
            <Pets sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Manage Pets
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Add, edit, or remove pets available for adoption
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
          Pets ({pets.length})
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAddPet}
          sx={{ 
            bgcolor: theme.primary,
            "&:hover": { bgcolor: "#1565c0" },
            px: 3,
            borderRadius: 2,
          }}
        >
          Add New Pet
        </Button>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : pets.length > 0 ? (
        <Grid container spacing={3}>
          {pets.map((pet) => (
            <Grid item xs={12} sm={6} md={4} key={pet._id}>
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
                <CardMedia
                  component="img"
                  height="180"
                  image={pet.image || "/logo.png"}
                  alt={pet.name}
                  sx={{ objectFit: "cover" }}
                />
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text, flex: 1 }}>
                      {pet.name}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: theme.secondary,
                        whiteSpace: "nowrap"
                      }}
                    >
                      ৳{pet.price}
                    </Typography>
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {pet.type} • {pet.age} years old
                  </Typography>
                  
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    📍 {pet.address}
                  </Typography>
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      onClick={() => handleEditPet(pet)}
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
                      onClick={() => handleDeletePet(pet._id)}
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
          <Pets sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No pets found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by adding your first pet for adoption
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleAddPet}
          >
            Add First Pet
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
            {dialogMode === "add" ? "Add New Pet" : "Edit Pet"}
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
                label="Pet Name"
                value={petForm.name}
                onChange={(e) => setPetForm({ ...petForm, name: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Type (Dog, Cat, etc.)"
                value={petForm.type}
                onChange={(e) => setPetForm({ ...petForm, type: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                value={petForm.age}
                onChange={(e) => setPetForm({ ...petForm, age: e.target.value })}
                placeholder="e.g., 2 years"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={petForm.price}
                onChange={(e) => setPetForm({ ...petForm, price: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Location"
                value={petForm.location}
                onChange={(e) => setPetForm({ ...petForm, location: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={petForm.image}
                onChange={(e) => setPetForm({ ...petForm, image: e.target.value })}
                placeholder="https://example.com/pet-image.jpg"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={petForm.description}
                onChange={(e) => setPetForm({ ...petForm, description: e.target.value })}
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
            onClick={handleSavePet} 
            variant="contained"
            sx={{ 
              bgcolor: theme.primary,
              "&:hover": { bgcolor: "#1565c0" },
              px: 3,
            }}
          >
            {dialogMode === "add" ? "Add Pet" : "Save Changes"}
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

export default ManagePets;