import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";
import { FaCartPlus } from "react-icons/fa6";
import Toast from "../components/messages/Toast"; // ✅ IMPORT DO TOAST

export default function View() {
  const { categoria, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [produto, setProduto] = useState(null);
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [codigo, setCodigo] = useState(null);
  const [codigoLoading, setCodigoLoading] = useState(false);

  const [toast, setToast] = useState(false); // ✅ ESTADO DO TOAST

  const outlet = useOutletContext?.() || {};
  const { addToCart } = outlet;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProduto(null);
      setWeights([]);
      setSelectedWeight(null);
      setCodigo(null);
      setCodigoLoading(false);

      try {
        const cat = String(categoria || "").toLowerCase();

        const normalize = (data) => {
          if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
          return data ?? null;
        };

        const extractNumberFrom = (v) => {
          if (v === null || v === undefined) return null;
          const s = String(v);
          const numeric = s.replace(/[^\d.,]/g, "").replace(",", ".");
          const parsed = parseFloat(numeric);
          if (!Number.isNaN(parsed)) {
            return Number.isInteger(parsed) ? parsed : parsed;
          }
          const digits = s.match(/\d+/);
          return digits ? Number(digits[0]) : s;
        };

        // CEREAIS
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
            prodId:
              prodRaw?.Id_prod ??
              prodRaw?.Id ??
              prodRaw?.id ??
              String(id),
            name:
              prodRaw?.Nome_prod ??
              prodRaw?.Nome ??
              prodRaw?.nome ??
              "Produto",
            image: prodRaw?.Foto_prod ?? prodRaw?.Foto ?? prodRaw?.foto ?? null,
            description:
              prodRaw?.Descricao_prod ??
              prodRaw?.Descricao ??
              prodRaw?.descricao ??
              null,
            raw: prodRaw,
          };

          setProduto(display);
          const prodId = display.prodId;

          try {
            const ensResp = await api.get(
              `/ensacados/produto/${encodeURIComponent(prodId)}`
            );
            const ensArr = Array.isArray(ensResp.data) ? ensResp.data : [];

            const hasIdProdField = ensArr.some((e) =>
              [e?.Id_prod, e?.id_prod, e?.IdProd, e?.produto_id].some(
                (x) => x !== undefined
              )
            );

            let matched;
            if (hasIdProdField) {
              matched = ensArr.filter((e) => {
                const eProdId =
                  e?.Id_prod ??
                  e?.id_prod ??
                  e?.IdProd ??
                  e?.produto_id ??
                  null;
                return (
                  eProdId !== null &&
                  String(eProdId) === String(prodId)
                );
              });
            } else {
              matched = ensArr;
            }

            const mapped = (matched || []).map((e, idx) => {
              const idFallback =
                e?.Id_ens ?? e?.Id ?? e?.id ?? e?._id ?? `${prodId}-ens-${idx}`;
              const pesoVal =
                e?.Peso_ens ??
                e?.Peso ??
                e?.peso ??
                e?.peso_ens ??
                e?.peso_kg ??
                null;
              const pesoNum = extractNumberFrom(pesoVal);
              const label =
                pesoNum != null ? `${pesoNum} kg` : `Peso ${idx + 1}`;
              const price =
                e?.Preco_ens ??
                e?.Preco ??
                e?.preco ??
                e?.price ??
                null;

              return {
                id: String(idFallback),
                label,
                peso: pesoNum,
                price,
                raw: e,
              };
            });

            const byPeso = new Map();
            for (const m of mapped) {
              const key = m.peso != null ? String(m.peso) : m.label;
              if (!byPeso.has(key)) byPeso.set(key, m);
              else {
                const existing = byPeso.get(key);
                if (
                  (existing.price == null || existing.price === "") &&
                  m.price != null
                ) {
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
            setWeights([]);
            setSelectedWeight(null);
          }

          setLoading(false);
          return;
        }

        // RAÇÕES / VARIEDADES
        if (cat === "rações" || cat === "variedades") {
          let out = null;

          try {
            const respOut = await api.get(`/outros_produtos/${id}`);
            out = normalize(respOut?.data);
          } catch {
            try {
              const respFallback = await api.get(`/produtos/${categoria}/${id}`);
              out = normalize(respFallback?.data);
            } catch {
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
            description:
              out?.Descricao_out ??
              out?.Descricao ??
              out?.descricao ??
              null,
            raw: out,
          };

          setProduto(displayOut);

          const pesoValCandidate =
            out?.Peso_out ??
            out?.Peso ??
            out?.peso ??
            out?.peso_out ??
            null;
          const pesoNum = extractNumberFrom(pesoValCandidate);

          if (pesoNum !== null && pesoNum !== undefined && pesoNum !== "") {
            const price =
              out?.Preco_out ??
              out?.Preco_med_out ??
              out?.Preco ??
              out?.preco ??
              out?.Preco_med ??
              out?.price ??
              null;

            const w = {
              id: `${displayOut.prodId}-peso-${String(pesoNum)}`,
              label: String(pesoNum),
              peso: pesoNum,
              price,
              raw: out,
            };

            setWeights([w]);
            setSelectedWeight(w);

            const cod =
              out?.Codigo_out ??
              out?.Codigo ??
              out?.CodigoOut ??
              out?.Codigo_outo ??
              null;
            setCodigo(cod ?? null);
          } else {
            setWeights([]);
            setSelectedWeight(null);
            setCodigo(
              out?.Codigo_out ??
                out?.Codigo ??
                out?.CodigoOut ??
                out?.Codigo_outo ??
                null
            );
          }

          setLoading(false);
          return;
        }

        // fallback
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
            prodId:
              fallbackProd?.Id_prod ??
              fallbackProd?.Id ??
              fallbackProd?.id ??
              String(id),
            name:
              fallbackProd?.Nome_prod ??
              fallbackProd?.Nome ??
              fallbackProd?.nome ??
              "Produto",
            image:
              fallbackProd?.Foto_prod ??
              fallbackProd?.Foto ??
              fallbackProd?.foto ??
              null,
            description:
              fallbackProd?.Descricao_prod ??
              fallbackProd?.Descricao ??
              fallbackProd?.descricao ??
              null,
            raw: fallbackProd,
          });
        } finally {
          setLoading(false);
        }
      } catch {
        setProduto(null);
        setWeights([]);
        setSelectedWeight(null);
        setLoading(false);
      }
    };

    fetchData();
  }, [categoria, id]);

  useEffect(() => {
    const fetchCodigoParaCereal = async () => {
      if (!produto) return;
      if (produto.source !== "produto") return;
      if (!selectedWeight) {
        setCodigo(null);
        return;
      }

      const prodId = produto.prodId;
      const peso = selectedWeight.peso;

      if (peso === null || peso === undefined) {
        setCodigo(null);
        return;
      }

      setCodigoLoading(true);
      setCodigo(null);

      try {
        const resp = await api.get(
          `/ensacados/codigo?prodId=${encodeURIComponent(
            prodId
          )}&peso=${encodeURIComponent(peso)}`
        );
        const data = resp?.data ?? [];
        const cod = data.length > 0 ? data[0].codigo : null;
        setCodigo(cod ?? null);
      } catch {
        setCodigo(null);
      } finally {
        setCodigoLoading(false);
      }
    };

    fetchCodigoParaCereal();
  }, [produto, selectedWeight]);

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

  // --------------------------
  //  ADICIONAR AO CARRINHO
  // --------------------------
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
      selectedWeight?.id ??
      selectedWeight?.peso ??
      selectedWeight?.label ??
      "noWeight";

    const composedId = `${prodId}-${weightKey}`;

    const cartItem = {
      id: composedId,
      prodId: String(prodId),
      nomeprod,
      imagem: imagem ? `/produtos/${imagem}` : null,
      price,
      quantity: 1,
      weight: selectedWeight
        ? {
            id: selectedWeight.id,
            label: selectedWeight.label,
            price: selectedWeight.price,
            peso: selectedWeight.peso,
          }
        : null,
      rawProduto: produto.raw,
    };

    try {
      const raw = localStorage.getItem("cart_v1");
      const cart = raw ? JSON.parse(raw) : [];

      const idx = cart.findIndex((it) => it.id === cartItem.id);

      if (idx >= 0) {
        cart[idx].quantity =
          (Number(cart[idx].quantity) || 0) +
          (Number(cartItem.quantity) || 1);
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart_v1", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_v1:updated"));

      // ------- TOAST NO LUGAR DO ALERT -------
      setToast(true);
      setTimeout(() => setToast(false), 2000);

    } catch (e) {
      console.error("Erro ao adicionar ao carrinho:", e);

      setToast(true);
      setTimeout(() => setToast(false), 2000);
    }
  };

  return (
    <>
      <NavBar
        initialGreen={true}
        {...(typeof addToCart === "function" ? { addToCart } : {})}
      />

      <div className="min-h-screen flex items-start md:items-center justify-center bg-gray-100 p-4 pt-20 md:pt-0">
        <div className="bg-white shadow-lg rounded-2xl p-6 md:p-8 w-full max-w-4xl mt-6 md:mt-25 md:min-h-[520px]">
          <div className="flex flex-col md:flex-row gap-6 items-stretch">
            {produto.image ? (
              <div className="w-full md:w-1/2 flex items-center justify-center overflow-hidden rounded-md border border-gray-300 h-full min-h-0">
                <img
                  src={`/produtos/${produto.image}`}
                  alt={produto.name}
                  className="object-cover w-full h-full rounded"
                />
              </div>
            ) : (
              <div className="w-full md:w-1/2 flex items-center justify-center italic text-gray-500 mb-4 h-full min-h-0">
                Sem imagem
              </div>
            )}

            <div className="w-full md:w-1/2 flex flex-col justify-start h-full min-h-0 overflow-hidden">
              <h2 className="text-2xl font-bold text-green-700 mb-4">
                {produto.name}
              </h2>

              {/* PESOS */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Pesos</h3>

                {weights.length === 0 ? (
                  <p className="text-gray-500 mt-2">
                    Opções de peso não informadas.
                  </p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {weights.map((w, index) => {
                      const active =
                        selectedWeight && selectedWeight.id === w.id;

                      const key =
                        w.id ?? `${produto?.prodId ?? id}-peso-${index}`;

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedWeight(w)}
                          className={`w-20 md:w-28 h-10 md:h-12 flex items-center justify-center rounded-md border text-sm select-none ${
                            active
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:border-green-500"
                          }`}
                        >
                          <div className="font-bold text-sm">{w.label}</div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* CÓDIGO */}
              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2">Código</h3>
                <div className="text-lg font-mono">
                  {codigoLoading ? (
                    <span>Carregando código...</span>
                  ) : codigo ? (
                    <span>{codigo}</span>
                  ) : (
                    <span className="text-gray-500">—</span>
                  )}
                </div>
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
                <p>{produto.description ?? "Sem descrição disponível."}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* TOAST AQUI 😍 */}
      <Toast message="Produto adicionado ao carrinho" show={toast} />
    </>
  );
}
