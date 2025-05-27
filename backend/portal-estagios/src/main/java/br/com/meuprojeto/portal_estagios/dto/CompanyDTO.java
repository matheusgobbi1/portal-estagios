package br.com.meuprojeto.portal_estagios.dto;

import br.com.meuprojeto.portal_estagios.entity.Company;
import lombok.Data;

@Data
public class CompanyDTO {
    private Long id;
    private String nome;
    private String cnpj;
    private String endereco;
    private String telefone;
    private String email;

    public static CompanyDTO fromEntity(Company company) {
        CompanyDTO dto = new CompanyDTO();
        dto.setId(company.getId());
        dto.setNome(company.getNome());
        dto.setCnpj(company.getCnpj());
        dto.setEndereco(company.getEndereco());
        dto.setTelefone(company.getTelefone());
        dto.setEmail(company.getEmail());
        return dto;
    }
}