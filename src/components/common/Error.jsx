import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center px-6">
      {/* Big 404 */}
      <h1 className="text-9xl font-extrabold text-[#195A00]">404</h1>

      {/* Error message */}
      <h2 className="mt-4 text-2xl md:text-3xl font-semibold text-gray-800">
        Oops! Page Not Found
      </h2>
      <p className="mt-2 text-gray-600 max-w-md">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>

      {/* Buttons */}
      <div className="mt-6 flex gap-4">
        <Link
          to="/"
          className="bg-[#195A00] text-white px-6 py-2 rounded-lg shadow-md hover:bg-green-700 transition"
        >
          Go Home
        </Link>
        <Link
          to="/contact"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg shadow-md hover:bg-gray-300 transition"
        >
          Contact Support
        </Link>
      </div>

      {/* Small foodie touch */}
      <p className="mt-10 text-sm text-gray-500">
        🍴 Foodie – Bringing food closer to you
      </p>
    </div>
  );
};

export default ErrorPage;
