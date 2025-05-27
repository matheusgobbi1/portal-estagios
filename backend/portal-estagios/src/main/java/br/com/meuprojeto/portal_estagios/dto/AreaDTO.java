package br.com.meuprojeto.portal_estagios.dto;

import br.com.meuprojeto.portal_estagios.entity.Area;
import lombok.Data;

@Data
public class AreaDTO {
    private Long id;
    private String nome;
    private String descricao;

    public static AreaDTO fromEntity(Area area) {
        AreaDTO dto = new AreaDTO();
        dto.setId(area.getId());
        dto.setNome(area.getNome());
        return dto;
    }
}