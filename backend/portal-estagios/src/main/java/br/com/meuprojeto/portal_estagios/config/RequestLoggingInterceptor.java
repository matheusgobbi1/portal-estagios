package br.com.meuprojeto.portal_estagios.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import java.util.Enumeration;

@Slf4j
@Component
public class RequestLoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        String queryString = request.getQueryString();
        String fullUrl = queryString != null ? uri + "?" + queryString : uri;
        String userAgent = request.getHeader("User-Agent");
        String contentType = request.getContentType();

        StringBuilder headers = new StringBuilder();
        Enumeration<String> headerNames = request.getHeaderNames();
        while (headerNames.hasMoreElements()) {
            String headerName = headerNames.nextElement();
            headers.append(headerName).append(": ").append(request.getHeader(headerName)).append(", ");
        }

        log.debug("""
                Requisição recebida:
                Método: {}
                URL: {}
                IP: {}
                User-Agent: {}
                Content-Type: {}
                Headers: {}
                """, method, fullUrl, request.getRemoteAddr(), userAgent, contentType, headers);

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            ModelAndView modelAndView) {
        String method = request.getMethod();
        String uri = request.getRequestURI();
        int status = response.getStatus();
        String contentType = response.getContentType();

        StringBuilder headers = new StringBuilder();
        response.getHeaderNames().forEach(headerName -> headers.append(headerName).append(": ")
                .append(response.getHeader(headerName)).append(", "));

        log.debug("""
                Resposta enviada:
                Método: {}
                URL: {}
                Status: {}
                Content-Type: {}
                Headers: {}
                """, method, uri, status, contentType, headers);
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler,
            Exception ex) {
        if (ex != null) {
            String method = request.getMethod();
            String uri = request.getRequestURI();
            log.error("""
                    Erro na requisição:
                    Método: {}
                    URL: {}
                    Erro: {}
                    Stack Trace: {}
                    """, method, uri, ex.getMessage(), ex);
        }
    }
}