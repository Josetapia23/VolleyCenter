// src/features/tournaments/components/PlayoffBracket.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal } from 'react-native';
import { PlayoffPhase, PlayoffMatch } from '../../../types/tournament';
import { theme } from '../../../shared/theme';
import { generateMissingPhases, hasMissingPhases } from '../utils/playoffGenerator';

interface PlayoffBracketProps {
  phases: PlayoffPhase[];
  onMatchPress?: (match: PlayoffMatch) => void;
}

export const PlayoffBracket: React.FC<PlayoffBracketProps> = ({ phases, onMatchPress }) => {
  // Estado para el modal de detalles del partido
  const [selectedMatch, setSelectedMatch] = useState<PlayoffMatch | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Ordenar fases por orden (ascendente: octavos, cuartos, semis, final)
  const sortedPhases = [...phases].sort((a, b) => a.orden - b.orden);

  console.log('=== PLAYOFF BRACKET V5 - DISEÑO SIMÉTRICO ===');
  console.log('Total fases:', sortedPhases.length);

  // Manejar clic en partido
  const handleMatchPress = (match: PlayoffMatch) => {
    // Solo abrir modal si el partido tiene resultado
    if (match.resultado && match.estado === 'finalizado') {
      setSelectedMatch(match);
      setModalVisible(true);
    }
    // Llamar al handler opcional
    if (onMatchPress) {
      onMatchPress(match);
    }
  };

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
    const hasResult = match.resultado && match.estado === 'finalizado';

    return (
      <TouchableOpacity
        key={match.id_cruce}
        style={styles.matchCard}
        onPress={() => handleMatchPress(match)}
        disabled={!hasResult}
        activeOpacity={hasResult ? 0.7 : 1}
      >
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
      </TouchableOpacity>
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
    const hasResult = match.resultado && match.estado === 'finalizado';

    return (
      <View style={styles.finalColumn}>
        {/* Título Final */}
        <View style={styles.finalHeader}>
          <Text style={styles.finalTitle}>🏆 FINAL</Text>
        </View>

        {/* Partido Final */}
        <View style={styles.matchesContainer}>
          <TouchableOpacity
            style={styles.finalMatchCard}
            onPress={() => handleMatchPress(match)}
            disabled={!hasResult}
            activeOpacity={hasResult ? 0.7 : 1}
          >
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
          </TouchableOpacity>
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
    const hasResult = match.resultado && match.estado === 'finalizado';

    return (
      <View style={styles.thirdPlaceContainer}>
        {/* Título Tercer Lugar */}
        <View style={styles.thirdPlaceHeader}>
          <Text style={styles.thirdPlaceTitle}>🥉 TERCER LUGAR</Text>
        </View>

        {/* Partido Tercer Lugar */}
        <TouchableOpacity
          style={styles.thirdPlaceMatchCard}
          onPress={() => handleMatchPress(match)}
          disabled={!hasResult}
          activeOpacity={hasResult ? 0.7 : 1}
        >
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
        </TouchableOpacity>
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

      {/* Modal de detalles del partido */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalContent}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {selectedMatch && (
              <>
                {/* Header del Modal */}
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Detalles del Partido</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Info de equipos */}
                <View style={styles.modalTeamsContainer}>
                  <View style={styles.modalTeamSection}>
                    <Image source={{ uri: selectedMatch.equipo_1.logo }} style={styles.modalTeamLogo} />
                    <Text style={styles.modalTeamName}>{selectedMatch.equipo_1.nombre}</Text>
                  </View>
                  <Text style={styles.modalVs}>VS</Text>
                  <View style={styles.modalTeamSection}>
                    <Image source={{ uri: selectedMatch.equipo_2.logo }} style={styles.modalTeamLogo} />
                    <Text style={styles.modalTeamName}>{selectedMatch.equipo_2.nombre}</Text>
                  </View>
                </View>

                {/* Resultado general */}
                <View style={styles.modalScoreContainer}>
                  <View style={styles.modalScoreBox}>
                    <Text style={styles.modalScoreLabel}>Sets ganados</Text>
                    <View style={styles.modalScoreRow}>
                      <Text style={[
                        styles.modalScoreValue,
                        selectedMatch.resultado?.ganador === selectedMatch.equipo_1.id && styles.modalScoreWinner
                      ]}>
                        {selectedMatch.resultado?.sets_equipo_1 ?? 0}
                      </Text>
                      <Text style={styles.modalScoreSeparator}>-</Text>
                      <Text style={[
                        styles.modalScoreValue,
                        selectedMatch.resultado?.ganador === selectedMatch.equipo_2.id && styles.modalScoreWinner
                      ]}>
                        {selectedMatch.resultado?.sets_equipo_2 ?? 0}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Detalles por set */}
                <View style={styles.modalSetsContainer}>
                  <Text style={styles.modalSetsTitle}>Puntos por Set</Text>
                  {[1, 2, 3].map((setNum) => {
                    const set1Key = `set_${setNum}_equipo_1` as keyof typeof selectedMatch.resultado;
                    const set2Key = `set_${setNum}_equipo_2` as keyof typeof selectedMatch.resultado;
                    const puntos1 = selectedMatch.resultado?.[set1Key] ?? 0;
                    const puntos2 = selectedMatch.resultado?.[set2Key] ?? 0;

                    // Solo mostrar sets jugados (donde al menos un equipo tenga puntos)
                    if (puntos1 === 0 && puntos2 === 0) return null;

                    const ganadorSet = puntos1 > puntos2 ? selectedMatch.equipo_1.id : selectedMatch.equipo_2.id;

                    return (
                      <View key={setNum} style={styles.modalSetRow}>
                        <Text style={styles.modalSetLabel}>Set {setNum}</Text>
                        <View style={styles.modalSetScores}>
                          <Text style={[
                            styles.modalSetScore,
                            ganadorSet === selectedMatch.equipo_1.id && styles.modalSetScoreWinner
                          ]}>
                            {puntos1}
                          </Text>
                          <Text style={styles.modalSetScoreSeparator}>-</Text>
                          <Text style={[
                            styles.modalSetScore,
                            ganadorSet === selectedMatch.equipo_2.id && styles.modalSetScoreWinner
                          ]}>
                            {puntos2}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>

                {/* Info adicional */}
                {selectedMatch.fecha && (
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Fecha:</Text>
                    <Text style={styles.modalInfoValue}>{selectedMatch.fecha}</Text>
                  </View>
                )}
                {selectedMatch.ubicacion && (
                  <View style={styles.modalInfoRow}>
                    <Text style={styles.modalInfoLabel}>Ubicación:</Text>
                    <Text style={styles.modalInfoValue}>{selectedMatch.ubicacion}</Text>
                  </View>
                )}
              </>
            )}
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
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
  // Estilos del Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.base,
  },
  modalContent: {
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    width: '90%',
    maxWidth: 500,
    maxHeight: '80%',
    ...theme.getCardShadow('xl'),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  modalTeamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
  },
  modalTeamSection: {
    alignItems: 'center',
    flex: 1,
  },
  modalTeamLogo: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.gray200,
    marginBottom: theme.spacing.sm,
  },
  modalTeamName: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  modalVs: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textTertiary,
    marginHorizontal: theme.spacing.md,
  },
  modalScoreContainer: {
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.lg,
  },
  modalScoreBox: {
    alignItems: 'center',
  },
  modalScoreLabel: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.medium,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
  },
  modalScoreValue: {
    fontSize: 36,
    fontWeight: theme.typography.fontWeight.black,
    color: theme.colors.textSecondary,
  },
  modalScoreWinner: {
    color: theme.colors.primary,
  },
  modalScoreSeparator: {
    fontSize: 24,
    color: theme.colors.textTertiary,
    fontWeight: theme.typography.fontWeight.bold,
  },
  modalSetsContainer: {
    marginBottom: theme.spacing.lg,
  },
  modalSetsTitle: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },
  modalSetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.backgroundCard,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  modalSetLabel: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textPrimary,
  },
  modalSetScores: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  modalSetScore: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.textSecondary,
    minWidth: 32,
    textAlign: 'center',
  },
  modalSetScoreWinner: {
    color: theme.colors.primary,
  },
  modalSetScoreSeparator: {
    fontSize: theme.typography.fontSize.base,
    color: theme.colors.textTertiary,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.base,
    backgroundColor: theme.colors.gray50,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  modalInfoLabel: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    color: theme.colors.textTertiary,
  },
  modalInfoValue: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.textPrimary,
  },
});
