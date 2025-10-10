// src/components/ScrollableTabs.tsx
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    StyleSheet,
} from 'react-native';

export interface Tab {
    key: string;
    title: string;
}

interface ScrollableTabsProps {
    tabs: Tab[];
    activeTab: string;
    onTabPress: (tabKey: string) => void;
}

const ScrollableTabs: React.FC<ScrollableTabsProps> = ({
    tabs,
    activeTab,
    onTabPress,
}) => {
    return (
        <View style={styles.container}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
                bounces={false}
            >
                {tabs.map((tab, index) => {
                    const isActive = activeTab === tab.key;
                    const isFirst = index === 0;
                    const isLast = index === tabs.length - 1;

                    return (
                        <TouchableOpacity
                            key={tab.key}
                            style={[
                                styles.tabButton,
                                isFirst && styles.firstTab,
                                isLast && styles.lastTab,
                            ]}
                            onPress={() => onTabPress(tab.key)}
                            activeOpacity={0.7}
                        >
                            <Text
                                style={[
                                    styles.tabButtonText,
                                    isActive && styles.activeTabButtonText,
                                ]}
                            >
                                {tab.title}
                            </Text>
                            {isActive && <View style={styles.activeIndicator} />}
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    scrollContent: {
        paddingHorizontal: 4,
    },
    tabButton: {
        paddingVertical: 16,
        paddingHorizontal: 20,
        position: 'relative',
    },
    firstTab: {
        paddingLeft: 16,
    },
    lastTab: {
        paddingRight: 16,
    },
    tabButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    activeTabButtonText: {
        color: '#1a237e',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 0,
        left: 20,
        right: 20,
        height: 3,
        backgroundColor: '#1a237e',
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
    },
});

export default ScrollableTabs;