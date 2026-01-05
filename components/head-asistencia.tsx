import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from './themed-text'; // Tu componente de texto

interface HeaderProps {
    title: string;
    showSearch?: boolean;
    showCAlendar?: boolean;
    onEventBtn?: () => void;
    onBackPress?: () => void;
}

export function CustomHeader({ title, showSearch = true, showCAlendar = false, onEventBtn, onBackPress }: HeaderProps) {
    const insets = useSafeAreaInsets(); // Para manejar el notch del iPhone y Android

    return (
        <View style={[styles.container]}>
            <View style={styles.content}>
                {/* LADO IZQUIERDO: Botón Atrás */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={onBackPress}
                >
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                {/* CENTRO: Título */}
                <View style={styles.titleContainer}>
                    <ThemedText type="subtitle" style={styles.title} numberOfLines={1}>
                        {title}
                    </ThemedText>
                </View>

                {/* LADO DERECHO: Botón Búsqueda o Espacio vacío */}
                <View style={styles.rightContainer}>
                    {showSearch && (
                        <TouchableOpacity style={styles.button} onPress={onEventBtn}>
                            <Ionicons name="search-outline" size={24} color="#fff" />
                        </TouchableOpacity>
                    )}
                    {showCAlendar && (<>
                        <TouchableOpacity style={styles.button} onPress={onEventBtn}>
                            <Ionicons name="calendar" size={24} color="#fff" />
                        </TouchableOpacity>
                        <Text style={styles.textBtn}>Histórico</Text>
                        </>
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#214950', // Tu color de tema
        width: '100%',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
    },
    content: {
        height: 56, // Altura estándar de AppBar
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 8,
    },
    button: {
        width: 44,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 22,
    },
    titleContainer: {
        flex: 2, // Toma más espacio que los botones laterales
        alignItems: 'center',
    },
    title: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    rightContainer: {
        flex: 1,
        alignItems: 'flex-end',
    },
    textBtn:{
        textAlign:'center',
        backgroundColor:"#9e9e9e7c",
        borderColor:'#e7e7e7b2',
        color:'#000000ff',
        fontSize:10,
        fontWeight:'bold',
        padding:4,
        borderRadius:3,
    }
});
