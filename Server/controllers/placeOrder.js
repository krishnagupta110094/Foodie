const Order = require("../models/orderSchema");
const User = require("../models/userSchema");
const Cart = require("../models/cartSchema");
const Restaurant = require("../models/restaurantSchema");
const PaymentHistory = require("../models/paymentHistorySchema"); // new model



exports.placeOrder = async (req, res) => {
  try {
    const customerId = req.user.id;
    const { restaurantId, items, subTotal, deliveryFee, totalPrice } = req.body;

    // 💰 Split payment logic
    const adminAmount = +(totalPrice * 0.3).toFixed(2);
    const restaurantAmount = +(totalPrice * 0.6).toFixed(2);
    const deliveryFeeAmount = +(totalPrice * 0.1).toFixed(2);

    // ✅ Create new order
    const newOrder = await Order.create({
      customer: customerId,
      restaurant: restaurantId,
      items,
      subTotal,
      deliveryFee,
      totalPrice,
      paymentSplit: {
        adminAmount,
        restaurantAmount,
        deliveryFeeAmount,
      },
      status: "pending",
    });

    // ✅ Add order reference to both sides
    await User.findByIdAndUpdate(
      customerId,
      {
        $push: { orders: newOrder._id },
      },
      { new: true }
    );
    await Restaurant.findByIdAndUpdate(
      restaurantId,
      { $push: { orders: newOrder._id } },
      { new: true }
    );

    // ✅ Clear user's cart
    const deletedCart = await Cart.findOneAndDelete({ user: customerId });

    if (deletedCart) {
      console.log("🗑 Cart removed successfully:", deletedCart._id);
    } else {
      console.log("⚠️ No cart found for user:", customerId);
    }

    // ✅ Optionally unset cart reference in User
    await User.findByIdAndUpdate(customerId, { $unset: { cart: 1 } });

    return res.status(200).json({
      success: true,
      message: "Order placed successfully & cart cleared!",
      order: newOrder,
    });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ success: false, message: "Order placement failed" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    console.error("Error updating order:", err);
    res.status(500).json({ success: false, message: "Status update failed" });
  }
};

// controllers/orderController.js
exports.getCustomerOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const orders = await Order.find({ customer: customerId })
      .populate("restaurant", "name")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

exports.getRestaurantOrders = async (req, res) => {
  try {
    const restaurantOwnerId = req.user.id;

    // Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({
      owner: restaurantOwnerId,
    }).select("_id");
    if (!restaurant) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Restaurant not found for this owner",
        });
    }

    // Fetch orders for this restaurant
    const orders = await Order.find({ restaurant: restaurant._id })
      .populate("restaurant", "name")
      .populate("customer", "firstName lastName email")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};



// ==================== Fetch Delivery Orders ====================
exports.getDeliveryOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;

    // Orders that are ready to dispatch (dispatching) or already assigned to this delivery boy (out-for-delivery)
    const orders = await Order.find({
      $or: [
        { status: "dispatching" },
        { status: "out-for-delivery", assignedDeliveryBoy: deliveryBoyId },
      ],
    })
      .populate("customer", "firstName lastName email")
      .populate("restaurant", "name")
      .populate("items.dish", "name price")
      .populate("assignedDeliveryBoy", "firstName lastName email")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("FETCH_DELIVERY_ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch delivery orders" });
  }
};

// ==================== Accept Order (Delivery Boy) ====================
exports.acceptOrder = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.status !== "dispatching") {
      return res.status(400).json({
        success: false,
        message: "Order is not ready for dispatch",
      });
    }

    // Assign delivery boy and update status
    order.assignedDeliveryBoy = deliveryBoyId;
    order.status = "out-for-delivery";

    await order.save();

    res.status(200).json({ success: true, message: "Order accepted", order });
  } catch (err) {
    console.error("ACCEPT_ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to accept order" });
  }
};

// ==================== Complete Order with OTP ====================


exports.completeOrder = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    if (order.assignedDeliveryBoy?.toString() !== deliveryBoyId) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    if (order.status !== "out-for-delivery") {
      return res.status(400).json({
        success: false,
        message: "Order is not in out-for-delivery status",
      });
    }

    if (!otp || otp.length === 0) {
      return res.status(400).json({ success: false, message: "OTP is required" });
    }

    // TODO: Verify OTP here
    // For now, assuming OTP is correct

    // ✅ Mark order as delivered
    order.status = "delivered";
    await order.save();

    // ✅ Handle payments
    const { paymentSplit } = order;

    // Payment to restaurant
    if (!paymentSplit.isPaidToRestaurant) {
      paymentSplit.isPaidToRestaurant = true;
      await PaymentHistory.create({
        order: order._id,
        recipientType: "restaurant",
        recipientId: order.restaurant,
        amount: paymentSplit.restaurantAmount,
      });
    }

    // Payment to delivery boy
    if (!paymentSplit.isPaidToDelivery) {
      paymentSplit.isPaidToDelivery = true;
      await PaymentHistory.create({
        order: order._id,
        recipientType: "deliveryBoy",
        recipientId: deliveryBoyId,
        amount: paymentSplit.deliveryFeeAmount,
      });
    }

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order delivered successfully, payments logged",
      order,
    });
  } catch (err) {
    console.error("COMPLETE_ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to complete order" });
  }
};

// controllers/orderController.js

// ✅ Get all completed orders for a delivery boy
exports.getCompletedDeliveryOrders = async (req, res) => {
  try {
    const deliveryBoyId = req.user.id;

    const orders = await Order.find({
      status: "delivered",
      assignedDeliveryBoy: deliveryBoyId,
    })
      .populate("customer", "firstName lastName email")
      .populate("restaurant", "name")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("FETCH_COMPLETED_DELIVERY_ORDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch completed orders",
    });
  }
};

exports.getCompletedRestaurantOrders = async (req, res) => {
  try {
    const restaurantOwnerId = req.user.id;

    // Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({ owner: restaurantOwnerId }).select("_id name");
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found for this owner",
      });
    }

    // Fetch completed orders for this restaurant
    const orders = await Order.find({
      restaurant: restaurant._id,
      status: "delivered", // only completed/delivered orders
    })
      .populate("customer", "firstName lastName email")
      .populate("items.dish", "name price")
      .sort({ createdAt: -1 });

    // Optionally, include restaurant earning in each order
    const ordersWithEarnings = orders.map((order) => ({
      ...order.toObject(),
      restaurantEarning: order.paymentSplit?.restaurantAmount || 0,
    }));

    res.status(200).json({
      success: true,
      restaurant: restaurant.name,
      orders: ordersWithEarnings,
    });
  } catch (err) {
    console.error("GET_COMPLETED_RESTAURANT_ORDERS ERROR:", err);
    res.status(500).json({ success: false, message: "Failed to fetch completed orders" });
  }
};


