// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Tournament } from '../types/tournament';

// Importar screens desde features
import {
    TournamentListScreen,
    TournamentDetailScreen
} from '../features/tournaments/screens';

export type RootStackParamList = {
    Home: undefined;
    TournamentDetail: { tournament: Tournament };
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;