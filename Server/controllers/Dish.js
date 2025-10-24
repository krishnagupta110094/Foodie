// controllers/dishController.js
const Dish = require("../models/dishSchema");
const Restaurant = require("../models/restaurantSchema");
const Category = require("../models/categorySchema");
const { uploadToCloudinary } = require("../utils/UploadToCloudinary"); // adjust path

//controller to create dish
exports.createDish = async (req, res) => {
  try {
    const { restaurant, category, name, description, price } = req.body;
    const imageFile = req.files?.image;

    // validation
    if (!restaurant || !category || !name || !price || !imageFile) {
      return res.status(400).json({
        success: false,
        message: "Restaurant, category, name, price, and image are required",
      });
    }

    // 1️⃣ upload image to cloudinary
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

    // 2️⃣ create dish with uploaded image url
    const dish = await Dish.create({
      restaurant,
      category,
      name,
      description,
      price,
      image: imageUrl,
    });

    // 3️⃣ push dish into Restaurant & Category
    await Promise.all([
      Restaurant.findByIdAndUpdate(restaurant, {
        $addToSet: { dishes: dish._id },
      }),
      Category.findByIdAndUpdate(category, { $addToSet: { dishes: dish._id } }),
    ]);

    res.status(201).json({
      success: true,
      message: "Dish created and linked successfully ✅",
      dish,
    });
  } catch (error) {
    console.error("Error creating dish:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error ❌",
      error: error.message,
    });
  }
};

//controller to update dish
exports.updateDish = async (req, res) => {
  try {
    const { dishId } = req.params;
    const { restaurant, category, name, description, price, status } = req.body;
    const imageFile = req.files?.image;

    // 1️⃣ find dish
    let dish = await Dish.findById(dishId);
    if (!dish) {
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    }

    // 2️⃣ handle image upload (if new image provided)
    let imageUrl = dish.image; // keep old image by default
    if (imageFile) {
      const result = await uploadToCloudinary(
        imageFile,
        process.env.FOLDER_NAME,
        null,
        "auto"
      );
      imageUrl = result.secure_url;
    }

    // 3️⃣ check if restaurant or category changed → unlink old & link new
    if (restaurant && restaurant !== dish.restaurant.toString()) {
      await Restaurant.findByIdAndUpdate(dish.restaurant, {
        $pull: { dishes: dish._id },
      });
      await Restaurant.findByIdAndUpdate(restaurant, {
        $addToSet: { dishes: dish._id },
      });
      dish.restaurant = restaurant;
    }

    if (category && category !== dish.category.toString()) {
      await Category.findByIdAndUpdate(dish.category, {
        $pull: { dishes: dish._id },
      });
      await Category.findByIdAndUpdate(category, {
        $addToSet: { dishes: dish._id },
      });
      dish.category = category;
    }

    // 4️⃣ update other fields
    if (name) dish.name = name;
    if (description) dish.description = description;
    if (price) dish.price = price;
    if (status) dish.status = status;
    dish.image = imageUrl;

    // 5️⃣ save updated dish
    await dish.save();

    res.status(200).json({
      success: true,
      message: "Dish updated successfully ✅",
      dish,
    });
  } catch (error) {
    console.error("Error updating dish:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error ❌",
      error: error.message,
    });
  }
};

// controller to delete dish
exports.deleteDish = async (req, res) => {
  try {
    const { dishId } = req.params;

    // 1️⃣ find dish
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: "Dish not found ❌",
      });
    }

    // 2️⃣ unlink dish from Restaurant & Category
    await Promise.all([
      Restaurant.findByIdAndUpdate(dish.restaurant, {
        $pull: { dishes: dish._id },
      }),
      Category.findByIdAndUpdate(dish.category, {
        $pull: { dishes: dish._id },
      }),
    ]);

    // 3️⃣ delete dish
    await Dish.findByIdAndDelete(dishId);

    res.status(200).json({
      success: true,
      message: "Dish deleted successfully ✅",
    });
  } catch (error) {
    console.error("Error deleting dish:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error ❌",
      error: error.message,
    });
  }
};

//controller to get all dishes
//Return list of all dishes with Restaurant & Category populated.
//Useful for admin dashboard & customer menu view.
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find()
      .populate("restaurant", "name")
      .populate("category", "name");
    res.status(200).json({ success: true, dishes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Get single dish
//Return details of one dish by ID, including restaurant & category info.
exports.getDishById = async (req, res) => {
  try {
    //Make sure your routes match the params in controllers (:dishId, :categoryId, :restaurantId).
    const { dishId } = req.params;
    const dish = await Dish.findById(dishId)
      .populate("restaurant", "name")
      .populate("category", "name");
    if (!dish)
      return res
        .status(404)
        .json({ success: false, message: "Dish not found" });
    res.status(200).json({ success: true, dish });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//Get dishes by category
//Return all dishes under a specific category.
exports.getDishesByCategory = async (req, res) => {
  try {
    const { categoryName } = req.params;

    // Step 1: Find category by name
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    // Step 2: Find all dishes for this category
    const dishes = await Dish.find({ category: category._id })
      .populate("restaurant", "name")
      .populate("category", "name");

    res.status(200).json({
      success: true,
      category: category.name,
      totalDishes: dishes.length,
      dishes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Get dishes by restaurant
//Return all dishes for a specific restaurant.
// exports.getDishesByRestaurant = async (req, res) => {
//   try {
//     //Make sure your routes match the params in controllers (:dishId, :categoryId, :restaurantId).
//     const { restaurantId } = req.params;
//     const dishes = await Dish.find({ restaurant: restaurantId })
//       .populate("restaurant", "name")
//       .populate("category", "name");
//     res.status(200).json({ success: true, dishes });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };
//Get categories with dishes for a specific restaurant
// controllers/dishController.js


// ✅ Get categories with dishes for a specific restaurant
exports.getCategoriesWithDishesByRestaurant = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // 1️⃣ Validate restaurant existence
    const restaurant = await Restaurant.findById(restaurantId).select("name");
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found ❌",
      });
    }

    // 2️⃣ Find all dishes of that restaurant
    const dishes = await Dish.find({ restaurant: restaurantId })
      .populate("category") // populate category name directly
      .populate("restaurant", "name");

    if (!dishes.length) {
      return res.status(200).json({
        success: true,
        message: "No dishes found for this restaurant",
        restaurant: {
          _id: restaurant._id,
          name: restaurant.name,
          categories: [],
        },
      });
    }

    // 3️⃣ Group dishes by category
    const categoryMap = {};

    dishes.forEach((dish) => {
      const catId = dish.category?._id?.toString();
      if (!catId) return; // skip if category deleted or missing

      if (!categoryMap[catId]) {
        categoryMap[catId] = {
          category: dish.category, // { _id, name }
          dishes: [],
        };
      }

      categoryMap[catId].dishes.push(dish);
    });

    // 4️⃣ Convert grouped object to array
    const categoriesWithDishes = Object.values(categoryMap);

    // 5️⃣ Send formatted response
    res.status(200).json({
      success: true,
      message: "Categories with dishes fetched successfully ✅",
      restaurant: {
        _id: restaurant._id,
        name: restaurant.name,
        categories: categoriesWithDishes,
      },
    });
  } catch (error) {
    console.error("Error fetching categories with dishes:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error ❌",
      error: error.message,
    });
  }
};

