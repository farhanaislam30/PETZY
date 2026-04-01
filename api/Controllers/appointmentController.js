import mongoose from "mongoose";
import Appointment from "../models/appointmentModel.js";

// Create a new appointment
export async function createAppointment(req, res) {
  try {
    const data = req.body;
    console.log("[appointmentController] Received appointment data:", JSON.stringify(data, null, 2));
    
    // Debug: Check doctorId type and value
    console.log("[appointmentController] DEBUG - doctorId:", data.doctorId, "- Type:", typeof data.doctorId);

    // Validate required fields
    const missingFields = [];
    if (!data.doctorId) missingFields.push("doctorId");
    if (!data.doctorName) missingFields.push("doctorName");
    if (!data.date) missingFields.push("date");
    if (!data.time) missingFields.push("time");
    if (!data.customerName) missingFields.push("customerName");
    if (!data.customerEmail) missingFields.push("customerEmail");
    
    if (missingFields.length > 0) {
      console.log("[appointmentController] ERROR - Missing required fields:", missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(", ")}`,
      });
    }
    
    // Convert string doctorId to ObjectId if needed
    let doctorIdValue = data.doctorId;
    if (typeof data.doctorId === 'string') {
      try {
        doctorIdValue = new mongoose.Types.ObjectId(data.doctorId);
        console.log("[appointmentController] DEBUG - Converted doctorId to ObjectId:", doctorIdValue);
      } catch (err) {
        console.log("[appointmentController] ERROR - Failed to convert doctorId:", err.message);
      }
    }
    
    const newAppointment = new Appointment({
      userId: data.userId || null,
      doctorId: doctorIdValue,
      doctorName: data.doctorName,
      date: data.date,
      time: data.time,
      status: "Pending",
      notes: data.notes || "",
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone || "",
    });

    const savedAppointment = await newAppointment.save();
    console.log("[appointmentController] Appointment saved successfully:", savedAppointment._id);

    res.status(201).json({
      success: true,
      appointment: savedAppointment,
      message: "Appointment booked successfully.",
    });
  } catch (error) {
    console.log("Error creating appointment: ", error);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// Get all appointments (admin)
export async function getAllAppointments(req, res) {
  try {
    const appointments = await Appointment.find()
      .populate('userId', 'name email phone address')
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.log("Error fetching appointments: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get appointments by user ID
export async function getAppointmentsByUser(req, res) {
  try {
    const { userId } = req.params;
    const appointments = await Appointment.find({ userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.log("Error fetching user appointments: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Get appointments by email
export async function getAppointmentsByEmail(req, res) {
  try {
    const { email } = req.params;
    const appointments = await Appointment.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json({
      success: true,
      appointments: appointments
    });
  } catch (error) {
    console.log("Error fetching user appointments: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Update appointment status
export async function updateAppointmentStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const appointment = await Appointment.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }
    
    res.json({
      success: true,
      appointment: appointment,
      message: "Appointment status updated"
    });
  } catch (error) {
    console.log("Error updating appointment status: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}

// Delete appointment
export async function deleteAppointment(req, res) {
  try {
    const { id } = req.params;
    const appointment = await Appointment.findByIdAndDelete(id);
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: "Appointment not found"
      });
    }
    
    res.json({
      success: true,
      message: "Appointment deleted successfully"
    });
  } catch (error) {
    console.log("Error deleting appointment: ", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
