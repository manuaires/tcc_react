import Header from "../components/header/Header";
import SobreImg from "../assets/sobre.png";

export default function Sobre() {
  return (
    <>
      <Header image={SobreImg} />
      <div className="container">
        <h1>sobre</h1>
        <p>Esta é a página de sobre bla bla.</p>
      </div>
    </>
  );
}
