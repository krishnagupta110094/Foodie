const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        dish: { type: mongoose.Schema.Types.ObjectId, ref: "Dish" },
        name: String,
        price: Number,
        quantity: Number,
      },
    ],
    subTotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    totalPrice: { type: Number, required: true },

    paymentSplit: {
      adminAmount: Number,
      restaurantAmount: Number,
      deliveryFeeAmount: Number,
      isPaidToRestaurant: { type: Boolean, default: false },
      isPaidToDelivery: { type: Boolean, default: false },
    },

    status: {
      type: String,
      enum: [
        "pending",
        "preparing",
        "dispatching",
        "out-for-delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending",
    },

    assignedDeliveryBoy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // deliveryBoy
      default: null,
    },
    otp: String, // Optional: for delivery confirmation
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
