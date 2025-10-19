import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categoryEndpoints, dishEndpoints } from "../apis";

const { CREATE_CATEGORY_API, GET_CATEGORY_API } = categoryEndpoints;
const {GET_DISH_BY_CATEGORY} = dishEndpoints;

// ================= GET ALL CATEGORIES =================
export const getAllCategory = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_CATEGORY_API);

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch categories ❌");
    }

    result = response?.data?.categories || [];
    // toast.success("Categories fetched successfully ✅");
  } catch (error) {
    console.error("GET_CATEGORY_API ERROR............", error);
    toast.error(error.message || "Failed to fetch categories ❌");
    result = [];
  }
  return result;
};

// ================= GET DISHES BY CATEGORY =================
export const getDishByCategory = async (categoryName) => {
  let result = [];
  try {
    const response = await apiConnector(
      "GET",
      GET_DISH_BY_CATEGORY(categoryName)
    );

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch dishes ❌");
    }

    result = response?.data?.dishes || [];
    // toast.success(`Dishes for ${categoryName} fetched successfully ✅`);
  } catch (error) {
    console.error("GET_DISH_BY_CATEGORY ERROR............", error);
    toast.error(error.message || "Failed to fetch dishes ❌");
    result = [];
  }
  return result;
};
