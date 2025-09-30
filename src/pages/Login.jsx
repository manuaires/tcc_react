import { useState, useEffect } from "react";
import api from "../api";
import { Link } from "react-router-dom";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchColumns = async () => {
      try {
        const response = await api.get("/login/columns");
        const columns = response.data;
        const initialData = {};
        columns.forEach((col) => {
          initialData[col] = "";
        });
        setFormData(initialData);
      } catch (error) {
        // fallback para email/senha caso a API falhe
        setFormData({ email: "", senha: "" });
      } finally {
        setLoading(false);
      }
    };
    fetchColumns();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Envia para a API de login
      const response = await api.post("/login", formData);
      // Trate o sucesso (ex: salvar token, redirecionar, etc)
      console.log("Login realizado:", response.data);
    } catch (error) {
      // Trate o erro (ex: mostrar mensagem)
      alert("Erro ao fazer login. Verifique seus dados.");
    }
  };

  if (loading || !formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
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
          Login
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-gray-700 mb-1 capitalize">
                {field === "senha"
                  ? "Senha"
                  : field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={
                  field === "senha"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
          >
            Entrar
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-4">
          Não tem uma conta?{" "}
          <Link to="/register" className="text-green-600 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
