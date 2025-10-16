import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";

export default function View() {
  const { categoria, id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${categoria}/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [id, categoria]);

  console.log(produto);

  if (!produto) {
    return <p className="p-4">Carregando produto...</p>;
  }

  return (
    <>
      <NavBar initialGreen={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            {produto.Nome}
          </h2>
          {/* Exibir imagem, se houver */}
          {produto.Foto ? (
            <img
              src={`/produtos/${produto.Foto}`}
              alt={produto.Nome}
              className="w-full h-64 object-cover rounded-md mb-4"
            />
          ) : (
            <p className="italic text-gray-500 mb-4">Sem imagem</p>
          )}
          <p>
            <strong>Preço:</strong> R$ {Number(produto.Preco).toFixed(2)}
          </p>
          <p>
            <strong>Quantidade:</strong> {produto.Quantidade}
          </p>
          <p>
            <strong>Categoria:</strong> {categoria}
          </p>
          {produto.Peso_prod && (
            <p>
              <strong>Peso:</strong> {produto.Peso} Kg
            </p>
          )}
          {produto.Ml_prod && (
            <p>
              <strong>Volume:</strong> {produto.Ml} ml
            </p>
          )}
        </div>
      </div>
    </>
  );
}
