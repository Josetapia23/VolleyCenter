// src/features/matches/components/MatchCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';

interface MatchCardProps {
    match: any;
    onPress?: () => void;
}

const MatchCard: React.FC<MatchCardProps> = ({ match, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    const getMatchStatusColor = (estado: string) => {
        switch (estado) {
            case 'finalizado':
                return '#28a745';
            case 'en_curso':
                return '#ffc107';
            case 'programado':
                return '#6c757d';
            default:
                return '#6c757d';
        }
    };

    const getMatchStatusLabel = (estado: string) => {
        switch (estado) {
            case 'finalizado':
                return 'Finalizado';
            case 'en_curso':
                return 'En Curso';
            case 'programado':
                return 'Programado';
            default:
                return estado;
        }
    };

    return (
        <Container
            style={styles.matchCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            {/* Header: Fecha y Estado */}
            <View style={styles.matchHeader}>
                <Text style={styles.matchDate}>
                    {match.fecha} - {match.hora}
                </Text>
                <View
                    style={[
                        styles.matchStatus,
                        { backgroundColor: getMatchStatusColor(match.estado) }
                    ]}
                >
                    <Text style={styles.matchStatusText}>
                        {getMatchStatusLabel(match.estado)}
                    </Text>
                </View>
            </View>

            {/* Equipo 1 */}
            <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                    <Image
                        source={{ uri: match.equipo_1?.logo || 'https://via.placeholder.com/50' }}
                        style={styles.teamLogo}
                    />
                    <View style={styles.teamDetails}>
                        <Text style={styles.teamName}>{match.equipo_1?.nombre || 'Equipo 1'}</Text>
                        {match.equipo_1?.grupo && <Text style={styles.teamGroup}>Grupo {match.equipo_1.grupo}</Text>}
                    </View>
                </View>
                {match.resultado && (
                    <Text style={styles.teamScore}>{match.resultado.sets_equipo_1}</Text>
                )}
            </View>

            {/* VS */}
            <Text style={styles.vsText}>vs</Text>

            {/* Equipo 2 */}
            <View style={styles.teamRow}>
                <View style={styles.teamInfo}>
                    <Image
                        source={{ uri: match.equipo_2?.logo || 'https://via.placeholder.com/50' }}
                        style={styles.teamLogo}
                    />
                    <View style={styles.teamDetails}>
                        <Text style={styles.teamName}>{match.equipo_2?.nombre || 'Equipo 2'}</Text>
                        {match.equipo_2?.grupo && <Text style={styles.teamGroup}>Grupo {match.equipo_2.grupo}</Text>}
                    </View>
                </View>
                {match.resultado && (
                    <Text style={styles.teamScore}>{match.resultado.sets_equipo_2}</Text>
                )}
            </View>

            {/* Resultado por Sets */}
            {match.resultado && (
                <View style={styles.setsResultContainer}>
                    <Text style={styles.setsResultTitle}>Resultado por sets:</Text>
                    <View style={styles.setsRow}>
                        <Text style={styles.setResult}>
                            Set 1: {match.resultado.set_1_equipo_1} - {match.resultado.set_1_equipo_2}
                        </Text>
                        <Text style={styles.setResult}>
                            Set 2: {match.resultado.set_2_equipo_1} - {match.resultado.set_2_equipo_2}
                        </Text>
                    </View>
                    {match.resultado.set_3_equipo_1 !== undefined && (
                        <Text style={styles.setResult}>
                            Set 3: {match.resultado.set_3_equipo_1} - {match.resultado.set_3_equipo_2}
                        </Text>
                    )}
                </View>
            )}
        </Container>
    );
};

const styles = StyleSheet.create({
    matchCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    matchHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    matchDate: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    matchStatus: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 16,
    },
    matchStatusText: {
        fontSize: 12,
        color: 'white',
        fontWeight: 'bold',
    },
    teamRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 8,
    },
    teamInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    teamLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 12,
    },
    teamDetails: {
        flex: 1,
    },
    teamName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 2,
    },
    teamGroup: {
        fontSize: 13,
        color: '#666',
    },
    teamScore: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#1a237e',
        marginLeft: 16,
    },
    vsText: {
        fontSize: 14,
        color: '#999',
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 4,
    },
    setsResultContainer: {
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
        padding: 16,
        marginTop: 16,
    },
    setsResultTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 12,
    },
    setsRow: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 8,
    },
    setResult: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
});

export default MatchCard;