import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, 
    required: true,
  },
  items: [
    {
      productName: {
        type: String,
        required: true,
      },
      productPrice: {
        type: Number,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      subtotal: {
        type: Number,
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  deliveryStatus: { 
    type: String,
    default:"pending"
    
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const orderModel = mongoose.model("Order", orderSchema);
export default orderModel;
