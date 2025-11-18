import { useState, useEffect } from "react";
import api from "../api";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import { jwtDecode } from "jwt-decode";
import Toast from "../components/messages/Toast";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Login() {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({ email: "", senha: "" });
    setLoading(false);
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type }), 2500);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/login", formData);
      const decoded = jwtDecode(response.data.token);

      localStorage.setItem("userId", decoded.id);
      localStorage.setItem("userName", decoded.nome);
      localStorage.setItem("userType", decoded.tipo);
      localStorage.setItem("token", response.data.token);

      window.dispatchEvent(new Event("authChanged"));

      showToast("Login realizado com sucesso!", "success");

      setTimeout(() => navigate("/"), 1200);
    } catch (error) {
      showToast("Erro ao fazer login: verifique seus dados.", "error");
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
    <>
      <NavBar initialGreen={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Login
          </h2>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {Object.keys(formData).map((field) => (
              <div key={field}>
                <label className="block text-gray-700 mb-1 capitalize">
                  {field == "senha"
                    ? "Senha"
                    : field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <div className="relative">
                  <input
                    type={field === "senha" && !showPassword ? "password" : field === "senha" ? "text" : field === "email" ? "email" : "text"}
                    name={field}
                    value={formData[field]}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                  />
                  {field === "senha" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                    >
                      {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                    </button>
                  )}
                </div>
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Entrar
            </button>
          </form>
          <p className="text-center text-sm text-gray-600 mt-4">
            <span className="pe-1">Não tem uma conta?</span>
            <Link to="/register" className="text-green-600 hover:underline">
              Cadastre-se
            </Link>
          </p>
        </div>
      </div>

      <Toast message={toast.message} show={toast.show} type={toast.type} />
    </>
  );
}
