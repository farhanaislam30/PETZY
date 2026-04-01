import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Doctor", 
    required: true 
  },
  doctorName: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    required: false, 
    default: "Pending" 
  },
  notes: { 
    type: String, 
    required: false, 
    default: "" 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  customerPhone: { 
    type: String, 
    required: false, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Appointment = mongoose.model("appointments", appointmentSchema);
export default Appointment;
