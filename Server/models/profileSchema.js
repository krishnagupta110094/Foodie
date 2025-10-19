const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    gender: {
      type: String,
      enum: ["male", "female", "other",null],
    },

    dateOfBirth: {
      type: Date,
    },

    bio: {
      type: String,
      maxlength: 250,
    },
    contactNumber: {
      type: Number,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);
