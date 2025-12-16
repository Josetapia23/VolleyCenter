// src/features/tournaments/components/PlayoffBracket.tsx
import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { PlayoffPhase, PlayoffMatch } from '../../../types/tournament';

interface PlayoffBracketProps {
  phases: PlayoffPhase[];
  onMatchPress?: (match: PlayoffMatch) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ phases, onMatchPress }) => {
  // Ordenar fases por orden (ascendente)
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  // Agrupar partidos por llave dentro de cada fase
  const getMatchesByKey = (matches: PlayoffMatch[]) => {
    const grouped: Record<string, PlayoffMatch[]> = {};
    matches.forEach(match => {
      if (!grouped[match.llave]) {
        grouped[match.llave] = [];
      }
      grouped[match.llave].push(match);
    });
    return grouped;
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

  const renderPhase = (phase: PlayoffPhase, isLast: boolean) => {
    const matchesByKey = getMatchesByKey(phase.cruces);
    const keys = Object.keys(matchesByKey).sort();

    return (
      <View key={phase.nombre} style={styles.phaseColumn}>
        {/* Título de la fase */}
        <View style={styles.phaseHeader}>
          <Text style={styles.phaseTitle}>{phase.nombre}</Text>
        </View>

        {/* Contenedor de llaves */}
        <View style={styles.keysContainer}>
          {keys.map((keyName, keyIndex) => (
            <View key={keyName} style={styles.keySection}>
              {/* Título de la llave (solo si hay más de una llave) */}
              {keys.length > 1 && (
                <Text style={styles.keyTitle}>{keyName}</Text>
              )}

              {/* Partidos de esta llave */}
              <View style={styles.matchesColumn}>
                {matchesByKey[keyName].map((match) => renderMatch(match))}
              </View>
            </View>
          ))}
        </View>

        {/* Conectores hacia la siguiente fase */}
        {!isLast && <View style={styles.connector} />}
      </View>
    );
  };

  if (sortedPhases.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hay fases eliminatorias disponibles</Text>
      </View>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
      style={styles.container}
    >
      {sortedPhases.map((phase, index) =>
        renderPhase(phase, index === sortedPhases.length - 1)
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    flexDirection: 'row',
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
  phaseColumn: {
    flexDirection: 'column',
    marginRight: 20,
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
  keysContainer: {
    flex: 1,
    gap: 24,
  },
  keySection: {
    gap: 12,
  },
  keyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
    textAlign: 'center',
  },
  matchesColumn: {
    gap: 16,
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
  connector: {
    position: 'absolute',
    right: -20,
    top: '50%',
    width: 20,
    height: 2,
    backgroundColor: '#D1D5DB',
  },
});
