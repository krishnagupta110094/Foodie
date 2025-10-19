const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    image: {
      type: String, // Cloudinary URL ya local path
      default: "default-avatar.png",
    },

    additionDetails: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profile", // customer ya restaurant owner ki personal details
    },

    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant", // sirf restaurantOwner role wale ke liye valid
    },

    password: {
      type: String,
      required: true,
    },
    accountType: {
      type: String,
      enum: ["customer", "restaurantOwner", "admin", "deliveryBoy"],
      default: "customer",
    },

    status: {
      type: String,
      enum: ["active", "blocked", "deleted"],
      default: "active",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restauant",
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    // 🔹 Fields for Reset Password
    token: { type: String }, // reset token
    resetPasswordExpires: { type: Date }, // token expiration time
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
