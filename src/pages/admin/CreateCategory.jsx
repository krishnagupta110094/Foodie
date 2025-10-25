import React, { useState } from "react";
import { createCategory } from "../../services/operations/categoryAPI";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const CreateCategory = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const { token } = useSelector((state) => state.auth);
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      setPreview(URL.createObjectURL(file));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // formData for image upload
    const categoryData = new FormData();
    categoryData.append("name", formData.name);
    categoryData.append("description", formData.description);
    categoryData.append("image", formData.image);

    const res = await createCategory(categoryData, token);
    if (res?.success) {
      toast.success("Category created successfully!");
      setFormData({ name: "", description: "", image: null });
      setPreview(null);
      navigate("/dashboard/admin/manage-category");
    } else {
      toast.error(res?.message);
      console.log(error?.message);
    }
  };

  return (
    <div className="mx-6 mt-10  md:mx-15 md:mt-10">
      <h2 className="text-xl md:text-3xl font-semibold mb-1 md:mb-4">Create New Category</h2>

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
          required
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
          className="bg-[#195a00] text-white px-4 py-2 rounded-md hover:bg-[#217a00]"
        >
          Create Category
        </button>
      </form>
    </div>
  );
};

export default CreateCategory;
