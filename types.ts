
// Definición de tipos para los datos de la aplicación

export interface NewsItem {
  id: number;
  title: string;
  summary: string;
  content?: string; // Nuevo campo para el texto completo
  imageUrl: string;
  videoUrl?: string; // Nuevo campo para videos de YouTube
  date: string;
}

export interface FeaturedNewsItem {
  active: boolean;
  title: string;
  subtitle: string;
  imageUrl: string;
  // VideoUrl eliminado a pedido
}

export interface GroupTeam {
  name: string;
  flag?: string;
}

export interface WorldCupGroup {
  id: string; // "A", "B", etc.
  teams: GroupTeam[]; // Array de objetos con nombre y bandera
}

// --- NUEVOS TIPOS PARA FASE FINAL (BRACKET) ---
export interface BracketTeam {
    name: string;
    flag?: string;
    score?: string;
    isWinner?: boolean;
}

export interface BracketMatch {
    id: string; // 'qf1', 'qf2', 'sf1', 'final', etc.
    label: string; // "Cuartos 1", "Semifinal", etc.
    team1: BracketTeam;
    team2: BracketTeam;
}
// --------------------------------------------

export interface Venue {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: string;
  imageUrl: string;
  cityDescription: string;
  climate: string;
  altitude: string;
  timezone: string;
}

export interface Player {
  id: number;
  name: string;
  position: 'GK' | 'DF' | 'MF' | 'FW';
  number: number;
  club: string;
  age: number;
  height: string;
  weight: string;
  worldCups: number; 
  imageUrl: string; 
}

export interface Team {
  id: string;
  name: string;
  code: string; 
  fifaAbbr: string;
  ranking: number;
  squadValue: string;
  titles: number;
  participations: number;
  primaryColor: string;
  logoUrl?: string; 
  description?: string; 
  
  // NUEVOS CAMPOS
  coachName?: string;
  coachImage?: string;
  jerseyImage?: string; // Reemplaza a primaryColor visualmente en el modal

  squad: Player[]; 
}

export interface HistoryEvent {
  year: number;
  host: string;
  champion: string;
  imageUrl: string;
  description?: string; // Resumen histórico
  
  // FIGURAS
  bestPlayer: string; // Balón de Oro
  bestPlayerImage?: string; // Nueva imagen específica
  
  topScorer?: string; // Bota de Oro (Nuevo)
  topScorerImage?: string; // Nueva imagen específica
}

export interface AdZone {
  id: number;
  active: boolean;
  layout: 'full' | 'split'; 
  image1: string; 
  link1: string;
  image2: string; 
  link2: string;
}

// --- NUEVOS TIPOS PARA JUEGO Y ENCUESTA ---

export interface GameQuestion {
  id: number;
  question: string;
  options: string[]; // Array de 4 opciones
  correctAnswerIndex: number; // 0, 1, 2 o 3
}

export interface PollOption {
  id: string;
  label: string; // Editable
  color: string; // Clase de tailwind (bg-color)
  votes: number;
}

export interface PollConfig {
  question: string; // Pregunta editable (ej: "¿Quién gana?")
  options: PollOption[];
}
