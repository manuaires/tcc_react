import { useEffect, useState } from "react";
import CardPrev from "../layout/Card";
import api from "../../api";

export default function PreviewSection() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [produtos, setProdutos] = useState([]);
  const [cereais, setCereais] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const responseCereais = await api.get("/cereais");
        const responseProdutos = await api.get("/produtos");
        const responseCategorias = await api.get("/categorias");

        setCereais(responseCereais.data);
        setProdutos(responseProdutos.data);

        if (responseCategorias.data.length > 0) {
          setCategoriaSelecionada(responseCategorias.data[1].Nome_categ);
        }
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchAll();
  }, []);

  const produtosFiltrados = produtos.filter(
    (item) => item.Categoria === categoriaSelecionada
  );

  console.log(cereais);
  console.log(produtos);

  return (
    <section className="w-full bg-gray-100 py-16 px-4">
      <div className="container mx-auto px-2 sm:px-4">
        <h3 className="text-center text-3xl mb-6 font-bold text-gray-700">
          Nossos Produtos
        </h3>
        <div className="flex justify-center gap-4 mb-4 text-green-800">
          <button
            key="ração"
            onClick={() => setCategoriaSelecionada("Ração")}
            className={`pb-1 border-b-2 ${
              categoriaSelecionada === "Ração"
                ? "border-green-600"
                : "border-transparent"
            } hover:border-green-700 transition`}
          >
            Rações
          </button>
          <button
            key="cereal"
            onClick={() => setCategoriaSelecionada("Cereal")}
            className={`pb-1 border-b-2 ${
              categoriaSelecionada === "Cereal"
                ? "border-green-600"
                : "border-transparent"
            } hover:border-green-700 transition`}
          >
            Cereais
          </button>
          <button
            key="variedade"
            onClick={() => setCategoriaSelecionada("Variedade")}
            className={`pb-1 border-b-2 ${
              categoriaSelecionada === "Variedade"
                ? "border-green-600"
                : "border-transparent"
            } hover:border-green-700 transition`}
          >
            Variedades  
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-6">
          {categoriaSelecionada === "Cereal" && cereais.length > 0 ? (
            cereais
              .slice(0, 4)
              .map((item) => (
                <CardPrev
                  key={item.Id}
                  id={item.Id}
                  nomeprod={item.Nome}
                  imagem={item.Foto}
                  categoria={"cereais"}
                />
              ))
          ) : produtosFiltrados.length > 0 ? (
            produtosFiltrados
              .slice(0, 4)
              .map((item) => (
                <CardPrev
                  key={item.Id}
                  id={item.Id}
                  nomeprod={item.Nome}
                  imagem={item.Foto}
                  categoria={
                    categoriaSelecionada === "Ração" ? "rações" : "variedades"
                  }
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
