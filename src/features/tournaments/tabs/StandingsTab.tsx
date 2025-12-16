// src/features/tournaments/tabs/StandingsTab.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Select, SelectOption, LoadingSpinner } from '../../../shared/components';
import { theme } from '../../../shared/theme';
import TournamentService from '../../../services/api';
import { StandingsResponse, TeamStanding, StandingsGroup, PlayoffResponse } from '../../../types/tournament';
import { PlayoffBracket } from '../components/PlayoffBracket';

interface Props {
    tournamentId: number;
}

const StandingsTab: React.FC<Props> = ({ tournamentId }) => {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'standings' | 'playoffs'>('standings');
    const [standingsData, setStandingsData] = useState<StandingsResponse | null>(null);
    const [playoffData, setPlayoffData] = useState<PlayoffResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [playoffLoading, setPlayoffLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [playoffError, setPlayoffError] = useState<string | null>(null);

    useEffect(() => {
        loadStandings();
    }, [tournamentId]);

    useEffect(() => {
        if (activeView === 'playoffs' && !playoffData) {
            loadPlayoffs();
        }
    }, [activeView, tournamentId]);

    const loadStandings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await TournamentService.getTournamentStandings(tournamentId);
            setStandingsData(data);
        } catch (err) {
            console.error('Error loading standings:', err);
            setError('Error al cargar las posiciones');
        } finally {
            setLoading(false);
        }
    };

    const loadPlayoffs = async () => {
        try {
            setPlayoffLoading(true);
            setPlayoffError(null);
            const data = await TournamentService.getTournamentPlayoffs(tournamentId);
            setPlayoffData(data);
        } catch (err) {
            console.error('Error loading playoffs:', err);
            setPlayoffError('Error al cargar los playoffs');
        } finally {
            setPlayoffLoading(false);
        }
    };

    if (loading) {
        return <LoadingSpinner message="Cargando tabla de posiciones..." />;
    }

    if (error || !standingsData) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error || 'No hay datos disponibles'}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={loadStandings}>
                    <Text style={styles.retryButtonText}>Reintentar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // Obtener grupos únicos
    const groups = standingsData.posiciones.map(p => p.grupo).sort();

    // Consolidar equipos por grupo (el backend puede enviar el mismo grupo en múltiples objetos)
    const consolidatedGroups = standingsData.posiciones.reduce((acc, positionGroup) => {
        const existingGroup = acc.find(g => g.grupo === positionGroup.grupo);
        if (existingGroup) {
            // Si el grupo ya existe, agregar los equipos nuevos
            existingGroup.equipos.push(...positionGroup.equipos);
        } else {
            // Si no existe, crear nuevo grupo
            acc.push({
                grupo: positionGroup.grupo,
                equipos: [...positionGroup.equipos]
            });
        }
        return acc;
    }, [] as StandingsGroup[]);

    // Ordenar y calcular posiciones dentro de cada grupo
    consolidatedGroups.forEach(group => {
        // Ordenar equipos por criterios de desempate
        group.equipos.sort((a, b) => {
            const statsA = a.estadisticas;
            const statsB = b.estadisticas;

            // 1. Por puntos (descendente)
            if (statsB.puntos !== statsA.puntos) {
                return statsB.puntos - statsA.puntos;
            }

            // 2. Por diferencia de sets (descendente)
            if (statsB.diferencia_sets !== statsA.diferencia_sets) {
                return statsB.diferencia_sets - statsA.diferencia_sets;
            }

            // 3. Por sets a favor (descendente)
            if (statsB.sets_favor !== statsA.sets_favor) {
                return statsB.sets_favor - statsA.sets_favor;
            }

            // 4. Por diferencia de tantos (descendente)
            if (statsB.diferencia_tantos !== statsA.diferencia_tantos) {
                return statsB.diferencia_tantos - statsA.diferencia_tantos;
            }

            // 5. Por tantos a favor (descendente)
            return statsB.tantos_favor - statsA.tantos_favor;
        });

        // Asignar posiciones después de ordenar
        group.equipos.forEach((equipo, index) => {
            equipo.posicion = index + 1;
        });
    });

    // Ordenar grupos alfabéticamente
    consolidatedGroups.sort((a, b) => a.grupo.localeCompare(b.grupo));

    // Filtrar posiciones por grupo
    const getFilteredPositions = () => {
        if (selectedGroup) {
            return consolidatedGroups.filter(p => p.grupo === selectedGroup);
        }
        return consolidatedGroups;
    };

    const filteredPositions = getFilteredPositions();

    // Opciones para el selector
    const getGroupOptions = (): SelectOption[] => {
        const totalEquipos = consolidatedGroups.reduce((sum, p) => sum + p.equipos.length, 0);
        const options: SelectOption[] = [
            {
                label: 'Todos los grupos',
                value: null,
                count: totalEquipos,
            },
        ];

        consolidatedGroups.forEach((groupData) => {
            options.push({
                label: groupData.grupo,
                value: groupData.grupo,
                count: groupData.equipos.length,
            });
        });

        return options;
    };

    const renderStandings = () => {
        const renderGroupTable = (groupData: { grupo: string; equipos: TeamStanding[] }) => (
            <View key={groupData.grupo} style={styles.tableContainer}>
                <Text style={styles.groupTitle}>{groupData.grupo}</Text>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={true}
                    style={styles.horizontalScroll}
                >
                    <View>
                        {/* Header */}
                        <View style={styles.tableHeaderRow}>
                            <Text style={[styles.headerCell, styles.posHeader]}>Pos</Text>
                            <Text style={[styles.headerCell, styles.teamHeader]}>Equipo</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>PJ</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>PG</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>PP</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>SF</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>SC</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>Dif S</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>TF</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>TC</Text>
                            <Text style={[styles.headerCell, styles.statHeader]}>Dif T</Text>
                            <Text style={[styles.headerCell, styles.ptsHeader]}>Pts</Text>
                        </View>

                        {/* Filas */}
                        {groupData.equipos.map((standing, index) => {
                            const stats = standing.estadisticas;
                            return (
                                <View
                                    key={standing.equipo.id}
                                    style={[
                                        styles.tableDataRow,
                                        index % 2 === 0 && styles.tableRowEven,
                                        standing.posicion <= 4 && styles.tableRowQualified,
                                    ]}
                                >
                                    <Text style={[styles.dataCell, styles.posData]}>{standing.posicion}</Text>

                                    {/* Equipo con logo */}
                                    <View style={[styles.dataCell, styles.teamData]}>
                                        {standing.equipo.logo ? (
                                            <Image
                                                source={{ uri: standing.equipo.logo }}
                                                style={styles.teamLogo}
                                                resizeMode="contain"
                                            />
                                        ) : null}
                                        <Text
                                            style={styles.teamName}
                                            numberOfLines={1}
                                            ellipsizeMode="tail"
                                        >
                                            {standing.equipo.nombre}
                                        </Text>
                                    </View>

                                    <Text style={[styles.dataCell, styles.statData]}>{stats.partidos_jugados}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.partidos_ganados}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.partidos_perdidos}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.sets_favor}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.sets_contra}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.diferencia_sets}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.tantos_favor}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.tantos_contra}</Text>
                                    <Text style={[styles.dataCell, styles.statData]}>{stats.diferencia_tantos}</Text>
                                    <Text style={[styles.dataCell, styles.ptsData]}>{stats.puntos}</Text>
                                </View>
                            );
                        })}
                    </View>
                </ScrollView>
            </View>
        );

        // Renderizar según filtro
        return filteredPositions.map((groupData) => renderGroupTable(groupData));
    };

    return (
        <View style={styles.container}>
            {/* Header fijo */}
            <View style={styles.fixedHeader}>
                {/* Toggle entre Tabla de Posiciones y Playoffs */}
                <View style={styles.viewToggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.viewToggleButton,
                            styles.viewToggleButtonLeft,
                            activeView === 'standings' && styles.viewToggleButtonActive,
                        ]}
                        onPress={() => setActiveView('standings')}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.viewToggleText,
                            activeView === 'standings' && styles.viewToggleTextActive,
                        ]}>
                            Tabla de Posiciones
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.viewToggleButton,
                            styles.viewToggleButtonRight,
                            activeView === 'playoffs' && styles.viewToggleButtonActive,
                        ]}
                        onPress={() => setActiveView('playoffs')}
                        activeOpacity={0.7}
                    >
                        <Text style={[
                            styles.viewToggleText,
                            activeView === 'playoffs' && styles.viewToggleTextActive,
                        ]}>
                            🏆 Playoffs
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Filtro de grupos - Solo visible en vista de Tabla de Posiciones */}
                {activeView === 'standings' && (
                    <Select
                        options={getGroupOptions()}
                        value={selectedGroup}
                        onChange={setSelectedGroup}
                        placeholder="Seleccionar grupo"
                        label="Filtrar por grupo"
                    />
                )}
            </View>

            {/* Contenido */}
            {activeView === 'standings' ? (
                // Vista de Tabla de Posiciones con ScrollView
                <ScrollView
                    style={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContentContainer}
                >
                    {renderStandings()}

                    {/* Leyenda */}
                    <View style={styles.legend}>
                        <Text style={styles.legendTitle}>Leyenda:</Text>
                        <View style={styles.legendRow}>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, styles.qualifiedColor]} />
                                <Text style={styles.legendText}>Clasifican a Playoffs (Top 4)</Text>
                            </View>
                            <View style={styles.legendItem}>
                                <View style={[styles.legendColor, styles.notQualifiedColor]} />
                                <Text style={styles.legendText}>Fuera de clasificación</Text>
                            </View>
                        </View>
                        <Text style={styles.legendNote}>
                            PJ: Partidos Jugados | PG: Ganados | PP: Perdidos | SF: Sets Favor | SC: Sets Contra | Dif S: Diferencia Sets{'\n'}
                            TF: Tantos Favor | TC: Tantos Contra | Dif T: Diferencia Tantos | Pts: Puntos
                        </Text>
                        <Text style={styles.legendHint}>
                            💡 Desliza horizontalmente para ver todas las estadísticas
                        </Text>
                    </View>
                </ScrollView>
            ) : (
                // Vista de Playoffs SIN ScrollView adicional (usa los propios del PlayoffBracket)
                <View style={styles.playoffContent}>
                    {playoffLoading ? (
                        <LoadingSpinner message="Cargando playoffs..." />
                    ) : playoffError ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{playoffError}</Text>
                            <TouchableOpacity style={styles.retryButton} onPress={loadPlayoffs}>
                                <Text style={styles.retryButtonText}>Reintentar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : playoffData && playoffData.fases.length > 0 ? (
                        <PlayoffBracket phases={playoffData.fases} />
                    ) : (
                        <View style={styles.comingSoonContainer}>
                            <Text style={styles.comingSoonIcon}>🏆</Text>
                            <Text style={styles.comingSoonTitle}>Playoffs</Text>
                            <Text style={styles.comingSoonText}>
                                No hay información de playoffs disponible para este torneo
                            </Text>
                        </View>
                    )}
                </View>
            )}
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
    viewToggleContainer: {
        flexDirection: 'row',
        marginBottom: theme.spacing.base,
        borderRadius: theme.borderRadius.lg,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        overflow: 'hidden',
    },
    viewToggleButton: {
        flex: 1,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.background,
    },
    viewToggleButtonLeft: {
        borderRightWidth: 1,
        borderRightColor: theme.colors.primary,
    },
    viewToggleButtonRight: {
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.primary,
    },
    viewToggleButtonActive: {
        backgroundColor: theme.colors.primary,
    },
    viewToggleText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.primary,
    },
    viewToggleTextActive: {
        color: theme.colors.textInverse,
    },
    scrollContent: {
        flex: 1,
    },
    scrollContentContainer: {
        padding: theme.spacing.base,
    },
    playoffContent: {
        flex: 1,
    },
    tableContainer: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        marginBottom: theme.spacing.lg,
        overflow: 'hidden',
        ...theme.getCardShadow('md'),
    },
    groupTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
        backgroundColor: theme.colors.primary,
        padding: theme.spacing.md,
    },
    horizontalScroll: {
        width: '100%',
    },
    tableHeaderRow: {
        flexDirection: 'row',
        backgroundColor: theme.colors.gray100,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
        minHeight: 44,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.primary,
    },
    tableDataRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        minHeight: 52,
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.error,
    },
    tableRowEven: {
        backgroundColor: theme.colors.gray50,
    },
    tableRowQualified: {
        borderLeftColor: theme.colors.success,
    },
    headerCell: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        paddingVertical: theme.spacing.sm + 2,
    },
    dataCell: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textPrimary,
        textAlign: 'center',
        paddingVertical: theme.spacing.md,
    },
    posHeader: {
        width: 48,
    },
    teamHeader: {
        width: 160,
        textAlign: 'left',
        paddingLeft: theme.spacing.sm,
        overflow: 'hidden',
    },
    statHeader: {
        width: 52,
    },
    ptsHeader: {
        width: 70,
        backgroundColor: theme.colors.success + '15',
    },
    posData: {
        width: 48,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        fontSize: theme.typography.fontSize.base,
    },
    teamData: {
        width: 160,
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: theme.spacing.sm,
        overflow: 'hidden',
    },
    teamLogo: {
        width: 24,
        height: 24,
        marginRight: theme.spacing.xs,
        borderRadius: theme.borderRadius.sm,
    },
    teamName: {
        flex: 1,
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.semibold,
    },
    statData: {
        width: 52,
    },
    ptsData: {
        width: 70,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.success,
        fontSize: theme.typography.fontSize.base,
        backgroundColor: theme.colors.success + '15',
    },
    legend: {
        marginTop: theme.spacing.lg,
        padding: theme.spacing.base,
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        ...theme.getCardShadow('sm'),
    },
    legendTitle: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    legendRow: {
        marginBottom: theme.spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: theme.spacing.xs,
    },
    legendColor: {
        width: 20,
        height: 20,
        borderRadius: theme.borderRadius.sm,
        marginRight: theme.spacing.sm,
    },
    qualifiedColor: {
        backgroundColor: theme.colors.success,
    },
    notQualifiedColor: {
        backgroundColor: theme.colors.error,
    },
    legendText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    legendNote: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.textTertiary,
        fontStyle: 'italic',
        marginTop: theme.spacing.xs,
        lineHeight: 16,
    },
    legendHint: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.semibold,
        marginTop: theme.spacing.sm,
        textAlign: 'center',
    },
    comingSoonContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: theme.spacing.xl * 2,
        paddingHorizontal: theme.spacing.lg,
    },
    comingSoonIcon: {
        fontSize: 64,
        marginBottom: theme.spacing.lg,
    },
    comingSoonTitle: {
        fontSize: theme.typography.fontSize.xl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.sm,
    },
    comingSoonText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textSecondary,
        textAlign: 'center',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: theme.spacing.lg,
    },
    errorText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.error,
        textAlign: 'center',
        marginBottom: theme.spacing.md,
    },
    retryButton: {
        backgroundColor: theme.colors.primary,
        paddingVertical: theme.spacing.sm,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.md,
    },
    retryButtonText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textInverse,
    },
});

export default StandingsTab;
