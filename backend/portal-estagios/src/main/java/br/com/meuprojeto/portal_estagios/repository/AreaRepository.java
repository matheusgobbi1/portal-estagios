package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Area;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de banco de dados da entidade Area.
 */
@Repository
public interface AreaRepository extends JpaRepository<Area, Long> {

    /**
     * Busca uma área pelo nome
     * 
     * @param nome Nome da área
     * @return Optional contendo a área, se encontrada
     */
    Optional<Area> findByNome(String nome);

    /**
     * Verifica se existe uma área com o nome informado
     * 
     * @param nome Nome da área
     * @return true se existir, false caso contrário
     */
    boolean existsByNome(String nome);
}