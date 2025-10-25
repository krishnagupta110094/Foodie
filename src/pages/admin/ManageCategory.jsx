import React, { useEffect, useState } from "react";
import {
  deleteCategory,
  getAllCategory,
} from "../../services/operations/categoryAPI";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);

  // Fetch all categories
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const result = await getAllCategory();
        if (result && Array.isArray(result)) {
          setCategories(result);
        } else {
          setError("No categories found.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Failed to load categories.");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, []);

  // Delete category handler
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      const res = await deleteCategory(id, token);
      if (res?.success) {
        toast.success("Category Deleted Successfully!");
        setCategories((prev) => prev.filter((cat) => cat._id !== id));
      } else {
        toast.error(res?.message);
      }
    }
  };

  // Navigate to edit page
  const handleEdit = (id) => {
    navigate(`/dashboard/admin/edit-category/${id}`);
  };

  return (
    <div className="mx-2 mt-10 md:mx-10 md:mt-10">
      <h2 className="text-xl md:text-3xl font-semibold mb-6 text-gray-800">
        Manage Categories
      </h2>

      {loading ? (
        <p className="text-gray-600">Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <div className="">
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">
                  #
                </th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">
                  Category Name
                </th>
                <th className="py-3 px-6 text-left text-gray-700 font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat, index) => (
                <tr key={cat._id} className="border-t hover:bg-gray-50">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6 font-medium text-gray-800">
                    {cat?.name}
                  </td>
                  <td className="py-3 px-6 flex space-x-3">
                    <button
                      onClick={() => handleEdit(cat._id)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <FiEdit className="md:hidden" />{" "}
                      {/* icon visible on small screens */}
                      <span className="hidden md:inline">Edit</span>{" "}
                      {/* text visible on md+ */}
                    </button>
                    <button
                      onClick={() => handleDelete(cat._id, token)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                    >
                      <FiTrash2 className="md:hidden" />{" "}
                      {/* icon visible on small screens */}
                      <span className="hidden md:inline">Delete</span>{" "}
                      {/* text visible on md+ */}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageCategory;
