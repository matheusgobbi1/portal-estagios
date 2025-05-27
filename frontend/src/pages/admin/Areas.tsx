import React, { useEffect, useState } from "react";
import areaService from "../../services/areaService";
import { Area } from "../../interfaces";
import { Link } from "react-router-dom";

const Areas: React.FC = () => {
  const [areas, setAreas] = useState<Area[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Estado para nova área
  const [novaArea, setNovaArea] = useState("");

  // Estado para edição
  const [editando, setEditando] = useState<number | null>(null);
  const [nomeEditado, setNomeEditado] = useState("");

  // Estado para confirmação de remoção
  const [areaParaRemover, setAreaParaRemover] = useState<number | null>(null);

  // Carregar áreas
  useEffect(() => {
    const carregarAreas = async () => {
      try {
        const data = await areaService.buscarTodas();
        setAreas(data);
        setLoading(false);
      } catch (err) {
        console.error("Erro ao carregar áreas:", err);
        setError("Falha ao carregar áreas. Tente novamente mais tarde.");
        setLoading(false);
      }
    };

    carregarAreas();
  }, []);

  // Adicionar nova área
  const adicionarArea = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!novaArea.trim()) {
      alert("O nome da área não pode estar vazio.");
      return;
    }

    try {
      const novaAreaObj = { nome: novaArea };
      const areaAdicionada = await areaService.criar(novaAreaObj);
      setAreas([...areas, areaAdicionada]);
      setNovaArea("");
    } catch (err) {
      console.error("Erro ao adicionar área:", err);
      alert("Não foi possível adicionar a área. Tente novamente.");
    }
  };

  // Iniciar edição
  const iniciarEdicao = (area: Area) => {
    setEditando(area.id);
    setNomeEditado(area.nome);
  };

  // Cancelar edição
  const cancelarEdicao = () => {
    setEditando(null);
    setNomeEditado("");
  };

  // Salvar edição
  const salvarEdicao = async (id: number) => {
    if (!nomeEditado.trim()) {
      alert("O nome da área não pode estar vazio.");
      return;
    }

    try {
      const areaAtualizada = await areaService.atualizar(id, {
        nome: nomeEditado,
      });
      setAreas(areas.map((area) => (area.id === id ? areaAtualizada : area)));
      setEditando(null);
    } catch (err) {
      console.error("Erro ao atualizar área:", err);
      alert("Não foi possível atualizar a área. Tente novamente.");
    }
  };

  // Iniciar processo de remoção
  const iniciarRemocao = (id: number) => {
    setAreaParaRemover(id);
  };

  // Cancelar remoção
  const cancelarRemocao = () => {
    setAreaParaRemover(null);
  };

  // Confirmar e executar remoção
  const confirmarRemocao = async () => {
    if (areaParaRemover === null) return;

    try {
      await areaService.remover(areaParaRemover);
      setAreas(areas.filter((area) => area.id !== areaParaRemover));
      setAreaParaRemover(null);
    } catch (err) {
      console.error("Erro ao remover área:", err);
      alert("Não foi possível remover a área. Tente novamente.");
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#e2e8f0" }}>Carregando áreas...</p>
      </div>
    );
  }

  if (error) {
    return <div style={styles.error}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Gerenciamento de Áreas de Interesse</h1>
        <Link to="/admin" style={styles.backButton}>
          <span>←</span> Voltar ao Dashboard
        </Link>
      </div>

      <div style={styles.formContainer}>
        <h2 style={styles.subtitle}>Adicionar Nova Área</h2>
        <form onSubmit={adicionarArea} style={styles.form}>
          <input
            type="text"
            value={novaArea}
            onChange={(e) => setNovaArea(e.target.value)}
            placeholder="Nome da área"
            style={styles.input}
          />
          <button type="submit" style={styles.addButton}>
            Adicionar
          </button>
        </form>
      </div>

      <div style={styles.listContainer}>
        <h2 style={styles.subtitle}>Áreas Cadastradas</h2>
        {areas.length === 0 ? (
          <p style={{ color: "#94a3b8" }}>Nenhuma área cadastrada.</p>
        ) : (
          <ul style={styles.list}>
            {areas.map((area) => (
              <li key={area.id} style={styles.listItem}>
                {editando === area.id ? (
                  <div style={styles.editContainer}>
                    <input
                      type="text"
                      value={nomeEditado}
                      onChange={(e) => setNomeEditado(e.target.value)}
                      style={styles.input}
                    />
                    <button
                      onClick={() => salvarEdicao(area.id)}
                      style={styles.saveButton}
                    >
                      Salvar
                    </button>
                    <button
                      onClick={cancelarEdicao}
                      style={styles.cancelButton}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <>
                    <span style={{ color: "#e2e8f0" }}>{area.nome}</span>
                    <div style={styles.buttonGroup}>
                      <button
                        onClick={() => iniciarEdicao(area)}
                        style={styles.editButton}
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => iniciarRemocao(area.id)}
                        style={styles.removeButton}
                      >
                        Remover
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {areaParaRemover !== null && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={{ color: "#e2e8f0", marginBottom: "16px" }}>
              Confirmar Remoção
            </h3>
            <p style={{ color: "#94a3b8" }}>
              Tem certeza que deseja remover esta área?
            </p>
            <div style={styles.modalButtons}>
              <button onClick={cancelarRemocao} style={styles.cancelButton}>
                Cancelar
              </button>
              <button onClick={confirmarRemocao} style={styles.confirmButton}>
                Confirmar
              </button>
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
    maxWidth: "800px",
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
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  formContainer: {
    marginBottom: "32px",
    padding: "24px",
    backgroundColor: "#1e293b",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  subtitle: {
    color: "#e2e8f0",
    marginTop: 0,
    marginBottom: "16px",
    fontSize: "20px",
    fontWeight: "500",
  },
  form: {
    display: "flex",
    gap: "12px",
  },
  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  listContainer: {
    backgroundColor: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  list: {
    listStyle: "none",
    padding: 0,
    margin: 0,
  },
  listItem: {
    padding: "16px",
    borderBottom: "1px solid #334155",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  editContainer: {
    display: "flex",
    gap: "12px",
    flex: 1,
  },
  buttonGroup: {
    display: "flex",
    gap: "12px",
  },
  editButton: {
    padding: "8px 16px",
    backgroundColor: "#2196F3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  removeButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  saveButton: {
    padding: "8px 16px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cancelButton: {
    padding: "8px 16px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  confirmButton: {
    padding: "8px 16px",
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
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
  modal: {
    backgroundColor: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    maxWidth: "400px",
    width: "100%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
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
};

export default Areas;
