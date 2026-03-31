import express from "express";
import cors from "cors";
import { 
  createAppointment, 
  getAllAppointments, 
  getAppointmentsByUser,
  getAppointmentsByEmail,
  updateAppointmentStatus, 
  deleteAppointment 
} from "../Controllers/appointmentController.js";

const route = express.Router();
route.use(cors());

// Create a new appointment
route.post("/", createAppointment);

// Get all appointments (admin)
route.get("/", getAllAppointments);

// Get appointments by user ID
route.get("/user/:userId", getAppointmentsByUser);

// Get appointments by email
route.get("/email/:email", getAppointmentsByEmail);

// Update appointment status
route.put("/:id", updateAppointmentStatus);

// Delete appointment
route.delete("/:id", deleteAppointment);

export default route;
