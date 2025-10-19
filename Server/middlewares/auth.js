const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    const token =
      req.cookies?.token ||
      req.body?.token ||
      (req.header("Authorization")
        ? req.header("Authorization").replace("Bearer ", "")
        : null);
    console.log(token, "tokkkenennn");
    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    }

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      console.log("decodeeeeeeeeeeeeeeeeeeee..........", decode);
      req.user = decode;
    } catch (err) {
      //verification - issue
      return res.status(401).json({
        success: false,
        message: "token is invalid",
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

// ["customer", "restaurantOwner", "admin", "deliveryBoy"],

//isCustomer
exports.isCustomer = async (req, res, next) => {
  try {
    if (req?.user?.accountType === "customer") {
      // User is customer, allow access
      return next();
    } else {
      // User is not customer
      return res.status(403).json({
        success: false,
        message: "Access denied. Only Customer allowed.",
      });
    }
  } catch (error) {
    console.error("isCustomer middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking permissions",
    });
  }
};

//isRestaurantOwner
exports.isRestaurantOwner = async (req, res, next) => {
  try {
    if (req?.user?.accountType === "restaurantOwner") {
      // User is restaurantOwner, allow access
      return next();
    } else {
      // User is not restaurantOwner
      return res.status(403).json({
        success: false,
        message: "Access denied. Only restaurant owners allowed.",
      });
    }
  } catch (error) {
    console.error("isRestaurantOwner middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking permissions",
    });
  }
};

//isAdmin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req?.user?.accountType === "admin") {
      // User is admin, allow access
      return next();
    } else {
      // User is not admin
      return res.status(403).json({
        success: false,
        message: "Access denied. Only admin users allowed.",
      });
    }
  } catch (error) {
    console.error("isAdmin middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking admin permissions",
    });
  }
};

//isDeliveryBoy
exports.isDeliveryBoy = async (req, res, next) => {
  try {
    if (req?.user?.accountType === "deliveryBoy") {
      // User is deliveryBoy, allow access
      return next();
    } else {
      // User is not deliveryBoy
      return res.status(403).json({
        success: false,
        message: "Access denied. Only delivery boys allowed.",
      });
    }
  } catch (error) {
    console.error("isDeliveryBoy middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while checking delivery boy permissions",
    });
  }
};
