import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { DIAS_SEMANA } from '../constants/typesdata';

type HeadProps = {
    onPress?: (valor: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D') => void;
    seleccionado: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D';
    lightColor?: string;
    darkColor?: string;
};

export default function HeaderDias({
    onPress,
    seleccionado,
}: HeadProps) {
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const textColor = useThemeColor({ light: '#111111', dark: '#ffffff' }, 'text');
    const activeColor = '#007AFF';
    
    // 1. REFS Y ESTADO PARA POSICIONES
    const scrollRef = useRef<ScrollView>(null);
    const [positions, setPositions] = useState<Record<string, number>>({});

    // 2. EFECTO DE AUTO-SCROLL
    useEffect(() => {
        if (positions[seleccionado] !== undefined) {
            scrollRef.current?.scrollTo({
                x: positions[seleccionado] - 20, // -20 para dar un pequeño margen izquierdo
                animated: true,
            });
        }
    }, [seleccionado, positions]);

    const manejarPresion = (id: 'L' | 'M' | 'MI' | 'J' | 'V' | 'S' | 'D' ) => {
        if (onPress) {
            onPress(id);
        }
    };

    return (
        <View style={styles.wrapper}>
            <ScrollView
                ref={scrollRef} // 3. ASIGNAR REF
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
            >
                {DIAS_SEMANA.map((boton) => {
                    const esActivo = seleccionado === boton.id;
                    return (
                        <Pressable
                            key={boton.id}
                            // 4. CAPTURAR POSICIÓN X
                            onLayout={(event: LayoutChangeEvent) => {
                                const { x } = event.nativeEvent.layout;
                                setPositions(prev => ({ ...prev, [boton.id]: x }));
                            }}
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
        height: 60, // Ajustado para evitar cortes en la sombra
    },
    scrollContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingHorizontal: 15,
        paddingVertical: 5,
    },
    card: {
        paddingHorizontal: 15, // Un poco más de padding para mejor UX
        marginRight: 8,
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
        fontSize: 13,
        fontWeight: 'bold',
    },
    icono: {
        marginLeft: 6,
    },
});
