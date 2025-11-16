// src/pages/View.jsx
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";
import { FaCartPlus } from "react-icons/fa6";

export default function View() {
  const { categoria, id } = useParams();
  const [produto, setProduto] = useState(null);
  const outlet = useOutletContext?.() || {};
  const { addToCart } = outlet;

  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);

  useEffect(() => {
    const fetchProdutoEWeights = async () => {
      try {
        // 1) busca produto atual
        const resp = await api.get(`/produtos/${categoria}/${id}`);
        const prod = resp.data;
        setProduto(prod);

        // normaliza id do produto (tolerante a diferentes nomes)
        const prodId =
          prod?.Id_prod ?? prod?.Id ?? prod?.id ?? prod?._id ?? String(id);

        // 2) tenta buscar apenas os ensacados do produto (rota específica)
        let ensResp = await api.get(`/ensacados/produto/${prodId}`);
        let ensData = Array.isArray(ensResp.data) ? ensResp.data : [];

        // Se a rota específica vier vazia, tenta buscar todos e filtrar localmente
        if (!ensData || ensData.length === 0) {
          const allResp = await api.get("/ensacados");
          ensData = Array.isArray(allResp.data) ? allResp.data : [];
        }

        // 3) filtra apenas os ensacados do produto atual (tolerante a nomes diferentes)
        let matched = ensData.filter((e) => {
          const eProdId =
            e?.Id_prod ??
            e?.id_prod ??
            e?.IdProd ??
            e?.produto_id ??
            e?.Id ??
            e?.produto ??
            e?.Produto;
          return String(eProdId) === String(prodId);
        });

        // Se a filtragem não encontrou nada, assume que a rota já retornou só os ensacados do produto
        if (!matched || matched.length === 0) {
          matched = ensData;
        }

        // 4) mapeia usando fallbacks robustos, garante id único
        const mapped = matched.map((e, idx) => {
          const idFallback =
            e?.Id_ens ?? e?.Id ?? e?.id ?? e?._id ?? `${prodId}-ens-${idx}`;

          // no seu banco o campo é "Peso"
          const pesoVal =
            e?.Peso_ens ??
            e?.Peso ??
            e?.peso ??
            e?.peso_ens ??
            e?.peso_kg ??
            null;

          const label = pesoVal != null ? `${pesoVal} kg` : `Peso ${idx + 1}`;

          const price =
            e?.Preco_ens ?? e?.Preco ?? e?.preco ?? e?.price ?? null;

          // quantidade (opcional)
          const quantidade = e?.Quantidade ?? e?.quantidade ?? e?.qtd ?? null;

          return {
            id: String(idFallback),
            label,
            peso: pesoVal,
            price,
            quantidade,
            raw: e,
          };
        });

        // 5) dedupe por peso (garante 1 botão por peso diferente).
        // Mantém a entrada que tem price quando houver.
        const byPeso = new Map();
        for (const m of mapped) {
          const key = m.peso != null ? String(m.peso) : m.label;
          if (!byPeso.has(key)) {
            byPeso.set(key, m);
          } else {
            const existing = byPeso.get(key);
            if (
              (existing.price == null || existing.price === "") &&
              m.price != null &&
              m.price !== ""
            ) {
              byPeso.set(key, m);
            }
          }
        }

        // transforma em array e ordena por peso numérico quando possível
        const deduped = Array.from(byPeso.values()).sort((a, b) => {
          const na = a.peso == null ? Infinity : Number(a.peso);
          const nb = b.peso == null ? Infinity : Number(b.peso);
          return na - nb;
        });

        setWeights(deduped);
        setSelectedWeight(deduped.length > 0 ? deduped[0] : null);
      } catch (err) {
        console.error("Erro ao buscar produto /ensacados/produto/:id:", err);
        setWeights([]);
        setSelectedWeight(null);
      }
    };

    fetchProdutoEWeights();
  }, [id, categoria]);

  if (!produto) return <p className="p-4">Carregando produto...</p>;

  const handleAdd = () => {
    const prodId =
      produto?._id ?? produto?.id ?? produto?.Id_prod ?? produto?.Id ?? id;
    const nomeprod =
      produto?.Nome_prod ?? produto?.Nome ?? produto?.nome ?? "Produto";
    const imagem = produto?.Foto_prod ?? produto?.Foto ?? produto?.foto ?? null;

    const price =
      selectedWeight?.price ??
      produto?.Preco_med_prod ??
      produto?.Preco ??
      produto?.preco ??
      0;

    const cartItem = {
      id: String(prodId),
      nomeprod,
      imagem: imagem ? `/produtos/${imagem}` : null,
      price,
      weight: selectedWeight
        ? {
            id: selectedWeight.id,
            label: selectedWeight.label,
            price: selectedWeight.price,
            peso: selectedWeight.peso,
          }
        : null,
      rawProduto: produto,
    };

    if (typeof addToCart === "function") {
      addToCart(cartItem);
      alert("Produto adicionado ao carrinho");
    } else {
      console.warn("addToCart não disponível no contexto do Outlet");
    }
  };

  return (
    <>
      <NavBar initialGreen={true} {...outlet} />
      <div className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-20 md:pt-0">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-4xl mt-6 md:mt-25">
          <div className="flex flex-col md:flex-row gap-6">
            {produto?.Foto || produto?.Foto_prod ? (
              <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden rounded-md border border-gray-300">
                <img
                  src={`/produtos/${produto.Foto || produto.Foto_prod}`}
                  alt={produto.Nome || produto.Nome_prod || produto.nome}
                  className="object-cover w-full h-auto max-h-[480px] rounded"
                />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center italic text-gray-500 mb-4">
                Sem imagem
              </div>
            )}

            <div className="w-full md:w-1/2 flex flex-col justify-start">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                {produto.Nome || produto.Nome_prod || produto.nome}
              </h2>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Pesos</h3>

                {weights.length === 0 ? (
                  <p className="text-gray-500 mt-2">
                    Opções de peso não informadas no banco.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {weights.map((w, index) => {
                      const active =
                        selectedWeight && selectedWeight.id === w.id;
                      const key =
                        w.id ?? `${produto?.Id_prod ?? id}-peso-${index}`;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedWeight(w)}
                          className={`min-w-[64px] px-2 h-12 flex items-center justify-center rounded-md border text-sm select-none ${
                            active
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:border-green-500"
                          }`}
                          aria-pressed={active}
                        >
                          <div className="text-center">
                            <div className="font-bold text-sm">{w.label}</div>
                            {w.price != null && (
                              <div className="text-xs">
                                R$ {Number(w.price).toFixed(2)}
                              </div>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <p className="text-sm mb-4">
                <strong>Entre em contato para consultar preços!</strong>
              </p>

              <div className="mt-auto">
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
                <p>
                  {produto.Descricao_prod ??
                    produto.descricao ??
                    "Sem descrição disponível."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
