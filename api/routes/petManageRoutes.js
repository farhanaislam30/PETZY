import express from "express";
import cors from "cors";
import { authenticateToken } from "../Utils/authMiddleware.js";
import { adminMiddleware } from "../Utils/adminMiddleware.js";
import { 
  getAllPets, 
  createPet, 
  updatePet, 
  deletePet,
  getPetById 
} from "../Controllers/petController.js";

const router = express.Router();
router.use(cors());

// GET all pets - public
router.get("/", getAllPets);

// GET single pet by ID - public
router.get("/:id", getPetById);

// POST create a new pet - admin only
router.post("/", authenticateToken, adminMiddleware, createPet);

// PUT update a pet - admin only
router.put("/:id", authenticateToken, adminMiddleware, updatePet);

// DELETE a pet - admin only
router.delete("/:id", authenticateToken, adminMiddleware, deletePet);

export default router;
