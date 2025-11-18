// src/features/tournaments/screens/TournamentListScreen.tsx
import React from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { Tournament } from '../../../types/tournament';
import { TournamentCard } from '../components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';
import { useTournaments } from '../../../shared/hooks';
import { theme } from '../../../shared/theme';

type TournamentListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: TournamentListScreenNavigationProp;
}

const TournamentListScreen: React.FC<Props> = ({ navigation }) => {
    const { tournaments, loading, refreshing, refresh } = useTournaments();

    const handleTournamentPress = (tournament: Tournament) => {
        navigation.navigate('TournamentDetail', { tournament });
    };

    if (loading) {
        return <LoadingSpinner message="Cargando torneos..." />;
    }

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={refresh} />
                }
            >
                <Text style={styles.sectionTitle}>Todos los Torneos</Text>

                {tournaments.length > 0 ? (
                    tournaments.map((tournament) => (
                        <TournamentCard
                            key={tournament.id}
                            tournament={tournament}
                            onPress={() => handleTournamentPress(tournament)}
                        />
                    ))
                ) : (
                    <EmptyState
                        message="No hay torneos disponibles"
                        subtitle="Los torneos disponibles aparecerán aquí"
                    />
                )}
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
    scrollContent: {
        padding: theme.spacing.base,
    },
    sectionTitle: {
        fontSize: theme.typography.fontSize.xxl,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.primary,
        marginBottom: theme.spacing.base,
    },
});

export default TournamentListScreen;
