import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // 👈 For toggle icons
import { login } from "../../../services/operations/authAPI";
import { useDispatch, useSelector } from "react-redux";
import { getUserCart } from "../../../services/operations/cartAPI";

const images = [
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759662078/FOODIECLOUD/hw41rzr6w9wleb4wjnaw.avif",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759724541/1_i1jtk8.png",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759661854/FOODIECLOUD/xf9ejxng9csmdgwuzf4f.avif",
  "https://res.cloudinary.com/daa5tuoh3/image/upload/v1759719686/delivery_epo1i1.jpg",
];

const Login = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
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
    reset,
    formState: { errors },
  } = useForm();

  // Form submission
  const onSubmit =async (data) => {
    console.log("Login data:", data);
    dispatch(login(data.email,data.password,navigate));
    reset(); // ✅ Reset form after submission

  };

  return (
    <div className="flex flex-col md:flex-row mx-6 mt-6 md:mx-10 md:gap-4 md:mt-0 lg:mt-10 lg:mr-20 lg:ml-30">
      <div className="flex md:hidden w-full mb-10 md:w-1/2 relative h-[250px] md:h-[500px] md:my-auto">
        <img
          src={images[currentImage]}
          alt="slider"
          className="w-full h-full object-contain transition-all duration-700 ease-in"
        />
      </div>
      {/* LEFT SIDE - FORM */}
      
      <div className="w-full md:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-6">
            Welcome Back 👋
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
              {/* 👁 Toggle Button */}
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-2 bg-[#195A00] text-white rounded-lg hover:bg-[#134400] transition-all duration-200"
            >
              Login
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            Don’t have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-[#195A00] font-medium cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - IMAGE SLIDER */}
      <div className="hidden md:flex w-full md:w-1/2 relative h-[250px] md:h-[500px] md:my-auto">
        <img
          src={images[currentImage]}
          alt="slider"
          className="w-full h-full object-contain transition-all duration-700 ease-in"
        />
      </div>
    </div>
  );
};

export default Login;
