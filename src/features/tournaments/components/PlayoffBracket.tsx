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
  verticalContent: {
    paddingVertical: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
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
