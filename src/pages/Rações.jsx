import Header from "../components/header/Header";
import RacImg from "../assets/racoes.png";
import RacaoSection from "../components/layout/RacaoSection";

export default function Rac() {
  return (
    <>
    <div className="block md:hidden">
      <HeaderMobile image={RacImg} />
    </div>
    <div className="hidden md:block">
      <Header image={RacImg} />
    </div>
      
      <h2 className="text-center text-5xl mt-8 mb-8 font-bold text-gray-800">Rações</h2>
      <div className="w-full flex justify-center items-center">
        <RacaoSection />
      </div>
      
    </>
  );
}