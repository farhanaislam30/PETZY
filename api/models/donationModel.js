import mongoose from "mongoose";

const donationSchema = new mongoose.Schema({
  donorName: { type: String, required: true },
  donorEmail: { type: String, required: true },
  amount: { type: Number, required: true },
  message: { type: String, required: false, default: "" },
  paymentMethod: { type: String, required: true },
  transactionId: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "Completed" },
  timestamp: { type: Date, default: Date.now },
});

const Donation = mongoose.model("Donation", donationSchema);
export default Donation;