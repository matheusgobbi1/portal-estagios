package br.com.meuprojeto.portal_estagios.dto;

import br.com.meuprojeto.portal_estagios.entity.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Data
public class StudentUpdateDTO {
    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "O e-mail deve ser válido")
    private String email;

    private String senha;

    @NotBlank(message = "O telefone é obrigatório")
    private String telefone;

    @NotBlank(message = "O CPF é obrigatório")
    private String cpf;

    @NotBlank(message = "O curso é obrigatório")
    private String curso;

    private LocalDate dataNascimento;

    private String github;

    private String linkedin;

    private String portfolio;

    private String resumo;

    private Set<AreaDTO> areasInteresse;

    private List<EducationDTO> educacao;

    private List<ExperienceDTO> experiencia;

    private List<SkillDTO> habilidades;

    @Data
    public static class AreaDTO {
        private Long id;
        private String nome;
    }

    @Data
    public static class EducationDTO {
        private String instituicao;
        private String curso;
        private String nivel;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private boolean emAndamento;
        private String descricao;
    }

    @Data
    public static class ExperienceDTO {
        private String empresa;
        private String cargo;
        private LocalDate dataInicio;
        private LocalDate dataFim;
        private boolean atual;
        private String descricao;
    }

    @Data
    public static class SkillDTO {
        private String nome;
        private Integer nivel;
        private String categoria;
    }

    public Student toEntity(Student existingStudent) {
        Student student = new Student();
        student.setId(existingStudent.getId());
        student.setNome(this.nome);
        student.setEmail(this.email);
        student.setTelefone(this.telefone);
        student.setCpf(this.cpf);
        student.setCurso(this.curso);
        student.setRole(existingStudent.getRole());
        student.setSenha(existingStudent.getSenha());

        // Novos campos
        student.setDataNascimento(this.dataNascimento);
        student.setGithub(this.github);
        student.setLinkedin(this.linkedin);
        student.setPortfolio(this.portfolio);
        student.setResumo(this.resumo);

        // Áreas de interesse
        if (this.areasInteresse != null) {
            student.setAreasInteresse(this.areasInteresse.stream()
                    .map(area -> {
                        var areaEntity = new Area();
                        areaEntity.setId(area.getId());
                        if (area.getNome() != null) {
                            areaEntity.setNome(area.getNome());
                        }
                        return areaEntity;
                    })
                    .collect(Collectors.toSet()));
        }

        // Educação
        if (this.educacao != null) {
            student.setEducacao(this.educacao.stream()
                    .map(edu -> {
                        var education = new Education();
                        education.setInstituicao(edu.getInstituicao());
                        education.setCurso(edu.getCurso());
                        education.setNivel(edu.getNivel());
                        education.setDataInicio(edu.getDataInicio());
                        education.setDataFim(edu.getDataFim());
                        education.setEmAndamento(edu.isEmAndamento());
                        education.setDescricao(edu.getDescricao());
                        return education;
                    })
                    .collect(Collectors.toList()));
        }

        // Experiência
        if (this.experiencia != null) {
            student.setExperiencia(this.experiencia.stream()
                    .map(exp -> {
                        var experience = new Experience();
                        experience.setEmpresa(exp.getEmpresa());
                        experience.setCargo(exp.getCargo());
                        experience.setDataInicio(exp.getDataInicio());
                        experience.setDataFim(exp.getDataFim());
                        experience.setAtual(exp.isAtual());
                        experience.setDescricao(exp.getDescricao());
                        return experience;
                    })
                    .collect(Collectors.toList()));
        }

        // Habilidades
        if (this.habilidades != null) {
            student.setHabilidades(this.habilidades.stream()
                    .map(skill -> {
                        var skillEntity = new Skill();
                        skillEntity.setNome(skill.getNome());
                        skillEntity.setNivel(skill.getNivel());
                        skillEntity.setCategoria(skill.getCategoria());
                        return skillEntity;
                    })
                    .collect(Collectors.toList()));
        }

        return student;
    }
}