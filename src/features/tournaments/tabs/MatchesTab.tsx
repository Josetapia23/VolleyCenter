// src/features/tournaments/tabs/MatchesTab.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { TournamentDetail } from '../../../types/tournament';
import { MatchCard } from '../../matches/components';

interface MatchesTabProps {
    tournamentDetail: TournamentDetail | null;
    loading: boolean;
}

const MatchesTab: React.FC<MatchesTabProps> = ({ tournamentDetail, loading }) => {
    if (loading || !tournamentDetail) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a237e" />
                <Text style={styles.loadingText}>Cargando partidos...</Text>
            </View>
        );
    }

    const matches = tournamentDetail.partidos || [];

    return (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
                Partidos ({matches.length} total)
            </Text>

            {matches.length > 0 ? (
                matches.map((match: any, index: number) => (
                    <MatchCard
                        key={index}
                        match={match}
                        onPress={() => {
                            // TODO: Navegar al detalle del partido
                            console.log('Partido seleccionado:', match.id);
                        }}
                    />
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay partidos disponibles</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    emptyContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default MatchesTab;