import api from "./api";

interface DashboardData {
  totalEmpresas: number;
  totalEstudantes: number;
  vagasAbertas: number;
  vagasEncerradas: number;
  vagasPorArea: Array<[string, number]>;
}

const getDashboard = async (): Promise<DashboardData> => {
  const response = await api.get<DashboardData>("/admin/dashboard");
  return response.data;
};

const adminService = {
  getDashboard,
};

export default adminService;
