// src/features/tournaments/components/TournamentCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tournament } from '../../../types/tournament';
import { theme, getStatusColor } from '../../../shared/theme';

interface TournamentCardProps {
    tournament: Tournament;
    onPress: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            {/* Badge de Estado */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.estado) }]}>
                    <Text style={styles.statusText}>{tournament.estado}</Text>
                </View>
            </View>

            {/* Header con imagen */}
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: tournament.foto_torneo }}
                    style={styles.tournamentImage}
                    resizeMode="cover"
                />
                <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName} numberOfLines={2}>
                        {tournament.nombre}
                    </Text>
                    <Text style={styles.category}>{tournament.categoria}</Text>
                    <Text style={styles.location}>
                        {tournament.municipio}, {tournament.departamento}
                    </Text>
                </View>
            </View>

            {/* Contenido */}
            <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Período</Text>
                    <Text style={styles.dateText}>
                        {formatDate(tournament.fecha_inicio)} - {formatDate(tournament.fecha_fin)}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.total_equipos}</Text>
                        <Text style={styles.statLabel}>Equipos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.partidos_jugados}</Text>
                        <Text style={styles.statLabel}>Partidos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.progreso}%</Text>
                        <Text style={styles.statLabel}>Progreso</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${tournament.progreso}%`,
                                    backgroundColor: getStatusColor(tournament.estado)
                                }
                            ]}
                        />
                    </View>
                </View>

                <Text style={styles.organizer} numberOfLines={1}>
                    Organizado por: {tournament.organizador}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
        ...theme.getCardShadow('md'),
        overflow: 'hidden',
    },
    statusContainer: {
        alignItems: 'flex-end',
        paddingTop: theme.spacing.md,
        paddingRight: theme.spacing.md,
        paddingBottom: 0,
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs + 2,
        borderRadius: theme.borderRadius.xl,
        ...theme.getCardShadow('sm'),
    },
    statusText: {
        fontSize: theme.typography.fontSize.xs + 1,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    cardHeader: {
        flexDirection: 'row',
        padding: theme.spacing.base,
        paddingTop: theme.spacing.sm,
        alignItems: 'center',
    },
    tournamentImage: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.md,
        marginRight: theme.spacing.md,
    },
    tournamentInfo: {
        flex: 1,
    },
    tournamentName: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    category: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
        marginBottom: 2,
    },
    location: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    cardContent: {
        paddingHorizontal: theme.spacing.base,
        paddingBottom: theme.spacing.base,
    },
    dateContainer: {
        marginBottom: theme.spacing.md,
    },
    dateLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textTertiary,
        marginBottom: theme.spacing.xs,
    },
    dateText: {
        fontSize: theme.typography.fontSize.sm + 1,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.medium,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
    },
    statLabel: {
        fontSize: theme.typography.fontSize.xs + 1,
        color: theme.colors.textSecondary,
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: theme.spacing.md,
    },
    progressBar: {
        height: 6,
        backgroundColor: theme.colors.gray200,
        borderRadius: theme.borderRadius.sm - 1,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: theme.borderRadius.sm - 1,
    },
    organizer: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textTertiary,
        fontStyle: 'italic',
    },
});

export default TournamentCard;
