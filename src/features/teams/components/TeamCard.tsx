// src/features/teams/components/TeamCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { Team } from '../../../types/tournament';

interface TeamCardProps {
    team: Team;
    onPress?: () => void;
}

const TeamCard: React.FC<TeamCardProps> = ({ team, onPress }) => {
    const Container = onPress ? TouchableOpacity : View;

    return (
        <Container
            style={styles.teamCard}
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
        >
            <Image
                source={{ uri: team.logo || 'https://via.placeholder.com/80' }}
                style={styles.teamLogo}
            />
            <View style={styles.teamInfo}>
                <Text style={styles.teamName}>{team.nombre}</Text>
                {team.grupo && (
                    <Text style={styles.teamGroup}>Grupo {team.grupo}</Text>
                )}
                <Text style={styles.teamLocation}>
                    {team.municipio}, {team.departamento}
                </Text>
                {team.entrenador && (
                    <Text style={styles.teamCoach}>DT: {team.entrenador}</Text>
                )}
            </View>
        </Container>
    );
};

const styles = StyleSheet.create({
    teamCard: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    teamLogo: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 16,
    },
    teamInfo: {
        flex: 1,
    },
    teamName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    teamGroup: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1a237e',
        marginBottom: 4,
    },
    teamLocation: {
        fontSize: 13,
        color: '#666',
        marginBottom: 4,
    },
    teamCoach: {
        fontSize: 12,
        color: '#999',
        fontStyle: 'italic',
    },
});

export default TeamCard;