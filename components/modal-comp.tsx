import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { ThemedButton } from './themed-buton-icon';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

interface BaseModalProps {
    visible: boolean;
    onClose: () => void;
    title: string;
    onSave?: () => void;
    children: React.ReactNode;
    saveLabel?: string;
    showFooter?: boolean;
}

export const BaseModal = ({
    visible,
    onClose,
    title,
    onSave,
    children,
    saveLabel = "GUARDAR",
    showFooter = true
}: BaseModalProps) => {
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            statusBarTranslucent={true} // Cubre toda la pantalla incluso la barra de estado
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <ThemedView style={styles.content}>
                    {/* Header */}
                    <View style={styles.header}>
                        <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
                        <Pressable onPress={onClose} hitSlop={15}>
                            <Ionicons name="close" size={24} color="#ccc" />
                        </Pressable>
                    </View>

                    {/* Body - Scrollable por si el contenido es largo */}
                    <ScrollView
                        style={styles.body}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {children}
                    </ScrollView>

                    {/* Footer */}
                    {showFooter && (
                        <View style={styles.footer}>
                            <ThemedButton
                                title="CANCELAR"
                                onPress={onClose}
                                style={styles.btnCancel}
                            />
                            <ThemedButton
                                title={saveLabel}
                                onPress={onSave}
                                style={styles.btnSave}
                            />
                        </View>
                    )}
                </ThemedView>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.75)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    content: {
        width: '100%',
        maxWidth: 450,
        maxHeight: '85%',
        borderRadius: 24,
        padding: 5,
        backgroundColor: '#1a1a1a', // Forzado o usa tu tema
        elevation: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    body: {
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
    },
    btnCancel: {
        flex: 1,
        backgroundColor: '#444',
        height: 50,
        borderRadius: 12,
    },
    btnSave: {
        flex: 1,
        backgroundColor: '#214950',
        height: 50,
        borderRadius: 12,
    },
});
