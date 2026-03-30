import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const paymentMethods = ["Cash on Delivery (COD)", "Bkash", "Rocket", "Nagad"];

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "",
  });

  const product = location.state?.product;

  if (!product) {
    navigate("/pet_store");
    return null;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleDeleteItem = () => {
    alert("Delete functionality not implemented yet.");
  };

  const handleOrderConfirmation = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address) {
      console.log(customerInfo.payment);
      alert("Please fill in all required fields.");
      return;
    }

    const orderDetails = {
      //productId: product._id,
      productName: product.name,
      price: product.price,
      quantity: quantity,

      name: customerInfo.name, // Rename to match backend schema
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      payment: customerInfo.payment,
    };

    console.log("Sending Order Data:", orderDetails); // Debugging log

    try {
      const response = await axios.post(
        "http://localhost:3000/customer",
        orderDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        alert("Order confirmed! Thank you for your purchase.");
        navigate("/pet_store");
      }
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      alert("Failed to place order. Please try again.");
    }
  };

  return (
    <Container
      style={{
        marginBottom: "10px",
        fontFamily: "'Poppins', sans-serif",
        marginTop: "100px",
      }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Box display="flex" justifyContent="center" marginBottom="30px">
            <Avatar
              src="/Cart.webp"
              alt="Cart Image"
              style={{
                width: "150px",
                height: "150px",
                border: "4px solid rgba(63, 136, 238, 0.8)",
                boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
              }}
            />
          </Box>

          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Your Cart
              </Typography>
              <Typography variant="h5" fontWeight="bold" gutterBottom>
                {product.name}
              </Typography>
              <Typography
                variant="body2"
                color="textSecondary"
                gutterBottom
                style={{ marginBottom: "10px" }}
              >
                {product.description}
              </Typography>
              <Typography
                variant="h6"
                color="primary"
                style={{ marginBottom: "20px" }}
              >
                Price: {product.price}
              </Typography>
              <Box display="flex" alignItems="center" marginBottom="10px">
                <Typography variant="body1" style={{ marginRight: "10px" }}>
                  Quantity:
                </Typography>
                <TextField
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  inputProps={{ min: 1 }}
                  size="small"
                  style={{ width: "80px" }}
                />
              </Box>
              <Box
                display="flex"
                justifyContent="space-between"
                marginTop="20px"
              >
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={handleDeleteItem}
                >
                  Delete Item
                </Button>
                <Button
                  variant="contained"
                  style={{
                    backgroundColor: "rgb(63, 136, 238)",
                    color: "white",
                  }}
                  onClick={() => navigate("/pet_store")}
                >
                  Add More Items
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            style={{
              borderRadius: "10px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Customer Details
              </Typography>
              <TextField
                label="Name"
                fullWidth
                margin="normal"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                style={{ marginBottom: "15px" }}
              />
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                style={{ marginBottom: "15px" }}
              />
              <TextField
                label="Email"
                fullWidth
                margin="normal"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                style={{ marginBottom: "15px" }}
              />
              <TextField
                label="Address"
                fullWidth
                margin="normal"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                style={{ marginBottom: "15px" }}
              />
              <TextField
                select
                label="Payment Method"
                fullWidth
                margin="normal"
                name="paymentMethod"
                value={customerInfo.paymentMethod}
                onChange={handleInputChange}
                style={{ marginBottom: "15px" }}
              >
                {paymentMethods.map((method, index) => (
                  <MenuItem key={index} value={method}>
                    {method}
                  </MenuItem>
                ))}
              </TextField>
              <Button
                variant="contained"
                fullWidth
                style={{
                  marginTop: "20px",
                  backgroundColor: "rgb(63, 136, 238)",
                  color: "white",
                  fontWeight: "bold",
                }}
                onClick={handleOrderConfirmation}
              >
                Confirm Order
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <footer className="text-center text-muted mt-5 pb-4">
        © 2025 Petzy - Your Path to Pet Adoption
      </footer>
    </Container>
  );
};

export default Cart;
