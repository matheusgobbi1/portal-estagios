package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Company;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * Repositório para operações de banco de dados da entidade Company.
 */
@Repository
public interface CompanyRepository extends JpaRepository<Company, Long> {

    /**
     * Busca uma empresa pelo CNPJ
     * 
     * @param cnpj CNPJ da empresa
     * @return Optional contendo a empresa, se encontrada
     */
    Optional<Company> findByCnpj(String cnpj);

    /**
     * Verifica se existe uma empresa com o CNPJ informado
     * 
     * @param cnpj CNPJ da empresa
     * @return true se existir, false caso contrário
     */
    boolean existsByCnpj(String cnpj);
}