import img from "../../assets/cereais.png";

export default function AbPrev() {
  return (
    <>
      <section className="bg-green-100 py-8">
        <div>
          <div>
            <h2>Sobre nós</h2>
            <p>jose bezerra. gostoso. sabor</p>
            <p>
              Nosso objetivo é fornecer produtos frescos e de alta qualidade
              para nossos clientes, garantindo uma experiência de compra
              excepcional.
            </p>
            <p>
              Nosso compromisso com a qualidade e o atendimento ao cliente é o
              que nos diferencia. Trabalhamos arduamente para garantir que
              nossos clientes tenham uma experiência de compra agradável e
              satisfatória.
            </p>
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
