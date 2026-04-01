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
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  Grid,
  Button,
  Menu,
  MenuItem,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { ShoppingCart, Person, Email, Phone, LocationOn, CalendarMonth, ConfirmationNumber, MoreVert } from "@mui/icons-material";

const API_BASE = "http://localhost:3000";

// PETZY brand colors
const theme = {
  primary: "#1976d2",
  secondary: "#ed6c02",
  background: "#f5f5f5",
  white: "#ffffff",
  text: "#1a1a1a",
  textSecondary: "#666666",
  success: "#2e7d32",
  warning: "#ed6c02",
  error: "#d32f2f",
};

const AdminPanel = () => {
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [petInterests, setPetInterests] = useState([]);
  const [donations, setDonations] = useState([]);
  const [petDonations, setPetDonations] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [appointmentAnchorEl, setAppointmentAnchorEl] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
    fetchPetInterests();
    fetchDonations();
    fetchPetDonations();
    fetchAppointments();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/api/orders`);
      console.log("[AdminPanel] API Response:", JSON.stringify(response.data, null, 2));
      const allOrders = response.data.orders || response.data || [];
      setOrders(allOrders);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    }
    setLoading(false);
  };

  const fetchPetInterests = async () => {
    try {
      const response = await axios.get(`${API_BASE}/show-interest`);
      console.log("[AdminPanel] Pet Interests Response:", JSON.stringify(response.data, null, 2));
      setPetInterests(response.data || []);
    } catch (err) {
      console.error("Error fetching pet interests:", err);
    }
  };

  const fetchDonations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/donations`);
      console.log("[AdminPanel] Financial Donations Response:", JSON.stringify(response.data, null, 2));
      setDonations(response.data.donations || []);
    } catch (err) {
      console.error("Error fetching financial donations:", err);
    }
  };

  const fetchPetDonations = async () => {
    try {
      const response = await axios.get(`${API_BASE}/donateget`);
      console.log("[AdminPanel] Pet Donations Response:", JSON.stringify(response.data, null, 2));
      setPetDonations(response.data || []);
    } catch (err) {
      console.error("Error fetching pet donations:", err);
    }
  };

  const updatePetInterestStatus = async (id, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/show-interest/status/${id}`, { status: newStatus });
      if (response.data.success) {
        setSuccess(`Pet adoption request ${newStatus.toLowerCase()} successfully!`);
        // Refresh the list
        fetchPetInterests();
      }
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status");
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/appointments`);
      console.log("[AdminPanel] Appointments Response:", JSON.stringify(response.data, null, 2));
      const allAppointments = response.data.appointments || response.data || [];
      
      // Debug: Log each appointment's phone field
      console.log("[AdminPanel] DEBUG - First appointment keys:", allAppointments.length > 0 ? Object.keys(allAppointments[0]) : "none");
      allAppointments.forEach((apt, idx) => {
        console.log(`[AdminPanel] DEBUG - Appointment ${idx}: customerPhone="${apt.customerPhone}", phone="${apt.phone}", fullPhone="${apt.fullPhone}", userId=${JSON.stringify(apt.userId)}`);
      });
      
      setAppointments(allAppointments);
    } catch (err) {
      console.error("Error fetching appointments:", err);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      // Make API call to update order status in backend
      const response = await axios.put(`${API_BASE}/api/orders/${orderId}`, { status: newStatus });
      
      // Update local state with the updated order from the response
      setOrders(prevOrders =>
        prevOrders.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      setSuccess(`Order status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError("Failed to update order status");
    }
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleMenuOpen = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const handleAppointmentStatusUpdate = async (appointmentId, newStatus) => {
    try {
      const response = await axios.put(`${API_BASE}/api/appointments/${appointmentId}`, { status: newStatus });
      
      setAppointments(prevAppointments =>
        prevAppointments.map(apt =>
          apt._id === appointmentId ? { ...apt, status: newStatus } : apt
        )
      );
      setSuccess(`Appointment status updated to ${newStatus}`);
    } catch (err) {
      console.error("Error updating appointment status:", err);
      setError("Failed to update appointment status");
    }
    setAppointmentAnchorEl(null);
    setSelectedAppointment(null);
  };

  const handleAppointmentMenuOpen = (event, appointment) => {
    setAppointmentAnchorEl(event.currentTarget);
    setSelectedAppointment(appointment);
  };

  const handleAppointmentMenuClose = () => {
    setAppointmentAnchorEl(null);
    setSelectedAppointment(null);
  };

  const tabLabels = ["Orders", "Appointments", "Pet Requests", "Donations", "Posted Pets"];

  return (
    <Box sx={{ width: "100%", mt: 8, px: { xs: 1, md: 3 }, py: 3, minHeight: "100vh", bgcolor: theme.background }}>
      {/* Page Header */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 2, 
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
            <ShoppingCart sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              {tabLabels[activeTab]}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Track and manage customer orders
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Tabs Navigation */}
      <Paper sx={{ mb: 2, borderRadius: 2 }}>
        <Tabs 
          value={activeTab} 
          onChange={(e, v) => setActiveTab(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ 
            '& .MuiTab-root': { minHeight: 56, textTransform: 'none', fontWeight: 600 },
            '& .Mui-selected': { fontWeight: 700 }
          }}
        >
          <Tab label={`Orders (${orders.length})`} />
          <Tab label={`Appointments (${appointments.length})`} />
          <Tab label={`Pet Requests (${petInterests.length})`} />
          <Tab label={`Donations (${donations.length})`} />
          <Tab label={`Posted Pets (${petDonations.length})`} />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {activeTab === 0 && (
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.primary }}>
                {orders.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.success }}>
                ৳{orders.reduce((acc, order) => acc + (parseFloat(order.totalAmount) || 0), 0).toFixed(2)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper sx={{ p: 2.5, borderRadius: 2, textAlign: "center" }}>
              <Typography variant="h3" sx={{ fontWeight: 700, color: theme.secondary }}>
                {orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString()).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today's Orders
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      )}

      {/* Table Section */}
      {activeTab === 0 && (
      <>
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
            Orders List
          </Typography>
          <Chip 
            label={`${orders.length} orders`} 
            size="small" 
            sx={{ bgcolor: "#e3f2fd", color: theme.primary, fontWeight: 600 }} 
          />
        </Box>
        
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress sx={{ color: theme.primary }} />
          </Box>
        ) : orders.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <ConfirmationNumber sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Order ID
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <Person sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Customer
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <Email sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Email
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <Phone sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Phone
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Address
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }} align="right">
                    Total
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    <CalendarMonth sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                    Date
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>
                    Status
                  </TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }} align="center">
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order, index) => (
                  <TableRow 
                    key={order._id}
                    sx={{ 
                      "&:hover": { bgcolor: "#f8f9fa" },
                      borderBottom: index < orders.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontFamily: "monospace", color: theme.textSecondary }}>
                        #{order._id?.slice(-8).toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {order.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.customerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.customerPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.shippingAddress}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.secondary }}>
                        ৳{order.totalAmount}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </TableCell>
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
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, order)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <ShoppingCart sx={{ fontSize: 64, color: "#ccc", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No orders found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Orders will appear here when customers make purchases
            </Typography>
          </Box>
        )}
      </Paper>
      </>
      )}

      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>{error}</Alert>
      </Snackbar>
      <Snackbar open={!!success} autoHideDuration={6000} onClose={() => setSuccess(null)}>
        <Alert severity="success" onClose={() => setSuccess(null)} sx={{ borderRadius: 2 }}>{success}</Alert>
      </Snackbar>

      {/* Pet Interests Section - Tab 2 */}
      {activeTab === 2 && (
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
            Pet Adoption Requests
          </Typography>
          <Chip 
            label={`${petInterests.length} requests`} 
            size="small" 
            sx={{ bgcolor: "#e8f5e9", color: theme.success, fontWeight: 600 }} 
          />
        </Box>
        
        {petInterests.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Pet</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Living Situation</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Experience</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {petInterests.map((interest, index) => (
                  <TableRow 
                    key={interest._id}
                    sx={{ 
                      "&:hover": { bgcolor: "#f8f9fa" },
                      borderBottom: index < petInterests.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <TableCell>{interest.petName || `#${interest.petId}`}</TableCell>
                    <TableCell>{interest.email}</TableCell>
                    <TableCell>{interest.phone}</TableCell>
                    <TableCell>{interest.livingSituation}</TableCell>
                    <TableCell>{interest.experience}</TableCell>
                    <TableCell>
                      {new Date(interest.timestamp).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={interest.status || "Pending"} 
                        size="small" 
                        sx={{ 
                          bgcolor: interest.status === "Approved" ? "#e8f5e9" : interest.status === "Rejected" ? "#ffebee" : "#fff3e0",
                          color: interest.status === "Approved" ? "#2e7d32" : interest.status === "Rejected" ? "#d32f2f" : "#ed6c02",
                          fontWeight: 600,
                          fontSize: "0.75rem",
                        }} 
                      />
                    </TableCell>
                    <TableCell>
                      {interest.status !== "Approved" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => updatePetInterestStatus(interest._id, "Approved")}
                          sx={{ mr: 1, minWidth: "auto", py: 0.5, fontSize: "0.7rem" }}
                        >
                          Approve
                        </Button>
                      )}
                      {interest.status !== "Rejected" && (
                        <Button
                          size="small"
                          variant="contained"
                          color="error"
                          onClick={() => updatePetInterestStatus(interest._id, "Rejected")}
                          sx={{ minWidth: "auto", py: 0.5, fontSize: "0.7rem" }}
                        >
                          Reject
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No pet adoption requests yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pet adoption requests will appear here
            </Typography>
          </Box>
        )}
      </Paper>
      )}

      {/* Financial Donations Section */}
      {activeTab === 3 && (
      <Paper sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
            Financial Donations
          </Typography>
          <Chip 
            label={`${donations.length} donations`} 
            size="small" 
            sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} 
          />
        </Box>
      {donations.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Donor Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Amount</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Payment Method</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {donations.map((donation, index) => (
                  <TableRow 
                    key={donation._id}
                    sx={{ 
                      "&:hover": { bgcolor: "#f8f9fa" },
                      borderBottom: index < donations.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <TableCell>{donation.donorName}</TableCell>
                    <TableCell>{donation.donorEmail}</TableCell>
                    <TableCell sx={{ fontWeight: "bold", color: "#2e7d32" }}>৳{donation.amount}</TableCell>
                    <TableCell>{donation.paymentMethod}</TableCell>
                    <TableCell>{new Date(donation.timestamp).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip 
                        label={donation.status || "Completed"} 
                        size="small" 
                        sx={{ bgcolor: "#e8f5e9", color: "#2e7d32", fontWeight: 600 }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No donations yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Financial donations will appear here
            </Typography>
          </Box>
        )}
      </Paper>
      )}

      {/* Appointments Section */}
      {activeTab === 1 && (
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
            Doctor Appointments
          </Typography>
          <Chip 
            label={`${appointments.length} appointments`} 
            size="small" 
            sx={{ bgcolor: "#e3f2fd", color: theme.primary, fontWeight: 600 }} 
          />
        </Box>
        
        {appointments.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Customer</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Doctor</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Time</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Status</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }} align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((apt, index) => (
                  <TableRow 
                    key={apt._id}
                    sx={{ 
                      "&:hover": { bgcolor: "#f8f9fa" },
                      borderBottom: index < appointments.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <TableCell>{apt.customerName}</TableCell>
                    <TableCell>{apt.doctorName}</TableCell>
                    <TableCell>{apt.date}</TableCell>
                    <TableCell>{apt.time}</TableCell>
                    <TableCell>
                      <Chip
                        label={apt.status || "Pending"}
                        size="small"
                        sx={{
                          bgcolor: apt.status === "Confirmed" ? "#e8f5e9" : 
                                   apt.status === "Cancelled" ? "#ffebee" : "#fff3e0",
                          color: apt.status === "Confirmed" ? "#2e7d32" : 
                                 apt.status === "Cancelled" ? "#c62828" : "#ed6c02",
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>
                    <TableCell>{apt.customerPhone || apt.userId?.phone || "N/A"}</TableCell>
                    <TableCell align="center">
                      <IconButton
                        size="small"
                        onClick={(e) => handleAppointmentMenuOpen(e, apt)}
                      >
                        <MoreVert />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No appointments yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Doctor appointments will appear here
            </Typography>
          </Box>
        )}
      </Paper>
      )}
      
      {/* Status Update Menu for Orders */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleStatusUpdate(selectedOrder?._id, "Pending")}>
          <Chip label="Pending" size="small" sx={{ mr: 1, bgcolor: "#f5f5f5", color: "#666" }} />
          Mark as Pending
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(selectedOrder?._id, "Processing")}>
          <Chip label="Processing" size="small" sx={{ mr: 1, bgcolor: "#fff3e0", color: "#ed6c02" }} />
          Mark as Processing
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(selectedOrder?._id, "Shipped")}>
          <Chip label="Shipped" size="small" sx={{ mr: 1, bgcolor: "#e3f2fd", color: "#1976d2" }} />
          Mark as Shipped
        </MenuItem>
        <MenuItem onClick={() => handleStatusUpdate(selectedOrder?._id, "Delivered")}>
          <Chip label="Delivered" size="small" sx={{ mr: 1, bgcolor: "#e8f5e9", color: "#2e7d32" }} />
          Mark as Delivered
        </MenuItem>
      </Menu>

      {/* Pet Donations (Posted Pets) Section */}
      {activeTab === 4 && (
      <Paper sx={{ borderRadius: 2, overflow: "hidden", mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: theme.text }}>
            Posted Pets for Adoption
          </Typography>
          <Chip 
            label={`${petDonations.length} pets`} 
            size="small" 
            sx={{ bgcolor: "#f3e5f5", color: "#7b1fa2", fontWeight: 600 }} 
          />
        </Box>
        
        {petDonations.length > 0 ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: "#f8f9fa" }}>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Pet Name</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Type</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Age</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Location</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Owner Email</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Owner Phone</TableCell>
                  <TableCell sx={{ fontWeight: 600, color: theme.textSecondary, py: 2 }}>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {petDonations.map((donation, index) => (
                  <TableRow 
                    key={donation._id}
                    sx={{ 
                      "&:hover": { bgcolor: "#f8f9fa" },
                      borderBottom: index < petDonations.length - 1 ? "1px solid #f0f0f0" : "none",
                    }}
                  >
                    <TableCell>{donation.name || "Unknown"}</TableCell>
                    <TableCell>{donation.type}</TableCell>
                    <TableCell>{donation.age}</TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell>{donation.email}</TableCell>
                    <TableCell>{donation.phone}</TableCell>
                    <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis" }}>
                      {donation.reason}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography variant="h6" color="text.secondary">
              No posted pets yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Pets posted for adoption will appear here
            </Typography>
          </Box>
        )}
      </Paper>
      )}

      {/* Status Update Menu for Appointments */}
      <Menu
        anchorEl={appointmentAnchorEl}
        open={Boolean(appointmentAnchorEl)}
        onClose={handleAppointmentMenuClose}
      >
        <MenuItem onClick={() => handleAppointmentStatusUpdate(selectedAppointment?._id, "Confirmed")}>
          <Chip label="Confirmed" size="small" sx={{ mr: 1, bgcolor: "#e8f5e9", color: "#2e7d32" }} />
          Accept Appointment
        </MenuItem>
        <MenuItem onClick={() => handleAppointmentStatusUpdate(selectedAppointment?._id, "Cancelled")}>
          <Chip label="Cancelled" size="small" sx={{ mr: 1, bgcolor: "#ffebee", color: "#c62828" }} />
          Reject Appointment
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default AdminPanel;
