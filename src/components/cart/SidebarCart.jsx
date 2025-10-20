import { FaXmark } from "react-icons/fa6";
import SidebarProducts from "./SidebarProducts.jsx";
import { IoSend } from "react-icons/io5";
import React, { useRef, useState, useEffect } from "react";

export default function SidebarCart({ isOpen, onClose, cartItems, removeFromCart, updateQuantity, clearCart }) {
	// estado/ref para suportar swipe-to-close no mobile
	const sidebarRef = useRef(null);
	const [dragging, setDragging] = useState(false);
	const [startX, setStartX] = useState(0);
	const [translateX, setTranslateX] = useState(0);
	const [sidebarWidth, setSidebarWidth] = useState(0);

	useEffect(() => {
		// reset quando abrir/fechar
		if (isOpen) {
			setTranslateX(0);
			// garante obter largura atual
			setSidebarWidth(sidebarRef.current?.offsetWidth || 0);
		} else {
			setTranslateX(0);
			setDragging(false);
		}
	}, [isOpen]);

	const handleTouchStart = (e) => {
		if (!isOpen) return;
		const touchX = e.touches[0].clientX;
		setStartX(touchX);
		setSidebarWidth(sidebarRef.current?.offsetWidth || 0);
		setDragging(true);
	};

	const handleTouchMove = (e) => {
		if (!dragging) return;
		const touchX = e.touches[0].clientX;
		const delta = touchX - startX; // positivo quando arrasta para a direita (fechar)
		if (delta <= 0) {
			// não permitir arrastar para dentro além do limite
			setTranslateX(0);
			return;
		}
		// limitar ao tamanho da sidebar
		const limited = Math.min(delta, sidebarWidth);
		setTranslateX(limited);
		// opcional: prevenir scroll vertical quando movimento horizontal significativo
		if (Math.abs(delta) > 10) e?.preventDefault?.();
	};

	const handleTouchEnd = () => {
		if (!dragging) return;
		setDragging(false);
		// se arrastou mais que 25% da largura, fechar
		if (translateX > sidebarWidth * 0.25) {
			// limpa estado de arrasto antes de fechar
			setTranslateX(0);
			onClose?.();
		} else {
			// voltar à posição original com animação
			setTranslateX(0);
		}
	};

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
        ref={sidebarRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`bg-white fixed right-0 top-0 z-50 w-full max-w-[400px] h-full p-8 shadow-[5px_5px_50px_rgba(0,0,0,0.5)] overflow-y-auto scrollbar-hide transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        // durante o arrasto aplicamos um transform inline (em px) e desabilitamos transição para seguir o dedo
        style={
          dragging
            ? { transform: `translateX(${translateX}px)`, transition: "none" }
            : undefined
        }
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


        {cartItems.length > 0 && (
          <button
            className="bg-green-700 hover:bg-green-800 text-white py-2 px-4 rounded w-full flex items-center justify-center gap-2 mt-2"
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
