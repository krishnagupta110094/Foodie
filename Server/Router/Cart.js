const express = require("express");
const { isCustomer, auth } = require("../middlewares/auth");
const { addToCart, getUserCart, removeFromCart, resetCart } = require("../controllers/Cart");
const router = express.Router();
require("dotenv").config();

router.get("/cart",auth,isCustomer,getUserCart);
router.post("/cart/addToCart",auth,isCustomer,addToCart);
router.post("/cart/:dishId/removeFromCart",auth,isCustomer,removeFromCart);
router.post("/cart/reset",auth,isCustomer,resetCart);



module.exports = router;