// src/features/tournaments/components/PlayoffBracket.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { PlayoffPhase, PlayoffMatch } from '../../../types/tournament';
import { theme } from '../../../shared/theme';

interface PlayoffBracketProps {
  phases: PlayoffPhase[];
  onMatchPress?: (match: PlayoffMatch) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ phases, onMatchPress }) => {
  // Ordenar fases por orden (ascendente: octavos, cuartos, semis, final)
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  console.log('=== PLAYOFF BRACKET V3 ===');
  console.log('Total fases:', sortedPhases.length);

  if (sortedPhases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fases eliminatorias disponibles</Text>
      </View>
    );
  }

  // Buscar la fase final
  const finalPhase = sortedPhases.find(p =>
    p.nombre.toLowerCase().includes('final') &&
    !p.nombre.toLowerCase().includes('semifinal')
  );

  // El resto de fases van en los lados
  const otherPhases = sortedPhases.filter(p => p !== finalPhase);

  console.log('Final:', finalPhase?.nombre || 'NO HAY');
  console.log('Otras fases:', otherPhases.map(p => p.nombre));

  // Dividir partidos por llave
  const splitByKey = (matches: PlayoffMatch[]) => {
    const llaves = Array.from(new Set(matches.map(m => m.llave))).sort();

    if (llaves.length === 2) {
      const left = matches.filter(m => m.llave === llaves[0]);
      const right = matches.filter(m => m.llave === llaves[1]);
      console.log(`División: ${llaves[0]}=${left.length}, ${llaves[1]}=${right.length}`);
      return { left, right };
    }

    // Fallback
    const half = Math.ceil(matches.length / 2);
    return {
      left: matches.slice(0, half),
      right: matches.slice(half),
    };
  };

  // Renderizar un partido
  const renderMatch = (match: PlayoffMatch) => {
    const isWinner1 = match.resultado?.ganador === match.equipo_1.id;
    const isWinner2 = match.resultado?.ganador === match.equipo_2.id;

    return (
      <View key={match.id_cruce} style={styles.matchCard}>
        {/* Equipo 1 */}
        <View style={[styles.teamRow, isWinner1 && styles.winnerRow]}>
          <Image source={{ uri: match.equipo_1.logo }} style={styles.teamLogo} />
          <Text style={[styles.teamName, isWinner1 && styles.winnerText]} numberOfLines={1}>
            {match.equipo_1.nombre}
          </Text>
          <View style={[styles.scoreBox, isWinner1 && styles.winnerScore]}>
            <Text style={[styles.scoreText, isWinner1 && styles.winnerScoreText]}>
              {match.resultado?.sets_equipo_1 ?? 0}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Equipo 2 */}
        <View style={[styles.teamRow, isWinner2 && styles.winnerRow]}>
          <Image source={{ uri: match.equipo_2.logo }} style={styles.teamLogo} />
          <Text style={[styles.teamName, isWinner2 && styles.winnerText]} numberOfLines={1}>
            {match.equipo_2.nombre}
          </Text>
          <View style={[styles.scoreBox, isWinner2 && styles.winnerScore]}>
            <Text style={[styles.scoreText, isWinner2 && styles.winnerScoreText]}>
              {match.resultado?.sets_equipo_2 ?? 0}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // Renderizar una columna de fase
  const renderRoundColumn = (title: string, matches: PlayoffMatch[], isFinal: boolean = false) => {
    console.log(`Renderizando columna: ${title}, partidos: ${matches.length}, isFinal: ${isFinal}`);

    return (
      <View style={[styles.roundColumn, isFinal && styles.finalColumn]}>
        {/* Título */}
        <View style={[styles.roundHeader, isFinal && styles.finalHeader]}>
          <Text style={[styles.roundTitle, isFinal && styles.finalTitle]}>
            {isFinal ? '🏆 ' : ''}{title}
          </Text>
        </View>

        {/* Partidos */}
        <View style={styles.matchesContainer}>
          {matches.map((match) => renderMatch(match))}
        </View>
      </View>
    );
  };

  // Renderizar conector visual
  const renderConnector = () => (
    <View style={styles.connector}>
      <View style={styles.connectorLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={true}
        style={styles.horizontalScroll}
        contentContainerStyle={styles.horizontalContent}
      >
        <ScrollView
          showsVerticalScrollIndicator={true}
          style={styles.verticalScroll}
          contentContainerStyle={styles.verticalContent}
          nestedScrollEnabled={true}
        >
          <View style={styles.bracketContainer}>
            {/* LADO IZQUIERDO */}
            {otherPhases.map((phase) => {
              const { left } = splitByKey(phase.cruces);
              return (
                <React.Fragment key={`left-${phase.nombre}`}>
                  {renderRoundColumn(phase.nombre, left)}
                  {renderConnector()}
                </React.Fragment>
              );
            })}

            {/* FINAL EN EL CENTRO */}
            {finalPhase && (
              <>
                {renderRoundColumn(finalPhase.nombre, finalPhase.cruces, true)}
                {renderConnector()}
              </>
            )}

            {/* LADO DERECHO (orden inverso) */}
            {[...otherPhases].reverse().map((phase, index) => {
              const { right } = splitByKey(phase.cruces);
              return (
                <React.Fragment key={`right-${phase.nombre}`}>
                  {renderRoundColumn(phase.nombre, right)}
                  {index < otherPhases.length - 1 && renderConnector()}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Hint de scroll */}
      <View style={styles.scrollHint}>
        <Text style={styles.scrollHintText}>← Desliza horizontalmente →</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    paddingHorizontal: 20,
    paddingBottom: 50, // Espacio para el hint
  },
  verticalScroll: {
    flex: 1,
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 500,
  },
  phaseColumn: {
    minWidth: 240,
  },
  phaseHeader: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.base,
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textInverse,
    letterSpacing: 1,
  },
  matchesContainer: {
    gap: theme.spacing.xl + theme.spacing.lg,
    justifyContent: 'center',
  },
  matchCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.getCardShadow('sm'),
    minWidth: 220,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
  },
  winnerRow: {
    backgroundColor: '#DBEAFE',
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.sm,
  },
  teamLogo: {
    width: 28,
    height: 28,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.sm,
  },
  teamLogoPlaceholder: {
    backgroundColor: theme.colors.gray300,
  },
  teamName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  winnerTeamName: {
    color: theme.colors.primary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  scoreBox: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  winnerScoreBox: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  scoreText: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  winnerScoreText: {
    color: theme.colors.textInverse,
  },
  matchDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  phaseConnector: {
    width: 32,
    height: 2,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },
  // Estilos de la FINAL
  finalColumn: {
    minWidth: 300,
    marginHorizontal: theme.spacing.lg,
  },
  finalHeader: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.base,
    alignItems: 'center',
    ...theme.getCardShadow('lg'),
  },
  finalTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.black,
    color: theme.colors.textInverse,
    letterSpacing: 2,
  },
  finalMatchContainer: {
    justifyContent: 'center',
  },
  finalCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: theme.colors.primary + '50',
    overflow: 'hidden',
    ...theme.getCardShadow('xl'),
  },
  finalTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.gray50,
  },
  finalWinnerRow: {
    backgroundColor: '#DBEAFE',
    borderWidth: 2,
    borderColor: theme.colors.primary,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  finalTeamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: theme.spacing.md,
  },
  finalTeamLogo: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing.md,
  },
  finalTeamName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    flex: 1,
  },
  finalWinnerTeamName: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.black,
  },
  finalScoreBox: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.gray300,
  },
  finalWinnerScoreBox: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  finalScoreText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.black,
    color: theme.colors.textSecondary,
  },
  finalWinnerScoreText: {
    color: theme.colors.textInverse,
  },
  finalDivider: {
    height: 2,
    backgroundColor: theme.colors.border,
  },
  championSection: {
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.base,
    paddingHorizontal: theme.spacing.base,
  },
  championDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginBottom: theme.spacing.md,
  },
  championLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    fontWeight: theme.typography.fontWeight.semibold,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: theme.spacing.xs,
  },
  championInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  championTrophy: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  championName: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.primary,
    flex: 1,
    textAlign: 'center',
  },
  progressIndicator: {
    position: 'absolute',
    bottom: theme.spacing.lg,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundCard + 'E6',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    marginHorizontal: theme.spacing.xl * 2,
    borderRadius: theme.borderRadius.full,
    ...theme.getCardShadow('lg'),
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
    marginRight: theme.spacing.sm,
  },
  progressText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textTertiary,
    textAlign: 'center',
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
  },
  roundColumn: {
    width: 280, // Cambiar de minWidth a width para forzar tamaño
    gap: 12,
  },
  finalColumn: {
    width: 300,
  },
  roundHeader: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  finalHeader: {
    backgroundColor: '#DC2626',
    paddingVertical: 14,
  },
  roundTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  finalTitle: {
    fontSize: 16,
    letterSpacing: 2,
  },
  matchesContainer: {
    gap: 20,
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  teamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
    backgroundColor: '#F9FAFB',
  },
  winnerRow: {
    backgroundColor: '#DBEAFE',
  },
  teamLogo: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E5E7EB',
  },
  teamName: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  winnerText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  scoreBox: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  winnerScore: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  scoreText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#6B7280',
  },
  winnerScoreText: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
  },
  connector: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 30,
    height: 3,
    backgroundColor: '#93C5FD',
    borderRadius: 2,
  },
  scrollHint: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  scrollHintText: {
    fontSize: 12,
    color: '#6B7280',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
});
