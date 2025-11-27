// src/features/matches/components/MatchCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Match } from '../../../types/tournament';
import { theme, getMatchStatusColor, getMatchStatusLabel } from '../../../shared/theme';

interface MatchCardProps {
    match: Match;
    onPress?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    // Determinar ganador para aplicar colores
    const team1Score = match.resultado?.sets_equipo_1 || 0;
    const team2Score = match.resultado?.sets_equipo_2 || 0;
    const team1Won = team1Score > team2Score;
    const team2Won = team2Score > team1Score;

    return (
        <Container
            style={styles.matchCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {/* Header: Fecha y Estado */}
            <View style={styles.matchHeader}>
                <Text style={styles.matchDate}>
                    {match.fecha} - {match.hora}
                </Text>
                <View
                    style={[
                        styles.matchStatus,
                        { backgroundColor: getMatchStatusColor(match.estado) }
                    ]}
                >
                    <Text style={styles.matchStatusText}>
                        {getMatchStatusLabel(match.estado)}
                    </Text>
                </View>
            </View>

            {/* Layout Principal: Equipo 1 | Marcador | Equipo 2 */}
            <View style={styles.matchMainContent}>
                {/* Equipo 1 - Izquierda */}
                <View style={styles.teamColumn}>
                    <Image
                        source={{ uri: match.equipo_1?.logo || 'https://via.placeholder.com/35' }}
                        style={styles.teamLogo}
                    />
                    <Text style={styles.teamName} numberOfLines={2}>
                        {match.equipo_1?.nombre || 'Equipo 1'}
                    </Text>
                    {match.equipo_1?.grupo && (
                        <Text style={styles.teamGroup}>Grupo {match.equipo_1.grupo}</Text>
                    )}
                </View>

                {/* Marcador Central */}
                <View style={styles.scoreContainer}>
                    {match.resultado ? (
                        <>
                            <Text style={[
                                styles.scoreNumber,
                                team1Won && styles.scoreWinner,
                                !team1Won && team2Won && styles.scoreLoser
                            ]}>
                                {team1Score}
                            </Text>
                            <Text style={styles.scoreSeparator}>-</Text>
                            <Text style={[
                                styles.scoreNumber,
                                team2Won && styles.scoreWinner,
                                !team2Won && team1Won && styles.scoreLoser
                            ]}>
                                {team2Score}
                            </Text>
                        </>
                    ) : (
                        <Text style={styles.vsText}>vs</Text>
                    )}
                </View>

                {/* Equipo 2 - Derecha */}
                <View style={styles.teamColumn}>
                    <Image
                        source={{ uri: match.equipo_2?.logo || 'https://via.placeholder.com/35' }}
                        style={styles.teamLogo}
                    />
                    <Text style={styles.teamName} numberOfLines={2}>
                        {match.equipo_2?.nombre || 'Equipo 2'}
                    </Text>
                    {match.equipo_2?.grupo && (
                        <Text style={styles.teamGroup}>Grupo {match.equipo_2.grupo}</Text>
                    )}
                </View>
            </View>

            {/* Sets en Cuadritos Horizontales */}
            {match.resultado && (
                <View style={styles.setsContainer}>
                    <View style={styles.setBox}>
                        <Text style={styles.setLabel}>Set 1</Text>
                        <Text style={styles.setScore}>
                            {match.resultado.set_1_equipo_1} - {match.resultado.set_1_equipo_2}
                        </Text>
                    </View>
                    <View style={styles.setBox}>
                        <Text style={styles.setLabel}>Set 2</Text>
                        <Text style={styles.setScore}>
                            {match.resultado.set_2_equipo_1} - {match.resultado.set_2_equipo_2}
                        </Text>
                    </View>
                    {match.resultado.set_3_equipo_1 !== undefined && (
                        <View style={styles.setBox}>
                            <Text style={styles.setLabel}>Set 3</Text>
                            <Text style={styles.setScore}>
                                {match.resultado.set_3_equipo_1} - {match.resultado.set_3_equipo_2}
                            </Text>
                        </View>
                    )}
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    matchCard: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.sm + 2,
        marginBottom: theme.spacing.sm + 2,
        ...theme.getCardShadow('sm'),
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.sm,
    },
    matchDate: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.medium,
    },
    matchStatus: {
        paddingHorizontal: theme.spacing.sm + 2,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.xl,
    },
    matchStatusText: {
        fontSize: theme.typography.fontSize.xs + 1,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
    },
    // Layout Principal de 3 Columnas
    matchMainContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: theme.spacing.sm,
    },
    teamColumn: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: theme.spacing.xs,
    },
    teamLogo: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        marginBottom: theme.spacing.xs,
    },
    teamName: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        marginBottom: 2,
    },
    teamGroup: {
        fontSize: theme.typography.fontSize.xs + 1,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    // Contenedor de Marcador Central
    scoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: theme.spacing.sm,
        gap: theme.spacing.xs,
    },
    scoreNumber: {
        fontSize: theme.typography.fontSize.huge + 4,
        fontWeight: theme.typography.fontWeight.extrabold,
        color: theme.colors.textPrimary,
    },
    scoreWinner: {
        color: '#16a34a', // Verde para ganador
    },
    scoreLoser: {
        color: theme.colors.textTertiary, // Gris para perdedor
    },
    scoreSeparator: {
        fontSize: theme.typography.fontSize.huge,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textTertiary,
        marginHorizontal: theme.spacing.xs - 2,
    },
    vsText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textTertiary,
        fontWeight: theme.typography.fontWeight.semibold,
        textAlign: 'center',
        marginVertical: 2,
    },
    // Sets en Cuadritos Horizontales
    setsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: theme.spacing.xs + 2,
        marginTop: theme.spacing.sm,
        flexWrap: 'wrap',
    },
    setBox: {
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        paddingVertical: theme.spacing.xs,
        paddingHorizontal: theme.spacing.sm,
        minWidth: 85,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.gray100,
    },
    setLabel: {
        fontSize: theme.typography.fontSize.xs + 1,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textSecondary,
        marginBottom: 2,
    },
    setScore: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
    },
});

export default MatchCard;