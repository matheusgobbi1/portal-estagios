import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import areaService from "../../services/areaService";
import jobOfferService from "../../services/jobOfferService";
import { Area, JobOfferModalidade } from "../../interfaces";

interface FormData {
  titulo: string;
  descricao: string;
  localizacao: string;
  modalidade: JobOfferModalidade;
  cargaHoraria: number;
  requisitos: string;
  areaId: number;
}

const NewJobOffer: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = React.useState<FormData>({
    titulo: "",
    descricao: "",
    localizacao: "",
    modalidade: JobOfferModalidade.PRESENCIAL,
    cargaHoraria: 20,
    requisitos: "",
    areaId: 0,
  });
  const [areas, setAreas] = React.useState<Area[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  React.useEffect(() => {
    const fetchAreas = async () => {
      try {
        setLoading(true);
        const response = await areaService.buscarTodas();
        setAreas(response);
        if (response.length > 0) {
          setForm((prev) => ({ ...prev, areaId: response[0].id }));
        }
      } catch (err) {
        console.error("Erro ao buscar áreas:", err);
        setError("Erro ao carregar áreas. Tente novamente.");
      } finally {
        setLoading(false);
      }
    };

    fetchAreas();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "cargaHoraria") {
      setForm((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const { areaId, ...jobOfferData } = form;
      const jobOfferToCreate = {
        ...jobOfferData,
        company: { id: user?.id },
        area: { id: areaId },
      };

      await jobOfferService.criar(jobOfferToCreate);
      setSuccess("Vaga cadastrada com sucesso!");

      setTimeout(() => {
        navigate("/empresa");
      }, 2000);
    } catch (err) {
      console.error("Erro ao cadastrar vaga:", err);
      setError("Erro ao cadastrar vaga. Verifique os dados e tente novamente.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.loadingSpinner}></div>
        <p style={{ color: "#e2e8f0" }}>Carregando...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cadastrar Nova Vaga</h1>
      </div>

      <div style={styles.formContainer}>
        {success && <div style={styles.successMessage}>{success}</div>}
        {error && <div style={styles.errorMessage}>{error}</div>}
        <form onSubmit={handleSubmit}>
          <div style={styles.formGroup}>
            <label htmlFor="titulo" style={styles.label}>
              Título*
            </label>
            <input
              id="titulo"
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="areaId" style={styles.label}>
              Área*
            </label>
            <select
              id="areaId"
              name="areaId"
              value={form.areaId}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value="">Selecione uma área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nome}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="descricao" style={styles.label}>
              Descrição*
            </label>
            <textarea
              id="descricao"
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              required
              rows={5}
              style={styles.textarea}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="localizacao" style={styles.label}>
              Localização*
            </label>
            <input
              id="localizacao"
              name="localizacao"
              value={form.localizacao}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="modalidade" style={styles.label}>
              Modalidade*
            </label>
            <select
              id="modalidade"
              name="modalidade"
              value={form.modalidade}
              onChange={handleChange}
              required
              style={styles.input}
            >
              <option value={JobOfferModalidade.PRESENCIAL}>Presencial</option>
              <option value={JobOfferModalidade.REMOTO}>Remoto</option>
              <option value={JobOfferModalidade.HIBRIDO}>Híbrido</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="cargaHoraria" style={styles.label}>
              Carga Horária (horas por semana)*
            </label>
            <input
              id="cargaHoraria"
              name="cargaHoraria"
              type="number"
              min="1"
              max="44"
              value={form.cargaHoraria}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="requisitos" style={styles.label}>
              Requisitos*
            </label>
            <textarea
              id="requisitos"
              name="requisitos"
              value={form.requisitos}
              onChange={handleChange}
              required
              rows={5}
              style={styles.textarea}
            />
          </div>

          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={() => navigate("/empresa")}
              style={styles.cancelButton}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={submitting}
              style={styles.submitButton}
            >
              {submitting ? "Cadastrando..." : "Cadastrar Vaga"}
            </button>
          </div>
        </form>
      </div>
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
  formContainer: {
    backgroundColor: "#1e293b",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  formGroup: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    fontWeight: "500",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontSize: "14px",
  },
  textarea: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    backgroundColor: "#0f172a",
    color: "#e2e8f0",
    fontSize: "14px",
    resize: "vertical" as const,
  },
  buttonGroup: {
    display: "flex",
    gap: "16px",
    marginTop: "24px",
  },
  cancelButton: {
    padding: "10px 20px",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#5a6268",
    },
  },
  submitButton: {
    padding: "10px 20px",
    backgroundColor: "#34d399",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    flex: 1,
    transition: "background-color 0.2s",
    ":hover": {
      backgroundColor: "#10b981",
    },
    ":disabled": {
      backgroundColor: "#94a3b8",
      cursor: "not-allowed",
    },
  },
  successMessage: {
    backgroundColor: "#065f46",
    color: "#d1fae5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
  },
  errorMessage: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "24px",
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
};

export default NewJobOffer;
