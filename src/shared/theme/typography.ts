// src/shared/theme/typography.ts

export const typography = {
    // Tamaños de fuente
    fontSize: {
        xs: 10,
        sm: 12,
        md: 14,
        base: 16,
        lg: 18,
        xl: 20,
        xxl: 24,
        xxxl: 32,
        huge: 36,
    },

    // Pesos de fuente
    fontWeight: {
        normal: '400' as const,
        medium: '500' as const,
        semibold: '600' as const,
        bold: '700' as const,
        extrabold: '800' as const,
    },

    // Alturas de línea
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.8,
    },
};

export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type LineHeight = keyof typeof typography.lineHeight;
