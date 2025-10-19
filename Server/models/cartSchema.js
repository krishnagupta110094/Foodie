const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // ek user ka sirf ek cart hoga
    },

    items: [
      {
        dish: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Dish",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", cartSchema);

// const Cart = require("./Cart");

// async function addToCart(userId, dishId, quantity = 1) {
//   let cart = await Cart.findOne({ user: userId });

//   if (!cart) {
//     cart = await Cart.create({
//       user: userId,
//       items: [{ dish: dishId, quantity }],
//     });
//   } else {
//     const itemIndex = cart.items.findIndex(item => item.dish.toString() === dishId);

//     if (itemIndex > -1) {
//       cart.items[itemIndex].quantity += quantity;
//     } else {
//       cart.items.push({ dish: dishId, quantity });
//     }

//     await cart.save();
//   }

//   return cart;
// }
