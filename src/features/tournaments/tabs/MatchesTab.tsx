// src/features/tournaments/tabs/MatchesTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Match } from '../../../types/tournament';
import { MatchCard } from '../../matches/components';
import { LoadingSpinner, EmptyState, Select, SelectOption } from '../../../shared/components';
import { theme } from '../../../shared/theme';
import TournamentService from '../../../services/api';

interface MatchesTabProps {
    tournamentId: number;
}

const MatchesTab: React.FC<MatchesTabProps> = ({ tournamentId }) => {
    const [matches, setMatches] = useState<Match[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

    useEffect(() => {
        loadMatches();
    }, []);

    const loadMatches = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentMatches(tournamentId);
            setMatches(data);
        } catch (error) {
            console.error('Error loading matches:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando partidos..." />;
    }

    // Obtener grupos únicos de los partidos (del equipo_1)
    const groups = Array.from(
        new Set(matches.map(match => match.equipo_1?.grupo).filter(Boolean))
    ).sort() as string[];

    // Función auxiliar para obtener el grupo de un partido
    const getMatchGroup = (match: Match): string | null => {
        return match.equipo_1?.grupo || match.equipo_2?.grupo || null;
    };

    // Función para verificar si un partido es hoy
    const isToday = (dateString: string) => {
        const matchDate = new Date(dateString);
        const today = new Date();
        return matchDate.toDateString() === today.toDateString();
    };

    // Filtrar partidos según la selección
    const getFilteredMatches = () => {
        if (selectedFilter === 'today') {
            return matches.filter(match => isToday(match.fecha));
        } else if (selectedFilter) {
            return matches.filter(match => getMatchGroup(match) === selectedFilter);
        }
        return matches;
    };

    const filteredMatches = getFilteredMatches();

    // Agrupar partidos por grupo
    const matchesByGroup = matches.reduce((acc, match) => {
        const group = getMatchGroup(match) || 'Sin Grupo';
        if (!acc[group]) {
            acc[group] = [];
        }
        acc[group].push(match);
        return acc;
    }, {} as Record<string, Match[]>);

    // Opciones para el selector
    const getFilterOptions = (): SelectOption[] => {
        const todayMatches = matches.filter(match => isToday(match.fecha));

        const options: SelectOption[] = [
            {
                label: `Todos los partidos (${matches.length})`,
                value: null,
                count: matches.length,
            },
        ];

        // Agregar opción de "Partidos de Hoy" si hay partidos hoy
        if (todayMatches.length > 0) {
            options.push({
                label: `🔴 Partidos de Hoy`,
                value: 'today',
                count: todayMatches.length,
            });
        }

        // Agregar grupos
        groups.forEach((group) => {
            const count = matches.filter(m => getMatchGroup(m) === group).length;
            options.push({
                label: `${group}`,
                value: group,
                count,
            });
        });

        return options;
    };

    const renderMatchesList = () => {
        if (filteredMatches.length === 0) {
            const emptyMessage = selectedFilter === 'today'
                ? 'No hay partidos programados para hoy'
                : selectedFilter
                    ? 'No hay partidos en este grupo'
                    : 'No hay partidos disponibles';

            return (
                <EmptyState
                    message={emptyMessage}
                    subtitle={selectedFilter ? 'Selecciona otro filtro' : 'Los partidos aparecerán aquí cuando estén programados'}
                />
            );
        }

        // Si hay un filtro activo, mostrar lista simple
        if (selectedFilter) {
            return (
                <>
                    <Text style={styles.groupHeader}>
                        {selectedFilter === 'today' ? '🔴 Partidos de Hoy' : `${selectedFilter}`} - {filteredMatches.length} {filteredMatches.length === 1 ? 'partido' : 'partidos'}
                    </Text>
                    {filteredMatches.map((match: Match, index: number) => (
                        <MatchCard
                            key={match.id || index}
                            match={match}
                            onPress={() => {
                                console.log('Partido seleccionado:', match.id);
                            }}
                        />
                    ))}
                </>
            );
        }

        // Si no hay filtro, mostrar agrupado por grupo
        return (
            <>
                {Object.entries(matchesByGroup).map(([group, groupMatches]) => (
                    <View key={group} style={styles.groupSection}>
                        <View style={styles.groupHeaderContainer}>
                            <Text style={styles.groupHeader}>
                                {group === 'Sin Grupo' ? group : `${group}`}
                            </Text>
                            <View style={styles.groupBadge}>
                                <Text style={styles.groupBadgeText}>
                                    {groupMatches.length}
                                </Text>
                            </View>
                        </View>
                        {groupMatches.map((match: Match, index: number) => (
                            <MatchCard
                                key={match.id || index}
                                match={match}
                                onPress={() => {
                                    console.log('Partido seleccionado:', match.id);
                                }}
                            />
                        ))}
                    </View>
                ))}
            </>
        );
    };

    if (matches.length === 0) {
        return (
            <View style={styles.tabContent}>
                <EmptyState
                    message="No hay partidos disponibles"
                    subtitle="Los partidos aparecerán aquí cuando estén programados"
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header fijo con título y filtros */}
            <View style={styles.fixedHeader}>
                <Text style={styles.sectionTitle}>
                    Partidos del Torneo ({matches.length})
                </Text>

                <Select
                    options={getFilterOptions()}
                    value={selectedFilter}
                    onChange={setSelectedFilter}
                    placeholder="Seleccionar filtro"
                    label="Filtrar partidos"
                />
            </View>

            {/* Contenido scrolleable */}
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {renderMatchesList()}
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

export default MatchesTab;
