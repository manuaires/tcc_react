import { useState } from "react";
import { produtos } from "./dbteste";
import ProdSection from "./ProdSection";
import { FaSearch } from "react-icons/fa";

export default function CerealSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtosFiltrados, setProdutosFiltrados] = useState(
    produtos.filter(p => p.categoria.toLowerCase() === "cereais")
  );

  // Filtra produtos por busca
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const produtosCategoria = produtos.filter(p => p.categoria.toLowerCase() === "cereais");

    const filtradosPorBusca = produtosCategoria.filter(p =>
      p.nomeprod.toLowerCase().includes(term)
    );

    setProdutosFiltrados(filtradosPorBusca);
  };

  return (
    <section className="py-15 flex flex-col justify-center items-center w-full gap-8">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-80">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <FaSearch className="text-green-700 w-5 h-5" />
          </span>
          <input
            type="text"
            placeholder="Buscar cereal..."
            value={searchTerm}
            onChange={handleSearch}
            className="border border-gray-300 rounded-2xl mb-2 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>

      <ProdSection produtos={produtosFiltrados} />
    </section>
  );
}
