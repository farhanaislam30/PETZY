import mongoose from "mongoose";

const customersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, required: false, default: "Rocket" },
  items: { type: Array, required: false, default: [] },
  total: { type: Number, required: false, default: 0 },
  notes: { type: String, required: false, default: "" },
  status: { type: String, required: false, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

const Customers = mongoose.model("customers", customersSchema);
export default Customers;
