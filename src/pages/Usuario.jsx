// src/pages/Usuario.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

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
  const navigate = useNavigate();

  // Regex de senha forte (usado na submissão, e os checks em tempo real)
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
          // resposta esperada: { id, nome, telefone, email, tipo, endereco: { id, cep, numero, complemento, cidade, rua, bairro } }
          const data = response.data || {};

          // parse telefone vindo do backend (ex: "5511987654321" ou "+5511987654321")
          const parseTelefone = (tel) => {
            if (!tel) {
              return { telefoneFull: "", paisCodigo: "+55", telefone: "" };
            }
            const digits = String(tel).replace(/\D/g, "");
            // se o backend já guardou com DDI (mais que 11 dígitos), pega DDI + nacional
            if (digits.length > 11) {
              const national = digits.slice(-11);
              const dial = digits.slice(0, digits.length - 11);
              return {
                telefoneFull: digits,
                paisCodigo: `+${dial}`,
                telefone: national,
              };
            }
            // se veio apenas 11 ou menos, assume DDI 55 (ou mantem como nacional)
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
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/login");
          }
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
    if (name.startsWith("endereco.")) {
      const key = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        endereco: { ...(prev.endereco || {}), [key]: value },
      }));

      // se o campo alterado for cep, faz a busca automática quando tiver 8 dígitos
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

  // consulta ViaCEP do frontend para preencher preview (mantemos preview internamente, mas não exibimos os campos editáveis)
  const lookupCepAndFillPreview = async (cepDigits) => {
    try {
      setAddressPreview((p) => ({ ...p, error: null }));
      const res = await fetch(`https://viacep.com.br/ws/${cepDigits}/json/`);
      if (!res.ok) throw new Error("Falha ao consultar CEP");
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
      // opcional: atualiza formData.endereco com os valores (útil para backend/transação)
      setFormData((prev) =>
        prev
          ? {
              ...prev,
              endereco: {
                ...(prev.endereco || {}),
                cidade: data.localidade ?? prev?.endereco?.cidade,
                rua: data.logradouro ?? prev?.endereco?.rua,
                bairro: data.bairro ?? prev?.endereco?.bairro,
              },
            }
          : prev
      );
    } catch (err) {
      console.error("Erro ao consultar cep:", err);
      setAddressPreview({
        rua: "",
        bairro: "",
        cidade: "",
        error: "Erro ao consultar CEP",
      });
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

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id ?? decoded.userId;

      // Se usuário preencheu senha nova, valida a força
      if (formData.senha && !strongPasswordRegex.test(formData.senha)) {
        alert(
          "A nova senha precisa ter no mínimo 8 caracteres, incluindo 1 letra maiúscula e 1 letra minúscula."
        );
        return;
      }

      // MONTE O TELEFONE COMPLETO PARA O BACKEND (DDI + NACIONAL)
      // Priorize telefoneFull (que já contém DDI se existir). Se não existir, concatena paisCodigo + telefone.
      let telefoneParaEnviar = "";
      if (formData.telefoneFull && formData.telefoneFull.length > 0) {
        telefoneParaEnviar = formData.telefoneFull; // já são apenas dígitos
      } else {
        const codigo = (formData.paisCodigo || "+55").replace("+", "");
        const nacional = formData.telefone || "";
        telefoneParaEnviar = `${codigo}${nacional}`;
      }

      // Opcional: verifique se length faz sentido (ex.: >=11)
      if (!telefoneParaEnviar || telefoneParaEnviar.length < 11) {
        // não bloqueie totalmente, só avise (ajuste conforme regra do seu backend)
        console.warn(
          "Telefone para envio parece inválido:",
          telefoneParaEnviar
        );
      }

      // Prepara payload: enviar campos do usuário e endereco com cep/numero/complemento (+ id se existir)
      const payload = {
        nome: formData.nome,
        // aqui enviamos o telefone completo (sem +), ajuste se seu backend preferir com '+'
        telefone: telefoneParaEnviar,
        email: formData.email,
        senha: formData.senha || undefined, // se vazio, backend ignora
        endereco: {
          id: formData.endereco?.id ?? undefined,
          cep: formData.endereco?.cep ?? undefined,
          numero: formData.endereco?.numero ?? undefined,
          complemento: formData.endereco?.complemento ?? undefined,
        },
      };

      await api.put(`/usuarios/${userId}`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Dados atualizados com sucesso!");
      navigate("/");
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      if (err.response && err.response.data && err.response.data.error) {
        alert(`Erro: ${err.response.data.error}`);
      } else {
        alert("Ocorreu um erro ao salvar suas alterações.");
      }
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
    // telefone será tratado com PhoneInput abaixo
    { name: "email", label: "Email", type: "email", required: true },
    // senha será renderizada com checklist
  ];

  // Exibe checklist se o campo senha estiver focado ou já tiver conteúdo
  const showPwdChecklist =
    pwdFocused || (formData.senha && formData.senha.length > 0);

  return (
    <>
      <NavBar initialGreen={true} />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
        <div className="bg-white mt-20 shadow-lg rounded-2xl p-8 w-full max-w-2xl">
          <h2 className="text-2xl font-bold text-center text-green-700 mb-6">
            Editar Perfil e Endereço
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Usuário */}
              <div>
                <h3 className="font-semibold mb-4">Dados do Usuário</h3>
                <div className="space-y-4">
                  {userFields.map((f) => (
                    <div key={f.name}>
                      <label className="block text-gray-700 mb-1">
                        {f.label}
                      </label>
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

                  {/* TELEFONE com react-phone-input-2 */}
                  <div>
                    <label className="block text-gray-700 mb-1">Telefone</label>
                    <PhoneInput
                      country={"br"}
                      value={formData.telefoneFull ?? ""}
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

                  {/* SENHA com checklist em tempo real (opcional) */}
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
                      placeholder="Vazio para manter a senha atual"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                      aria-describedby="pwd-requirements"
                    />

                    {showPwdChecklist && (
                      <div
                        id="pwd-requirements"
                        className="mt-3 p-3 border rounded-lg bg-gray-50"
                        aria-live="polite"
                      >
                        <p className="text-sm text-gray-600 mb-2">
                          A senha deve conter:
                        </p>

                        <ul className="space-y-2">
                          <li className="flex items-center gap-2">
                            <span
                              className={
                                pwdChecks.upper
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {pwdChecks.upper ? "✅" : "❌"}
                            </span>
                            <span
                              className={
                                pwdChecks.upper
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            >
                              1 letra maiúscula
                            </span>
                          </li>

                          <li className="flex items-center gap-2">
                            <span
                              className={
                                pwdChecks.lower
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {pwdChecks.lower ? "✅" : "❌"}
                            </span>
                            <span
                              className={
                                pwdChecks.lower
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            >
                              1 letra minúscula
                            </span>
                          </li>

                          <li className="flex items-center gap-2">
                            <span
                              className={
                                pwdChecks.minLen
                                  ? "text-green-600"
                                  : "text-red-600"
                              }
                            >
                              {pwdChecks.minLen ? "✅" : "❌"}
                            </span>
                            <span
                              className={
                                pwdChecks.minLen
                                  ? "text-green-700"
                                  : "text-red-600"
                              }
                            >
                              Mínimo 8 caracteres
                            </span>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Endereço */}
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
                      placeholder="Somente dígitos (ex: 01001000)"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                      maxLength={8}
                    />
                    {addressPreview.error && (
                      <div className="text-red-500 text-sm mt-1">
                        {addressPreview.error}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">Número</label>
                    <input
                      name="endereco.numero"
                      type="text"
                      value={formData.endereco?.numero ?? ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1">
                      Complemento
                    </label>
                    <input
                      name="endereco.complemento"
                      type="text"
                      value={formData.endereco?.complemento ?? ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-400 outline-none"
                    />
                  </div>

                  {/* Preview legível do endereço */}
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
