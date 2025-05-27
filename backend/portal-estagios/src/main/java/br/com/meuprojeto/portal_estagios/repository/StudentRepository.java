package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de banco de dados da entidade Student.
 */
@Repository
public interface StudentRepository extends JpaRepository<Student, Long> {

    /**
     * Busca um estudante pelo CPF
     * 
     * @param cpf CPF do estudante
     * @return Optional contendo o estudante, se encontrado
     */
    Optional<Student> findByCpf(String cpf);

    /**
     * Verifica se existe um estudante com o CPF informado
     * 
     * @param cpf CPF do estudante
     * @return true se existir, false caso contrário
     */
    boolean existsByCpf(String cpf);
}