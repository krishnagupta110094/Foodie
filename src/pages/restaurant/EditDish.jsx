import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { apiConnector } from "../../services/apiConnector";
import { dishEndpoints } from "../../services/apis";
import { getAllCategory } from "../../services/operations/categoryAPI";
import { useNavigate, useParams } from "react-router-dom";

const { UPDATE_DISH, GET_DISH_BY_DISHID } = dishEndpoints;

const EditDish = () => {
  const { token } = useSelector((state) => state.auth);
  const [categories, setCategories] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [existingImage, setExistingImage] = useState(null);
  const { dishId } = useParams();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const watchImage = watch("image");

  // 🌄 Update preview if user uploads new image
  useEffect(() => {
    if (watchImage && watchImage[0]) {
      setPreview(URL.createObjectURL(watchImage[0]));
    }
  }, [watchImage]);

  // 📂 Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategory();
      setCategories(res || []);
    };
    fetchCategories();
  }, []);

  // 🍲 Fetch dish data by ID and prefill form
  useEffect(() => {
    const fetchDishData = async () => {
      try {
        setLoading(true);
        const response = await apiConnector(
          "GET",
          GET_DISH_BY_DISHID(dishId),
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );

        if (response?.data?.success) {
          const dish = response.data.dish;
          reset({
            name: dish.name,
            description: dish.description,
            price: dish.price,
            category: dish.category?._id,
          });
          setExistingImage(dish.image);
        } else {
          toast.error("Failed to load dish data");
        }
      } catch (error) {
        console.error("FETCH_DISH_ERROR:", error);
        toast.error("Error loading dish data");
      } finally {
        setLoading(false);
      }
    };

    fetchDishData();
  }, [dishId, token, reset]);

  // 📝 Handle Update
  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("price", data.price);
      formData.append("category", data.category);
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      const toastId = toast.loading("Updating dish...");
      const response = await apiConnector(
        "POST",
        UPDATE_DISH(dishId),
        formData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (response?.data?.success) {
        toast.dismiss(toastId);
        toast.success("Dish updated successfully!");
        navigate("/dashboard/my-dishes");
      } else {
        toast.dismiss(toastId);
        toast.error(response?.data?.message || "Failed to update dish ❌");
      }
    } catch (error) {
      console.error("UPDATE_DISH_ERROR:", error);
      toast.error("Something went wrong ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-x-10">
      {/* Left: Form */}
      <div className="flex-1 px-15 overflow-y-auto scrollbar-hide bg-white shadow-lg rounded-xl py-10">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Edit Dish</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Dish Name */}
          <div>
            <label className="block font-medium mb-1">Dish Name *</label>
            <input
              type="text"
              {...register("name", { required: "Dish name is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Enter dish name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              {...register("description")}
              rows="3"
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Write a short description"
            />
          </div>

          {/* Price */}
          <div>
            <label className="block font-medium mb-1">Price (₹) *</label>
            <input
              type="number"
              {...register("price", { required: "Price is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
              placeholder="Enter price"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">
                {errors.price.message}
              </p>
            )}
          </div>

          {/* Category */}
          <div>
            <label className="block font-medium mb-1">Category *</label>
            <select
              {...register("category", { required: "Category is required" })}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.category && (
              <p className="text-red-500 text-sm mt-1">
                {errors.category.message}
              </p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block font-medium mb-1">Dish Image</label>
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-green-500"
            />
            {(preview || existingImage) && (
              <img
                src={preview || existingImage}
                alt="Dish Preview"
                className="w-32 h-32 object-contain rounded-md mt-3 border border-gray-300"
              />
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="bg-green-700 text-white font-semibold px-6 py-2 rounded-md hover:bg-green-800 transition-all"
          >
            {loading ? "Updating..." : "Update Dish"}
          </button>
        </form>
      </div>

      {/* Right: Instructions */}
      <div className="w-80 mr-15 sticky top-10 h-[65vh] p-6 bg-white shadow-md rounded-xl">
        <h3 className="text-xl font-semibold mb-4 text-green-700">
          Edit Instructions
        </h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Update dish name, description, or price.</li>
          <li>Select a new category if needed.</li>
          <li>You may upload a new image (optional).</li>
          <li>Click "Update Dish" to save your changes.</li>
          <li>You’ll be redirected to “My Dishes” after update.</li>
        </ul>
      </div>
    </div>
  );
};

export default EditDish;
