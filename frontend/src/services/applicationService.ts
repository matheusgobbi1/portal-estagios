import api from "./api";
import { Application, ApplicationStatus } from "../interfaces";

const listarPorEmpresa = async (companyId: number): Promise<Application[]> => {
  const response = await api.get<Application[]>(
    `/applications/company/${companyId}`
  );
  return response.data;
};

const listarPorEstudante = async (
  studentId: number
): Promise<Application[]> => {
  const response = await api.get<Application[]>(
    `/applications/student/${studentId}`
  );
  return response.data;
};

const listarPorVaga = async (jobOfferId: number): Promise<Application[]> => {
  const response = await api.get<Application[]>(
    `/applications/job-offer/${jobOfferId}`
  );
  return response.data;
};

const inscreverEstudante = async (
  studentId: number,
  jobOfferId: number
): Promise<Application> => {
  const response = await api.post<Application>("/applications", {
    student: { id: studentId },
    jobOffer: { id: jobOfferId },
  });
  return response.data;
};

const atualizarStatus = async (
  applicationId: number,
  status: ApplicationStatus
): Promise<Application> => {
  const response = await api.patch<Application>(
    `/applications/${applicationId}/status`,
    { status }
  );
  return response.data;
};

const cancelarInscricao = async (applicationId: number): Promise<void> => {
  await api.delete(`/applications/${applicationId}`);
};

const applicationService = {
  listarPorEmpresa,
  listarPorEstudante,
  listarPorVaga,
  inscreverEstudante,
  atualizarStatus,
  cancelarInscricao,
};

export default applicationService;
