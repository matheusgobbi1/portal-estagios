import api from "./api";
import { Company } from "../interfaces";

const cadastrar = async (companyData: any): Promise<Company> => {
  const response = await api.post<Company>("/companies", companyData);
  return response.data;
};

const buscarPorId = async (id: number): Promise<Company> => {
  const response = await api.get<Company>(`/companies/${id}`);
  return response.data;
};

const companyService = {
  cadastrar,
  buscarPorId,
};

export default companyService;
