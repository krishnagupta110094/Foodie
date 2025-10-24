import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { editProfile } from "../services/operations/authAPI";
import { useNavigate } from "react-router-dom";

const MySetting = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    gender: "",
    dateOfBirth: "",
    contactNumber: "",
    bio: "",
  });
  const [originalData, setOriginalData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      const data = {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
        gender: user.additionDetails?.gender || "",
        dateOfBirth:
          user.additionDetails?.dateOfBirth &&
          user.additionDetails.dateOfBirth !== "null"
            ? user.additionDetails.dateOfBirth.split("T")[0]
            : "",
        contactNumber: user.additionDetails?.contactNumber || "",
        bio: user.additionDetails?.bio || "",
      };
      setFormData(data);
      setOriginalData(data);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
      toast.error("Contact Number must be exactly 10 digits");
      return;
    }

    const isChanged = Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    );

    if (!isChanged) {
      toast("No changes to apply");
      navigate("/dashboard/my-profile");
      return;
    }

    setLoading(true);
    const result = await dispatch(editProfile(token, formData));
    setLoading(false);

    if (result?.success) {
      toast.success(result.message || "Profile updated successfully");
      navigate("/dashboard/my-profile");
    } else {
      toast.error(result.message || "Failed to update profile");
    }
  };

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">My Settings</h2>

      {/* Grid: Form left, Instructions right */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* First Name & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  readOnly
                  className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  readOnly
                  className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                readOnly
                className="w-full border border-gray-300 px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Gender & DOB */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-1">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth || ""}
                  onChange={handleChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-gray-700 mb-1">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="block text-gray-700 mb-1">Bio</label>
              <textarea
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#195a00] text-white px-6 py-2 rounded hover:bg-[#157300] transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Instructions Panel */}
        <div className="bg-gray-50 p-4 rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>First Name, Last Name & Email cannot be changed.</li>
            <li>
              Update your Gender, Date of Birth, Contact Number, or Bio as
              needed.
            </li>
            <li>Click "Save Changes" after updating your information.</li>
            <li>
              If no fields are changed, a message will appear instead of
              updating.
            </li>
            <li>Make sure your contact number is valid and correct.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MySetting;
