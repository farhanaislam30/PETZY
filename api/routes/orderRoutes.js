import express from "express";
import cors from "cors";
import { 
  createOrder, 
  getAllOrders, 
  getOrdersByUser, 
  getOrderById, 
  updateOrderStatus, 
  deleteOrder 
} from "../Controllers/orderController.js";
import { authenticateToken } from "../Utils/authMiddleware.js";

const route = express.Router();
route.use(cors());

// Create a new order
route.post("/", createOrder);

// Get all orders (admin)
route.get("/", getAllOrders);

// Get orders by user ID
route.get("/user/:userId", getOrdersByUser);

// Get single order by ID
route.get("/:id", getOrderById);

// Update order status
route.put("/:id", updateOrderStatus);

// Delete order
route.delete("/:id", deleteOrder);

export default route;
