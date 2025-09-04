import { FaXmark } from "react-icons/fa6";
import SidebarProducts from "./SidebarProducts.jsx";
import { IoSend } from "react-icons/io5";
import React from "react";

export default function SidebarCart({ isOpen, onClose, cartItems, removeFromCart, updateQuantity, clearCart }) {
     const total = cartItems.reduce((sum, item) => {
        const preco = parseFloat(item.preço?.split("-")[0]) || 0;
        return sum + preco * item.quantity;
    }, 0);
    return (
    <>
      {/* Fundo escuro quando aberto */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-40 z-40"
          onClick={onClose}
        ></div>
      )}

      {/* Sidebar em si */}
      <aside
        className={`bg-white fixed right-0 top-0 z-50 w-full max-w-[400px] h-full p-8 shadow-[5px_5px_50px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-hide transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between mb-4">
          <h1><b>Seu carrinho</b></h1>
          <button
            className="bg-gray-800 hover:bg-red-700 text-white w-7 h-7 rounded-full flex items-center justify-center"
            onClick={onClose}
          >
            <FaXmark />
          </button>
        </div>

           <div className="sidebar-products-list">
        {cartItems.length === 0 ? (
          <p className="text-gray-500">Seu carrinho está vazio.</p>
        ) : (
          cartItems.map((item) => (
            <SidebarProducts key={item.id} item={item} onRemove={removeFromCart} onUpdateQty={updateQuantity}/>
          ))
        )}
      </div>

        <div className="my-4">
          <b>Total:</b>  R$ {total.toFixed(2)}
        </div>

        {cartItems.length > 0 && (
          <button
            className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded w-full flex items-center justify-center gap-2"
            onClick={() => {
              // aqui você pode integrar com API futuramente
              alert("Pedido enviado com sucesso!");
              clearCart(); // esvazia carrinho
              onClose();   // fecha sidebar
            }}
          >
            Enviar Pedido <IoSend />
          </button>
        )}

      </aside>
    </>
  );
}
