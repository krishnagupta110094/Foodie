import React, { useState, useEffect } from "react";

const ContactUs = ({ title = "Page", message }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] space-y-4">
        <div
          className="w-16 h-16 border-4 rounded-full animate-spin"
          style={{
            borderTopColor: "#195a00",
            borderRightColor: "transparent",
            borderBottomColor: "#195a00",
            borderLeftColor: "transparent",
          }}
        ></div>
        <p className="text-lg font-medium text-gray-700">
          Loading {title}...
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-5xl font-extrabold mb-4" style={{ color: "#195a00" }}>
        ⚡ {title} Coming Soon
      </h1>
      <p className="text-gray-600 max-w-md mb-8">
        {message || "This section is under development. Stay tuned for updates!"}
      </p>

      {/* Animated placeholders */}
      <div className="flex flex-col space-y-4 w-full max-w-md">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-16 rounded-lg shadow-md animate-pulse"
            style={{ backgroundColor: "#195a0033" }}
          ></div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 mt-8">
        <button
          onClick={() => window.history.back()}
          className="px-6 py-2 font-semibold rounded-lg shadow-md text-white bg-gray-700 hover:bg-gray-800 transition-all"
        >
          🔙 Go Back
        </button>
        <button
          onClick={() => window.location.href = "/"}
          className="px-6 py-2 font-semibold rounded-lg shadow-md text-white"
          style={{ backgroundColor: "#195a00" }}
        >
          🏠 Home
        </button>
      </div>
    </div>
  );
};

export default ContactUs;
