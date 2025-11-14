import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { FaSearch } from "react-icons/fa";
import { IoTrash } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import { IoSend } from "react-icons/io5";

export default function OrderForm({ phone = "5515991782865" }) {
  const PRECO_MIN_FALLBACK = 15.0;
  const ENTREGA_FIXED = "Fretado";

  const navigate = useNavigate();

  useEffect(() => {
    const KEYS_TO_CHECK = [
      "token",
      "auth",
      "user",
      "authorization",
      "access_token",
      "accessToken",
      "jwt",
    ];

    const safeParse = (s) => {
      try {
        return JSON.parse(s);
      } catch {
        return null;
      }
    };

    const findTokenStringInValue = (val) => {
      if (!val) return null;
      if (typeof val === "string") return val;
      if (typeof val === "object") {
        // procura propriedades comuns
        const candidates = [
          "token",
          "accessToken",
          "access_token",
          "authorization",
          "jwt",
          "idToken",
        ];
        for (const k of candidates) {
          if (val[k]) return val[k];
        }
        // se for objeto com campo nested.token por exemplo
        for (const k of Object.keys(val)) {
          const v = val[k];
          if (typeof v === "string" && v.split(".").length === 3) return v;
        }
      }
      return null;
    };

    const getStoredToken = () => {
      // checa chaves padrão
      for (const k of KEYS_TO_CHECK) {
        const raw = localStorage.getItem(k);
        if (!raw) continue;
        // se for JSON com token dentro
        const parsed = safeParse(raw);
        const tokenFromParsed = findTokenStringInValue(parsed);
        if (tokenFromParsed) return tokenFromParsed;
        // se for string simples
        const tokenFromString = findTokenStringInValue(raw);
        if (tokenFromString) return tokenFromString;
      }

      // heurística: procurar em 'localStorage' por qualquer valor que pareça JWT
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (KEYS_TO_CHECK.includes(key)) continue;
        const val = localStorage.getItem(key);
        if (!val) continue;
        // tenta parse e extrair token
        const parsed = safeParse(val);
        const t1 = findTokenStringInValue(parsed);
        if (t1) return t1;
        if (typeof val === "string" && val.split(".").length === 3) return val;
      }

      return null;
    };

    const decodeJwtPayload = (token) => {
      try {
        if (!token || typeof token !== "string") return null;
        const raw = token.trim().replace(/^Bearer\s+/i, "");
        if (raw.split(".").length !== 3) return null;
        const payloadB64 = raw.split(".")[1];
        const b64 = payloadB64.replace(/-/g, "+").replace(/_/g, "/");
        const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
        const json = atob(padded);
        return JSON.parse(json);
      } catch (e) {
        console.warn("decodeJwtPayload falhou:", e);
        return null;
      }
    };

    const roleLooksLikeVendedor = (rawRole) => {
      if (rawRole === undefined || rawRole === null) return false;
      const s = String(rawRole).trim().toLowerCase();
      if (!s) return false;
      if (s === "vendedor") return true;
      if (s.includes("vend")) return true; // cobre variantes como 'venda', 'vendedor', etc.
      // se for número e você usa códigos (ex: 2 = vendedor), adicione checks aqui:
      // if (Number(rawRole) === 2) return true;
      return false;
    };

    const check = () => {
      try {
        const token = getStoredToken();

        if (!token) {
          console.warn(
            "Nenhum token encontrado no localStorage (checadas várias chaves)."
          );
          navigate("/");
          return;
        }

        const payload = decodeJwtPayload(token);
        if (payload) {
          // aceita campos diferentes que possam conter o tipo
          const roleCandidates = [
            payload.tipo,
            payload.type,
            payload.role,
            payload.userType,
            payload.Tipo_pes,
          ];
          for (const cand of roleCandidates) {
            if (roleLooksLikeVendedor(cand)) return; // autorizado
          }

          // verifica exp (se existir)
          if (payload.exp && Number(payload.exp) < Date.now() / 1000) {
            console.warn("Token encontrado, mas expirado.");
            navigate("/");
            return;
          }

          // se chegou aqui e não encontrou role => não autorizado
          console.warn(
            "Payload JWT encontrado, mas role/tipo não indica vendedor:",
            payload
          );
          navigate("/");
          return;
        }

        // se não for JWT, tenta interpretar token como JSON string contendo tipo
        const parsed = safeParse(token);
        if (parsed) {
          const cand =
            parsed.tipo ?? parsed.type ?? parsed.role ?? parsed.userType;
          if (roleLooksLikeVendedor(cand)) return;
        }

        // por fim, aceita string simples "vendedor"
        if (roleLooksLikeVendedor(String(token).replace(/(^"|"$)/g, "")))
          return;

        // default: não autorizado
        console.warn(
          "Token presente mas não autorizado. token preview:",
          String(token).slice(0, 80)
        );
        navigate("/");
      } catch (err) {
        console.error("Erro ao checar token:", err);
        navigate("/");
      }
    };

    check();

    const onStorage = (e) => {
      if (
        e.key &&
        (e.key === "token" || e.key === "auth" || e.key === "user")
      ) {
        check();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [navigate]);

  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [contatoTouched, setContatoTouched] = useState(false);
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pagamento, setPagamento] = useState("Dinheiro");

  const [produtosGlobais, setProdutosGlobais] = useState([]);
  const [rows, setRows] = useState([]);

  function parseToNumber(raw) {
    if (raw === null || raw === undefined || raw === "") return null;
    if (typeof raw === "number") return Number(raw);
    const s = String(raw).trim();
    if (s === "") return null;
    const cleaned = s.replace(/[R$\s]/g, "");
    if (cleaned.indexOf(",") > -1 && cleaned.indexOf(".") > -1) {
      return Number(cleaned.replace(/\./g, "").replace(",", ".")) || null;
    }
    if (cleaned.indexOf(",") > -1 && cleaned.indexOf(".") === -1) {
      return Number(cleaned.replace(",", ".")) || null;
    }
    const n = Number(cleaned);
    return isNaN(n) ? null : n;
  }

  function calcPrecoMinFromBase(base) {
    const b = parseToNumber(base);
    if (!b || b <= 0) return PRECO_MIN_FALLBACK;
    return Math.round(b * 1.15 * 100) / 100;
  }

  function findPriceInObject(obj, seen = new Set()) {
    if (!obj || typeof obj !== "object") return null;
    if (seen.has(obj)) return null;
    seen.add(obj);

    for (const k of Object.keys(obj)) {
      if (/preco|valor|price/i.test(k)) {
        const v = parseToNumber(obj[k]);
        if (v && v > 0) return v;
      }
    }

    for (const k of Object.keys(obj)) {
      try {
        const v = obj[k];
        if (v && typeof v === "object") {
          const nested = findPriceInObject(v, seen);
          if (nested && nested > 0) return nested;
        } else {
          if (/^id$|^codigo$|quantidade|peso|foto/i.test(k)) continue;
          const parsed = parseToNumber(v);
          if (parsed && parsed > 0) return parsed;
        }
      } catch (e) {
        void e;
      }
    }
    return null;
  }

  useEffect(() => {
    if (rows.length === 0) addRow();

    (async () => {
      try {
        const [listC, listO] = await Promise.all([
          api
            .get("/ensacados")
            .then((r) => r.data)
            .catch(() => []),
          api
            .get("/produtos")
            .then((r) => r.data)
            .catch(() => []),
        ]);

        const norm = (it, table) => {
          const rawId = it.Id ?? it.Id_ens ?? it.Id_out ?? it.id ?? "";
          const nome =
            it.Nome ||
            it.Nome_ens ||
            it.Nome_out ||
            it.descricao ||
            it.Nome_produto ||
            "";
          const maybe = parseToNumber(
            it.Preco ??
              it.Preco_ens ??
              it.Preco_med_out ??
              it.Preco_out ??
              it.Preco_outro
          );
          const fallback = maybe && maybe > 0 ? maybe : findPriceInObject(it);
          const precoBase = fallback && fallback > 0 ? fallback : null;
          const precoMin = precoBase
            ? calcPrecoMinFromBase(precoBase)
            : PRECO_MIN_FALLBACK;

          return {
            id: `${table}_${String(rawId)}`,
            origId: String(rawId || ""),
            table,
            nome: String(nome || "").trim(),
            peso: it.Peso ?? it.Peso_ens ?? it.Peso_out ?? null,
            codigo:
              it.Codigo ??
              it.Codigo_ens ??
              it.Codigo_out ??
              it.Codigo_produto ??
              null,
            precoBase,
            precoMin,
            raw: it,
          };
        };

        setProdutosGlobais([
          ...(Array.isArray(listC) ? listC : []).map((it) => norm(it, "ens")),
          ...(Array.isArray(listO) ? listO : []).map((it) => norm(it, "out")),
        ]);
      } catch (err) {
        console.warn("Erro ao carregar produtos", err);
        setProdutosGlobais([]);
      }
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addRow(selectedProduct = null, qty = 1) {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
        produtoId: selectedProduct ? selectedProduct.id : "",
        produtoNome: selectedProduct ? selectedProduct.nome : "",
        quantidade: qty,
        precoUnit: "",
        precoMin: selectedProduct
          ? selectedProduct.precoMin ?? PRECO_MIN_FALLBACK
          : PRECO_MIN_FALLBACK,
      },
    ]);
  }

  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function onQuantidadeChange(id, q) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantidade: q } : r))
    );
  }

  function onPrecoUnitChange(id, preco) {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, precoUnit: preco } : r))
    );
  }

  function priceBelowMinExists() {
    return rows.some((r) => {
      const val = parseFloat(r.precoUnit || 0);
      return val > 0 && val < (Number(r.precoMin) || PRECO_MIN_FALLBACK);
    });
  }

  function formatCurrency(n) {
    const num = Number(n) || 0;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  }

  const noProducts = produtosGlobais.length === 0;

  function onSelectSuggestion(rowId, produtoId) {
    const prod = produtosGlobais.find((p) => p.id === produtoId);
    if (!prod) {
      setRows((prev) =>
        prev.map((r) =>
          r.id === rowId
            ? {
                ...r,
                produtoId: produtoId,
                produtoNome: "",
                precoMin: PRECO_MIN_FALLBACK,
              }
            : r
        )
      );
      return;
    }

    setRows((prev) =>
      prev.map((r) =>
        r.id === rowId
          ? {
              ...r,
              produtoId: prod.id,
              produtoNome: prod.nome,
              precoMin: prod.precoMin ?? PRECO_MIN_FALLBACK,
            }
          : r
      )
    );
  }

  function calcularTotal() {
    return rows.reduce((acc, r) => {
      const p = parseFloat(r.precoUnit || 0);
      const q = Number(r.quantidade || 1);
      return acc + (p > 0 ? p * q : 0);
    }, 0);
  }

  function montarMensagem(contatoParaMostrar = null) {
    const contatoLimpo =
      contatoParaMostrar ?? String(contato || "").replace(/\D/g, "");

    const header = [
      "Novo Orçamento, vendedor",
      `De: ${contatoLimpo || phone}`, // mostra o contato do formulário; se vazio usa phone como fallback
      `Nome: ${nome || "[não informado]"}`,
    ];

    const lines = [...header, "Item:"];
    let idx = 1;
    rows.forEach((r) => {
      if (!r.produtoNome) return;
      const q = Number(r.quantidade || 1);
      const precoUnit = parseFloat(r.precoUnit || 0);
      const precoUnitText =
        precoUnit > 0
          ? `(${formatCurrency(precoUnit)})`
          : "(preço uni não informado)";
      lines.push(`${idx}. ${q} x ${r.produtoNome} ${precoUnitText}`);
      idx++;
    });

    const total = calcularTotal();
    lines.push(`Total: ${formatCurrency(total)}`);

    const enderecoMain = [rua, bairro, cidade].filter(Boolean).join(", ");
    const parts = [];
    if (enderecoMain) parts.push(enderecoMain);
    if (cep) parts.push(`CEP: ${cep}`);
    if (numero) parts.push(`Nº ${numero}`);
    if (complemento) parts.push(`Compl.: ${complemento}`);

    lines.push("---");
    lines.push(`Endereço: ${parts.join(", ") || "[endereço não informado]"}`);
    lines.push(`Entrega: ${ENTREGA_FIXED}`);
    lines.push(`Pagamento: ${pagamento}`);

    return lines.join("\n");
  }

  function validarContato(value) {
    if (!value) return false;
    const onlyDigits = String(value).replace(/\D/g, "");
    return /^\d{13}$/.test(onlyDigits);
  }

  async function enviarWhatsApp() {
    if (noProducts) {
      alert("Não é possível enviar: nenhum produto cadastrado.");
      return;
    }

    // limpa o contato do cliente (apenas dígitos)
    const contatoLimpo = String(contato || "").replace(/\D/g, "");

    if (!validarContato(contatoLimpo)) {
      alert(
        "Contato inválido. Use exatamente 13 dígitos no formato 5515xxxxxxxxx"
      );
      return;
    }
    if (priceBelowMinExists()) {
      alert("Existe item com preço abaixo do mínimo. Corrija.");
      return;
    }

    const mensagem = montarMensagem(contatoLimpo);

    try {
      await api.post("/pedido", {
        cliente: nome,
        contato: contatoLimpo, // envia o número limpo para a API
        endereco: { rua, numero, complemento, bairro, cidade, cep },
        pagamento,
        entrega: ENTREGA_FIXED,
        itens: rows
          .filter((r) => r.produtoNome)
          .map((r) => ({
            produtoId: r.produtoId,
            produtoNome: r.produtoNome,
            quantidade: Number(r.quantidade || 1),
            precoUnitario: r.precoUnit ? Number(r.precoUnit) : null,
          })),
      });
    } catch (err) {
      console.warn("Falha ao salvar pedido", err);
    }

    // abre o wa.me do BOT (phone) — mantemos phone como destino
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-semibold mb-2">Formulário de Pedido</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="md:col-span-2">
          <label>Nome</label>
          <input
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="mt-1 block w-full rounded-md p-2 border border-gray-700"
            placeholder="Ex: João da Silva"
          />
        </div>

        <div>
          <label>Contato</label>
          <input
            value={contato}
            onChange={(e) =>
              setContato(String(e.target.value).replace(/\D/g, "").slice(0, 13))
            }
            onBlur={() => setContatoTouched(true)}
            className="mt-1 block w-full rounded-md p-2 border border-gray-700"
            placeholder="Ex: 5515990909090"
            maxLength={13}
            inputMode="numeric"
          />
          {contatoTouched && !validarContato(contato) ? (
            <div className="text-xs mt-1 text-red-600">
              Formato obrigatório (5515xxxxxxxxx)
            </div>
          ) : null}
        </div>

        <div>
          <label>CEP</label>
          <div className="flex gap-2 mt-1">
            <input
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              className="flex-1 rounded-md p-2 border border-gray-700"
              placeholder="00000-000"
            />
            <button
              type="button"
              onClick={async () => {
                const raw = (cep || "").replace(/\D/g, "");
                if (!raw || raw.length !== 8) return alert("CEP inválido");
                try {
                  const res = await fetch(
                    "https://viacep.com.br/ws/" + raw + "/json/"
                  );
                  const data = await res.json();
                  if (data.erro) return alert("CEP não encontrado");
                  setRua(data.logradouro || "");
                  setBairro(data.bairro || "");
                  setCidade(data.localidade || "");
                } catch {
                  alert("Erro ao buscar CEP");
                }
              }}
              className="px-3 bg-green-600 hover:bg-green-700 text-white rounded-md flex items-center gap-2"
            >
              <FaSearch />
              Buscar
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <input
          value={rua}
          onChange={(e) => setRua(e.target.value)}
          placeholder="Rua"
          className="md:col-span-2 rounded-md p-2 border border-gray-700"
        />
        <input
          value={numero}
          onChange={(e) => setNumero(e.target.value)}
          placeholder="Número"
          className="rounded-md p-2 border border-gray-700"
        />
        <input
          value={bairro}
          onChange={(e) => setBairro(e.target.value)}
          placeholder="Bairro"
          className="rounded-md p-2 border border-gray-700"
        />
        <input
          value={cidade}
          onChange={(e) => setCidade(e.target.value)}
          placeholder="Cidade"
          className="rounded-md p-2 border border-gray-700"
        />
        <input
          value={complemento}
          onChange={(e) => setComplemento(e.target.value)}
          placeholder="Complemento"
          className="rounded-md p-2 border border-gray-700"
        />
        <div>
          <label>Método de pagamento</label>
          <select
            value={pagamento}
            onChange={(e) => setPagamento(e.target.value)}
            className="mt-1 block w-full rounded-md p-2 border border-gray-700"
          >
            <option>PIX</option>
            <option>Dinheiro</option>
            <option>Cheque</option>
            <option>Boleto</option>
            <option>Depósito bancário</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <label>Itens</label>
        <div className="space-y-3 mt-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex flex-col md:flex-row items-start md:items-center gap-2"
            >
              <div className="flex-1">
                <select
                  value={r.produtoId || ""}
                  onChange={(e) => onSelectSuggestion(r.id, e.target.value)}
                  className="w-full rounded-md p-2 border border-gray-700"
                >
                  <option value="">-- selecione --</option>
                  {produtosGlobais.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                <div className="text-xs mt-1">
                  Preço mínimo:{" "}
                  {formatCurrency(r.precoMin || PRECO_MIN_FALLBACK)}
                </div>
              </div>

              <input
                type="number"
                min={1}
                value={r.quantidade}
                onChange={(e) =>
                  onQuantidadeChange(r.id, Number(e.target.value || 1))
                }
                className="w-28 rounded-md p-2 border mb-4 border-gray-700"
              />

              <div className="w-40">
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={r.precoUnit}
                  onChange={(e) => onPrecoUnitChange(r.id, e.target.value)}
                  className="w-full rounded-md p-2 mb-4 border border-gray-700"
                  placeholder="Preço unit."
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => removeRow(r.id)}
                  className="px-3 py-2 mb-4 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
                >
                  <IoTrash />
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-3">
          <button
            type="button"
            onClick={() => addRow()}
            className="px-4 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
          >
            + Adicionar item
          </button>
        </div>
      </div>

      {noProducts ? (
        <div className="mb-4 text-sm text-red-600">
          Nenhum produto cadastrado — não é possível enviar pedidos.
        </div>
      ) : null}

      <div className="flex items-center justify-between border-t pt-4 mt-4">
        <div>
          <div>
            Total: <strong>{formatCurrency(calcularTotal())}</strong>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={enviarWhatsApp}
            disabled={
              priceBelowMinExists() || noProducts || !validarContato(contato)
            }
            className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
              priceBelowMinExists() || noProducts || !validarContato(contato)
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-700 hover:bg-green-800"
            }`}
          >
            <IoSend />
            Enviar para WhatsApp
          </button>
          <button
            type="button"
            onClick={() => {}}
            className="px-4 py-2 rounded-md border flex items-center gap-2 bg-slate-700 hover:bg-slate-800 text-white"
          >
            <IoMdRefresh />
            Atualizar preview
          </button>
        </div>
      </div>

      <div className="mt-6">
        <h3>Pré-visualização</h3>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm border border-gray-700">
          {montarMensagem()}
        </pre>
      </div>
    </div>
  );
}
