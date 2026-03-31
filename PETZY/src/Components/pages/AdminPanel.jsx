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
} from "@mui/material";
import { ShoppingCart, Person, Email, Phone, LocationOn, CalendarMonth, ConfirmationNumber } from "@mui/icons-material";

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
  const [error, setError] = useState(null);

  // Fetch orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE}/customer`);
      setOrders(response.data);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to fetch orders");
    }
    setLoading(false);
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
            <ShoppingCart sx={{ fontSize: 32 }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
              View Orders
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Track and manage customer orders
            </Typography>
          </Box>
        </Box>
      </Paper>

      {/* Stats Summary */}
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
              ৳{orders.reduce((acc, order) => acc + (parseFloat(order.total) || 0), 0).toFixed(2)}
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

      {/* Table Section */}
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
                        {order.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {order.phone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {order.address}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" sx={{ fontWeight: 600, color: theme.secondary }}>
                        ৳{order.total}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
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

      {/* Snackbar for messages */}
      <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
        <Alert severity="error" onClose={() => setError(null)} sx={{ borderRadius: 2 }}>{error}</Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminPanel;
