import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons'; // Importamos iconos
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

type HeadProps = {
    onPress?: (valor: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D') => void;
    seleccionado: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D';
    lightColor?: string;
    darkColor?: string;
};


export default function HeaderDias({
    onPress,
    seleccionado, // Recibimos el valor actual como prop
}: HeadProps) {
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const textColor = useThemeColor({ light: '#111111', dark: '#ffffff' }, 'text');
    const activeColor = '#007AFF';

    const botones = [
        { id: 'L', label: 'Lunes', icon: 'calendar-outline' },
        { id: 'M', label: 'Martes', icon: 'calendar-outline' },
        { id: 'MI', label: 'Miércoles', icon: 'calendar-outline' },
        { id: 'J', label: 'Jueves', icon: 'calendar-outline' }, // Cambié IDs para que sean únicos
        { id: 'V', label: 'Viernes', icon: 'calendar-outline' },
        { id: 'S', label: 'Sábado', icon: 'calendar-outline' },
        { id: 'D', label: 'Domingo', icon: 'calendar-outline' },
    ];
    const manejarPresion = (id: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D' ) => {
        if (onPress) {
            onPress(id);
        }
    };
    return (
        <View style={styles.wrapper}>
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {botones.map((boton) => {
                    const esActivo = seleccionado === boton.id;
                    return (
                        <Pressable
                            key={boton.label} // Usa label o un ID único
                            onPress={() => manejarPresion(boton.id as any)}
                            style={[
                                styles.card,
                                {
                                    backgroundColor: esActivo ? activeColor : backgroundColor,
                                    height: esActivo ? 45 : 35,
                                    borderColor: esActivo ? activeColor : '#ddd'
                                },
                            ]}
                        >
                            <View style={styles.content}>
                                <Text style={[styles.texto, { color: esActivo ? '#fff' : textColor }]}>
                                    {boton.label}
                                </Text>
                                <Ionicons
                                    name={boton.icon as any}
                                    size={16}
                                    color={esActivo ? "#fff" : "#acaaaaaf"}
                                    style={styles.icono}
                                />
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        height: 50, // Altura suficiente para que el botón activo no se corte
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        gap: 2, // Espaciado entre días
        paddingVertical: 5,
    },
    card: {
        paddingHorizontal: 10, 
        marginRight: 5, // Espacio entre cada tarjeta (más fiable que gap en ScrollView antiguos)
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 3.84,
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    texto: {
        fontSize: 12,
        fontWeight: 'bold',
    },
    icono: {
        marginLeft: 6,
    },
});
