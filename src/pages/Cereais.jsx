import Header from "../components/header/Header";
import CereaisImg from "../assets/cereais.png";
import CerealSection from "../components/layout/CerealSection";

export default function Cereais() {
  return (
    <>
      <Header image={CereaisImg} />
      <h2 className="text-center text-5xl mt-8 mb-8 font-bold text-gray-800">Cereais</h2>
      <div className="w-full flex justify-center items-center">
        <CerealSection/>
      </div>
    </>
  );
}

