import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Student, Education, Experience, Skill, Area } from "../../interfaces";
import api from "../../services/api";

const StudentProfile: React.FC = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [areas, setAreas] = useState<Area[]>([]);
  const [activeTab, setActiveTab] = useState("pessoal");

  // Função para validar campos obrigatórios
  const validarCamposObrigatorios = (student: Student): boolean => {
    if (!student.cpf || student.cpf.trim() === "") {
      setError("O campo CPF é obrigatório");
      return false;
    }
    if (!student.telefone || student.telefone.trim() === "") {
      setError("O campo Telefone é obrigatório");
      return false;
    }
    if (!student.curso || student.curso.trim() === "") {
      setError("O campo Curso é obrigatório");
      return false;
    }
    return true;
  };

  // Estado para os dados do estudante
  const [student, setStudent] = useState<Student | null>(null);

  // Carregar dados do estudante
  const loadStudentData = useCallback(async () => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      // Se já temos os dados completos no localStorage, use-os
      if (userData.id && userData.nome && userData.email) {
        setStudent(userData);
        setLoading(false);
        return;
      }

      // Caso contrário, busque do servidor
      const response = await api.get(`/students/${userData.id}`);
      setStudent(response.data);

      // Atualize o localStorage com os dados completos
      localStorage.setItem("user", JSON.stringify(response.data));
    } catch (err) {
      console.error("Erro ao carregar dados:", err);
      setError("Falha ao carregar dados do perfil");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStudentData();
  }, [loadStudentData]);

  // Buscar áreas de atuação
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const areasResponse = await api.get("/areas");
        setAreas(areasResponse.data);
      } catch (err) {
        console.error("Erro ao carregar áreas de atuação:", err);
        setError(
          "Falha ao carregar áreas de atuação. Tente novamente mais tarde."
        );
      }
    };

    fetchAreas();
  }, []);

  // Manipuladores para campos pessoais
  const handlePersonalChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (student) {
      setStudent({ ...student, [name]: value });
    }
  };

  // Manipulador para áreas de interesse
  const handleAreaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!student) return;

    const selectedOptions = Array.from(e.target.selectedOptions);
    const selectedAreaIds = selectedOptions.map((option) =>
      parseInt(option.value)
    );

    const selectedAreas = areas.filter((area) =>
      selectedAreaIds.includes(area.id)
    );
    setStudent({ ...student, areasInteresse: selectedAreas });
  };

  // Funções para manipular arrays de educação, experiência e habilidades
  const addEducation = () => {
    if (!student) return;
    const newEducation: Education = {
      instituicao: "",
      curso: "",
      nivel: "",
      dataInicio: "",
      emAndamento: false,
      descricao: "",
    };

    setStudent({
      ...student,
      educacao: [...(student.educacao || []), newEducation],
    });
  };

  const updateEducation = (
    index: number,
    field: keyof Education,
    value: any
  ) => {
    if (!student || !student.educacao) return;

    const updatedEducacao = [...student.educacao];
    updatedEducacao[index] = {
      ...updatedEducacao[index],
      [field]: value,
    };

    setStudent({
      ...student,
      educacao: updatedEducacao,
    });
  };

  const removeEducation = (index: number) => {
    if (!student || !student.educacao) return;

    const updatedEducacao = [...student.educacao];
    updatedEducacao.splice(index, 1);

    setStudent({
      ...student,
      educacao: updatedEducacao,
    });
  };

  // Funções similares para experiência profissional
  const addExperience = () => {
    if (!student) return;
    const newExperience: Experience = {
      empresa: "",
      cargo: "",
      dataInicio: "",
      atual: false,
      descricao: "",
    };

    setStudent({
      ...student,
      experiencia: [...(student.experiencia || []), newExperience],
    });
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: any
  ) => {
    if (!student || !student.experiencia) return;

    const updatedExperiencia = [...student.experiencia];
    updatedExperiencia[index] = {
      ...updatedExperiencia[index],
      [field]: value,
    };

    setStudent({
      ...student,
      experiencia: updatedExperiencia,
    });
  };

  const removeExperience = (index: number) => {
    if (!student || !student.experiencia) return;

    const updatedExperiencia = [...student.experiencia];
    updatedExperiencia.splice(index, 1);

    setStudent({
      ...student,
      experiencia: updatedExperiencia,
    });
  };

  // Funções para habilidades
  const addSkill = () => {
    if (!student) return;
    const newSkill: Skill = {
      nome: "",
      nivel: 1,
      categoria: "",
    };

    setStudent({
      ...student,
      habilidades: [...(student.habilidades || []), newSkill],
    });
  };

  const updateSkill = (index: number, field: keyof Skill, value: any) => {
    if (!student || !student.habilidades) return;

    const updatedHabilidades = [...student.habilidades];
    updatedHabilidades[index] = {
      ...updatedHabilidades[index],
      [field]: field === "nivel" ? parseInt(value) : value,
    };

    setStudent({
      ...student,
      habilidades: updatedHabilidades,
    });
  };

  const removeSkill = (index: number) => {
    if (!student || !student.habilidades) return;

    const updatedHabilidades = [...student.habilidades];
    updatedHabilidades.splice(index, 1);

    setStudent({
      ...student,
      habilidades: updatedHabilidades,
    });
  };

  // Salvar todas as alterações
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!student) return;

    // Validar campos obrigatórios
    if (!validarCamposObrigatorios(student)) {
      setTimeout(() => setError(null), 3000);
      return;
    }

    try {
      setSaving(true);
      await api.put(`/students/${student.id}`, student);

      // Atualizar o localStorage com os dados atualizados
      localStorage.setItem("user", JSON.stringify(student));

      setSuccess("Perfil atualizado com sucesso!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error("Erro ao salvar:", err);
      setError("Falha ao salvar as alterações. Tente novamente.");
      setTimeout(() => setError(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    navigate("/estudante");
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
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Meu Perfil</h1>
          <div style={styles.headerActions}>
            <button onClick={handleBack} style={styles.backButton}>
              Voltar
            </button>
          </div>
        </div>
      </div>

      {error && <div style={styles.errorMessage}>{error}</div>}
      {success && <div style={styles.successMessage}>{success}</div>}

      <div style={styles.tabsContainer}>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === "pessoal" ? "#1e40af" : "#2563eb",
          }}
          onClick={() => setActiveTab("pessoal")}
        >
          Dados Pessoais
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor: activeTab === "educacao" ? "#1e40af" : "#2563eb",
          }}
          onClick={() => setActiveTab("educacao")}
        >
          Formação Acadêmica
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor:
              activeTab === "experiencia" ? "#1e40af" : "#2563eb",
          }}
          onClick={() => setActiveTab("experiencia")}
        >
          Experiência Profissional
        </button>
        <button
          style={{
            ...styles.tabButton,
            backgroundColor:
              activeTab === "habilidades" ? "#1e40af" : "#2563eb",
          }}
          onClick={() => setActiveTab("habilidades")}
        >
          Habilidades
        </button>
      </div>

      <form onSubmit={handleSubmit} style={styles.form}>
        {/* Aba de Dados Pessoais */}
        {activeTab === "pessoal" && student && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Informações Pessoais</h2>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Nome</label>
                <input
                  type="text"
                  name="nome"
                  value={student.nome || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  CPF <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="cpf"
                  value={student.cpf || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>E-mail</label>
                <input
                  type="email"
                  name="email"
                  value={student.email || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Telefone <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="telefone"
                  value={student.telefone || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                  required
                />
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Curso <span style={{ color: "#ef4444" }}>*</span>
                </label>
                <input
                  type="text"
                  name="curso"
                  value={student.curso || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                  required
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Data de Nascimento</label>
                <input
                  type="date"
                  name="dataNascimento"
                  value={student.dataNascimento || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                />
              </div>
            </div>

            <h2 style={styles.sectionTitle}>Links e Redes Sociais</h2>

            <div style={styles.formRow}>
              <div style={styles.formGroup}>
                <label style={styles.label}>LinkedIn</label>
                <input
                  type="url"
                  name="linkedin"
                  value={student.linkedin || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>GitHub</label>
                <input
                  type="url"
                  name="github"
                  value={student.github || ""}
                  onChange={handlePersonalChange}
                  style={styles.input}
                  placeholder="https://github.com/seu-usuario"
                />
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Portfolio / Site Pessoal</label>
              <input
                type="url"
                name="portfolio"
                value={student.portfolio || ""}
                onChange={handlePersonalChange}
                style={styles.input}
                placeholder="https://seusite.com"
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Resumo Profissional</label>
              <textarea
                name="resumo"
                value={student.resumo || ""}
                onChange={handlePersonalChange}
                style={styles.textarea}
                rows={5}
                placeholder="Escreva um breve resumo sobre você, suas habilidades e objetivos profissionais..."
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Áreas de Interesse</label>
              <select
                multiple
                value={
                  student.areasInteresse?.map((area) => area.id.toString()) ||
                  []
                }
                onChange={handleAreaChange}
                style={styles.select}
              >
                {areas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.nome}
                  </option>
                ))}
              </select>
              <span style={styles.helpText}>
                Segure CTRL para selecionar múltiplas áreas
              </span>
            </div>
          </div>
        )}

        {/* Aba de Formação Acadêmica */}
        {activeTab === "educacao" && student && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Formação Acadêmica</h2>

            {(!student.educacao || student.educacao.length === 0) && (
              <div style={styles.emptyState}>
                <p>Você ainda não adicionou nenhuma formação acadêmica.</p>
              </div>
            )}

            {student.educacao &&
              student.educacao.map((edu, index) => (
                <div key={index} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <h3 style={styles.itemTitle}>Formação {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeEducation(index)}
                      style={styles.removeButton}
                    >
                      Remover
                    </button>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Instituição</label>
                      <input
                        type="text"
                        value={edu.instituicao || ""}
                        onChange={(e) =>
                          updateEducation(index, "instituicao", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nível</label>
                      <select
                        value={edu.nivel || ""}
                        onChange={(e) =>
                          updateEducation(index, "nivel", e.target.value)
                        }
                        style={styles.input}
                      >
                        <option value="">Selecione...</option>
                        <option value="Ensino Médio">Ensino Médio</option>
                        <option value="Técnico">Técnico</option>
                        <option value="Graduação">Graduação</option>
                        <option value="Pós-graduação">Pós-graduação</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Curso</label>
                    <input
                      type="text"
                      value={edu.curso || ""}
                      onChange={(e) =>
                        updateEducation(index, "curso", e.target.value)
                      }
                      style={styles.input}
                    />
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Data de Início</label>
                      <input
                        type="date"
                        value={edu.dataInicio || ""}
                        onChange={(e) =>
                          updateEducation(index, "dataInicio", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Em andamento?</label>
                      <select
                        value={edu.emAndamento ? "true" : "false"}
                        onChange={(e) =>
                          updateEducation(index, "emAndamento", e.target.value)
                        }
                        style={styles.input}
                      >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                  </div>

                  {!edu.emAndamento && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Data de Conclusão</label>
                      <input
                        type="date"
                        value={edu.dataFim || ""}
                        onChange={(e) =>
                          updateEducation(index, "dataFim", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Descrição</label>
                    <textarea
                      value={edu.descricao || ""}
                      onChange={(e) =>
                        updateEducation(index, "descricao", e.target.value)
                      }
                      style={styles.textarea}
                      rows={3}
                      placeholder="Descreva brevemente seu curso, atividades relevantes, etc."
                    />
                  </div>
                </div>
              ))}

            <button
              type="button"
              onClick={addEducation}
              style={styles.addButton}
            >
              + Adicionar Formação
            </button>
          </div>
        )}

        {/* Aba de Experiência Profissional */}
        {activeTab === "experiencia" && student && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Experiência Profissional</h2>

            {(!student.experiencia || student.experiencia.length === 0) && (
              <div style={styles.emptyState}>
                <p>
                  Você ainda não adicionou nenhuma experiência profissional.
                </p>
              </div>
            )}

            {student.experiencia &&
              student.experiencia.map((exp, index) => (
                <div key={index} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <h3 style={styles.itemTitle}>Experiência {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeExperience(index)}
                      style={styles.removeButton}
                    >
                      Remover
                    </button>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Empresa</label>
                      <input
                        type="text"
                        value={exp.empresa || ""}
                        onChange={(e) =>
                          updateExperience(index, "empresa", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Cargo</label>
                      <input
                        type="text"
                        value={exp.cargo || ""}
                        onChange={(e) =>
                          updateExperience(index, "cargo", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Data de Início</label>
                      <input
                        type="date"
                        value={exp.dataInicio || ""}
                        onChange={(e) =>
                          updateExperience(index, "dataInicio", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Emprego atual?</label>
                      <select
                        value={exp.atual ? "true" : "false"}
                        onChange={(e) =>
                          updateExperience(index, "atual", e.target.value)
                        }
                        style={styles.input}
                      >
                        <option value="false">Não</option>
                        <option value="true">Sim</option>
                      </select>
                    </div>
                  </div>

                  {!exp.atual && (
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Data de Término</label>
                      <input
                        type="date"
                        value={exp.dataFim || ""}
                        onChange={(e) =>
                          updateExperience(index, "dataFim", e.target.value)
                        }
                        style={styles.input}
                      />
                    </div>
                  )}

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Descrição</label>
                    <textarea
                      value={exp.descricao || ""}
                      onChange={(e) =>
                        updateExperience(index, "descricao", e.target.value)
                      }
                      style={styles.textarea}
                      rows={3}
                      placeholder="Descreva suas principais responsabilidades e realizações neste cargo..."
                    />
                  </div>
                </div>
              ))}

            <button
              type="button"
              onClick={addExperience}
              style={styles.addButton}
            >
              + Adicionar Experiência
            </button>
          </div>
        )}

        {/* Aba de Habilidades */}
        {activeTab === "habilidades" && student && (
          <div style={styles.tabContent}>
            <h2 style={styles.sectionTitle}>Habilidades</h2>

            {(!student.habilidades || student.habilidades.length === 0) && (
              <div style={styles.emptyState}>
                <p>Você ainda não adicionou nenhuma habilidade.</p>
              </div>
            )}

            {student.habilidades &&
              student.habilidades.map((skill, index) => (
                <div key={index} style={styles.itemCard}>
                  <div style={styles.itemHeader}>
                    <h3 style={styles.itemTitle}>Habilidade {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeSkill(index)}
                      style={styles.removeButton}
                    >
                      Remover
                    </button>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Nome da Habilidade</label>
                      <input
                        type="text"
                        value={skill.nome || ""}
                        onChange={(e) =>
                          updateSkill(index, "nome", e.target.value)
                        }
                        style={styles.input}
                        placeholder="Ex: Java, Inglês, Liderança, etc."
                      />
                    </div>

                    <div style={styles.formGroup}>
                      <label style={styles.label}>Categoria</label>
                      <select
                        value={skill.categoria || ""}
                        onChange={(e) =>
                          updateSkill(index, "categoria", e.target.value)
                        }
                        style={styles.input}
                      >
                        <option value="">Selecione...</option>
                        <option value="Técnica">Técnica</option>
                        <option value="Comportamental">Comportamental</option>
                        <option value="Idioma">Idioma</option>
                        <option value="Ferramenta">Ferramenta</option>
                        <option value="Certificação">Certificação</option>
                      </select>
                    </div>
                  </div>

                  <div style={styles.formGroup}>
                    <label style={styles.label}>Nível (1-5)</label>
                    <div style={styles.sliderContainer}>
                      <input
                        type="range"
                        min="1"
                        max="5"
                        value={skill.nivel || 1}
                        onChange={(e) =>
                          updateSkill(index, "nivel", e.target.value)
                        }
                        style={styles.slider}
                      />
                      <span style={styles.sliderValue}>{skill.nivel}</span>
                    </div>
                    <div style={styles.sliderLabels}>
                      <span>Básico</span>
                      <span>Avançado</span>
                    </div>
                  </div>
                </div>
              ))}

            <button type="button" onClick={addSkill} style={styles.addButton}>
              + Adicionar Habilidade
            </button>
          </div>
        )}

        <div style={styles.formActions}>
          <button
            type="submit"
            disabled={saving}
            style={{
              ...styles.saveButton,
              backgroundColor: saving ? "#94a3b8" : "#10b981",
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    padding: "24px",
    maxWidth: "1000px",
    margin: "0 auto",
  },
  header: {
    marginBottom: "32px",
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  headerContent: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerActions: {
    display: "flex",
    gap: "10px",
  },
  title: {
    color: "#e2e8f0",
    margin: 0,
    fontSize: "24px",
    fontWeight: "600",
  },
  backButton: {
    padding: "10px 20px",
    backgroundColor: "#6366f1",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
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
  errorMessage: {
    backgroundColor: "#7f1d1d",
    color: "#fecaca",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  successMessage: {
    backgroundColor: "#065f46",
    color: "#d1fae5",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "16px",
    textAlign: "center" as const,
  },
  tabsContainer: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  tabButton: {
    padding: "10px 20px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  form: {
    backgroundColor: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
  },
  tabContent: {
    marginBottom: "20px",
  },
  sectionTitle: {
    color: "#e2e8f0",
    fontSize: "18px",
    marginBottom: "16px",
    borderBottom: "1px solid #334155",
    paddingBottom: "8px",
  },
  formGroup: {
    marginBottom: "16px",
    flex: "1",
  },
  formRow: {
    display: "flex",
    gap: "16px",
    marginBottom: "0",
  },
  label: {
    display: "block",
    color: "#e2e8f0",
    marginBottom: "8px",
    fontSize: "14px",
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
  textarea: {
    width: "100%",
    padding: "10px",
    backgroundColor: "#0f172a",
    border: "1px solid #334155",
    borderRadius: "8px",
    color: "#e2e8f0",
    fontSize: "14px",
    resize: "vertical" as const,
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
  helpText: {
    display: "block",
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "4px",
  },
  formActions: {
    marginTop: "24px",
    display: "flex",
    justifyContent: "flex-end",
  },
  saveButton: {
    padding: "12px 24px",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  emptyState: {
    padding: "20px",
    backgroundColor: "#1e293b",
    border: "1px dashed #334155",
    borderRadius: "8px",
    textAlign: "center" as const,
    color: "#94a3b8",
    marginBottom: "20px",
  },
  itemCard: {
    padding: "16px",
    backgroundColor: "#0f172a",
    borderRadius: "8px",
    marginBottom: "16px",
    border: "1px solid #334155",
  },
  itemHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
  itemTitle: {
    color: "#e2e8f0",
    fontSize: "16px",
    margin: 0,
  },
  removeButton: {
    padding: "6px 12px",
    backgroundColor: "#991b1b",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "12px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "10px",
  },
  sliderContainer: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  slider: {
    flex: "1",
    backgroundColor: "#0f172a",
  },
  sliderValue: {
    color: "#e2e8f0",
    fontWeight: "bold",
    minWidth: "20px",
    textAlign: "center" as const,
  },
  sliderLabels: {
    display: "flex",
    justifyContent: "space-between",
    color: "#94a3b8",
    fontSize: "12px",
    marginTop: "4px",
  },
};

export default StudentProfile;
