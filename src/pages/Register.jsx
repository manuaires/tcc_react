import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";

export default function Register() {
  const [formData, setFormData] = useState({}); // Inicializa como objeto
  const navigate = useNavigate(); // Novo

  useEffect(() => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      telefone: "",
      cep: "",
      numero: "",
      complemento: "",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.post("/cadastro", formData);
    console.log("Dados enviados:", response.data);
    navigate("/"); // Redireciona
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
    <>
      <NavBar initialGreen={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Cadastro de Cliente
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {field == "senha"
                    ? "Senha"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type={
                    field == "senha"
                      ? "password"
                      : field == "email"
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
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Cadastrar
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-4">
            <span className="pe-1">Já tem uma conta?</span>
            <Link to="/login" className="text-green-600 hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
