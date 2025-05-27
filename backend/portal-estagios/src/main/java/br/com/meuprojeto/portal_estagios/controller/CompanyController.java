package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.service.CompanyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller que expõe endpoints REST para gerenciar empresas.
 */
@RestController
@RequestMapping("/api/companies")
@RequiredArgsConstructor
public class CompanyController {

    private final CompanyService companyService;

    /**
     * Lista todas as empresas cadastradas
     * 
     * @return Lista de empresas
     */
    @GetMapping
    public List<Company> listarTodas() {
        return companyService.listarTodas();
    }

    /**
     * Busca uma empresa pelo ID
     * 
     * @param id ID da empresa
     * @return ResponseEntity com a empresa encontrada ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Company> buscarPorId(@PathVariable Long id) {
        return companyService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Busca uma empresa pelo CNPJ
     * 
     * @param cnpj CNPJ da empresa
     * @return ResponseEntity com a empresa encontrada ou 404 se não encontrada
     */
    @GetMapping("/cnpj/{cnpj}")
    public ResponseEntity<Company> buscarPorCnpj(@PathVariable String cnpj) {
        return companyService.buscarPorCnpj(cnpj)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova empresa
     * 
     * @param company Empresa a ser criada
     * @return Empresa criada com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Company criar(@RequestBody @Valid Company company) {
        return companyService.salvar(company);
    }

    /**
     * Atualiza uma empresa existente
     * 
     * @param id      ID da empresa a ser atualizada
     * @param company Novos dados da empresa
     * @return Empresa atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Company> atualizar(@PathVariable Long id, @RequestBody @Valid Company company) {
        if (!companyService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        company.setId(id);
        Company companyAtualizada = companyService.salvar(company);
        return ResponseEntity.ok(companyAtualizada);
    }

    /**
     * Deleta uma empresa pelo ID
     * 
     * @param id ID da empresa a ser deletada
     * @return ResponseEntity sem conteúdo e status 204 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!companyService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        companyService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}