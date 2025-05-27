import React, { memo } from "react";
import { JobOffer } from "../../interfaces";
import { styles } from "../../pages/student/DashboardStyles";

interface VagaCardProps {
  vaga: JobOffer;
  inscrito: boolean;
  onInscrever: (id: number) => void;
}

const VagaCard: React.FC<VagaCardProps> = ({ vaga, inscrito, onInscrever }) => {
  return (
    <div key={vaga.id} style={styles.vagaCard}>
      <h2 style={styles.vagaTitulo}>{vaga.titulo}</h2>
      <div style={styles.vagaDetalhes}>
        <p style={styles.vagaInfo}>
          <strong>Área:</strong> {vaga.area.nome}
        </p>
        <p style={styles.vagaInfo}>
          <strong>Modalidade:</strong> {vaga.modalidade}
        </p>
        <p style={styles.vagaInfo}>
          <strong>Carga Horária:</strong> {vaga.cargaHoraria}h
        </p>
        <p style={styles.vagaInfo}>
          <strong>Localização:</strong> {vaga.localizacao}
        </p>
      </div>
      <div style={styles.vagaDescricao}>
        <p style={{ color: "#94a3b8" }}>
          {vaga.descricao.substring(0, 150)}...
        </p>
      </div>
      <button
        style={{
          ...styles.inscreverButton,
          backgroundColor: inscrito ? "#34d399" : "#3b82f6",
          cursor: inscrito ? "default" : "pointer",
        }}
        onClick={() => !inscrito && onInscrever(vaga.id)}
        disabled={inscrito}
      >
        {inscrito ? "Inscrito" : "Inscrever-se"}
      </button>
    </div>
  );
};

// Memo evita re-renderizações desnecessárias
export default memo(VagaCard);
