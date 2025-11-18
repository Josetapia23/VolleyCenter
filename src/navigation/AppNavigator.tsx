// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Tournament, Match } from '../types/tournament';

// Importar screens desde features
import {
    TournamentListScreen,
    TournamentDetailScreen
} from '../features/tournaments/screens';
import { MatchDetailScreen } from '../features/matches/screens';

export type RootStackParamList = {
    Home: undefined;
    TournamentDetail: { tournament: Tournament };
    MatchDetail: { matchId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Home"
                screenOptions={{
                    headerStyle: {
                        backgroundColor: '#1a237e',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            >
                <Stack.Screen
                    name="Home"
                    component={TournamentListScreen}
                    options={{
                        title: 'VolleyCenter',
                    }}
                />
                <Stack.Screen
                    name="TournamentDetail"
                    component={TournamentDetailScreen}
                    options={{
                        title: 'Detalle del Torneo',
                    }}
                />
                <Stack.Screen
                    name="MatchDetail"
                    component={MatchDetailScreen}
                    options={{
                        title: 'Detalle del Partido',
                    }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;