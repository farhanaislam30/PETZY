import mongoose from "mongoose";

const PetInterestSchema = new mongoose.Schema({
  petId: { type: mongoose.Schema.Types.Mixed, required: true },
  petName: { type: String, required: false, default: "" },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  livingSituation: { type: String, required: true },
  experience: { type: String, required: true },
  otherPets: { type: String, required: false },
  status: { type: String, required: false, default: "Pending", enum: ["Pending", "Approved", "Rejected"] },
  timestamp: { type: Date, default: Date.now },
});

const PetInterest = mongoose.model("PetInterest", PetInterestSchema);
export default PetInterest;
