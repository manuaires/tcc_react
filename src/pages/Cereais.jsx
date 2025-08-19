import Header from "../components/header/Header";
import CereaisImg from "../assets/cereais.png";
import CerealSection from "../components/layout/CerealSection";

export default function Cereais() {
  return (
    <>
      <Header image={CereaisImg} />
      <div className="w-full flex justify-center items-center">
        <CerealSection/>
      </div>
    </>
  );
}

