// src/shared/theme/index.ts

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './shadows';
export * from './borderRadius';

import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';
import { shadows, getCardShadow } from './shadows';
import { borderRadius } from './borderRadius';

// Tema completo exportado como objeto único
export const theme = {
    colors,
    typography,
    spacing,
    shadows,
    borderRadius,
    getCardShadow,
};

// Helper functions para facilitar el uso
export const getStatusColor = (estado: string) => {
    const estadoLower = estado.toLowerCase();
    switch (estadoLower) {
        case 'iniciado':
            return colors.tournamentStarted;
        case 'en ejecución':
        case 'en ejecucion':
            return colors.tournamentInProgress;
        case 'finalizado':
            return colors.tournamentFinished;
        default:
            return colors.gray500;
    }
};

export const getMatchStatusColor = (estado: string) => {
    switch (estado) {
        case 'finalizado':
            return colors.matchFinished;
        case 'en_curso':
            return colors.matchInProgress;
        case 'programado':
            return colors.matchScheduled;
        default:
            return colors.gray500;
    }
};

export const getMatchStatusLabel = (estado: string) => {
    switch (estado) {
        case 'finalizado':
            return 'Finalizado';
        case 'en_curso':
            return 'En Curso';
        case 'programado':
            return 'Programado';
        default:
            return estado;
    }
};

export default theme;
