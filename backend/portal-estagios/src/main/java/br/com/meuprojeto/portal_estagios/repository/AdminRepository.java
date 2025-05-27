package br.com.meuprojeto.portal_estagios.repository;

import br.com.meuprojeto.portal_estagios.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repositório para operações de banco de dados da entidade Admin.
 */
@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {
}