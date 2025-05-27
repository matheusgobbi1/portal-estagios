package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Application;
import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import br.com.meuprojeto.portal_estagios.entity.Student;
import br.com.meuprojeto.portal_estagios.repository.ApplicationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço que contém as regras de negócio relacionadas à entidade Application.
 */
@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobOfferService jobOfferService;

    /**
     * Lista todas as inscrições
     * 
     * @return Lista de inscrições
     */
    public List<Application> listarTodas() {
        return applicationRepository.findAll();
    }

    /**
     * Lista inscrições de um estudante
     * 
     * @param student Estudante
     * @return Lista de inscrições do estudante
     */
    public List<Application> listarPorEstudante(Student student) {
        return applicationRepository.findByStudent(student);
    }

    /**
     * Lista inscrições em uma vaga
     * 
     * @param jobOffer Vaga
     * @return Lista de inscrições na vaga
     */
    public List<Application> listarPorVaga(JobOffer jobOffer) {
        return applicationRepository.findByJobOffer(jobOffer);
    }

    /**
     * Busca uma inscrição pelo ID
     * 
     * @param id ID da inscrição
     * @return Optional contendo a inscrição, se encontrada
     */
    public Optional<Application> buscarPorId(Long id) {
        return applicationRepository.findById(id);
    }

    /**
     * Busca uma inscrição de um estudante em uma vaga
     * 
     * @param student  Estudante
     * @param jobOffer Vaga
     * @return Optional contendo a inscrição, se encontrada
     */
    public Optional<Application> buscarPorEstudanteEVaga(Student student, JobOffer jobOffer) {
        return applicationRepository.findByStudentAndJobOffer(student, jobOffer);
    }

    /**
     * Busca uma inscrição pelo ID, lançando exceção se não encontrada
     * 
     * @param id ID da inscrição
     * @return A inscrição encontrada
     * @throws EntityNotFoundException se a inscrição não for encontrada
     */
    public Application buscarPorIdOuFalhar(Long id) {
        return applicationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Inscrição não encontrada com ID: " + id));
    }

    /**
     * Salva uma nova inscrição ou atualiza uma existente
     * 
     * @param application Inscrição a ser salva
     * @return Inscrição salva
     * @throws IllegalStateException se a vaga estiver inativa
     */
    @Transactional
    public Application salvar(Application application) {
        // Verifica se a vaga está ativa
        JobOffer jobOffer = jobOfferService.buscarPorIdOuFalhar(application.getJobOffer().getId());
        if (!jobOffer.isAtiva()) {
            throw new IllegalStateException("Não é possível se inscrever em uma vaga inativa");
        }

        return applicationRepository.save(application);
    }

    /**
     * Atualiza o status de uma inscrição
     * 
     * @param id     ID da inscrição
     * @param status Novo status
     * @return Inscrição atualizada
     * @throws EntityNotFoundException se a inscrição não for encontrada
     */
    @Transactional
    public Application atualizarStatus(Long id, Application.Status status) {
        Application application = buscarPorIdOuFalhar(id);
        application.setStatus(status);
        return applicationRepository.save(application);
    }

    /**
     * Deleta uma inscrição pelo ID
     * 
     * @param id ID da inscrição a ser deletada
     * @throws EntityNotFoundException se a inscrição não for encontrada
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorIdOuFalhar(id);
        applicationRepository.deleteById(id);
    }

    /**
     * Verifica se existe uma inscrição de um estudante em uma vaga
     * 
     * @param student  Estudante
     * @param jobOffer Vaga
     * @return true se existir, false caso contrário
     */
    public boolean existePorEstudanteEVaga(Student student, JobOffer jobOffer) {
        return applicationRepository.existsByStudentAndJobOffer(student, jobOffer);
    }

    /**
     * Conta o número de inscrições em uma vaga
     * 
     * @param jobOffer Vaga
     * @return Quantidade de inscrições na vaga
     */
    public long contarPorVaga(JobOffer jobOffer) {
        return applicationRepository.countByJobOffer(jobOffer);
    }

    /**
     * Conta o número de inscrições de um estudante
     * 
     * @param student Estudante
     * @return Quantidade de inscrições do estudante
     */
    public long contarPorEstudante(Student student) {
        return applicationRepository.countByStudent(student);
    }
}