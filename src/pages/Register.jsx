import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({}); // Inicializa como objeto vazio

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await api.get("/clientes/columns");
        const columns = response.data;
        const initialData = {};
        columns.forEach((col) => {
          initialData[col] = "";
        });
        setFormData(initialData);
      } catch (error) {
        console.error("Erro ao buscar colunas:", error);
      }
    };

    fetchColumns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados enviados:", formData);
    // Aqui você pode chamar sua API com axios, ex:
    // axios.post("/clientes", formData)
  };

  // Só renderiza o formulário se formData estiver pronto
  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          Carregando...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
          Cadastro de Cliente
        </h2>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 mb-1">Nome Completo</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              name="senha"
              value={formData.senha}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Telefone</label>
            <input
              type="tel"
              name="telefone"
              value={formData.telefone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Endereço</label>
            <textarea
              name="endereco"
              value={formData.endereco}
              onChange={handleChange}
              rows="2"
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-green-600 hover:underline">
            Faça login
          </Link>
        </p>
      </div>
    </div>
  );
}
