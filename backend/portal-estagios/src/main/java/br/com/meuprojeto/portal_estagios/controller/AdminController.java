package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.entity.Admin;
import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.entity.User;
import br.com.meuprojeto.portal_estagios.repository.AdminRepository;
import br.com.meuprojeto.portal_estagios.repository.AreaRepository;
import br.com.meuprojeto.portal_estagios.repository.CompanyRepository;
import br.com.meuprojeto.portal_estagios.repository.JobOfferRepository;
import br.com.meuprojeto.portal_estagios.repository.StudentRepository;
import br.com.meuprojeto.portal_estagios.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Controller que expõe endpoints REST para gerenciar administradores.
 * Apenas acessível por usuários com perfil ADMIN.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminRepository adminRepository;
    private final UserService userService;
    private final CompanyRepository companyRepository;
    private final StudentRepository studentRepository;
    private final JobOfferRepository jobOfferRepository;
    private final AreaRepository areaRepository;

    /**
     * Cria um novo administrador
     * 
     * @param admin Administrador a ser criado
     * @return Administrador criado com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Admin criar(@RequestBody @Valid Admin admin) {
        // Garante que o perfil é ADMIN
        admin.setRole(User.Role.ADMIN);
        // Criptografa a senha antes de salvar
        userService.criptografarSenha(admin);
        return adminRepository.save(admin);
    }

    /**
     * Retorna estatísticas para o dashboard administrativo
     * 
     * @return Estatísticas do sistema
     */
    @GetMapping("/dashboard")
    public ResponseEntity<Map<String, Object>> getDashboard() {
        Map<String, Object> dashboard = new HashMap<>();

        // Contagem de usuários por tipo
        dashboard.put("totalEmpresas", companyRepository.count());
        dashboard.put("totalEstudantes", studentRepository.count());

        // Contagem de vagas abertas e encerradas
        dashboard.put("vagasAbertas", jobOfferRepository.countByAtivaTrue());
        dashboard.put("vagasEncerradas", jobOfferRepository.countByAtivaFalse());

        // Vagas por área
        List<Object[]> vagasPorArea = jobOfferRepository.countVagasPorArea();
        dashboard.put("vagasPorArea", vagasPorArea);

        return ResponseEntity.ok(dashboard);
    }

    /**
     * Gerenciamento de áreas de interesse
     */

    /**
     * Lista todas as áreas de interesse
     * 
     * @return Lista de áreas de interesse
     */
    @GetMapping("/areas")
    public List<Area> listarAreas() {
        return areaRepository.findAll();
    }

    /**
     * Busca uma área de interesse pelo ID
     * 
     * @param id ID da área
     * @return Área encontrada
     */
    @GetMapping("/areas/{id}")
    public ResponseEntity<Area> buscarArea(@PathVariable Long id) {
        return areaRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova área de interesse
     * 
     * @param area Área a ser criada
     * @return Área criada com status 201 (Created)
     */
    @PostMapping("/areas")
    @ResponseStatus(HttpStatus.CREATED)
    public Area criarArea(@RequestBody @Valid Area area) {
        return areaRepository.save(area);
    }

    /**
     * Atualiza uma área de interesse
     * 
     * @param id   ID da área
     * @param area Área com dados atualizados
     * @return Área atualizada
     */
    @PutMapping("/areas/{id}")
    public ResponseEntity<Area> atualizarArea(@PathVariable Long id, @RequestBody @Valid Area area) {
        if (!areaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        area.setId(id);
        return ResponseEntity.ok(areaRepository.save(area));
    }

    /**
     * Remove uma área de interesse
     * 
     * @param id ID da área
     * @return Status 204 (No Content)
     */
    @DeleteMapping("/areas/{id}")
    public ResponseEntity<Void> removerArea(@PathVariable Long id) {
        if (!areaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        areaRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}