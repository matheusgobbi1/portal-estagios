package br.com.meuprojeto.portal_estagios.dto;

import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class JobOfferDTO {
    private Long id;
    private String titulo;
    private String descricao;
    private String localizacao;
    private JobOffer.Modalidade modalidade;
    private Integer cargaHoraria;
    private String requisitos;
    private boolean ativa;
    private LocalDateTime dataCriacao;
    private LocalDateTime dataAtualizacao;
    private LocalDateTime dataEncerramento;
    private CompanyDTO company;
    private AreaDTO area;

    public static JobOfferDTO fromEntity(JobOffer jobOffer) {
        JobOfferDTO dto = new JobOfferDTO();
        dto.setId(jobOffer.getId());
        dto.setTitulo(jobOffer.getTitulo());
        dto.setDescricao(jobOffer.getDescricao());
        dto.setLocalizacao(jobOffer.getLocalizacao());
        dto.setModalidade(jobOffer.getModalidade());
        dto.setCargaHoraria(jobOffer.getCargaHoraria());
        dto.setRequisitos(jobOffer.getRequisitos());
        dto.setAtiva(jobOffer.isAtiva());
        dto.setDataCriacao(jobOffer.getDataCriacao());
        dto.setDataAtualizacao(jobOffer.getDataAtualizacao());
        dto.setDataEncerramento(jobOffer.getDataEncerramento());

        if (jobOffer.getCompany() != null) {
            dto.setCompany(CompanyDTO.fromEntity(jobOffer.getCompany()));
        }

        if (jobOffer.getArea() != null) {
            dto.setArea(AreaDTO.fromEntity(jobOffer.getArea()));
        }

        return dto;
    }
}