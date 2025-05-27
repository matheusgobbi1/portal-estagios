package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.dto.StudentUpdateDTO;
import br.com.meuprojeto.portal_estagios.entity.Student;
import br.com.meuprojeto.portal_estagios.service.ResumeService;
import br.com.meuprojeto.portal_estagios.service.StudentService;
import com.itextpdf.text.DocumentException;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

/**
 * Controller que expõe endpoints REST para gerenciar estudantes.
 */
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Tag(name = "Estudantes", description = "API para gerenciamento de estudantes")
public class StudentController {

    private final StudentService studentService;
    private final ResumeService resumeService;

    /**
     * Lista todos os estudantes cadastrados
     * 
     * @return Lista de estudantes
     */
    @GetMapping
    public List<Student> listarTodos() {
        return studentService.listarTodos();
    }

    /**
     * Busca um estudante pelo ID
     * 
     * @param id ID do estudante
     * @return ResponseEntity com o estudante encontrado ou 404 se não encontrado
     */
    @GetMapping("/{id}")
    public ResponseEntity<Student> buscarPorId(@PathVariable Long id) {
        return studentService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca um estudante pelo CPF
     * 
     * @param cpf CPF do estudante
     * @return ResponseEntity com o estudante encontrado ou 404 se não encontrado
     */
    @GetMapping("/cpf/{cpf}")
    public ResponseEntity<Student> buscarPorCpf(@PathVariable String cpf) {
        return studentService.buscarPorCpf(cpf)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria um novo estudante
     * 
     * @param student Estudante a ser criado
     * @return Estudante criado com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Student criar(@RequestBody @Valid Student student) {
        return studentService.salvar(student);
    }

    /**
     * Atualiza um estudante existente
     * 
     * @param id         ID do estudante a ser atualizado
     * @param studentDTO Novos dados do estudante
     * @return Estudante atualizado ou 404 se não encontrado
     */
    @PutMapping("/{id}")
    public ResponseEntity<Student> atualizar(@PathVariable Long id, @RequestBody @Valid StudentUpdateDTO studentDTO) {
        return studentService.buscarPorId(id)
                .map(estudanteExistente -> {
                    Student student = studentDTO.toEntity(estudanteExistente);
                    Student studentAtualizado = studentService.salvar(student);
                    return ResponseEntity.ok(studentAtualizado);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Deleta um estudante pelo ID
     * 
     * @param id ID do estudante a ser deletado
     * @return ResponseEntity sem conteúdo e status 204 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!studentService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        studentService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Gera um currículo em PDF para o estudante
     * 
     * @param id ID do estudante
     * @return Arquivo PDF do currículo
     */
    @Operation(summary = "Gerar currículo do estudante", description = "Gera um currículo em PDF baseado nos dados do estudante")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Currículo gerado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Estudante não encontrado"),
            @ApiResponse(responseCode = "500", description = "Erro ao gerar o currículo")
    })
    @GetMapping("/{id}/resume")
    public ResponseEntity<byte[]> gerarCurriculo(@PathVariable Long id) {
        try {
            byte[] pdfBytes = resumeService.generateResume(id);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "curriculo.pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (DocumentException | IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}