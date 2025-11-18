// src/features/tournaments/screens/TournamentDetailScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    ScrollView,
    Image,
    StyleSheet,
    Animated,
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

const HEADER_EXPANDED_HEIGHT = 120;
const HEADER_COLLAPSED_HEIGHT = 0;

const TournamentDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tournament } = route.params;
    const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('info');

    const scrollY = useRef(new Animated.Value(0)).current;
    const headerVisible = useRef(new Animated.Value(1)).current;
    const lastScrollY = useRef(0);

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

    const handleTabPress = (tabKey: string) => {
        setActiveTab(tabKey as TabKey);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case 'info':
                return <InfoTab tournament={tournament} />;
            case 'teams':
                return <TeamsTab tournamentId={tournament.id} />;
            case 'standings':
                return <StandingsTab />;
            case 'matches':
                return <MatchesTab tournamentDetail={tournamentDetail} loading={loading} />;
            default:
                return <InfoTab tournament={tournament} />;
        }
    };

    // Detectar dirección del scroll - con animación más fluida
    const handleScroll = (event: any) => {
        const currentScrollY = event.nativeEvent.contentOffset.y;
        const delta = currentScrollY - lastScrollY.current;

        // Solo cambiar si el scroll es significativo (más de 3px para más respuesta)
        if (Math.abs(delta) > 3) {
            if (delta > 0 && currentScrollY > 30) {
                // Scroll hacia abajo - ocultar header
                Animated.spring(headerVisible, {
                    toValue: 0,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }).start();
            } else if (delta < 0 || currentScrollY < 30) {
                // Scroll hacia arriba o cerca del top - mostrar header
                Animated.spring(headerVisible, {
                    toValue: 1,
                    useNativeDriver: true,
                    tension: 100,
                    friction: 10,
                }).start();
            }
            lastScrollY.current = currentScrollY;
        }

        scrollY.setValue(currentScrollY);
    };

    // Interpolar solo opacidad con native driver para mejor performance
    const headerOpacity = headerVisible.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
    });

    // Transformar usando translateY en vez de height para mejor performance
    const headerTranslateY = headerVisible.interpolate({
        inputRange: [0, 1],
        outputRange: [-HEADER_EXPANDED_HEIGHT, 0],
    });

    return (
        <View style={styles.container}>
            {/* Header Colapsable - Se oculta completamente */}
            <Animated.View
                style={[
                    styles.header,
                    {
                        height: headerHeight,
                        opacity: headerOpacity,
                    }
                ]}
            >
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
            </Animated.View>

            <ScrollableTabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                {renderTabContent()}
            </Animated.ScrollView>
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
    header: {
        height: HEADER_EXPANDED_HEIGHT,
        backgroundColor: theme.colors.backgroundCard,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        ...theme.getCardShadow('sm'),
        overflow: 'hidden',
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
