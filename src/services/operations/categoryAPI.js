import { toast } from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categoryEndpoints, dishEndpoints } from "../apis";

const {
  CREATE_CATEGORY_API,
  DELETE_CATEGORY_API,
  GET_CATEGORY_API,
  UPDATE_CATEGORY_API,
  GET_SINGLE_CATEGORY_API,
} = categoryEndpoints;
const { GET_DISH_BY_CATEGORY } = dishEndpoints;

// ================= GET ALL CATEGORIES =================
export const getAllCategory = async () => {
  let result = [];
  try {
    const response = await apiConnector("GET", GET_CATEGORY_API);

    if (!response?.data?.success) {
      throw new Error(
        response?.data?.message || "Could not fetch categories ❌"
      );
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

export const deleteCategory = async (categoryId, token) => {
  const toastId = toast.loading("Deleting Category...");
  try {
    const response = await apiConnector(
      "POST",
      DELETE_CATEGORY_API(categoryId),
      null, // no body for delete request
      {
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("DELETE CATEGORY RESPONSE:", response);

    if (response?.data?.success) {
      return {
        success: true,
        message: response.data.message || "Category deleted successfully",
      };
    } else {
      return {
        success: false,
        message: response?.data?.message || "Failed to delete category",
      };
    }
  } catch (error) {
    console.error("DELETE CATEGORY ERROR:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Something went wrong while deleting category",
    };
  } finally {
    toast.dismiss(toastId);
  }
};

export const createCategory = async (categoryData, token) => {
  const toastId = toast.loading("Creating Category...");
  try {
    const response = await apiConnector(
      "POST",
      CREATE_CATEGORY_API,
      categoryData,
      {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      }
    );

    console.log("CREATE CATEGORY RESPONSE:", response);
    return response.data;
  } catch (error) {
    console.error("CREATE CATEGORY ERROR:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Something went wrong",
    };
  } finally {
    toast.dismiss(toastId);
  }
};

export const getSingleCategory = async (categoryId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      GET_SINGLE_CATEGORY_API(categoryId),
      null,
      { Authorization: `Bearer ${token}` }
    );
    return response?.data;
  } catch (error) {
    console.error("GET SINGLE CATEGORY ERROR:", error);
    return { success: false, message: "Failed to fetch category" };
  }
};


export const updateCategory = async (categoryId, data, token) => {
  const toastId = toast.loading("Loading...")
  try {
    console.log(data);
    const response = await apiConnector(
      "POST",
      UPDATE_CATEGORY_API(categoryId),
      data,
      {Authorization: `Bearer ${token}` }
    );
    return response.data;
  } catch (error) {
    console.error("UPDATE CATEGORY ERROR:", error);
    return { success: false, message: "Failed to update category" };
  }finally{
    toast.dismiss(toastId);
  }
};
