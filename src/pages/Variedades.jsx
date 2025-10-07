import Header from "../components/header/Header";
import VarImg from "../assets/variedades.png";
import VarMobImg from "../assets/variedadesmobile.png";
import VarSection from "../components/layout/VarSection";
import HeaderMobile from "../components/header/HeaderMobile.jsx"; // Crie este componente para mobile


export default function Var() {
  return (
    <>
      <div className="block md:hidden">
            <HeaderMobile image={VarMobImg} />
      </div>
      <div className="hidden md:block">
            <Header image={VarImg} />
      </div>
      <h2 className="text-center text-5xl mt-8 mb-8 font-bold text-gray-800">Variedades</h2>
      <div className="w-full flex justify-center items-center">
        <VarSection />
      </div>
    </>
  );
}

