// src/shared/hooks/useTournaments.ts
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { Tournament } from '../../types/tournament';
import TournamentService from '../../services/api';

export const useTournaments = () => {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadTournaments = async (showAlert: boolean = true) => {
        try {
            const data = await TournamentService.getActiveTournaments();
            setTournaments(data);
            setError(null);
        } catch (err) {
            const errorMessage = 'No se pudieron cargar los torneos';
            setError(errorMessage);
            if (showAlert) {
                Alert.alert('Error', errorMessage);
            }
            console.error('Error loading tournaments:', err);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const refresh = () => {
        setRefreshing(true);
        loadTournaments(false);
    };

    useEffect(() => {
        loadTournaments();
    }, []);

    return {
        tournaments,
        loading,
        refreshing,
        error,
        refresh,
        reload: loadTournaments,
    };
};
