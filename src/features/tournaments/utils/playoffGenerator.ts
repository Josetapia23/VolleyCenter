// src/features/tournaments/utils/playoffGenerator.ts
import { PlayoffPhase, PlayoffMatch, Team } from '../../../types/tournament';

// Equipo "Por Definir" para partidos futuros
const TBD_TEAM: Team = {
  id: -1,
  nombre: 'Por Definir',
  logo: 'https://via.placeholder.com/50?text=TBD',
  categoria: '',
  ciudad: '',
};

/**
 * Obtiene el equipo ganador de un partido
 */
const getWinner = (match: PlayoffMatch): Team | null => {
  if (!match.resultado || !match.resultado.ganador) {
    return null;
  }

  if (match.resultado.ganador === match.equipo_1.id) {
    return match.equipo_1;
  } else if (match.resultado.ganador === match.equipo_2.id) {
    return match.equipo_2;
  }

  return null;
};

/**
 * Genera un partido "Por Definir"
 */
const createTBDMatch = (
  idCruce: number,
  llave: string,
  idFase: number | null = null
): PlayoffMatch => {
  return {
    id_fase: idFase,
    id_cruce: idCruce,
    llave,
    fecha: '',
    ubicacion: '',
    estado: 'programado',
    equipo_1: TBD_TEAM,
    equipo_2: TBD_TEAM,
    resultado: {
      sets_equipo_1: 0,
      sets_equipo_2: 0,
      ganador: null,
      detalles_sets: [],
    },
  };
};

/**
 * Genera la siguiente fase basándose en los ganadores de la fase actual
 */
const generateNextPhase = (
  currentPhase: PlayoffPhase,
  phaseName: string,
  phaseOrder: number
): PlayoffPhase => {
  const currentMatches = currentPhase.cruces;

  // Agrupar partidos por llave
  const llaves = Array.from(new Set(currentMatches.map(m => m.llave))).sort();

  const nextMatches: PlayoffMatch[] = [];
  let cruceId = 1;

  llaves.forEach(llave => {
    const matchesInKey = currentMatches.filter(m => m.llave === llave).sort((a, b) => a.id_cruce - b.id_cruce);

    // Emparejar partidos de dos en dos para crear los siguientes
    for (let i = 0; i < matchesInKey.length; i += 2) {
      if (i + 1 < matchesInKey.length) {
        const match1 = matchesInKey[i];
        const match2 = matchesInKey[i + 1];

        const winner1 = getWinner(match1);
        const winner2 = getWinner(match2);

        nextMatches.push({
          id_fase: null,
          id_cruce: cruceId++,
          llave,
          fecha: '',
          ubicacion: '',
          estado: 'programado',
          equipo_1: winner1 || TBD_TEAM,
          equipo_2: winner2 || TBD_TEAM,
          resultado: {
            sets_equipo_1: 0,
            sets_equipo_2: 0,
            ganador: null,
            detalles_sets: [],
          },
        });
      }
    }
  });

  return {
    nombre: phaseName,
    orden: phaseOrder,
    cruces: nextMatches,
  };
};

/**
 * Genera todas las fases faltantes del playoff
 */
export const generateMissingPhases = (phases: PlayoffPhase[]): PlayoffPhase[] => {
  if (phases.length === 0) {
    return phases;
  }

  // Ordenar fases por orden
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  // Identificar qué fases existen
  const phaseNames = sortedPhases.map(p => p.nombre.toLowerCase());

  const hasOctavos = phaseNames.some(n => n.includes('octavos'));
  const hasCuartos = phaseNames.some(n => n.includes('cuartos'));
  const hasSemis = phaseNames.some(n => n.includes('semi'));
  const hasFinal = phaseNames.some(n => n.includes('final') && !n.includes('semi') && !n.includes('octavos') && !n.includes('cuartos'));

  const result: PlayoffPhase[] = [...sortedPhases];

  // Si tenemos octavos pero no cuartos, generarlos
  if (hasOctavos && !hasCuartos) {
    const octavosPhase = sortedPhases.find(p => p.nombre.toLowerCase().includes('octavos'));
    if (octavosPhase) {
      const cuartosPhase = generateNextPhase(octavosPhase, 'Cuartos de Final', octavosPhase.orden + 1);
      result.push(cuartosPhase);

      // También generar semis y final
      const semisPhase = generateNextPhase(cuartosPhase, 'Semifinal', cuartosPhase.orden + 1);
      result.push(semisPhase);

      const finalPhase = generateNextPhase(semisPhase, 'Final', semisPhase.orden + 1);
      result.push(finalPhase);
    }
  }
  // Si tenemos cuartos pero no semis, generarlas
  else if (hasCuartos && !hasSemis) {
    const cuartosPhase = sortedPhases.find(p => p.nombre.toLowerCase().includes('cuartos'));
    if (cuartosPhase) {
      const semisPhase = generateNextPhase(cuartosPhase, 'Semifinal', cuartosPhase.orden + 1);
      result.push(semisPhase);

      const finalPhase = generateNextPhase(semisPhase, 'Final', semisPhase.orden + 1);
      result.push(finalPhase);
    }
  }
  // Si tenemos semis pero no final, generarla
  else if (hasSemis && !hasFinal) {
    const semisPhase = sortedPhases.find(p => p.nombre.toLowerCase().includes('semi'));
    if (semisPhase) {
      const finalPhase = generateNextPhase(semisPhase, 'Final', semisPhase.orden + 1);
      result.push(finalPhase);
    }
  }

  // Ordenar por orden antes de devolver
  return result.sort((a, b) => a.orden - b.orden);
};

/**
 * Verifica si hay fases faltantes
 */
export const hasMissingPhases = (phases: PlayoffPhase[]): boolean => {
  if (phases.length === 0) {
    return false;
  }

  const phaseNames = phases.map(p => p.nombre.toLowerCase());

  const hasOctavos = phaseNames.some(n => n.includes('octavos'));
  const hasCuartos = phaseNames.some(n => n.includes('cuartos'));
  const hasSemis = phaseNames.some(n => n.includes('semi'));
  const hasFinal = phaseNames.some(n => n.includes('final') && !n.includes('semi') && !n.includes('octavos') && !n.includes('cuartos'));

  // Si hay octavos, debe haber cuartos, semis y final
  if (hasOctavos) {
    return !hasCuartos || !hasSemis || !hasFinal;
  }

  // Si hay cuartos, debe haber semis y final
  if (hasCuartos) {
    return !hasSemis || !hasFinal;
  }

  // Si hay semis, debe haber final
  if (hasSemis) {
    return !hasFinal;
  }

  return false;
};
