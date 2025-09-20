import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

export default function View() {
  const { id } = useParams();
  const [produto, setProduto] = useState(null);

  useEffect(() => {
    const fetchProduto = async () => {
      try {
        const response = await api.get(`/produtos/${id}`);
        setProduto(response.data);
      } catch (error) {
        console.error("Erro ao buscar produto:", error);
      }
    };

    fetchProduto();
  }, [id]);

  if (!produto) {
    return <p className="p-4">Carregando produto...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-4">{produto.Nome_prod}</h1>

      <p className="italic text-gray-500">Sem imagem</p>
      <p>
        <strong>Preço:</strong> R$ {Number(produto.Preco_prod).toFixed(2)}
      </p>
      <p>
        <strong>Quantidade:</strong> {produto.Quantidade_prod}
      </p>
      <p>
        <strong>Categoria:</strong> {produto.Nome_categ}
      </p>
      {produto.Peso_prod && (
        <p>
          <strong>Peso:</strong> {produto.Peso_prod} Kg
        </p>
      )}
      {produto.Ml_prod && (
        <p>
          <strong>Volume:</strong> {produto.Ml_prod} ml
        </p>
      )}
      {produto.Tipo_prod && (
        <p>
          <strong>Tipo:</strong> {produto.Tipo_prod}
        </p>
      )}
    </div>
  );
}
