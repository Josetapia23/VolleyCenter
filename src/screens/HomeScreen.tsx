// src/screens/HomeScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    TouchableOpacity,
    StyleSheet,
    RefreshControl,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Tournament } from '../types/tournament';
import TournamentService from '../services/api';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: HomeScreenNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Cargar torneos
    const loadTournaments = async () => {
        try {
            const data = await TournamentService.getActiveTournaments();
            setTournaments(data);
        } catch (error) {
            Alert.alert('Error', 'No se pudieron cargar los torneos');
            console.error('Error loading tournaments:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadTournaments();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadTournaments();
    };

    const handleTournamentPress = (tournament: Tournament) => {
        navigation.navigate('TournamentDetail', { tournament });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (estado: string) => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'iniciado':
                return '#007bff'; // azul
            case 'en ejecución':
            case 'en ejecucion':
                return '#ffc107'; // amarillo
            case 'finalizado':
                return '#28a745'; // verde
            default:
                return '#6c757d'; // gris
        }
    };

    const getProgressColor = (estado: string) => {
        const estadoLower = estado.toLowerCase();
        switch (estadoLower) {
            case 'iniciado':
                return '#007bff';
            case 'en ejecución':
            case 'en ejecucion':
                return '#ffc107';
            case 'finalizado':
                return '#28a745';
            default:
                return '#6c757d';
        }
    };

    const TournamentCard = ({ tournament }: { tournament: Tournament }) => (
        <TouchableOpacity
            style={styles.card}
            onPress={() => handleTournamentPress(tournament)}
        >
            {/* Badge de estado en la parte superior */}
            <View style={styles.statusContainer}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(tournament.estado) }]}>
                    <Text style={styles.statusText}>{tournament.estado}</Text>
                </View>
            </View>

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

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#1a237e" />
                <Text style={styles.loadingText}>Cargando torneos...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <Text style={styles.sectionTitle}>Todos los Torneos</Text>

                {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                        <TournamentCard key={tournament.id} tournament={tournament} />
                    ))
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyTitle}>No hay torneos disponibles</Text>
                        <Text style={styles.emptySubtitle}>
                            Los torneos disponibles aparecerán aquí
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
        backgroundColor: '#f5f5f5',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 16,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
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
        color: '#666',
        marginBottom: 2,
    },
    dateText: {
        fontSize: 14,
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
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 2,
    },
    progressContainer: {
        marginBottom: 12,
    },
    progressBar: {
        height: 4,
        backgroundColor: '#e0e0e0',
        borderRadius: 2,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
    },
    organizer: {
        fontSize: 12,
        color: '#666',
        fontStyle: 'italic',
    },
    emptyState: {
        alignItems: 'center',
        paddingTop: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    emptySubtitle: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
    },
});

export default HomeScreen;