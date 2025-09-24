// src/screens/TournamentDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { Tournament, TournamentDetail } from '../types/tournament';

type TournamentDetailScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'TournamentDetail'
>;
type TournamentDetailScreenRouteProp = RouteProp<
    RootStackParamList,
    'TournamentDetail'
>;

interface Props {
    navigation: TournamentDetailScreenNavigationProp;
    route: TournamentDetailScreenRouteProp;
}

const TournamentDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tournament } = route.params;
    const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'info' | 'standings' | 'matches'>('info');

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const TabButton = ({
        title,
        isActive,
        onPress
    }: {
        title: string;
        isActive: boolean;
        onPress: () => void;
    }) => (
        <TouchableOpacity
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            onPress={onPress}
        >
            <Text style={[styles.tabButtonText, isActive && styles.activeTabButtonText]}>
                {title}
            </Text>
        </TouchableOpacity>
    );

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
                        <View
                            style={[styles.progressFill, { width: `${tournament.progreso}%` }]}
                        />
                    </View>
                </View>
            </View>
        </View>
    );

    const StandingsTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Tabla de posiciones próximamente</Text>
        </View>
    );

    const MatchesTab = () => (
        <View style={styles.tabContent}>
            <Text style={styles.comingSoon}>Lista de partidos próximamente</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header del torneo */}
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

                {/* Tabs */}
                <View style={styles.tabsContainer}>
                    <TabButton
                        title="Información"
                        isActive={activeTab === 'info'}
                        onPress={() => setActiveTab('info')}
                    />
                    <TabButton
                        title="Posiciones"
                        isActive={activeTab === 'standings'}
                        onPress={() => setActiveTab('standings')}
                    />
                    <TabButton
                        title="Partidos"
                        isActive={activeTab === 'matches'}
                        onPress={() => setActiveTab('matches')}
                    />
                </View>

                {/* Contenido de tabs */}
                {activeTab === 'info' && <InfoTab />}
                {activeTab === 'standings' && <StandingsTab />}
                {activeTab === 'matches' && <MatchesTab />}
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
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'white',
        elevation: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    tabButton: {
        flex: 1,
        paddingVertical: 16,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    activeTabButton: {
        borderBottomColor: '#1a237e',
    },
    tabButtonText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666',
    },
    activeTabButtonText: {
        color: '#1a237e',
        fontWeight: 'bold',
    },
    tabContent: {
        padding: 16,
    },
    infoSection: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginBottom: 16,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 16,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
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
        flex: 1,
        textAlign: 'right',
    },
    statusActive: {
        color: '#4caf50',
        fontWeight: 'bold',
    },
    statsSection: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        elevation: 2,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    statCard: {
        width: '48%',
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginTop: 4,
    },
    progressContainer: {
        marginTop: 8,
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
        backgroundColor: '#4caf50',
    },
    comingSoon: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginTop: 40,
        fontStyle: 'italic',
    },
});

export default TournamentDetailScreen;