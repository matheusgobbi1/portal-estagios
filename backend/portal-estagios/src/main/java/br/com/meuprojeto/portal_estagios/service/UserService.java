package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.User;
import br.com.meuprojeto.portal_estagios.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço base para operações comuns a todos os tipos de usuário.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lista todos os usuários
     * 
     * @return Lista de usuários
     */
    public List<User> listarTodos() {
        return userRepository.findAll();
    }

    /**
     * Busca um usuário pelo ID
     * 
     * @param id ID do usuário
     * @return Optional contendo o usuário, se encontrado
     */
    public Optional<User> buscarPorId(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Busca um usuário pelo e-mail
     * 
     * @param email E-mail do usuário
     * @return Optional contendo o usuário, se encontrado
     */
    public Optional<User> buscarPorEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Busca um usuário pelo ID, lançando exceção se não encontrado
     * 
     * @param id ID do usuário
     * @return O usuário encontrado
     * @throws EntityNotFoundException se o usuário não for encontrado
     */
    public User buscarPorIdOuFalhar(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Usuário não encontrado com ID: " + id));
    }

    /**
     * Criptografa a senha de um usuário
     * 
     * @param user Usuário com senha em texto plano
     * @return Usuário com senha criptografada
     */
    public User criptografarSenha(User user) {
        user.setSenha(passwordEncoder.encode(user.getSenha()));
        return user;
    }

    /**
     * Verifica se já existe um usuário com o e-mail informado
     * 
     * @param email E-mail a ser verificado
     * @return true se já existir, false caso contrário
     */
    public boolean existePorEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    /**
     * Salva um usuário (com senha criptografada)
     * 
     * @param user Usuário a ser salvo
     * @return Usuário salvo
     */
    @Transactional
    public User salvar(User user) {
        // Se for um novo usuário ou se a senha for alterada, criptografa a senha
        if (user.getId() == null || user.getSenha() != null) {
            user = criptografarSenha(user);
        }
        return userRepository.save(user);
    }

    /**
     * Deleta um usuário pelo ID
     * 
     * @param id ID do usuário a ser deletado
     */
    @Transactional
    public void deletar(Long id) {
        userRepository.deleteById(id);
    }
}