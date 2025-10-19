const Category = require("../models/categorySchema");
const Dish = require("../models/dishSchema");
const Restaurant = require("../models/restaurantSchema");
const { uploadToCloudinary } = require("../utils/UploadToCloudinary");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const imageFile = req?.files?.image;

    //validate fields
    if (!name || !description || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Please ENter ALl Fields",
      });
    }
    let imageUrl;
    try {
      const result = await uploadToCloudinary(
        imageFile,
        process.env.FOLDER_NAME,
        null,
        "auto"
      );
      imageUrl = result.secure_url;
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Image upload failed ❌",
        error: error.message,
      });
    }

    const category = await Category.create({
      name,
      description,
      image: imageUrl,
      dishes: [], // explicitly empty (not required, handled by default)
    });

    res.status(201).json({
      success: true,
      message: "Category created successfully",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 1️⃣ Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate({
        path: "dishes",
        populate: { path: "category", select: "name" } // populate category inside dishes
      });
    res.status(200).json({
      success: true,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 2️⃣ Update category
exports.updateCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const { name, description, status } = req.body;
    const imageFile = req?.files?.image;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    if (name) category.name = name;
    if (description) category.description = description;
    if (status) category.status = status;
    if (imageFile) {
      try {
        const result = await uploadToCloudinary(
          imageFile,
          process.env.FOLDER_NAME,
          null,
          "auto"
        );
        category.image = result?.secure_url;
      } catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({
          success: false,
          message: "Image upload failed ❌",
          error: error.message,
        });
      }
    }

    await category.save();

    res.status(200).json({
      success: true,
      message: "Category updated successfully ✅",
      category,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// 3️⃣ Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found ❌" });
    }

    // 1️⃣ find all dishes under this category
    const dishes = await Dish.find({ category: categoryId });

    // 2️⃣ remove each dish from its restaurant's dishes array
    for (const dish of dishes) {
      await Restaurant.findByIdAndUpdate(dish.restaurant, {
        $pull: { dishes: dish._id },
      });
    }

    // 3️⃣ delete all dishes under this category
    await Dish.deleteMany({ category: categoryId });

    // 4️⃣ delete the category
    await Category.findByIdAndDelete(categoryId);

    res.status(200).json({
      success: true,
      message: "Category and all its dishes deleted successfully ✅",
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
