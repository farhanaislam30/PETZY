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
} from "@mui/material";
import { Person, Email, Phone, LocationOn, ShoppingCart, CalendarMonth } from "@mui/icons-material";

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
      setUserInfo({
        name: decoded.name || "",
        email: decoded.email || "",
        phone: decoded.phone || "",
        address: decoded.address || "",
      });
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
      const ordersResponse = await axios.get(`${API_BASE}/customer`);
      const userOrders = ordersResponse.data.filter(
        order => order.email === email
      );
      setOrders(userOrders);
      
      // For appointments, we'll check doctors (since there's no explicit appointment system yet)
      // This would typically be a separate endpoint
      const doctorsResponse = await axios.get(`${API_BASE}/doctors`);
      setAppointments(doctorsResponse.data || []);
      
    } catch (err) {
      console.error("Error fetching user data:", err);
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
      
      // Update user profile via API (you may need to add this endpoint)
      // For now, we'll store in localStorage as fallback
      localStorage.setItem("userPhone", values.phone);
      localStorage.setItem("userAddress", values.address);
      
      setUserInfo(prev => ({
        ...prev,
        phone: values.phone,
        address: values.address,
      }));
      
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError("Failed to update profile");
    }
    setSubmitting(false);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
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
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab icon={<Person />} label="Edit Profile" iconPosition="start" />
              {!isAdmin && (
                <>
                  <Tab icon={<ShoppingCart />} label="Purchase History" iconPosition="start" />
                  <Tab icon={<CalendarMonth />} label="Appointments" iconPosition="start" />
                </>
              )}
            </Tabs>
            
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
            
            {/* Purchase History Tab - Only for regular users */}
            {!isAdmin && (
              <TabPanel value={tabValue} index={1}>
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
                          <TableCell>{order.items?.length || "N/A"}</TableCell>
                          <TableCell>৳{order.total || 0}</TableCell>
                          <TableCell>
                            <Typography
                              variant="body2"
                              sx={{
                                color: order.status === "completed" ? "green" : "orange",
                              }}
                            >
                              {order.status || "Pending"}
                            </Typography>
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
            )}
            
            {/* Appointments Tab - Only for regular users */}
            {!isAdmin && (
              <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" sx={{ mb: 3 }}>Booked Appointments</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Available veterinary doctors - Contact them to book an appointment
              </Typography>
              {appointments.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Specialization</TableCell>
                        <TableCell>Experience</TableCell>
                        <TableCell>Contact</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {appointments.map((doctor) => (
                        <TableRow key={doctor.email}>
                          <TableCell>{doctor.name}</TableCell>
                          <TableCell>{doctor.specialization}</TableCell>
                          <TableCell>{doctor.experience} years</TableCell>
                          <TableCell>
                            <Typography variant="body2">{doctor.email}</Typography>
                            <Typography variant="body2">{doctor.phone}</Typography>
                          </TableCell>
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
            )}
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
    </Box>
  );
};

export default Profile;
