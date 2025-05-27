package br.com.meuprojeto.portal_estagios.service;

import br.com.meuprojeto.portal_estagios.entity.Student;
import br.com.meuprojeto.portal_estagios.repository.StudentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Serviço que contém as regras de negócio relacionadas à entidade Student.
 */
@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * Lista todos os estudantes cadastrados
     * 
     * @return Lista de estudantes
     */
    public List<Student> listarTodos() {
        return studentRepository.findAll();
    }

    /**
     * Busca um estudante pelo ID
     * 
     * @param id ID do estudante
     * @return Optional contendo o estudante, se encontrado
     */
    public Optional<Student> buscarPorId(Long id) {
        return studentRepository.findById(id);
    }

    /**
     * Busca um estudante pelo CPF
     * 
     * @param cpf CPF do estudante
     * @return Optional contendo o estudante, se encontrado
     */
    public Optional<Student> buscarPorCpf(String cpf) {
        return studentRepository.findByCpf(cpf);
    }

    /**
     * Busca um estudante pelo ID, lançando exceção se não encontrado
     * 
     * @param id ID do estudante
     * @return O estudante encontrado
     * @throws EntityNotFoundException se o estudante não for encontrado
     */
    public Student buscarPorIdOuFalhar(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Estudante não encontrado com ID: " + id));
    }

    /**
     * Salva um novo estudante ou atualiza um existente
     * 
     * @param student Estudante a ser salvo
     * @return Estudante salvo
     */
    @Transactional
    public Student salvar(Student student) {
        // Criptografa a senha apenas se for um novo estudante ou se a senha foi
        // alterada e não estiver criptografada
        if (student.getId() == null || (student.getSenha() != null && !student.getSenha().trim().isEmpty()
                && !student.getSenha().startsWith("$2a$"))) {
            student.setSenha(passwordEncoder.encode(student.getSenha()));
        }
        return studentRepository.save(student);
    }

    /**
     * Deleta um estudante pelo ID
     * 
     * @param id ID do estudante a ser deletado
     * @throws EntityNotFoundException se o estudante não for encontrado
     */
    @Transactional
    public void deletar(Long id) {
        buscarPorIdOuFalhar(id);
        studentRepository.deleteById(id);
    }

    /**
     * Verifica se existe um estudante com o CPF informado
     * 
     * @param cpf CPF do estudante
     * @return true se existir, false caso contrário
     */
    public boolean existePorCpf(String cpf) {
        return studentRepository.existsByCpf(cpf);
    }
}