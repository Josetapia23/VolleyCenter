// src/types/tournament.ts

export interface Tournament {
  id: number;
  nombre: string;
  fecha_inicio: string;
  fecha_fin: string;
  estado: string;
  departamento: string;
  municipio: string;
  organizador: string;
  categoria: string;
  foto_torneo: string;
  torneo_padre: string;
  total_equipos: number;
  total_partidos: number;
  partidos_jugados: number;
  progreso: number;
}

export interface TournamentDetail extends Tournament {
  // Campos adicionales que vendrán del endpoint de detalle
  descripcion?: string;
  reglas?: string;
  premios?: string;
  equipos?: Team[];
  tabla_posiciones?: TeamStanding[];
}

export interface Team {
  id: number;
  nombre: string;
  logo: string;
  ciudad?: string;
  entrenador?: string;
}

export interface TeamStanding {
  posicion: number;
  equipo: Team;
  partidos_jugados: number;
  partidos_ganados: number;
  partidos_perdidos: number;
  sets_favor: number;
  sets_contra: number;
  puntos_favor: number;
  puntos_contra: number;
  puntos: number;
  diferencia_sets: number;
  diferencia_puntos: number;
}

export interface Match {
  id: number;
  fecha: string;
  hora: string;
  equipo_1: Team;
  equipo_2: Team;
  resultado?: MatchResult;
  estado: 'programado' | 'en_curso' | 'finalizado';
  grupo?: string;
}

export interface MatchResult {
  sets_equipo_1: number;
  sets_equipo_2: number;
  set_1_equipo_1: number;
  set_1_equipo_2: number;
  set_2_equipo_1: number;
  set_2_equipo_2: number;
  set_3_equipo_1?: number;
  set_3_equipo_2?: number;
}

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  data: null;
}