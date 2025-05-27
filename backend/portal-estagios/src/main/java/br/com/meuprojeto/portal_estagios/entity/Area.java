package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * Entidade que representa uma área de atuação/interesse para vagas de estágio.
 */
@Entity
@Table(name = "areas")
@Data
public class Area {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O nome da área é obrigatório")
    @Column(nullable = false, unique = true)
    private String nome;
}