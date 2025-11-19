// src/features/tournaments/tabs/StandingsTab.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Select, SelectOption } from '../../../shared/components';
import { theme } from '../../../shared/theme';

// Datos de muestra para demostración
const MOCK_STANDINGS = [
    // Grupo A
    { pos: 1, equipo: 'ROJICA', pj: 5, pg: 5, pp: 0, sf: 15, sc: 2, pts: 15, grupo: 'Grupo A' },
    { pos: 2, equipo: 'DVA BLACK', pj: 5, pg: 4, pp: 1, sf: 13, sc: 4, pts: 12, grupo: 'Grupo A' },
    { pos: 3, equipo: 'COMFAMILIAR', pj: 5, pg: 3, pp: 2, sf: 10, sc: 8, pts: 9, grupo: 'Grupo A' },
    { pos: 4, equipo: 'ACADEVOLEY B', pj: 5, pg: 2, pp: 3, sf: 8, sc: 10, pts: 6, grupo: 'Grupo A' },
    { pos: 5, equipo: 'TAVOVOLLEY B', pj: 5, pg: 1, pp: 4, sf: 5, sc: 13, pts: 3, grupo: 'Grupo A' },
    { pos: 6, equipo: 'TEAM ALPHA', pj: 5, pg: 0, pp: 5, sf: 1, sc: 15, pts: 0, grupo: 'Grupo A' },

    // Grupo B
    { pos: 1, equipo: 'VOLLEY STARS', pj: 5, pg: 5, pp: 0, sf: 15, sc: 1, pts: 15, grupo: 'Grupo B' },
    { pos: 2, equipo: 'BEACH KINGS', pj: 5, pg: 4, pp: 1, sf: 12, sc: 5, pts: 12, grupo: 'Grupo B' },
    { pos: 3, equipo: 'NET WARRIORS', pj: 5, pg: 3, pp: 2, sf: 11, sc: 7, pts: 9, grupo: 'Grupo B' },
    { pos: 4, equipo: 'SPIKE MASTERS', pj: 5, pg: 2, pp: 3, sf: 7, sc: 11, pts: 6, grupo: 'Grupo B' },
    { pos: 5, equipo: 'COURT HEROES', pj: 5, pg: 1, pp: 4, sf: 4, sc: 13, pts: 3, grupo: 'Grupo B' },
    { pos: 6, equipo: 'TEAM BETA', pj: 5, pg: 0, pp: 5, sf: 2, sc: 15, pts: 0, grupo: 'Grupo B' },

    // Grupo C
    { pos: 1, equipo: 'POWER HITTERS', pj: 5, pg: 4, pp: 1, sf: 14, sc: 4, pts: 12, grupo: 'Grupo C' },
    { pos: 2, equipo: 'BLOCK BUSTERS', pj: 5, pg: 4, pp: 1, sf: 13, sc: 5, pts: 12, grupo: 'Grupo C' },
    { pos: 3, equipo: 'ACE SQUAD', pj: 5, pg: 3, pp: 2, sf: 10, sc: 8, pts: 9, grupo: 'Grupo C' },
    { pos: 4, equipo: 'SERVE KINGS', pj: 5, pg: 2, pp: 3, sf: 8, sc: 10, pts: 6, grupo: 'Grupo C' },
    { pos: 5, equipo: 'DIG MASTERS', pj: 5, pg: 1, pp: 4, sf: 5, sc: 12, pts: 3, grupo: 'Grupo C' },
    { pos: 6, equipo: 'TEAM GAMMA', pj: 5, pg: 1, pp: 4, sf: 4, sc: 15, pts: 3, grupo: 'Grupo C' },
];

const StandingsTab: React.FC = () => {
    const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
    const [activeView, setActiveView] = useState<'standings' | 'playoffs'>('standings');

    // Obtener grupos únicos
    const groups = Array.from(new Set(MOCK_STANDINGS.map(s => s.grupo))).sort();

    // Filtrar posiciones por grupo
    const getFilteredStandings = () => {
        if (selectedGroup) {
            return MOCK_STANDINGS.filter(s => s.grupo === selectedGroup);
        }
        return MOCK_STANDINGS;
    };

    const filteredStandings = getFilteredStandings();

    // Agrupar por grupo cuando no hay filtro
    const standingsByGroup = MOCK_STANDINGS.reduce((acc, standing) => {
        if (!acc[standing.grupo]) {
            acc[standing.grupo] = [];
        }
        acc[standing.grupo].push(standing);
        return acc;
    }, {} as Record<string, typeof MOCK_STANDINGS>);

    // Opciones para el selector
    const getGroupOptions = (): SelectOption[] => {
        const options: SelectOption[] = [
            {
                label: 'Todos los grupos',
                value: null,
                count: MOCK_STANDINGS.length,
            },
        ];

        groups.forEach((group) => {
            const count = MOCK_STANDINGS.filter(s => s.grupo === group).length;
            options.push({
                label: group,
                value: group,
                count,
            });
        });

        return options;
    };

    const renderStandings = () => {
        const renderGroupTable = (group: string, standings: typeof MOCK_STANDINGS) => (
            <View key={group} style={styles.tableContainer}>
                <Text style={styles.groupTitle}>{group}</Text>

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
                            <Text style={[styles.headerCell, styles.statHeader]}>Dif</Text>
                            <Text style={[styles.headerCell, styles.ptsHeader]}>Pts</Text>
                        </View>

                        {/* Filas */}
                        {standings.map((standing, index) => (
                            <View
                                key={standing.equipo}
                                style={[
                                    styles.tableDataRow,
                                    index % 2 === 0 && styles.tableRowEven,
                                    standing.pos <= 4 && styles.tableRowQualified,
                                ]}
                            >
                                <Text style={[styles.dataCell, styles.posData]}>{standing.pos}</Text>
                                <Text style={[styles.dataCell, styles.teamData]} numberOfLines={1} ellipsizeMode="tail">
                                    {standing.equipo}
                                </Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.pj}</Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.pg}</Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.pp}</Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.sf}</Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.sc}</Text>
                                <Text style={[styles.dataCell, styles.statData]}>{standing.sf - standing.sc}</Text>
                                <Text style={[styles.dataCell, styles.ptsData]}>{standing.pts}</Text>
                            </View>
                        ))}
                    </View>
                </ScrollView>
            </View>
        );

        if (selectedGroup) {
            // Vista filtrada por grupo
            return renderGroupTable(selectedGroup, filteredStandings);
        }

        // Vista agrupada
        return Object.entries(standingsByGroup).map(([group, standings]) =>
            renderGroupTable(group, standings)
        );
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

            {/* Tabla scrolleable */}
            <ScrollView
                style={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContentContainer}
            >
                {activeView === 'standings' ? (
                    <>
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
                        PJ: Partidos Jugados | PG: Ganados | PP: Perdidos | SF: Sets Favor | SC: Sets Contra | Dif: Diferencia de Sets | Pts: Puntos
                    </Text>
                    <Text style={styles.legendHint}>
                        💡 Desliza horizontalmente para ver todas las estadísticas
                    </Text>
                </View>
                    </>
                ) : (
                    // TODO: Vista de Playoffs - Estará lista pronto
                    <View style={styles.comingSoonContainer}>
                        <Text style={styles.comingSoonIcon}>🏆</Text>
                        <Text style={styles.comingSoonTitle}>Playoffs</Text>
                        <Text style={styles.comingSoonText}>
                            Esta sección estará disponible próximamente
                        </Text>
                    </View>
                )}
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
        width: 140,
        textAlign: 'left',
        paddingLeft: theme.spacing.sm,
        overflow: 'hidden',
    },
    statHeader: {
        width: 56,
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
        width: 140,
        textAlign: 'left',
        paddingLeft: theme.spacing.sm,
        fontWeight: theme.typography.fontWeight.semibold,
        overflow: 'hidden',
    },
    statData: {
        width: 56,
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
});

export default StandingsTab;
