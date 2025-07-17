import Header from "../components/header/Header";
import CereaisImg from "../assets/cereais.png";

export default function Cereais() {
  return (
    <>
      <Header image={CereaisImg} />
      <div className="container">
        <h1>Cereais</h1>
        <p>Esta é a página de cereal bb.</p>
      </div>
    </>
  );
}

