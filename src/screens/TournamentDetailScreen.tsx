// src/screens/TournamentDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Team, Tournament, TournamentDetail } from '../types/tournament';
import TournamentService from '../services/api';
import { ScrollableTabs, Tab } from '../shared/components';

type TournamentDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TournamentDetail'>;
type TournamentDetailScreenRouteProp = RouteProp<RootStackParamList, 'TournamentDetail'>;

interface Props {
    navigation: TournamentDetailScreenNavigationProp;
    route: TournamentDetailScreenRouteProp;
}

type TabKey = 'info' | 'teams' | 'standings' | 'matches';

const TournamentDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tournament } = route.params;
    const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('info');

    const tabs: Tab[] = [
        { key: 'info', title: 'Información' },
        { key: 'teams', title: 'Equipos' },
        { key: 'standings', title: 'Posiciones' },
        { key: 'matches', title: 'Partidos' },
    ];

    useEffect(() => {
        loadTournamentDetail();
    }, []);

    const loadTournamentDetail = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentById(tournament.id);
            setTournamentDetail(data);
        } catch (error) {
            console.error('Error loading tournament detail:', error);
            const basicTournamentDetail = {
                ...tournament,
                partidos: []
            };
            setTournamentDetail(basicTournamentDetail);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleTabPress = (tabKey: string) => {
        setActiveTab(tabKey as TabKey);
    };

    const InfoTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.infoSection}>
                <Text style={styles.sectionTitle}>Información General</Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Categoría:</Text>
                    <Text style={styles.infoValue}>{tournament.categoria}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Ubicación:</Text>
                    <Text style={styles.infoValue}>
                        {tournament.municipio}, {tournament.departamento}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Organizador:</Text>
                    <Text style={styles.infoValue}>{tournament.organizador}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de inicio:</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.fecha_inicio)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Fecha de fin:</Text>
                    <Text style={styles.infoValue}>{formatDate(tournament.fecha_fin)}</Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Estado:</Text>
                    <Text style={[styles.infoValue, styles.statusActive]}>
                        {tournament.estado}
                    </Text>
                </View>
            </View>

            <View style={styles.statsSection}>
                <Text style={styles.sectionTitle}>Estadísticas</Text>

                <View style={styles.statsGrid}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.total_equipos}</Text>
                        <Text style={styles.statLabel}>Equipos Participantes</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.total_partidos}</Text>
                        <Text style={styles.statLabel}>Total Partidos</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.partidos_jugados}</Text>
                        <Text style={styles.statLabel}>Partidos Jugados</Text>
                    </View>

                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{tournament.progreso}%</Text>
                        <Text style={styles.statLabel}>Progreso</Text>
                    </View>
                </View>

                <View style={styles.progressContainer}>
                    <Text style={styles.progressLabel}>Progreso del torneo</Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${tournament.progreso}%` }]} />
                    </View>
                </View>
            </View>
        </View>
    );

    const TeamsTab = () => {
        const [teams, setTeams] = useState<Team[]>([]);
        const [loadingTeams, setLoadingTeams] = useState(true);

        useEffect(() => {
            loadTeams();
        }, []);

        const loadTeams = async () => {
            try {
                setLoadingTeams(true);
                const data = await TournamentService.getTournamentTeams(tournament.id);
                setTeams(data);
            } catch (error) {
                console.error('Error loading teams:', error);
            } finally {
                setLoadingTeams(false);
            }
        };

        if (loadingTeams) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1a237e" />
                    <Text style={styles.loadingText}>Cargando equipos...</Text>
                </View>
            );
        }

        return (
            <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>
                    Equipos Participantes ({teams.length})
                </Text>

                {teams.length > 0 ? (
                    teams.map((team) => (
                        <View key={team.id} style={styles.teamCard}>
                            <Image
                                source={{ uri: team.logo || 'https://via.placeholder.com/80' }}
                                style={styles.teamCardLogo}
                            />
                            <View style={styles.teamCardInfo}>
                                <Text style={styles.teamCardName}>{team.nombre}</Text>
                                {team.grupo && (
                                    <Text style={styles.teamCardGroup}>Grupo {team.grupo}</Text>
                                )}
                                <Text style={styles.teamCardLocation}>
                                    {team.municipio}, {team.departamento}
                                </Text>
                                {team.entrenador && (
                                    <Text style={styles.teamCardCoach}>
                                        DT: {team.entrenador}
                                    </Text>
                                )}
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.comingSoonContainer}>
                        <Text style={styles.comingSoon}>No hay equipos registrados</Text>
                    </View>
                )}
            </View>
        );
    };

    const StandingsTab = () => (
        <View style={styles.tabContent}>
            <View style={styles.comingSoonContainer}>
                <Text style={styles.sectionTitle}>Tabla de Posiciones</Text>
                <Text style={styles.comingSoon}>Tabla de posiciones próximamente</Text>
            </View>
        </View>
    );

    const MatchesTab = () => {
        if (loading || !tournamentDetail) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#1a237e" />
                    <Text style={styles.loadingText}>Cargando partidos...</Text>
                </View>
            );
        }

        const matches = tournamentDetail.partidos || [];

        return (
            <View style={styles.tabContent}>
                <Text style={styles.sectionTitle}>
                    Partidos ({matches.length} total)
                </Text>

                {matches.length > 0 ? (
                    matches.map((match: any, index: number) => (
                        <View key={index} style={styles.matchCard}>
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
                                        {match.grupo && <Text style={styles.teamGroup}>Grupo {match.grupo}</Text>}
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
                                        {match.grupo && <Text style={styles.teamGroup}>Grupo {match.grupo}</Text>}
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
                                    <View style={styles.setsRowComplete}>
                                        <View style={styles.setBox}>
                                            <Text style={styles.setLabel}>Set 1</Text>
                                            <Text style={styles.setScore}>
                                                {match.resultado.set_1_equipo_1} - {match.resultado.set_1_equipo_2}
                                            </Text>
                                        </View>

                                        <View style={styles.setBox}>
                                            <Text style={styles.setLabel}>Set 2</Text>
                                            <Text style={styles.setScore}>
                                                {match.resultado.set_2_equipo_1} - {match.resultado.set_2_equipo_2}
                                            </Text>
                                        </View>

                                        {match.resultado.set_3_equipo_1 !== undefined && (
                                            <View style={styles.setBox}>
                                                <Text style={styles.setLabel}>Set 3</Text>
                                                <Text style={styles.setScore}>
                                                    {match.resultado.set_3_equipo_1} - {match.resultado.set_3_equipo_2}
                                                </Text>
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    ))
                ) : (
                    <View style={styles.comingSoonContainer}>
                        <Text style={styles.comingSoon}>No hay partidos disponibles</Text>
                    </View>
                )}
            </View>
        );
    };

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

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InfoTab />;
            case 'teams':
                return <TeamsTab />;
            case 'standings':
                return <StandingsTab />;
            case 'matches':
                return <MatchesTab />;
            default:
                return <InfoTab />;
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image
                    source={{ uri: tournament.foto_torneo }}
                    style={styles.tournamentImage}
                    resizeMode="cover"
                />
                <View style={styles.headerOverlay}>
                    <Text style={styles.tournamentTitle}>{tournament.nombre}</Text>
                    <Text style={styles.tournamentSubtitle}>
                        {tournament.municipio}, {tournament.departamento}
                    </Text>
                </View>
            </View>

            <ScrollableTabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {renderTabContent()}
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
    header: {
        height: 200,
        position: 'relative',
    },
    tournamentImage: {
        width: '100%',
        height: '100%',
    },
    headerOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: 20,
    },
    tournamentTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 4,
    },
    tournamentSubtitle: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.8)',
    },
    tabContent: {
        padding: 16,
    },
    infoSection: {
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
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    infoLabel: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
        textAlign: 'right',
        flex: 1,
        marginLeft: 16,
    },
    statusActive: {
        color: '#28a745',
    },
    statsSection: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: -8,
    },
    statCard: {
        width: '50%',
        padding: 8,
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#1a237e',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    progressContainer: {
        marginTop: 16,
    },
    progressLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    progressBar: {
        height: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#1a237e',
        borderRadius: 4,
    },
    comingSoonContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    comingSoon: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    comingSoonText: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 8,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 32,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        color: '#666',
    },
    // ESTILOS PARA PARTIDOS
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
    setsRowComplete: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    setBox: {
        alignItems: 'center',
        flex: 1,
    },
    setLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        fontWeight: '600',
    },
    setScore: {
        fontSize: 16,
        color: '#1a237e',
        fontWeight: 'bold',
    },
    // ESTILOS PARA TARJETAS DE EQUIPOS
    teamCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    teamCardLogo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    teamCardInfo: {
        flex: 1,
    },
    teamCardName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    teamCardGroup: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a237e',
        marginBottom: 4,
    },
    teamCardLocation: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    teamCardCoach: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default TournamentDetailScreen;