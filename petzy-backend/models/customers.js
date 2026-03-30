import mongoose from "mongoose";

const customersSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  payment: { type: String, required: false, default: "Rocket" },
});

const Customers = mongoose.model("customers", customersSchema);
export default Customers;
