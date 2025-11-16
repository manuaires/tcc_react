// src/components/cart/SidebarProducts.jsx
import { FaXmark } from "react-icons/fa6";
import React from "react";

export default function SidebarProducts({ item, onRemove, onUpdateQty }) {
  const handleChange = (e) => {
    const newQty = parseInt(e.target.value, 10);
    if (!isNaN(newQty) && newQty >= 0) {
      onUpdateQty?.(item.id, newQty);
    }
  };

  return (
    <div className="flex w-full border-b border-gray-300 justify-between p-2 gap-2">
      <div className="flex gap-2 columns-1 text-sm">
        <button
          onClick={() => onRemove?.(item?.id)}
          className="bg-gray-800 hover:bg-red-700 text-white w-4 h-4 rounded-full flex items-center justify-center"
        >
          <FaXmark />
        </button>

        <div className="flex flex-col">
          <h4 className="font-semibold">{item?.nomeprod || "Produto"}</h4>
          {item?.weight && <span className="text-xs">{item.weight.label}</span>}
          <input
            type="number"
            min={1}
            max={10000}
            value={item?.quantity ?? 1}
            onChange={handleChange}
            className="border rounded py-0.5 px-1 w-15"
          />
        </div>
      </div>

      <div className="flex items-center">
        <img
          src={item?.imagem || "src/assets/produtos/image.png"}
          alt={item?.nomeprod || "produto"}
          className="h-16"
        />
      </div>
    </div>
  );
}
