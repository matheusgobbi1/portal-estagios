import React from "react";
import { useNavigate } from "react-router-dom";
import areaService from "../services/areaService";
import companyService from "../services/companyService";
import { Area } from "../interfaces";

interface FormData {
  nome: string;
  cnpj: string;
  email: string;
  telefone: string;
  endereco: string;
  senha: string;
  areasAtuacao: number[];
}

const RegisterCompany: React.FC = () => {
  const [form, setForm] = React.useState<FormData>({
    nome: "",
    cnpj: "",
    email: "",
    telefone: "",
    endereco: "",
    senha: "",
    areasAtuacao: [],
  });
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState("");
  const [error, setError] = React.useState("");
  const navigate = useNavigate();

  React.useEffect(() => {
    areaService
      .buscarTodas()
      .then((data) => {
        console.log("Áreas recebidas:", data);
        setAreas(data);
      })
      .catch((err) => {
        console.error("Erro ao buscar áreas:", err);
        setAreas([]);
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = Array.from(e.target.selectedOptions, (option) =>
      Number(option.value)
    );
    setForm((prev) => ({ ...prev, areasAtuacao: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await companyService.cadastrar({
        ...form,
        areasAtuacao: form.areasAtuacao.map((id) => ({ id })),
      });
      setSuccess(
        "Cadastro realizado com sucesso! Redirecionando para login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error("Erro ao cadastrar empresa:", err);
      setError(
        "Erro ao cadastrar empresa. Verifique os dados e tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Cadastro de Empresa</h1>
        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome da Empresa</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CNPJ</label>
            <input
              name="cnpj"
              value={form.cnpj}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Telefone</label>
            <input
              name="telefone"
              value={form.telefone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Endereço</label>
            <input
              name="endereco"
              value={form.endereco}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              name="senha"
              value={form.senha}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Áreas de Atuação</label>
            <select
              multiple
              name="areasAtuacao"
              value={form.areasAtuacao.map(String)}
              onChange={handleAreaChange}
              required
              style={styles.select}
            >
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nome}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#94a3b8" : "#34d399",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f172a",
    padding: "24px",
  },
  formContainer: {
    maxWidth: "500px",
    width: "100%",
    backgroundColor: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "#e2e8f0",
    textAlign: "center" as const,
    marginBottom: "24px",
    fontSize: "24px",
    fontWeight: "600",
  },
  formGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    color: "#e2e8f0",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  select: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    height: "100px",
  },
  button: {
    width: "100%",
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  success: {
    backgroundColor: "#065f46",
    color: "#d1fae5",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  error: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
};

export default RegisterCompany;
