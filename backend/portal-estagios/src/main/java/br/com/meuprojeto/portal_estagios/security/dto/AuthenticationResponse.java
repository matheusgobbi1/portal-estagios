package br.com.meuprojeto.portal_estagios.security.dto;

import br.com.meuprojeto.portal_estagios.entity.Area;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;

/**
 * DTO para resposta de autenticação.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {

    private String token;
    private String tipo;
    private String email;
    private String role;
    private String nome;
    private Long id;
    private Set<Area> areasInteresse;
}