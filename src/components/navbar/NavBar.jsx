import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import logo from "../../assets/logo.svg";
import logosimp from "../../assets/logosimp.svg";
import Button from "./ButtonNav.jsx";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed z-10 flex items-center justify-between py-1 left-0 w-full transition-colors duration-300 ${
        scrolled ? "bg-[#021209]" : "bg-transparent"
      }`}
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

      <ul className="hidden [@media(min-width:860px)]:flex items-center gap-5 flex-1 justify-center">
        <Button link={"/"} text={"Home"} />
        <Button link={"/cereais"} text={"Cereais"} />
        <Button link={"/racoes"} text={"Rações"} />
        <Button link={"/variedades"} text={"Variedades"} />
        <Button link={"/sobre"} text={"Sobre"} />
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
          <div className="absolute top-0 right-0 h-full w-64 bg-[#021209] shadow-lg flex flex-col p-6 animate-drawerSlide">
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
                { link: "/sobre", text: "Sobre" },
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
  );
}
