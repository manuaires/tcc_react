import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

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
    <div className="p-6 pt-50 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{produto.Nome}</h1>

      <p className="italic text-gray-500">Sem imagem</p>
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
  );
}
