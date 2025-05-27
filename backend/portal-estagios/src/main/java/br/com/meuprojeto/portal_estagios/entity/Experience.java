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
public class Experience {

    @Column(name = "empresa")
    private String empresa;

    @Column(name = "cargo")
    private String cargo;

    @Column(name = "data_inicio")
    private LocalDate dataInicio;

    @Column(name = "data_fim")
    private LocalDate dataFim;

    @Column(name = "atual")
    private boolean atual;

    @Column(name = "descricao", columnDefinition = "TEXT")
    private String descricao;
}