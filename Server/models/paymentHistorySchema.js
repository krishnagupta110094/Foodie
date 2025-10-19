const mongoose = require("mongoose");

const paymentHistorySchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
  recipientType: { type: String, enum: ["restaurant", "deliveryBoy", "admin"] },
  recipientId: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: "recipientType",
  },
  amount: Number,
  paidAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentHistory", paymentHistorySchema);
