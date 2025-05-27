package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;


@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Education {

    @Column(name = "instituicao")
    private String instituicao;

    @Column(name = "curso")
    private String curso;

    @Column(name = "nivel")
    private String nivel; 

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "em_andamento")
    private boolean emAndamento;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
}