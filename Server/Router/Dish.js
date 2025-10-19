const express = require("express");

const { auth, isRestaurantOwner } = require("../middlewares/auth");
const {
  createDish,
  updateDish,
  deleteDish,
  getAllDishes,
  getDishById,
  getDishesByCategory,
  
} = require("../controllers/Dish");

const router = express.Router();
require("dotenv").config();

router.post(
  "/restaurants/dishes/createDish",
  auth,
  isRestaurantOwner,
  createDish
);
router.post(
  "/restaurants/dishes/:dishId/updateDish",
  auth,
  isRestaurantOwner,
  updateDish
);
router.post(
  "/restaurants/dishes/:dishId/deleteDish",
  auth,
  isRestaurantOwner,
  deleteDish
);
router.get("/dishes", getAllDishes);
router.get("/dishes/:dishId", getDishById);
router.get("/categories/:categoryName/dishes", getDishesByCategory);

module.exports = router;
