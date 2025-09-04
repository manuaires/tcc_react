import Header from "../components/header/Header";
import RacImg from "../assets/racoes.png";
import RacaoSection from "../components/layout/RacaoSection";

export default function Rac() {
  return (
    <>
      <Header image={RacImg} />
      <div>
        <RacaoSection />
      </div>
      
    </>
  );
}