import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { docenteCard } from '../constants/typesdata';

type UserCardProps = {
    info?: docenteCard;
    onPress?: () => void;
    onEdit?: (info: docenteCard) => void;
    onDelete?: (info: docenteCard) => void;
};

const DEFAULT_AVATAR = 'cdn-icons-png.flaticon.com';

export function DocenteCard({ info, onPress, onEdit, onDelete }: UserCardProps) {
    const genderColor = info?.genero === 'F' ? '#FF69B4' : '#4169E1';
    const backgroundColor = useThemeColor({ light: '#ffffff', dark: '#1c1c1e' }, 'background');
    const textColor = useThemeColor({ light: '#111', dark: '#eee' }, 'text');
    const borderColor = useThemeColor({ light: '#eee', dark: '#333' }, 'border');

    // Acción Derecha (Eliminar) con Reanimated
    const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
        const styleAnimation = useAnimatedStyle(() => ({
            transform: [{ translateX: interpolate(drag.value, [-100, 0], [0, 100]) }],
            opacity: interpolate(prog.value, [0, 1], [0, 1]),
        }));

        return (
            <Reanimated.View style={[styles.rightActionContainer, styleAnimation]}>
                <RectButton
                    style={styles.deleteButton}
                    onPress={() => onDelete?.(info!)}
                >
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="trash-outline" size={24} color="white" />
                        <Text style={styles.actionText}>Eliminar</Text>
                    </View>
                </RectButton>
            </Reanimated.View>
        );
    };

    // Acción Izquierda (Editar) con Reanimated
    const LeftAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
        const styleAnimation = useAnimatedStyle(() => ({
            transform: [{ translateX: interpolate(drag.value, [0, 100], [-100, 0]) }],
            opacity: interpolate(prog.value, [0, 1], [0, 1]),
        }));

        return (
            <Reanimated.View style={[styles.leftActionContainer, styleAnimation]}>
                <RectButton
                    style={styles.editButton}
                    onPress={() => {
                        console.log("Edit presionado", info);
                        if (info) onEdit?.(info);
                    }}
                >
                    {/* RectButton requiere que el contenido esté envuelto si usas estilos de centrado */}
                    <View style={{ alignItems: 'center' }}>
                        <Ionicons name="pencil-outline" size={24} color="white" />
                        <Text style={styles.actionText}>Editar</Text>
                    </View>
                </RectButton>
            </Reanimated.View>
        );
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <ReanimatedSwipeable
                friction={2}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                leftThreshold={40}
                renderRightActions={RightAction}
                renderLeftActions={LeftAction}
                containerStyle={styles.swipeableContainer}
            >
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => [
                        styles.card,
                        { backgroundColor, borderColor, opacity: pressed ? 0.9 : 1 },
                    ]}
                >
                    <View style={[styles.genderIndicator, { backgroundColor: genderColor }]} />

                    <Image
                        source={{ uri: info?.imagen || DEFAULT_AVATAR }}
                        style={[styles.avatar, { borderColor: genderColor, borderWidth: 2 }]}
                    />

                    <View style={styles.info}>
                        <Text style={[styles.name, { color: textColor }]} numberOfLines={1}>
                            {info?.nombres} {info?.apellidos}
                        </Text>
                        <View style={styles.metaRow}>
                            <Text style={[styles.meta, { color: textColor }]}>{info?.edad} años</Text>
                            <Text style={styles.dot}>-</Text>
                            <Text style={[styles.meta, { color: textColor }]}>{info?.cinturon}</Text>
                            <Text style={styles.dot}>-</Text>
                            <Text style={[styles.meta, { color: textColor }]}>{info?.name_club}</Text>
                        </View>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color="#ccc" />
                </Pressable>
            </ReanimatedSwipeable>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    swipeableContainer: {
        borderRadius: 16,
        overflow: 'hidden',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        borderRadius: 16,
        borderWidth: 1,
        height: 85,
    },
    genderIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 5,
    },
    avatar: {
        width: 54,
        height: 54,
        borderRadius: 27,
    },
    info: {
        flex: 1,
        marginLeft: 15,
    },
    name: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    meta: {
        fontSize: 14,
        opacity: 0.6,
    },
    dot: {
        marginHorizontal: 2,
        opacity: 0.3,
        color: '#fff'
    },
    // Estilos de Acciones
    rightActionContainer: {
        width: 90,
        flexDirection: 'row',
    },
    leftActionContainer: {
        width: 100,
        flexDirection: 'row',
    },
    deleteButton: {
        backgroundColor: '#FF3B30',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
    editButton: {
        backgroundColor: '#34C759',
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: '100%',
    },
    actionText: {
        color: 'white',
        fontSize: 11,
        fontWeight: 'bold',
        marginTop: 4,
    },
});
