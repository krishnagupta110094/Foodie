import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { dishEndpoints } from "../apis";

const { GET_ALL_DISHES, GET_DISH_BY_DISHID, DELETE_DISH } = dishEndpoints;

// ================= GET ALL DISHES =================
export const getAllDishes = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_ALL_DISHES);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch dishes ❌");
    }

    result = response?.data?.dishes || [];
    // toast.success("Dishes fetched successfully ✅");
  } catch (error) {
    console.error("GET_ALL_DISHES ERROR............", error);
    toast.error(error.message || "Failed to fetch dishes ❌");
    result = [];
  }
  return result;
};

export const getDishById = async (dishId) => {
  try {
    const response = await apiConnector("GET", GET_DISH_BY_DISHID(dishId));

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch dish ❌");
    }

    // API returns a single dish object
    return response?.data?.dish || null;
  } catch (error) {
    console.error("GET_DISH_BY_ID ERROR:", error);
    return null;
  }
};

export const deleteDish = (dishId, token) => {
  let result;
  return async (dispatch) => {
    const toastId = toast.loading("Deleting dish...");
    try {
      const response = await apiConnector("POST", DELETE_DISH(dishId), null, {
        Authorization: `Bearer ${token}`,
      });

      if (response?.data?.success) {
        toast.success("Dish deleted successfully!");
        result = response.data;
      } else {
        toast.error(response?.data?.message || "Failed to delete dish");
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
    toast.dismiss(toastId);
    return result;
  };
};
