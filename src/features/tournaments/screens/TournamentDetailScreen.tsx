// src/features/tournaments/screens/TournamentDetailScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { TournamentDetail } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { ScrollableTabs, Tab } from '../../../shared/components';
import { InfoTab, TeamsTab, StandingsTab, MatchesTab } from '../tabs';
import { theme, getStatusColor } from '../../../shared/theme';

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
    const [activeTab, setActiveTab] = useState<TabKey>('standings');
    const [tabTransitioning, setTabTransitioning] = useState(false);

    const tabs: Tab[] = [
        { key: 'standings', title: 'Posiciones' },
        { key: 'matches', title: 'Partidos' },
        { key: 'teams', title: 'Equipos' },
        { key: 'info', title: 'Información' },
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

    const handleTabPress = (tabKey: string) => {
        if (tabKey === activeTab) return; // No hacer nada si ya está en la tab activa

        setTabTransitioning(true);

        // Pequeño delay para mostrar el indicador de carga antes de cambiar
        setTimeout(() => {
            setActiveTab(tabKey as TabKey);
            setTabTransitioning(false);
        }, 100);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InfoTab tournament={tournament} />;
            case 'teams':
                return <TeamsTab tournamentId={tournament.id} />;
            case 'standings':
                return <StandingsTab tournamentId={tournament.id} />;
            case 'matches':
                return <MatchesTab tournamentDetail={tournamentDetail} loading={loading} />;
            default:
                return <InfoTab tournament={tournament} />;
        }
    };

    return (
        <View style={styles.container}>
            {/* Header estático */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <Image
                        source={{ uri: tournament.foto_torneo }}
                        style={styles.tournamentImage}
                        resizeMode="cover"
                    />

                    <View style={styles.headerInfo}>
                        <Text style={styles.tournamentTitle} numberOfLines={1}>
                            {tournament.nombre}
                        </Text>

                        <Text style={styles.tournamentLocation} numberOfLines={1}>
                            📍 {tournament.municipio}, {tournament.departamento}
                        </Text>

                        <View style={styles.statusContainer}>
                            <View
                                style={[
                                    styles.statusBadge,
                                    { backgroundColor: getStatusColor(tournament.estado) }
                                ]}
                            >
                                <Text style={styles.statusText}>{tournament.estado}</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollableTabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

            <View style={styles.content}>
                {tabTransitioning ? (
                    <View style={styles.transitionLoader}>
                        <View style={styles.loaderContainer}>
                            <View style={styles.loaderBackground}>
                                <View style={styles.loaderContent}>
                                    <View style={styles.spinnerWrapper}>
                                        {/* Spinner animado con puntos */}
                                        <View style={styles.dotsContainer}>
                                            <View style={[styles.dot, styles.dot1]} />
                                            <View style={[styles.dot, styles.dot2]} />
                                            <View style={[styles.dot, styles.dot3]} />
                                        </View>
                                    </View>
                                    <Text style={styles.loaderText}>Cargando...</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ) : (
                    renderTabContent()
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
    },
    transitionLoader: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: theme.colors.background,
    },
    loaderContainer: {
        alignItems: 'center',
    },
    loaderBackground: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        padding: theme.spacing.xl,
        ...theme.getCardShadow('md'),
    },
    loaderContent: {
        alignItems: 'center',
    },
    spinnerWrapper: {
        marginBottom: theme.spacing.md,
    },
    dotsContainer: {
        flexDirection: 'row',
        gap: theme.spacing.sm,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dot: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
    },
    dot1: {
        opacity: 0.4,
    },
    dot2: {
        opacity: 0.7,
    },
    dot3: {
        opacity: 1,
    },
    loaderText: {
        fontSize: theme.typography.fontSize.md,
        color: theme.colors.textSecondary,
        fontWeight: theme.typography.fontWeight.medium,
    },
    header: {
        height: 120,
        backgroundColor: theme.colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.getCardShadow('sm'),
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: theme.spacing.base,
        height: '100%',
    },
    tournamentImage: {
        width: 80,
        height: 80,
        borderRadius: theme.borderRadius.lg,
        marginRight: theme.spacing.md,
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    tournamentTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.xs,
    },
    tournamentLocation: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.xs,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        borderRadius: theme.borderRadius.xl,
        alignSelf: 'flex-start',
    },
    statusText: {
        fontSize: theme.typography.fontSize.xs,
        color: theme.colors.textInverse,
        fontWeight: theme.typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
});

export default TournamentDetailScreen;
