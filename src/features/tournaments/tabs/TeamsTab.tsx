// src/features/tournaments/tabs/TeamsTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TeamCard } from '../../teams/components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';
import { useTeams } from '../../../shared/hooks';
import { theme } from '../../../shared/theme';

interface TeamsTabProps {
    tournamentId: number;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tournamentId }) => {
    const { teams, loading } = useTeams({ tournamentId });

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
        padding: theme.spacing.base,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
    },
});

export default TeamsTab;
