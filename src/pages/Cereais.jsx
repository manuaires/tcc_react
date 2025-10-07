import Header from "../components/header/Header";
import CereaisImg from "../assets/cereais.png";
import CereaisMobImg from "../assets/cereaismobile.png";
import CerealSection from "../components/layout/CerealSection";
import HeaderMobile from "../components/header/HeaderMobile.jsx"; // Crie este componente para mobile

export default function Cereais() {
  return (
    <>
      <div className="block md:hidden">
        <HeaderMobile image={CereaisMobImg} />
      </div>
      <div className="hidden md:block">
        <Header image={CereaisImg} />
      </div>
      <h2 className="text-center text-5xl mt-8 font-bold text-gray-800">Cereais</h2>
      <div className="w-full flex justify-center items-center">
        <CerealSection/>
      </div>
    </>
  );
}

