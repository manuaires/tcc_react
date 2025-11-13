// src/pages/Usuario.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/navbar/NavBar";
import api from "../api";
import { jwtDecode } from "jwt-decode";

export default function Usuario() {
  const [formData, setFormData] = useState(null);
  const [addressPreview, setAddressPreview] = useState({
    rua: "",
    bairro: "",
    cidade: "",
    error: null,
  });
  const navigate = useNavigate();

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
          const data = response.data;
          setFormData(data);
          if (data.endereco) {
            setAddressPreview({
              rua: data.endereco.rua ?? "",
              bairro: data.endereco.bairro ?? "",
              cidade: data.endereco.cidade ?? "",
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
      setFormData((prev) => ({
        ...prev,
        endereco: {
          ...(prev.endereco || {}),
          cidade: data.localidade ?? prev?.endereco?.cidade,
          rua: data.logradouro ?? prev?.endereco?.rua,
          bairro: data.bairro ?? prev?.endereco?.bairro,
        },
      }));
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const decoded = jwtDecode(token);
      const userId = decoded.id ?? decoded.userId;

      // Prepara payload: enviar apenas os campos do usuário e endereco com cep/numero/complemento (+ id se existir)
      const payload = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        senha: formData.senha, // se vazio, backend ignora
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
    { name: "telefone", label: "Telefone", type: "text", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "senha", label: "Nova Senha", type: "password", required: false },
  ];

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
                    <label className="block text-gray-700 mb-1">Complemento</label>
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
