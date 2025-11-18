// src/features/tournaments/components/TournamentCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Tournament } from '../../../types/tournament';

interface TournamentCardProps {
    tournament: Tournament;
    onPress: () => void;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onPress }) => {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getProgressColor = (estado: string) => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'iniciado':
                return '#ffc107';
            case 'en ejecución':
            case 'en ejecucion':
                return '#28a745';
            case 'finalizado':
                return '#6c757d';
            default:
                return '#1a237e';
        }
    };

    const getStatusColor = (estado: string) => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'iniciado':
                return '#ffc107';
            case 'en ejecución':
            case 'en ejecucion':
                return '#28a745';
            case 'finalizado':
                return '#6c757d';
            default:
                return '#1a237e';
        }
    };

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
            {/* Badge de Estado */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.estado) }]}>
                    <Text style={styles.statusText}>{tournament.estado}</Text>
                </View>
            </View>

            {/* Header con imagen */}
            <View style={styles.cardHeader}>
                <Image
                    source={{ uri: tournament.foto_torneo }}
                    style={styles.tournamentImage}
                    resizeMode="cover"
                />
                <View style={styles.tournamentInfo}>
                    <Text style={styles.tournamentName} numberOfLines={2}>
                        {tournament.nombre}
                    </Text>
                    <Text style={styles.category}>{tournament.categoria}</Text>
                    <Text style={styles.location}>
                        {tournament.municipio}, {tournament.departamento}
                    </Text>
                </View>
            </View>

            {/* Contenido */}
            <View style={styles.cardContent}>
                <View style={styles.dateContainer}>
                    <Text style={styles.dateLabel}>Período</Text>
                    <Text style={styles.dateText}>
                        {formatDate(tournament.fecha_inicio)} - {formatDate(tournament.fecha_fin)}
                    </Text>
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.total_equipos}</Text>
                        <Text style={styles.statLabel}>Equipos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.partidos_jugados}</Text>
                        <Text style={styles.statLabel}>Partidos</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statNumber}>{tournament.progreso}%</Text>
                        <Text style={styles.statLabel}>Progreso</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <View style={styles.progressBar}>
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${tournament.progreso}%`,
                                    backgroundColor: getProgressColor(tournament.estado)
                                }
                            ]}
                        />
                    </View>
                </View>

                <Text style={styles.organizer} numberOfLines={1}>
                    Organizado por: {tournament.organizador}
                </Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        marginBottom: 20,
        elevation: 3,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden',
    },
    statusContainer: {
        alignItems: 'flex-end',
        paddingTop: 12,
        paddingRight: 12,
        paddingBottom: 0,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        elevation: 1,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    statusText: {
        fontSize: 11,
        color: 'white',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    cardHeader: {
        flexDirection: 'row',
        padding: 16,
        paddingTop: 8,
        alignItems: 'center',
    },
    tournamentImage: {
        width: 80,
        height: 80,
        borderRadius: 8,
        marginRight: 12,
    },
    tournamentInfo: {
        flex: 1,
    },
    tournamentName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    category: {
        fontSize: 14,
        color: '#1a237e',
        fontWeight: '600',
        marginBottom: 2,
    },
    location: {
        fontSize: 12,
        color: '#666',
    },
    cardContent: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    dateContainer: {
        marginBottom: 12,
    },
    dateLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 4,
    },
    dateText: {
        fontSize: 13,
        color: '#333',
        fontWeight: '500',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 12,
        paddingVertical: 12,
        backgroundColor: '#f8f9fa',
        borderRadius: 8,
    },
    statItem: {
        alignItems: 'center',
    },
    statNumber: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    statLabel: {
        fontSize: 11,
        color: '#666',
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBar: {
        height: 6,
        backgroundColor: '#e0e0e0',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 3,
    },
    organizer: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default TournamentCard;