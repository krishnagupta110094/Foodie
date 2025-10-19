import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 for eye toggle
import { useDispatch } from "react-redux";
import { sendOTP } from "../../../services/operations/authAPI";
import { setSignupData } from "../../../slices/authSlice";

const images = [
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759662078/FOODIECLOUD/hw41rzr6w9wleb4wjnaw.avif",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759724541/1_i1jtk8.png",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759661854/FOODIECLOUD/xf9ejxng9csmdgwuzf4f.avif",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759719686/delivery_epo1i1.jpg",
];

const Signup = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Auto image slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      accountType: "customer", // default selected
    },
  });

  const password = watch("password");

  // Form submission
  const onSubmit = async (data) => {
    console.log("Signup data:", data);
    dispatch(setSignupData(data));
    console.log("Dispatched data:", data);

    await sendOTP(data.email, navigate);

    reset(); // ✅ reset form after submission
  };

  return (
    <div className="flex flex-col md:flex-row mt-6 mx-10 gap-4  lg:mt-10 lg:mr-20 lg:ml-30">
      <div className="flex md:hidden w-full relative h-[250px] md:h-[500px] my-auto">
        <img
          src={images[currentImage]}
          alt="slider"
          className="w-full h-full object-contain transition-all duration-700 ease-in"
        />
      </div>
      {/* LEFT SIDE - FORM */}
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full bg-white rounded-2xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-6">
            Create Account ✨
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Account Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <select
                {...register("accountType", {
                  required: "Account type is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00] text-[#195A00] font-medium"
              >
                <option value="customer">Customer</option>
                <option value="restaurantOwner">Restaurant Owner</option>
                <option value="admin">Admin</option>
                <option value="deliveryBoy">Delivery Boy</option>
              </select>
              {errors.accountType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.accountType.message}
                </p>
              )}
            </div>

            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name
              </label>
              <input
                type="text"
                placeholder="Enter your first name"
                {...register("firstName", {
                  required: "First name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00]"
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Enter your last name"
                {...register("lastName", {
                  required: "Last name is required",
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00]"
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email format",
                  },
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* PASSWORD + CONFIRM PASSWORD in 2 COL */}
            <div className="grid grid-cols-2 gap-4">
              {/* Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00]"
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter password"
                  {...register("confirmPassword", {
                    required: "Please confirm password",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#195A00]"
                />
                <span
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-9 cursor-pointer text-gray-600"
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
                {errors.confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-[#195A00] text-white rounded-lg hover:bg-[#134400] transition-all duration-200"
            >
              Sign Up
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-[#195A00] font-medium cursor-pointer"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE SLIDER */}
      <div className="hidden md:flex w-1/2 relative h-[500px] my-auto">
        <img
          src={images[currentImage]}
          alt="slider"
          className="w-full h-full object-contain transition-all duration-700 ease-in"
        />
      </div>
    </div>
  );
};

export default Signup;
