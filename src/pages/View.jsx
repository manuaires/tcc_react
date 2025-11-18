import { useEffect, useState } from "react";
import { useParams, useOutletContext } from "react-router-dom";
import api from "../api";
import NavBar from "../components/navbar/NavBar";
import { FaCartPlus } from "react-icons/fa6";
import Toast from "../components/messages/Toast";

export default function View() {
  const { categoria, id } = useParams();
  const [loading, setLoading] = useState(true);
  const [produto, setProduto] = useState(null);

  // pesos (cada item terá agora btnId: 1..n, pesoValue, pesoUnit)
  const [weights, setWeights] = useState([]);
  const [selectedWeight, setSelectedWeight] = useState(null);
  const [selectedBtnId, setSelectedBtnId] = useState(null);

  // lista completa de códigos retornada pela API (com parsedPeso)
  const [codigosList, setCodigosList] = useState([]);
  const [codigo, setCodigo] = useState(null);
  const [codigoLoading, setCodigoLoading] = useState(false);

  const [toast, setToast] = useState(false);

  const outlet = useOutletContext?.() || {};
  const { addToCart } = outlet;

  // --- helpers de peso/unidade ---
  const normalizePesoString = (s) => {
    if (s == null) return "";
    return String(s).trim();
  };

  // Extrai número e unidade de uma string (ex: "25 kg", "500ml", "6", "25,5kg")
  const parsePeso = (raw, fallbackName) => {
    // tenta a própria raw
    let s = raw == null ? "" : String(raw).trim();

    // se raw vazio, tenta extrair da fallbackName (ex.: nome do produto contém "500ml")
    if ((!s || s === "") && fallbackName) {
      s = String(fallbackName).trim();
    }

    if (!s) return { value: null, unit: null, raw: raw };

    // procura padrões como "500ml", "25 kg", "6kg", "6 kg x12" etc
    const m = s.match(
      /(\d+[.,]?\d*)\s*(kg|g|mg|ml|l|lt|ltrs|un|cx|pack|g\b|kg\b|ml\b|mg\b)/i
    );
    if (m) {
      const num = parseFloat(m[1].replace(",", "."));
      const unit = String(m[2]).toLowerCase();
      return { value: Number.isFinite(num) ? num : null, unit, raw: raw };
    }

    // se não encontrou unidade explícita, tenta extrair apenas número
    const n = s.replace(/[^0-9,\.]/g, "").replace(",", ".");
    if (n) {
      const parsed = parseFloat(n);
      if (!Number.isNaN(parsed)) return { value: parsed, unit: null, raw: raw };
    }

    return { value: null, unit: null, raw: raw };
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setProduto(null);
      setWeights([]);
      setSelectedWeight(null);
      setSelectedBtnId(null);
      setCodigo(null);
      setCodigosList([]);
      setCodigoLoading(false);

      try {
        const cat = String(categoria || "").toLowerCase();

        const normalize = (data) => {
          if (Array.isArray(data)) return data.length > 0 ? data[0] : null;
          return data ?? null;
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
              prodRaw?.Id_prod ?? prodRaw?.Id ?? prodRaw?.id ?? String(id),
            name:
              prodRaw?.Nome_prod ?? prodRaw?.Nome ?? prodRaw?.nome ?? "Produto",
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
                return eProdId !== null && String(eProdId) === String(prodId);
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

              const parsed = parsePeso(pesoVal, e?.Nome_ens ?? display.name);

              const pesoNum = parsed.value;
              const pesoUnit = parsed.unit;

              const label =
                pesoNum != null
                  ? pesoUnit
                    ? `${pesoNum} ${pesoUnit}`
                    : `${pesoNum} kg` // assume mg quando não informado (cereais geralmente kg)
                  : `Peso ${idx + 1}`;

              const price =
                e?.Preco_ens ?? e?.Preco ?? e?.preco ?? e?.price ?? null;

              return {
                id: String(idFallback),
                label,
                peso: pesoNum,
                pesoUnit,
                price,
                raw: e,
              };
            });

            const byPeso = new Map();
            for (const m of mapped) {
              const key =
                m.peso != null
                  ? String(m.peso) + "|" + (m.pesoUnit || "kg")
                  : m.label;
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

            // -> atribui btnId sequencial (1..n)
            const dedupedWithIds = deduped.map((w, i) => ({
              ...w,
              btnId: i + 1,
            }));

            setWeights(dedupedWithIds);
            setSelectedWeight(
              dedupedWithIds.length > 0 ? dedupedWithIds[0] : null
            );
            setSelectedBtnId(
              dedupedWithIds.length > 0 ? dedupedWithIds[0].btnId : null
            );
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
              const respFallback = await api.get(
                `/produtos/${categoria}/${id}`
              );
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
              out?.Descricao_out ?? out?.Descricao ?? out?.descricao ?? null,
            raw: out,
          };

          setProduto(displayOut);

          // tenta detectar peso + unidade
          const pesoValCandidate =
            out?.Peso_out ?? out?.Peso ?? out?.peso ?? out?.peso_out ?? null;
          const parsedOut = parsePeso(
            pesoValCandidate,
            out?.Nome_out ?? displayOut.name
          );
          const pesoNum = parsedOut.value;
          const pesoUnit = parsedOut.unit;

          if (pesoNum !== null && pesoNum !== undefined && pesoNum !== "") {
            const price =
              out?.Preco_out ??
              out?.Preco_med_out ??
              out?.Preco ??
              out?.preco ??
              out?.Preco_med ??
              out?.price ??
              null;

            // determina a unidade padrão: se for medicamento (contém "Ivermectina" ou similar), usa "mg"; senão usa "kg"
            const productName = String(displayOut.name || "").toLowerCase();
            const isMedication =
              /ivermectina|medicamento|antibiótico|anti-parasit/i.test(
                productName
              );
            const defaultUnit = isMedication ? "mg" : "kg";

            const label = pesoUnit
              ? `${pesoNum} ${pesoUnit}`
              : `${pesoNum} ${defaultUnit}`;

            const w = {
              id: `${displayOut.prodId}-peso-${String(pesoNum)}`,
              label,
              peso: pesoNum,
              pesoUnit,
              price,
              raw: out,
              btnId: 1,
            };

            setWeights([w]);
            setSelectedWeight(w);
            setSelectedBtnId(1);

            const cod =
              out?.Codigo_out ??
              out?.Codigo ??
              out?.CodigoOut ??
              out?.Codigo_outo ??
              null;
            if (cod) setCodigo(cod ?? null);
          } else {
            // sem peso direto no campo, tenta mostrar apenas código direto se houver
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

  /**
   * Busca todos os códigos uma vez por produto e normaliza o campo de peso dos códigos
   */
  useEffect(() => {
    const fetchAllCodigosForProduto = async () => {
      if (!produto) return;

      const prodId = produto.prodId;
      setCodigoLoading(true);
      setCodigo(null);

      try {
        // se "outros_produtos" já tem código direto, evita chamada
        if (produto.source === "outros_produtos") {
          const raw = produto.raw ?? {};
          const directCod =
            raw?.Codigo_out ??
            raw?.Codigo ??
            raw?.CodigoOut ??
            raw?.Codigo_outo ??
            raw?.codigo ??
            null;

          if (directCod) {
            const parsed = parsePeso(
              raw?.Peso_out ?? raw?.Peso ?? raw?.peso ?? raw?.peso_out ?? null,
              produto.name
            );
            setCodigosList([
              { peso: parsed.value, codigo: directCod, parsedPeso: parsed },
            ]);
            setCodigo(directCod);
            setCodigoLoading(false);
            return;
          }
        }

        const resp = await api.get(
          `/ensacados/codigo?prodId=${encodeURIComponent(prodId)}`
        );
        const data = Array.isArray(resp?.data) ? resp.data : [];

        // normaliza cada entrada de código para ter parsedPeso
        const normalized = data.map((d) => {
          const pesoRaw =
            d?.peso ??
            d?.Peso ??
            d?.Peso_ens ??
            d?.peso_en ??
            d?.peso_val ??
            null;
          const parsed = parsePeso(pesoRaw, produto.name);
          return { ...d, parsedPeso: parsed };
        });

        console.info(
          "Array de códigos retornado da API (completo):",
          normalized
        );
        setCodigosList(normalized);

        // decide o código inicial a exibir
        let code = null;

        if (selectedWeight) {
          // procura por correspondência exata (valor + unidade quando disponíveis)
          const matchByPeso = normalized.find((d) => {
            if (!d || !d.parsedPeso) return false;
            if (d.parsedPeso.value == null || selectedWeight.peso == null)
              return false;
            // compara numérico e ignora case de unidade; se uma das unidades for nula, aceita se número bater
            const sameNum =
              Number(d.parsedPeso.value) === Number(selectedWeight.peso);
            const unitA = d.parsedPeso.unit || null;
            const unitB = selectedWeight.pesoUnit || null;
            const sameUnit = !unitA || !unitB ? true : unitA === unitB;
            return sameNum && sameUnit;
          });

          if (matchByPeso) code = matchByPeso.codigo ?? null;
          else {
            const idx = (selectedWeight.btnId ?? selectedBtnId ?? 1) - 1;
            if (idx >= 0 && idx < normalized.length)
              code = normalized[idx]?.codigo ?? null;
            else if (normalized.length > 0)
              code = normalized[0]?.codigo ?? null;
          }
        } else {
          if (normalized.length > 0) code = normalized[0]?.codigo ?? null;
        }

        setCodigo(code);
      } catch (err) {
        console.error("Erro ao buscar códigos:", err);
        setCodigosList([]);
        setCodigo(null);
      } finally {
        setCodigoLoading(false);
      }
    };

    fetchAllCodigosForProduto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [produto]);

  // sempre que selectedWeight mudar, recalcula o codigo usando a lista já carregada (codigosList)
  useEffect(() => {
    if (!selectedWeight) {
      setCodigo(null);
      return;
    }

    const data = codigosList || [];
    let code = null;

    const matchByPeso = data.find((d) => {
      if (!d || !d.parsedPeso) return false;
      if (d.parsedPeso.value == null || selectedWeight.peso == null)
        return false;
      const sameNum =
        Number(d.parsedPeso.value) === Number(selectedWeight.peso);
      const unitA = d.parsedPeso.unit || null;
      const unitB = selectedWeight.pesoUnit || null;
      const sameUnit = !unitA || !unitB ? true : unitA === unitB;
      return sameNum && sameUnit;
    });

    if (matchByPeso) {
      code = matchByPeso.codigo ?? null;
    } else {
      const idx = (selectedWeight.btnId ?? selectedBtnId ?? 1) - 1;
      if (idx >= 0 && idx < data.length) {
        code = data[idx]?.codigo ?? null;
      } else if (data.length > 0) {
        code = data[0]?.codigo ?? null;
      }
    }

    setCodigo(code);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedWeight, codigosList]);

  if (loading) return <p className="p-4">Carregando produto...</p>;

  if (!produto)
    return (
      <>
        <NavBar
          initialGreen={true}
          {...(typeof addToCart === "function" ? { addToCart } : {})}
        />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="bg-white shadow rounded p-6 max-w-lg text-center">
            <h2 className="text-xl font-semibold mb-2">
              Produto não encontrado
            </h2>
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
            pesoUnit: selectedWeight.pesoUnit,
            btnId: selectedWeight.btnId,
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
          (Number(cart[idx].quantity) || 0) + (Number(cartItem.quantity) || 1);
      } else {
        cart.push(cartItem);
      }

      localStorage.setItem("cart_v1", JSON.stringify(cart));
      window.dispatchEvent(new Event("cart_v1:updated"));

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
                          onClick={() => {
                            setSelectedWeight(w);
                            setSelectedBtnId(w.btnId);
                          }}
                          className={`w-18 md:w-15 h-8 md:h-9 flex items-center justify-center rounded-md border text-md select-none ${
                            active
                              ? "bg-green-700 text-white border-green-700"
                              : "bg-gray-100 text-gray-700 border-gray-300 hover:border-green-500"
                          }`}
                          title={w.label}
                          data-btnid={w.btnId}
                        >
                          <div className="font-semibold">{w.label}</div>
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

      <Toast message="Produto adicionado ao carrinho" show={toast} />
    </>
  );
}
