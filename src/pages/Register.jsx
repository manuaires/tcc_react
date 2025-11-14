import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";

const COUNTRY_CODES = [
  { code: "+55", label: "+55 (Brasil)" },
  { code: "+1", label: "+1 (EUA/Canadá)" },
  { code: "+44", label: "+44 (Reino Unido)" },
  { code: "+34", label: "+34 (Espanha)" },
  { code: "+49", label: "+49 (Alemanha)" },
  { code: "+52", label: "+52 (México)" },
  { code: "+39", label: "+39 (Itália)" },
  { code: "+33", label: "+33 (França)" },
  // adicione mais se quiser
];

export default function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      telefone: "", // deve conter apenas DDD + número (11 dígitos)
      paisCodigo: "+55", // código do país selecionado (não conta nos 11 dígitos)
      cep: "",
      numero: "",
      complemento: "",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // garantir que telefone só receba dígitos
    if (name === "telefone") {
      const digits = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: digits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const login = async (credentials) => {
    try {
      const payload = { email: credentials.email, senha: credentials.senha };
      const response = await api.post("/login", payload);
      const decoded = jwtDecode(response.data.token);

      localStorage.setItem("userId", decoded.id ?? decoded.userId ?? "");
      localStorage.setItem("userName", decoded.nome ?? decoded.name ?? "");
      localStorage.setItem("userType", decoded.tipo ?? decoded.type ?? "");
      localStorage.setItem("token", response.data.token);

      window.dispatchEvent(new Event("authChanged"));

      return response;
    } catch (err) {
      console.error("Erro no login:", err);
      throw err;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.telefone) {
      setError("Informe o telefone (11 dígitos, incluindo DDD)");
      return;
    }

    if (formData.telefone.length !== 11) {
      setError("O telefone deve ter exatamente 11 dígitos (DDD + número).");
      return;
    }

    try {
      // Construir payload: concatenar código do país + telefone
      const payload = { ...formData };
      // Remove o "+" do código do país para compatibilidade com o banco
      const codigoPaisSemSinal = payload.paisCodigo.replace("+", "");
      payload.telefone = `${codigoPaisSemSinal}${payload.telefone}`;
      // opcional: remover paisCodigo do payload se não quiser gravar separadamente
      delete payload.paisCodigo;

      await api.post("/cadastro", payload);
      // chama login logo em seguida (usa email + senha originais)
      await login(formData);
      navigate("/");
    } catch (err) {
      console.error("Erro no cadastro ou login:", err);
      setError("Erro no cadastro. Verifique os dados e tente novamente.");
    }
  };

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
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md mt-25">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Cadastro de Cliente
          </h2>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-gray-700 mb-1">Nome</label>
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
              <label className="block text-gray-700 mb-1">Email</label>
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

            {/* Campo de telefone com dropdown do código do país */}
            <div>
              <label className="block text-gray-700 mb-1">Telefone</label>
              <div className="flex gap-2">
                <select
                  name="paisCodigo"
                  value={formData.paisCodigo}
                  onChange={handleChange}
                  className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>

                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  required
                  maxLength={11}
                  minLength={11}
                  pattern="\d{11}"
                  title="Informe 11 dígitos (DDD + número), somente números. Ex: 11987654321"
                  placeholder="DDD + número (11 dígitos)"
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">O código do país não conta nos 11 dígitos.</p>
              {formData.telefone && (
                <p className="text-xs text-green-600 mt-2 font-semibold">
                  Número a ser enviado: <span className="text-gray-800">{formData.paisCodigo}{formData.telefone}</span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">CEP</label>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Número (endereço)</label>
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Complemento</label>
              <input
                type="text"
                name="complemento"
                value={formData.complemento}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
              />
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

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
