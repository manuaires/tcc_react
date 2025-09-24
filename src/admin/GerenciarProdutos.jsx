import { useEffect, useState } from "react";
import api from "../api";

export default function AdminDashboard() {
  const [produtos, setProdutos] = useState([]);
  const initialProduto = {
    Nome_prod: "",
    Preco_prod: "",
    Peso_prod: null,
    Ml_prod: null,
    Tipo_prod: "",
    Quantidade_prod: "",
    Codigo_prod: "",
    Foto: null,
    Id_categ: "",
  };
  const [novoProduto, setNovoProduto] = useState(initialProduto);

  const [editando, setEditando] = useState(null); // produto em edição
  const [formEdicao, setFormEdicao] = useState(initialProduto);

  useEffect(() => {
    fetchProdutos();
  }, []);

  const fetchProdutos = async () => {
    try {
      const res = await api.get("/produtos");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produtos/${id}`);
      fetchProdutos();
    } catch (err) {
      console.error("Erro ao excluir:", err);
    }
  };

  // 1) estado inicial claro

  // 4) handleCreate usando normalização
  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      // remove possíveis linhas estranhas que estejam no seu código
      await api.post("/produtos", novoProduto);
      setNovoProduto(initialProduto);
      fetchProdutos();
    } catch (err) {
      console.error("Erro ao criar:", err);
    }
  };

  const handleEditClick = (produto) => {
    setEditando(produto.Id_prod);
    setFormEdicao({
      Nome_prod: produto.Nome_prod,
      Preco_prod: produto.Preco_prod,
      Estoque: produto.Estoque,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/produtos/${editando}`, formEdicao);
      setEditando(null);
      fetchProdutos();
    } catch (err) {
      console.error("Erro ao atualizar:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
        Painel do Administrador
      </h1>

      {/* Formulário de criação */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 max-w-2xl mx-auto">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Adicionar Produto
        </h2>
        <form
          onSubmit={handleCreate}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Nome"
            value={novoProduto.Nome_prod}
            onChange={(e) =>
              setNovoProduto({ ...novoProduto, Nome_prod: e.target.value })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Preço"
            value={novoProduto.Preco_prod}
            onChange={(e) =>
              setNovoProduto({
                ...novoProduto,
                Preco_prod: Number(e.target.value),
              })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Peso (Kg)"
            value={novoProduto.Peso_prod}
            onChange={(e) => {
              const value = e.target.value;
              setNovoProduto({
                ...novoProduto,
                Peso_prod: value === "" || value === 0 ? null : Number(value),
              });
            }}
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={novoProduto.Quantidade_prod}
            onChange={(e) =>
              setNovoProduto({
                ...novoProduto,
                Quantidade_prod: Number(e.target.value),
              })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Capacidade (ml)"
            value={novoProduto.Ml_prod ?? ""} // mostra vazio se for null
            onChange={(e) => {
              const value = e.target.value;
              setNovoProduto({
                ...novoProduto,
                Ml_prod: value === "" || value === 0 ? null : Number(value),
              });
            }}
            className="border p-2 rounded"
          />

          <input
            type="text"
            placeholder="Tipo"
            value={novoProduto.Tipo_prod}
            onChange={(e) =>
              setNovoProduto({
                ...novoProduto,
                Tipo_prod: e.target.value,
              })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Codigo"
            value={novoProduto.Codigo_prod}
            onChange={(e) =>
              setNovoProduto({
                ...novoProduto,
                Codigo_prod: e.target.value,
              })
            }
            required
            className="border p-2 rounded"
          />
          <input
            type="number"
            placeholder="Id_categ"
            value={novoProduto.Id_categ}
            onChange={(e) =>
              setNovoProduto({
                ...novoProduto,
                Id_categ: Number(e.target.value),
              })
            }
            required
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="col-span-1 sm:col-span-3 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Criar
          </button>
        </form>
      </div>

      {/* Tabela de produtos */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-left border-collapse">
          <thead className="bg-green-600 text-white">
            <tr>
              <th className="py-2 px-4">ID</th>
              <th className="py-2 px-4">Nome</th>
              <th className="py-2 px-4">Preço</th>
              <th className="py-2 px-4">Quantidade</th>
              <th className="py-2 px-4">Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.map((prod) => (
              <tr key={prod.Id_prod} className="border-b hover:bg-gray-50">
                <td className="py-2 px-4">{prod.Id_prod}</td>
                <td className="py-2 px-4">{prod.Nome_prod}</td>
                <td className="py-2 px-4">R$ {prod.Preco_prod}</td>
                <td className="py-2 px-4">{prod.Quantidade_prod}</td>
                <td className="py-2 px-4 space-x-2">
                  <button
                    onClick={() => handleEditClick(prod)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(prod.Id_prod)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de edição */}
      {editando && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-700">
              Editar Produto #{editando}
            </h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Nome"
                value={formEdicao.Nome_prod}
                onChange={(e) =>
                  setFormEdicao({ ...formEdicao, Nome_prod: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                placeholder="Preço"
                value={formEdicao.Preco_prod}
                onChange={(e) =>
                  setFormEdicao({ ...formEdicao, Preco_prod: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <input
                type="number"
                placeholder="Estoque"
                value={formEdicao.Estoque}
                onChange={(e) =>
                  setFormEdicao({ ...formEdicao, Estoque: e.target.value })
                }
                className="border p-2 w-full rounded"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditando(null)}
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
