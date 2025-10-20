import { useState, useEffect } from "react";
import NavBar from "./components/navbar/NavBar.jsx";
import SidebarCart from "./components/cart/SidebarCart.jsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/footer/Footer.jsx";

export default function App() {
  const [cartItems, setCartItems] = useState(() => {
    // Recupera carrinho do localStorage ao iniciar
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, newQty) => {
  setCartItems((prev) =>
    prev.map((item) =>
      item.id === id ? { ...item, quantity: newQty } : item
    )
  );
};

   const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem("cart");
  };

  return (
    <>
      <NavBar
        onCartClick={() => setCartOpen(true)}
        cartItems={cartItems}
      />
      <SidebarCart
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cartItems={cartItems}
        removeFromCart={removeFromCart}
        updateQuantity={updateQuantity}
        clearCart={clearCart}
      />
      <Outlet context={{ addToCart, cartItems, onCartClick: () => setCartOpen(true) }} />
      <Footer />
     
    </>
  );
}
