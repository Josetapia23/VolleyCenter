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
import { theme } from '../../../shared/theme';

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
        backgroundColor: theme.colors.background,
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
        backgroundColor: theme.colors.backgroundOverlay,
        padding: theme.spacing.lg,
    },
    tournamentTitle: {
        fontSize: theme.typography.fontSize.xxl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
        marginBottom: theme.spacing.xs,
    },
    tournamentSubtitle: {
        fontSize: theme.typography.fontSize.base,
        color: 'rgba(255, 255, 255, 0.8)',
    },
});

export default TournamentDetailScreen;
