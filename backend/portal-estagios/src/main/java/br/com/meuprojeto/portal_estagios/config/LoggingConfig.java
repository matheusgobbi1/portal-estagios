package br.com.meuprojeto.portal_estagios.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.core.env.Profiles;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class LoggingConfig {

    private final Environment env;

    @PostConstruct
    public void init() {
        try {
            // Cria o diretório de logs se não existir
            Path logDir = Paths.get("logs");
            if (!Files.exists(logDir)) {
                Files.createDirectories(logDir);
                log.info("Diretório de logs criado: {}", logDir.toAbsolutePath());
            }

            // Verifica se está em ambiente de desenvolvimento
            if (env.acceptsProfiles(Profiles.of("dev"))) {
                log.info("Ambiente de desenvolvimento detectado. Logs detalhados serão gerados.");
            }

            // Log inicial do sistema
            log.info("Sistema iniciado com sucesso!");
            log.info("Diretório de logs: {}", logDir.toAbsolutePath());
            log.info("Configuração de logging inicializada");
        } catch (Exception e) {
            log.error("Erro ao inicializar configuração de logging", e);
        }
    }
}