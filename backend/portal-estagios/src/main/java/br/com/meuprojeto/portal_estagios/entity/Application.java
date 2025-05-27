package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * Entidade que representa a inscrição de um estudante em uma vaga de estágio.
 */
@Entity
@Table(name = "applications")
@Data
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "job_offer_id", nullable = false)
    private JobOffer jobOffer;

    @Column(name = "data_inscricao", nullable = false, updatable = false)
    private LocalDateTime dataInscricao;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDENTE;

    @PrePersist
    public void prePersist() {
        this.dataInscricao = LocalDateTime.now();
    }

    /**
     * Enum que representa os possíveis status de uma inscrição
     */
    public enum Status {
        PENDENTE,
        EM_ANALISE,
        APROVADO,
        REJEITADO
    }
}