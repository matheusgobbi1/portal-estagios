package br.com.meuprojeto.portal_estagios.entity;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * Entidade que representa um administrador do sistema.
 */
@Entity
@Table(name = "admins")
@DiscriminatorValue("ADMIN")
@Data
@EqualsAndHashCode(callSuper = true)
public class Admin extends User {

    @PrePersist
    @Override
    public void prePersist() {
        super.prePersist();
        setRole(Role.ADMIN);
    }
}