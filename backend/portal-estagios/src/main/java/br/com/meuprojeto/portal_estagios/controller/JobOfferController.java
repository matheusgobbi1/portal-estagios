package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.dto.JobOfferDTO;
import br.com.meuprojeto.portal_estagios.dto.CompanyDTO;
import br.com.meuprojeto.portal_estagios.dto.AreaDTO;
import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import br.com.meuprojeto.portal_estagios.entity.User;
import br.com.meuprojeto.portal_estagios.service.AreaService;
import br.com.meuprojeto.portal_estagios.service.CompanyService;
import br.com.meuprojeto.portal_estagios.service.JobOfferService;
import br.com.meuprojeto.portal_estagios.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Controller que expõe endpoints REST para gerenciar vagas de estágio.
 */
@RestController
@RequestMapping("/api/job-offers")
@RequiredArgsConstructor
@Slf4j
public class JobOfferController {

    private final JobOfferService jobOfferService;
    private final UserService userService;
    private final CompanyService companyService;
    private final AreaService areaService;

    /**
     * Lista todas as vagas cadastradas
     * 
     * @return Lista de vagas
     */
    @GetMapping
    public ResponseEntity<List<JobOfferDTO>> listarTodas() {
        try {
            List<JobOffer> vagas = jobOfferService.listarTodas();
            List<JobOfferDTO> vagasDTO = new ArrayList<>();

            for (JobOffer vaga : vagas) {
                JobOfferDTO dto = new JobOfferDTO();
                dto.setId(vaga.getId());
                dto.setTitulo(vaga.getTitulo());
                dto.setDescricao(vaga.getDescricao());
                dto.setLocalizacao(vaga.getLocalizacao());
                dto.setModalidade(vaga.getModalidade());
                dto.setCargaHoraria(vaga.getCargaHoraria());
                dto.setRequisitos(vaga.getRequisitos());
                dto.setAtiva(vaga.isAtiva());
                dto.setDataCriacao(vaga.getDataCriacao());
                dto.setDataAtualizacao(vaga.getDataAtualizacao());
                dto.setDataEncerramento(vaga.getDataEncerramento());

                if (vaga.getCompany() != null) {
                    CompanyDTO companyDTO = new CompanyDTO();
                    companyDTO.setId(vaga.getCompany().getId());
                    companyDTO.setNome(vaga.getCompany().getNome());
                    companyDTO.setCnpj(vaga.getCompany().getCnpj());
                    companyDTO.setEndereco(vaga.getCompany().getEndereco());
                    companyDTO.setTelefone(vaga.getCompany().getTelefone());
                    companyDTO.setEmail(vaga.getCompany().getEmail());
                    dto.setCompany(companyDTO);
                }

                if (vaga.getArea() != null) {
                    AreaDTO areaDTO = new AreaDTO();
                    areaDTO.setId(vaga.getArea().getId());
                    areaDTO.setNome(vaga.getArea().getNome());
                    dto.setArea(areaDTO);
                }

                vagasDTO.add(dto);
            }

            return ResponseEntity.ok(vagasDTO);
        } catch (Exception e) {
            log.error("Erro ao listar vagas: ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * Lista todas as vagas ativas
     * 
     * @return Lista de vagas ativas
     */
    @GetMapping("/ativas")
    public ResponseEntity<List<JobOffer>> listarAtivas() {
        List<JobOffer> vagas = jobOfferService.listarAtivas();
        return ResponseEntity.ok(vagas);
    }

    /**
     * Lista vagas ativas de uma empresa
     * 
     * @param companyId ID da empresa
     * @return Lista de vagas ativas da empresa ou 404 se a empresa não for
     *         encontrada
     */
    @GetMapping("/company/{companyId}")
    public ResponseEntity<List<JobOffer>> listarAtivasPorEmpresa(@PathVariable Long companyId) {
        return companyService.buscarPorId(companyId)
                .map(company -> ResponseEntity.ok(jobOfferService.listarAtivasPorEmpresa(company)))
                .orElse(ResponseEntity.ok(List.of()));
    }

    /**
     * Lista vagas ativas por área
     * 
     * @param areaId ID da área
     * @return Lista de vagas ativas da área ou 404 se a área não for encontrada
     */
    @GetMapping("/area/{areaId}")
    public ResponseEntity<List<JobOffer>> listarAtivasPorArea(@PathVariable Long areaId) {
        return areaService.buscarPorId(areaId)
                .map(area -> ResponseEntity.ok(jobOfferService.listarAtivasPorArea(area)))
                .orElse(ResponseEntity.ok(List.of()));
    }

    /**
     * Busca uma vaga pelo ID
     * 
     * @param id ID da vaga
     * @return ResponseEntity com a vaga encontrada ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<JobOffer> buscarPorId(@PathVariable Long id) {
        return jobOfferService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova vaga
     * 
     * @param jobOffer Vaga a ser criada
     * @return Vaga criada com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public JobOffer criar(@RequestBody @Valid JobOffer jobOffer, Authentication authentication) {
        // Obtém o email do usuário autenticado
        String email = authentication.getName();

        // Busca o usuário pelo email
        User user = userService.buscarPorEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado"));

        // Verifica se o usuário é uma empresa
        if (user.getRole() != User.Role.COMPANY) {
            throw new AccessDeniedException("Apenas empresas podem criar vagas");
        }

        // Busca a empresa associada ao usuário
        Company company = companyService.buscarPorId(user.getId())
                .orElseThrow(() -> new EntityNotFoundException("Empresa não encontrada"));

        // Associa a empresa à vaga
        jobOffer.setCompany(company);

        // Salva a vaga
        return jobOfferService.salvar(jobOffer);
    }

    /**
     * Atualiza uma vaga existente
     * 
     * @param id       ID da vaga a ser atualizada
     * @param jobOffer Novos dados da vaga
     * @return Vaga atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<JobOffer> atualizar(@PathVariable Long id, @RequestBody @Valid JobOffer jobOffer) {
        if (!jobOfferService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        jobOffer.setId(id);
        JobOffer jobOfferAtualizada = jobOfferService.salvar(jobOffer);
        return ResponseEntity.ok(jobOfferAtualizada);
    }

    /**
     * Encerra uma vaga
     * 
     * @param id ID da vaga a ser encerrada
     * @return Vaga encerrada ou 404 se não encontrada
     */
    @PatchMapping("/{id}/encerrar")
    public ResponseEntity<JobOffer> encerrar(@PathVariable Long id) {
        if (!jobOfferService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        JobOffer jobOfferEncerrada = jobOfferService.encerrar(id);
        return ResponseEntity.ok(jobOfferEncerrada);
    }

    /**
     * Deleta uma vaga pelo ID
     * 
     * @param id ID da vaga a ser deletada
     * @return ResponseEntity sem conteúdo e status 204 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!jobOfferService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        jobOfferService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Retorna estatísticas de vagas
     * 
     * @return Map com estatísticas
     */
    @GetMapping("/estatisticas")
    public ResponseEntity<Object> obterEstatisticas() {
        long vagasAtivas = jobOfferService.contarVagasAtivas();
        long vagasEncerradas = jobOfferService.contarVagasEncerradas();
        List<Object[]> vagasPorArea = jobOfferService.obterEstatisticasPorArea();

        return ResponseEntity.ok(
                new Object() {
                    public final long ativas = vagasAtivas;
                    public final long encerradas = vagasEncerradas;
                    public final List<Object[]> porArea = vagasPorArea;
                });
    }
}