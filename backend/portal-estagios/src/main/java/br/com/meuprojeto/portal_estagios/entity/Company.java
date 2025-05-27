package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.HashSet;
import java.util.Set;

/**
 * Entidade que representa uma empresa no sistema.
 */
@Entity
@Table(name = "companies")
@DiscriminatorValue("COMPANY")
@Data
@EqualsAndHashCode(callSuper = true)
public class Company extends User {

    @NotBlank(message = "O CNPJ é obrigatório")
    @Column(nullable = false, unique = true)
    private String cnpj;

    @NotBlank(message = "O endereço é obrigatório")
    @Column(nullable = false)
    private String endereco;

    @ManyToMany
    @JoinTable(name = "company_areas", joinColumns = @JoinColumn(name = "company_id"), inverseJoinColumns = @JoinColumn(name = "area_id"))
    private Set<Area> areasAtuacao = new HashSet<>();

    @OneToMany(mappedBy = "company", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<JobOffer> vagas = new HashSet<>();

    @PrePersist
    @Override
    public void prePersist() {
        super.prePersist();
        setRole(Role.COMPANY);
    }
}