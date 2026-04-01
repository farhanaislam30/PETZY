import express from "express";
import cors from "cors";
import { authenticateToken } from "../Utils/authMiddleware.js";
import { adminMiddleware } from "../Utils/adminMiddleware.js";
import { 
  getAllProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  getProductById 
} from "../Controllers/productController.js";

const router = express.Router();
router.use(cors());

// GET all products - public
router.get("/", getAllProducts);

// GET single product by ID - public
router.get("/:id", getProductById);

// POST create a new product - admin only
router.post("/", authenticateToken, adminMiddleware, createProduct);

// PUT update a product - admin only
router.put("/:id", authenticateToken, adminMiddleware, updateProduct);

// DELETE a product - admin only
router.delete("/:id", authenticateToken, adminMiddleware, deleteProduct);

export default router;
