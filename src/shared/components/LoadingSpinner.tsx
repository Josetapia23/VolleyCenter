// src/shared/components/LoadingSpinner.tsx
import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Text, StyleSheet, Animated } from 'react-native';
import { theme } from '../theme';

interface LoadingSpinnerProps {
    message?: string;
    color?: string;
    size?: 'small' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    message = 'Cargando...',
    color = theme.colors.primary,
    size = 'large'
}) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        // Animación de fade in
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Animación de pulso continuo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.1,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <Animated.View style={[styles.spinnerContainer, { transform: [{ scale: pulseAnim }] }]}>
                <View style={styles.spinnerBackground}>
                    <ActivityIndicator size={size} color={color} />
                </View>
            </Animated.View>
            {message && (
                <Animated.View style={{ opacity: fadeAnim }}>
                    <Text style={styles.text}>{message}</Text>
                    <View style={styles.dotsContainer}>
                        <LoadingDots />
                    </View>
                </Animated.View>
            )}
        </Animated.View>
    );
};

const LoadingDots: React.FC = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const createDotAnimation = (dot: Animated.Value, delay: number) => {
            return Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            );
        };

        Animated.parallel([
            createDotAnimation(dot1, 0),
            createDotAnimation(dot2, 200),
            createDotAnimation(dot3, 400),
        ]).start();
    }, []);

    const dotStyle = (anim: Animated.Value) => ({
        opacity: anim,
        transform: [
            {
                translateY: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                }),
            },
        ],
    });

    return (
        <View style={styles.dots}>
            <Animated.View style={[styles.dot, dotStyle(dot1)]} />
            <Animated.View style={[styles.dot, dotStyle(dot2)]} />
            <Animated.View style={[styles.dot, dotStyle(dot3)]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.xl,
        backgroundColor: theme.colors.background,
    },
    spinnerContainer: {
        marginBottom: theme.spacing.lg,
    },
    spinnerBackground: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.round,
        padding: theme.spacing.xl,
        ...theme.getCardShadow('lg'),
    },
    text: {
        marginTop: theme.spacing.base,
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.semibold,
        textAlign: 'center',
    },
    dotsContainer: {
        marginTop: theme.spacing.sm,
    },
    dots: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.sm,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: theme.colors.primary,
    },
});

export default LoadingSpinner;
