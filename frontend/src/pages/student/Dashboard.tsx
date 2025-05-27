import React, { useMemo, useCallback } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { JobOffer } from "../../interfaces";
import api from "../../services/api";
import { useQuery, useMutation } from "@tanstack/react-query";
import { styles } from "./DashboardStyles";
import { queryClient } from "../../services/queryClient";
import VagaCard from "../../components/student/VagaCard";

interface Application {
  jobOfferId: number;
}

const StudentDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  // Obter dados do usuário do localStorage uma única vez
  const user = useMemo(() => {
    const getUser = localStorage.getItem("user");
    return JSON.parse(getUser || "{}");
  }, []);

  const area = user.areasInteresse?.[0]?.id;

  // Carrega vagas com React Query (com cache)
  const {
    data: vagas = [],
    isLoading: vagasLoading,
    error: vagasError,
  } = useQuery({
    queryKey: ["vagas", area],
    queryFn: async () => {
      const response = await api.get<JobOffer[]>(`/job-offers/area/${area}`);
      return response.data;
    },
    enabled: !!area,
  });

  // Carrega inscrições com React Query (com cache)
  const { data: inscricoes = [] } = useQuery({
    queryKey: ["inscricoes", user.id],
    queryFn: async () => {
      const response = await api.get<Application[]>(
        `/application/student/${user.id}`
      );
      return response.data.map((insc) => insc.jobOfferId);
    },
    enabled: !!user.id,
  });

  // Mutação para inscrição em vaga
  const inscreverMutation = useMutation({
    mutationFn: async (vagaId: number) => {
      return api.post("/application", {
        jobOffer: { id: vagaId },
        student: { id: user.id },
      });
    },
    onSuccess: (_data, vagaId) => {
      queryClient.setQueryData<number[]>(
        ["inscricoes", user.id],
        (oldData = []) => [...oldData, vagaId]
      );
      alert("Inscrição realizada com sucesso!");
    },
    onError: () => {
      alert("Erro ao realizar inscrição. Tente novamente.");
    },
  });

  // Handlers como callbacks para evitar recriações
  const handleLogout = useCallback(() => {
    logout();
    navigate("/login");
  }, [logout, navigate]);

  const handleProfileClick = useCallback(() => {
    navigate("/estudante/perfil");
  }, [navigate]);

  const handleInscrever = useCallback(
    (vagaId: number) => {
      inscreverMutation.mutate(vagaId);
    },
    [inscreverMutation]
  );

  const handleDownloadCV = useCallback(async () => {
    try {
      const response = await api.get(`/students/${user.id}/resume`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "curriculo.pdf");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      alert("Erro ao gerar currículo. Tente novamente.");
      console.error(err);
    }
  }, [user.id]);

  // Renderização condicional
  if (vagasLoading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#e2e8f0" }}>Carregando...</p>
      </div>
    );
  }

  if (vagasError) {
    return (
      <div style={styles.error}>
        Erro ao carregar vagas. Por favor, tente novamente.
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div>
            <h1 style={styles.title}>Bem-vindo, {user?.nome}</h1>
            <p style={styles.subtitle}>
              Aqui estão as vagas que correspondem aos seus interesses
            </p>
          </div>
          <div style={styles.headerActions}>
            <button onClick={handleProfileClick} style={styles.profileButton}>
              Meu Perfil
            </button>
            <button
              onClick={handleDownloadCV}
              style={{
                ...styles.cvButton,
                backgroundColor: inscreverMutation.isPending
                  ? "#94a3b8"
                  : "#10b981",
                cursor: inscreverMutation.isPending ? "default" : "pointer",
              }}
              disabled={inscreverMutation.isPending}
            >
              {inscreverMutation.isPending ? "Gerando..." : "Baixar Currículo"}
            </button>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sair
            </button>
          </div>
        </div>
      </div>

      {vagas.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ color: "#94a3b8" }}>
            Nenhuma vaga encontrada para suas áreas de interesse.
          </p>
        </div>
      ) : (
        <div style={styles.vagasGrid}>
          {vagas.map((vaga) => (
            <VagaCard
              key={vaga.id}
              vaga={vaga}
              inscrito={inscricoes.includes(vaga.id)}
              onInscrever={handleInscrever}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
