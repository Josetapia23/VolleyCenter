// src/features/tournaments/tabs/TeamsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Team } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TeamCard } from '../../teams/components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';
import { theme } from '../../../shared/theme';

interface TeamsTabProps {
    tournamentId: number;
}

const TeamsTab: React.FC<TeamsTabProps> = ({ tournamentId }) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [groups, setGroups] = useState<string[]>([]);

    useEffect(() => {
        loadTeams();
    }, []);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentTeams(tournamentId);
            setTeams(data);

            // Extraer grupos únicos
            const uniqueGroups = Array.from(
                new Set(data.map(team => team.grupo).filter(Boolean))
            ).sort() as string[];

            setGroups(uniqueGroups);
        } catch (error) {
            console.error('Error loading teams:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando equipos..." />;
    }

    // Filtrar equipos por grupo seleccionado
    const filteredTeams = selectedGroup
        ? teams.filter(team => team.grupo === selectedGroup)
        : teams;

    // Agrupar equipos por grupo
    const teamsByGroup = teams.reduce((acc, team) => {
        const group = team.grupo || 'Sin Grupo';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(team);
        return acc;
    }, {} as Record<string, Team[]>);

    const renderGroupFilter = () => {
        if (groups.length === 0) return null;

        return (
            <View style={styles.filterContainer}>
                <Text style={styles.filterLabel}>Filtrar por grupo:</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.filterChipsContainer}
                >
                    {/* Botón "Todos" */}
                    <TouchableOpacity
                        style={[
                            styles.filterChip,
                            selectedGroup === null && styles.filterChipActive
                        ]}
                        onPress={() => setSelectedGroup(null)}
                    >
                        <Text
                            style={[
                                styles.filterChipText,
                                selectedGroup === null && styles.filterChipTextActive
                            ]}
                        >
                            Todos ({teams.length})
                        </Text>
                    </TouchableOpacity>

                    {/* Botones por cada grupo */}
                    {groups.map((group) => {
                        const count = teams.filter(t => t.grupo === group).length;
                        return (
                            <TouchableOpacity
                                key={group}
                                style={[
                                    styles.filterChip,
                                    selectedGroup === group && styles.filterChipActive
                                ]}
                                onPress={() => setSelectedGroup(group)}
                            >
                                <Text
                                    style={[
                                        styles.filterChipText,
                                        selectedGroup === group && styles.filterChipTextActive
                                    ]}
                                >
                                    Grupo {group} ({count})
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>
        );
    };

    const renderTeamsList = () => {
        if (filteredTeams.length === 0) {
            return (
                <EmptyState
                    message="No hay equipos en este grupo"
                    subtitle="Selecciona otro grupo para ver equipos"
                />
            );
        }

        // Si hay un filtro activo, mostrar lista simple
        if (selectedGroup) {
            return (
                <View>
                    <Text style={styles.groupHeader}>
                        Grupo {selectedGroup} - {filteredTeams.length} {filteredTeams.length === 1 ? 'equipo' : 'equipos'}
                    </Text>
                    {filteredTeams.map((team) => (
                        <TeamCard
                            key={team.id}
                            team={team}
                            onPress={() => {
                                console.log('Equipo seleccionado:', team.nombre);
                            }}
                        />
                    ))}
                </View>
            );
        }

        // Si no hay filtro, mostrar agrupado
        return (
            <View>
                {Object.entries(teamsByGroup).map(([group, groupTeams]) => (
                    <View key={group} style={styles.groupSection}>
                        <View style={styles.groupHeaderContainer}>
                            <Text style={styles.groupHeader}>
                                {group === 'Sin Grupo' ? group : `Grupo ${group}`}
                            </Text>
                            <View style={styles.groupBadge}>
                                <Text style={styles.groupBadgeText}>
                                    {groupTeams.length}
                                </Text>
                            </View>
                        </View>
                        {groupTeams.map((team) => (
                            <TeamCard
                                key={team.id}
                                team={team}
                                onPress={() => {
                                    console.log('Equipo seleccionado:', team.nombre);
                                }}
                            />
                        ))}
                    </View>
                ))}
            </View>
        );
    };

    if (teams.length === 0) {
        return (
            <View style={styles.tabContent}>
                <EmptyState
                    message="No hay equipos registrados"
                    subtitle="Los equipos aparecerán aquí cuando se registren"
                />
            </View>
        );
    }

    return (
        <View style={styles.tabContent}>
            <Text style={styles.sectionTitle}>
                Equipos Participantes ({teams.length})
            </Text>

            {renderGroupFilter()}
            {renderTeamsList()}
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
    filterContainer: {
        marginBottom: theme.spacing.base,
    },
    filterLabel: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    filterChipsContainer: {
        paddingRight: theme.spacing.base,
    },
    filterChip: {
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.sm,
        borderRadius: theme.borderRadius.round,
        backgroundColor: theme.colors.gray100,
        marginRight: theme.spacing.sm,
        borderWidth: 2,
        borderColor: theme.colors.gray200,
    },
    filterChipActive: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
    },
    filterChipText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textSecondary,
    },
    filterChipTextActive: {
        color: theme.colors.textInverse,
    },
    groupSection: {
        marginBottom: theme.spacing.lg,
    },
    groupHeaderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    groupHeader: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
    },
    groupBadge: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        minWidth: 32,
        alignItems: 'center',
    },
    groupBadgeText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
    },
});

export default TeamsTab;
