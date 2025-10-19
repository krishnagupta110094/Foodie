const express = require("express");
const router = express.Router();
const { createPaymentOrder, verifyPayment } = require("../controllers/Payment");
const { auth } = require("../middlewares/auth");

router.post("/create-order", auth, createPaymentOrder);
router.post("/verify-payment", auth, verifyPayment);

module.exports = router;
