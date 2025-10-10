// src/features/tournaments/tabs/StandingsTab.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const StandingsTab: React.FC = () => {
    return (
        <View style={styles.tabContent}>
            <View style={styles.comingSoonContainer}>
                <Text style={styles.sectionTitle}>Tabla de Posiciones</Text>
                <Text style={styles.comingSoon}>Tabla de posiciones próximamente</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    tabContent: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 16,
    },
    comingSoonContainer: {
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 32,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    comingSoon: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default StandingsTab;