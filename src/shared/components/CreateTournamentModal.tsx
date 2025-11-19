// src/shared/components/CreateTournamentModal.tsx
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    Linking,
    Animated,
    Pressable,
    ScrollView,
} from 'react-native';
import { theme } from '../theme';

interface CreateTournamentModalProps {
    visible: boolean;
    onClose: () => void;
}

const CreateTournamentModal: React.FC<CreateTournamentModalProps> = ({ visible, onClose }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(50)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    tension: 50,
                    friction: 8,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            fadeAnim.setValue(0);
            slideAnim.setValue(50);
        }
    }, [visible]);

    const handleWhatsApp = () => {
        const phoneNumber = '573017557782';
        const message = 'Quiero crear mi torneo';
        const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

        Linking.canOpenURL(url).then((supported) => {
            if (supported) {
                Linking.openURL(url);
            } else {
                // Fallback a versión web de WhatsApp
                Linking.openURL(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`);
            }
        });
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="none"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <Animated.View
                    style={[
                        styles.modalContainer,
                        {
                            opacity: fadeAnim,
                            transform: [{ translateY: slideAnim }],
                        },
                    ]}
                >
                    <Pressable onPress={(e) => e.stopPropagation()}>
                        <ScrollView
                            style={styles.modalContent}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.scrollContent}
                        >
                            {/* Botón cerrar */}
                            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>

                            {/* Título principal */}
                            <View style={styles.header}>
                                <Text style={styles.welcomeText}>BIENVENIDO A</Text>
                                <Text style={styles.brandName}>VOLLEYCENTER</Text>
                                <Text style={styles.tagline}>
                                    La forma más inteligente de organizar tus campeonatos
                                </Text>
                            </View>

                            {/* Descripción */}
                            <Text style={styles.description}>
                                Gestiona fácilmente tus torneos de voleibol con VolleyCenter. Crea, organiza
                                y sigue tus campeonatos en tiempo real, todo desde un solo lugar. Optimiza
                                procesos y ahorra tiempo mientras te enfocas en lo importante: el juego.
                            </Text>

                            {/* Características */}
                            <View style={styles.featuresContainer}>
                                <View style={styles.featureItem}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.icon}>👥</Text>
                                    </View>
                                    <Text style={styles.featureText}>Inscripción rápida de equipos</Text>
                                </View>

                                <View style={styles.featureItem}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.icon}>📅</Text>
                                    </View>
                                    <Text style={styles.featureText}>Programación automática de partidos</Text>
                                </View>

                                <View style={styles.featureItem}>
                                    <View style={styles.iconContainer}>
                                        <Text style={styles.icon}>📊</Text>
                                    </View>
                                    <Text style={styles.featureText}>Resultados en tiempo real</Text>
                                </View>
                            </View>

                            {/* Botón de acción */}
                            <TouchableOpacity
                                style={styles.ctaButton}
                                onPress={handleWhatsApp}
                                activeOpacity={0.8}
                            >
                                <Text style={styles.ctaButtonText}>CREA TU TORNEO</Text>
                                <Text style={styles.ctaButtonArrow}>→</Text>
                            </TouchableOpacity>

                            {/* Texto secundario */}
                            <Text style={styles.footerText}>
                                Contáctanos por WhatsApp y te ayudaremos a crear tu torneo
                            </Text>
                        </ScrollView>
                    </Pressable>
                </Animated.View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 500,
        maxHeight: '90%',
    },
    modalContent: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.xl,
        ...theme.getCardShadow('lg'),
    },
    scrollContent: {
        padding: theme.spacing.xl,
    },
    closeButton: {
        position: 'absolute',
        top: theme.spacing.base,
        right: theme.spacing.base,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: theme.colors.gray200,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10,
    },
    closeButtonText: {
        fontSize: 20,
        color: theme.colors.textSecondary,
        lineHeight: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: theme.spacing.lg,
        paddingTop: theme.spacing.md,
    },
    welcomeText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textSecondary,
        letterSpacing: 1,
        marginBottom: theme.spacing.xs,
    },
    brandName: {
        fontSize: theme.typography.fontSize.xxxl + 4,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    tagline: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.medium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    description: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textPrimary,
        lineHeight: 24,
        textAlign: 'center',
        marginBottom: theme.spacing.xl,
    },
    featuresContainer: {
        marginBottom: theme.spacing.xl,
        gap: theme.spacing.base,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: theme.colors.gray50,
        padding: theme.spacing.base,
        borderRadius: theme.borderRadius.lg,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: theme.borderRadius.md,
        backgroundColor: theme.colors.backgroundCard,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: theme.spacing.md,
        ...theme.getCardShadow('sm'),
    },
    icon: {
        fontSize: 24,
    },
    featureText: {
        flex: 1,
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textPrimary,
    },
    ctaButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.base + 4,
        paddingHorizontal: theme.spacing.xl,
        borderRadius: theme.borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.base,
        ...theme.getCardShadow('md'),
    },
    ctaButtonText: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
        marginRight: theme.spacing.sm,
        letterSpacing: 0.5,
    },
    ctaButtonArrow: {
        fontSize: theme.typography.fontSize.xl,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
    },
    footerText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textTertiary,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default CreateTournamentModal;
