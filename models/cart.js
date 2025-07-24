import mongoose from "mongoose";
const cartSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },

  items: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
      },
      quantity: {
        type: Number,
        default:1,
      },
    },
  ],
  Total: {
    type: Number,
    required: false,
  },
});

const cartModel = mongoose.model("cart", cartSchema);
export default cartModel;
