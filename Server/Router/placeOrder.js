const express = require("express");
const { isCustomer, auth, isRestaurantOwner, isDeliveryBoy } = require("../middlewares/auth");
const {
  placeOrder,
  updateOrderStatus,
  getCustomerOrders,
  getRestaurantOrders,
  getDeliveryOrders,
  acceptOrder,
  completeOrder,
  getCompletedDeliveryOrders,
  getCompletedRestaurantOrders,
} = require("../controllers/placeOrder");
const router = express.Router();
require("dotenv").config();

// Customer places an order
router.post("/place-order", auth, isCustomer, placeOrder);

// RestaurantOwner updates order status
router.post(
  "/update-status/:orderId",
  auth,
  isRestaurantOwner,
  updateOrderStatus
);

//getCustomer Orders
router.get("/get-customer-orders", auth, isCustomer, getCustomerOrders);

//getRestaurant Orders
// GET all orders for restaurant
router.get(
  "/get-restaurant-orders",
  auth,
  isRestaurantOwner,
  getRestaurantOrders
);

// Get orders for delivery boy
router.get("/get-delivery-orders", auth, isDeliveryBoy ,getDeliveryOrders);

// Accept order
router.post("/accept-order", auth, isDeliveryBoy,  acceptOrder);

// Complete order with OTP
router.post("/complete-order", auth, isDeliveryBoy, completeOrder);

router.get("/completed-delivery-orders",auth,isDeliveryBoy ,getCompletedDeliveryOrders);

router.get("/completed-restaurant-orders",auth,isRestaurantOwner,getCompletedRestaurantOrders);
module.exports = router;
