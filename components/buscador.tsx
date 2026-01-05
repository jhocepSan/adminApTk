import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';

interface BuscadorProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    onClear?: () => void;
    showAddButton : boolean; // Valor por defecto
    onAddPress?:()=>void;
    onLoadPress?:()=>void;
}

export default function Buscador({
    value,
    onChangeText,
    placeholder = "Buscar...",
    onClear,
    showAddButton = false, // Valor por defecto
    onAddPress,
    onLoadPress,
}: BuscadorProps) {

    const backgroundColor = useThemeColor({ light: '#c4c2c256', dark: '#4f4f50ce' }, 'background');
    const textColor = useThemeColor({ light: '#000', dark: '#fff' }, 'text');
    const accentColor = '#5a9958ff';
    const reloadColor = '#ff9d1da6';
    return (
        <View style={styles.mainWrapper}>
            <View style={[styles.container, { backgroundColor ,flex:1}]}>
                <Ionicons name="search" size={20} color="#8e8e93" style={styles.icon} />
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor="#8e8e93"
                    autoCapitalize="none"
                    clearButtonMode="while-editing" // Solo iOS
                />

                {value.length > 0 && (
                    <Pressable onPress={onClear} style={styles.clearButton}>
                        <Ionicons name="close-circle" size={18} color="#8e8e93" />
                    </Pressable>
                )}
            </View>
            
            {showAddButton && (
                <Pressable
                    onPress={onLoadPress}
                    style={[styles.addButton, { backgroundColor: reloadColor }]}
                >
                    <Ionicons name="reload-outline" size={24} color="#fff" />
                </Pressable>
            )}
            {showAddButton && (
                <Pressable
                    onPress={onAddPress}
                    style={[styles.addButton, { backgroundColor: accentColor }]}
                >
                    <Ionicons name="person-add" size={24} color="#fff" />
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    mainWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 9,
        marginVertical: 10,
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        paddingHorizontal: 9,
        height: 45,
    },
    addButton: {
        width: 45,
        height: 45,
        borderRadius: 22.5, // Mitad de 45 para círculo perfecto
        marginLeft: 10,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 3, // Sombra para Android
        shadowColor: '#000', // Sombra para iOS
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    icon: {
        marginRight: 8,
    },
    input: {
        flex: 1,
        fontSize: 16,
        height: '100%',
    },
    clearButton: {
        padding: 4,
    },
});
