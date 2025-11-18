// src/shared/theme/borderRadius.ts

export const borderRadius = {
    none: 0,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    xxl: 20,
    round: 999,
};

export type BorderRadius = keyof typeof borderRadius;
