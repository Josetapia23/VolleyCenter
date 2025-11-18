// src/shared/hooks/useTournamentDetail.ts
import { useState, useEffect } from 'react';
import { Tournament, TournamentDetail } from '../../types/tournament';
import TournamentService from '../../services/api';

interface UseTournamentDetailProps {
    tournament: Tournament;
}

export const useTournamentDetail = ({ tournament }: UseTournamentDetailProps) => {
    const [tournamentDetail, setTournamentDetail] = useState<TournamentDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadTournamentDetail = async () => {
        try {
            setLoading(true);
            const data = await TournamentService.getTournamentById(tournament.id);
            setTournamentDetail(data);
            setError(null);
        } catch (err) {
            console.error('Error loading tournament detail:', err);
            setError('No se pudo cargar el detalle del torneo');
            // Fallback con datos básicos
            const basicTournamentDetail: TournamentDetail = {
                ...tournament,
                partidos: []
            };
            setTournamentDetail(basicTournamentDetail);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTournamentDetail();
    }, [tournament.id]);

    return {
        tournamentDetail,
        loading,
        error,
        reload: loadTournamentDetail,
    };
};
