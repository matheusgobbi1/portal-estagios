package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Company;
import br.com.meuprojeto.portal_estagios.repository.CompanyRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço que contém as regras de negócio relacionadas à entidade Company.
 */
@Service
@RequiredArgsConstructor
public class CompanyService {

    private final CompanyRepository companyRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lista todas as empresas cadastradas
     * 
     * @return Lista de empresas
     */
    public List<Company> listarTodas() {
        return companyRepository.findAll();
    }

    /**
     * Busca uma empresa pelo ID
     * 
     * @param id ID da empresa
     * @return Optional contendo a empresa, se encontrada
     */
    public Optional<Company> buscarPorId(Long id) {
        return companyRepository.findById(id);
    }

    /**
     * Busca uma empresa pelo CNPJ
     * 
     * @param cnpj CNPJ da empresa
     * @return Optional contendo a empresa, se encontrada
     */
    public Optional<Company> buscarPorCnpj(String cnpj) {
        return companyRepository.findByCnpj(cnpj);
    }

    /**
     * Busca uma empresa pelo ID, lançando exceção se não encontrada
     * 
     * @param id ID da empresa
     * @return A empresa encontrada
     * @throws EntityNotFoundException se a empresa não for encontrada
     */
    public Company buscarPorIdOuFalhar(Long id) {
        return companyRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Empresa não encontrada com ID: " + id));
    }

    /**
     * Salva uma nova empresa ou atualiza uma existente
     * 
     * @param company Empresa a ser salva
     * @return Empresa salva
     */
    @Transactional
    public Company salvar(Company company) {
        // Criptografa a senha se for nova empresa ou se a senha foi alterada
        if (company.getId() == null || (company.getSenha() != null && !company.getSenha().trim().isEmpty())) {
            company.setSenha(passwordEncoder.encode(company.getSenha()));
        }
        return companyRepository.save(company);
    }

    /**
     * Deleta uma empresa pelo ID
     * 
     * @param id ID da empresa a ser deletada
     * @throws EntityNotFoundException se a empresa não for encontrada
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorIdOuFalhar(id);
        companyRepository.deleteById(id);
    }

    /**
     * Verifica se existe uma empresa com o CNPJ informado
     * 
     * @param cnpj CNPJ da empresa
     * @return true se existir, false caso contrário
     */
    public boolean existePorCnpj(String cnpj) {
        return companyRepository.existsByCnpj(cnpj);
    }
}