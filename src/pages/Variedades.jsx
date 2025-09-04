import Header from "../components/header/Header";
import VarImg from "../assets/variedades.png";
import VarSection from "../components/layout/VarSection";

export default function Var() {
  return (
    <>
      <Header image={VarImg} />
      <div>
        <VarSection />
      </div>
    </>
  );
}

