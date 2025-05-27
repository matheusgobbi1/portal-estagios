package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.entity.Admin;
import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.entity.Student;
import br.com.meuprojeto.portal_estagios.entity.User;
import br.com.meuprojeto.portal_estagios.repository.UserRepository;
import br.com.meuprojeto.portal_estagios.security.JwtUtil;
import br.com.meuprojeto.portal_estagios.security.dto.AuthenticationRequest;
import br.com.meuprojeto.portal_estagios.security.dto.AuthenticationResponse;
import br.com.meuprojeto.portal_estagios.service.CompanyService;
import br.com.meuprojeto.portal_estagios.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

/**
 * Controller para autenticação de usuários.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@ResponseBody
@Slf4j
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;
    private final CompanyService companyService;
    private final StudentService studentService;

    /**
     * Autentica um usuário
     * 
     * @param authenticationRequest DTO com e-mail e senha
     * @return DTO com token JWT e informações do usuário
     */
    @PostMapping("/login")
    public ResponseEntity<?> authenticate(@RequestBody @Valid AuthenticationRequest authenticationRequest) {
        try {
            log.info("Tentativa de login para o email: {}", authenticationRequest.getEmail());

            // Autentica o usuário
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            authenticationRequest.getEmail(),
                            authenticationRequest.getSenha()));

            log.info("Autenticação bem sucedida para: {}", authenticationRequest.getEmail());

            // Obtém os detalhes do usuário autenticado
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            log.info("UserDetails obtido com sucesso. Authorities: {}", userDetails.getAuthorities());

            // Gera o token JWT
            String token = jwtUtil.generateToken(userDetails);
            log.info("Token JWT gerado com sucesso");

            // Busca o usuário no banco
            User user = userRepository.findByEmail(authenticationRequest.getEmail())
                    .orElseThrow(() -> new BadCredentialsException("Usuário não encontrado"));
            log.info("Usuário encontrado no banco: {}", user.getEmail());

            // Identifica o tipo específico de usuário
            Long entityId = user.getId();
            Set<Area> areasInteresse = null;
            if (user.getRole() == User.Role.COMPANY) {
                Company company = companyService.buscarPorId(user.getId())
                        .orElseThrow(() -> new BadCredentialsException("Empresa não encontrada"));
                entityId = company.getId();
                log.info("Usuário identificado como empresa com ID: {}", entityId);
            } else if (user.getRole() == User.Role.STUDENT) {
                Student student = studentService.buscarPorId(user.getId())
                        .orElseThrow(() -> new BadCredentialsException("Estudante não encontrado"));
                entityId = student.getId();
                areasInteresse = student.getAreasInteresse();
                log.info("Usuário identificado como estudante com ID: {} e {} áreas de interesse", entityId,
                        areasInteresse.size());
            }

            // Retorna a resposta com o token e informações do usuário
            AuthenticationResponse response = new AuthenticationResponse(
                    token,
                    "Bearer",
                    user.getEmail(),
                    user.getRole().name(),
                    user.getNome(),
                    entityId,
                    areasInteresse);

            log.info("Resposta de autenticação gerada com sucesso");
            return ResponseEntity.ok(response);

        } catch (BadCredentialsException e) {
            log.error("Credenciais inválidas para o email: {}", authenticationRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("mensagem", "Credenciais inválidas");
            error.put("erro", "Não autorizado");
            return ResponseEntity.status(401).body(error);
        } catch (Exception e) {
            log.error("Erro ao processar autenticação para o email: {}", authenticationRequest.getEmail(), e);
            Map<String, String> error = new HashMap<>();
            error.put("mensagem", "Erro ao processar autenticação");
            error.put("erro", e.getMessage());
            return ResponseEntity.status(500).body(error);
        }
    }
}