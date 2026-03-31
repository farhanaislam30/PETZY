import React, { useState, useEffect } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Snackbar,
  Avatar,
  Divider,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { Person, Email, Phone, LocationOn, ShoppingCart, CalendarMonth, Add, Edit, Delete, Star, StarBorder, Pets } from "@mui/icons-material";

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

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();
  
  // User info states
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  
  // Data states
  const [orders, setOrders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [petInterests, setPetInterests] = useState([]);
  
  // Address management states
  const [addresses, setAddresses] = useState([]);
  const [addressDialogOpen, setAddressDialogOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [newAddress, setNewAddress] = useState({
    label: "",
    fullAddress: "",
    city: "",
    phone: "",
  });
  
  // Decode user from token on mount and check if admin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("You must be logged in to view your profile");
      setLoading(false);
      return;
    }
    
    const decoded = decodeJWT(token);
    if (decoded) {
      // Check if user is admin and redirect them
      if (decoded.role === 'admin') {
        navigate("/admin");
        return;
      }
      setIsAdmin(false);
      const localPhone = localStorage.getItem('petzy_user_phone');
      const localAddress = localStorage.getItem('petzy_user_address');
      
      setUserInfo({
        name: decoded.name || "",
        email: decoded.email || "",
        // Prefer localStorage values if JWT doesn't have them
        phone: decoded.phone || localPhone || "",
        address: decoded.address || localAddress || "",
      });
    }
    
    // Load addresses from localStorage
    const savedAddresses = localStorage.getItem("petzy_addresses");
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    } else {
      // If user has an address from decoded token, add it as default address
      if (decoded?.address) {
        const defaultAddress = {
          id: Date.now().toString(),
          label: "Default Address",
          fullAddress: decoded.address,
          city: "",
          phone: decoded.phone || "",
          isDefault: true,
        };
        setAddresses([defaultAddress]);
        localStorage.setItem("petzy_addresses", JSON.stringify([defaultAddress]));
      }
    }
    
    fetchUserData();
  }, [navigate]);
  
  // Reset tab value when switching between admin and regular user
  useEffect(() => {
    if (isAdmin) {
      setTabValue(0);
    }
  }, [isAdmin]);
  
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const email = decodeJWT(token)?.email;
      
      // Fetch orders
      const ordersResponse = await axios.get(`${API_BASE}/api/orders`);
      const allOrders = ordersResponse.data.orders || ordersResponse.data || [];
      const userOrders = allOrders.filter(order => order.customerEmail === email);
      setOrders(userOrders);
      
      // Fetch appointments
      const appointmentsResponse = await axios.get(`${API_BASE}/api/appointments/email/${email}`);
      const userAppointments = appointmentsResponse.data.appointments || appointmentsResponse.data || [];
      setAppointments(userAppointments);
      
      // Fetch pet interests (adoption requests)
      const petInterestsResponse = await axios.get(`${API_BASE}/show-interest/email/${email}`);
      const userPetInterests = petInterestsResponse.data.interests || petInterestsResponse.data || [];
      setPetInterests(userPetInterests);
      
    } catch (err) {
      setError("Failed to load user data");
    }
    setLoading(false);
  };

  const validationSchema = Yup.object({
    phone: Yup.string(),
    address: Yup.string(),
  });

  const handleUpdateProfile = async (values, { setSubmitting }) => {
    try {
      const token = localStorage.getItem("token");
      const email = decodeJWT(token)?.email;
      
      if (!email) {
        setError("Unable to identify user. Please log in again.");
        setSubmitting(false);
        return;
      }
      
      const apiUrl = `${API_BASE}/users/${email}`;
      const response = await axios.put(apiUrl, {
        name: values.name,
        email: values.email,
        phone: values.phone,
        address: values.address,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (response.data.user) {
        const updatedUser = response.data.user;
        setUserInfo(prev => ({
          ...prev,
          phone: updatedUser.phone,
          address: updatedUser.address,
        }));
        localStorage.setItem('petzy_user_phone', updatedUser.phone || '');
        localStorage.setItem('petzy_user_address', updatedUser.address || '');
      }
      
      setSuccess("Profile updated successfully!");
    } catch (err) {
      if (err.response?.status === 404) {
        setError("User not found. Please log in again.");
      } else if (err.response?.status === 401) {
        setError("Authentication failed. Please log in again.");
      } else if (err.response?.status === 400) {
        setError(err.response.data?.message || "Invalid data provided");
      } else if (err.code === 'ECONNREFUSED') {
        setError("Cannot connect to server. Is the backend running?");
      } else {
        setError("Failed to update profile: " + (err.response?.data?.message || err.message));
      }
    }
    setSubmitting(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Address management functions
  const handleOpenAddressDialog = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setNewAddress({
        label: address.label,
        fullAddress: address.fullAddress,
        city: address.city,
        phone: address.phone,
      });
    } else {
      setEditingAddress(null);
      setNewAddress({
        label: "",
        fullAddress: "",
        city: "",
        phone: "",
      });
    }
    setAddressDialogOpen(true);
  };

  const handleCloseAddressDialog = () => {
    setAddressDialogOpen(false);
    setEditingAddress(null);
  };

  const handleSaveAddress = () => {
    if (!newAddress.fullAddress) {
      setError("Address is required");
      return;
    }

    let updatedAddresses;
    if (editingAddress) {
      // Update existing address
      updatedAddresses = addresses.map(addr =>
        addr.id === editingAddress.id
          ? { ...addr, ...newAddress }
          : addr
      );
      setSuccess("Address updated successfully!");
    } else {
      // Add new address
      const addressWithId = {
        ...newAddress,
        id: Date.now().toString(),
        isDefault: addresses.length === 0, // First address is default
      };
      updatedAddresses = [...addresses, addressWithId];
      setSuccess("Address added successfully!");
    }

    setAddresses(updatedAddresses);
    localStorage.setItem("petzy_addresses", JSON.stringify(updatedAddresses));
    handleCloseAddressDialog();
  };

  const handleDeleteAddress = (addressId) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      setAddresses(updatedAddresses);
      localStorage.setItem("petzy_addresses", JSON.stringify(updatedAddresses));
      setSuccess("Address deleted successfully!");
    }
  };

  const handleSetDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    }));
    setAddresses(updatedAddresses);
    localStorage.setItem("petzy_addresses", JSON.stringify(updatedAddresses));
    setSuccess("Default address updated!");
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", mt: 8, px: 2 }}>
      <Typography variant="h4" sx={{ mb: 3, color: "#1976d2", fontWeight: "bold" }}>
        My Profile
      </Typography>
      
      <Grid container spacing={3}>
        {/* User Info Card */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: "center" }}>
            <Avatar
              sx={{ width: 100, height: 100, mx: "auto", mb: 2, bgcolor: "#1976d2" }}
            >
              <Person sx={{ fontSize: 50 }} />
            </Avatar>
            <Typography variant="h5" sx={{ mb: 1 }}>
              {userInfo.name || "User"}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {userInfo.email || "No email"}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ textAlign: "left" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Phone sx={{ mr: 1, color: "#1976d2" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Phone</Typography>
                  <Typography variant="body2">{userInfo.phone || "Not provided"}</Typography>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LocationOn sx={{ mr: 1, color: "#1976d2" }} />
                <Box>
                  <Typography variant="caption" color="text.secondary">Address</Typography>
                  <Typography variant="body2">{userInfo.address || "Not provided"}</Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
        
        {/* Tabs Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ width: "100%" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                indicatorColor="primary"
                textColor="primary"
                variant="fullWidth"
              >
                <Tab icon={<Person />} label="Edit Profile" iconPosition="start" />
                <Tab icon={<LocationOn />} label="My Addresses" iconPosition="start" />
                <Tab icon={<ShoppingCart />} label="Purchase History" iconPosition="start" />
                <Tab icon={<CalendarMonth />} label="Appointments" iconPosition="start" />
                <Tab icon={<Pets />} label="Pet Interests" iconPosition="start" />
              </Tabs>
            </Box>
            
            {/* Edit Profile Tab */}
            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" sx={{ mb: 3 }}>Update Your Profile</Typography>
              <Formik
                initialValues={{
                  name: userInfo.name || "",
                  email: userInfo.email || "",
                  phone: userInfo.phone || "",
                  address: userInfo.address || "",
                }}
                validationSchema={validationSchema}
                onSubmit={handleUpdateProfile}
                enableReinitialize
              >
                {({ isSubmitting, handleChange, values }) => (
                  <Form>
                    <Field
                      as={TextField}
                      fullWidth
                      margin="dense"
                      label="Name"
                      name="name"
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      margin="dense"
                      label="Email"
                      name="email"
                      disabled
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                    <Field
                      as={TextField}
                      fullWidth
                      margin="dense"
                      label="Phone"
                      name="phone"
                      onChange={handleChange}
                      value={values.phone}
                    />
                    <ErrorMessage name="phone" component={Typography} color="error" sx={{ fontSize: "0.75rem" }} />
                    
                    <Field
                      as={TextField}
                      fullWidth
                      margin="dense"
                      label="Address"
                      name="address"
                      multiline
                      rows={2}
                      onChange={handleChange}
                      value={values.address}
                    />
                    <ErrorMessage name="address" component={Typography} color="error" sx={{ fontSize: "0.75rem" }} />
                    
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{ mt: 3 }}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Saving..." : "Save Changes"}
                    </Button>
                  </Form>
                )}
              </Formik>
            </TabPanel>
            
            {/* My Addresses Tab */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h6">My Delivery Addresses</Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleOpenAddressDialog()}
                >
                  Add Address
                </Button>
              </Box>
              {addresses.length > 0 ? (
                <Grid container spacing={2}>
                  {addresses.map((address) => (
                    <Grid item xs={12} sm={6} key={address.id}>
                      <Paper sx={{ p: 2, position: "relative", border: address.isDefault ? "2px solid #1976d2" : "1px solid #e0e0e0" }}>
                        {address.isDefault && (
                          <Chip
                            icon={<Star sx={{ fontSize: 14 }} />}
                            label="Default"
                            size="small"
                            sx={{ position: "absolute", top: 8, right: 8, bgcolor: "#1976d2", color: "white" }}
                          />
                        )}
                        <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 1 }}>
                          {address.label || "Address"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {address.fullAddress}
                        </Typography>
                        {address.city && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {address.city}
                          </Typography>
                        )}
                        {address.phone && (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Phone: {address.phone}
                          </Typography>
                        )}
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <IconButton size="small" onClick={() => handleOpenAddressDialog(address)}>
                            <Edit fontSize="small" />
                          </IconButton>
                          <IconButton size="small" color="error" onClick={() => handleDeleteAddress(address.id)}>
                            <Delete fontSize="small" />
                          </IconButton>
                          {!address.isDefault && (
                            <Button
                              size="small"
                              startIcon={<StarBorder fontSize="small" />}
                              onClick={() => handleSetDefaultAddress(address.id)}
                              sx={{ ml: 1 }}
                            >
                              Set Default
                            </Button>
                          )}
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              ) : (
                <Typography align="center" color="text.secondary">
                  No addresses added yet. Click "Add Address" to add your first address.
                </Typography>
              )}
            </TabPanel>
            
            {/* Purchase History Tab - Always rendered */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>My Purchase History</Typography>
              {orders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Items</TableCell>
                        <TableCell>Total</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order._id}>
                          <TableCell>{order._id?.slice(-8) || "N/A"}</TableCell>
                          <TableCell>{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                          <TableCell>
                            {order.items?.map((item, idx) => (
                              <Box key={idx} sx={{ mb: 0.5 }}>
                                <Typography variant="body2">
                                  {item.productName} x{item.quantity}
                                </Typography>
                              </Box>
                            ))}
                          </TableCell>
                          <TableCell>৳{order.total || order.totalAmount || 0}</TableCell>
                          <TableCell>
                            <Chip
                              label={order.status || "Pending"}
                              size="small"
                              sx={{
                                bgcolor: order.status === "Delivered" ? "#e8f5e9" : 
                                         order.status === "Processing" ? "#fff3e0" : 
                                         order.status === "Shipped" ? "#e3f2fd" : "#f5f5f5",
                                color: order.status === "Delivered" ? "#2e7d32" : 
                                order.status === "Processing" ? "#ed6c02" : 
                                order.status === "Shipped" ? "#1976d2" : "#666",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary">
                  No purchase history found
                </Typography>
              )}
            </TabPanel>
            
            {/* Appointments Tab - Always rendered */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" sx={{ mb: 3 }}>My Appointments</Typography>
              {appointments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Notes</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((appointment) => (
                        <TableRow key={appointment._id}>
                          <TableCell>{appointment.doctorName}</TableCell>
                          <TableCell>{appointment.date}</TableCell>
                          <TableCell>{appointment.time}</TableCell>
                          <TableCell>
                            <Chip
                              label={appointment.status || "Pending"}
                              size="small"
                              sx={{
                                bgcolor: appointment.status === "Confirmed" ? "#e8f5e9" : 
                                         appointment.status === "Pending" ? "#fff3e0" : 
                                         appointment.status === "Cancelled" ? "#ffebee" : "#f5f5f5",
                                color: appointment.status === "Confirmed" ? "#2e7d32" : 
                                appointment.status === "Pending" ? "#ed6c02" : 
                                appointment.status === "Cancelled" ? "#d32f2f" : "#666",
                                fontWeight: 600,
                              }}
                            />
                          </TableCell>
                          <TableCell>{appointment.notes || "-"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary">
                  No appointments found
                </Typography>
              )}
            </TabPanel>
            
            {/* Pet Interests Tab - Always rendered */}
            <TabPanel value={tabValue} index={4}>
              <Typography variant="h6" sx={{ mb: 3 }}>Pet Adoption Requests</Typography>
              {petInterests.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Pet ID</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Phone</TableCell>
                        <TableCell>Living Situation</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Other Pets</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {petInterests.map((interest, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{typeof interest.petId === 'object' ? interest.petId.name || interest.petId : interest.petId}</TableCell>
                          <TableCell>{new Date(interest.timestamp).toLocaleDateString()}</TableCell>
                          <TableCell>{interest.phone}</TableCell>
                          <TableCell>{interest.livingSituation}</TableCell>
                          <TableCell>{interest.experience}</TableCell>
                          <TableCell>{interest.otherPets || 'None'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography align="center" color="text.secondary">
                  No pet adoption requests found
                </Typography>
              )}
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Snackbar for messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)}>{success}</Alert>
      </Snackbar>
      
      {/* Add/Edit Address Dialog */}
      <Dialog open={addressDialogOpen} onClose={handleCloseAddressDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingAddress ? "Edit Address" : "Add New Address"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Address Label (e.g., Home, Office)"
            fullWidth
            value={newAddress.label}
            onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            margin="dense"
            label="Full Address"
            fullWidth
            required
            multiline
            rows={2}
            value={newAddress.fullAddress}
            onChange={(e) => setNewAddress({ ...newAddress, fullAddress: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="City / Area"
            fullWidth
            value={newAddress.city}
            onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Contact Phone (Optional)"
            fullWidth
            value={newAddress.phone}
            onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddressDialog}>Cancel</Button>
          <Button onClick={handleSaveAddress} variant="contained">
            {editingAddress ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Profile;
