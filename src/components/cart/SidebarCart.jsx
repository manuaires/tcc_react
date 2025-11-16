// src/components/cart/SidebarCart.jsx
import React, { useEffect, useState } from "react";
import SidebarProducts from "./SidebarProducts";

/**
 * SidebarCart melhorado:
 * - Lê/escreve em localStorage "cart_v1"
 * - Ouve eventos "cart_v1:updated" e "cart:open"
 * - Fornece botão flutuante para abrir/fechar o drawer
 */

export default function SidebarCart() {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const loadCart = () => {
    try {
      const raw = localStorage.getItem("cart_v1");
      const arr = raw ? JSON.parse(raw) : [];
      setCart(Array.isArray(arr) ? arr : []);
    } catch (e) {
      console.error("Erro ao carregar carrinho:", e);
      setCart([]);
    }
  };

  useEffect(() => {
    loadCart();

    // escuta mudanças de localStorage vindas de outras abas
    const onStorage = (e) => {
      if (e.key === "cart_v1") loadCart();
    };
    window.addEventListener("storage", onStorage);

    // escuta evento custom quando adicionamos via handleAdd
    const handlerUpdated = () => loadCart();
    window.addEventListener("cart_v1:updated", handlerUpdated);

    // escuta pedido para abrir o carrinho
    const handlerOpen = () => setIsOpen(true);
    window.addEventListener("cart:open", handlerOpen);

    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("cart_v1:updated", handlerUpdated);
      window.removeEventListener("cart:open", handlerOpen);
    };
  }, []);

  const saveCart = (nextCart) => {
    try {
      localStorage.setItem("cart_v1", JSON.stringify(nextCart));
      setCart(nextCart);
      // avisa outras partes (se necessário)
      window.dispatchEvent(new Event("cart_v1:updated"));
    } catch (e) {
      console.error("Erro ao salvar carrinho:", e);
    }
  };

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
    setIsOpen(false);
  };

  // botão flutuante para abrir/fechar (sempre disponível)
  const FloatingButton = () => (
    <button
      onClick={() => setIsOpen((s) => !s)}
      aria-label="Abrir/fechar carrinho"
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        background: "#116530",
        color: "#fff",
        padding: "10px 12px",
        borderRadius: 999,
        border: "none",
        zIndex: 1200,
        cursor: "pointer",
      }}
    >
      Carrinho ({cart.reduce((s, it) => s + (Number(it.quantity) || 0), 0)})
    </button>
  );

  return (
    <>
      <FloatingButton />

      {isOpen && (
        <aside
          style={{
            position: "fixed",
            right: 0,
            top: 0,
            width: 360,
            height: "100vh",
            background: "#fff",
            boxShadow: "-12px 0 24px rgba(0,0,0,0.12)",
            zIndex: 1300,
            padding: 16,
            overflowY: "auto",
          }}
          aria-live="polite"
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 style={{ margin: 0 }}>Seu carrinho</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <button
                onClick={() => {
                  clearCart();
                }}
                title="Limpar carrinho"
                style={{
                  background: "transparent",
                  border: "1px solid #ddd",
                  padding: "6px 8px",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Limpar
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Fechar"
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: 16,
                  cursor: "pointer",
                }}
              >
                ✕
              </button>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            {cart.length === 0 && <p>Seu carrinho está vazio.</p>}

            {cart.map((it) => (
              <SidebarProducts
                key={it.id}
                item={it}
                onRemove={(id) => removeItem(id)}
                onUpdateQty={(id, qty) => updateQuantity(id, qty)}
              />
            ))}
          </div>

          {cart.length > 0 && (
            <div style={{ marginTop: 18 }}>
              <button
                onClick={() => {
                  alert("Enviar pedido - implemente fluxo de checkout");
                }}
                style={{
                  background: "#116530",
                  color: "#fff",
                  width: "100%",
                  padding: "10px 14px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 8,
                }}
              >
                Enviar Pedido ►
              </button>
            </div>
          )}
        </aside>
      )}
    </>
  );
}
