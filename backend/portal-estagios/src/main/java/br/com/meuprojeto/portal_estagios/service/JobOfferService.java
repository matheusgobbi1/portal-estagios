package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import br.com.meuprojeto.portal_estagios.repository.JobOfferRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

/**
 * Serviço que contém as regras de negócio relacionadas à entidade JobOffer.
 */
@Service
@RequiredArgsConstructor
public class JobOfferService {

    private final JobOfferRepository jobOfferRepository;

    /**
     * Lista todas as vagas cadastradas
     * 
     * @return Lista de vagas
     */
    public List<JobOffer> listarTodas() {
        return jobOfferRepository.findAll().stream().filter(JobOffer::isAtiva).toList();
    }

    /**
     * Lista todas as vagas ativas
     * 
     * @return Lista de vagas ativas
     */
    public List<JobOffer> listarAtivas() {
        return jobOfferRepository.findAll().stream()
                .filter(JobOffer::isAtiva)
                .toList();
    }

    /**
     * Lista vagas ativas de uma empresa
     * 
     * @param company Empresa
     * @return Lista de vagas ativas da empresa
     */
    public List<JobOffer> listarAtivasPorEmpresa(Company company) {
        return jobOfferRepository.findByCompanyAndAtivaTrue(company);
    }

    /**
     * Lista vagas ativas por área
     * 
     * @param area Área
     * @return Lista de vagas ativas da área
     */
    public List<JobOffer> listarAtivasPorArea(Area area) {
        return jobOfferRepository.findByAreaAndAtivaTrue(area);
    }

    /**
     * Lista vagas ativas por áreas
     * 
     * @param areas Lista de áreas
     * @return Lista de vagas ativas das áreas
     */
    public List<JobOffer> listarAtivasPorAreas(List<Area> areas) {
        return jobOfferRepository.findByAreasAndAtivaTrue(areas);
    }

    /**
     * Busca uma vaga pelo ID
     * 
     * @param id ID da vaga
     * @return Optional contendo a vaga, se encontrada
     */
    public Optional<JobOffer> buscarPorId(Long id) {
        return jobOfferRepository.findById(id);
    }

    /**
     * Busca uma vaga pelo ID, lançando exceção se não encontrada
     * 
     * @param id ID da vaga
     * @return A vaga encontrada
     * @throws EntityNotFoundException se a vaga não for encontrada
     */
    public JobOffer buscarPorIdOuFalhar(Long id) {
        return jobOfferRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vaga não encontrada com ID: " + id));
    }

    /**
     * Salva uma nova vaga ou atualiza uma existente
     * 
     * @param jobOffer Vaga a ser salva
     * @return Vaga salva
     */
    @Transactional
    public JobOffer salvar(JobOffer jobOffer) {
        return jobOfferRepository.save(jobOffer);
    }

    /**
     * Encerra uma vaga
     * 
     * @param id ID da vaga a ser encerrada
     * @return Vaga encerrada
     * @throws EntityNotFoundException se a vaga não for encontrada
     */
    @Transactional
    public JobOffer encerrar(Long id) {
        JobOffer jobOffer = buscarPorIdOuFalhar(id);
        jobOffer.encerrar();
        return jobOfferRepository.save(jobOffer);
    }

    /**
     * Deleta uma vaga pelo ID
     * 
     * @param id ID da vaga a ser deletada
     * @throws EntityNotFoundException se a vaga não for encontrada
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorIdOuFalhar(id);
        jobOfferRepository.deleteById(id);
    }

    /**
     * Conta o número de vagas ativas
     * 
     * @return Quantidade de vagas ativas
     */
    public long contarVagasAtivas() {
        return jobOfferRepository.countByAtivaTrue();
    }

    /**
     * Conta o número de vagas encerradas
     * 
     * @return Quantidade de vagas encerradas
     */
    public long contarVagasEncerradas() {
        return jobOfferRepository.countByAtivaFalse();
    }

    /**
     * Obtém estatísticas de vagas por área
     * 
     * @return Lista de objetos contendo área e quantidade de vagas
     */
    public List<Object[]> obterEstatisticasPorArea() {
        return jobOfferRepository.countVagasPorArea();
    }
}