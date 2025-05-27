import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  JobOffer,
  Application,
  ApplicationStatus,
  Student,
} from "../../interfaces";

const CompanyDashboard: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const getUser = localStorage.getItem("user");
  const user = JSON.parse(getUser || "{}");

  const [vagas, setVagas] = React.useState<JobOffer[]>([]);
  const [inscricoes, setInscricoes] = React.useState<Application[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(
    null
  );
  const [showModal, setShowModal] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const vagasResponse = await api.get(`/job-offers/company/${user?.id}`);
        setVagas(vagasResponse.data);

        const todasInscricoes: Application[] = [];
        for (const vaga of vagasResponse.data) {
          const inscricoesResponse = await api.get(
            `/application/job-offer/${vaga.id}`
          );
          todasInscricoes.push(...inscricoesResponse.data);
        }
        setInscricoes(todasInscricoes);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchData();
    }
  }, [user?.id]);

  const encerrarVaga = async (id: number) => {
    try {
      await api.patch(`/job-offers/${id}/encerrar`);
      setVagas((prevVagas) =>
        prevVagas.map((vaga) =>
          vaga.id === id ? { ...vaga, ativa: false } : vaga
        )
      );
    } catch (err) {
      console.error("Erro ao encerrar vaga:", err);
      setError("Erro ao encerrar vaga. Tente novamente.");
    }
  };

  const getStatusColor = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDENTE:
        return "#fbbf24"; // amarelo mais claro
      case ApplicationStatus.EM_ANALISE:
        return "#60a5fa"; // azul mais claro
      case ApplicationStatus.APROVADO:
        return "#34d399"; // verde mais claro
      case ApplicationStatus.REJEITADO:
        return "#f87171"; // vermelho mais claro
      default:
        return "#94a3b8"; // cinza mais claro
    }
  };

  const getStatusLabel = (status: ApplicationStatus) => {
    switch (status) {
      case ApplicationStatus.PENDENTE:
        return "Pendente";
      case ApplicationStatus.EM_ANALISE:
        return "Em Análise";
      case ApplicationStatus.APROVADO:
        return "Aprovado";
      case ApplicationStatus.REJEITADO:
        return "Rejeitado";
      default:
        return status;
    }
  };

  const handleViewStudentProfile = async (studentId: number) => {
    try {
      const response = await api.get(`/students/${studentId}`);
      setSelectedStudent(response.data);
      setShowModal(true);
    } catch (err) {
      console.error("Erro ao carregar perfil do estudante:", err);
      setError("Erro ao carregar perfil do estudante. Tente novamente.");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#e2e8f0" }}>Carregando...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Painel da Empresa</h1>
        <button onClick={handleLogout} style={styles.logoutButton}>
          Sair
        </button>
      </div>

      <div>
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.subtitle}>Suas Vagas</h2>
            <button
              onClick={() => navigate("/empresa/nova-vaga")}
              style={styles.newButton}
            >
              + Nova Vaga
            </button>
          </div>
          {vagas.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Você ainda não possui vagas cadastradas.
            </p>
          ) : (
            <div>
              {vagas.map((vaga) => (
                <div key={vaga.id} style={styles.card}>
                  <div style={styles.cardContent}>
                    <div>
                      <h3 style={styles.cardTitle}>{vaga.titulo}</h3>
                      <p style={styles.cardText}>
                        <strong>Área:</strong> {vaga.area.nome}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Localização:</strong> {vaga.localizacao}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Modalidade:</strong> {vaga.modalidade}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Carga Horária:</strong> {vaga.cargaHoraria}h
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: vaga.ativa ? "#34d399" : "#f87171",
                        }}
                      >
                        {vaga.ativa ? "Ativa" : "Encerrada"}
                      </span>
                      {vaga.ativa && (
                        <button
                          onClick={() => encerrarVaga(vaga.id)}
                          style={styles.closeButton}
                        >
                          Encerrar
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.section}>
          <h2 style={styles.subtitle}>Candidatos às Suas Vagas</h2>
          {inscricoes.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>
              Ainda não há candidatos para suas vagas.
            </p>
          ) : (
            <div>
              {inscricoes.map((inscricao) => (
                <div key={inscricao.id} style={styles.card}>
                  <div style={styles.cardContent}>
                    <div>
                      <h3 style={styles.cardTitle}>{inscricao.student.nome}</h3>
                      <p style={styles.cardText}>
                        <strong>Vaga:</strong> {inscricao.jobOffer.titulo}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Curso:</strong> {inscricao.student.curso}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Email:</strong> {inscricao.student.email}
                      </p>
                      <p style={styles.cardText}>
                        <strong>Telefone:</strong> {inscricao.student.telefone}
                      </p>
                    </div>
                    <div>
                      <span
                        style={{
                          ...styles.statusBadge,
                          background: getStatusColor(inscricao.status),
                        }}
                      >
                        {getStatusLabel(inscricao.status)}
                      </span>
                      <button
                        onClick={() =>
                          handleViewStudentProfile(inscricao.student.id)
                        }
                        style={styles.viewButton}
                      >
                        Ver Currículo
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showModal && selectedStudent && (
        <div style={styles.modalOverlay}>
          <div style={styles.modalContent}>
            <div style={styles.modalHeader}>
              <h2 style={styles.modalTitle}>Currículo do Candidato</h2>
              <button onClick={closeModal} style={styles.closeModalButton}>
                ×
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.profileSection}>
                <h3 style={styles.sectionTitle}>Informações Pessoais</h3>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <strong>Nome:</strong> {selectedStudent.nome}
                  </div>
                  <div style={styles.infoItem}>
                    <strong>Email:</strong> {selectedStudent.email}
                  </div>
                  <div style={styles.infoItem}>
                    <strong>Telefone:</strong> {selectedStudent.telefone}
                  </div>
                  <div style={styles.infoItem}>
                    <strong>Curso:</strong> {selectedStudent.curso}
                  </div>
                  {selectedStudent.dataNascimento && (
                    <div style={styles.infoItem}>
                      <strong>Data de Nascimento:</strong>{" "}
                      {new Date(
                        selectedStudent.dataNascimento
                      ).toLocaleDateString("pt-BR")}
                    </div>
                  )}
                </div>
              </div>

              {selectedStudent.resumo && (
                <div style={styles.profileSection}>
                  <h3 style={styles.sectionTitle}>Resumo Profissional</h3>
                  <div style={styles.resumoSection}>
                    <p>{selectedStudent.resumo}</p>
                  </div>
                </div>
              )}

              {selectedStudent.educacao &&
                selectedStudent.educacao.length > 0 && (
                  <div style={styles.profileSection}>
                    <h3 style={styles.sectionTitle}>Formação Acadêmica</h3>
                    {selectedStudent.educacao.map((edu, index) => (
                      <div key={index} style={styles.educationItem}>
                        <h4 style={styles.itemTitle}>{edu.instituicao}</h4>
                        <p style={styles.itemSubtitle}>
                          {edu.curso} - {edu.nivel}
                        </p>
                        <p style={styles.itemDate}>
                          {new Date(edu.dataInicio).toLocaleDateString("pt-BR")}{" "}
                          -{" "}
                          {edu.emAndamento
                            ? "Em andamento"
                            : edu.dataFim
                            ? new Date(edu.dataFim).toLocaleDateString("pt-BR")
                            : ""}
                        </p>
                        {edu.descricao && (
                          <p style={styles.itemDescription}>{edu.descricao}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {selectedStudent.experiencia &&
                selectedStudent.experiencia.length > 0 && (
                  <div style={styles.profileSection}>
                    <h3 style={styles.sectionTitle}>
                      Experiência Profissional
                    </h3>
                    {selectedStudent.experiencia.map((exp, index) => (
                      <div key={index} style={styles.experienceItem}>
                        <h4 style={styles.itemTitle}>{exp.empresa}</h4>
                        <p style={styles.itemSubtitle}>{exp.cargo}</p>
                        <p style={styles.itemDate}>
                          {new Date(exp.dataInicio).toLocaleDateString("pt-BR")}{" "}
                          -{" "}
                          {exp.atual
                            ? "Atual"
                            : exp.dataFim
                            ? new Date(exp.dataFim).toLocaleDateString("pt-BR")
                            : ""}
                        </p>
                        {exp.descricao && (
                          <p style={styles.itemDescription}>{exp.descricao}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}

              {selectedStudent.habilidades &&
                selectedStudent.habilidades.length > 0 && (
                  <div style={styles.profileSection}>
                    <h3 style={styles.sectionTitle}>Habilidades</h3>
                    <div style={styles.skillsContainer}>
                      {selectedStudent.habilidades.map((skill, index) => (
                        <div key={index} style={styles.skillItem}>
                          <div style={styles.skillInfo}>
                            <span style={styles.skillName}>{skill.nome}</span>
                            <span style={styles.skillCategory}>
                              {skill.categoria}
                            </span>
                          </div>
                          <div style={styles.skillLevel}>
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                style={{
                                  ...styles.skillDot,
                                  backgroundColor:
                                    i < skill.nivel ? "#34d399" : "#334155",
                                }}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {selectedStudent.areasInteresse &&
                selectedStudent.areasInteresse.length > 0 && (
                  <div style={styles.profileSection}>
                    <h3 style={styles.sectionTitle}>Áreas de Interesse</h3>
                    <div style={styles.areasContainer}>
                      {selectedStudent.areasInteresse.map((area, index) => (
                        <span key={index} style={styles.areaTag}>
                          {area.nome}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

              {(selectedStudent.linkedin ||
                selectedStudent.github ||
                selectedStudent.portfolio) && (
                <div style={styles.profileSection}>
                  <h3 style={styles.sectionTitle}>Links</h3>
                  <div style={styles.linksContainer}>
                    {selectedStudent.linkedin && (
                      <a
                        href={selectedStudent.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        LinkedIn
                      </a>
                    )}
                    {selectedStudent.github && (
                      <a
                        href={selectedStudent.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        GitHub
                      </a>
                    )}
                    {selectedStudent.portfolio && (
                      <a
                        href={selectedStudent.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={styles.link}
                      >
                        Portfólio
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "32px",
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  title: {
    color: "#e2e8f0",
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
  },
  logoutButton: {
    padding: "10px 20px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#dc2626",
    },
  },
  section: {
    marginBottom: "32px",
  },
  sectionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  subtitle: {
    color: "#e2e8f0",
    margin: 0,
    fontSize: "20px",
    fontWeight: "500",
  },
  newButton: {
    padding: "10px 20px",
    backgroundColor: "#34d399",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#10b981",
    },
  },
  card: {
    marginBottom: "16px",
    padding: "20px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  cardContent: {
    display: "flex",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: "#e2e8f0",
    margin: "0 0 10px 0",
    fontSize: "18px",
    fontWeight: "500",
  },
  cardText: {
    color: "#94a3b8",
    margin: "0 0 5px 0",
    fontSize: "14px",
  },
  statusBadge: {
    display: "inline-block",
    padding: "4px 8px",
    borderRadius: "4px",
    color: "white",
    fontSize: "14px",
    fontWeight: "500",
  },
  closeButton: {
    display: "block",
    padding: "8px 16px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#dc2626",
    },
  },
  loadingContainer: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    gap: "16px",
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
  viewButton: {
    display: "block",
    padding: "8px 16px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginTop: "8px",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#1d4ed8",
    },
  },
  modalOverlay: {
    position: "fixed" as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflowY: "auto" as const,
    padding: "24px",
  },
  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
    borderBottom: "1px solid #334155",
    paddingBottom: "10px",
  },
  modalTitle: {
    color: "#e2e8f0",
    margin: 0,
    fontSize: "20px",
  },
  closeModalButton: {
    backgroundColor: "transparent",
    border: "none",
    color: "#94a3b8",
    fontSize: "24px",
    cursor: "pointer",
    padding: "0",
    ":hover": {
      color: "#e2e8f0",
    },
  },
  modalBody: {
    color: "#e2e8f0",
  },
  profileSection: {
    marginBottom: "24px",
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: "18px",
    marginBottom: "16px",
    borderBottom: "1px solid #334155",
    paddingBottom: "8px",
  },
  resumoSection: {
    marginTop: "16px",
    padding: "16px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  educationItem: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  experienceItem: {
    marginBottom: "16px",
    padding: "12px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  skillsContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "12px",
  },
  skillItem: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
  },
  skillLevel: {
    display: "flex",
    gap: "4px",
  },
  skillDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
  },
  infoGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "16px",
    marginBottom: "16px",
  },
  infoItem: {
    color: "#e2e8f0",
  },
  itemTitle: {
    color: "#e2e8f0",
    fontSize: "16px",
    margin: "0 0 4px 0",
  },
  itemSubtitle: {
    color: "#94a3b8",
    fontSize: "14px",
    margin: "0 0 4px 0",
  },
  itemDate: {
    color: "#64748b",
    fontSize: "14px",
    margin: "0 0 8px 0",
  },
  itemDescription: {
    color: "#e2e8f0",
    fontSize: "14px",
    margin: "8px 0 0 0",
    lineHeight: "1.5",
  },
  areasContainer: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
  },
  areaTag: {
    backgroundColor: "#1e40af",
    color: "#e2e8f0",
    padding: "4px 12px",
    borderRadius: "16px",
    fontSize: "14px",
  },
  linksContainer: {
    display: "flex",
    gap: "16px",
  },
  link: {
    color: "#60a5fa",
    textDecoration: "none",
    ":hover": {
      textDecoration: "underline",
    },
  },
  skillInfo: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "4px",
  },
  skillName: {
    color: "#e2e8f0",
    fontSize: "14px",
  },
  skillCategory: {
    color: "#94a3b8",
    fontSize: "12px",
  },
};

export default CompanyDashboard;
