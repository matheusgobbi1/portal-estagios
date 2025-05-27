import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { AuthRequest, UserRole } from "../interfaces";
import { CSSProperties } from "react";

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState<AuthRequest>({
    email: "",
    senha: "",
  });
  const { login, loading, error, user } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    console.log("User:", user);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await login(credentials);

      setTimeout(() => {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        console.log("Navegando após login. Usuário:", currentUser);

        if (currentUser && currentUser.role) {
          switch (currentUser.role) {
            case UserRole.ADMIN:
              navigate("/admin");
              break;
            case UserRole.COMPANY:
              navigate("/empresa");
              break;
            case UserRole.STUDENT:
              navigate("/estudante");
              break;
            default:
              navigate("/");
          }
        }
      }, 500);
    } catch (error) {
      console.error("Erro durante login:", error);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>Portal de Estágios</h1>
        <h2 style={styles.subtitle}>Login</h2>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              E-mail
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="senha" style={styles.label}>
              Senha
            </label>
            <input
              type="password"
              id="senha"
              name="senha"
              value={credentials.senha}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              backgroundColor: loading ? "#94a3b8" : "#3b82f6",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? "Carregando..." : "Entrar"}
          </button>
        </form>

        <div style={styles.registerLinks}>
          <p style={styles.registerText}>Não tem uma conta?</p>
          <a href="/registro/estudante" style={styles.link}>
            Cadastro de Estudante
          </a>
          <a href="/registro/empresa" style={styles.link}>
            Cadastro de Empresa
          </a>
        </div>
      </div>
    </div>
  );
};

const styles: Record<string, CSSProperties> = {
  container: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    backgroundColor: "#0f172a",
    padding: "20px",
  },
  formContainer: {
    backgroundColor: "#1e293b",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    width: "100%",
    maxWidth: "400px",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#e2e8f0",
    textAlign: "center" as const,
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "18px",
    color: "#94a3b8",
    textAlign: "center" as const,
    marginBottom: "20px",
  },
  form: {
    width: "100%",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontSize: "14px",
    fontWeight: "bold",
    color: "#e2e8f0",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #334155",
    borderRadius: "8px",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    boxSizing: "border-box" as const,
  },
  button: {
    width: "100%",
    padding: "12px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "bold",
    marginTop: "10px",
    transition: "background-color 0.2s",
  },
  registerLinks: {
    marginTop: "20px",
    textAlign: "center" as const,
  },
  registerText: {
    color: "#94a3b8",
    marginBottom: "10px",
  },
  link: {
    display: "block",
    color: "#3b82f6",
    textDecoration: "none",
    margin: "8px 0",
    transition: "color 0.2s",
  },
  error: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "20px",
    textAlign: "center" as const,
  },
};

export default Login;
