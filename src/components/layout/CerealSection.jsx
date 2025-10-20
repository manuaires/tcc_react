import { useState, useEffect } from "react";
import ProdSection from "./ProdSection";
import { FaSearch } from "react-icons/fa";
import api from "../../api";

export default function CerealSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/cereais");
        setProdutos(response.data);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  console.log(produtos);

  useEffect(() => {
    const filtered = produtos.filter((produto) =>
      produto.Nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setProdutosFiltrados(filtered);
  }, [searchTerm, produtos]);

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
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-gray-300 rounded-2xl mb-2 py-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-green-600"
          />
        </div>
      </div>
      <ProdSection produtos={produtosFiltrados} categoria="cereais" />
    </section>
  );
}
