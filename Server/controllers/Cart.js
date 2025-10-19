const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");
const Dish = require("../models/dishSchema");

// Add or update item in cart
exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dishId, quantity } = req.body;

    if (!dishId || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Dish ID and valid quantity are required",
      });
    }

    // ✅ Check if dish exists and is available
    const dish = await Dish.findById(dishId);
    console.log(dish, "dish step1");
    if (!dish || dish.status !== "available") {
      return res
        .status(404)
        .json({ success: false, message: "Dish not available" });
    }

    // ✅ Find user's cart
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      // 🆕 Create new cart ALWAYS
      cart = await Cart.create({
        user: userId,
        items: [{ dish: dishId, quantity }],
      });

      await User.findByIdAndUpdate(userId, { cart: cart._id });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.dish.toString() === dishId
      );

      if (itemIndex > -1) {
        // item already hai cart me bhai
        // Dish exists → update quantity (only if quantity > 1)
        if (quantity > 1) {
          cart.items[itemIndex].quantity = Number(quantity);
        }
        // else quantity === 1 and dish already exists → do nothing
        else {
          return res.status(400).json({
            success: false,
            message: "alreadyInCart",
          });
        }
      } else {
        // Dish not in cart → add it
        cart.items.push({ dish: dishId, quantity });
      }

      await cart.save();
    }

    // ✅ Populate after save to ensure dish details
    cart = await cart.populate({
      path: "items.dish",
      select: "name price image status",
      populate: [
        { path: "category", select: "name" },
        { path: "restaurant", select: "name" },
      ],
    });

    // ✅ Calculate totals
    let totalItems = 0;
    let subTotal = 0;
    let totalDeliveryFee = 0;

    cart.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.dish?.price) || 0;
      const deliveryFee = Number((0.1 * price).toFixed(2)); // 10% of price, rounded to 2 decimals

      totalItems += qty;
      subTotal += qty * price;
      totalDeliveryFee = Number(
        (totalDeliveryFee + qty * deliveryFee).toFixed(2)
      );
    });
    const totalPrice = subTotal + totalDeliveryFee;

    // ✅ Send response
    return res.status(200).json({
      success: true,
      message: "Cart updated successfully ✅",
      cart,
      totalItems,
      subTotal,
      totalDeliveryFee,
      totalPrice,
    });
  } catch (error) {
    console.error("❌ Error adding to cart:", error);
    res.status(500).json({
      success: false,
      message: response.data.message,
      error: error.message,
    });
  }
};

//get cart data
exports.getUserCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.dish",
      select: "name price image status",
      populate: [
        { path: "category", select: "name" },
        { path: "restaurant", select: "name" },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart is empty",
      });
    }

    // ✅ Calculate totals
    let totalItems = 0;
    let subTotal = 0;
    let totalDeliveryFee = 0;

    cart.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.dish?.price) || 0;
      const deliveryFee = Number((0.1 * price).toFixed(2)); // 10% of price, rounded to 2 decimals

      totalItems += qty;
      subTotal += qty * price;
      totalDeliveryFee = Number(
        (totalDeliveryFee + qty * deliveryFee).toFixed(2)
      );
    });
    const totalPrice = subTotal + totalDeliveryFee;

    res.status(200).json({
      success: true,
      cart,
      totalItems,
      subTotal,
      totalDeliveryFee,
      totalPrice,
    });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 3️⃣ Remove a dish from cart
exports.removeFromCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dishId } = req.params;

    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.dish",
      select: "name price image status",
      populate: [
        { path: "category", select: "name" },
        { path: "restaurant", select: "name" },
      ],
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Check if dish exists in cart
    const exists = cart.items.some(
      (item) => item.dish && item.dish._id.toString() === dishId
    );

    if (!exists) {
      return res.status(404).json({
        success: false,
        message: "Dish not found in cart",
      });
    }

    // Filter out the dish
    cart.items = cart.items.filter(
      (item) => item.dish._id.toString() !== dishId
    );

    await cart.save();

    // ✅ Recalculate total items & total price
    // ✅ Calculate totals
    let totalItems = 0;
    let subTotal = 0;
    let totalDeliveryFee = 0;

    cart.items.forEach((item) => {
      const qty = Number(item.quantity) || 0;
      const price = Number(item.dish?.price) || 0;
      const deliveryFee = Number((0.1 * price).toFixed(2)); // 10% of price, rounded to 2 decimals
      // 10% delivery fee per dish

      totalItems += qty;
      subTotal += qty * price;
      totalDeliveryFee = Number(
        (totalDeliveryFee + qty * deliveryFee).toFixed(2)
      );
    });
    const totalPrice = subTotal + totalDeliveryFee;

    res.status(200).json({
      success: true,
      message: "Dish removed from cart ✅",
      cart,
      totalItems,
      subTotal,
      totalDeliveryFee,
      totalPrice,
    });
  } catch (error) {
    console.error("Error removing dish:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// 4️⃣ Reset / empty cart
exports.resetCart = async (req, res) => {
  try {
    const userId = req.user.id;

    const cart = await Cart.findOneAndDelete({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    // Reset user's cart reference
    await User.findByIdAndUpdate(userId, { cart: null });

    res.status(200).json({
      success: true,
      message: "Cart deleted successfully ✅",
    });
  } catch (error) {
    console.error("Error resetting cart:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
