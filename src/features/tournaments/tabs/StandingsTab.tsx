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

    const renderTableHeader = () => (
        <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, styles.posCell]}>Pos</Text>
            <Text style={[styles.headerCell, styles.teamCell]}>Equipo</Text>
            <Text style={[styles.headerCell, styles.statCell]}>PJ</Text>
            <Text style={[styles.headerCell, styles.statCell]}>PG</Text>
            <Text style={[styles.headerCell, styles.statCell]}>PP</Text>
            <Text style={[styles.headerCell, styles.statCell]}>SF</Text>
            <Text style={[styles.headerCell, styles.statCell]}>SC</Text>
            <Text style={[styles.headerCell, styles.ptsCell]}>Pts</Text>
        </View>
    );

    const renderTableRow = (standing: typeof MOCK_STANDINGS[0], index: number) => (
        <View
            key={`${standing.grupo}-${standing.equipo}`}
            style={[
                styles.tableRow,
                index % 2 === 0 && styles.tableRowEven,
                standing.pos <= 4 && styles.tableRowQualified, // Primeros 4 califican
            ]}
        >
            <Text style={[styles.cell, styles.posCell, styles.posNumber]}>{standing.pos}</Text>
            <Text style={[styles.cell, styles.teamCell, styles.teamName]} numberOfLines={1}>
                {standing.equipo}
            </Text>
            <Text style={[styles.cell, styles.statCell]}>{standing.pj}</Text>
            <Text style={[styles.cell, styles.statCell]}>{standing.pg}</Text>
            <Text style={[styles.cell, styles.statCell]}>{standing.pp}</Text>
            <Text style={[styles.cell, styles.statCell]}>{standing.sf}</Text>
            <Text style={[styles.cell, styles.statCell]}>{standing.sc}</Text>
            <Text style={[styles.cell, styles.ptsCell, styles.ptsNumber]}>{standing.pts}</Text>
        </View>
    );

    const renderStandings = () => {
        if (selectedGroup) {
            // Vista filtrada por grupo
            return (
                <View style={styles.tableContainer}>
                    <Text style={styles.groupTitle}>{selectedGroup}</Text>
                    {renderTableHeader()}
                    {filteredStandings.map((standing, index) => renderTableRow(standing, index))}
                </View>
            );
        }

        // Vista agrupada
        return Object.entries(standingsByGroup).map(([group, standings]) => (
            <View key={group} style={styles.tableContainer}>
                <Text style={styles.groupTitle}>{group}</Text>
                {renderTableHeader()}
                {standings.map((standing, index) => renderTableRow(standing, index))}
            </View>
        ));
    };

    return (
        <View style={styles.container}>
            {/* Header fijo */}
            <View style={styles.fixedHeader}>
                <Text style={styles.sectionTitle}>Tabla de Posiciones</Text>

                <Select
                    options={getGroupOptions()}
                    value={selectedGroup}
                    onChange={setSelectedGroup}
                    placeholder="Seleccionar grupo"
                    label="Filtrar por grupo"
                />

                {/* Botón de Playoffs (para futuro) */}
                <TouchableOpacity
                    style={styles.playoffsButton}
                    activeOpacity={0.7}
                    onPress={() => {
                        // TODO: Implementar vista de playoffs
                        console.log('Ver playoffs');
                    }}
                >
                    <Text style={styles.playoffsIcon}>🏆</Text>
                    <Text style={styles.playoffsText}>Ver Playoffs</Text>
                    <Text style={styles.playoffsArrow}>→</Text>
                </TouchableOpacity>
            </View>

            {/* Tabla scrolleable */}
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
                    </View>
                    <Text style={styles.legendNote}>
                        PJ: Partidos Jugados | PG: Ganados | PP: Perdidos | SF: Sets Favor | SC: Sets Contra | Pts: Puntos
                    </Text>
                </View>
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
    sectionTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
    },
    playoffsButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.colors.success,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.lg,
        borderRadius: theme.borderRadius.lg,
        marginTop: theme.spacing.base,
        ...theme.getCardShadow('md'),
    },
    playoffsIcon: {
        fontSize: 24,
        marginRight: theme.spacing.sm,
    },
    playoffsText: {
        fontSize: theme.typography.fontSize.base,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
        marginRight: theme.spacing.sm,
    },
    playoffsArrow: {
        fontSize: theme.typography.fontSize.lg,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
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
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: theme.colors.gray100,
        paddingVertical: theme.spacing.sm,
        borderBottomWidth: 2,
        borderBottomColor: theme.colors.primary,
    },
    headerCell: {
        fontSize: theme.typography.fontSize.xs,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    tableRowEven: {
        backgroundColor: theme.colors.gray50,
    },
    tableRowQualified: {
        borderLeftWidth: 4,
        borderLeftColor: theme.colors.success,
    },
    cell: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textPrimary,
        textAlign: 'center',
    },
    posCell: {
        width: 40,
    },
    teamCell: {
        flex: 1,
        textAlign: 'left',
        paddingHorizontal: theme.spacing.sm,
    },
    statCell: {
        width: 36,
    },
    ptsCell: {
        width: 44,
    },
    posNumber: {
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
    },
    teamName: {
        fontWeight: theme.typography.fontWeight.semibold,
    },
    ptsNumber: {
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.success,
        fontSize: theme.typography.fontSize.base,
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
    legendText: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
    },
    legendNote: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.textTertiary,
        fontStyle: 'italic',
        marginTop: theme.spacing.xs,
    },
});

export default StandingsTab;
