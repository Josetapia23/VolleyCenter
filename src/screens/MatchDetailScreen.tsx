// src/screens/MatchDetailScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type MatchDetailScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'MatchDetail'
>;
type MatchDetailScreenRouteProp = RouteProp<RootStackParamList, 'MatchDetail'>;

interface Props {
    navigation: MatchDetailScreenNavigationProp;
    route: MatchDetailScreenRouteProp;
}

const MatchDetailScreen: React.FC<Props> = ({ navigation, route }) => {
    const { matchId } = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Detalle del Partido</Text>
            <Text style={styles.subtitle}>Match ID: {matchId}</Text>
            <Text style={styles.comingSoon}>Próximamente</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 16,
    },
    comingSoon: {
        fontSize: 16,
        color: '#666',
        fontStyle: 'italic',
    },
});

export default MatchDetailScreen;