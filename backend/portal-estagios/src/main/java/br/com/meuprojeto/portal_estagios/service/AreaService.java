package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.repository.AreaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class AreaService {

    private final AreaRepository areaRepository;

    /**
     * Lista todas as áreas cadastradas
     * 
     * @return Lista de áreas
     */
    public List<Area> listarTodas() {
        return areaRepository.findAll();
    }

    /**
     * Busca uma área pelo ID
     * 
     * @param id ID da área
     * @return Optional contendo a área, se encontrada
     */
    public Optional<Area> buscarPorId(Long id) {
        return areaRepository.findById(id);
    }

    /**
     * Busca uma área pelo ID, lançando exceção se não encontrada
     * 
     * @param id ID da área
     * @return A área encontrada
     * @throws EntityNotFoundException se a área não for encontrada
     */
    public Area buscarPorIdOuFalhar(Long id) {
        return areaRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Área não encontrada com ID: " + id));
    }

    /**
     * Salva uma nova área ou atualiza uma existente
     * 
     * @param area Área a ser salva
     * @return Área salva
     */
    @Transactional
    public Area salvar(Area area) {
        return areaRepository.save(area);
    }

    /**
     * Deleta uma área pelo ID
     * 
     * @param id ID da área a ser deletada
     * @throws EntityNotFoundException se a área não for encontrada
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorIdOuFalhar(id);
        areaRepository.deleteById(id);
    }

    /**
     * Verifica se existe uma área com o nome informado
     * 
     * @param nome Nome da área
     * @return true se existir, false caso contrário
     */
    public boolean existePorNome(String nome) {
        return areaRepository.existsByNome(nome);
    }
}