// src/shared/components/Select.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    Pressable,
} from 'react-native';
import { theme } from '../theme';

export interface SelectOption {
    label: string;
    value: string | null;
    count?: number;
}

interface SelectProps {
    options: SelectOption[];
    value: string | null;
    onChange: (value: string | null) => void;
    placeholder?: string;
    label?: string;
}

const Select: React.FC<SelectProps> = ({
    options,
    value,
    onChange,
    placeholder = 'Seleccionar...',
    label,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const selectedOption = options.find(opt => opt.value === value);
    const displayText = selectedOption?.label || placeholder;

    const handleSelect = (optionValue: string | null) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setIsOpen(true)}
                activeOpacity={0.7}
            >
                <Text
                    style={[
                        styles.selectText,
                        !selectedOption && styles.placeholderText
                    ]}
                >
                    {displayText}
                </Text>
                <Text style={styles.arrow}>▼</Text>
            </TouchableOpacity>

            <Modal
                visible={isOpen}
                transparent
                animationType="fade"
                onRequestClose={() => setIsOpen(false)}
            >
                <Pressable
                    style={styles.modalOverlay}
                    onPress={() => setIsOpen(false)}
                >
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>
                                {label || 'Seleccionar opción'}
                            </Text>
                            <TouchableOpacity
                                onPress={() => setIsOpen(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>✕</Text>
                            </TouchableOpacity>
                        </View>

                        <ScrollView style={styles.optionsList}>
                            {options.map((option, index) => (
                                <TouchableOpacity
                                    key={`${option.value}-${index}`}
                                    style={[
                                        styles.optionItem,
                                        option.value === value && styles.optionItemSelected,
                                    ]}
                                    onPress={() => handleSelect(option.value)}
                                    activeOpacity={0.7}
                                >
                                    <Text
                                        style={[
                                            styles.optionText,
                                            option.value === value && styles.optionTextSelected,
                                        ]}
                                    >
                                        {option.label}
                                    </Text>
                                    {option.count !== undefined && (
                                        <View style={styles.countBadge}>
                                            <Text style={styles.countText}>{option.count}</Text>
                                        </View>
                                    )}
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: theme.spacing.base,
    },
    label: {
        fontSize: theme.typography.fontSize.md,
        fontWeight: theme.typography.fontWeight.semibold,
        color: theme.colors.textPrimary,
        marginBottom: theme.spacing.sm,
    },
    selectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: theme.colors.backgroundCard,
        borderWidth: 1,
        borderColor: theme.colors.border,
        borderRadius: theme.borderRadius.md,
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        ...theme.getCardShadow('sm'),
    },
    selectText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.medium,
        flex: 1,
    },
    placeholderText: {
        color: theme.colors.textTertiary,
        fontWeight: theme.typography.fontWeight.normal,
    },
    arrow: {
        fontSize: theme.typography.fontSize.sm,
        color: theme.colors.textSecondary,
        marginLeft: theme.spacing.sm,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: theme.spacing.lg,
    },
    modalContent: {
        backgroundColor: theme.colors.backgroundCard,
        borderRadius: theme.borderRadius.lg,
        width: '100%',
        maxHeight: '70%',
        ...theme.getCardShadow('lg'),
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: theme.spacing.base,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    modalTitle: {
        fontSize: theme.typography.fontSize.lg,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textPrimary,
        flex: 1,
    },
    closeButton: {
        padding: theme.spacing.sm,
    },
    closeButtonText: {
        fontSize: theme.typography.fontSize.xl,
        color: theme.colors.textSecondary,
        lineHeight: theme.typography.fontSize.xl,
    },
    optionsList: {
        maxHeight: 400,
    },
    optionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: theme.spacing.base,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
    },
    optionItemSelected: {
        backgroundColor: theme.colors.primary + '15',
    },
    optionText: {
        fontSize: theme.typography.fontSize.base,
        color: theme.colors.textPrimary,
        fontWeight: theme.typography.fontWeight.medium,
        flex: 1,
    },
    optionTextSelected: {
        color: theme.colors.primary,
        fontWeight: theme.typography.fontWeight.bold,
    },
    countBadge: {
        backgroundColor: theme.colors.primary,
        borderRadius: theme.borderRadius.round,
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.xs,
        minWidth: 32,
        alignItems: 'center',
    },
    countText: {
        fontSize: theme.typography.fontSize.sm,
        fontWeight: theme.typography.fontWeight.bold,
        color: theme.colors.textInverse,
    },
});

export default Select;
