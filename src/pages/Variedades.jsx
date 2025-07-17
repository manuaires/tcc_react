import Header from "../components/header/Header";
import VarImg from "../assets/variedades.png";

export default function Var() {
  return (
    <>
      <Header image={VarImg} />
      <div className="container">
        <h1>Home</h1>
        <p>Esta é a página de home haha.</p>
      </div>
    </>
  );
}

