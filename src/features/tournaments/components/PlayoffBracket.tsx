// src/features/tournaments/components/PlayoffBracket.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { PlayoffPhase, PlayoffMatch } from '../../../types/tournament';
import { theme } from '../../../shared/theme';
import { generateMissingPhases, hasMissingPhases } from '../utils/playoffGenerator';

interface PlayoffBracketProps {
  phases: PlayoffPhase[];
  onMatchPress?: (match: PlayoffMatch) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ phases, onMatchPress }) => {
  // Ordenar fases por orden (ascendente: octavos, cuartos, semis, final)
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  console.log('=== PLAYOFF BRACKET V5 - DISEÑO SIMÉTRICO ===');
  console.log('Total fases:', sortedPhases.length);

  if (sortedPhases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fases eliminatorias disponibles</Text>
      </View>
    );
  }

  // Filtrar solo los partidos de la llave 1 en cada fase
  const phasesWithKey1Only = sortedPhases.map(phase => {
    // Obtener todas las llaves únicas
    const llaves = Array.from(new Set(phase.cruces.map(m => m.llave))).sort();
    console.log(`Fase: ${phase.nombre}, Llaves disponibles: ${llaves.join(', ')}`);

    // Usar la primera llave (llave 1)
    const llave1 = llaves[0];
    const matchesLlave1 = phase.cruces.filter(m => m.llave === llave1);

    console.log(`Usando llave: ${llave1}, Partidos: ${matchesLlave1.length}`);

    return {
      ...phase,
      cruces: matchesLlave1
    };
  });

  // Generar fases faltantes (Cuartos, Semifinal, Final) basadas en los ganadores
  let allPhases = phasesWithKey1Only;
  if (hasMissingPhases(phasesWithKey1Only)) {
    console.log('⚠️ Faltan fases, generando automáticamente...');
    allPhases = generateMissingPhases(phasesWithKey1Only);
    console.log('✅ Fases generadas:', allPhases.map(p => p.nombre).join(', '));
  } else {
    console.log('✅ Todas las fases ya están presentes');
  }

  // Separar las fases especiales: Final y Tercer Lugar
  const finalPhaseIndex = allPhases.findIndex(p => {
    const nombre = p.nombre.toLowerCase();
    return (
      nombre.includes('final') &&
      !nombre.includes('semifinal') &&
      !nombre.includes('octavos') &&
      !nombre.includes('cuartos') &&
      !nombre.includes('tercer') &&
      !nombre.includes('3er')
    );
  });

  const thirdPlaceIndex = allPhases.findIndex(p => {
    const nombre = p.nombre.toLowerCase();
    return nombre.includes('tercer') || nombre.includes('3er');
  });

  const finalPhase = finalPhaseIndex >= 0 ? allPhases[finalPhaseIndex] : null;
  const thirdPlacePhase = thirdPlaceIndex >= 0 ? allPhases[thirdPlaceIndex] : null;

  // Filtrar las fases eliminando final y tercer lugar
  const otherPhases = allPhases.filter((_, index) =>
    index !== finalPhaseIndex && index !== thirdPlaceIndex
  );

  console.log('Final:', finalPhase?.nombre || 'NO HAY');
  console.log('Tercer lugar:', thirdPlacePhase?.nombre || 'NO HAY');
  console.log('Otras fases:', otherPhases.map(p => p.nombre));

  // Función para dividir partidos en dos mitades
  // Solo divide si hay más de 2 partidos, de lo contrario muestra todo
  const splitMatches = (matches: PlayoffMatch[]) => {
    // Si solo hay 1 o 2 partidos, no dividir (mostrar todo en el lado izquierdo)
    if (matches.length <= 2) {
      return {
        left: matches,
        right: []
      };
    }

    // Si hay más de 2 partidos, dividir en mitades
    const half = Math.ceil(matches.length / 2);
    return {
      left: matches.slice(0, half),
      right: matches.slice(half)
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

  // Renderizar una columna de fase (con partidos)
  const renderRoundColumn = (title: string, matches: PlayoffMatch[], key: string) => {
    return (
      <View key={key} style={styles.roundColumn}>
        {/* Título */}
        <View style={styles.roundHeader}>
          <Text style={styles.roundTitle}>{title}</Text>
        </View>

        {/* Partidos */}
        <View style={styles.matchesContainer}>
          {matches.map((match) => renderMatch(match))}
        </View>
      </View>
    );
  };

  // Renderizar la final (destacada)
  const renderFinalColumn = () => {
    if (!finalPhase || finalPhase.cruces.length === 0) return null;

    const match = finalPhase.cruces[0];
    const isWinner1 = match.resultado?.ganador === match.equipo_1.id;
    const isWinner2 = match.resultado?.ganador === match.equipo_2.id;
    const champion = isWinner1 ? match.equipo_1.nombre : isWinner2 ? match.equipo_2.nombre : null;

    return (
      <View style={styles.finalColumn}>
        {/* Título Final */}
        <View style={styles.finalHeader}>
          <Text style={styles.finalTitle}>🏆 FINAL</Text>
        </View>

        {/* Partido Final */}
        <View style={styles.matchesContainer}>
          <View style={styles.finalMatchCard}>
            {/* Equipo 1 */}
            <View style={[styles.finalTeamRow, isWinner1 && styles.finalWinnerRow]}>
              <Image source={{ uri: match.equipo_1.logo }} style={styles.finalTeamLogo} />
              <Text style={[styles.finalTeamName, isWinner1 && styles.finalWinnerText]} numberOfLines={1}>
                {match.equipo_1.nombre}
              </Text>
              <View style={[styles.finalScoreBox, isWinner1 && styles.finalWinnerScore]}>
                <Text style={[styles.finalScoreText, isWinner1 && styles.finalWinnerScoreText]}>
                  {match.resultado?.sets_equipo_1 ?? 0}
                </Text>
              </View>
            </View>

            <View style={styles.finalDivider} />

            {/* Equipo 2 */}
            <View style={[styles.finalTeamRow, isWinner2 && styles.finalWinnerRow]}>
              <Image source={{ uri: match.equipo_2.logo }} style={styles.finalTeamLogo} />
              <Text style={[styles.finalTeamName, isWinner2 && styles.finalWinnerText]} numberOfLines={1}>
                {match.equipo_2.nombre}
              </Text>
              <View style={[styles.finalScoreBox, isWinner2 && styles.finalWinnerScore]}>
                <Text style={[styles.finalScoreText, isWinner2 && styles.finalWinnerScoreText]}>
                  {match.resultado?.sets_equipo_2 ?? 0}
                </Text>
              </View>
            </View>

            {/* Campeón */}
            {champion && (
              <View style={styles.championSection}>
                <View style={styles.championDivider} />
                <Text style={styles.championLabel}>CAMPEÓN</Text>
                <Text style={styles.championName}>🏆 {champion}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Renderizar el partido de tercer lugar
  const renderThirdPlaceMatch = () => {
    if (!thirdPlacePhase || thirdPlacePhase.cruces.length === 0) return null;

    const match = thirdPlacePhase.cruces[0];
    const isWinner1 = match.resultado?.ganador === match.equipo_1.id;
    const isWinner2 = match.resultado?.ganador === match.equipo_2.id;

    return (
      <View style={styles.thirdPlaceContainer}>
        {/* Título Tercer Lugar */}
        <View style={styles.thirdPlaceHeader}>
          <Text style={styles.thirdPlaceTitle}>🥉 TERCER LUGAR</Text>
        </View>

        {/* Partido Tercer Lugar */}
        <View style={styles.thirdPlaceMatchCard}>
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
      </View>
    );
  };

  // Renderizar conector visual
  const renderConnector = (key: string) => (
    <View key={key} style={styles.connector}>
      <View style={styles.connectorLine} />
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header informativo */}
      <View style={styles.infoHeader}>
        <Text style={styles.infoTitle}>Playoffs 2024 - Llave 1</Text>
        <Text style={styles.infoSubtitle}>Desliza horizontalmente para ver todas las rondas</Text>
      </View>

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
            {/* LADO IZQUIERDO: Octavos -> Cuartos -> Semis (dinámico) */}
            {otherPhases.map((phase, index) => {
              const { left } = splitMatches(phase.cruces);
              return (
                <React.Fragment key={`left-${phase.nombre}-${index}`}>
                  {renderRoundColumn(phase.nombre, left, `left-col-${index}`)}
                  {renderConnector(`left-conn-${index}`)}
                </React.Fragment>
              );
            })}

            {/* CENTRO: FINAL Y TERCER LUGAR */}
            <View style={styles.centerContainer}>
              {renderFinalColumn()}
              {renderThirdPlaceMatch()}
            </View>

            {/* LADO DERECHO: Semis -> Cuartos -> Octavos (orden inverso, solo si hay partidos) */}
            {[...otherPhases].reverse().map((phase, index) => {
              const { right } = splitMatches(phase.cruces);
              // Solo renderizar si hay partidos en el lado derecho
              if (right.length === 0) return null;

              return (
                <React.Fragment key={`right-${phase.nombre}-${index}`}>
                  {renderConnector(`right-conn-${index}`)}
                  {renderRoundColumn(phase.nombre, right, `right-col-${index}`)}
                </React.Fragment>
              );
            })}
          </View>
        </ScrollView>
      </ScrollView>

      {/* Hint de scroll */}
      <View style={styles.scrollHint}>
        <View style={styles.scrollHintContent}>
          <View style={styles.pulseIndicator} />
          <Text style={styles.scrollHintText}>Desliza horizontalmente</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  infoHeader: {
    backgroundColor: theme.colors.backgroundCard,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.getCardShadow('sm'),
  },
  infoTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  infoSubtitle: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
  },
  horizontalScroll: {
    flex: 1,
  },
  horizontalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  verticalScroll: {
    flex: 1,
  },
  verticalContent: {
    paddingBottom: 20,
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 500,
    gap: 16,
  },
  roundColumn: {
    minWidth: 240,
    gap: 12,
  },
  roundHeader: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  roundTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  // Contenedor central para Final y Tercer Lugar
  centerContainer: {
    gap: theme.spacing.xl,
    alignItems: 'center',
  },
  // Estilos de la FINAL
  finalColumn: {
    minWidth: 280,
  },
  finalHeader: {
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.base,
    alignItems: 'center',
    ...theme.getCardShadow('xl'),
  },
  finalTitle: {
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.black,
    color: '#FFFFFF',
    letterSpacing: 3,
    textTransform: 'uppercase',
  },
  finalMatchCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#DC2626',
    overflow: 'hidden',
    ...theme.getCardShadow('xl'),
  },
  finalTeamRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: '#F9FAFB',
    gap: theme.spacing.md,
  },
  finalWinnerRow: {
    backgroundColor: '#DBEAFE',
  },
  finalTeamLogo: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray200,
  },
  finalTeamName: {
    flex: 1,
    fontSize: 15,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
  },
  finalWinnerText: {
    color: theme.colors.textPrimary,
    fontWeight: theme.typography.fontWeight.black,
  },
  finalScoreBox: {
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  finalWinnerScore: {
    backgroundColor: '#1E40AF',
    borderColor: '#1E40AF',
  },
  finalScoreText: {
    fontSize: 18,
    fontWeight: theme.typography.fontWeight.black,
    color: theme.colors.textSecondary,
  },
  finalWinnerScoreText: {
    color: '#FFFFFF',
  },
  finalDivider: {
    height: 1,
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
    textAlign: 'center',
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
    bottom: 16,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollHintContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundCard + 'F0',
    paddingHorizontal: theme.spacing.base,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.getCardShadow('md'),
    gap: theme.spacing.sm,
  },
  pulseIndicator: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.primary,
  },
  scrollHintText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
  },
  // Estilos del TERCER LUGAR
  thirdPlaceContainer: {
    minWidth: 280,
    marginTop: theme.spacing.xl,
  },
  thirdPlaceHeader: {
    backgroundColor: '#CD7F32', // Color bronce
    paddingVertical: 12,
    paddingHorizontal: theme.spacing.base,
    borderRadius: theme.borderRadius.lg,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.getCardShadow('lg'),
  },
  thirdPlaceTitle: {
    fontSize: 14,
    fontWeight: theme.typography.fontWeight.bold,
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  thirdPlaceMatchCard: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 2,
    borderColor: '#CD7F32',
    overflow: 'hidden',
    ...theme.getCardShadow('lg'),
  },
});
