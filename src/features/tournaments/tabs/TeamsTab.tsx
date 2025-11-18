// src/features/tournaments/tabs/TeamsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Team } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TeamCard } from '../../teams/components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';

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
        return <LoadingSpinner message="Cargando equipos..." />;
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
                <EmptyState
                    message="No hay equipos registrados"
                    subtitle="Los equipos aparecerán aquí cuando se registren"
                />
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
});

export default TeamsTab;
