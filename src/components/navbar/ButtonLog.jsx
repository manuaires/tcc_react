import React from "react";

export default function ButtonLog({ onClick }) {
  return (
    <button
      className="bg-[#044a23] text-white px-4 py-2 rounded hover:bg-[#056c34] transition-colors duration-300"
      onClick={onClick}
    >
      Login
    </button>
  );
}
