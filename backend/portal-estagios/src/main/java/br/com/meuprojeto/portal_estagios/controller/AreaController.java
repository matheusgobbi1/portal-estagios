package br.com.meuprojeto.portal_estagios.controller;

import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.service.AreaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller que expõe endpoints REST para gerenciar áreas de
 * atuação/interesse.
 */
@RestController
@RequestMapping("/api/areas")
@RequiredArgsConstructor
public class AreaController {

    private final AreaService areaService;

    /**
     * Lista todas as áreas cadastradas
     * 
     * @return Lista de áreas
     */
    @GetMapping
    public List<Area> listarTodas() {
        return areaService.listarTodas();
    }

    /**
     * Busca uma área pelo ID
     * 
     * @param id ID da área
     * @return ResponseEntity com a área encontrada ou 404 se não encontrada
     */
    @GetMapping("/{id}")
    public ResponseEntity<Area> buscarPorId(@PathVariable Long id) {
        return areaService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * Cria uma nova área
     * 
     * @param area Área a ser criada
     * @return Área criada com status 201 (Created)
     */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Area criar(@RequestBody @Valid Area area) {
        return areaService.salvar(area);
    }

    /**
     * Atualiza uma área existente
     * 
     * @param id   ID da área a ser atualizada
     * @param area Novos dados da área
     * @return Área atualizada ou 404 se não encontrada
     */
    @PutMapping("/{id}")
    public ResponseEntity<Area> atualizar(@PathVariable Long id, @RequestBody @Valid Area area) {
        if (!areaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        area.setId(id);
        Area areaAtualizada = areaService.salvar(area);
        return ResponseEntity.ok(areaAtualizada);
    }

    /**
     * Deleta uma área pelo ID
     * 
     * @param id ID da área a ser deletada
     * @return ResponseEntity sem conteúdo e status 204 (No Content)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        if (!areaService.buscarPorId(id).isPresent()) {
            return ResponseEntity.notFound().build();
        }

        areaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}