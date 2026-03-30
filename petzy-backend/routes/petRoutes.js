import express from "express";
import cors from "cors";
import { showInterest } from "../Controllers/showInterestController.js";

const router = express.Router();
router.use(cors());

// Route to save pet interest
router.post("/", showInterest);

export default router;
