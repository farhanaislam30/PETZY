import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
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
  CardMedia,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
} from "@mui/material";
import { Delete, Edit, Add, Inventory, Close } from "@mui/icons-material";

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

const ManageProducts = () => {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Dialog states
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState("add"); // "add" or "edit"
  const [currentItem, setCurrentItem] = useState(null);
  
  // Form state
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    price: "",
    image: "",
    description: "",
    stock: "",
  });

  // Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products");
    }
    setLoading(false);
  };

  const handleAddProduct = () => {
    setDialogMode("add");
    setProductForm({
      name: "",
      category: "",
      price: "",
      image: "",
      description: "",
      stock: "",
    });
    setOpenDialog(true);
  };

  const handleEditProduct = (product) => {
    setDialogMode("edit");
    setCurrentItem(product);
    setProductForm({
      name: product.name || "",
      category: product.category || "",
      price: product.price || "",
      image: product.image || "",
      description: product.description || "",
      stock: product.stock || "",
    });
    setOpenDialog(true);
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_BASE}/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((p) => p._id !== id));
      setSuccess("Product deleted successfully");
    } catch (err) {
      setError("Failed to delete product");
    }
  };

  const handleSaveProduct = async () => {
    try {
      const token = localStorage.getItem("token");
      const productData = {
        ...productForm,
        price: parseFloat(productForm.price),
        stock: parseInt(productForm.stock),
      };
      
      if (dialogMode === "add") {
        await axios.post(`${API_BASE}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Product added successfully");
      } else {
        await axios.put(`${API_BASE}/api/products/${currentItem._id}`, productData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSuccess("Product updated successfully");
      }
      setOpenDialog(false);
      fetchProducts();
    } catch (err) {
      setError("Failed to save product");
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
            <Inventory sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              Manage Products
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Manage pet products in your store inventory
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Action Bar */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
          Products ({products.length})
        </Typography>
        <Button 
          variant="contained" 
          startIcon={<Add />} 
          onClick={handleAddProduct}
          sx={{ 
            bgcolor: theme.primary,
            "&:hover": { bgcolor: "#1565c0" },
            px: 3,
            borderRadius: 2,
          }}
        >
          Add New Product
        </Button>
      </Paper>

      {/* Content */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress sx={{ color: theme.primary }} />
        </Box>
      ) : products.length > 0 ? (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product._id}>
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
                <Box sx={{ position: "relative" }}>
                  <CardMedia
                    component="img"
                    height="180"
                    image={product.image || "/logo.png"}
                    alt={product.name}
                    sx={{ objectFit: "cover" }}
                  />
                  <Box sx={{ 
                    position: "absolute", 
                    top: 8, 
                    right: 8,
                    bgcolor: product.stock > 0 ? "success.main" : "error.main",
                    color: "white",
                    px: 1.5,
                    py: 0.5,
                    borderRadius: 1,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                  }}>
                    {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
                  </Box>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      bgcolor: "#e3f2fd", 
                      color: theme.primary,
                      px: 1,
                      py: 0.25,
                      borderRadius: 1,
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      textTransform: "uppercase",
                    }}
                  >
                    {product.category}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text, mt: 1, mb: 0.5 }}>
                    {product.name}
                  </Typography>
                  
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 700, 
                        color: theme.secondary,
                      }}
                    >
                      ${product.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Stock: {product.stock}
                    </Typography>
                  </Box>
                  
                  {product.description && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                      {product.description}
                    </Typography>
                  )}
                  
                  <Divider sx={{ my: 1.5 }} />
                  
                  <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
                    <Button 
                      size="small" 
                      startIcon={<Edit />}
                      onClick={() => handleEditProduct(product)}
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
                      onClick={() => handleDeleteProduct(product._id)}
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
          <Inventory sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            No products found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Start by adding your first product to the store
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={handleAddProduct}
          >
            Add First Product
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
            {dialogMode === "add" ? "Add New Product" : "Edit Product"}
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
                label="Product Name"
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={productForm.category}
                  label="Category"
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  <MenuItem value="Food">Food</MenuItem>
                  <MenuItem value="Toys">Toys</MenuItem>
                  <MenuItem value="Accessories">Accessories</MenuItem>
                  <MenuItem value="Health">Health</MenuItem>
                  <MenuItem value="Grooming">Grooming</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Price"
                type="number"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Stock"
                type="number"
                value={productForm.stock}
                onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Image URL"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                placeholder="https://example.com/product-image.jpg"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                multiline
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
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
            onClick={handleSaveProduct} 
            variant="contained"
            sx={{ 
              bgcolor: theme.primary,
              "&:hover": { bgcolor: "#1565c0" },
              px: 3,
            }}
          >
            {dialogMode === "add" ? "Add Product" : "Save Changes"}
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

export default ManageProducts;