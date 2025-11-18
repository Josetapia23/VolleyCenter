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

            {/* Equipo 1 */}
            <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                    <Image
                        source={{ uri: match.equipo_1?.logo || 'https://via.placeholder.com/50' }}
                        style={styles.teamLogo}
                    />
                    <View style={styles.teamDetails}>
                        <Text style={styles.teamName}>{match.equipo_1?.nombre || 'Equipo 1'}</Text>
                        {match.equipo_1?.grupo && <Text style={styles.teamGroup}>Grupo {match.equipo_1.grupo}</Text>}
                    </View>
                </View>
                {match.resultado && (
                    <Text style={styles.teamScore}>{match.resultado.sets_equipo_1}</Text>
                )}
            </View>

            {/* VS */}
            <Text style={styles.vsText}>vs</Text>

            {/* Equipo 2 */}
            <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                    <Image
                        source={{ uri: match.equipo_2?.logo || 'https://via.placeholder.com/50' }}
                        style={styles.teamLogo}
                    />
                    <View style={styles.teamDetails}>
                        <Text style={styles.teamName}>{match.equipo_2?.nombre || 'Equipo 2'}</Text>
                        {match.equipo_2?.grupo && <Text style={styles.teamGroup}>Grupo {match.equipo_2.grupo}</Text>}
                    </View>
                </View>
                {match.resultado && (
                    <Text style={styles.teamScore}>{match.resultado.sets_equipo_2}</Text>
                )}
            </View>

            {/* Resultado por Sets */}
            {match.resultado && (
                <View style={styles.setsResultContainer}>
                    <Text style={styles.setsResultTitle}>Resultado por sets:</Text>
                    <View style={styles.setsRow}>
                        <Text style={styles.setResult}>
                            Set 1: {match.resultado.set_1_equipo_1} - {match.resultado.set_1_equipo_2}
                        </Text>
                        <Text style={styles.setResult}>
                            Set 2: {match.resultado.set_2_equipo_1} - {match.resultado.set_2_equipo_2}
                        </Text>
                    </View>
                    {match.resultado.set_3_equipo_1 !== undefined && (
                        <Text style={styles.setResult}>
                            Set 3: {match.resultado.set_3_equipo_1} - {match.resultado.set_3_equipo_2}
                        </Text>
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
        padding: theme.spacing.base,
        marginBottom: theme.spacing.base,
        ...theme.getCardShadow('md'),
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing.base,
    },
    matchDate: {
        fontSize: theme.typography.fontSize.sm + 1,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.medium,
    },
    matchStatus: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.xs + 2,
        borderRadius: theme.borderRadius.xl,
    },
    matchStatusText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: theme.spacing.sm,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    teamLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: theme.spacing.md,
    },
    teamDetails: {
        flex: 1,
    },
    teamName: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: 2,
    },
    teamGroup: {
        fontSize: theme.typography.fontSize.sm + 1,
        color: theme.colors.textSecondary,
    },
    teamScore: {
        fontSize: theme.typography.fontSize.huge,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginLeft: theme.spacing.base,
    },
    vsText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textTertiary,
        fontWeight: theme.typography.fontWeight.bold,
        textAlign: 'center',
        marginVertical: theme.spacing.xs,
    },
    setsResultContainer: {
        backgroundColor: theme.colors.gray50,
        borderRadius: theme.borderRadius.md,
        padding: theme.spacing.base,
        marginTop: theme.spacing.base,
    },
    setsResultTitle: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.md,
    },
    setsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: theme.spacing.sm,
    },
    setResult: {
        fontSize: theme.typography.fontSize.sm + 1,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.medium,
    },
});

export default MatchCard;