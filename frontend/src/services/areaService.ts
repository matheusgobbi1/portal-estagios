import api from "./api";
import { Area } from "../interfaces";

const buscarTodas = async (): Promise<Area[]> => {
  const response = await api.get<Area[]>("/areas");
  return response.data;
};

const buscarPorId = async (id: number): Promise<Area> => {
  const response = await api.get<Area>(`/areas/${id}`);
  return response.data;
};

const criar = async (area: Omit<Area, "id">): Promise<Area> => {
  const response = await api.post<Area>("/admin/areas", area);
  return response.data;
};

const atualizar = async (id: number, area: Omit<Area, "id">): Promise<Area> => {
  const response = await api.put<Area>(`/admin/areas/${id}`, area);
  return response.data;
};

const remover = async (id: number): Promise<void> => {
  await api.delete(`/admin/areas/${id}`);
};

const areaService = {
  buscarTodas,
  buscarPorId,
  criar,
  atualizar,
  remover,
};

export default areaService;
