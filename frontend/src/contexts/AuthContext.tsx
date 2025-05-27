import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import { AuthResponse, AuthRequest } from "../interfaces";
import authService from "../services/authService";

interface AuthContextData {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
  login: (credentials: AuthRequest) => Promise<AuthResponse>;
  logout: () => void;
  isAuthenticated: () => boolean;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Carregar usuário do localStorage na inicialização e quando houver mudanças
  const refreshUser = () => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  };

  // Carregar usuário na inicialização
  //useEffect(() => {
  //  refreshUser();
  //}, []);

  const login = async (credentials: AuthRequest): Promise<AuthResponse> => {
    try {
      setLoading(true);
      setError(null);
      console.log("[AuthContext] Iniciando login", credentials);
      const response = await authService.login(credentials);

      setUser(response);

      return response;
    } catch (err) {
      setError("Credenciais inválidas. Por favor, tente novamente.");
      console.error("[AuthContext] Erro no login:", err);
      throw err;
    } finally {
      setLoading(false);

      setTimeout(() => {
        const currentUser = authService.getCurrentUser();
        console.log("[AuthContext] Estado após login:", {
          user: currentUser,
          loading: false,
          error,
        });
      }, 100);
    }
  };

  const logout = () => {
    console.log("[AuthContext] Logout chamado");
    authService.logout();
    setUser(null);
  };

  const isAuthenticated = (): boolean => {
    return authService.isAuthenticated();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
