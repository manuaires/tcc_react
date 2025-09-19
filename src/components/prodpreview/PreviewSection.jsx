import { useEffect, useState } from "react";
import CardPrev from "./CardPrev.jsx";
import api from "../../api";

export default function PreviewSection() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const response = await api.get("/produtos");
        setProdutos(response.data);
        //setCategoriaSelecionada(response.data.)
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProdutos();
  }, []);

  /*const produtosFiltrados = produtos.filter( (item) => item.Id_categ === categoriaSelecionada );*/ 
  const produtosFiltrados = produtos.filter((item) => item.Id_categ = categoriaSelecionada);

  return (
    <section className="w-full bg-gray-100 py-16 px-4">
      <div className="container mx-auto px-2 sm:px-4">
        <h3 className="text-center text-3xl mb-6 font-bold text-gray-700">
          Nossos Produtos
        </h3>
        <div className="flex justify-center gap-4 mb-4 text-green-800">
          {categorias.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoriaSelecionada(cat)}
              className={`pb-1 border-b-2 ${
                categoriaSelecionada === cat
                  ? "border-green-600"
                  : "border-transparent"
              } hover:border-green-700 transition`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.slice(0, 4).map((item) => (
              <CardPrev
                key={item.Id_prod}
                id={item.Id_prod}
                nomeprod={item.Nome_prod}
                preço={item.Preco_prod}
                imagem={item.Foto}
              />
            ))
          ) : (
            <p>Carregando produtos...</p>
          )}
        </div>
      </div>
    </section>
  );
}
