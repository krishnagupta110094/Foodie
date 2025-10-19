import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { restaurantEndpoints } from "../apis";

const {
  GET_ALL_RESTAURANT,
  GET_RESTAURANT_BY_RESTAURANTID,
  GET_SIGNLE_RESTAURANT_DETAILS,
  UPDATE_RESTAURANT,
} = restaurantEndpoints;

// ================= GET ALL DISHES =================
export const getAllRestaurant = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_RESTAURANT);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Could not fetch restaurants ❌"
      );
    }

    result = response?.data?.restaurants || [];
    // toast.success("Dishes fetched successfully ✅");
  } catch (error) {
    console.error("GET_ALL_DISHES ERROR............", error);
    toast.error(error.message || "Failed to fetch dishes ❌");
    result = [];
  }
  return result;
};

export const getRestaurantById = async (restaurantId) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_RESTAURANT_BY_RESTAURANTID(restaurantId)
    );

    if (!response?.data?.success) {
      // If the API returned success: false
      const message =
        response?.data?.message || "Could not fetch restaurant by ID ❌";
      toast.error(message);
      return null;
    }

    const restaurant = response?.data?.restaurant || null;

    if (!restaurant) {
      toast.error("Restaurant not found ❌");
    }

    return restaurant;
  } catch (error) {
    console.error("GET_RESTAURANT_BY_ID ERROR:", error);
    toast.error(error.message || "Failed to fetch restaurant ❌");
    return null;
  }
};

export const getSingleRestaurantDetails = async (
  restaurantId,
  formData,
  token
) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_SIGNLE_RESTAURANT_DETAILS(restaurantId),
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message);
    }

    return response?.data?.restaurant;
  } catch (error) {
    console.log(
      "Error fetching single restaurant details:",
      error.response?.data?.message || error.message
    );
    return null;
  }
};

export const updateRestaurantDetails = async (
  restaurantId,
  formData,
  token
) => {
  try {
    const response = await apiConnector(
      "POST",
      UPDATE_RESTAURANT(restaurantId),
      formData,
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // important for images
      }
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Failed to update restaurant");
    }

    return response.data.restaurant;
  } catch (error) {
    console.error("Update restaurant error:", error);
    throw error; // propagate error to caller
  }
};
