// src/features/tournaments/tabs/TeamsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Team } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TeamCard } from '../../teams/components';
import { LoadingSpinner, EmptyState, Select, SelectOption } from '../../../shared/components';
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

    const getGroupOptions = (): SelectOption[] => {
        if (groups.length === 0) return [];

        const options: SelectOption[] = [
            {
                label: `Todos los grupos (${teams.length})`,
                value: null,
                count: teams.length,
            },
        ];

        groups.forEach((group) => {
            const count = teams.filter(t => t.grupo === group).length;
            options.push({
                label: `Grupo ${group}`,
                value: group,
                count,
            });
        });

        return options;
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
                <>
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
                </>
            );
        }

        // Si no hay filtro, mostrar agrupado
        return (
            <>
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
            </>
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
        <View style={styles.container}>
            {/* Header fijo con título y filtros */}
            <View style={styles.fixedHeader}>
                <Text style={styles.sectionTitle}>
                    Equipos Participantes ({teams.length})
                </Text>

                {groups.length > 0 && (
                    <Select
                        options={getGroupOptions()}
                        value={selectedGroup}
                        onChange={setSelectedGroup}
                        placeholder="Seleccionar grupo"
                        label="Filtrar por grupo"
                    />
                )}
            </View>

            {/* Contenido scrolleable */}
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {renderTeamsList()}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    fixedHeader: {
        backgroundColor: theme.colors.background,
        paddingHorizontal: theme.spacing.base,
        paddingTop: theme.spacing.base,
        paddingBottom: theme.spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.getCardShadow('sm'),
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: theme.spacing.base,
    },
    tabContent: {
        padding: theme.spacing.base,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
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
        marginBottom: theme.spacing.md,
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
