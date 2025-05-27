package br.com.meuprojeto.portal_estagios.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

/**
 * Utilitário para manipulação de tokens JWT.
 */
@Component
public class JwtUtil {

    // Por padrão, usamos uma chave forte. Em ambiente de produção, esta chave deve
    // ser segura e externa.
    @Value("${jwt.secret:12345678901234567890123456789012}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 horas por padrão
    private long expiration;

    /**
     * Extrai o nome de usuário do token
     * 
     * @param token Token JWT
     * @return Nome de usuário
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extrai a data de expiração do token
     * 
     * @param token Token JWT
     * @return Data de expiração
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extrai uma claim específica do token
     * 
     * @param token          Token JWT
     * @param claimsResolver Função para extrair a claim
     * @return Claim extraída
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extrai todas as claims do token
     * 
     * @param token Token JWT
     * @return Claims do token
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    /**
     * Verifica se o token está expirado
     * 
     * @param token Token JWT
     * @return true se expirado, false caso contrário
     */
    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Gera um token para o usuário
     * 
     * @param userDetails Detalhes do usuário
     * @return Token JWT
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        // Adiciona role como claim
        if (userDetails.getAuthorities() != null && !userDetails.getAuthorities().isEmpty()) {
            claims.put("role", userDetails.getAuthorities().iterator().next().getAuthority());
        }
        return createToken(claims, userDetails.getUsername());
    }

    /**
     * Cria um token com claims e subject
     * 
     * @param claims  Claims do token
     * @param subject Subject do token (nome de usuário)
     * @return Token JWT
     */
    private String createToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /**
     * Valida o token
     * 
     * @param token       Token JWT
     * @param userDetails Detalhes do usuário
     * @return true se válido, false caso contrário
     */
    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Obtém a chave de assinatura
     * 
     * @return Chave de assinatura
     */
    private Key getSigningKey() {
        byte[] keyBytes = secret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}