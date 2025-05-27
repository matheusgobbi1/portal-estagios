import React, { useState, useEffect } from "react";
import areaService from "../services/areaService";
import api from "../services/api";
import { Area } from "../interfaces";
import { useNavigate } from "react-router-dom";

interface FormData {
  nome: string;
  cpf: string;
  curso: string;
  email: string;
  telefone: string;
  senha: string;
  areasInteresse: number[];
}

const RegisterStudent: React.FC = () => {
  const [form, setForm] = useState<FormData>({
    nome: "",
    cpf: "",
    curso: "",
    email: "",
    telefone: "",
    senha: "",
    areasInteresse: [],
  });
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
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
    setForm((prev) => ({ ...prev, areasInteresse: selected }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.post("/students", {
        ...form,
        areasInteresse: form.areasInteresse.map((id) => ({ id })),
      });
      setSuccess(
        "Cadastro realizado com sucesso! Redirecionando para login..."
      );
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Cadastro de Estudante</h1>
        {success && <div style={styles.success}>{success}</div>}
        {error && <div style={styles.error}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Nome</label>
            <input
              name="nome"
              value={form.nome}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>CPF</label>
            <input
              name="cpf"
              value={form.cpf}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Curso</label>
            <input
              name="curso"
              value={form.curso}
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
            <label style={styles.label}>Áreas de Interesse</label>
            <select
              multiple
              name="areasInteresse"
              value={form.areasInteresse.map(String)}
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

export default RegisterStudent;
