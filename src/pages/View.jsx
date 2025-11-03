import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";
import { FaCartPlus } from "react-icons/fa6";

export default function View() {
  const { categoria, id } = useParams();
  const [produto, setProduto] = useState(null);

  // obter addToCart do Outlet (fornecido em App.jsx)
  const outlet = useOutletContext?.() || {};
  const { addToCart } = outlet;

  // novo estado para selecionar peso
  const [selectedWeight, setSelectedWeight] = useState(null);

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

  // nova função de adicionar ao carrinho (inclui peso selecionado)
  const handleAdd = () => {
    // montar item compatível com a estrutura usada no carrinho
    const cartItem = {
      id: produto._id || produto.id || id,
      nomeprod: produto.Nome || produto.nome || "Produto",
      imagem: produto.Foto ? `/produtos/${produto.Foto}` : produto.imagem || null,
      // opcional: preço se existir no objeto do produto
      price: produto.Preco ?? produto.preco ?? 0,
      weight: selectedWeight ?? null, // inclui peso selecionado
    };
    if (typeof addToCart === "function") {
      addToCart(cartItem);
      // feedback simples
      alert("Produto adicionado ao carrinho");
    } else {
      console.warn("addToCart não disponível no contexto do Outlet");
    }
  };

  return (
    <>
      <NavBar initialGreen={true} {...outlet} />
      {/* Em mobile: empilha abaixo da NavBar fixa (pt-20) e alinha ao topo; em desktop mantém centralizado */}
      <div className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-20 md:pt-0">
        {/* Card: mais largo em telas maiores (max-w-4xl). */}
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-4xl mt-6 md:mt-25">
          {/* Wrapper: empilha no mobile, lado a lado no desktop */}
          <div className="flex flex-col md:flex-row gap-6">
            {/* Imagem: ocupa 100% no mobile, metade no desktop */}
            {produto.Foto ? (
              <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden rounded-md border border-gray-300">
                <img
                  src={`/produtos/${produto.Foto}`}
                  alt={produto.Nome}
                  className="object-cover w-full h-auto max-h-[480px] rounded" // Ajustar para ser responsiva
                />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center italic text-gray-500 mb-4">
                Sem imagem
              </div>
            )}

            {/* Informações: ocupa 100% no mobile, metade no desktop */}
            <div className="w-full md:w-1/2 flex flex-col justify-start">
              <h2 className="text-2xl font-bold text-green-700 mb-4">{produto.Nome}</h2>

              {/* Pesos / Volumes: pequenos botões quadrados */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Pesos</h3>
                <div className="flex flex-wrap gap-2">
                  {["0.25 kg", "0.5 kg", "1 kg", "2 kg"].map((w) => {
                    const active = selectedWeight === w;
                    return (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWeight(w)}
                        className={`w-14 h-14 flex items-center justify-center rounded-md border text-sm select-none ${
                          active
                            ? "bg-green-700 text-white border-green-700"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:border-green-500"
                        }`}
                        aria-pressed={active}
                      >
                        <span className="font-bold">{w}</span>
                      </button>
                    );
                  })}
                </div>
                {!(produto.Peso_prod || produto.Ml_prod || produto.Peso || produto.Ml) && (
                  <p className="text-gray-500 mt-2">Opções de peso não informadas no produto.</p>
                )}
              </div>

              <p className="text-sm mb-4">
                <strong>Entre em contato para consultar preços!</strong>
              </p>

              {/* botão de adicionar ao carrinho */}
              <div className="mt-auto"> {/* força o botão para baixo em desktop se houver espaço */}
                <button
                  type="button"
                  aria-label="Adicionar ao carrinho"
                  onClick={handleAdd}
                  className="bg-green-700 w-full h-10 hover:bg-green-800 text-sm text-white rounded-sm flex items-center justify-center gap-2"
                >
                  Adicionar ao carrinho
                  <FaCartPlus size={16} className="inline-block" />
                </button>
              </div>

              <hr className="my-4 text-gray-300" />

              <div>
                <p>
                  <strong>Descrição:</strong>
                </p>
                <p>pipipipopo Descrição</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
