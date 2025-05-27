import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

let isRedirecting = false;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});


const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; 


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


api.interceptors.response.use(
  (response) => {
    
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
      

      console.log("Error:", error);

      return;
      switch (error.response.status) {
        case 401:
          console.log("Erro de autenticação (401). Redirecionando para login.");
          
          if (
            !isRedirecting &&
            !window.location.pathname.includes("/login") &&
            !window.location.pathname.includes("/registro")
          ) {
            isRedirecting = true;

            
            localStorage.removeItem("token");
            localStorage.removeItem("user");

          
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
