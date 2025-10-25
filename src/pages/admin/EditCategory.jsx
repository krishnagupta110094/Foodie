import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSingleCategory,
  updateCategory,
} from "../../services/operations/categoryAPI";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const EditCategory = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.auth);

  // Fetch category details
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const result = await getSingleCategory(categoryId);
        console.log(result, "RESULT");
        if (result?.success) {
          setFormData({
            name: result.category.name,
            description: result.category.description,
            image: null,
          });
          setPreview(result.category.image); // existing image preview
        }
      } catch (err) {
        console.error("Failed to fetch category:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [categoryId]);

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Submit update
  const handleSubmit = async (e) => {
    e.preventDefault();

    const updateData = new FormData();
    updateData.append("name", formData.name);
    updateData.append("description", formData.description);
    if (formData.image) updateData.append("image", formData.image);

    // Debug
    for (let [key, value] of updateData.entries()) {
      console.log(key, value);
    }

    const res = await updateCategory(categoryId, updateData, token);
    if (res?.success) {
      toast.success("Category updated successfully!");
      navigate("/dashboard/admin/manage-category");
    } else {
      toast.error(res?.message || "Failed to update category");
    }
  };

  if (loading) return <p className="mx-15 mt-10">Loading category...</p>;

  return (
    <div className="mx-4 md:mx-15 mt-10">
      <h2 className="text-xl md:text-3xl font-semibold mb-4">Edit Category</h2>

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 max-w-md bg-white p-6 rounded-xl shadow-md"
        encType="multipart/form-data"
      >
        <input
          type="text"
          name="name"
          placeholder="Enter Category Name"
          value={formData.name}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2"
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Enter Short Description"
          value={formData.description}
          onChange={handleChange}
          className="border border-gray-300 rounded-md p-2"
          required
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="border border-gray-300 rounded-md p-2"
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-md border"
          />
        )}

        <button
          type="submit"
          className="bg-[#195a00] text-white px-4 py-2 rounded-md hover:bg-[#217a00] transition-all duration-200"
        >
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
