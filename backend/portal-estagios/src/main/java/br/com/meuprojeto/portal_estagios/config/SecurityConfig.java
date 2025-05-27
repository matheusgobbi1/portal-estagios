package br.com.meuprojeto.portal_estagios.config;

import br.com.meuprojeto.portal_estagios.security.JwtAuthEntryPoint;
import br.com.meuprojeto.portal_estagios.security.JwtRequestFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

/**
 * Configuração de segurança da aplicação.
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final JwtAuthEntryPoint jwtAuthEntryPoint;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowCredentials(true);
        config.addAllowedOrigin("http://localhost:3000");
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");
        source.registerCorsConfiguration("/api/**", config);
        return new CorsFilter(source);
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.and())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(jwtAuthEntryPoint))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Rotas públicas
                        .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/test-auth/**").permitAll()

                        // Rotas de Área - apenas ADMIN pode criar, atualizar e deletar
                        .requestMatchers(HttpMethod.GET, "/api/areas/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/areas").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/areas/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/areas/**").hasRole("ADMIN")

                        // Rotas de Empresa - acesso permitido para ADMIN e a própria empresa
                        .requestMatchers(HttpMethod.GET, "/api/companies/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/companies").permitAll() // Permitir registro
                        .requestMatchers(HttpMethod.PUT, "/api/companies/**").hasAnyRole("ADMIN", "COMPANY")
                        .requestMatchers(HttpMethod.DELETE, "/api/companies/**").hasRole("ADMIN")

                        // Rotas de Estudante - acesso permitido para ADMIN e o próprio estudante
                        .requestMatchers(HttpMethod.GET, "/api/students/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/students").permitAll() // Permitir registro
                        .requestMatchers(HttpMethod.PUT, "/api/students/**").permitAll()
                        .requestMatchers(HttpMethod.DELETE, "/api/students/**").hasRole("ADMIN")

                        // Rotas de Vagas - COMPANY cria e gerencia suas vagas
                        .requestMatchers(HttpMethod.GET, "/api/job-offers/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/job-offers").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.PUT, "/api/job-offers/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.PATCH, "/api/job-offers/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.DELETE, "/api/job-offers/**").hasAnyRole("ADMIN", "COMPANY")

                        // Rotas de Inscrições - STUDENT se inscreve, COMPANY vê inscrições
                        .requestMatchers(HttpMethod.GET, "/api/applications").hasAnyRole("ADMIN", "COMPANY")
                        .requestMatchers(HttpMethod.GET, "/api/applications/student/**").hasAnyRole("ADMIN", "STUDENT")
                        .requestMatchers(HttpMethod.GET, "/api/applications/job-offer/**")
                        .hasAnyRole("ADMIN", "COMPANY")
                        .requestMatchers(HttpMethod.POST, "/api/applications").hasRole("STUDENT")
                        .requestMatchers(HttpMethod.PATCH, "/api/applications/**").hasRole("COMPANY")
                        .requestMatchers(HttpMethod.DELETE, "/api/applications/**").hasAnyRole("ADMIN", "STUDENT")

                        // Qualquer outra rota requer autenticação
                        .anyRequest().authenticated())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}