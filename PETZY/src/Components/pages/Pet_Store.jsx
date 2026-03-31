import React, { useState, useEffect } from "react";
import { Container, Grid, Card, CardMedia, CardContent, Typography, Button, Box, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Pet_Store = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch products from backend API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = (product) => {
    navigate("/cart", { state: { product } });
  };

  if (loading) {
    return (
      <Container
        style={{
          padding: "20px",
          marginTop: "120px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading products...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container
        style={{
          padding: "20px",
          marginTop: "120px",
          marginBottom: "10px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container
      style={{
        padding: "20px",
        fontFamily: "'Poppins', sans-serif",
        marginTop: "70px",
        marginBottom: "10px",
      }}
    >
      <Typography
        variant="h4"
        style={{
          color: "cornflowerblue",
          fontWeight: "bold",
          textAlign: "center",
          marginBottom: "5px",
        }}
      >
        Welcome to Our Pet Store!🐾
      </Typography>
      <Typography
        variant="body1"
        style={{ textAlign: "center", color: "gray", marginBottom: "50px" }}
      >
        Because your pet deserves the best!
      </Typography>

      {products.length === 0 ? (
        <Box textAlign="center" py={5}>
          <Typography variant="h6" color="textSecondary">
            No products available at the moment.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}>
              <Card style={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image || "/placeholder-product.jpg"}
                  alt={product.name}
                  style={{ objectFit: "cover" }}
                  onError={(e) => {
                    e.target.src = "/logo.png";
                  }}
                />
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight="bold">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.description}
                  </Typography>
                  <Typography variant="h6" color="primary">
                    ৳{product.price}
                  </Typography>
                </CardContent>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    backgroundColor: "rgb(89, 143, 219)",
                    "&:hover": {
                      backgroundColor: "rgb(63, 136, 238)",
                    },
                  }}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <footer className="text-center text-muted mt-5 pb-4">
        © 2025 Petzy - Your Path to Pet Adoption
      </footer>
    </Container>
  );
};

export default Pet_Store;
