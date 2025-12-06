
export interface GeoLocation {
  lat: number;
  lng: number;
  name: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  groundingSources?: {
    uri: string;
    title: string;
  }[];
  isThinking?: boolean;
}

export interface SearchResult {
  locations: GeoLocation[];
  summary: string;
}

export interface MapViewState {
  center: [number, number];
  zoom: number;
}

export interface Simulador {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;

  // Candidatos incluidos en el escenario
  candidates: Candidate[];

  // Variables globales del contexto del escenario
  context: SimulationContext;

  // Resultados generados por el motor de simulación
  results?: SimulationResults;
}

export interface Candidate {
  id: string;
  name: string;
  party: string;
  position: string; // cargo al que compite

  // Atributos cuantificables mediante sliders
  age: number; // 18–90
  experience: number; // 0–100
  recognition: number; // 0–100 conocimiento del electorado
  reputation: number; // -100 a 100
  resources: number; // 0–100 recursos campaña
  ideology: number; // -100 izquierda a 100 derecha
  rejection: number; // 0–100
  mobilization: number; // 0–100
}

export interface SimulationContext {
  expectedTurnout: number; // participación ciudadana
  economy: "improving" | "stable" | "declining";
  insecurity: "low" | "medium" | "high";
  polarization: number; // 0–100

  // Factores externos
  scandals?: string[]; // IDs de candidatos o partidos
  incumbencyParty?: string; // partido en el poder
}

export interface SimulationResults {
  probabilities: Record<string, number>; // idCandidato -> probabilidad
  territorialBreakdown: Record<string, TerritorialResult>; // sección/distrito
  summary: string;
}

export interface TerritorialResult {
  sectionId: string;
  winner: string; // id del candidato
  probabilities: Record<string, number>;
}


export enum LayerType {
  STREET = 'STREET',
  SATELLITE = 'SATELLITE',
  DARK = 'DARK',
  TERRAIN = 'TERRAIN'
}


export interface ElectionResult {
  seccion: string;
  municipio: string;
  // Main Parties
  pan: number;
  pri: number;
  prd: number;
  mc: number;
  pvem: number;
  morena: number;
  pt: number;
  queretaro_seguro: number; // QS
  
  // Independent Candidates / Others
  emc: number;
  jbll: number;
  rhr: number;
  ldbg: number;
  atv: number;
  ssp: number;
  mrgh: number;
  smg: number;
  
  // Coalitions
  pvem_morena_pt: number;
  pvem_morena: number;
  pvem_pt: number;
  morena_pt: number;
  pan_pri_prd: number;
  pan_pri: number;
  pan_prd: number;
  pri_prd: number;
  
  // Stats
  num_noreg: number;
  nulos: number;
  total_votos: number; 
  lista_nominal: number;
  winner: number;
}

export interface ElectionResult21 {
  seccion: string;
  municipio: string;
  // Main Parties
  pan: number;
  pri: number;
  prd: number;
  mc: number;
  pvem: number;
  morena: number;
  pt: number;
  qi: number; // Q independiente


  // Independents 
  ci_1?: number;
  ci_2?: number;
  ci_3?: number;
  ci_4?: number;
  ci_5?: number;
  ci_6?: number;
  ci_7?: number;
  ci_8?: number;
  ci_9?: number;
  ci_10?: number;
  ci_11?: number;
  ci_12?: number;
  ci_13?: number;
  ci_14?: number;


    // Coalitions
  pan_qi: number;
  pri_pvem: number;
  pvem_pt: number;
  pan_prd_qi: number;
  pan_prd: number;
  prd_qi: number;
  pt_qi: number;

  // Stats
  winner: number;
  num_noreg: number;
  nulos: number;
  total_votos: number;
  lista_nominal: number;
  }

export interface ElectionResult18 {
  seccion: string;
  municipio: string;

  // Partidos individuales 2018
  pan: number;
  pri: number;
  prd: number;
  pvem: number;
  pt: number;
  mc: number;
  na: number;
  morena: number;

  // Otros partidos presentes en la boleta 2018
  es: number;     // Encuentro Social (ES)
  cq: number;     // CQ
  qi: number;     // Querétaro Independiente

  // Coaliciones
  morena_pt_pes: number;
  morena_pt: number;
  morena_pes: number;
  pt_pes: number;
  pri_pvem: number;

  cc_pan_prd_mc: number; // Coalición completa PAN–PRD–MC
  pan_prd: number;
  pan_mc: number;
  prd_mc: number;

  cc2_pan_prd: number;   // variante de coalición parcial PAN–PRD
  cc3_pan_mc: number;    // variante PAN–MC
  cc4_pri_pvem: number;  // variante PRI–PVEM

  // Candidatos independientes (JAGRV, LGOD, etc.)
  jagrv: number;
  lgod: number;
  lbh: number;
  oelo: number;
  mgag: number;
  rmh: number;
  emb: number;
  janh: number;
  jnl: number;
  jmmm: number;
  jaml: number;
  pvm: number;
  acm: number;
  djd: number;
  jbll: number;
  hmv: number;
  rms: number;
  jlms: number;
  prcl: number;
  amg: number;
  rrt: number;
  agab: number;
  efm: number;

  // Stats
  num_noreg: number;
  nulos: number;
  total_votos: number;
  lista_nominal: number;

  // Winner
  winner: string;
}

export interface Coneval {
  seccion: number;
  municipio: string;

  // Nivel pobreza
  nivelPobreza: number;

  
}

