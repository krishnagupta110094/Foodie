import React from "react";

const GWButton = ({ text, bgColor }) => {
  const baseClasses =
    "px-4 py-2 rounded-lg font-medium transition hover:opacity-80";

  // Green case -> filled
  if (bgColor === "#195A00") {
    return (
      <button
        className={`text-white ${baseClasses}`}
        style={{ backgroundColor: bgColor }}
      >
        {text}
      </button>
    );
  }

  // f5f5f5 case -> outlined style
  if (bgColor === "#f5f5f5") {
    return (
      <button
        className={`border-2 bg-transparent ${baseClasses}`}
        style={{ borderColor: "#195A00", color: "#195A00", backgroundColor: bgColor }}
      >
        {text}
      </button>
    );
  }

  // Default fallback (agar future me aur colors aa jaye)
  return (
    <button className={baseClasses} style={{ backgroundColor: bgColor }}>
      {text}
    </button>
  );
};

export default GWButton;
