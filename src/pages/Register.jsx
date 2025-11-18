import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { IoEye, IoEyeOff } from "react-icons/io5";

export default function Register() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pwdChecks, setPwdChecks] = useState({
    upper: false,
    lower: false,
    minLen: false,
  });
  const [pwdFocused, setPwdFocused] = useState(false);
  const navigate = useNavigate();

  // REGEX DE SENHA FORTE (usado no handleSubmit também)
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  useEffect(() => {
    setFormData({
      nome: "",
      email: "",
      senha: "",
      telefone: "", // somente DDD + número (11 dígitos)
      telefoneFull: "", // usado internamente para armazenar string completa
      paisCodigo: "+55", // "+55" mas agora será gerado automaticamente
      cep: "",
      numero: "",
      complemento: "",
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // handle específico para senha (atualiza formData e checks em tempo real)
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, senha: value }));

    setPwdChecks({
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      minLen: value.length >= 8,
    });
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

    // VALIDAR SENHA FORTE (reconfirmação)
    if (!strongPasswordRegex.test(formData.senha)) {
      setError(
        "A senha precisa ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula e 1 letra minúscula."
      );
      return;
    }

    // VALIDAR TELEFONE COM 11 DÍGITOS
    if (!formData.telefone || formData.telefone.length !== 11) {
      setError("Informe um telefone válido com 11 dígitos (DDD + número).");
      return;
    }

    try {
      const payload = { ...formData };

      // Remove o "+" e concatena com o número
      const codigoPaisSemSinal = payload.paisCodigo.replace("+", "");
      payload.telefone = `${codigoPaisSemSinal}${payload.telefone}`;

      delete payload.paisCodigo;
      delete payload.telefoneFull;

      await api.post("/cadastro", payload);
      await login(formData);
      navigate("/");
    } catch (err) {
      console.error("Erro no cadastro:", err);
      setError("Erro no cadastro. Verifique os dados e tente novamente.");
    }
  };

  if (!formData || Object.keys(formData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
          Carregando...
        </div>
      </div>
    );
  }

  // controle de exibição do checklist: mostra se está focado ou já há caracteres
  const showPwdChecklist =
    pwdFocused || (formData.senha && formData.senha.length > 0);

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

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="senha"
                  value={formData.senha}
                  onChange={handlePasswordChange}
                  onFocus={() => setPwdFocused(true)}
                  onBlur={() => setPwdFocused(false)}
                  required
                  minLength={8}
                  pattern="^(?=.*[a-z])(?=.*[A-Z]).{8,}$"
                  title="A senha deve ter no mínimo 8 caracteres, incluindo pelo menos 1 letra maiúscula e 1 letra minúscula."
                  placeholder="Crie uma senha forte..."
                  className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-800"
                >
                  {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
                </button>
              </div>

              {showPwdChecklist && (
                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                  <p className="text-sm text-gray-600 mb-2">
                    A senha deve conter:
                  </p>

                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <span
                        className={
                          pwdChecks.upper ? "text-green-600" : "text-red-600"
                        }
                      >
                        {pwdChecks.upper ? "✅" : "❌"}
                      </span>
                      <span
                        className={
                          pwdChecks.upper ? "text-green-700" : "text-red-600"
                        }
                      >
                        1 letra maiúscula
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={
                          pwdChecks.lower ? "text-green-600" : "text-red-600"
                        }
                      >
                        {pwdChecks.lower ? "✅" : "❌"}
                      </span>
                      <span
                        className={
                          pwdChecks.lower ? "text-green-700" : "text-red-600"
                        }
                      >
                        1 letra minúscula
                      </span>
                    </li>

                    <li className="flex items-center gap-2">
                      <span
                        className={
                          pwdChecks.minLen ? "text-green-600" : "text-red-600"
                        }
                      >
                        {pwdChecks.minLen ? "✅" : "❌"}
                      </span>
                      <span
                        className={
                          pwdChecks.minLen ? "text-green-700" : "text-red-600"
                        }
                      >
                        Mínimo 8 caracteres
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-1">Telefone</label>

              <PhoneInput
                country={"br"}
                value={formData.telefoneFull}
                onChange={(value, country) => {
                  const digits = value.replace(/\D/g, "");
                  const dial = country?.dialCode ?? "";

                  // nacional = remove o código do país
                  let national = digits;
                  if (digits.startsWith(dial)) {
                    national = digits.slice(dial.length);
                  }

                  setFormData((prev) => ({
                    ...prev,
                    telefoneFull: digits,
                    paisCodigo: `+${dial}`,
                    telefone: national, // 11 dígitos sem o DDI
                  }));
                }}
                inputClass="!w-full !h-11 !text-base !rounded-lg"
                buttonClass="!h-11"
              />
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
              <label className="block text-gray-700 mb-1">
                Número (endereço)
              </label>
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
              className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
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
