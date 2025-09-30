import React from "react";
import { FaUserCircle } from "react-icons/fa";

export default function ButtonLog({ onClick }) {
  return (
    <button
      className="relative text-white px-4 py-1 rounded"
      onClick={onClick}
    >
      <FaUserCircle className="size-6" />
    </button>
  );
}
