const mongoose = require("mongoose");

const dishSchema = new mongoose.Schema(
  {
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, maxlength: 300 },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["available", "unavailable", "discontinued"],
      default: "available",
    },
  },
  { timestamps: true }
);





module.exports = mongoose.model("Dish", dishSchema);
