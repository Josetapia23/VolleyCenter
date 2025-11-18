// src/features/tournaments/tabs/MatchesTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TournamentDetail, Match } from '../../../types/tournament';
import { MatchCard } from '../../matches/components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';
import { theme } from '../../../shared/theme';

interface MatchesTabProps {
    tournamentDetail: TournamentDetail | null;
    loading: boolean;
}

const MatchesTab: React.FC<MatchesTabProps> = ({ tournamentDetail, loading }) => {
    if (loading || !tournamentDetail) {
        return <LoadingSpinner message="Cargando partidos..." />;
    }

    const matches = tournamentDetail.partidos || [];

    return (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
                Partidos ({matches.length} total)
            </Text>

            {matches.length > 0 ? (
                matches.map((match: Match, index: number) => (
                    <MatchCard
                        key={match.id || index}
                        match={match}
                        onPress={() => {
                            // TODO: Navegar al detalle del partido
                            console.log('Partido seleccionado:', match.id);
                        }}
                    />
                ))
            ) : (
                <EmptyState
                    message="No hay partidos disponibles"
                    subtitle="Los partidos aparecerán aquí cuando estén programados"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        padding: theme.spacing.base,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
    },
});

export default MatchesTab;