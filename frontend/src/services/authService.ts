import api from "./api";
import { AuthRequest, AuthResponse } from "../interfaces";

const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/auth/login", credentials);
  const { token, ...userData } = response.data;

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(userData));

  // LOGS ESTRATÉGICOS
  console.log("[authService] Login response:", response.data);
  console.log("[authService] Token salvo:", token);
  console.log("[authService] User salvo:", userData);

  return response.data;
};

const logout = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};

const isAuthenticated = (): boolean => {
  return localStorage.getItem("token") !== null;
};

const getCurrentUser = (): AuthResponse | null => {
  const user = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (user && token) {
    return { ...JSON.parse(user), token };
  }

  return null;
};

const authService = {
  login,
  logout,
  isAuthenticated,
  getCurrentUser,
};

export default authService;
