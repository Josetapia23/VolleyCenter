// src/features/tournaments/tabs/TeamsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Team } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TeamCard } from '../../teams/components';

interface TeamsTabProps {
    tournamentId: number;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tournamentId }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentTeams(tournamentId);
            setTeams(data);
        } catch (error) {
            console.error('Error loading teams:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a237e" />
                <Text style={styles.loadingText}>Cargando equipos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
                Equipos Participantes ({teams.length})
            </Text>

            {teams.length > 0 ? (
                teams.map((team) => (
                    <TeamCard
                        key={team.id}
                        team={team}
                        onPress={() => {
                            // TODO: Navegar al detalle del equipo
                            console.log('Equipo seleccionado:', team.nombre);
                        }}
                    />
                ))
            ) : (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No hay equipos registrados</Text>
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

export default TeamsTab;