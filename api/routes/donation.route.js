import express from "express";
import cors from "cors";
import { createDonation, getAllDonations, getDonationsByEmail } from "../Controllers/donationController.js";

const route = express.Router();
route.use(cors());

// Route to create a new donation
route.post("/", createDonation);

// Route to get all donations (for admin)
route.get("/", getAllDonations);

// Route to get donations by email
route.get("/email/:email", getDonationsByEmail);

export default route;