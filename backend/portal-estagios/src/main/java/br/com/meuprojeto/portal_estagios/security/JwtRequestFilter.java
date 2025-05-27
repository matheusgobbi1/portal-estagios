package br.com.meuprojeto.portal_estagios.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro para interceptar requisições e validar tokens JWT.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        final String authorizationHeader = request.getHeader("Authorization");
        log.info("Requisição recebida para: {} com header Authorization: {}", request.getRequestURI(),
                authorizationHeader);

        String username = null;
        String jwt = null;

        // Verifica se o header Authorization existe e começa com "Bearer "
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            jwt = authorizationHeader.substring(7);
            log.info("Token JWT extraído do header: {}", jwt);
            try {
                username = jwtUtil.extractUsername(jwt);
                log.info("Username extraído do token: {}", username);
            } catch (Exception e) {
                log.error("Erro ao extrair username do token: {}", e.getMessage());
            }
        } else {
            log.warn("Header Authorization não encontrado ou não começa com 'Bearer '");
        }

        // Se encontrou um usuário e não há autenticação no contexto de segurança
        if (username != null) {
            log.info("Tentando carregar UserDetails para o username: {}", username);
            try {
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
                log.info("UserDetails carregado com sucesso para: {}", username);

                // Se o token for válido, configura a autenticação no contexto de segurança
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    log.info("Token validado com sucesso para o usuário: {}", username);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, null, userDetails.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Autenticação configurada no contexto de segurança para: {}", username);
                    log.info("Authorities do usuário: {}", userDetails.getAuthorities());
                } else {
                    log.warn("Token inválido para o usuário: {}", username);
                    SecurityContextHolder.clearContext();
                }
            } catch (Exception e) {
                log.error("Erro ao carregar UserDetails para o username: {}", username, e);
                SecurityContextHolder.clearContext();
            }
        } else {
            log.debug("Username não encontrado no token");
            SecurityContextHolder.clearContext();
        }

        chain.doFilter(request, response);
    }
}