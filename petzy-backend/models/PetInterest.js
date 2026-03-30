import mongoose from "mongoose";

const PetInterestSchema = new mongoose.Schema({
  petId: { type: Number, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  livingSituation: { type: String, required: true },
  experience: { type: String, required: true },
  otherPets: { type: String, required: false },
  timestamp: { type: Date, default: Date.now },
});

const PetInterest = mongoose.model("PetInterest", PetInterestSchema);
export default PetInterest;
