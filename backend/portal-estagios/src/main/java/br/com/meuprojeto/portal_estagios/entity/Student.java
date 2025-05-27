package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Entity
@Table(name = "students")
@DiscriminatorValue("STUDENT")
@Data
@EqualsAndHashCode(callSuper = true)
public class Student extends User {

    @NotBlank(message = "O CPF é obrigatório")
    @Column(nullable = false, unique = true)
    private String cpf;

    @NotBlank(message = "O curso é obrigatório")
    @Column(nullable = false)
    private String curso;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(name = "linkedin")
    private String linkedin;

    @Column(name = "github")
    private String github;

    @Column(name = "portfolio")
    private String portfolio;

    @Column(name = "resumo", columnDefinition = "TEXT")
    private String resumo;

    @ElementCollection
    @CollectionTable(name = "student_education", joinColumns = @JoinColumn(name = "student_id"))
    private List<Education> educacao = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "student_experience", joinColumns = @JoinColumn(name = "student_id"))
    private List<Experience> experiencia = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "student_skills", joinColumns = @JoinColumn(name = "student_id"))
    private List<Skill> habilidades = new ArrayList<>();

    @ManyToMany
    @JoinTable(name = "student_areas", joinColumns = @JoinColumn(name = "student_id"), inverseJoinColumns = @JoinColumn(name = "area_id"))
    private Set<Area> areasInteresse = new HashSet<>();

    @PrePersist
    @Override
    public void prePersist() {
        super.prePersist();
        setRole(Role.STUDENT);
    }
}