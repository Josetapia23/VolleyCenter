// src/features/tournaments/components/PlayoffBracket.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { PlayoffPhase, PlayoffMatch } from '../../../types/tournament';

interface PlayoffBracketProps {
  phases: PlayoffPhase[];
  onMatchPress?: (match: PlayoffMatch) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ phases, onMatchPress }) => {
  // Ordenar fases por orden (ascendente: octavos, cuartos, semis, final)
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  // Función para dividir partidos en dos mitades (bracket superior e inferior)
  const splitMatches = (matches: PlayoffMatch[]) => {
    const half = Math.ceil(matches.length / 2);
    return {
      upper: matches.slice(0, half),
      lower: matches.slice(half),
    };
  };

  const renderTeam = (
    team: PlayoffMatch['equipo_1'],
    score: number,
    isWinner: boolean,
    isTop: boolean
  ) => (
    <View
      style={[
        styles.teamContainer,
        isTop ? styles.teamTop : styles.teamBottom,
        isWinner && styles.winnerTeam,
      ]}
    >
      <Image source={{ uri: team.logo }} style={styles.teamLogo} />
      <Text
        style={[styles.teamName, isWinner && styles.winnerText]}
        numberOfLines={1}
      >
        {team.nombre}
      </Text>
      <View style={[styles.scoreBox, isWinner && styles.winnerScore]}>
        <Text style={[styles.scoreText, isWinner && styles.winnerScoreText]}>
          {score}
        </Text>
      </View>
    </View>
  );

  const renderMatch = (match: PlayoffMatch) => {
    const isWinner1 = match.resultado?.ganador === match.equipo_1.id;
    const isWinner2 = match.resultado?.ganador === match.equipo_2.id;

    return (
      <View key={match.id_cruce} style={styles.matchCard}>
        {renderTeam(
          match.equipo_1,
          match.resultado?.sets_equipo_1 ?? 0,
          isWinner1,
          true
        )}
        <View style={styles.divider} />
        {renderTeam(
          match.equipo_2,
          match.resultado?.sets_equipo_2 ?? 0,
          isWinner2,
          false
        )}
      </View>
    );
  };

  // Renderizar una columna de fase (para bracket izquierdo o derecho)
  const renderPhaseColumn = (
    phase: PlayoffPhase,
    matches: PlayoffMatch[],
    position: 'left' | 'right' | 'center',
    showConnector: boolean = false
  ) => {
    return (
      <View style={styles.phaseColumn}>
        {/* Título de la fase */}
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseTitle}>{phase.nombre}</Text>
        </View>

        {/* Partidos */}
        <View style={styles.matchesColumn}>
          {matches.map((match, index) => (
            <View key={match.id_cruce} style={styles.matchWrapper}>
              {renderMatch(match)}

              {/* Conector hacia la siguiente fase */}
              {showConnector && (
                <View
                  style={[
                    styles.phaseConnector,
                    position === 'left' && styles.connectorRight,
                    position === 'right' && styles.connectorLeft,
                  ]}
                />
              )}
            </View>
          ))}
        </View>
      </View>
    );
  };

  // Renderizar conectores entre fases
  const renderConnector = (
    fromMatches: number,
    toMatches: number,
    position: 'left' | 'right'
  ) => {
    const connectors = [];
    const verticalGap = 120; // Espacio vertical entre partidos

    for (let i = 0; i < toMatches; i++) {
      const fromIndex1 = i * 2;
      const fromIndex2 = i * 2 + 1;
      const toIndex = i;

      // Calcular posiciones verticales
      const fromY1 = fromIndex1 * verticalGap + 60; // Centro del primer partido de origen
      const fromY2 = fromIndex2 * verticalGap + 60; // Centro del segundo partido de origen
      const toY = toIndex * (verticalGap * 2) + 120; // Centro del partido de destino

      connectors.push(
        <View key={`connector-${i}`} style={styles.connectorGroup}>
          {/* Línea horizontal desde el primer partido */}
          <View
            style={[
              styles.horizontalLine,
              {
                top: fromY1,
                [position === 'left' ? 'left' : 'right']: 280,
                width: 30,
              },
            ]}
          />

          {/* Línea vertical conectando ambos partidos */}
          <View
            style={[
              styles.verticalLine,
              {
                top: fromY1,
                height: fromY2 - fromY1,
                [position === 'left' ? 'left' : 'right']: 310,
              },
            ]}
          />

          {/* Línea horizontal desde el segundo partido */}
          <View
            style={[
              styles.horizontalLine,
              {
                top: fromY2,
                [position === 'left' ? 'left' : 'right']: 280,
                width: 30,
              },
            ]}
          />

          {/* Línea horizontal hacia el partido de destino */}
          <View
            style={[
              styles.horizontalLine,
              {
                top: toY,
                [position === 'left' ? 'left' : 'right']: 310,
                width: 30,
              },
            ]}
          />
        </View>
      );
    }

    return <View style={styles.connectorsContainer}>{connectors}</View>;
  };

  if (sortedPhases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fases eliminatorias disponibles</Text>
      </View>
    );
  }

  // Separar la final del resto de fases
  const finalPhase = sortedPhases[sortedPhases.length - 1];
  const otherPhases = sortedPhases.slice(0, -1);

  // Invertir el orden para mostrar de más lejano a más cercano
  const leftPhases = [...otherPhases].reverse();
  const rightPhases = [...otherPhases].reverse();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={true}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
    >
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.verticalContent}
        scrollEventThrottle={16}
        nestedScrollEnabled={true}
      >
        <View style={styles.bracketContainer}>
          {/* Bracket Izquierdo */}
          <View style={styles.leftBracket}>
            {leftPhases.map((phase, index) => {
              const { upper } = splitMatches(phase.cruces);
              const hasNextPhase = index < leftPhases.length - 1;
              return (
                <View key={`left-${phase.nombre}`} style={styles.phaseWrapper}>
                  {renderPhaseColumn(phase, upper, 'left', hasNextPhase)}
                </View>
              );
            })}
          </View>

          {/* Final (Centro) */}
          <View style={styles.centerBracket}>
            {renderPhaseColumn(finalPhase, finalPhase.cruces, 'center', false)}
          </View>

          {/* Bracket Derecho */}
          <View style={styles.rightBracket}>
            {rightPhases.map((phase, index) => {
              const { lower } = splitMatches(phase.cruces);
              const hasNextPhase = index < rightPhases.length - 1;
              return (
                <View key={`right-${phase.nombre}`} style={styles.phaseWrapper}>
                  {renderPhaseColumn(phase, lower, 'right', hasNextPhase)}
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  verticalContent: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  bracketContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 600,
  },
  leftBracket: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerBracket: {
    marginHorizontal: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightBracket: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseWrapper: {
    marginHorizontal: 20,
  },
  phaseColumn: {
    flexDirection: 'column',
    minWidth: 280,
  },
  phaseHeader: {
    backgroundColor: '#1E40AF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  phaseTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  matchesColumn: {
    gap: 80,
  },
  matchWrapper: {
    position: 'relative',
  },
  matchCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    width: 280,
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    gap: 10,
  },
  teamTop: {
    backgroundColor: '#F9FAFB',
  },
  teamBottom: {
    backgroundColor: '#FFFFFF',
  },
  winnerTeam: {
    backgroundColor: '#DBEAFE',
  },
  teamLogo: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E5E7EB',
  },
  teamName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  winnerText: {
    color: '#1E40AF',
    fontWeight: '700',
  },
  scoreBox: {
    width: 36,
    height: 36,
    borderRadius: 8,
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
    fontSize: 16,
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
  // Estilos para conectores de fase
  phaseConnector: {
    position: 'absolute',
    top: '50%',
    height: 2,
    backgroundColor: '#D1D5DB',
    width: 40,
    marginTop: -1,
  },
  connectorRight: {
    right: -40,
  },
  connectorLeft: {
    left: -40,
  },
  // Estilos para conectores (función renderConnector - no usado actualmente)
  connectorsContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  connectorGroup: {
    position: 'absolute',
  },
  horizontalLine: {
    position: 'absolute',
    height: 2,
    backgroundColor: '#D1D5DB',
  },
  verticalLine: {
    position: 'absolute',
    width: 2,
    backgroundColor: '#D1D5DB',
  },
});
