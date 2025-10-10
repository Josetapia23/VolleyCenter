// src/shared/components/EmptyState.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface EmptyStateProps {
    message: string;
    subtitle?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, subtitle }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.message}>{message}</Text>
            {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
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
    message: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
    subtitle: {
        fontSize: 14,
        color: '#bbb',
        textAlign: 'center',
        marginTop: 8,
    },
});

export default EmptyState;