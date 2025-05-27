import React from "react";
import { Link } from "react-router-dom";

const Home: React.FC = () => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <h1 style={styles.title}>Portal de Estágios</h1>
        <p style={styles.subtitle}>
          Bem-vindo ao Portal de Estágios! Escolha uma opção abaixo:
        </p>

        <div style={styles.buttonGroup}>
          <Link to="/login" style={styles.loginButton}>
            Entrar
          </Link>

          <Link to="/registro/estudante" style={styles.studentButton}>
            Cadastrar como Estudante
          </Link>

          <Link to="/registro/empresa" style={styles.companyButton}>
            Cadastrar como Empresa
          </Link>
        </div>
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
  content: {
    maxWidth: "800px",
    width: "100%",
    textAlign: "center" as const,
    backgroundColor: "#1e293b",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "#e2e8f0",
    fontSize: "32px",
    fontWeight: "600",
    marginBottom: "16px",
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: "18px",
    marginBottom: "32px",
  },
  buttonGroup: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "16px",
    maxWidth: "400px",
    margin: "0 auto",
  },
  loginButton: {
    padding: "12px 24px",
    backgroundColor: "#3b82f6",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#2563eb",
    },
  },
  studentButton: {
    padding: "12px 24px",
    backgroundColor: "#34d399",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#10b981",
    },
  },
  companyButton: {
    padding: "12px 24px",
    backgroundColor: "#6c757d",
    color: "#fff",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#5a6268",
    },
  },
};

export default Home;
