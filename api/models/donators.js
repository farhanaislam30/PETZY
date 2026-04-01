import mongoose from "mongoose";

const donateSchema = new mongoose.Schema({
  name: String,
  age: String,
  image: String,
  location: String,
  type: String,
  email: String,
  phone: String,
  reason: String,
});

const Donate = mongoose.model("Donate", donateSchema);
export default Donate;
