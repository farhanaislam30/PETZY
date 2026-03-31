import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  MenuItem,
  Box,
  Divider,
  IconButton,
  Chip,
  Alert,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalShipping,
  Payment,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  Storefront,
} from "@mui/icons-material";

const paymentMethods = [
  { value: "Cash on Delivery (COD)", label: "💵 Cash on Delivery (COD)", icon: "💵" },
  { value: "Bkash", label: "📱 Bkash", icon: "📱" },
  { value: "Rocket", label: "🚀 Rocket", icon: "🚀" },
  { value: "Nagad", label: "💳 Nagad", icon: "💳" },
];

const Cart = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [activeStep, setActiveStep] = useState(0);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    paymentMethod: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [orderStatus, setOrderStatus] = useState(null);

  const product = location.state?.product;

  if (!product) {
    navigate("/pet_store");
    return null;
  }

  const totalPrice = product.price * quantity;
  const shippingCost = totalPrice > 500 ? 0 : 50;
  const grandTotal = totalPrice + shippingCost;

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 0) {
      if (!customerInfo.name) newErrors.name = "Name is required";
      if (!customerInfo.phone) newErrors.phone = "Phone is required";
      if (!customerInfo.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = "Invalid email";
      if (!customerInfo.address) newErrors.address = "Address is required";
    } else if (step === 1) {
      if (!customerInfo.paymentMethod) newErrors.paymentMethod = "Payment method is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  const handleDeleteItem = () => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      navigate("/pet_store");
    }
  };

  const handleOrderConfirmation = async () => {
    if (!validateStep(1)) return;

    const orderDetails = {
      productName: product.name,
      price: product.price,
      quantity: quantity,
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      payment: customerInfo.paymentMethod,
      notes: customerInfo.notes,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/customer",
        orderDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        setOrderStatus("success");
        setTimeout(() => {
          navigate("/pet_store");
        }, 3000);
      }
    } catch (error) {
      console.error("Error placing order:", error.response?.data || error);
      setOrderStatus("error");
    }
  };

  const steps = ["Customer Info", "Payment", "Confirm"];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
        fontFamily: "'Poppins', sans-serif",
        pt: 10,
        pb: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 5 }}>
          <Chip
            icon={<ShoppingCart sx={{ color: "#667eea !important" }} />}
            label="Shopping Cart"
            sx={{
              backgroundColor: "white",
              color: "#667eea",
              fontWeight: 700,
              fontSize: "1rem",
              px: 2,
              py: 2.5,
              boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
              mb: 3,
            }}
          />
          <Typography
            variant="h3"
            sx={{ fontWeight: 800, color: "#1a1a2e", mb: 1 }}
          >
            Your Shopping Cart
          </Typography>
          <Typography variant="body1" sx={{ color: "#666" }}>
            Complete your purchase to get your pet supplies delivered
          </Typography>
        </Box>

        {/* Stepper */}
        <Card
          sx={{
            mb: 4,
            borderRadius: "15px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Stepper activeStep={activeStep} alternativeLabel>
              {steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel
                    StepIconProps={{
                      sx: {
                        "&.Mui-active": { color: "#667eea" },
                        "&.Mui-completed": { color: "#4CAF50" },
                      },
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: activeStep === index ? 700 : 400,
                        color: activeStep === index ? "#667eea" : "#666",
                      }}
                    >
                      {label}
                    </Typography>
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </CardContent>
        </Card>

        <Grid container spacing={4}>
          {/* Product Card */}
          <Grid item xs={12} md={8}>
            <Card
              sx={{
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                overflow: "hidden",
                mb: 3,
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600, display: "flex", alignItems: "center", gap: 1 }}
                >
                  <Storefront /> Product Details
                </Typography>
              </Box>
              <CardContent sx={{ p: 4 }}>
                <Grid container spacing={3} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <CardMedia
                      component="img"
                      height="180"
                      image={product.image || "/pet_bed.webp"}
                      alt={product.name}
                      sx={{
                        borderRadius: "15px",
                        objectFit: "cover",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <Typography
                      variant="h4"
                      sx={{ fontWeight: 700, color: "#1a1a2e", mb: 1 }}
                    >
                      {product.name}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{ color: "#666", mb: 2 }}
                    >
                      {product.description}
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                      <Chip
                        label={product.category || "Pet Supply"}
                        sx={{
                          backgroundColor: "#e3f2fd",
                          color: "#1976d2",
                          fontWeight: 600,
                        }}
                      />
                      <Chip
                        label="In Stock"
                        icon={<CheckCircle sx={{ fontSize: 16 }} />}
                        sx={{
                          backgroundColor: "#e8f5e9",
                          color: "#4CAF50",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </Grid>
                </Grid>

                <Divider sx={{ my: 3 }} />

                {/* Quantity Controls */}
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    justifyContent: "space-between",
                    alignItems: { xs: "stretch", sm: "center" },
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ color: "#666", mb: 1 }}>
                      Quantity:
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        backgroundColor: "#f5f5f5",
                        borderRadius: "25px",
                        p: 0.5,
                        width: "fit-content",
                      }}
                    >
                      <IconButton
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                        sx={{
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Remove />
                      </IconButton>
                      <TextField
                        type="number"
                        value={quantity}
                        onChange={(e) =>
                          setQuantity(Math.max(1, parseInt(e.target.value) || 1))
                        }
                        inputProps={{ min: 1, style: { textAlign: "center", width: 40 } }}
                        sx={{
                          "& input": {
                            fontWeight: 700,
                            fontSize: "1.1rem",
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => handleQuantityChange(1)}
                        sx={{
                          backgroundColor: "white",
                          "&:hover": { backgroundColor: "#f0f0f0" },
                          boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                        }}
                      >
                        <Add />
                      </IconButton>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Button
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={handleDeleteItem}
                      sx={{
                        borderRadius: "25px",
                        px: 3,
                        borderColor: "#f44336",
                        color: "#f44336",
                        "&:hover": {
                          borderColor: "#f44336",
                          backgroundColor: "#ffebee",
                        },
                      }}
                    >
                      Remove
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Storefront />}
                      onClick={() => navigate("/pet_store")}
                      sx={{
                        backgroundColor: "#667eea",
                        borderRadius: "25px",
                        px: 3,
                        "&:hover": { backgroundColor: "#5a6fd6" },
                      }}
                    >
                      Add More
                    </Button>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {/* Form Steps */}
            <Card
              sx={{
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
              }}
            >
              {activeStep === 0 && (
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1a1a2e" }}>
                    👤 Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        name="name"
                        value={customerInfo.name}
                        onChange={handleInputChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        name="phone"
                        value={customerInfo.phone}
                        onChange={handleInputChange}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Email Address"
                        name="email"
                        type="email"
                        value={customerInfo.email}
                        onChange={handleInputChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Delivery Address"
                        name="address"
                        value={customerInfo.address}
                        onChange={handleInputChange}
                        error={!!errors.address}
                        helperText={errors.address}
                        multiline
                        rows={2}
                        required
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Additional Notes (Optional)"
                        name="notes"
                        value={customerInfo.notes}
                        onChange={handleInputChange}
                        multiline
                        rows={2}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              )}

              {activeStep === 1 && (
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1a1a2e" }}>
                    💳 Payment Method
                  </Typography>
                  <Grid container spacing={2}>
                    {paymentMethods.map((method) => (
                      <Grid item xs={12} sm={6} key={method.value}>
                        <Card
                          onClick={() =>
                            setCustomerInfo((prev) => ({
                              ...prev,
                              paymentMethod: method.value,
                            }))
                          }
                          sx={{
                            cursor: "pointer",
                            borderRadius: "15px",
                            border:
                              customerInfo.paymentMethod === method.value
                                ? "2px solid #667eea"
                                : "2px solid #e0e0e0",
                            backgroundColor:
                              customerInfo.paymentMethod === method.value
                                ? "#f5f3ff"
                                : "white",
                            transition: "all 0.3s ease",
                            "&:hover": {
                              borderColor: "#667eea",
                              transform: "translateY(-2px)",
                            },
                          }}
                        >
                          <CardContent sx={{ p: 2, textAlign: "center" }}>
                            <Typography variant="h4" sx={{ mb: 1 }}>
                              {method.icon}
                            </Typography>
                            <Typography
                              variant="body1"
                              sx={{
                                fontWeight:
                                  customerInfo.paymentMethod === method.value
                                    ? 700
                                    : 500,
                                color: "#1a1a2e",
                              }}
                            >
                              {method.value}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                  {errors.paymentMethod && (
                    <Alert severity="error" sx={{ mt: 2, borderRadius: "10px" }}>
                      {errors.paymentMethod}
                    </Alert>
                  )}
                </CardContent>
              )}

              {activeStep === 2 && (
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, color: "#1a1a2e" }}>
                    ✅ Order Confirmation
                  </Typography>
                  {orderStatus === "success" && (
                    <Alert
                      severity="success"
                      sx={{ mb: 3, borderRadius: "10px" }}
                    >
                      Order placed successfully! Redirecting to store...
                    </Alert>
                  )}
                  {orderStatus === "error" && (
                    <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                      Failed to place order. Please try again.
                    </Alert>
                  )}
                  <Box sx={{ backgroundColor: "#f8f9fa", p: 3, borderRadius: "15px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Name:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {customerInfo.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Phone:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {customerInfo.phone}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Email:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {customerInfo.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Address:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {customerInfo.address}
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="body2" sx={{ color: "#666" }}>
                          Payment:
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Chip
                          label={customerInfo.paymentMethod}
                          size="small"
                          sx={{ backgroundColor: "#e3f2fd", color: "#1976d2" }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                </CardContent>
              )}

              {/* Navigation Buttons */}
              <Box
                sx={{
                  p: 3,
                  display: "flex",
                  justifyContent: "space-between",
                  borderTop: "1px solid #e0e0e0",
                }}
              >
                <Button
                  onClick={handleBack}
                  disabled={activeStep === 0}
                  startIcon={<ArrowBack />}
                  sx={{
                    color: "#666",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                >
                  Back
                </Button>
                {activeStep < 2 ? (
                  <Button
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                    variant="contained"
                    sx={{
                      backgroundColor: "#667eea",
                      borderRadius: "25px",
                      px: 4,
                      "&:hover": { backgroundColor: "#5a6fd6" },
                    }}
                  >
                    Continue
                  </Button>
                ) : (
                  <Button
                    onClick={handleOrderConfirmation}
                    variant="contained"
                    startIcon={<CheckCircle />}
                    sx={{
                      backgroundColor: "#4CAF50",
                      borderRadius: "25px",
                      px: 4,
                      "&:hover": { backgroundColor: "#45a049" },
                    }}
                  >
                    Confirm Order
                  </Button>
                )}
              </Box>
            </Card>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                borderRadius: "20px",
                boxShadow: "0 10px 40px rgba(0,0,0,0.1)",
                position: "sticky",
                top: 100,
              }}
            >
              <Box
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  p: 2,
                }}
              >
                <Typography
                  variant="h6"
                  sx={{ color: "white", fontWeight: 600 }}
                >
                  📋 Order Summary
                </Typography>
              </Box>
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#666" }}>
                      {product.name} × {quantity}
                    </Typography>
                    <Typography sx={{ fontWeight: 600 }}>
                      ৳{product.price * quantity}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography sx={{ color: "#666", display: "flex", alignItems: "center", gap: 1 }}>
                      <LocalShipping sx={{ fontSize: 18 }} /> Shipping
                    </Typography>
                    <Typography sx={{ fontWeight: 600, color: shippingCost === 0 ? "#4CAF50" : "inherit" }}>
                      {shippingCost === 0 ? "Free" : `৳${shippingCost}`}
                    </Typography>
                  </Box>
                  {shippingCost > 0 && (
                    <Typography variant="caption" sx={{ color: "#999", display: "block", textAlign: "right" }}>
                      Free shipping on orders over ৳500
                    </Typography>
                  )}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 3,
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    Total
                  </Typography>
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(45deg, #667eea, #764ba2)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    ৳{grandTotal}
                  </Typography>
                </Box>

                <Alert
                  severity="info"
                  icon={<Payment />}
                  sx={{
                    borderRadius: "10px",
                    backgroundColor: "#e3f2fd",
                    color: "#1976d2",
                    "& .MuiAlert-icon": { color: "#1976d2" },
                  }}
                >
                  Secure payment with buyer protection
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Footer */}
        <Box
          sx={{
            textAlign: "center",
            mt: 6,
            pt: 3,
            borderTop: "1px solid #e0e0e0",
          }}
        >
          <Typography variant="body2" sx={{ color: "#999" }}>
            © 2025 PETZY - Your Path to Pet Adoption
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Cart;
