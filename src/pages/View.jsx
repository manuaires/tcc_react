// src/pages/View.jsx
import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";
import { FaCartPlus } from "react-icons/fa6";

export default function View() {
  const { categoria, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [produto, setProduto] = useState(null);
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const outlet = useOutletContext?.() || {};
  const { addToCart } = outlet;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProduto(null);
      setWeights([]);
      setSelectedWeight(null);

      try {
        const cat = String(categoria || "").toLowerCase();

        const normalize = (data) => {
          if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
          return data ?? null;
        };

        // --- CEREAIS
        if (cat === "cereais") {
          const resp = await api.get(`/produtos/${categoria}/${id}`);
          const prodRaw = normalize(resp?.data);
          if (!prodRaw) {
            setProduto(null);
            setLoading(false);
            return;
          }

          const display = {
            source: "produto",
            prodId: prodRaw?.Id_prod ?? prodRaw?.Id ?? prodRaw?.id ?? prodRaw?._id ?? String(id),
            name: prodRaw?.Nome_prod ?? prodRaw?.Nome ?? prodRaw?.nome ?? "Produto",
            image: prodRaw?.Foto_prod ?? prodRaw?.Foto ?? prodRaw?.foto ?? null,
            description: prodRaw?.Descricao_prod ?? prodRaw?.Descricao ?? prodRaw?.descricao ?? null,
            raw: prodRaw,
          };

          setProduto(display);

          const prodId = display.prodId;
          try {
            console.debug("REQUEST -> /ensacados/produto/" + prodId);
            const ensResp = await api.get(`/ensacados/produto/${encodeURIComponent(prodId)}`);
            console.debug("RESPONSE /ensacados/produto ->", ensResp?.data);
            const ensArr = Array.isArray(ensResp.data) ? ensResp.data : [];

            // --- NOVA LÓGICA: somente filtra por Id_prod se a resposta realmente incluir esse campo
            const hasIdProdField = ensArr.some((e) => {
              return e?.Id_prod !== undefined || e?.id_prod !== undefined || e?.IdProd !== undefined || e?.produto_id !== undefined;
            });

            let matched;
            if (hasIdProdField) {
              // filtra estritamente quando a resposta traz o campo de relação
              matched = ensArr.filter((e) => {
                const eProdId = e?.Id_prod ?? e?.id_prod ?? e?.IdProd ?? e?.produto_id ?? null;
                return eProdId !== null && eProdId !== undefined && String(eProdId) === String(prodId);
              });
            } else {
              // caso a resposta NÃO traga campo de relação, assumimos que o endpoint já retornou apenas os ensacados do produto
              matched = ensArr;
            }

            // mapear para padrão { id, label, peso, price, raw }
            const mapped = (matched || []).map((e, idx) => {
              const idFallback = e?.Id_ens ?? e?.Id ?? e?.id ?? e?._id ?? `${prodId}-ens-${idx}`;

              // tenta várias propriedades possíveis para peso (Peso_ens, Peso, peso, etc)
              const pesoVal = e?.Peso_ens ?? e?.Peso ?? e?.peso ?? e?.peso_ens ?? e?.peso_kg ?? null;

              const label = pesoVal != null ? `${pesoVal} kg` : `Peso ${idx + 1}`;

              // tenta várias propriedades possíveis para preço
              const price = e?.Preco_ens ?? e?.Preco ?? e?.preco ?? e?.price ?? null;

              return {
                id: String(idFallback),
                label,
                peso: pesoVal,
                price,
                raw: e,
              };
            });

            // dedupe por peso (mantendo sua lógica)
            const byPeso = new Map();
            for (const m of mapped) {
              const key = m.peso != null ? String(m.peso) : m.label;
              if (!byPeso.has(key)) byPeso.set(key, m);
              else {
                const existing = byPeso.get(key);
                if ((existing.price == null || existing.price === "") && m.price != null) {
                  byPeso.set(key, m);
                }
              }
            }

            const deduped = Array.from(byPeso.values()).sort((a, b) => {
              const na = a.peso == null ? Infinity : Number(a.peso);
              const nb = b.peso == null ? Infinity : Number(b.peso);
              return na - nb;
            });

            setWeights(deduped);
            setSelectedWeight(deduped.length > 0 ? deduped[0] : null);
          } catch (e) {
            console.warn("Erro ao buscar /ensacados/produto/:prodId", e);
            setWeights([]);
            setSelectedWeight(null);
          }

          setLoading(false);
          return;
        }

        // --- RAÇÕES / VARIEDADES
        if (cat === "rações" || cat === "variedades") {
          let out = null;
          try {
            const respOut = await api.get(`/outros_produtos/${id}`);
            out = normalize(respOut?.data);
          } catch (errOut) {
            try {
              const respFallback = await api.get(`/produtos/${categoria}/${id}`);
              out = normalize(respFallback?.data);
            } catch (errFallback) {
              console.warn("Erro ao buscar outros_produtos", errOut, errFallback);
              out = null;
            }
          }

          if (!out) {
            setProduto(null);
            setLoading(false);
            return;
          }

          const displayOut = {
            source: "outros_produtos",
            prodId: out?.Id_out ?? out?.Id ?? out?.id ?? String(id),
            name: out?.Nome_out ?? out?.Nome ?? out?.nome ?? "Produto",
            image: out?.Foto_out ?? out?.Foto ?? out?.foto ?? null,
            description: out?.Descricao_out ?? out?.Descricao ?? out?.descricao ?? null,
            raw: out,
          };

          setProduto(displayOut);
          setWeights([]);
          setSelectedWeight(null);
          setLoading(false);
          return;
        }

        // --- fallback genérico
        try {
          const resp = await api.get(`/produtos/${categoria}/${id}`);
          const fallbackProd = normalize(resp?.data);
          if (!fallbackProd) {
            setProduto(null);
            setLoading(false);
            return;
          }
          setProduto({
            source: "produto",
            prodId: fallbackProd?.Id_prod ?? fallbackProd?.Id ?? fallbackProd?.id ?? String(id),
            name: fallbackProd?.Nome_prod ?? fallbackProd?.Nome ?? fallbackProd?.nome ?? "Produto",
            image: fallbackProd?.Foto_prod ?? fallbackProd?.Foto ?? fallbackProd?.foto ?? null,
            description: fallbackProd?.Descricao_prod ?? fallbackProd?.Descricao ?? fallbackProd?.descricao ?? null,
            raw: fallbackProd,
          });
        } catch (err) {
          console.error("Erro fallback /produtos/:categoria/:id", err);
          setProduto(null);
        } finally {
          setLoading(false);
        }
      } catch (err) {
        console.error("Erro geral ao buscar produto:", err);
        setProduto(null);
        setWeights([]);
        setSelectedWeight(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [categoria, id]);

  if (loading) return <p className="p-4">Carregando produto...</p>;

  if (!produto)
    return (
      <>
        <NavBar initialGreen={true} {...(typeof addToCart === "function" ? { addToCart } : {})} />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white shadow rounded p-6 max-w-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Produto não encontrado</h2>
            <p className="text-sm text-gray-600">Verifique categoria e id.</p>
          </div>
        </div>
      </>
    );

  const handleAdd = () => {
    const prodId = produto?.prodId ?? id;
    const nomeprod = produto?.name ?? "Produto";
    const imagem = produto?.image ?? null;
    const price =
      selectedWeight?.price ??
      produto?.raw?.Preco_med_prod ??
      produto?.raw?.Preco ??
      produto?.raw?.preco ??
      produto?.raw?.Preco_med_out ??
      0;

    const weightKey =
      selectedWeight?.id ?? selectedWeight?.peso ?? selectedWeight?.label ?? "noWeight";
    const composedId = `${prodId}-${weightKey}`;

    const cartItem = {
      id: composedId,
      prodId: String(prodId),
      nomeprod,
      imagem: imagem ? `/produtos/${imagem}` : null,
      price,
      quantity: 1,
      weight: selectedWeight
        ? { id: selectedWeight.id, label: selectedWeight.label, price: selectedWeight.price, peso: selectedWeight.peso }
        : null,
      rawProduto: produto.raw,
    };

    try {
      const raw = localStorage.getItem("cart_v1");
      const cart = raw ? JSON.parse(raw) : [];
      const idx = cart.findIndex((it) => it.id === cartItem.id);
      if (idx >= 0) cart[idx].quantity = (Number(cart[idx].quantity) || 0) + (Number(cartItem.quantity) || 1);
      else cart.push(cartItem);
      localStorage.setItem("cart_v1", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_v1:updated"));
      console.log("cart_v1 (after add):", JSON.parse(localStorage.getItem("cart_v1")));
      alert("Produto adicionado ao carrinho");
    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);
      alert("Erro ao adicionar ao carrinho");
    }
  };

  return (
    <>
      <NavBar initialGreen={true} {...(typeof addToCart === "function" ? { addToCart } : {})} />
      <div className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-20 md:pt-0">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-4xl mt-6 md:mt-25">
          <div className="flex flex-col md:flex-row gap-6">
            {produto.image ? (
              <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden rounded-md border border-gray-300">
                <img src={`/produtos/${produto.image}`} alt={produto.name} className="object-cover w-full h-auto max-h-[480px] rounded" />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center italic text-gray-500 mb-4">Sem imagem</div>
            )}

            <div className="w-full md:w-1/2 flex flex-col justify-start">
              <h2 className="text-2xl font-bold text-green-700 mb-4">{produto.name}</h2>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Pesos</h3>

                {weights.length === 0 ? (
                  <p className="text-gray-500 mt-2">Opções de peso não informadas no banco.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {weights.map((w, index) => {
                      const active = selectedWeight && selectedWeight.id === w.id;
                      const key = w.id ?? `${produto?.prodId ?? id}-peso-${index}`;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedWeight(w)}
                          className={`min-w-[64px] px-2 h-12 flex items-center justify-center rounded-md border text-sm select-none ${
                            active ? "bg-green-700 text-white border-green-700" : "bg-gray-100 text-gray-700 border-gray-300 hover:border-green-500"
                          }`}
                          aria-pressed={active}
                        >
                          <div className="text-center">
                            <div className="font-bold text-sm">{w.label}</div>
                            {w.price != null && <div className="text-xs">R$ {Number(w.price).toFixed(2)}</div>}
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
                <button type="button" aria-label="Adicionar ao carrinho" onClick={handleAdd} className="bg-green-700 w-full h-10 hover:bg-green-800 text-sm text-white rounded-sm flex items-center justify-center gap-2">
                  Adicionar ao carrinho
                  <FaCartPlus size={16} className="inline-block" />
                </button>
              </div>

              <hr className="my-4 text-gray-300" />

              <div>
                <p>
                  <strong>Descrição:</strong>
                </p>
                <p>{produto.description ?? "Sem descrição disponível."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
