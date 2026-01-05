import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { cinturonType } from '../constants/typesdata';

type UserCardProps = {
    info?: cinturonType;
    onPress?: () => void;
    onEdit?: (info: any) => void;
    onDelete?: (info: { id: any, estado: number }) => void;
    onInactivate?: (info: { id: any, estado: number }) => void;
    lightColor?: string;
    darkColor?: string;
};

const DEFAULT_AVATAR =
    'https://cdn-icons-png.flaticon.com/512/149/149082.png';

export function CinturonCard({
    info,
    onPress,
    onEdit,
    onDelete,
    onInactivate,
}: UserCardProps) {

    const backgroundColor = useThemeColor(
        { light: '#a8a8a86c', dark: '#9c9c9c33' },
        'background'
    );

    const textColor = useThemeColor(
        { light: '#111111', dark: '#ffffff' },
        'text'
    );

    const borderColor = useThemeColor(
        { light: '#ddd', dark: '#333' },
        'border'
    );
    const genderColor = (estado:any)=>{
        if (estado === 2) {
            return '#71bb46bb'
        } else {
            return '#9bc0bbff'
        }
    }
    const genestadoColor = (estado: any) => {
        if (estado === 1) {
            return '#33a557ff'
        } else if (estado === 2) {
            return '#8c41e1ff'
        } else if(estado ===3){
            return '#e15441ff'
        } else {
            return '#9bc0bbff'
        }
    }
    const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
        const styleAnimation = useAnimatedStyle(() => ({
            transform: [{ translateX: interpolate(drag.value, [-160, 0], [0, 160]) }],
            opacity: interpolate(prog.value, [0, 1], [0, 1]),
        }));

        return (
            <Reanimated.View style={[styles.rightActionContainer, styleAnimation]}>
                <RectButton
                    style={[styles.actionButton, { backgroundColor: `${genderColor(info?.estado)}` }]} // Color naranja/amarillo
                    onPress={() => onInactivate?.({ id: info?.idcinturon, estado: info?.estado === 1 ? 2 : 1 })}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="pause-circle-outline" size={24} color="white" />
                        <Text style={styles.actionText}>{info?.estado === 1 ? 'Inactivar' : 'Activar'}</Text>
                    </View>
                </RectButton>

                {/* Botón Eliminar */}
                <RectButton
                    style={[styles.actionButton, { backgroundColor: '#FF3B30' }]} // Color rojo
                    onPress={() => onDelete?.({ id: info?.idcinturon.toString(), estado: 3 })}
                >
                    <View style={styles.buttonContent}>
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
                        {
                            backgroundColor, borderColor, opacity: pressed ? 0.5 : 1,
                            borderBottomColor: genestadoColor(info?.estado), borderLeftColor: genestadoColor(info?.estado)
                        },
                    ]}
                >
                    <View style={[styles.genderIndicator, { backgroundColor: genestadoColor(info?.estado) }]} />
                    <Image
                        source={{ uri: DEFAULT_AVATAR }}
                        style={[styles.avatar, { borderColor: genestadoColor(info?.estado), borderWidth: 1 }]}
                    />

                    <View style={styles.info}>
                        <View style={[styles.clubBadge, { backgroundColor: `${genestadoColor(info?.estado)}` }]}>
                            <Text style={styles.estadoText}>
                                {info?.name_estado || '---?'}
                            </Text>
                        </View>

                        <Text style={[styles.name, { color: textColor }]}>
                            Cinturón: {info?.nombre}
                        </Text>
                        <Text style={[styles.meta, { color: textColor }]}>
                            Color: {info?.colores}
                        </Text>
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
    genderIndicator: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: 3,
    },
    card: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 0,
    },
    avatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginRight: 12,
    },
    info: {
        width: '70%',
    },
    name: {
        fontSize: 16,
        fontWeight: '700',
    },
    meta: {
        fontSize: 14,
        opacity: 0.8,
        marginTop: 2,
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
    rightActionContainer: {
        flexDirection: 'row', // Clave para ponerlos en línea
        width: 150, // Suma del ancho de ambos botones
        height: '100%',
    },
    actionButton: {
        flex: 1, // Cada botón ocupa la mitad (80px si el total es 160)
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContent: {
        alignItems: 'center',
    },
    clubBadge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    estadoText: {
        fontSize: 11,
        color: '#214950ff',
        fontWeight: 'bold',
    }
});
