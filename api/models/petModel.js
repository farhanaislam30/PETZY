import mongoose from "mongoose";
const { Schema } = mongoose;

const petSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  breed: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    type: String,
  },
  status: {
    type: String,
    enum: ['available', 'adopted'],
    default: 'available'
  },
  address: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const Pet = mongoose.model("Pet", petSchema);
export default Pet;
