import React, { useEffect, useState } from "react";
import adminService from "../../services/adminService";
import { Link, useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuth } from "../../contexts/AuthContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface DashboardData {
  totalEmpresas: number;
  totalEstudantes: number;
  vagasAbertas: number;
  vagasEncerradas: number;
  vagasPorArea: Array<[string, number]>;
}

const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const data = await adminService.getDashboard();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
        setError(
          "Falha ao carregar dados do dashboard. Tente novamente mais tarde."
        );
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };


  const chartData = {
    labels: dashboardData?.vagasPorArea?.map((item) => item[0]) || [],
    datasets: [
      {
        label: "Vagas por Área",
        data: dashboardData?.vagasPorArea?.map((item) => item[1]) || [],
        backgroundColor: "rgba(99, 102, 241, 0.6)",
        borderColor: "rgba(99, 102, 241, 1)",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#e2e8f0",
          font: {
            size: 14,
            family: "'Inter', sans-serif",
          },
        },
      },
      title: {
        display: true,
        text: "Distribuição de Vagas por Área",
        color: "#e2e8f0",
        font: {
          size: 16,
          family: "'Inter', sans-serif",
          weight: "bold" as const,
        },
        padding: {
          bottom: 20,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(255, 255, 255, 0.1)",
        },
        ticks: {
          color: "#e2e8f0",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#e2e8f0",
        },
      },
    },
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#e2e8f0" }}>Carregando dados do dashboard...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Dashboard Administrativo</h1>
          <div style={styles.headerActions}>
            <Link to="/admin/areas" style={styles.primaryButton}>
              Gerenciar Áreas
            </Link>
            <button onClick={handleLogout} style={styles.logoutButton}>
              Sair
            </button>
          </div>
        </div>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statIcon}>🏢</div>
          <div style={styles.statContent}>
            <h3 style={styles.statTitle}>Empresas</h3>
            <p style={styles.statValue}>{dashboardData?.totalEmpresas || 0}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>👨‍🎓</div>
          <div style={styles.statContent}>
            <h3 style={styles.statTitle}>Estudantes</h3>
            <p style={styles.statValue}>
              {dashboardData?.totalEstudantes || 0}
            </p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔓</div>
          <div style={styles.statContent}>
            <h3 style={styles.statTitle}>Vagas Abertas</h3>
            <p style={styles.statValue}>{dashboardData?.vagasAbertas || 0}</p>
          </div>
        </div>

        <div style={styles.statCard}>
          <div style={styles.statIcon}>🔒</div>
          <div style={styles.statContent}>
            <h3 style={styles.statTitle}>Vagas Encerradas</h3>
            <p style={styles.statValue}>
              {dashboardData?.vagasEncerradas || 0}
            </p>
          </div>
        </div>
      </div>

      <div style={styles.chartContainer}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
    backgroundColor: "#0f172a",
    minHeight: "100vh",
  },
  header: {
    marginBottom: "32px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    padding: "20px",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: "24px",
    fontWeight: "600",
    color: "#e2e8f0",
    margin: 0,
  },
  headerActions: {
    display: "flex",
    gap: "12px",
  },
  primaryButton: {
    padding: "10px 20px",
    backgroundColor: "#6366f1",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    fontWeight: "500",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#4f46e5",
    },
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#dc2626",
    },
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    marginBottom: "32px",
  },
  statCard: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  statIcon: {
    fontSize: "24px",
    width: "48px",
    height: "48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#334155",
    borderRadius: "12px",
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: "14px",
    color: "#94a3b8",
    margin: "0 0 4px 0",
    fontWeight: "500",
  },
  statValue: {
    fontSize: "24px",
    color: "#e2e8f0",
    margin: 0,
    fontWeight: "600",
  },
  chartContainer: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "16px",
    backgroundColor: "#0f172a",
  },
  loadingSpinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #334155",
    borderTop: "4px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  error: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "16px",
    borderRadius: "8px",
    margin: "24px auto",
    maxWidth: "600px",
    textAlign: "center" as const,
  },
};

export default AdminDashboard;
