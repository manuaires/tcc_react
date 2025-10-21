import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";

export default function Usuario() {
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  // Busca dados do usuário logado
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const userId = decoded.id ?? decoded.userId;

      const fetchUserData = async () => {
        try {
          const response = await api.get(`/usuarios/${userId}`);
          setFormData(response.data);
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
        }
      };

      fetchUserData();
    } catch (error) {
      console.error("Token inválido:", error);
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id ?? decoded.userId;

      await api.put(`/usuarios/${userId}`, formData);
      alert("Dados atualizados com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      alert("Ocorreu um erro ao salvar suas alterações.");
    }
  };

  if (!formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          Carregando dados do usuário...
        </div>
      </div>
    );
  }

  return (
    <>
      <NavBar initialGreen={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mt-25">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Editar Perfil
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => {
              // Campos que o usuário não deve editar
              if (["id", "createdAt", "updatedAt"].includes(field)) return null;

              return (
                <div key={field}>
                  <label className="block text-gray-700 mb-1 capitalize">
                    {field === "senha"
                      ? "Nova Senha"
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
                    value={formData[field] ?? ""}
                    onChange={handleChange}
                    required={
                      ["nome", "email", "telefone"].includes(field)
                        ? true
                        : false
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                </div>
              );
            })}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
            >
              Salvar Alterações
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
