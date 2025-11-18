
// src/features/tournaments/screens/TournamentListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { Tournament } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TournamentCard } from '../components';
import { LoadingSpinner, EmptyState } from '../../../shared/components';

type TournamentListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: TournamentListScreenNavigationProp;
}

const TournamentListScreen: React.FC<Props> = ({ navigation }) => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadTournaments();
    }, []);

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

    const onRefresh = () => {
        setRefreshing(true);
        loadTournaments();
    };

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
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
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
});

export default TournamentListScreen;