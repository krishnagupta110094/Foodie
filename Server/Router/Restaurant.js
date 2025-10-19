const express = require("express");

const { auth, isRestaurantOwner } = require("../middlewares/auth");
const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllRestaurants,
  getRestaurantById
  
} = require("../controllers/Restaurant");
const { getCategoriesWithDishesByRestaurant } = require("../controllers/Dish");

const router = express.Router();
require("dotenv").config();

router.post(
  "/restaurants/createRestaurant",
  auth,
  isRestaurantOwner,
  createRestaurant
);
router.post(
  "/restaurants/:restaurantId/updateRestaurant",
  auth,
  isRestaurantOwner,
  updateRestaurant
);
router.post(
  "/restaurants/:restaurantId/deleteRestaurant",
  auth,
  isRestaurantOwner,
  deleteRestaurant
);
router.get("/restaurants", getAllRestaurants);
router.get("/restaurants/:restaurantId", getRestaurantById);

router.get("/restaurant/:restaurantId", getCategoriesWithDishesByRestaurant);



module.exports = router;
