const express = require("express");

const { auth, isAdmin } = require("../middlewares/auth");
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
} = require("../controllers/Category");
const router = express.Router();
require("dotenv").config();

router.post("/admin/categories/createCategory", auth, isAdmin, createCategory);
router.post("/admin/categories/:categoryId/updateCategory", auth, isAdmin, updateCategory);
router.post("/admin/categories/:categoryId/deleteCategory", auth, isAdmin, deleteCategory);
router.get("/categories", getAllCategories);

module.exports = router;
