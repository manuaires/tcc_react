import React, { useEffect, useState } from "react";
import api from "../../api";
import { IoTrash } from "react-icons/io5";
import { IoMdRefresh } from "react-icons/io";
import { IoSend } from "react-icons/io5";
import { useLocation } from "react-router-dom";

export default function OrderForm({ phone = "5515991782865" }) {
  const ENTREGA_FIXED = "Fretado";

  // campos que vamos exibir (apenas leitura para nome do usuário e produtos)
  const [nome, setNome] = useState("");
  const [contato, setContato] = useState("");
  const [cep, setCep] = useState("");
  const [rua, setRua] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [cidade, setCidade] = useState("");
  const [complemento, setComplemento] = useState("");
  const [pagamento, setPagamento] = useState("Dinheiro");

  // itens/linhas: produtoNome em readOnly, quantidade editável
  const [rows, setRows] = useState([]);

  const location = useLocation();

  // util: decodifica payload JWT sem dependência externa
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
    } catch {
      return null;
    }
  };

  // monta nome da row a partir do item do carrinho
  const buildRowName = (it) => {
    const baseName =
      it.nomeprod ??
      it.nome ??
      it.produtoNome ??
      (it.rawProduto && (it.rawProduto.name || it.rawProduto.Nome_prod)) ??
      (it.raw && (it.raw.Nome_out || it.raw.Nome_prod || it.raw.Nome)) ??
      "";

    let weight = null;
    if (
      it &&
      it.weight &&
      it.weight.peso !== undefined &&
      it.weight.peso !== null
    ) {
      weight = it.weight.peso;
    } else if (it && it.raw) {
      weight = it.raw.Peso ?? it.raw.Peso_ens ?? it.raw.Peso_out ?? null;
    }

    let weightUnit = null;
    if (it && it.weight && it.weight.pesoUnit) {
      weightUnit = it.weight.pesoUnit;
    } else if (it && it.raw) {
      weightUnit = it.raw.Unidade ?? it.raw.Unidade_peso ?? null;
    }

    if (weight !== null && weight !== "") {
      const unit = weightUnit ? String(weightUnit).trim() : "kg";
      return `${baseName} ${weight}${unit}`.trim();
    }

    return (baseName || "").trim();
  };

  // popula rows a partir do state (navigate) ou do localStorage.cart_v1
  useEffect(() => {
    const buildRowsFromCartItems = (items) => {
      if (!Array.isArray(items) || items.length === 0) return null;

      const mapped = items.map((it, idx) => {
        const quantidade =
          Number(it.quantity ?? it.quantidade ?? it.qty ?? it.qtd) || 1;
        const produtoNome =
          buildRowName(it) || (it.nomeprod ?? it.produtoNome ?? "");
        return {
          id: it.id ?? `r_${idx}_${String(Math.random()).slice(2, 8)}`,
          produtoId: it.prodId ?? it.produtoId ?? "",
          produtoNome,
          quantidade,
        };
      });

      return mapped;
    };

    const itemsFromState = location?.state?.items;
    let rowsFromCart = null;
    if (itemsFromState && Array.isArray(itemsFromState)) {
      rowsFromCart = buildRowsFromCartItems(itemsFromState);
    }

    if (!rowsFromCart) {
      try {
        const raw = localStorage.getItem("cart_v1");
        const arr = raw ? JSON.parse(raw) : [];
        rowsFromCart = buildRowsFromCartItems(Array.isArray(arr) ? arr : []);
      } catch {
        rowsFromCart = null;
      }
    }

    if (rowsFromCart && rowsFromCart.length > 0) {
      setRows(rowsFromCart);
    } else {
      setRows([
        { id: "r_empty_1", produtoId: "", produtoNome: "", quantidade: 1 },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const payload = decodeJwtPayload(token);
        const userId = payload?.id ?? payload?.userId ?? payload?.sub;
        if (!userId) return;

        const res = await api.get(`/usuarios/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res?.data ?? {};

        const parseTelefone = (tel) => {
          if (!tel) {
            return { telefoneFull: "", paisCodigo: "+55", telefone: "" };
          }
          const digits = String(tel).replace(/\D/g, "");
          if (digits.length > 11) {
            const national = digits.slice(-11);
            const dial = digits.slice(0, digits.length - 11);
            return {
              telefoneFull: digits,
              paisCodigo: `+${dial}`,
              telefone: national,
            };
          }
          const national = digits.slice(-11);
          return {
            telefoneFull: digits,
            paisCodigo: "+55",
            telefone: national,
          };
        };

        const telef = parseTelefone(data.telefone);

        setNome(data.nome ?? data.Nome ?? "");
        setContato(telef.telefoneFull || "");
        setCep((data.endereco && (data.endereco.cep ?? "")) || "");
        setRua((data.endereco && (data.endereco.rua ?? "")) || "");
        setNumero((data.endereco && (data.endereco.numero ?? "")) || "");
        setBairro((data.endereco && (data.endereco.bairro ?? "")) || "");
        setCidade((data.endereco && (data.endereco.cidade ?? "")) || "");
        setComplemento(
          (data.endereco && (data.endereco.complemento ?? "")) || ""
        );
        setPagamento(data.pagamento ?? "Dinheiro");
      } catch (err) {
        console.warn("Falha ao buscar dados do usuário:", err);
      }
    };

    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // helper de validação de contato
  function validarContato(value) {
    if (!value) return false;
    const onlyDigits = String(value).replace(/\D/g, "");
    return /^\d{13}$/.test(onlyDigits);
  }

  // enviar para backend + abrir wa.me
  async function enviarWhatsApp() {
    const contatoLimpo = String(contato || "").replace(/\D/g, "");
    if (!validarContato(contatoLimpo)) {
      alert(
        "Contato inválido. Use exatamente 13 dígitos no formato 5515xxxxxxxxx"
      );
      return;
    }

    const mensagem = montarMensagem(contatoLimpo);

    try {
      // envia pedido ao backend com dados essenciais (sem preços)
      await api.post("/pedido", {
        cliente: nome,
        contato: contatoLimpo,
        endereco: { rua, numero, complemento, bairro, cidade, cep },
        pagamento,
        entrega: ENTREGA_FIXED,
        itens: rows
          .filter((r) => r.produtoNome)
          .map((r) => ({
            produtoId: r.produtoId,
            produtoNome: r.produtoNome,
            quantidade: Number(r.quantidade || 1),
          })),
      });
    } catch (err) {
      // apenas loga — permite abrir o WhatsApp mesmo se a API falhar
      console.warn("Falha ao salvar pedido", err);
    }

    // abre o wa.me do BOT (phone)
    window.open(
      `https://wa.me/${phone}?text=${encodeURIComponent(mensagem)}`,
      "_blank"
    );
  }

  // confirmação antes de remover
  function removeRow(id) {
    const row = rows.find((r) => r.id === id);
    const label = row?.produtoNome || "este item";
    const ok = window.confirm(
      `Você tem certeza que quer retirar esse item?\n\n${label}`
    );
    if (!ok) return;
    setRows((prev) => prev.filter((r) => r.id !== id));
    // opcional: também atualizar localStorage.cart_v1 para manter sincronizado com sidebar
    try {
      const raw = localStorage.getItem("cart_v1");
      if (raw) {
        const arr = JSON.parse(raw);
        if (Array.isArray(arr)) {
          const next = arr.filter((it) => {
            // tenta casar por id/prodId/nome
            if (it.id && id && String(it.id) === String(id)) return false;
            const candidateName =
              buildRowName(it) || it.nomeprod || it.produtoNome || "";
            if (
              candidateName &&
              row &&
              row.produtoNome &&
              candidateName === row.produtoNome
            ) {
              // remove one matching item (first occurrence)
              return false;
            }
            return true;
          });
          localStorage.setItem("cart_v1", JSON.stringify(next));
          window.dispatchEvent(new Event("cart_v1:updated"));
        }
      }
    } catch {
      // ignore
    }
  }

  // quantidade editável
  function onQuantidadeChange(id, q) {
    const qty = Math.max(1, Number(q) || 1);
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, quantidade: qty } : r))
    );
    // opcional: atualizar localStorage.cart_v1 para espelhar quantidade no sidebar
    try {
      const raw = localStorage.getItem("cart_v1");
      if (!raw) return;
      const arr = JSON.parse(raw);
      if (!Array.isArray(arr)) return;
      const next = arr.map((it) => {
        if (String(it.id) === String(id) || String(it.prodId) === String(id)) {
          return { ...it, quantity: qty, quantidade: qty, qty, qtd: qty };
        }
        // tenta casar por nome quando id não estiver presente
        const candidateName =
          buildRowName(it) || it.nomeprod || it.produtoNome || "";
        if (
          candidateName &&
          rows.find((r) => r.id === id && r.produtoNome === candidateName)
        ) {
          return { ...it, quantity: qty, quantidade: qty, qty, qtd: qty };
        }
        return it;
      });
      localStorage.setItem("cart_v1", JSON.stringify(next));
      window.dispatchEvent(new Event("cart_v1:updated"));
    } catch {
      // ignore
    }
  }

  function montarMensagem(contatoParaMostrar = null) {
    const contatoLimpo =
      contatoParaMostrar ?? String(contato || "").replace(/\D/g, "");
    const header = [
      "Novo Orçamento, usuário",
      `De: ${contatoLimpo || phone}`,
      `Nome: ${nome || "[não informado]"}`,
    ];
    const lines = [...header, "Itens:"];
    let idx = 1;
    rows.forEach((r) => {
      if (!r.produtoNome) return;
      const q = Number(r.quantidade || 1);
      lines.push(`${idx}. ${q} x ${r.produtoNome}`);
      idx++;
    });
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

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-3xl font-semibold mb-6 text-center text-green-700">
        Finalizar Pedido
      </h2>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Dados do Usuário</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm text-gray-700 mb-1">Nome</label>
            <input
              value={nome}
              readOnly
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 bg-gray-50"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-1">Contato</label>
            <input
              value={contato}
              readOnly
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 bg-gray-50"
              inputMode="numeric"
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-gray-700 mb-1">Endereço</label>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
              <input
                value={cep}
                readOnly
                className="col-span-2 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="CEP"
              />
              <input
                value={rua}
                readOnly
                className="col-span-4 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Rua"
              />
              <input
                value={numero}
                readOnly
                className="col-span-1 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Nº"
              />
              <input
                value={bairro}
                readOnly
                className="col-span-2 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Bairro"
              />
              <input
                value={cidade}
                readOnly
                className="col-span-2 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Cidade"
              />
              <input
                value={complemento}
                readOnly
                className="col-span-2 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Complemento"
              />
            </div>
          </div>

          <div className="md:col-span-3">
            <label className="block text-sm text-gray-700 mb-1">
              Método de pagamento
            </label>
            <select
              value={pagamento}
              onChange={(e) => setPagamento(e.target.value)}
              className="mt-1 block w-full rounded-md p-2 border border-gray-300 bg-white"
            >
              <option>PIX</option>
              <option>Dinheiro</option>
              <option>Cheque</option>
              <option>Boleto</option>
              <option>Depósito bancário</option>
            </select>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Itens</h3>

        <div className="space-y-3">
          {rows.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded"
            >
              <input
                value={r.produtoNome}
                readOnly
                className="flex-1 rounded-md p-2 border border-gray-300 bg-gray-50"
                placeholder="Nome do produto"
              />
              <input
                type="number"
                min={1}
                value={r.quantidade}
                onChange={(e) => onQuantidadeChange(r.id, e.target.value)}
                className="w-24 rounded-md p-2 border border-gray-300 bg-white"
              />
              <button
                type="button"
                onClick={() => removeRow(r.id)}
                className="px-3 py-2 rounded-md bg-red-600 hover:bg-red-700 text-white flex items-center gap-2"
              >
                <IoTrash />
                Remover
              </button>
            </div>
          ))}
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 border-t pt-4 mt-4">
        <button
          type="button"
          onClick={enviarWhatsApp}
          disabled={!validarContato(contato)}
          className={`px-4 py-2 rounded-md text-white flex items-center gap-2 ${
            !validarContato(contato)
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-700 hover:bg-green-800"
          }`}
        >
          <IoSend />
          Enviar para WhatsApp
        </button>
        <button
          type="button"
          disabled
          className="px-4 py-2 rounded-md border flex items-center gap-2 bg-gray-300 text-white"
        >
          <IoMdRefresh />
          Atualizar preview
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-medium mb-2">Pré-visualização</h3>
        <pre className="whitespace-pre-wrap bg-gray-50 p-4 rounded-md text-sm border border-gray-300">
          {montarMensagem()}
        </pre>
      </div>
    </div>
  );
}
