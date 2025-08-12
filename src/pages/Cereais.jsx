import Header from "../components/header/Header";
import CereaisImg from "../assets/cereais.png";
import ProdSection from "../components/layout/ProdSection";

export default function Cereais() {
  return (
    <>
      <Header image={CereaisImg} />
      <div className="container">
      </div>
      <ProdSection />
      <ProdSection />
      <ProdSection />
      <ProdSection />

    </>
  );
}

