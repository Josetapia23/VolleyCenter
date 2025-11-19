// src/features/tournaments/screens/TournamentListScreen.tsx
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    RefreshControl,
    Alert,
    TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/AppNavigator';
import { Tournament } from '../../../types/tournament';
import TournamentService from '../../../services/api';
import { TournamentCard } from '../components';
import { LoadingSpinner, EmptyState, CreateTournamentModal } from '../../../shared/components';
import { theme } from '../../../shared/theme';

type TournamentListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
    navigation: TournamentListScreenNavigationProp;
}

const TournamentListScreen: React.FC<Props> = ({ navigation }) => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(true); // Se muestra al abrir la app

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
            {/* Botón flotante para abrir modal */}
            <TouchableOpacity
                style={styles.floatingButton}
                onPress={() => setShowCreateModal(true)}
                activeOpacity={0.8}
            >
                <Text style={styles.floatingButtonIcon}>✨</Text>
            </TouchableOpacity>

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

            {/* Modal de crear torneo */}
            <CreateTournamentModal
                visible={showCreateModal}
                onClose={() => setShowCreateModal(false)}
            />
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
    floatingButton: {
        position: 'absolute',
        top: theme.spacing.base,
        right: theme.spacing.base,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 100,
        ...theme.getCardShadow('lg'),
    },
    floatingButtonIcon: {
        fontSize: 28,
    },
});

export default TournamentListScreen;
