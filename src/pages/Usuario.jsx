// src/pages/Usuario.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import Toast from "../components/messages/Toast";

export default function Usuario() {
  const [formData, setFormData] = useState(null);
  const [addressPreview, setAddressPreview] = useState({
    rua: "",
    bairro: "",
    cidade: "",
    error: null,
  });
  const [pwdChecks, setPwdChecks] = useState({
    upper: false,
    lower: false,
    minLen: false,
  });
  const [pwdFocused, setPwdFocused] = useState(false);

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // ⭐ NOVO

  const navigate = useNavigate();

  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

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
          const response = await api.get(`/usuarios/${userId}`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const data = response.data || {};

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

          const initialData = {
            ...data,
            telefoneFull: telef.telefoneFull,
            paisCodigo: telef.paisCodigo,
            telefone: telef.telefone,
            endereco: data.endereco ?? {},
          };

          setFormData(initialData);

          if (initialData.endereco) {
            setAddressPreview({
              rua: initialData.endereco.rua ?? "",
              bairro: initialData.endereco.bairro ?? "",
              cidade: initialData.endereco.cidade ?? "",
              error: null,
            });
          }
        } catch (err) {
          console.error("Erro ao buscar dados do usuário:", err);
          if (err.response?.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
        }
      };

      fetchUserData();
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("endereco.")) {
      const key = name.split(".")[1];

      setFormData((prev) => ({
        ...prev,
        endereco: { ...(prev.endereco || {}), [key]: value },
      }));

      if (key === "cep") {
        const digits = value.replace(/\D/g, "");
        if (digits.length === 8) {
          lookupCepAndFillPreview(digits);
        } else {
          setAddressPreview({ rua: "", bairro: "", cidade: "", error: null });
        }
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;

    setFormData((prev) => ({ ...prev, senha: value }));
    setPwdChecks({
      upper: /[A-Z]/.test(value),
      lower: /[a-z]/.test(value),
      minLen: value.length >= 8,
    });
  };

  const lookupCepAndFillPreview = async (cepDigits) => {
    try {
      setAddressPreview((p) => ({ ...p, error: null }));
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      const data = await res.json();

      if (data.erro) {
        setAddressPreview({
          rua: "",
          bairro: "",
          cidade: "",
          error: "CEP não encontrado",
        });
        return;
      }

      setAddressPreview({
        rua: data.logradouro ?? "",
        bairro: data.bairro ?? "",
        cidade: data.localidade ?? "",
        error: null,
      });

      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...(prev.endereco || {}),
          cidade: data.localidade,
          rua: data.logradouro,
          bairro: data.bairro,
        },
      }));
    } catch {
      setAddressPreview({
        rua: "",
        bairro: "",
        cidade: "",
        error: "Erro ao consultar CEP",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id ?? decoded.userId;

      if (formData.senha && !strongPasswordRegex.test(formData.senha)) {
        setToastType("error");
        setToastMessage("A senha deve ter 8+ caracteres, 1 maiúscula e 1 minúscula.");
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
        return;
      }

      let telefoneParaEnviar = "";
      if (formData.telefoneFull) {
        telefoneParaEnviar = formData.telefoneFull;
      } else {
        const codigo = (formData.paisCodigo || "+55").replace("+", "");
        telefoneParaEnviar = `${codigo}${formData.telefone || ""}`;
      }

      const payload = {
        nome: formData.nome,
        telefone: telefoneParaEnviar,
        email: formData.email,
        senha: formData.senha || undefined,
        endereco: {
          id: formData.endereco?.id,
          cep: formData.endereco?.cep,
          numero: formData.endereco?.numero,
          complemento: formData.endereco?.complemento,
        },
      };

      await api.put(`/usuarios/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastType("success");
      setToastMessage("Dados atualizados com sucesso!");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);

      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      console.error(err);
      setToastType("error");
      setToastMessage("Erro ao salvar alterações.");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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

  const userFields = [
    { name: "nome", label: "Nome", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
  ];

  const showPwdChecklist =
    pwdFocused || (formData.senha && formData.senha.length > 0);

  return (
    <>
      <NavBar initialGreen={true} />

      {/* ⭐ TOAST COM TIPO */}
      <Toast message={toastMessage} show={showToast} type={toastType} />

      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white mt-20 shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Editar Perfil e Endereço
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DADOS DO USUÁRIO */}
              <div>
                <h3 className="font-semibold mb-4">Dados do Usuário</h3>

                <div className="space-y-4">
                  {userFields.map((f) => (
                    <div key={f.name}>
                      <label className="block text-gray-700 mb-1">{f.label}</label>

                      <input
                        name={f.name}
                        type={f.type}
                        value={formData[f.name] ?? ""}
                        onChange={handleChange}
                        required={f.required}
                        className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                      />
                    </div>
                  ))}

                  {/* TELEFONE */}
                  <div>
                    <label className="block text-gray-700 mb-1">Telefone</label>
                    <PhoneInput
                      country={"br"}
                      value={formData.telefoneFull ?? ""}
                      onChange={(value, country) => {
                        const digits = value.replace(/\D/g, "");
                        const dial = country?.dialCode ?? "";

                        let national = digits;
                        if (digits.startsWith(dial)) {
                          national = digits.slice(dial.length);
                        }

                        setFormData((prev) => ({
                          ...prev,
                          telefoneFull: digits,
                          paisCodigo: `+${dial}`,
                          telefone: national,
                        }));
                      }}
                      inputClass="!w-full !h-11 !text-base !rounded-lg"
                      buttonClass="!h-11"
                    />
                  </div>

                  {/* SENHA */}
                  <div>
                    <label className="block text-gray-700 mb-1">
                      Nova Senha (opcional)
                    </label>

                    <input
                      type="password"
                      name="senha"
                      value={formData.senha ?? ""}
                      onChange={handlePasswordChange}
                      onFocus={() => setPwdFocused(true)}
                      onBlur={() => setPwdFocused(false)}
                      placeholder="Deixe em branco para manter"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />

                    {showPwdChecklist && (
                      <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                        <p className="text-sm text-gray-600 mb-2">
                          A senha deve conter:
                        </p>
                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <span className={pwdChecks.upper ? "text-green-600" : "text-red-600"}>
                              {pwdChecks.upper ? "✅" : "❌"}
                            </span>
                            1 letra maiúscula
                          </li>

                          <li className="flex items-center gap-2">
                            <span className={pwdChecks.lower ? "text-green-600" : "text-red-600"}>
                              {pwdChecks.lower ? "✅" : "❌"}
                            </span>
                            1 letra minúscula
                          </li>

                          <li className="flex items-center gap-2">
                            <span className={pwdChecks.minLen ? "text-green-600" : "text-red-600"}>
                              {pwdChecks.minLen ? "✅" : "❌"}
                            </span>
                            Mínimo 8 caracteres
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* ENDEREÇO */}
              <div>
                <h3 className="font-semibold mb-4">Endereço Vinculado</h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1">CEP</label>
                    <input
                      name="endereco.cep"
                      type="text"
                      value={formData.endereco?.cep ?? ""}
                      onChange={handleChange}
                      maxLength={8}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                    {addressPreview.error && (
                      <p className="text-red-500 text-sm mt-1">
                        {addressPreview.error}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Número</label>
                    <input
                      name="endereco.numero"
                      value={formData.endereco?.numero ?? ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Complemento</label>
                    <input
                      name="endereco.complemento"
                      value={formData.endereco?.complemento ?? ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  {/* PREVIEW */}
                  <div className="mt-2 text-sm text-gray-600">
                    <div>Rua: {addressPreview.rua || "-"}</div>
                    <div>Bairro: {addressPreview.bairro || "-"}</div>
                    <div>Cidade: {addressPreview.cidade || "-"}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 max-w-md mx-auto">
              <button
                type="submit"
                className="w-full bg-green-700 text-white py-2 rounded-lg font-semibold hover:bg-green-800 transition"
              >
                Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
