import img from "../../assets/cereais.png";
import { useNavigate } from "react-router-dom";

export default function AbPrev() {
  const navigate = useNavigate();

  const irParaSobre = () => {
    navigate("/sobre");
  }

  return (
    <>
      <section className="bg-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-16">
          <div className="lg:w-1/2">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Sobre nós</h2>
            <p className="text-green-600 font-semibold mb-3">jose bezerra. gostoso. sabor</p>
            <p className="text-gray-600 mb-4">
              Nosso objetivo é fornecer produtos frescos e de alta qualidade
              para nossos clientes, garantindo uma experiência de compra
              excepcional.
            </p>
            <p className="text-gray-600 mb-6">
              Nosso compromisso com a qualidade e o atendimento ao cliente é o
              que nos diferencia. Trabalhamos arduamente para garantir que
              nossos clientes tenham uma experiência de compra agradável e
              satisfatória.
            </p>
            <button onClick={irParaSobre} className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded transition">Saiba Mais</button>
          </div>
          <div className="lg:w-1/2">
            <img
              src={img}
              alt="Fazendinha"
              className="w-full h-auto rounded-lg shadow-lg "
            />
          </div>
        </div>
      </section>
    </>
  );
}
