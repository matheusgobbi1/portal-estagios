package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Classe que representa uma habilidade do estudante.
 */
@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Skill {

    @Column(name = "nome")
    private String nome;

    @Column(name = "nivel")
    private Integer nivel; // 1-5

    @Column(name = "categoria")
    private String categoria; // Técnica, Comportamental, Idioma, etc.
}