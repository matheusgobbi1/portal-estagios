// Enums
export enum UserRole {
  ADMIN = "ADMIN",
  COMPANY = "COMPANY",
  STUDENT = "STUDENT",
}

export enum JobOfferModalidade {
  PRESENCIAL = "PRESENCIAL",
  REMOTO = "REMOTO",
  HIBRIDO = "HIBRIDO",
}

export enum ApplicationStatus {
  PENDENTE = "PENDENTE",
  EM_ANALISE = "EM_ANALISE",
  APROVADO = "APROVADO",
  REJEITADO = "REJEITADO",
}

// Interfaces para currículo
export interface Education {
  instituicao: string;
  curso: string;
  nivel: string;
  dataInicio: string;
  dataFim?: string;
  emAndamento: boolean;
  descricao?: string;
}

export interface Experience {
  empresa: string;
  cargo: string;
  dataInicio: string;
  dataFim?: string;
  atual: boolean;
  descricao?: string;
}

export interface Skill {
  nome: string;
  nivel: number; // 1-5
  categoria: string;
}

// Interfaces básicas
export interface User {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
}

export interface Area {
  id: number;
  nome: string;
}

// Interfaces específicas
export interface Admin extends User {
  role: UserRole.ADMIN;
}

export interface Company extends User {
  role: UserRole.COMPANY;
  cnpj: string;
  endereco: string;
  areasAtuacao: Area[];
}

export interface Student extends User {
  role: UserRole.STUDENT;
  cpf: string;
  curso: string;
  dataNascimento?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  resumo?: string;
  educacao?: Education[];
  experiencia?: Experience[];
  habilidades?: Skill[];
  areasInteresse: Area[];
}

export interface JobOffer {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  modalidade: JobOfferModalidade;
  cargaHoraria: number;
  requisitos: string;
  ativa: boolean;
  dataCriacao: string;
  dataAtualizacao?: string;
  dataEncerramento?: string;
  company: Company;
  area: Area;
}

export interface Application {
  id: number;
  student: Student;
  jobOffer: JobOffer;
  dataInscricao: string;
  status: ApplicationStatus;
}

// Interfaces para autenticação
export interface AuthRequest {
  email: string;
  senha: string;
}

export interface AuthResponse {
  token: string;
  type: string;
  email: string;
  role: string;
  nome: string;
  id: number;
}
