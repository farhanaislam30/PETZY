import React, { useState, useEffect, useRef } from "react";
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
  FormControl,
  InputLabel,
  Select,
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
  const [cartItems, setCartItems] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isCartLoaded, setIsCartLoaded] = useState(false);
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
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  
  // Ref to track if cart has been loaded (prevents double loading in StrictMode)
  const cartLoadedRef = useRef(false);

  const product = location.state?.product;

  // Load cart from localStorage on mount (only once)
  useEffect(() => {
    // Prevent double loading - only run once
    if (cartLoadedRef.current) {
      console.log("[Cart] Cart already loaded, skipping load effect");
      return;
    }
    cartLoadedRef.current = true;
    
    console.log("[Cart] Loading cart from localStorage...");
    try {
      const savedCart = localStorage.getItem("petzy_cart");
      console.log("[Cart] Raw localStorage value:", savedCart);
      
      // If cart already has items and localStorage is empty, don't clear
      if (cartItems.length > 0 && !savedCart) {
        console.log("[Cart] Cart has items, localStorage is empty - preserving cart state");
        setIsCartLoaded(true);
        return;
      }
      
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log("[Cart] Parsed cart items:", parsedCart);
        
        // Don't overwrite with empty array if we already have items
        if (cartItems.length > 0 && parsedCart.length === 0) {
          console.log("[Cart] Cart has items, localStorage is empty - preserving cart state");
          setIsCartLoaded(true);
          return;
        }
        
        // Only set cart items if we don't have existing items or localStorage has items
        if (parsedCart.length > 0) {
          setCartItems(parsedCart);
        } else if (cartItems.length === 0) {
          // Only set to empty array if cart is truly empty
          setCartItems([]);
        }
      } else if (cartItems.length === 0) {
        console.log("[Cart] No saved cart found in localStorage");
        setCartItems([]);
      }
    } catch (error) {
      console.error("[Cart] Error loading cart from localStorage:", error);
      // Clear corrupted data and start fresh
      localStorage.removeItem("petzy_cart");
    }
    // Mark that we've attempted to load from localStorage
    setIsCartLoaded(true);
    
    // Load user data and addresses from localStorage
    const token = localStorage.getItem("token");
    if (token) {
      try {
        // Decode JWT to get user info
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
          atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join('')
        );
        const decoded = JSON.parse(jsonPayload);
        
        // Set user info from token
        setCustomerInfo(prev => ({
          ...prev,
          name: decoded.name || "",
          email: decoded.email || "",
          phone: decoded.phone || "",
        }));
        
        // Load addresses from localStorage
        const savedAddresses = localStorage.getItem("petzy_addresses");
        if (savedAddresses) {
          const addresses = JSON.parse(savedAddresses);
          setSavedAddresses(addresses);
          
          // Auto-select default address
          const defaultAddr = addresses.find(addr => addr.isDefault);
          if (defaultAddr) {
            setSelectedAddressId(defaultAddr.id);
            setCustomerInfo(prev => ({
              ...prev,
              address: defaultAddr.fullAddress,
            }));
          }
        }
      } catch (error) {
        console.error("Error loading user data:", error);
      }
    }
  }, []);

  // Save cart to localStorage whenever cartItems changes (but only after initial load completes)
  useEffect(() => {
    if (isCartLoaded) {
      console.log("[Cart] Saving cart to localStorage:", cartItems);
      localStorage.setItem("petzy_cart", JSON.stringify(cartItems));
    }
  }, [cartItems, isCartLoaded]);

  // Calculate totals based on cart items
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
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
  
  // Handle address selection from saved addresses
  const handleAddressSelect = (e) => {
    const addressId = e.target.value;
    setSelectedAddressId(addressId);
    if (addressId === "manual") {
      // Clear address for manual entry
      setCustomerInfo(prev => ({ ...prev, address: "" }));
    } else {
      const selectedAddr = savedAddresses.find(addr => addr.id === addressId);
      if (selectedAddr) {
        setCustomerInfo(prev => ({ ...prev, address: selectedAddr.fullAddress }));
      }
    }
    // Clear error if any
    if (errors.address) {
      setErrors({ ...errors, address: "" });
    }
  };

  const handleQuantityChange = (delta) => {
    const newQuantity = Math.max(1, quantity + delta);
    setQuantity(newQuantity);
  };

  // Handle quantity change for a specific cart item
  const handleUpdateQuantity = (itemId, delta) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id === itemId) {
          const newQty = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  // Handle removing item from cart
  const handleRemoveItem = (itemId) => {
    if (window.confirm("Are you sure you want to remove this item from your cart?")) {
      setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
    }
  };

  const handleOrderConfirmation = async () => {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem("token") || localStorage.getItem("user");
    if (!isLoggedIn) {
      alert("Please login to complete your purchase");
      navigate("/login");
      return;
    }

    if (!validateStep(1)) return;

    // Debug: Check cart items and grandTotal
    console.log("[Cart] Cart items:", JSON.stringify(cartItems, null, 2));
    console.log("[Cart] totalPrice:", totalPrice);
    console.log("[Cart] shippingCost:", shippingCost);
    console.log("[Cart] grandTotal:", grandTotal);
    console.log("[Cart] customerInfo:", JSON.stringify(customerInfo, null, 2));

    // Create order details for all cart items
    const orderDetails = {
      items: cartItems.map((item) => ({
        productName: item.name,
        price: item.price,
        quantity: item.quantity,
      })),
      totalAmount: grandTotal,
      name: customerInfo.name,
      phone: customerInfo.phone,
      email: customerInfo.email,
      address: customerInfo.address,
      payment: customerInfo.paymentMethod,
      notes: customerInfo.notes,
    };

    try {
      console.log("[Cart] Submitting order data:", JSON.stringify(orderDetails, null, 2));
      const response = await axios.post(
        "http://localhost:3000/api/orders",
        orderDetails,
        { headers: { "Content-Type": "application/json" } }
      );
      if (response.status === 201) {
        setOrderStatus("success");
        // Clear cart after successful order
        setCartItems([]);
        localStorage.removeItem("petzy_cart");
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

  // If no cart items, show empty cart message
  if (cartItems.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%)",
          fontFamily: "'Poppins', sans-serif",
          pt: 10,
          pb: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="sm">
          <Box sx={{ textAlign: "center" }}>
            <ShoppingCart sx={{ fontSize: 80, color: "#667eea", mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a2e", mb: 1 }}>
              Your Cart is Empty
            </Typography>
            <Typography variant="body1" sx={{ color: "#666", mb: 3 }}>
              Add items from the Pet Store to see them here
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate("/pet_store")}
              sx={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                fontWeight: 600,
                px: 4,
                py: 1.5,
                borderRadius: "10px",
              }}
            >
              Browse Pet Store
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

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

        <Grid container spacing={3}>
          {/* Cart Items List */}
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card
                key={item.id}
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
                    p: 1,
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "white", fontWeight: 600, display: "flex", alignItems: "center", gap: 0.5 }}
                  >
                    <Storefront sx={{ fontSize: 18 }} /> Product Details
                  </Typography>
                </Box>
                <CardContent sx={{ p: 2 }}>
                  <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <CardMedia
                        component="img"
                        height="100"
                        image={item.image || "/pet_bed.webp"}
                        alt={item.name}
                        sx={{
                          borderRadius: "10px",
                          objectFit: "cover",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Typography
                        variant="subtitle1"
                        sx={{ fontWeight: 700, color: "#1a1a2e", mb: 0.5 }}
                      >
                        {item.name}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        sx={{ color: "#667eea", fontWeight: 700, mb: 1 }}
                      >
                        ৳{item.price}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                        <Chip
                          label={item.category || "Pet Supply"}
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

                  <Divider sx={{ my: 1.5 }} />

                  {/* Quantity Controls */}
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "space-between",
                      alignItems: { xs: "stretch", sm: "center" },
                      gap: 1,
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
                          onClick={() => handleUpdateQuantity(item.id, -1)}
                          disabled={item.quantity <= 1}
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
                          value={item.quantity}
                          onChange={(e) => {
                            const newQty = Math.max(1, parseInt(e.target.value) || 1);
                            setCartItems((prevItems) =>
                              prevItems.map((cartItem) =>
                                cartItem.id === item.id ? { ...cartItem, quantity: newQty } : cartItem
                              )
                            );
                          }}
                          inputProps={{ min: 1, style: { textAlign: "center", width: 30 } }}
                          sx={{
                            "& input": {
                              fontWeight: 600,
                              fontSize: "0.9rem",
                              py: 0.5,
                            },
                          }}
                        />
                        <IconButton
                          onClick={() => handleUpdateQuantity(item.id, 1)}
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

                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button
                        variant="outlined"
                        color="error"
                        startIcon={<Delete />}
                        onClick={() => handleRemoveItem(item.id)}
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
            ))}

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
                      {savedAddresses.length > 0 && (
                        <FormControl fullWidth sx={{ mt: 1 }}>
                          <InputLabel shrink>Select Saved Address</InputLabel>
                          <Select
                            value={selectedAddressId}
                            onChange={handleAddressSelect}
                            label="Select Saved Address"
                            size="small"
                          >
                            <MenuItem value="manual">
                              <em>Enter New Address</em>
                            </MenuItem>
                            {savedAddresses.map((addr) => (
                              <MenuItem key={addr.id} value={addr.id}>
                                {addr.label || "Address"} {addr.isDefault && "(Default)"}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
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
                  {cartItems.map((item) => (
                    <Box key={item.id} sx={{ mb: 2 }}>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography sx={{ color: "#666" }}>
                          {item.name} × {item.quantity}
                        </Typography>
                        <Typography sx={{ fontWeight: 600 }}>
                          ৳{item.price * item.quantity}
                        </Typography>
                      </Box>
                    </Box>
                  ))}
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
