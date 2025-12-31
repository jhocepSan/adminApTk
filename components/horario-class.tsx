import { ThemedText } from '@/components/themed-text';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

interface HorarioProps {
    hora: string;
    actividad: string;
    estaOcupado: boolean;
    onPress?: () => void;
}

export function FilaHorario({ hora, actividad, estaOcupado, onPress }: HorarioProps) {
    // Color dinámico según estado
    const statusColor = estaOcupado ? '#FF3B30' : '#4CD964';

    return (
        <View style={styles.fila}>
            {/* Lado Izquierdo: Hora e Indicador */}
            <View style={styles.contenedorHora}>
                <ThemedText style={styles.textoHora}>{hora}</ThemedText>
                <View style={[styles.indicador, { backgroundColor: statusColor }]} />
            </View>

            {/* Lado Derecho: Contenido */}
            <Pressable
                onPress={onPress}
                style={({ pressed }) => [
                    styles.tarjeta,
                    {
                        borderLeftColor: statusColor,
                        borderTopColor: statusColor,
                        opacity: pressed ? 0.7 : 1, // 3. Feedback visual al tocar
                        transform: [{ scale: pressed ? 0.98 : 1 }] // Efecto de presión
                    }
                ]}
            >
                <ThemedText type="defaultSemiBold">{actividad}</ThemedText>
                <ThemedText style={styles.textoEstado}>
                    {estaOcupado ? 'Ocupado' : 'Disponible'}
                </ThemedText>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    fila: {
        flexDirection: 'row',
        marginBottom: 15,
        paddingHorizontal: 16,
        alignItems: 'center',
    },
    contenedorHora: {
        width: 60,
        alignItems: 'center',
        position: 'relative',
    },
    textoHora: {
        fontSize: 14,
        fontWeight: '600',
    },
    indicador: {
        width: 4,
        height: '100%',
        position: 'absolute',
        right: 0,
        borderRadius: 2,
        opacity: 0.5,
    },
    tarjeta: {
        flex: 1,
        marginLeft: 15,
        padding: 12,
        borderRadius: 8,
        borderLeftWidth: 5,
        borderTopWidth: 1,
        // Sombra sutil
        elevation: 2,
        shadowColor: '#8a8686e7',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    textoEstado: {
        fontSize: 12,
        opacity: 0.6,
        marginTop: 4,
    }
});
