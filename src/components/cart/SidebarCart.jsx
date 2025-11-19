// src/components/cart/SidebarCart.jsx
import React, { useEffect, useState, useRef } from "react";
import SidebarProducts from "./SidebarProducts";
import { IoSend, IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

export default function SidebarCart() {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const [mounted, setMounted] = useState(false);
  const ANIM_DURATION = 300;

  const asideRef = useRef(null);

  const [isActive] = useState(() => {
    if (typeof window === "undefined") return true;
    if (window.__SIDEBAR_CART_MOUNTED) {
      return false;
    }
    window.__SIDEBAR_CART_MOUNTED = true;
    return true;
  });

  useEffect(() => {
    return () => {
      if (isActive && typeof window !== "undefined") {
        window.__SIDEBAR_CART_MOUNTED = false;
      }
    };
  }, [isActive]);

  const loadCart = () => {
    try {
      const raw = localStorage.getItem("cart_v1");
      const arr = raw ? JSON.parse(raw) : [];
      setCart(Array.isArray(arr) ? arr : []);
    } catch {
      setCart([]);
    }
  };

  const saveCart = (nextCart) => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(nextCart));
      setCart(nextCart);
      window.dispatchEvent(new Event("cart_v1:updated"));
    } catch {}
  };

  useEffect(() => {
    if (!isActive) return;

    loadCart();

    const onStorage = (e) => {
      if (e.key === "cart_v1") loadCart();
    };
    const handlerUpdated = () => loadCart();

    const handlerOpen = () => {
      setMounted(true);
      const t = setTimeout(() => setIsOpen(true), 10);
      return () => clearTimeout(t);
    };

    window.addEventListener("storage", onStorage);
    window.addEventListener("cart_v1:updated", handlerUpdated);
    window.addEventListener("cart:open", handlerOpen);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart_v1:updated", handlerUpdated);
      window.removeEventListener("cart:open", handlerOpen);
    };
  }, [isActive]);

  useEffect(() => {
    if (!mounted) return;
    if (isOpen) return;
    const t = setTimeout(() => setMounted(false), ANIM_DURATION);
    return () => clearTimeout(t);
  }, [isOpen, mounted]);

  useEffect(() => {
    if (!isActive || !isOpen) return;

    const onDocClick = (e) => {
      if (asideRef.current && !asideRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [isActive, isOpen]);

  const removeItem = (id) => {
    const next = cart.filter((it) => it.id !== id);
    saveCart(next);
  };

  const updateQuantity = (id, quantity) => {
    const q = Math.max(0, Number(quantity) || 0);
    const next = cart.map((it) => (it.id === id ? { ...it, quantity: q } : it));
    saveCart(next);
  };

  const clearCart = () => {
    saveCart([]);
  };

  if (!isActive) return null;

  return (
    <>
      {mounted && (
        <aside
          ref={asideRef}
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: 360,
            height: "100vh",
            background: "#fff",
            boxShadow: "-12px 0 24px rgba(0,0,0,0.12)",
            zIndex: 1300,
            display: "flex",
            flexDirection: "column",
            transform: isOpen ? "translateX(0)" : "translateX(100%)",
            opacity: isOpen ? 1 : 0,
            transition: `transform ${ANIM_DURATION}ms ease, opacity ${ANIM_DURATION}ms ease`,
            pointerEvents: isOpen ? "auto" : "none",
          }}
          aria-live="polite"
          aria-hidden={!isOpen}
        >
          {/* TOPO */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "16px 16px 8px 16px",
            }}
          >
            <h3 style={{ margin: 0 }}>Seu carrinho</h3>

            {/* botão fechar */}
            <button
              onClick={() => setIsOpen(false)}
              title="Fechar"
              style={{
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
              }}
            >
              <IoClose size={26} />
            </button>
          </div>

          {/* LISTA - scrollável */}
          <div
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "12px 16px",
              minHeight: 0,
            }}
          >
            {cart.length === 0 && (
              <p className="text-gray-500 text-sm">Seu carrinho está vazio.</p>
            )}

            {cart.map((it) => (
              <SidebarProducts
                key={it.id}
                item={it}
                onRemove={(id) => removeItem(id)}
                onUpdateQty={(id, qty) => updateQuantity(id, qty)}
              />
            ))}
          </div>

          {/* RODAPÉ FIXO - acompanha o aside */}
          {cart.length > 0 && (
            <div
              style={{
                background: "#fff",
                padding: "12px 16px 16px 16px",
                boxShadow: "0 -6px 14px rgba(0,0,0,0.09)",
                display: "flex",
                flexDirection: "column",
                gap: 10,
                flexShrink: 0,
              }}
            >
              {/* ENVIAR PEDIDO */}
              <button
                onClick={() => {
                  // fecha o sidebar e navega para /pedido passando os itens do carrinho no state
                  setIsOpen(false);
                  // opcional: aguardar a animação de fechamento (300ms) para evitar flash visual
                  setTimeout(() => {
                    navigate("/pedido", { state: { items: cart } });
                  }, 300);
                }}
                style={{
                  background: "#116530",
                  color: "#fff",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 14,
                }}
              >
                Enviar Pedido
                <IoSend size={15} />
              </button>

              {/* ESVAZIAR */}
              <button
                onClick={clearCart}
                style={{
                  background: "#c41d1d",
                  color: "#fff",
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                }}
              >
                Esvaziar o carrinho
              </button>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
