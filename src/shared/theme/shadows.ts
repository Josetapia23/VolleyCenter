// src/shared/theme/shadows.ts

export const shadows = {
    // Elevaciones para Android
    elevation: {
        none: 0,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 5,
    },

    // Sombras para iOS
    shadow: {
        none: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0,
            shadowRadius: 0,
        },
        sm: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
        },
        md: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
        },
        lg: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.15,
            shadowRadius: 6,
        },
        xl: {
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
        },
    },
};

// Helper para obtener sombra completa (iOS + Android)
export const getCardShadow = (level: 'none' | 'sm' | 'md' | 'lg' | 'xl' = 'md') => ({
    ...shadows.shadow[level],
    elevation: shadows.elevation[level],
});

export type ShadowLevel = 'none' | 'sm' | 'md' | 'lg' | 'xl';
