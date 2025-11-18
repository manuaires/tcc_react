import React from "react";

export default function Toast({ message, show }) {
  return (
    <div
      className={`
        fixed left-1/2 bottom-5 z-50
        transform -translate-x-1/2
        transition-all duration-300
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
      `}
    >
      <div className="bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg font-medium">
        {message}
      </div>
    </div>
  );
}
