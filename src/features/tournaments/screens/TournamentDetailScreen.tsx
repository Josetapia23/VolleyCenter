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
const HEADER_COLLAPSED_HEIGHT = 60;

const TournamentDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { tournament } = route.params;
    const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<TabKey>('info');

    const scrollY = useRef(new Animated.Value(0)).current;
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

    // Animación del header
    const headerHeight = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [HEADER_EXPANDED_HEIGHT, HEADER_COLLAPSED_HEIGHT],
        extrapolate: 'clamp',
    });

    const imageOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const imageSize = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [80, 0],
        extrapolate: 'clamp',
    });

    const titleFontSize = scrollY.interpolate({
        inputRange: [0, 100],
        outputRange: [20, 16],
        extrapolate: 'clamp',
    });

    const subtitleOpacity = scrollY.interpolate({
        inputRange: [0, 50],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    return (
        <View style={styles.container}>
            {/* Header Colapsable */}
            <Animated.View style={[styles.header, { height: headerHeight }]}>
                <View style={styles.headerContent}>
                    <Animated.View
                        style={[
                            styles.imageContainer,
                            {
                                opacity: imageOpacity,
                                width: imageSize,
                                height: imageSize,
                            }
                        ]}
                    >
                        <Image
                            source={{ uri: tournament.foto_torneo }}
                            style={styles.tournamentImage}
                            resizeMode="cover"
                        />
                    </Animated.View>

                    <View style={styles.headerInfo}>
                        <Animated.Text
                            style={[
                                styles.tournamentTitle,
                                { fontSize: titleFontSize }
                            ]}
                            numberOfLines={1}
                        >
                            {tournament.nombre}
                        </Animated.Text>

                        <Animated.View style={{ opacity: subtitleOpacity }}>
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
                        </Animated.View>
                    </View>
                </View>
            </Animated.View>

            <ScrollableTabs tabs={tabs} activeTab={activeTab} onTabPress={handleTabPress} />

            <Animated.ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                onScroll={Animated.event(
                    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
                    { useNativeDriver: false }
                )}
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
    imageContainer: {
        marginRight: theme.spacing.md,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
    },
    tournamentImage: {
        width: '100%',
        height: '100%',
    },
    headerInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    tournamentTitle: {
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
