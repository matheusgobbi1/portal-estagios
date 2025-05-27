import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// Variável para controlar tentativas de redirecionamento
let isRedirecting = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Cache para requisições GET
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Interceptor para adicionar o token e gerenciar cache
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log(
        "Enviando requisição com token:",
        token.substring(0, 20) + "..."
      );
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      console.log("Atenção: Requisição sem token de autenticação");
    }

    // Implementar cache apenas para requisições GET
    if (config.method === "get") {
      const cacheKey = `${config.url}${JSON.stringify(config.params || {})}`;
      const cachedResponse = cache.get(cacheKey);

      if (
        cachedResponse &&
        Date.now() - cachedResponse.timestamp < CACHE_DURATION
      ) {
        return Promise.reject({
          __CACHE__: true,
          data: cachedResponse.data,
        });
      }
    }

    return config;
  },
  (error) => {
    console.error("Erro ao preparar requisição:", error);
    return Promise.reject(error);
  }
);

// Interceptor para tratar respostas e cache
api.interceptors.response.use(
  (response) => {
    // Armazenar em cache apenas respostas GET bem-sucedidas
    if (response.config.method === "get") {
      const cacheKey = `${response.config.url}${JSON.stringify(
        response.config.params || {}
      )}`;
      cache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      });
    }
    return response;
  },
  (error) => {
    if (error.__CACHE__) {
      return Promise.resolve({ data: error.data });
    }

    console.error(
      "Erro na resposta da API:",
      error.response?.status,
      error.response?.data
    );

    if (error.response) {
      // Tratar conforme o código de status

      console.log("Error:", error);
      //TODO
      return;
      switch (error.response.status) {
        case 401:
          console.log("Erro de autenticação (401). Redirecionando para login.");
          // Evitar redirecionamento múltiplo e em páginas específicas
          if (
            !isRedirecting &&
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/registro")
          ) {
            isRedirecting = true;

            // Limpar dados de autenticação
            localStorage.removeItem("token");
            localStorage.removeItem("user");

            // Redirecionamento com um pequeno delay para evitar problemas
            setTimeout(() => {
              window.location.href = "/login";
              isRedirecting = false;
            }, 100);
          }
          break;
        case 403:
          console.log("Erro de autorização (403). Usuário não tem permissão.");
          break;
        case 500:
          console.log("Erro interno do servidor (500).");
          break;
        default:
          console.log(`Erro desconhecido: ${error.response.status}`);
      }
    } else if (error.request) {
      console.log(
        "Não houve resposta do servidor. Verifique se o backend está rodando."
      );
    } else {
      console.log("Erro ao configurar requisição:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
