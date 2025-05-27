package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Area;
import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.entity.JobOffer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositório para operações de banco de dados da entidade JobOffer.
 */
@Repository
public interface JobOfferRepository extends JpaRepository<JobOffer, Long> {

    /**
     * Busca vagas ativas de uma empresa
     * 
     * @param company Empresa
     * @return Lista de vagas ativas da empresa
     */
    List<JobOffer> findByCompanyAndAtivaTrue(Company company);

    /**
     * Busca vagas ativas por área
     * 
     * @param area Área
     * @return Lista de vagas ativas da área
     */
    List<JobOffer> findByAreaAndAtivaTrue(Area area);

    /**
     * Busca vagas ativas por áreas
     * 
     * @param areas Lista de áreas
     * @return Lista de vagas ativas das áreas
     */
    @Query("SELECT j FROM JobOffer j WHERE j.ativa = true AND j.area IN :areas")
    List<JobOffer> findByAreasAndAtivaTrue(List<Area> areas);

    /**
     * Conta o número de vagas por área
     * 
     * @return Lista de objetos contendo a área e a quantidade de vagas
     */
    @Query("SELECT a.nome, COUNT(j) FROM JobOffer j JOIN j.area a GROUP BY a.nome")
    List<Object[]> countVagasPorArea();

    /**
     * Conta o número de vagas ativas
     * 
     * @return Quantidade de vagas ativas
     */
    long countByAtivaTrue();

    /**
     * Conta o número de vagas inativas
     * 
     * @return Quantidade de vagas inativas
     */
    long countByAtivaFalse();

    @Query("SELECT j FROM JobOffer j")
    List<JobOffer> findAllWithRelations();
}