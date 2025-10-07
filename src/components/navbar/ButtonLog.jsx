import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ButtonLog() {
  const navigate = useNavigate();
  return (
    <button
      className="relative text-white px-4 py-1 rounded"
      onClick={() => navigate("/login")}
    >
      <FaUserCircle className="size-6" />
    </button>
  );
}
