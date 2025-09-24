// src/services/api.ts
import axios from 'axios';
import { Tournament, TournamentDetail, Match, ApiResponse } from '../types/tournament';

// Configuración base de la API
const BASE_URL = 'http://10.9.222.141/volleycenter-api'; // Cambia por tu URL real

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para manejar errores globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

class TournamentService {
  // Obtener torneos activos
  static async getActiveTournaments(): Promise<Tournament[]> {
    try {
      const response = await api.get<ApiResponse<Tournament[]>>('/v1/tournaments');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching active tournaments:', error);
      throw error;
    }
  }

  // Obtener detalle de un torneo específico
  static async getTournamentById(id: number): Promise<TournamentDetail> {
    try {
      const response = await api.get<ApiResponse<TournamentDetail>>(`/v1/tournaments/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tournament detail:', error);
      throw error;
    }
  }

  // Obtener tabla de posiciones de un torneo
  static async getTournamentStandings(id: number) {
    try {
      const response = await api.get(`/v1/tournaments/${id}/standings`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tournament standings:', error);
      throw error;
    }
  }

  // Obtener partidos de un torneo
  static async getTournamentMatches(id: number): Promise<Match[]> {
    try {
      const response = await api.get<ApiResponse<Match[]>>(`/v1/tournaments/${id}/matches`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching tournament matches:', error);
      throw error;
    }
  }

  // Obtener detalle de un partido
  static async getMatchById(id: number): Promise<Match> {
    try {
      const response = await api.get<ApiResponse<Match>>(`/v1/matches/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching match detail:', error);
      throw error;
    }
  }
}

export default TournamentService;