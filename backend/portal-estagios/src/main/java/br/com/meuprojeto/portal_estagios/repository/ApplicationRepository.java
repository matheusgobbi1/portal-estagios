package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Application;
import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import br.com.meuprojeto.portal_estagios.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositório para operações de banco de dados da entidade Application.
 */
@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    /**
     * Busca inscrições de um estudante
     * 
     * @param student Estudante
     * @return Lista de inscrições do estudante
     */
    List<Application> findByStudent(Student student);

    /**
     * Busca inscrições em uma vaga
     * 
     * @param jobOffer Vaga
     * @return Lista de inscrições na vaga
     */
    List<Application> findByJobOffer(JobOffer jobOffer);

    /**
     * Busca uma inscrição específica de um estudante em uma vaga
     * 
     * @param student  Estudante
     * @param jobOffer Vaga
     * @return Optional contendo a inscrição, se encontrada
     */
    Optional<Application> findByStudentAndJobOffer(Student student, JobOffer jobOffer);

    /**
     * Verifica se existe uma inscrição de um estudante em uma vaga
     * 
     * @param student  Estudante
     * @param jobOffer Vaga
     * @return true se existir, false caso contrário
     */
    boolean existsByStudentAndJobOffer(Student student, JobOffer jobOffer);

    /**
     * Conta o número de inscrições em uma vaga
     * 
     * @param jobOffer Vaga
     * @return Quantidade de inscrições na vaga
     */
    long countByJobOffer(JobOffer jobOffer);

    /**
     * Conta o número de inscrições de um estudante
     * 
     * @param student Estudante
     * @return Quantidade de inscrições do estudante
     */
    long countByStudent(Student student);
}