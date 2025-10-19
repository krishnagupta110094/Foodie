const mongoose = require("mongoose");

const restaurantSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // sirf restaurantOwner
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true, //resto name
    },

    description: {
      type: String,
      maxlength: 500, //resto desc
    },

    images: [
      {
        type: String, // Cloudinary URL or local path
      },
    ],

    address: {
      type: String,
    },

    rating: {
      type: Number,
      default: 0, // dish ko rating ke time resto ko find krna hai and uske corresponding resto ke sabhi dish ki avg rating calcculate krke resto ki rating ko set krna hai
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "blocked"],
      default: "active",
    },
    dishes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dish" }], // ✅
  },
  { timestamps: true }
);

module.exports = mongoose.model("Restaurant", restaurantSchema);
