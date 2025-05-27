package br.com.meuprojeto.portal_estagios.security;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Ponto de entrada de autenticação JWT para lidar com erros de autenticação.
 */
@Component
public class JwtAuthEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException authException) throws IOException, ServletException {
        // Retorna erro 401 para requisições não autenticadas
        response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Não autorizado: " + authException.getMessage());
    }
}