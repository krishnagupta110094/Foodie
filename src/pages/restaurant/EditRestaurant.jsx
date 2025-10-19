import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { getSingleRestaurantDetails, updateRestaurantDetails } from "../../services/operations/restaurantAPI";
import { toast } from "react-hot-toast";

const EditRestaurant = () => {
  const { restaurantId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false); // For submit button
  const [previewImages, setPreviewImages] = useState([]);
  const [newFiles, setNewFiles] = useState([]); // new images selected by user
  const navigate = useNavigate();

  const { register, handleSubmit, setValue } = useForm();

  // Fetch restaurant data
  useEffect(() => {
    const fetchRestaurant = async () => {
      if (!restaurantId || !token) return;
      setLoading(true);
      const data = await getSingleRestaurantDetails(restaurantId, token);
      if (data) {
        setRestaurant(data);
        setValue("name", data.name || "");
        setValue("description", data.description || "");
        setValue("address", data.address || "");
        setPreviewImages(data.images || []);
      }
      setLoading(false);
    };
    fetchRestaurant();
  }, [restaurantId, token, setValue]);

  // Handle image selection
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews); // show previews
    setNewFiles(files); // store new files for submission
  };

  // Submit form
  const onSubmit = async (formData) => {
    setUpdating(true);
    try {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("description", formData.description);
      updatedData.append("address", formData.address);

      // Append new images if selected
      if (newFiles.length > 0) {
        newFiles.forEach((file) => updatedData.append("images", file));
      }

      await updateRestaurantDetails(restaurantId, updatedData, token);
      toast.success("Restaurant updated successfully!");
      navigate("/dashboard/restaurant-details");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update restaurant. Please try again!");
    }
    setUpdating(false);
  };

  if (loading) {
    return <p className="text-gray-500 text-center mt-20 text-lg">Loading restaurant data...</p>;
  }

  if (!restaurant) {
    return <p className="text-red-500 text-center mt-20 text-lg">Restaurant not found!</p>;
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-2xl">
      <h2 className="text-3xl font-bold mb-6 text-[#195A00] text-center">Edit Restaurant</h2>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left: Form */}
        <div className="lg:w-[65%]">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block font-semibold mb-2">Restaurant Name</label>
              <input
                {...register("name")}
                type="text"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#195A00]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Description</label>
              <textarea
                {...register("description")}
                rows={4}
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#195A00]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Address</label>
              <input
                {...register("address")}
                type="text"
                className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#195A00]"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">Upload Images</label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="mb-3 border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-[#195A00]"
              />
              <div className="flex gap-3 flex-wrap">
                {previewImages.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt="preview"
                    className="w-[40%] h-40 object-cover rounded-lg shadow-md"
                  />
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={updating}
              className={`bg-gradient-to-r from-[#195A00] to-[#4CAF50] text-white font-bold px-6 py-3 rounded-full shadow-lg hover:scale-105 transition transform duration-300 ${
                updating ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {updating ? "Updating..." : "Update Restaurant"}
            </button>
          </form>
        </div>

        {/* Right: Instructions */}
        <div className="lg:w-[35%] h-110 bg-[#F0FFF0] p-6 rounded-xl border border-[#195A00]">
          <h3 className="text-2xl font-semibold mb-4 text-[#195A00]">Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-3">
            <li>Update restaurant name carefully; it will reflect in all your listings.</li>
            <li>Provide a clear and engaging description so customers know what to expect.</li>
            <li>Ensure the address is accurate, including landmarks for easy delivery.</li>
            <li>Upload high-quality images; recommended size 800x600 px.</li>
            <li>You can upload multiple images. Existing images will remain unless replaced.</li>
            <li>Click "Update Restaurant" once all fields are filled correctly.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditRestaurant;
