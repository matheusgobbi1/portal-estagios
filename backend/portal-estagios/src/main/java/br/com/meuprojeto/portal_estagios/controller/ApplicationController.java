package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.entity.Application;
import br.com.meuprojeto.portal_estagios.service.ApplicationService;
import br.com.meuprojeto.portal_estagios.service.JobOfferService;
import br.com.meuprojeto.portal_estagios.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Controller que expõe endpoints REST para gerenciar inscrições em vagas.
 */
@RestController
@RequestMapping("/api/application")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;
    private final StudentService studentService;
    private final JobOfferService jobOfferService;

    // DTO para Application
    private record ApplicationDTO(
            Long id,
            Long studentId,
            String studentName,
            Long jobOfferId,
            String jobOfferTitle,
            LocalDateTime dataInscricao,
            Application.Status status) {
        public static ApplicationDTO fromEntity(Application application) {
            return new ApplicationDTO(
                    application.getId(),
                    application.getStudent().getId(),
                    application.getStudent().getNome(),
                    application.getJobOffer().getId(),
                    application.getJobOffer().getTitulo(),
                    application.getDataInscricao(),
                    application.getStatus());
        }
    }

    /**
     * Lista todas as inscrições
     * 
     * @return Lista de inscrições
     */
    @GetMapping
    public List<Application> listarTodas() {
        return applicationService.listarTodas();
    }

    /**
     * Lista inscrições de um estudante
     * 
     * @param studentId ID do estudante
     * @return Lista de inscrições do estudante ou 404 se o estudante não for
     *         encontrado
     */
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<ApplicationDTO>> listarPorEstudante(@PathVariable Long studentId) {
        return studentService.buscarPorId(studentId)
                .map(student -> {
                    List<Application> applications = applicationService.listarPorEstudante(student);
                    List<ApplicationDTO> dtos = applications.stream()
                            .map(ApplicationDTO::fromEntity)
                            .collect(Collectors.toList());
                    return ResponseEntity.ok(dtos);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Lista inscrições em uma vaga
     * 
     * @param jobOfferId ID da vaga
     * @return Lista de inscrições na vaga ou 404 se a vaga não for encontrada
     */
    @GetMapping("/job-offer/{jobOfferId}")
    public ResponseEntity<List<Application>> listarPorVaga(@PathVariable Long jobOfferId) {
        return jobOfferService.buscarPorId(jobOfferId)
                .map(jobOffer -> ResponseEntity.ok(applicationService.listarPorVaga(jobOffer)))
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca uma inscrição pelo ID
     * 
     * @param id ID da inscrição
     * @return ResponseEntity com a inscrição encontrada ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Application> buscarPorId(@PathVariable Long id) {
        return applicationService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova inscrição
     * 
     * @param application Inscrição a ser criada
     * @return Inscrição criada com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<Application> criar(@RequestBody @Valid Application application) {
        try {
            Application applicationSalva = applicationService.salvar(application);
            return ResponseEntity.status(HttpStatus.CREATED).body(applicationSalva);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    /**
     * Atualiza o status de uma inscrição
     * 
     * @param id           ID da inscrição
     * @param statusUpdate Mapa contendo o novo status
     * @return Inscrição atualizada ou 404 se não encontrada
     */
    @PatchMapping("/{id}/status")
    public ResponseEntity<Application> atualizarStatus(
            @PathVariable Long id,
            @RequestBody Map<String, String> statusUpdate) {

        if (!applicationService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        try {
            Application.Status novoStatus = Application.Status.valueOf(statusUpdate.get("status"));
            Application applicationAtualizada = applicationService.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(applicationAtualizada);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Deleta uma inscrição pelo ID
     * 
     * @param id ID da inscrição a ser deletada
     * @return ResponseEntity sem conteúdo e status 204 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!applicationService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        applicationService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}