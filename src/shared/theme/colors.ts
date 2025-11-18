// src/shared/theme/colors.ts

export const colors = {
    // Colores primarios
    primary: '#1a237e',
    primaryLight: '#534bae',
    primaryDark: '#000051',

    // Colores secundarios
    secondary: '#28a745',
    secondaryLight: '#5cb85c',
    secondaryDark: '#1e7e34',

    // Colores de estado
    success: '#28a745',
    warning: '#ffc107',
    error: '#dc3545',
    info: '#007bff',

    // Estados de torneo
    tournamentStarted: '#007bff',
    tournamentInProgress: '#ffc107',
    tournamentFinished: '#28a745',

    // Estados de partido
    matchScheduled: '#6c757d',
    matchInProgress: '#ffc107',
    matchFinished: '#28a745',

    // Grises
    white: '#ffffff',
    black: '#000000',
    gray50: '#f8f9fa',
    gray100: '#f5f5f5',
    gray200: '#e0e0e0',
    gray300: '#d0d0d0',
    gray400: '#999999',
    gray500: '#666666',
    gray600: '#555555',
    gray700: '#333333',
    gray800: '#222222',
    gray900: '#111111',

    // Colores de fondo
    background: '#f5f5f5',
    backgroundCard: '#ffffff',
    backgroundOverlay: 'rgba(0, 0, 0, 0.7)',

    // Colores de texto
    textPrimary: '#333333',
    textSecondary: '#666666',
    textTertiary: '#999999',
    textDisabled: '#cccccc',
    textInverse: '#ffffff',

    // Bordes
    border: '#f0f0f0',
    borderDark: '#e0e0e0',

    // Sombras
    shadow: '#000000',
};

export type ColorKey = keyof typeof colors;
