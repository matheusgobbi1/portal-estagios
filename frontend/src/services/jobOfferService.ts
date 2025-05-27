import api from "./api";
import { JobOffer } from "../interfaces";

const listarTodas = async (): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>("/job-offers");
  return response.data;
};

const listarAtivas = async (): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>("/job-offers/ativas");
  return response.data;
};

const listarAtivasPorEmpresa = async (
  companyId: number
): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>(
    `/job-offers/company/${companyId}`
  );
  return response.data;
};

const listarAtivasPorArea = async (areaId: number): Promise<JobOffer[]> => {
  const response = await api.get<JobOffer[]>(`/job-offers/area/${areaId}`);
  return response.data;
};

const buscarPorId = async (id: number): Promise<JobOffer> => {
  const response = await api.get<JobOffer>(`/job-offers/${id}`);
  return response.data;
};

const criar = async (jobOfferData: any): Promise<JobOffer> => {
  const response = await api.post<JobOffer>("/job-offers", jobOfferData);
  return response.data;
};

const atualizar = async (id: number, jobOfferData: any): Promise<JobOffer> => {
  const response = await api.put<JobOffer>(`/job-offers/${id}`, jobOfferData);
  return response.data;
};

const encerrar = async (id: number): Promise<JobOffer> => {
  const response = await api.patch<JobOffer>(`/job-offers/${id}/encerrar`);
  return response.data;
};

const excluir = async (id: number): Promise<void> => {
  await api.delete(`/job-offers/${id}`);
};

const jobOfferService = {
  listarTodas,
  listarAtivas,
  listarAtivasPorEmpresa,
  listarAtivasPorArea,
  buscarPorId,
  criar,
  atualizar,
  encerrar,
  excluir,
};

export default jobOfferService;
