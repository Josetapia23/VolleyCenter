// src/features/tournaments/tabs/InfoTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Tournament } from '../../../types/tournament';
import { theme } from '../../../shared/theme';

interface InfoTabProps {
    tournament: Tournament;
}

const InfoTab: React.FC<InfoTabProps> = ({ tournament }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    return (
        <View style={styles.tabContent}>
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información General</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Categoría:</Text>
                    <Text style={styles.infoValue}>{tournament.categoria}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ubicación:</Text>
                    <Text style={styles.infoValue}>
                        {tournament.municipio}, {tournament.departamento}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Organizador:</Text>
                    <Text style={styles.infoValue}>{tournament.organizador}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de inicio:</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.fecha_inicio)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de fin:</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.fecha_fin)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <Text style={[styles.infoValue, styles.statusActive]}>
                        {tournament.estado}
                    </Text>
                </View>
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estadísticas</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.total_equipos}</Text>
                        <Text style={styles.statLabel}>Equipos Participantes</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.total_partidos}</Text>
                        <Text style={styles.statLabel}>Total Partidos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.partidos_jugados}</Text>
                        <Text style={styles.statLabel}>Partidos Jugados</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.progreso}%</Text>
                        <Text style={styles.statLabel}>Progreso</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Progreso del torneo</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${tournament.progreso}%` }]} />
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        padding: theme.spacing.base,
    },
    infoSection: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        marginBottom: theme.spacing.base,
        ...theme.getCardShadow('md'),
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    infoLabel: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.medium,
    },
    infoValue: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.semibold,
        textAlign: 'right',
        flex: 1,
        marginLeft: theme.spacing.base,
    },
    statusActive: {
        color: theme.colors.success,
    },
    statsSection: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.base,
        ...theme.getCardShadow('md'),
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -theme.spacing.sm,
    },
    statCard: {
        width: '50%',
        padding: theme.spacing.sm,
    },
    statNumber: {
        fontSize: theme.typography.fontSize.xxxl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        textAlign: 'center',
    },
    statLabel: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginTop: theme.spacing.xs,
    },
    progressContainer: {
        marginTop: theme.spacing.base,
    },
    progressLabel: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.sm,
    },
    progressBar: {
        height: 8,
        backgroundColor: theme.colors.gray200,
        borderRadius: theme.borderRadius.sm,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.sm,
    },
});

export default InfoTab;
