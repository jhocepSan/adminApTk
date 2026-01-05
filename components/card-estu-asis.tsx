import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import ReanimatedSwipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Reanimated, { interpolate, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { estuAsisType } from '../constants/typesdata';

type AsisCardProps = {
    info?: estuAsisType;
    onPress?: () => void;
    onEdit?: (info: any) => void;
    onPermiso?: (info: { id: any, estado: number }) => void;
    onInactivate?: (info: { id: any, estado: number }) => void;
    disableSwipe?: boolean;
    lightColor?: string;
    darkColor?: string;
};

const DEFAULT_AVATAR =
    'https://cdn-icons-png.flaticon.com/512/149/149071.png';

export function EstCardAsis({
    info,
    onPress,
    onEdit,
    onPermiso,
    onInactivate,
    disableSwipe = false,
}: AsisCardProps) {

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
    const genderColor = info?.genero === 'F' ? '#FF69B4' : '#4169E1';
    const RightAction = (prog: SharedValue<number>, drag: SharedValue<number>) => {
        const styleAnimation = useAnimatedStyle(() => ({
            transform: [{ translateX: interpolate(drag.value, [-160, 0], [0, 160]) }],
            opacity: interpolate(prog.value, [0, 1], [0, 1]),
        }));

        return (
            <Reanimated.View style={[styles.rightActionContainer, styleAnimation]}>
                <RectButton
                    style={[styles.actionButton, { backgroundColor: `${info?.presente === 1 ? '#ff3c00ff' : '#64962ab2'}` }]} // Color naranja/amarillo
                    onPress={() => onInactivate?.({ id: info?.idasistencia, estado: info?.presente === 1 ? 2 : 1 })}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="pause-circle-outline" size={24} color="white" />
                        <Text style={styles.actionText}>{info?.presente === 1 ? 'Faltó' : 'Presente'}</Text>
                    </View>
                </RectButton>

                {/* Botón Eliminar */}
                <RectButton
                    style={[styles.actionButton, { backgroundColor: '#20d2ff93' }]} // Color rojo
                    onPress={() => onPermiso?.({ id: info?.idasistencia, estado: 4 })}
                >
                    <View style={styles.buttonContent}>
                        <Ionicons name="fitness" size={24} color="white" />
                        <Text style={styles.actionText}>Permiso</Text>
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
    const getColorAsiste =()=>{
        let valor= info?.presente;
        if(valor===1){
            return '#72ff2093'
        }else if(valor===2){
            return '#ff2020ff'
        }else if(valor===3){
            return '#20d2ff93'
        }else{
            return '#da20ff71'
        }
    }
    return (
        <GestureHandlerRootView style={styles.container}>
            <ReanimatedSwipeable
                friction={2}
                enableTrackpadTwoFingerGesture
                rightThreshold={40}
                leftThreshold={40}
                renderRightActions={disableSwipe ? undefined : RightAction}
                renderLeftActions={disableSwipe ? undefined : LeftAction}
                containerStyle={styles.swipeableContainer}
            >
                <Pressable
                    onPress={onPress}
                    style={({ pressed }) => [
                        styles.card,
                        {
                            backgroundColor, borderColor, opacity: pressed ? 0.5 : 1,
                            borderBottomColor: genderColor, borderLeftColor: genderColor
                        },
                    ]}
                >
                    <View style={[styles.genderIndicator, { backgroundColor: genderColor }]} />
                    <Image
                        source={{ uri: info?.imagen || DEFAULT_AVATAR }}
                        style={[styles.avatar, { borderColor: genderColor, borderWidth: 1 }]}
                    />

                    <View style={styles.info}>
                        <Text
                            style={[styles.name, { color: textColor }]}
                            numberOfLines={1}
                        >
                            {info?.nombres} {info?.apellidos}
                        </Text>
                        <View style={styles.metaRow}>
                            <View style={styles.textContainer}>
                                <Text style={[styles.meta, { color: textColor }]}>
                                    Edad: {info?.edad}  Estado: {info?.name_estado}
                                </Text>
                                <Text style={[styles.meta, { color: textColor }]}>
                                    Celular: {info?.celular}
                                </Text>
                            </View>
                            <View style={[styles.clubBadge, { backgroundColor: getColorAsiste() }]}>
                                <Text style={styles.estadoText} numberOfLines={1}>
                                    {info?.estado_presente}
                                </Text>
                            </View>
                        </View>
                        <Text style={[styles.meta, { color: textColor }]}>
                            Grado: {info?.name_cinturon} ({info?.colores})
                        </Text>
                    </View>
                    {!disableSwipe && <Ionicons name="chevron-forward" size={18} color="#ccc" />}
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
        flex: 1, // Cambiado de width: 100% a flex: 1 para que respete el contenedor
        marginRight: 10,
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
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between', // Separa el texto del badge
        gap: 8,
        marginTop: 2,
    },
    textContainer: {
        flex: 1, // Esto permite que el texto ocupe el espacio sobrante
    },
    clubBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
        minWidth: 70, // Usa minWidth en lugar de width % para evitar deformación
        alignItems: 'center',
    },
    estadoText: {
        fontSize: 13,
        color: '#ccccccff',
        fontWeight: 'bold',
    }
});
