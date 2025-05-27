package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de banco de dados da entidade User.
 */
@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca um usuário pelo e-mail
     * 
     * @param email E-mail do usuário
     * @return Optional contendo o usuário, se encontrado
     */
    Optional<User> findByEmail(String email);

    /**
     * Verifica se existe um usuário com o e-mail informado
     * 
     * @param email E-mail do usuário
     * @return true se existir, false caso contrário
     */
    boolean existsByEmail(String email);
}