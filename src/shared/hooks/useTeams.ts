// src/shared/hooks/useTeams.ts
import { useState, useEffect } from 'react';
import { Team } from '../../types/tournament';
import TournamentService from '../../services/api';

interface UseTeamsProps {
    tournamentId: number;
}

export const useTeams = ({ tournamentId }: UseTeamsProps) => {
    const [teams, setTeams] = useState<Team[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTeams = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentTeams(tournamentId);
            setTeams(data);
            setError(null);
        } catch (err) {
            console.error('Error loading teams:', err);
            setError('No se pudieron cargar los equipos');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTeams();
    }, [tournamentId]);

    return {
        teams,
        loading,
        error,
        reload: loadTeams,
    };
};
