import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { restaurantEndpoints } from "../apis";

const {
  CREATE_RESTAURANT,
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
  if (!restaurantId) {
    toast.error("Restaurant ID is required ❌");
    return null;
  }

  try {
    const response = await apiConnector(
      "GET",
      GET_RESTAURANT_BY_RESTAURANTID(restaurantId)
    );

    const { success, restaurant, message } = response?.data || {};

    if (!success || !restaurant) {
      toast.error(message || "Restaurant not found ❌");
      return null;
    }

    return restaurant;
  } catch (error) {
    // console.error("GET_RESTAURANT_BY_ID ERROR:", error);
    toast.error(error?.response?.data?.message);
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

export const createRestaurant = async (formData, token) => {
  try {
    // POST request to CREATE_RESTAURANT endpoint
    const toastId = toast.loading("Creating Restaurant...");
    const response = await apiConnector(
      "POST",
      CREATE_RESTAURANT,
      formData, // should be FormData object if sending images
      {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data", // required for images
      }
    );
    

    if (!response?.data?.success) {
      toast.dismiss(toastId);

      throw new Error(
        response?.data?.message || "Failed to create restaurant ❌"
      );
    }
    toast.dismiss(toastId);
    toast.success("Restaurant created successfully ✅");
    return response.data.restaurant;
  } catch (error) {
    console.error("CREATE_RESTAURANT ERROR:", error);
    toast.error(
      error.response?.data?.message ||
        error.message ||
        "Failed to create restaurant ❌"
    );
    return null;
  }
};
