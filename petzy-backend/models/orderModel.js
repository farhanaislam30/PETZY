import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    default: null 
  },
  items: { 
    type: Array, 
    required: true, 
    default: [] 
  },
  totalAmount: { 
    type: Number, 
    required: true, 
    default: 0 
  },
  status: { 
    type: String, 
    required: false, 
    default: "Pending" 
  },
  shippingAddress: { 
    type: String, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    required: true 
  },
  customerName: { 
    type: String, 
    required: true 
  },
  customerPhone: { 
    type: String, 
    required: true 
  },
  customerEmail: { 
    type: String, 
    required: true 
  },
  notes: { 
    type: String, 
    required: false, 
    default: "" 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

const Order = mongoose.model("orders", orderSchema);
export default Order;
