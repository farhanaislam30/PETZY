import mongoose from "mongoose";

const donateSchema = new mongoose.Schema({
  name: String,
  age: Number,
  image: String,
  location: String,
  type: String,
  email: String,
  phone: String,
});

const Donate = mongoose.model("Donate", donateSchema);
export default Donate;
