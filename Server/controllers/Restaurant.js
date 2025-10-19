const Dish = require("../models/dishSchema");
const Category = require("../models/categorySchema");
const Restaurant = require("../models/restaurantSchema");
const User = require("../models/userSchema");
const { uploadToCloudinary } = require("../utils/UploadToCloudinary");

// ✅ Create Restaurant Controller
exports.createRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, description ,address} = req.body;
    let imageFiles = [];

    // Check if req.files exists
    if (req?.files) {
      if (Array.isArray(req?.files?.images)) {
        // multiple files
        imageFiles = req?.files?.images;
      } else if (req?.files?.images) {
        // single file
        imageFiles = [req?.files?.images];
      }
    } // assume tu multer ya similar middleware use kar raha hai

    // validation
    if (!name || !description || !address || !imageFiles || imageFiles.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Restaurant Name,Address, Description and at least one Image is required",
      });
    }

    // check if owner already has a restaurant (optional)
    const existing = await Restaurant.findOne({ owner: ownerId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already created a restaurant",
      });
    }

    // upload all images to Cloudinary
    let imageUrls = [];
    try {
      for (const file of imageFiles) {
        const result = await uploadToCloudinary(
          file,
          process.env.FOLDER_NAME,
          null,
          "auto"
        );
        imageUrls.push(result.secure_url);
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed ❌",
        error: err.message,
      });
    }

    // create new restaurant
    const restaurant = await Restaurant.create({
      owner: ownerId,
      name,
      description,
      address,
      images: imageUrls, // array of URLs
    });
    await User.findByIdAndUpdate(
      ownerId,
      { restaurant: restaurant?._id },
      { new: true }
    );

    res.status(201).json({
      success: true,
      message: "Restaurant created successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error creating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create restaurant",
      error: error.message,
    });
  }
};

// Update Restaurant
exports.updateRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.id; // from auth middleware
    const { restaurantId } = req.params; // restaurant id
    const { name, description ,address } = req.body;
    // const imageFiles = req?.files?.images;
    let imageFiles = [];

    // Check if req.files exists
    if (req?.files) {
      if (Array.isArray(req?.files?.images)) {
        // multiple files
        imageFiles = req?.files?.images;
      } else if (req?.files?.images) {
        // single file
        imageFiles = [req?.files?.images];
      }
    }
    console.log("ur1", imageFiles); // multiple images from front-end

    // find the restaurant belongs to the owner
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: ownerId,
    });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you are not authorized",
      });
    }

    // update fields
    if (name) restaurant.name = name;
    if (description) restaurant.description = description;
    if (address) restaurant.address = address;


    // upload new images if provided
    if (imageFiles && imageFiles?.length > 0) {
      let imageUrls = [];
      try {
        for (const file of imageFiles) {
          const result = await uploadToCloudinary(
            file,
            process.env.FOLDER_NAME,
            null,
            "auto"
          );
          imageUrls.push(result.secure_url);
          console.log("ur2", imageUrls);
        }
        // append new images to existing ones
        restaurant.images = [...restaurant.images, ...imageUrls];
        console.log("ur3", restaurant);
      } catch (err) {
        console.error("Cloudinary upload error:", err);
        return res.status(500).json({
          success: false,
          message: "Image upload failed ❌",
          error: err.message,
        });
      }
    }

    await restaurant.save();

    res.status(200).json({
      success: true,
      message: "Restaurant updated successfully",
      restaurant,
    });
  } catch (error) {
    console.error("Error updating restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update restaurant",
      error: error.message,
    });
  }
};

// Delete Restaurant Controller

exports.deleteRestaurant = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { restaurantId } = req.params; // restaurant id

    // 1️⃣ Find the restaurant owned by this user
    const restaurant = await Restaurant.findOne({
      _id: restaurantId,
      owner: ownerId,
    });
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found or you are not authorized",
      });
    }

    // 2️⃣ Get all dishes linked to this restaurant
    const dishes = await Dish.find({ restaurant: restaurant._id });

    // 3️⃣ Remove dish references from their categories
    for (let dish of dishes) {
      await Category.findByIdAndUpdate(dish.category, {
        $pull: { dishes: dish._id },
      });
    }

    // 4️⃣ Delete all dishes of this restaurant
    await Dish.deleteMany({ restaurant: restaurant._id });

    // 5️⃣ Remove restaurant reference from the owner user
    await User.findByIdAndUpdate(ownerId, { $unset: { restaurant: "" } });

    // 6️⃣ Finally delete the restaurant
    await restaurant.deleteOne();

    res.status(200).json({
      success: true,
      message:
        "Restaurant, its dishes, category references, and user reference deleted successfully ✅",
    });
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete restaurant",
      error: error.message,
    });
  }
};

// Get all restaurants (for customer or admin view)
exports.getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({ status: "active" }) // optional filter
      .populate({
        path: "dishes",
        populate: { path: "category", select: "name" }, // populate category name
      })
      .populate("owner", "firstName lastName email ");

    // calculate average rating for each restaurant based on its dishes
    const restaurantsWithRating = restaurants.map((resto) => {
      let avgRating = 0;
      if (resto.dishes.length > 0) {
        const sum = resto.dishes.reduce((acc, dish) => acc + dish.rating, 0);
        avgRating = sum / resto.dishes.length;
      }
      return {
        ...resto.toObject(),
        rating: avgRating.toFixed(1), // optional: 1 decimal place
      };
    });

    res.status(200).json({ success: true, restaurants: restaurantsWithRating });
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single restaurant by ID (with dishes & categories)
exports.getRestaurantById = async (req, res) => {
  try {
    const { restaurantId } = req.params;

    // ✅ Validate input
    if (!restaurantId) {
      return res.status(400).json({
        success: false,
        message: "Restaurant ID is required",
      });
    }

    // ✅ Fetch restaurant and populate dishes + their categories
    const restaurant = await Restaurant.findById(restaurantId).populate({
      path: "dishes",
      populate: { path: "category", select: "name" },
    });

    // ✅ Handle not found case
    if (!restaurant) {
      return res.status(404).json({
        success: false,
        message: "Restaurant not found",
      });
    }

    // ✅ Calculate average rating safely
    let avgRating = 0;
    if (restaurant.dishes?.length > 0) {
      const ratedDishes = restaurant.dishes.filter((dish) => dish.rating);
      const totalRatings = ratedDishes.reduce((sum, dish) => sum + dish.rating, 0);
      avgRating = ratedDishes.length > 0 ? totalRatings / ratedDishes.length : 0;
    }

    // ✅ Prepare clean response object
    const restaurantWithRating = {
      ...restaurant.toObject(),
      rating: avgRating.toFixed(1),
    };

    return res.status(200).json({
      success: true,
      restaurant: restaurantWithRating,
    });
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch restaurant details",
      error: error.message,
    });
  }
};


// controllers/fixUsersController.js
// const User = require("../models/userSchema");
// const Restaurant = require("../models/restaurantSchema");

// ✅ Fix existing users' restaurant field
// controllers/fixUsersController.js
// const User = require("../models/userSchema");
// const Restaurant = require("../models/restaurantSchema");

// ✅ Fix existing users' restaurant field (safe with cart issue)
exports.fixExistingUsersRestaurant = async (req, res) => {
  try {
    const restaurants = await Restaurant.find({}); // saare restaurants

    let updatedCount = 0;

    for (const resto of restaurants) {
      const ownerId = resto.owner;

      const user = await User.findById(ownerId);

      if (user && user.accountType === "restaurantOwner" && !user.restaurant) {
        user.restaurant = resto._id;

        // ignore validation errors (like cart being [])
        await user.save({ validateBeforeSave: false });
        updatedCount++;
      }
    }

    res.status(200).json({
      success: true,
      message: `Users updated successfully ✅ Total updated: ${updatedCount}`,
    });
  } catch (error) {
    console.error("Error fixing users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fix users",
      error: error.message,
    });
  }
};
