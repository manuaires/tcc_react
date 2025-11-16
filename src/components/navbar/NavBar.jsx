// src/components/navbar/NavBar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import logo from "../../assets/logo.svg";
import logosimp from "../../assets/logosimp.svg";
import Button from "./ButtonNav.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import SidebarCart from "../cart/SidebarCart.jsx";
import ButtonLog from "./ButtonLog.jsx";
import { IoIosArrowDown } from "react-icons/io";

export default function NavBar({ initialGreen = false }) {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // estado de autenticação local para forçar re-render quando mudar
  const [auth, setAuth] = useState(() => ({
    token: localStorage.getItem("token"),
    userName: localStorage.getItem("userName"),
    userType: localStorage.getItem("userType"),
  }));

  // novo estado/ref para dropdown do usuário
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef(null);

  // estado para badge do carrinho (soma das quantities)
  const [cartCount, setCartCount] = useState(0);

  // sincroniza auth quando mudar (evento custom + storage)
  useEffect(() => {
    const handleAuthChange = () => {
      setAuth({
        token: localStorage.getItem("token"),
        userName: localStorage.getItem("userName"),
        userType: localStorage.getItem("userType"),
      });
    };
    handleAuthChange();
    window.addEventListener("authChanged", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("authChanged", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  // atualiza badge lendo localStorage
  useEffect(() => {
    const calcCountFromStorage = () => {
      try {
        const raw = localStorage.getItem("cart_v1");
        const arr = raw ? JSON.parse(raw) : [];
        const total = Array.isArray(arr)
          ? arr.reduce((s, it) => s + (Number(it.quantity) || 0), 0)
          : 0;
        setCartCount(total);
      } catch (e) {
        console.error("Erro ao calcular badge do carrinho:", e);
        setCartCount(0);
      }
    };

    // calc inicial
    calcCountFromStorage();

    // handlers
    const handlerUpdated = () => calcCountFromStorage();
    const onStorage = (e) => {
      if (e.key === "cart_v1") calcCountFromStorage();
    };

    window.addEventListener("cart_v1:updated", handlerUpdated);
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("cart_v1:updated", handlerUpdated);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  // efeito para fechar dropdown ao clicar fora / pressionar Esc
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(e.target)
      ) {
        setUserDropdownOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setUserDropdownOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    localStorage.removeItem("userType");
    setAuth({ token: null, userName: null, userType: null });
    window.dispatchEvent(new Event("authChanged"));
    navigate("/");
  };

  const bgClass = scrolled || initialGreen ? "bg-[#044a23]" : "bg-transparent";

  // abre o sidebar global ao disparar evento que SidebarCart escuta
  const openCart = () => {
    window.dispatchEvent(new Event("cart:open"));
  };

  return (
    <>
      <nav
        className={`fixed z-10 flex items-center justify-between h-24 py-1 left-0 w-full transition-colors duration-300 ${bgClass}`}
      >
        <div className="flex items-center flex-1">
          <Link to="/">
            <span className="flex items-center gap-3">
              <picture>
                <source srcSet={logo} media="(min-width: 768px)" />
                <img
                  src={logosimp}
                  className="ml-5 w-25 h-25 md:w-65 md:h-30 max-w-full object-contain border-none"
                  alt="Logo"
                />
              </picture>
            </span>
          </Link>
        </div>

        <ul className="hidden [@media(min-width:860px)]:flex items-center gap-1 flex-1 justify-center">
          <Button link={"/"} text={"Home"} />
          <Button link={"/cereais"} text={"Cereais"} />
          <Button link={"/racoes"} text={"Rações"} />
          <Button link={"/variedades"} text={"Variedades"} />
          {auth.userType === "Vendedor" && (
            <Button link={"/orcamento"} text={"Orçamento"} />
          )}
        </ul>

        <ul className="flex items-center gap-2 justify-end">
          {!auth.token && <ButtonLog link={"/login"} />}
          {auth.token && (
            <>
              <button
                onClick={openCart}
                className="shopping-cart relative text-white"
                aria-label="Abrir carrinho"
              >
                <FontAwesomeIcon icon={faCartShopping} size="lg" />
                <div className="products-count products-count absolute -top-2 -right-2 bg-red-600 text-white text-xs w-[18px] h-[18px] flex items-center justify-center rounded-full">
                  {cartCount || 0}
                </div>
              </button>

              {/* dropdown do usuário */}
              <div className="relative" ref={userDropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen((v) => !v)}
                  className="px-3 py-2 rounded text-white bg-transparent hover:bg-white/10 flex items-center gap-2"
                  aria-haspopup="true"
                  aria-expanded={userDropdownOpen}
                  type="button"
                >
                  {auth.userName || ""}
                  <span className="ml-1 text-sm">
                    <IoIosArrowDown />
                  </span>
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-40 bg-[#044a23] text-white rounded shadow-[0_8px_25px_rgba(0,0,0,0.5)] z-30 overflow-hidden">
                    <Link
                      to="/usuario"
                      className="block px-4 py-2 hover:bg-green-900"
                      onClick={() => setUserDropdownOpen(false)}
                    >
                      Editar Perfil
                    </Link>
                    <button
                      onClick={() => {
                        setUserDropdownOpen(false);
                        logout();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-green-900"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </ul>

        <button
          className="[@media(min-width:860px)]:hidden mr-5 flex flex-col justify-center items-center"
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
        >
          <span className="block w-5 h-0.5 bg-[#fdf6ed] mb-1 rounded"></span>
          <span className="block w-5 h-0.5 bg-[#fdf6ed] mb-1 rounded"></span>
          <span className="block w-5 h-0.5 bg-[#fdf6ed] rounded"></span>
        </button>

        {menuOpen && (
          <div className="fixed inset-0 z-20">
            <div
              className="absolute inset-0 bg-black opacity-40"
              onClick={() => setMenuOpen(false)}
            ></div>
            <div className="absolute top-0 right-0 h-full w-64 bg-[#044a23] shadow-lg flex flex-col p-6 animate-drawerSlide">
              <button
                className="self-end mb-6 text-[#fdf6ed] text-2xl"
                onClick={() => setMenuOpen(false)}
                aria-label="Fechar menu"
              >
                &times;
              </button>
              <ul className="flex flex-col gap-6">
                {[
                  { link: "/", text: "Home" },
                  { link: "/cereais", text: "Cereais" },
                  { link: "/racoes", text: "Rações" },
                  { link: "/variedades", text: "Variedades" },
                ].map((item, idx) => (
                  <li
                    key={item.text}
                    className="animate-slideinLeft opacity-0"
                    style={{
                      animation: `slideinLeft 0.7s cubic-bezier(0.4,0,0.2,1) forwards`,
                      animationDelay: `${idx * 0.12 + 0.15}s`,
                    }}
                  >
                    <Button link={item.link} text={item.text} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="mr-5 hidden md:block"></div>

        <style>{`
          @keyframes slideinLeft {
            from {
              opacity: 0;
              transform: translateX(-40px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          @keyframes drawerSlide {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }
          .animate-drawerSlide {
            animation: drawerSlide 0.6s cubic-bezier(0.4,0,0.2,1);
          }
        `}</style>
      </nav>

      {/* garante que o SidebarCart está montado (escuta eventos e abre/fecha) */}
      <SidebarCart />
    </>
  );
}
