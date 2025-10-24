import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { createRestaurant } from "../../services/operations/restaurantAPI";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "../../services/operations/authAPI";

const CreateRestaurantForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      address: "",
      images: [],
    },
  });

  const [previewUrls, setPreviewUrls] = useState([]);
  const { token } = useSelector((state) => state.auth);
  const images = watch("images") || [];
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    try {
      // Convert images + other fields into FormData
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("description", data.description);
      formData.append("address", data.address);
      data.images.forEach((file) => formData.append("images", file));

      const restaurant = await createRestaurant(formData, token); //passJWTtoken
      if (restaurant) {

        reset();
        setPreviewUrls([]);
        await dispatch(getUserDetails(token));
        
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Merge newly selected images with old ones
  const handleImageChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const existingFiles = watch("images") || [];
    const updatedFiles = [...existingFiles, ...newFiles];
    setValue("images", updatedFiles, { shouldValidate: true });
  };

  // ✅ Generate preview URLs whenever images change
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);

    // Cleanup old object URLs to avoid memory leaks
    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // ✅ Remove image from list
  const handleRemoveImage = (index) => {
    const updatedFiles = images.filter((_, i) => i !== index);
    setValue("images", updatedFiles, { shouldValidate: true });
  };

  return (
    <div className="pt-10 flex flex-col lg:flex-row items-center justify-center p-6 gap-8">
      {/* Left: Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white shadow-md lg:shadow-lg rounded-2xl p-8 w-full lg:w-1/2 max-w-lg"
      >
        <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-center mb-6 text-gray-800">
          🍴 Create Your Restaurant
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Restaurant Name
          </label>
          <input
            type="text"
            placeholder="Enter restaurant name"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            {...register("name", { required: "Restaurant name is required" })}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            rows="3"
            placeholder="Write a short description..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
          ></textarea>
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Address
          </label>
          <input
            type="text"
            placeholder="Enter restaurant address"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Images */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Upload Images
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images.message}</p>
          )}
          {images.length > 0 && (
            <p className="text-sm text-gray-500 mt-2">
              {images.length} image(s) selected
            </p>
          )}

          {/* ✅ Preview Thumbnails */}
          {previewUrls.length > 0 && (
            <div className="mt-4 grid grid-cols-3 gap-3">
              {previewUrls.map((url, index) => (
                <div
                  key={index}
                  className="relative w-full h-24 rounded-lg overflow-hidden border border-gray-300 group"
                >
                  <img
                    src={url}
                    alt={`Preview ${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-600 text-white text-xs rounded-full px-2 py-1 opacity-0 group-hover:opacity-100 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-[#195A00] hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-all"
        >
          Create Restaurant
        </button>
      </form>

      {/* Right: Instructions */}
      <div className="bg-white shadow-md rounded-2xl p-6 w-full max-w-lg lg:w-1/3 lg:max-w-sm">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          📋 Instructions
        </h3>
        <ul className="list-disc pl-5 text-gray-700 space-y-2 text-sm">
          <li>Enter your restaurant’s official name.</li>
          <li>Provide a short and engaging description (max 2–3 lines).</li>
          <li>Write the complete address with city and pincode.</li>
          <li>Upload at least one clear restaurant image.</li>
          <li>After submission, details will be reviewed and added.</li>
          <li>Make sure all fields are filled before submission.</li>
        </ul>
        <div className="mt-6 bg-green-50 p-3 rounded-lg text-green-700 text-sm border border-green-200">
          💡 <strong>Tip:</strong> Attractive photos and good descriptions help
          your restaurant stand out!
        </div>
      </div>
    </div>
  );
};

export default CreateRestaurantForm;
