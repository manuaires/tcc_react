import Header from "../components/header/Header";
import RacImg from "../assets/racoes.png";

export default function Rac() {
  return (
    <>
      <Header image={RacImg} />
      <div className="container">
        <h1>Home</h1>
        <p>Esta é a página de Rações haha.</p>
      </div>
    </>
  );
}