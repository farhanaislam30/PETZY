import express from "express";
import cors from "cors";
import { showInterest, getPetInterestsByEmail } from "../Controllers/showInterestController.js";
import PetInterest from "../models/PetInterest.js";

const router = express.Router();
router.use(cors());

// Route to save pet interest
router.post("/", showInterest);

// Route to get all pet interests (for AdminPanel)
router.get("/", async (req, res) => {
  try {
    const interests = await PetInterest.find().sort({ timestamp: -1 });
    res.json(interests);
  } catch (error) {
    console.error("Error fetching interests:", error);
    res.status(500).json({ message: "Error fetching interests" });
  }
});

// Route to get pet interests by email
router.get("/email/:email", getPetInterestsByEmail);

export default router;
