// src/components/Toast.jsx
import React from "react";

export default function Toast({ message, show, type = "success" }) {
  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    warning: "bg-yellow-500",
    info: "bg-blue-600",
  };

  return (
    <div
      className={`
        fixed bottom-6 left-1/2 -translate-x-1/2 z-50 
        transition-all duration-300 
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
      style={{ pointerEvents: "none" }}
    >
      <div
        className={`${colors[type]} text-white px-6 py-3 rounded-xl shadow-xl font-medium text-center`}
        style={{ minWidth: "260px" }}
      >
        {message}
      </div>
    </div>
  );
}
