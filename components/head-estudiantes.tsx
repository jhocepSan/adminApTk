import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons'; // Importamos iconos
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type HeadProps = {
    onPress?: (valor: 'F' | 'M' | 'A') => void;
    seleccionado: 'F' | 'M' | 'A';
    lightColor?: string;
    darkColor?: string;
};


export default function HeaderEstudiantes({
    onPress,
    seleccionado, // Recibimos el valor actual como prop
}: HeadProps) {
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const textColor = useThemeColor({ light: '#111111', dark: '#ffffff' }, 'text');
    const activeColor = '#007AFF';

    const botones = [
        { id: 'F', label: 'MUJERES', icon: 'woman' },
        { id: 'M', label: 'VARONES', icon: 'man' },
        { id: 'A', label: 'TODOS', icon: 'people' },
    ] as const;

    const manejarPresion = (id: 'F' | 'M' | 'A') => {
        if (onPress) {
            onPress(id);
        }
    };

    return (
        <View style={styles.contenedor}>
            {botones.map((boton) => {
                const esActivo = seleccionado === boton.id;

                return (
                    <Pressable
                        key={boton.id}
                        onPress={() => manejarPresion(boton.id)} // Llama directamente a la función del padre
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
                                size={18}
                                color={esActivo ? "#fff" : "#acaaaaaf"}
                                style={styles.icono}
                            />
                        </View>
                    </Pressable>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-start', // Alinea al tope para que el crecimiento sea hacia abajo
        gap: 8,
        paddingHorizontal: 10,
        height: 37, // Espacio suficiente para la animación de crecimiento
    },
    card: {
        flex: 1,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // Sombra suave para resaltar la selección
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
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
