// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Tournament } from '../types/tournament';

// Importar las pantallas (las crearemos después)
import HomeScreen from '../screens/HomeScreen';
import TournamentDetailScreen from '../screens/TournamentDetailScreen';
import MatchDetailScreen from '../screens/MatchDetailScreen';

// Definir los tipos de parámetros para cada pantalla
export type RootStackParamList = {
    Home: undefined;
    TournamentDetail: { tournament: Tournament };
    MatchDetail: { matchId: number };
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
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
                    component={HomeScreen}
                    options={{
                        title: 'VolleyCenter',
                        headerStyle: {
                            backgroundColor: '#1a237e',
                        },
                    }}
                />
                <Stack.Screen
                    name="TournamentDetail"
                    component={TournamentDetailScreen}
                    options={({ route }) => ({
                        title: route.params.tournament.nombre,
                    })}
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